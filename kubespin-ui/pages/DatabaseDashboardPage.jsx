import React, { useState, useEffect } from 'react';
import styles from './DatabaseDashboardPage.module.css';

const DatabaseDashboardPage = ({ pluginApi }) => {
  const [stats, setStats] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('checking');
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch database stats
      const statsResponse = await pluginApi.call('getDatabaseStats');
      if (statsResponse.success) {
        setStats(statsResponse.data);
        setConnectionStatus('connected');
      } else {
        setConnectionStatus('disconnected');
        setError('Failed to fetch database stats');
      }

      // Fetch collections
      const collectionsResponse = await pluginApi.call('getCollections');
      if (collectionsResponse.success) {
        setCollections(collectionsResponse.data || []);
      }

    } catch (err) {
      setConnectionStatus('disconnected');
      setError('Failed to connect to database');
      console.error('Dashboard data fetch failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatUptime = (uptime) => {
    if (!uptime) return 'Unknown';
    const seconds = Math.floor(uptime);
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) return `${days}d ${hours}h ${mins}m`;
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  };

  const StatCard = ({ title, value, subtitle, icon, color = '#007bff' }) => (
    <div className={styles.statCard}>
      <div className={styles.statIcon} style={{ backgroundColor: color }}>
        {icon}
      </div>
      <div className={styles.statContent}>
        <div className={styles.statValue}>{value}</div>
        <div className={styles.statTitle}>{title}</div>
        {subtitle && <div className={styles.statSubtitle}>{subtitle}</div>}
      </div>
    </div>
  );

  const ConnectionIndicator = () => (
    <div className={`${styles.connectionStatus} ${styles[connectionStatus]}`}>
      <div className={styles.statusDot}></div>
      <span className={styles.statusText}>
        {connectionStatus === 'connected' ? 'Connected' : 
         connectionStatus === 'disconnected' ? 'Disconnected' : 'Checking...'}
      </span>
    </div>
  );

  if (loading && !stats) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Database Dashboard</h1>
          <ConnectionIndicator />
        </div>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <span>Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>Database Dashboard</h1>
          <p className={styles.subtitle}>MongoDB instance overview and statistics</p>
        </div>
        <div className={styles.headerRight}>
          <ConnectionIndicator />
          <button onClick={fetchDashboardData} className={styles.refreshButton}>
            ↻ Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className={styles.errorBanner}>
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className={styles.content}>
        <div className={styles.statsGrid}>
          <StatCard
            title="Database Size"
            value={stats?.dataSize ? formatBytes(stats.dataSize) : 'N/A'}
            subtitle="Total data stored"
            icon="💾"
            color="#28a745"
          />
          
          <StatCard
            title="Collections"
            value={collections.length}
            subtitle={`${stats?.documents || 0} total documents`}
            icon="📁"
            color="#007bff"
          />
          
          <StatCard
            title="Uptime"
            value={formatUptime(stats?.uptime)}
            subtitle="Database running time"
            icon="⏱️"
            color="#17a2b8"
          />
          
          <StatCard
            title="Version"
            value={stats?.version || 'MongoDB 6.0'}
            subtitle="Database version"
            icon="🏷️"
            color="#6f42c1"
          />
        </div>

        <div className={styles.detailsGrid}>
          <div className={styles.detailCard}>
            <h3 className={styles.detailTitle}>Connection Info</h3>
            <div className={styles.detailContent}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Status:</span>
                <span className={`${styles.detailValue} ${styles[connectionStatus]}`}>
                  {connectionStatus === 'connected' ? '✓ Connected' : '✗ Disconnected'}
                </span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Host:</span>
                <span className={styles.detailValue}>localhost:27017</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Database:</span>
                <span className={styles.detailValue}>session</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Last Updated:</span>
                <span className={styles.detailValue}>{new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </div>

          <div className={styles.detailCard}>
            <h3 className={styles.detailTitle}>Quick Actions</h3>
            <div className={styles.actionsList}>
              <button 
                className={styles.actionButton}
                onClick={() => pluginApi.navigate?.('/query-runner')}
              >
                <span className={styles.actionIcon}>🔍</span>
                Run Query
              </button>
              <button 
                className={styles.actionButton}
                onClick={() => pluginApi.navigate?.('/collection-manager')}
              >
                <span className={styles.actionIcon}>📁</span>
                Manage Collections
              </button>
              <button 
                className={styles.actionButton}
                onClick={fetchDashboardData}
              >
                <span className={styles.actionIcon}>↻</span>
                Refresh Stats
              </button>
              <button 
                className={styles.actionButton}
                onClick={() => window.open('/api/stats', '_blank')}
              >
                <span className={styles.actionIcon}>📊</span>
                View Raw Stats
              </button>
            </div>
          </div>
        </div>

        {collections.length > 0 && (
          <div className={styles.collectionsOverview}>
            <h3 className={styles.collectionsTitle}>Collections Overview</h3>
            <div className={styles.collectionsGrid}>
              {collections.slice(0, 6).map((collection) => (
                <div key={collection.name} className={styles.collectionCard}>
                  <div className={styles.collectionHeader}>
                    <span className={styles.collectionName}>{collection.name}</span>
                    <span className={styles.collectionCount}>{collection.count || 0}</span>
                  </div>
                  <div className={styles.collectionMeta}>
                    <span className={styles.collectionSize}>
                      {collection.size ? formatBytes(collection.size) : 'N/A'}
                    </span>
                  </div>
                </div>
              ))}
              {collections.length > 6 && (
                <div className={styles.moreCollections}>
                  <span>+{collections.length - 6} more</span>
                  <button 
                    onClick={() => pluginApi.navigate?.('/collection-manager')}
                    className={styles.viewAllButton}
                  >
                    View All
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DatabaseDashboardPage; 