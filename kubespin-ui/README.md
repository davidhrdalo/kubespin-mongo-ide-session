# MongoDB IDE Session UI

This directory contains the UI components for the MongoDB IDE session plugin, built with **Vite** for fast development and optimized builds.

## Architecture

The UI components are organized into different types and built as **static ES modules** that can be loaded directly by the Kubespin IDE.

### 📁 Structure
```
kubespin-ui/
├── widgets/          # Homescreen widgets
├── pages/            # IDE page components  
├── sidebar/          # Sidebar components
├── entries/          # Component entry points
├── vite.config.js    # Vite configuration
├── package.json      # Dependencies
└── Dockerfile        # Container build
```

### 🔧 Components

#### Pages
- **QueryRunnerPage** - Execute MongoDB queries with syntax highlighting and history
- **CollectionManagerPage** - Manage collections and documents with search/filter
- **DatabaseDashboardPage** - Overview dashboard with stats and connection info

#### Widgets
- **ConnectionStatusWidget** - Shows MongoDB connection status (2×1)
- **QuickStatsWidget** - Database/collection/document counts (2×1)
- **RecentActivityWidget** - Recent operations with timestamps (3×2)
- **QuickActionsWidget** - Common MongoDB operations (2×2)

#### Sidebar
- **MongoSessionPageSidebar** - Navigation and quick actions for IDE sidebar

## Development

### Build System
Uses **Vite** to build individual component bundles as **ES modules**:

```bash
# Development server
npm run dev

# Production build - creates dist/ with individual component files
npm run build

# Preview build
npm run preview
```

### 🚀 Key Features

- **Fast Development**: Vite HMR for instant updates
- **Individual Bundles**: Each component built as separate ES module
- **TypeScript Support**: Built-in via Vite
- **Modern React**: Latest React features with hooks
- **CSS Modules**: Scoped styling for components
- **Simple Deployment**: No complex federation setup

### Static Asset Generation

Components are built as individual ES modules:

```javascript
// vite.config.js
build: {
  lib: {
    entry: {
      'page-view': './entries/page-view.js',
      'sidebar': './entries/sidebar.js',
      'connection-status': './entries/connection-status.js',
      // ... other components
    },
    formats: ['es'],
    fileName: (format, entryName) => `${entryName}.js`
  }
}
```

**Build Output:**
```
dist/
├── page-view.js           # Main page component
├── sidebar.js             # Sidebar component
├── connection-status.js   # Widget component
├── quick-stats.js         # Widget component
├── query-runner.js        # Page component
└── assets/               # CSS and other assets
```

## Integration

### Plugin Configuration
The `plugin.json` defines how components are loaded:

```json
{
  "ui": {
    "type": "static_assets",
    "sourceContainer": "kubespin-ui",
    "components": {
      "sidebar": "/sidebar.js",
      "pageView": "/page-view.js"
    },
    "pages": [
      {
        "id": "query-runner",
        "name": "Query Runner",
        "component": "/query-runner.js",
        "route": "/query-runner",
        "icon": "🔍"
      }
    ],
    "homeWidgets": [
      {
        "id": "mongo-connection-status",
        "name": "MongoDB Connection Status",
        "component": "/connection-status.js",
        "size": { "width": 2, "height": 1 }
      }
    ]
  }
}
```

### IDE Loading Process
The Kubespin IDE loads components as ES modules:

```javascript
// Inside Kubespin IDE
const loadPluginComponent = async (pluginId, componentPath) => {
  // Load the ES module from the plugin's UI service
  const module = await import(`http://${pluginId}-ui-service${componentPath}`);
  const Component = module.default;
  
  return (props) => (
    <Component 
      {...props}
      pluginApi={{
        call: (method, params) => callPluginAPI(pluginId, method, params),
        navigate: (path) => navigateToPage(pluginId, path),
        session: currentSession
      }}
    />
  );
};

// Example: Load the connection status widget
const ConnectionStatusWidget = await loadPluginComponent(
  'mongodb-dev-platform', 
  '/connection-status.js'
);
```

### API Integration
Components use the `pluginApi` prop for backend communication:

```javascript
// Execute MongoDB command
const response = await pluginApi.call('executeMongoCommand', { 
  command: 'db.collection.find({})' 
});

// Navigate to other pages
pluginApi.navigate?.('/query-runner');
```

## Deployment

### Container Build
The Dockerfile uses multi-stage build:

1. **Build Stage**: Install dependencies and build with Vite
2. **Serve Stage**: Serve static files with nginx

```dockerfile
# Build with Vite
RUN npm run build

# Serve with nginx
COPY --from=0 /app/dist /usr/share/nginx/html
```

### Component URLs
After deployment, components are available at:

```
http://mongodb-dev-platform-kubespin-ui-service/page-view.js
http://mongodb-dev-platform-kubespin-ui-service/sidebar.js
http://mongodb-dev-platform-kubespin-ui-service/connection-status.js
http://mongodb-dev-platform-kubespin-ui-service/quick-stats.js
```

### Environment Variables
- `API_URL`: Backend API endpoint
- `NODE_ENV`: Build environment

## Testing

### Component Testing
```bash
# Run tests
npm test

# Watch mode
npm run test:watch
```

### Manual Testing
1. Build the container: `docker build -t mongo-ui .`
2. Run locally: `docker run -p 80:80 mongo-ui`
3. Test component loading: `http://localhost/page-view.js`

## Troubleshooting

### Common Issues

1. **Component Loading Errors**
   - Check that build output exists in dist/
   - Verify nginx is serving files correctly
   - Ensure component exports are default exports

2. **Build Failures**
   - Ensure all dependencies are installed
   - Check Vite configuration syntax
   - Verify entry point paths are correct

3. **Runtime Errors**
   - Verify API endpoints are accessible
   - Check component props and state management
   - Ensure React dependencies are available globally

### Development Tips

- Use browser dev tools network tab to verify component loading
- Check console for import/export errors
- Use React DevTools for component debugging
- Test individual component URLs directly

This UI system provides a **simple, efficient way** to create and integrate MongoDB IDE components with the Kubespin platform without complex federation setup. 