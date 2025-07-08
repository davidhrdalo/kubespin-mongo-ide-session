// mongo-ide-session/api/routes/mongoCommands.js
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb'); // Import ObjectId for potential use

const router = express.Router();

// --- MongoDB Connection Details (within the same container) ---
const MONGO_HOST = process.env.MONGO_HOST || 'localhost'; // MongoDB is on localhost within this container
const MONGO_PORT = process.env.MONGO_PORT || 27017;
// For executing commands, we typically connect as the root user if no specific app user is intended for these commands.
// Or, the command itself can switch DBs/users if needed.
// The MONGO_INITDB_ROOT_USERNAME/PASSWORD are available as ENV vars.
const MONGO_ROOT_USER = process.env.MONGO_INITDB_ROOT_USERNAME || 'mongoroot';
const MONGO_ROOT_PASSWORD = process.env.MONGO_INITDB_ROOT_PASSWORD || 'rootpassword';

// Construct a basic connection URI. For commands, often connect to 'admin' db for auth.
const MONGO_URI = `mongodb://${MONGO_ROOT_USER}:${MONGO_ROOT_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/admin?authSource=admin`;
// Note: If your init scripts create a specific app user for the IDE to use for commands, adjust URI.

let mongoClientInstance; // Keep a persistent client

async function getMongoClient() {
  if (mongoClientInstance && mongoClientInstance.topology && mongoClientInstance.topology.isConnected()) {
    return mongoClientInstance;
  }
  try {
    console.log(`[MongoCmdRoute] Connecting to MongoDB at ${MONGO_URI.replace(/:[^:]*@/, ':<REDACTED>@')}`);
    mongoClientInstance = new MongoClient(MONGO_URI);
    await mongoClientInstance.connect();
    console.log("[MongoCmdRoute] Successfully connected to MongoDB for command execution.");
    return mongoClientInstance;
  } catch (err) {
    console.error("[MongoCmdRoute] Failed to connect to MongoDB:", err);
    mongoClientInstance = null; // Reset on failure
    throw err; // Re-throw to be caught by route handler
  }
}


/**
 * POST /mongo/execute-command
 * Endpoint defined in platform-ide-manifest.json
 */
