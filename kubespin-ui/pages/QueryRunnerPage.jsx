import React, { useState, useRef } from 'react';
import styles from './QueryRunnerPage.module.css';

const QueryRunnerPage = ({ pluginApi }) => {
  const [query, setQuery] = useState('db.collection.find({})');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const textareaRef = useRef(null);

  const executeQuery = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    
    try {
      const response = await pluginApi.call('executeMongoCommand', { command: query });
      
      if (response.success) {
        const newResult = {
          query,
          result: response.data,
          timestamp: new Date(),
          success: true
        };
        setResult(newResult);
        setHistory(prev => [newResult, ...prev.slice(0, 9)]); // Keep last 10 queries
      } else {
        const newResult = {
          query,
          error: response.error || 'Query execution failed',
          timestamp: new Date(),
          success: false
        };
        setResult(newResult);
        setError(response.error || 'Query execution failed');
      }
    } catch (err) {
      const errorMsg = err.message || 'Failed to execute query';
      setError(errorMsg);
      setResult({
        query,
        error: errorMsg,
        timestamp: new Date(),
        success: false
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
      e.preventDefault();
      executeQuery();
    }
  };

  const loadFromHistory = (historyItem) => {
    setQuery(historyItem.query);
    setResult(historyItem);
  };

  const clearQuery = () => {
    setQuery('');
    textareaRef.current?.focus();
  };

  const formatResult = (data) => {
    if (typeof data === 'string') return data;
    return JSON.stringify(data, null, 2);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>MongoDB Query Runner</h1>
        <p className={styles.subtitle}>Execute MongoDB commands and view results</p>
      </div>

      <div className={styles.content}>
        <div className={styles.querySection}>
          <div className={styles.queryHeader}>
            <label htmlFor="query" className={styles.label}>Query</label>
            <div className={styles.queryActions}>
              <button
                onClick={clearQuery}
                className={styles.clearButton}
                type="button"
              >
                Clear
              </button>
              <button
                onClick={executeQuery}
                disabled={loading || !query.trim()}
                className={styles.executeButton}
                type="button"
              >
                {loading ? 'Executing...' : 'Execute (Ctrl+Enter)'}
              </button>
            </div>
          </div>
          
          <textarea
            ref={textareaRef}
            id="query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className={styles.queryInput}
            placeholder="Enter your MongoDB query here..."
            rows={6}
          />
        </div>

        <div className={styles.resultsSection}>
          <div className={styles.resultHeader}>
            <h3 className={styles.resultTitle}>Result</h3>
            {result && (
              <span className={styles.timestamp}>
                {result.timestamp.toLocaleTimeString()}
              </span>
            )}
          </div>
          
          <div className={styles.resultContent}>
            {loading && (
              <div className={styles.loading}>
                <div className={styles.spinner}></div>
                <span>Executing query...</span>
              </div>
            )}
            
            {error && !loading && (
              <div className={styles.error}>
                <strong>Error:</strong> {error}
              </div>
            )}
            
            {result && !loading && result.success && (
              <pre className={styles.result}>
                {formatResult(result.result)}
              </pre>
            )}
            
            {!result && !loading && !error && (
              <div className={styles.placeholder}>
                Enter a query and click Execute to see results
              </div>
            )}
          </div>
        </div>

        {history.length > 0 && (
          <div className={styles.historySection}>
            <h3 className={styles.historyTitle}>Query History</h3>
            <div className={styles.historyList}>
              {history.map((item, index) => (
                <div
                  key={index}
                  className={`${styles.historyItem} ${item.success ? styles.success : styles.failure}`}
                  onClick={() => loadFromHistory(item)}
                >
                  <div className={styles.historyQuery}>
                    {item.query.length > 50 ? `${item.query.substring(0, 50)}...` : item.query}
                  </div>
                  <div className={styles.historyMeta}>
                    <span className={styles.historyTime}>
                      {item.timestamp.toLocaleTimeString()}
                    </span>
                    <span className={`${styles.historyStatus} ${item.success ? styles.success : styles.failure}`}>
                      {item.success ? '✓' : '✗'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QueryRunnerPage; 