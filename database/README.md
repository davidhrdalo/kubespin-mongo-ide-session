# MongoDB Database Container

This container provides the **actual MongoDB database** for the plugin.

## What it is
- **MongoDB 6.0** - Official MongoDB database engine
- **Persistent storage** for all plugin data
- **Production-ready** database configuration

## Purpose
- **Data Storage**: Stores all collections, documents, and indexes
- **Query Processing**: Handles all MongoDB operations from the API
- **Connection Management**: Accepts connections from other containers
- **Data Persistence**: Maintains data across container restarts

## Configuration
- **Port**: 27017 (standard MongoDB port)
- **Authentication**: Root user with configurable credentials
- **Storage**: Uses persistent volumes for data retention
- **Network**: Accessible by other containers in the pod

## Environment Variables
- `MONGO_INITDB_ROOT_USERNAME`: Database admin username (default: mongoroot)
- `MONGO_INITDB_ROOT_PASSWORD`: Database admin password (default: rootpassword)

## Usage
The database automatically starts when the plugin is deployed and is accessible by:
- **API Container**: For executing MongoDB operations
- **Webapp Container**: Via API proxy for database management
- **IDE Components**: Via API calls for real-time data

## Data Persistence
Data is stored in `/data/db` and persists across container restarts when proper volumes are configured in the plugin deployment.

This is the **real MongoDB database** - not a mock or simulation! 