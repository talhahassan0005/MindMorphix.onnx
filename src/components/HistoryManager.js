'use client';
import { useState, useEffect, useCallback } from 'react';

const HistoryManager = ({ user, isAuthenticated }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });
  const [selectedEntry, setSelectedEntry] = useState(null);

  const fetchHistory = useCallback(async (page = 1) => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/history?page=${page}&limit=${pagination.limit}`, {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setHistory(data.history);
        setPagination(data.pagination);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to fetch history');
      }
    } catch (error) {
      console.error('History fetch error:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, pagination.limit]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchHistory(1);
    }
  }, [isAuthenticated, fetchHistory]);

  const deleteHistoryEntry = async (historyId) => {
    if (!confirm('Are you sure you want to delete this detection record?')) {
      return;
    }

    try {
      const response = await fetch(`/api/history?id=${historyId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        // Refresh the current page
        fetchHistory(pagination.page);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to delete history entry');
      }
    } catch (error) {
      console.error('Delete error:', error);
      setError('Network error. Please try again.');
    }
  };

  const getDetectionColor = (detection) => {
    switch (detection) {
      case 'glioma':
        return 'text-danger';
      case 'meningioma':
        return 'text-warning';
      case 'pituitary':
        return 'text-info';
      case 'notumor':
        return 'text-success';
      default:
        return 'text-muted';
    }
  };

  const getDetectionIcon = (detection) => {
    switch (detection) {
      case 'glioma':
        return 'bi-exclamation-triangle-fill';
      case 'meningioma':
        return 'bi-exclamation-circle-fill';
      case 'pituitary':
        return 'bi-info-circle-fill';
      case 'notumor':
        return 'bi-check-circle-fill';
      default:
        return 'bi-question-circle-fill';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="card bg-dark-2 border-secondary shadow-lg">
        <div className="card-body text-center">
          <i className="bi bi-lock-fill text-muted" style={{ fontSize: '3rem' }}></i>
          <h5 className="mt-3 text-muted">Authentication Required</h5>
          <p className="text-muted">Please log in to view your detection history.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-dark-2 border-secondary shadow-lg">
      <div className="card-header bg-dark-3 border-secondary">
        <h5 className="mb-0 text-primary">
          <i className="bi bi-clock-history me-2"></i>
          Detection History
        </h5>
      </div>
      <div className="card-body">
        {error && (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
            <button
              type="button"
              className="btn-close"
              onClick={() => setError(null)}
            ></button>
          </div>
        )}

        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2 text-muted">Loading history...</p>
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-4">
            <i className="bi bi-inbox text-muted" style={{ fontSize: '3rem' }}></i>
            <h6 className="mt-3 text-muted">No Detection History</h6>
            <p className="text-muted">Your detection results will appear here after you analyze MRI scans.</p>
          </div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="table table-dark table-hover">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Detection</th>
                    <th>Confidence</th>
                    <th>Time</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((entry) => (
                    <tr key={entry._id}>
                      <td>
                                                 <small className="text-white">
                          {new Date(entry.timestamp).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </small>
                      </td>
                      <td>
                        <span className={`badge ${getDetectionColor(entry.result.primaryDetection)}`}>
                          <i className={`bi ${getDetectionIcon(entry.result.primaryDetection)} me-1`}></i>
                          {entry.result.primaryDetection.charAt(0).toUpperCase() + entry.result.primaryDetection.slice(1)}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="progress flex-grow-1 me-2" style={{ height: '6px' }}>
                            <div
                              className="progress-bar bg-success"
                              style={{ width: `${entry.result.confidence}%` }}
                            ></div>
                          </div>
                                                     <small className="text-white">{entry.result.confidence.toFixed(1)}%</small>
                        </div>
                      </td>
                      <td>
                                                 <small className="text-white">
                           {entry.result.inferenceTime.toFixed(2)}s
                         </small>
                      </td>
                                                                   <td>
                        <div className="d-flex gap-2">
                          <span 
                            className="text-info" 
                            style={{ fontSize: '1.2rem', cursor: 'pointer', fontWeight: 'bold' }}
                            onClick={() => setSelectedEntry(entry)}
                            title="View Details"
                          >
                            👁️
                          </span>
                          <span 
                            className="text-danger" 
                            style={{ fontSize: '1.2rem', cursor: 'pointer', fontWeight: 'bold' }}
                            onClick={() => deleteHistoryEntry(entry._id)}
                            title="Delete"
                          >
                            🗑️
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <nav aria-label="History pagination">
                <ul className="pagination pagination-sm justify-content-center">
                  <li className={`page-item ${pagination.page === 1 ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => fetchHistory(pagination.page - 1)}
                      disabled={pagination.page === 1}
                    >
                      Previous
                    </button>
                  </li>
                  
                  {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <li key={pageNum} className={`page-item ${pagination.page === pageNum ? 'active' : ''}`}>
                        <button
                          className="page-link"
                          onClick={() => fetchHistory(pageNum)}
                        >
                          {pageNum}
                        </button>
                      </li>
                    );
                  })}
                  
                  <li className={`page-item ${pagination.page === pagination.pages ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => fetchHistory(pagination.page + 1)}
                      disabled={pagination.page === pagination.pages}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            )}

            {/* Entry Details Modal */}
            {selectedEntry && (
              <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <div className="modal-dialog modal-lg">
                  <div className="modal-content bg-dark-2 border-secondary">
                    <div className="modal-header border-secondary">
                      <h5 className="modal-title text-primary">
                        Detection Details
                      </h5>
                      <button
                        type="button"
                        className="btn-close btn-close-white"
                        onClick={() => setSelectedEntry(null)}
                      ></button>
                    </div>
                    <div className="modal-body">
                      <div className="row">
                        <div className="col-md-6">
                          <h6 className="text-primary">Result Summary</h6>
                          <p>
                            <strong>Primary Detection:</strong>
                            <span className={`ms-2 badge ${getDetectionColor(selectedEntry.result.primaryDetection)}`}>
                              {selectedEntry.result.primaryDetection.charAt(0).toUpperCase() + selectedEntry.result.primaryDetection.slice(1)}
                            </span>
                          </p>
                          <p><strong>Confidence:</strong> {selectedEntry.result.confidence.toFixed(2)}%</p>
                          <p><strong>Inference Time:</strong> {selectedEntry.result.inferenceTime.toFixed(2)}s</p>
                          <p><strong>Processing Time:</strong> {selectedEntry.processingTime.toFixed(2)}s</p>
                          <p><strong>Date:</strong> {new Date(selectedEntry.timestamp).toLocaleString()}</p>
                        </div>
                        <div className="col-md-6">
                          <h6 className="text-primary">All Probabilities</h6>
                          {Object.entries(selectedEntry.result.allProbabilities).map(([type, prob]) => (
                            <div key={type} className="mb-2">
                              <div className="d-flex justify-content-between">
                                <span className="text-capitalize">{type}:</span>
                                <span>{(prob * 100).toFixed(2)}%</span>
                              </div>
                              <div className="progress" style={{ height: '4px' }}>
                                <div
                                  className={`progress-bar ${type === selectedEntry.result.primaryDetection ? 'bg-success' : 'bg-secondary'}`}
                                  style={{ width: `${prob * 100}%` }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="modal-footer border-secondary">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setSelectedEntry(null)}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HistoryManager;
