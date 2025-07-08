// mongo-ide-session/api/server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan'); // Optional logger
const mongoCommandsRouter = require('./routes/mongoCommands');

const app = express();

// --- Configuration ---
// The port is passed by the entrypoint.sh script via command line argument or defaults.
// We can grab it from process.argv or rely on an ENV var set by entrypoint.sh
const PORT = process.env.MONGO_IDE_API_PORT || 
             (process.argv.find(arg => arg.startsWith('--port='))?.split('=')[1]) || 
             3001;

const MONGO_SESSION_INTERNAL_HOST = 'localhost'; // MongoDB is running in the same container
const MONGO_SESSION_INTERNAL_PORT = process.env.MONGO_PORT || 27017; // Get from ENV set by Dockerfile/entrypoint

// --- Middleware ---
app.use(cors()); // Enable CORS for all routes, might want to restrict in production
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('tiny')); // HTTP request logging
}

// --- Static Asset Serving ---
// Serve the built UI bundles and other static assets
// These paths are relative to where this server.js is run from within the container (/opt/platform-ide/api)
const uiDistPath = path.join(__dirname, '..', 'ui_dist'); // Path to ../ui_dist
const manifestPath = path.join(__dirname, '..', 'manifest.json'); // Path to ../manifest.json

console.log(`[MongoIDE-API] Serving static UI assets from: ${uiDistPath}`);
console.log(`[MongoIDE-API] Serving manifest from: ${manifestPath}`);

// Serve UI bundles (e.g., mongoSessionPage.umd.js) from /platform-ide-assets/ui/
app.use('/platform-ide-assets/ui', express.static(uiDistPath));

// Serve other assets like icons from /platform-ide-assets/
// Example: if you have /opt/platform-ide/ui_dist/mongodb-logo.svg
// and manifest refers to /platform-ide-assets/mongodb-logo.svg
// This assumes your icon is in the ui_dist folder after build.
// If it's elsewhere, adjust the path. For simplicity, let's assume it's copied to ui_dist.
app.use('/platform-ide-assets', express.static(uiDistPath)); // General assets from ui_dist

// Serve the manifest itself (optional, orchestrator might copy it out)
app.get('/platform-ide-manifest.json', (req, res) => {
  res.sendFile(manifestPath);
});


// --- API Routes ---
// All API routes for this session type will be under /platform-ide-api (defined in manifest)
const apiBasePath = '/platform-ide-api'; // Matches manifest.api.basePath
app.use(apiBasePath, mongoCommandsRouter); // Mounts routes from mongoCommands.js

// --- Health Check for this internal API server ---
app.get(`${apiBasePath}/health`, (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'MongoDB IDE Session API is running.',
    timestamp: new Date().toISOString(),
    mongoDbConnection: `mongodb://${MONGO_SESSION_INTERNAL_HOST}:${MONGO_SESSION_INTERNAL_PORT}`
  });
});

// --- Catch-all for 404s within this API server ---
app.use((req, res, next) => {
  res.status(404).json({ message: `Resource not found on this MongoDB IDE Session API server: ${req.originalUrl}` });
});

// --- Global Error Handler for this API server ---
app.use((err, req, res, next) => {
  console.error("[MongoIDE-API] Unhandled Error:", err.stack);
  res.status(500).json({ message: 'Internal Server Error in MongoDB IDE Session API', error: err.message });
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`[MongoIDE-API] Internal API server started successfully.`);
  console.log(`[MongoIDE-API] Listening on port ${PORT}`);
  console.log(`[MongoIDE-API] MongoDB expected at: mongodb://${MONGO_SESSION_INTERNAL_HOST}:${MONGO_SESSION_INTERNAL_PORT}`);
  console.log(`[MongoIDE-API] Serving UI bundles from /platform-ide-assets/ui/`);
  console.log(`[MongoIDE-API] API base path: ${apiBasePath}`);
});

module.exports = app; // For potential testing
