import React, { useState, useEffect } from 'react';
import styles from './CollectionManagerPage.module.css';

import { getCollectionManagerPageSidebarConfig } from "./CollectionManagerPage.sidebar.js";

const CollectionManagerPage = ({ pluginApi }) => {
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('{}');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');

  useEffect(() => {
    fetchCollections();
  }, []);

  // Set up the sidebar configuration when this page loads
  useEffect(() => {
    if (setSidebarConfig) {
      const sidebarConfig = getCollectionManagerPageSidebarConfig({
        addLog: (message) => console.log(`[PluginPage] ${message}`),
        handleRefreshPlugins: () => {
          fetchPlugins();
          fetchInstalledPlugins();
        },
      });
      setSidebarConfig(sidebarConfig);
    }
  }, [setSidebarConfig]);

  const fetchCollections = async () => {
    try {
      setLoading(true);
      const response = await pluginApi.call('getCollections');
      if (response.success) {
        setCollections(response.data || []);
      } else {
        setError('Failed to fetch collections');
      }
    } catch (err) {
      setError('Error fetching collections');
    } finally {
      setLoading(false);
    }
  };

  const fetchDocuments = async (collectionName, query = '{}') => {
    try {
      setLoading(true);
      setError(null);
      
      const findQuery = `db.${collectionName}.find(${query}).limit(50)`;
      const response = await pluginApi.call('executeMongoCommand', { command: findQuery });
      
      if (response.success) {
        setDocuments(response.data || []);
      } else {
        setError('Failed to fetch documents');
        setDocuments([]);
      }
    } catch (err) {
      setError('Error fetching documents');
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCollectionSelect = (collection) => {
    setSelectedCollection(collection);
    setSearchQuery('{}');
    fetchDocuments(collection.name);
  };

  const handleSearch = () => {
    if (selectedCollection) {
      fetchDocuments(selectedCollection.name, searchQuery);
    }
  };

  const createCollection = async () => {
    if (!newCollectionName.trim()) return;
    
    try {
      setLoading(true);
      const command = `db.createCollection("${newCollectionName}")`;
      const response = await pluginApi.call('executeMongoCommand', { command });
      
      if (response.success) {
        setShowCreateModal(false);
        setNewCollectionName('');
        await fetchCollections();
      } else {
        setError('Failed to create collection');
      }
    } catch (err) {
      setError('Error creating collection');
    } finally {
      setLoading(false);
    }
  };

  const deleteCollection = async (collectionName) => {
    if (!confirm(`Are you sure you want to delete collection "${collectionName}"?`)) {
      return;
    }

    try {
      setLoading(true);
      const command = `db.${collectionName}.drop()`;
      const response = await pluginApi.call('executeMongoCommand', { command });
      
      if (response.success) {
        if (selectedCollection?.name === collectionName) {
          setSelectedCollection(null);
          setDocuments([]);
        }
        await fetchCollections();
      } else {
        setError('Failed to delete collection');
      }
    } catch (err) {
      setError('Error deleting collection');
    } finally {
      setLoading(false);
    }
  };

  const formatDocument = (doc) => {
    return JSON.stringify(doc, null, 2);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Collection Manager</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className={styles.createButton}
        >
          Create Collection
        </button>
      </div>

      <div className={styles.content}>
        <div className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <h3>Collections</h3>
            <button onClick={fetchCollections} className={styles.refreshButton}>
              ↻
            </button>
          </div>
          
          {loading && collections.length === 0 && (
            <div className={styles.loading}>Loading...</div>
          )}
          
          <div className={styles.collectionList}>
            {collections.map((collection) => (
              <div
                key={collection.name}
                className={`${styles.collectionItem} ${
                  selectedCollection?.name === collection.name ? styles.selected : ''
                }`}
                onClick={() => handleCollectionSelect(collection)}
              >
                <div className={styles.collectionName}>{collection.name}</div>
                <div className={styles.collectionMeta}>
                  {collection.count || 0} docs
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteCollection(collection.name);
                  }}
                  className={styles.deleteButton}
                  title="Delete collection"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          
          {collections.length === 0 && !loading && (
            <div className={styles.emptyState}>
              No collections found
            </div>
          )}
        </div>

        <div className={styles.mainContent}>
          {selectedCollection ? (
            <>
              <div className={styles.documentHeader}>
                <div className={styles.documentTitle}>
                  <h3>{selectedCollection.name}</h3>
                  <span className={styles.documentCount}>
                    {documents.length} documents
                  </span>
                </div>
                
                <div className={styles.searchSection}>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search query (JSON)"
                    className={styles.searchInput}
                  />
                  <button onClick={handleSearch} className={styles.searchButton}>
                    Search
                  </button>
                </div>
              </div>

              {loading && (
                <div className={styles.loadingDocuments}>
                  <div className={styles.spinner}></div>
                  Loading documents...
                </div>
              )}

              <div className={styles.documentList}>
                {documents.map((doc, index) => (
                  <div key={index} className={styles.documentItem}>
                    <div className={styles.documentIndex}>#{index + 1}</div>
                    <pre className={styles.documentContent}>
                      {formatDocument(doc)}
                    </pre>
                  </div>
                ))}
              </div>

              {documents.length === 0 && !loading && (
                <div className={styles.emptyDocuments}>
                  No documents found
                </div>
              )}
            </>
          ) : (
            <div className={styles.noSelection}>
              <h3>Select a collection</h3>
              <p>Choose a collection from the sidebar to view its documents</p>
            </div>
          )}
        </div>
      </div>

      {showCreateModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Create New Collection</h3>
            <input
              type="text"
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
              placeholder="Collection name"
              className={styles.modalInput}
              autoFocus
            />
            <div className={styles.modalActions}>
              <button
                onClick={() => setShowCreateModal(false)}
                className={styles.cancelButton}
              >
                Cancel
              </button>
              <button
                onClick={createCollection}
                disabled={!newCollectionName.trim()}
                className={styles.confirmButton}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className={styles.errorToast}>
          {error}
          <button onClick={() => setError(null)} className={styles.closeError}>
            ×
          </button>
        </div>
      )}
    </div>
  );
};

export default CollectionManagerPage; 