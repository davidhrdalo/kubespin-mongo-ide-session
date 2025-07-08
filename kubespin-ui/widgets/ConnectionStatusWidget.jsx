import React, { useState, useEffect } from 'react';
import styles from './ConnectionStatusWidget.module.css';

const ConnectionStatusWidget = ({
  pluginApi,
  widgetSize = { width: 2, height: 1 }
}) => {
  const [connectionStatus, setConnectionStatus] = useState('checking');
  const [dbInfo, setDbInfo] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        setConnectionStatus('checking');
        
        // Use the plugin API to check MongoDB connection
        const response = await pluginApi.call('getDatabaseStats');
        
        if (response.success) {
          setConnectionStatus('connected');
          setDbInfo(response.data);
          setError(null);
        } else {
          setConnectionStatus('disconnected');
          setError(response.error || 'Connection failed');
        }
      } catch (err) {
        setConnectionStatus('disconnected');
        setError(err.message || 'Unable to connect to MongoDB');
        console.error('MongoDB connection check failed:', err);
      }
    };

    checkConnection();
    
    // Check connection every 30 seconds
    const interval = setInterval(checkConnection, 30000);
    
    return () => clearInterval(interval);
  }, [pluginApi]);

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return '#28a745';
      case 'disconnected': return '#dc3545';
      case 'checking': return '#ffc107';
      default: return '#6c757d';
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return 'Connected';
      case 'disconnected': return 'Disconnected';
      case 'checking': return 'Checking...';
      default: return 'Unknown';
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
        <h3 className={styles.title}>MongoDB Connection</h3>
        <div 
          className={styles.statusIndicator}
          style={{ backgroundColor: getStatusColor() }}
        />
      </div>
      
      <div className={styles.content}>
        <div className={styles.statusText}>
          Status: <span style={{ color: getStatusColor() }}>{getStatusText()}</span>
        </div>
        
        {connectionStatus === 'connected' && dbInfo && (
          <div className={styles.dbInfo}>
            <div className={styles.infoItem}>
              <span className={styles.label}>Version:</span>
              <span className={styles.value}>{dbInfo.version || 'MongoDB 6.0'}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Uptime:</span>
              <span className={styles.value}>{dbInfo.uptime || '0s'}</span>
            </div>
          </div>
        )}
        
        {connectionStatus === 'disconnected' && error && (
          <div className={styles.error}>
            <small>{error}</small>
          </div>
        )}
        
        {connectionStatus === 'checking' && (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConnectionStatusWidget; 