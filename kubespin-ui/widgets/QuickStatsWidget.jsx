import React, { useState, useEffect } from 'react';
import styles from './QuickStatsWidget.module.css';

const QuickStatsWidget = ({
  pluginApi,
  widgetSize = { width: 2, height: 1 }
}) => {
  const [stats, setStats] = useState({
    databases: 0,
    collections: 0,
    documents: 0,
    dataSize: '0 MB'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch stats from the plugin API
        const response = await pluginApi.call('getDatabaseStats');
        
        if (response.success) {
          setStats({
            databases: response.data.databases || 1,
            collections: response.data.collections || 0,
            documents: response.data.documents || 0,
            dataSize: response.data.dataSize || '0 MB'
          });
        } else {
          setError('Unable to fetch stats');
        }
      } catch (err) {
        setError('Failed to load database statistics');
        console.error('Failed to fetch MongoDB stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    
    // Refresh stats every 60 seconds
    const interval = setInterval(fetchStats, 60000);
    
    return () => clearInterval(interval);
  }, [pluginApi]);

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
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
          <h3 className={styles.title}>Database Stats</h3>
        </div>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <span>Loading stats...</span>
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
          <h3 className={styles.title}>Database Stats</h3>
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
        <h3 className={styles.title}>Database Stats</h3>
      </div>
      
      <div className={styles.statsGrid}>
        <div className={styles.statItem}>
          <div className={styles.statValue}>{stats.databases}</div>
          <div className={styles.statLabel}>Databases</div>
        </div>
        
        <div className={styles.statItem}>
          <div className={styles.statValue}>{stats.collections}</div>
          <div className={styles.statLabel}>Collections</div>
        </div>
        
        <div className={styles.statItem}>
          <div className={styles.statValue}>{formatNumber(stats.documents)}</div>
          <div className={styles.statLabel}>Documents</div>
        </div>
        
        <div className={styles.statItem}>
          <div className={styles.statValue}>{stats.dataSize}</div>
          <div className={styles.statLabel}>Data Size</div>
        </div>
      </div>
    </div>
  );
};

export default QuickStatsWidget; 