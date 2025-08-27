'use client';
import { memo } from 'react';

const DetectionResults = memo(({ result, error, debugInfo }) => {
  if (!result && !error) return null;

  return (
    <div className="card bg-dark-2 border-secondary shadow-lg mt-4">
      <div className="card-body p-4">
        <h5 className="card-title text-center mb-3">
          <i className="bi bi-graph-up me-2"></i>
          Analysis Results
        </h5>

        {error && (
          <div className="alert alert-danger d-flex align-items-center">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            <div>{error}</div>
          </div>
        )}

        {result && (
          <div className="results-container">
            <div className={`alert ${result.topClass === 'notumor' ? 'alert-success' : 'alert-warning'} d-flex align-items-center`}>
              <i className={`bi ${result.topClass === 'notumor' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'} me-2`}></i>
              <div>
                <strong>Primary Detection:</strong> {result.topClass} ({result.confidence}% confidence)
                {result.inferenceTime && (
                  <small className="d-block text-muted">
                    Analysis completed in {result.inferenceTime.toFixed(2)}ms
                  </small>
                )}
              </div>
            </div>

            <div className="mt-4">
              <h6>Detailed Probabilities:</h6>
              <div className="progress-container">
                {result.allClasses.map((item, index) => (
                  <div key={index} className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span className={item.isTop ? "fw-bold text-primary" : ""}>
                        {item.class}
                        {item.isTop && <span className="ms-2">(Highest)</span>}
                      </span>
                      <span>{item.probability}%</span>
                    </div>
                    <div className="progress" style={{ height: "10px" }}>
                      <div
                        className={`progress-bar ${item.isTop ? 'bg-primary' : 'bg-secondary'}`}
                        role="progressbar"
                        style={{ width: `${item.probability}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

DetectionResults.displayName = 'DetectionResults';

export default DetectionResults;
