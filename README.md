# MongoDB Development Platform Plugin

A comprehensive MongoDB development platform plugin for Kubespin IDE, featuring a multi-container architecture with database, API, standalone webapp, and IDE integration.

## Architecture Overview

This plugin implements a 4-part architecture:

1. **Database Container** - MongoDB 6.0 instance
2. **API Container** - Node.js Express API server
3. **Webapp Container** - Angular standalone web application
4. **Kubespin UI Container** - React components for IDE integration with no pre-build required

## Container Structure

```
plugins/mongo-ide-session/
├── database/
│   ├── Dockerfile          # MongoDB container
│   └── README.md
├── api/
│   ├── Dockerfile          # Node.js API container
│   ├── package.json
│   └── src/
├── webapp/
│   ├── Dockerfile          # Angular webapp container
│   ├── package.json
│   ├── angular.json
│   └── src/
├── kubespin-ui/
│   ├── Dockerfile          # React UI components container
│   ├── package.json
│   ├── webpack.config.cjs
│   ├── widgets/            # Homescreen widgets
│   ├── pages/              # IDE page components
│   ├── sidebar/            # Sidebar components
│   └── entries/            # Component entry points
└── plugin.json            # Multi-container plugin configuration
```

## Features

### 1. Kubespin IDE Integration
- **Sidebar components** - Navigation and quick actions
- **Page views** - Full-screen MongoDB management interface
- **Homescreen widgets** - 4 dashboard widgets with grid system support:
  - MongoDB Connection Status (2x1)
  - Database Quick Stats (2x1)
  - Recent Activity (3x2)
  - Quick Actions (2x2)
- **No pre-build required** - Components build automatically at deployment

### 2. Standalone Web Application
- **Full-featured MongoDB admin interface**
- **Query runner** - Execute MongoDB commands
- **Collection manager** - Browse and manage collections
- **Database dashboard** - Overview of database statistics

### 3. API Layer
- **RESTful API** - Consistent interface for both IDE and webapp
- **MongoDB operations** - Execute queries, manage collections
- **Statistics endpoint** - Database metrics and health

### 4. Database Layer
- **MongoDB 6.0** - Latest stable MongoDB version
- **Persistent storage** - Data persistence across container restarts
- **Health monitoring** - Built-in health checks

## Deployment

### Multi-Container Pod Architecture
All containers run in a single Kubernetes pod:
- **Shared network** - Containers communicate via localhost
- **Shared storage** - Database and API share persistent volumes
- **Coordinated lifecycle** - All containers deployed together

### URLs
- **Standalone App**: `http://mongodb-dev-platform.plugin.platform.local/`
- **API**: `http://mongodb-dev-platform.plugin.platform.local/api`
- **IDE Integration**: Loaded directly into Kubespin IDE

## Configuration

### Environment Variables
- `MONGO_INITDB_ROOT_USERNAME` - MongoDB root username (default: mongoroot)
- `MONGO_INITDB_ROOT_PASSWORD` - MongoDB root password (default: rootpassword)
- `MONGO_IDE_API_PORT` - API server port (default: 3001)
- `WEBAPP_PORT` - Webapp port (default: 4200)

### Container Ports
- **Database**: 27017
- **API**: 3001
- **Webapp**: 4200
- **Kubespin UI**: 80

## Development

### Building Individual Containers
```bash
# Database container
docker build -t mongodb-dev-platform-db:1.0.0 ./database/

# API container
docker build -t mongodb-dev-platform-api:1.0.0 ./api/

# Webapp container
docker build -t mongodb-dev-platform-webapp:1.0.0 ./webapp/

# Kubespin UI container
docker build -t mongodb-dev-platform-ui:1.0.0 ./kubespin-ui/
```

### Plugin Submission
The plugin uses the standard Kubespin plugin submission process:
1. Create ZIP file of the plugin directory
2. Submit via `/api/plugins/submit` endpoint
3. Kaniko builds all container images in parallel
4. Kubernetes deploys multi-container pod

**No Pre-Build Required**: The kubespin-ui components build automatically during container deployment, eliminating the need for pre-building before plugin submission.

## Benefits

### 1. Separation of Concerns
- Each container has a single responsibility
- Independent scaling and resource management
- Easier debugging and maintenance

### 2. Technology Flexibility
- Database: MongoDB (could be swapped for different versions)
- API: Node.js/Express (could be replaced with different frameworks)
- Webapp: Angular (could be React, Vue, etc.)
- UI: React (required for IDE integration)

### 3. Deployment Simplicity
- Single pod deployment
- Shared resources and networking
- Coordinated lifecycle management

### 4. Development Experience
- Framework-specific tooling for each component
- Hot reloading and development servers
- Clear separation of frontend and backend

## Plugin Schema Version 2.0

This plugin uses the new multi-container schema:

```json
{
  "schemaVersion": "2.0",
  "containers": {
    "database": { "dockerfile": "./database/Dockerfile" },
    "api": { "dockerfile": "./api/Dockerfile" },
    "webapp": { "dockerfile": "./webapp/Dockerfile" },
    "kubespin-ui": { "dockerfile": "./kubespin-ui/Dockerfile" }
  }
}
```

## Future Enhancements

1. **Advanced MongoDB Features**
   - Index management
   - Replica set configuration
   - Sharding support

2. **Enhanced UI**
   - Real-time query execution
   - Visual query builder
   - Schema visualization

3. **Security**
   - Authentication integration
   - Role-based access control
   - SSL/TLS support

4. **Monitoring**
   - Performance metrics
   - Query profiling
   - Resource usage tracking