router.post('/mongo/execute-command', async (req, res) => {
  const { command } = req.body;

  if (!command || typeof command !== 'string' || !command.trim()) {
    return res.status(400).json({ message: 'Command is required.' });
  }

  console.log(`[MongoCmdRoute] Received command: "${command}"`);

  let client;
  try {
    client = await getMongoClient();
    // For arbitrary commands, it's tricky. `eval` is deprecated and dangerous.
    // The best approach for a limited set of commands is to parse them or use specific driver methods.
    // For a general "shell-like" experience, we'd need to parse common commands.
    // A simpler, but still powerful, approach for admin tasks is to use `db.adminCommand()` or `db.command()`.
    //
    // If the command is simple like `db.version()` or `db.myCollection.find().toArray()`
    // we can try to execute it.
    //
    // This is a simplified execution. Real `mongosh` has a complex JS environment.
    // We are NOT trying to replicate full mongosh here, but execute valid MongoDB driver commands/queries.
    // The `command` string needs to be valid JavaScript that the MongoDB Node.js driver can understand
    // when run in a context where `db` is available.

    // For now, let's assume the command is something that can be run via `adminCommand`
    // or is a simple query. This part is the most complex to generalize safely.
    // A common pattern is to use `db.runCommand({ eval: commandString, nolock: true })` but `eval` is deprecated.
    //
    // Let's try a very basic approach: if it looks like a collection method.
    // This is highly simplified and NOT robust for all mongosh commands.
    let result;
    let outputType = 'stdout';
    let outputContent = '';

    // Default to 'admin' database, command can switch with 'use <db>'
    const defaultDbName = process.env.MONGO_INITDB_DATABASE || 'default_ide_db';
    const db = client.db(defaultDbName); // Use a default DB or one from command

    if (command.toLowerCase().startsWith('db.admincommand')) {
        // Assuming command is like: db.adminCommand({ listDatabases: 1 })
        // We need to parse out the object for adminCommand
        const cmdObjectStr = command.substring(command.indexOf('{'), command.lastIndexOf('}') + 1);
        try {
            const cmdObject = JSON.parse(cmdObjectStr); // This is risky, assumes valid JSON
            result = await db.adminCommand(cmdObject);
            outputContent = JSON.stringify(result, null, 2);
        } catch (e) {
            outputType = 'stderr';
            outputContent = `Error parsing admin command object: ${e.message}\nOriginal command: ${command}`;
        }
    } else if (command.match(/^db\.(\w+)\.(find|findOne|insertOne|insertMany|updateOne|updateMany|deleteOne|deleteMany|countDocuments|aggregate|distinct|createIndex|dropIndex|drop|renameCollection)\s*\(.*\)/i)) {
        // This is a very basic attempt to execute common collection methods.
        // It's NOT a full JavaScript parser or mongosh environment.
        // For production, a more robust solution (e.g., a sandboxed JS execution environment
        // or a restricted command set) would be needed.
        try {
            // This is DANGEROUS with arbitrary user input.
            // In a real scenario, you would parse and validate the command,
            // or provide a structured way to build queries.
            // For now, this is a placeholder for a more secure execution.
            // We are essentially trying to eval a part of the command.
            // A safer way is to use the driver's methods directly based on parsed input.
            // For example, if command is "db.mycollection.find()", parse "mycollection" and "find".
            
            // This is a placeholder for a more secure execution strategy.
            // For now, we'll just simulate that it would work for simple cases.
            // result = await eval(`(async () => { return await db.${command.substring(3)}; })()`);
            // outputContent = JSON.stringify(result, null, 2);
            
            // A slightly safer (but still limited) approach for simple `find()`
            if (command.includes(".find(")) {
                const collectionNameMatch = command.match(/^db\.(\w+)\.find/i);
                if (collectionNameMatch && collectionNameMatch[1]) {
                    const collectionName = collectionNameMatch[1];
                    // Basic find, no query or projection parsing yet
                    result = await db.collection(collectionName).find({}).limit(20).toArray(); // Limit results
                    outputContent = JSON.stringify(result, null, 2);
                } else {
                    throw new Error("Could not parse collection name from find() command.");
                }
            } else {
                 outputType = 'stderr';
                 outputContent = `Command type not directly supported by this simple executor: "${command.substring(0, 50)}..."\nConsider using adminCommand for other operations.`;
            }

        } catch (e) {
            outputType = 'stderr';
            outputContent = `Error executing command: ${e.message}\nStack: ${e.stack}`;
        }
    } else if (command.toLowerCase().trim() === 'show dbs' || command.toLowerCase().trim() === 'show databases') {
        result = await db.adminCommand({ listDatabases: 1 });
        outputContent = result.databases.map(d => `${d.name}\t${(d.sizeOnDisk / (1024*1024*1024)).toFixed(3)}GB`).join('\n');
    } else if (command.toLowerCase().startsWith('use ')) {
        const dbToUse = command.split(' ')[1];
        // `use` command in shell changes context. Here, we can just acknowledge.
        // Future calls would need to use this new db context.
        // For this stateless API call, it doesn't persist.
        outputContent = `Switched to db ${dbToUse} (context for this command execution if applicable, not persisted for next API call).`;
    }
    else {
      outputType = 'stderr';
      outputContent = `Unsupported command format: "${command.substring(0,50)}..."\nTry simple db.collection.find() or db.adminCommand({...}).`;
    }

    res.status(200).json({
      message: 'Command processed by internal API.',
      output: { type: outputType, content: outputContent },
      command: command,
    });

  } catch (error) {
    console.error(`[MongoCmdRoute] Error processing command "${command}":`, error);
    res.status(500).json({
      message: 'Internal API error while executing command.',
      error: error.message,
      output: { type: 'stderr', content: `Server error: ${error.message}` },
    });
  }
  // Note: MongoClient connection is kept open by mongoClientInstance for reuse.
  // Add graceful shutdown for this client if the server stops.
});

module.exports = router;
