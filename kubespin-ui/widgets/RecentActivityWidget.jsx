import React, { useState, useEffect } from 'react';
import styles from './RecentActivityWidget.module.css';

const RecentActivityWidget = ({
  pluginApi,
  widgetSize = { width: 3, height: 2 }
}) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecentActivity = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // For now, we'll simulate recent activity since the API might not have this yet
        // In a real implementation, this would fetch from a logs endpoint
        const mockActivities = [
          {
            id: 1,
            type: 'query',
            operation: 'find',
            collection: 'users',
            timestamp: new Date(Date.now() - 5 * 60 * 1000),
            details: 'db.users.find({status: "active"})'
          },
          {
            id: 2,
            type: 'insert',
            operation: 'insertOne',
            collection: 'products',
            timestamp: new Date(Date.now() - 15 * 60 * 1000),
            details: 'Added new product document'
          },
          {
            id: 3,
            type: 'update',
            operation: 'updateMany',
            collection: 'orders',
            timestamp: new Date(Date.now() - 30 * 60 * 1000),
            details: 'Updated order status to shipped'
          },
          {
            id: 4,
            type: 'delete',
            operation: 'deleteOne',
            collection: 'temp_data',
            timestamp: new Date(Date.now() - 45 * 60 * 1000),
            details: 'Removed expired temp document'
          },
          {
            id: 5,
            type: 'index',
            operation: 'createIndex',
            collection: 'users',
            timestamp: new Date(Date.now() - 60 * 60 * 1000),
            details: 'Created index on email field'
          }
        ];
        
        setActivities(mockActivities);
      } catch (err) {
        setError('Failed to load recent activity');
        console.error('Failed to fetch recent activity:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentActivity();
    
    // Refresh activity every 30 seconds
    const interval = setInterval(fetchRecentActivity, 30000);
    
    return () => clearInterval(interval);
  }, [pluginApi]);

  const getOperationIcon = (type) => {
    switch (type) {
      case 'query': return '🔍';
      case 'insert': return '➕';
      case 'update': return '✏️';
      case 'delete': return '🗑️';
      case 'index': return '📊';
      default: return '📄';
    }
  };

  const getOperationColor = (type) => {
    switch (type) {
      case 'query': return '#007bff';
      case 'insert': return '#28a745';
      case 'update': return '#ffc107';
      case 'delete': return '#dc3545';
      case 'index': return '#6f42c1';
      default: return '#6c757d';
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return timestamp.toLocaleDateString();
  };

  if (loading) {
    return (
      <div 
        className={styles.widget}
        style={{
          '--widget-width': widgetSize.width,
          '--widget-height': widgetSize.height
        }}
      >
        <div className={styles.header}>
          <h3 className={styles.title}>Recent Activity</h3>
        </div>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <span>Loading activity...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className={styles.widget}
        style={{
          '--widget-width': widgetSize.width,
          '--widget-height': widgetSize.height
        }}
      >
        <div className={styles.header}>
          <h3 className={styles.title}>Recent Activity</h3>
        </div>
        <div className={styles.error}>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={styles.widget}
      style={{
        '--widget-width': widgetSize.width,
        '--widget-height': widgetSize.height
      }}
    >
      <div className={styles.header}>
        <h3 className={styles.title}>Recent Activity</h3>
        <span className={styles.count}>{activities.length} operations</span>
      </div>
      
      <div className={styles.activityList}>
        {activities.length > 0 ? (
          activities.map(activity => (
            <div key={activity.id} className={styles.activityItem}>
              <div className={styles.activityIcon}>
                <span 
                  className={styles.icon}
                  style={{ backgroundColor: getOperationColor(activity.type) }}
                >
                  {getOperationIcon(activity.type)}
                </span>
              </div>
              <div className={styles.activityContent}>
                <div className={styles.activityHeader}>
                  <span className={styles.operation}>{activity.operation}</span>
                  <span className={styles.collection}>{activity.collection}</span>
                </div>
                <div className={styles.activityDetails}>
                  {activity.details}
                </div>
                <div className={styles.activityTime}>
                  {formatTimestamp(activity.timestamp)}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.emptyState}>
            <span>No recent activity</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivityWidget; 