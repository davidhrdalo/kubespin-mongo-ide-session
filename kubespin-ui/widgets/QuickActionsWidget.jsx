import React from 'react';
import styles from './QuickActionsWidget.module.css';

const QuickActionsWidget = ({
  pluginApi,
  widgetSize = { width: 2, height: 2 }
}) => {
  const actions = [
    {
      id: 'new-collection',
      title: 'New Collection',
      description: 'Create a new collection',
      icon: '📁',
      color: '#007bff',
      action: () => handleAction('createCollection')
    },
    {
      id: 'run-query',
      title: 'Run Query',
      description: 'Execute a MongoDB query',
      icon: '🔍',
      color: '#28a745',
      action: () => handleAction('openQueryRunner')
    },
    {
      id: 'import-data',
      title: 'Import Data',
      description: 'Import documents from file',
      icon: '📤',
      color: '#ffc107',
      action: () => handleAction('importData')
    },
    {
      id: 'export-data',
      title: 'Export Data',
      description: 'Export collection data',
      icon: '📥',
      color: '#6f42c1',
      action: () => handleAction('exportData')
    },
    {
      id: 'manage-indexes',
      title: 'Manage Indexes',
      description: 'View and create indexes',
      icon: '📊',
      color: '#fd7e14',
      action: () => handleAction('manageIndexes')
    },
    {
      id: 'view-logs',
      title: 'View Logs',
      description: 'Check MongoDB logs',
      icon: '📋',
      color: '#6c757d',
      action: () => handleAction('viewLogs')
    }
  ];

  const handleAction = async (actionType) => {
    try {
      switch (actionType) {
        case 'createCollection':
          // In a real implementation, this would open a modal or navigate to collection creation
          console.log('Creating new collection...');
          if (pluginApi?.navigate) {
            pluginApi.navigate('/collections?action=create');
          }
          break;
          
        case 'openQueryRunner':
          console.log('Opening query runner...');
          if (pluginApi?.navigate) {
            pluginApi.navigate('/query');
          }
          break;
          
        case 'importData':
          console.log('Opening import dialog...');
          // This would trigger a file upload dialog
          break;
          
        case 'exportData':
          console.log('Opening export dialog...');
          // This would trigger an export configuration dialog
          break;
          
        case 'manageIndexes':
          console.log('Opening index management...');
          if (pluginApi?.navigate) {
            pluginApi.navigate('/indexes');
          }
          break;
          
        case 'viewLogs':
          console.log('Opening logs viewer...');
          if (pluginApi?.navigate) {
            pluginApi.navigate('/logs');
          }
          break;
          
        default:
          console.log('Unknown action:', actionType);
      }
    } catch (error) {
      console.error('Error executing action:', error);
    }
  };

  return (
    <div 
      className={styles.widget}
      style={{
        '--widget-width': widgetSize.width,
        '--widget-height': widgetSize.height
      }}
    >
      <div className={styles.header}>
        <h3 className={styles.title}>Quick Actions</h3>
      </div>
      
      <div className={styles.actionsGrid}>
        {actions.map(action => (
          <button
            key={action.id}
            className={styles.actionButton}
            onClick={action.action}
            title={action.description}
          >
            <div 
              className={styles.actionIcon}
              style={{ backgroundColor: action.color }}
            >
              <span className={styles.icon}>{action.icon}</span>
            </div>
            <div className={styles.actionContent}>
              <div className={styles.actionTitle}>{action.title}</div>
              <div className={styles.actionDescription}>{action.description}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActionsWidget; 