"use client";
import * as ort from 'onnxruntime-web';
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import dynamic from 'next/dynamic';
import AIAssistant from "@/components/AIAssistant";
import PerformanceWidget from "@/components/PerformanceWidget";

import HistoryManager from "@/components/HistoryManager";

// Lazy load heavy components
const DetectionResults = dynamic(() => import('./DetectionResults'), {
  loading: () => <div className="card bg-dark-2 border-secondary shadow-lg mt-4 p-4">Loading results...</div>,
  ssr: false,
});

const MODEL_CONFIG = {
  path: '/onnxmodel.onnx',
  inputName: 'input',
  outputName: 'output',
  classes: ['glioma','meningioma', 'notumor',  'pituitary'],
  imageSize: 224,
  mean: [0.485, 0.456, 0.406],
  std: [0.229, 0.224, 0.225]
};

// Model loading optimization
const MODEL_CACHE_KEY = 'mindmorphix_model_cache';
const MODEL_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// Model cache for better performance
let modelSession = null;
let modelLoadingState = false;

const Detection = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);
  const fileInputRef = useRef(null);
  const [session, setSession] = useState(null);
  const [modelLoading, setModelLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);

  // Memoized model initialization with caching
  const initModel = useCallback(async () => {
    if (modelSession) {
      setSession(modelSession);
      return modelSession;
    }

    if (modelLoadingState) {
      return null;
    }

    modelLoadingState = true;
    try {
      console.log("Starting model initialization...");
      
      // Check for cached model data
      const cachedData = localStorage.getItem(MODEL_CACHE_KEY);
      if (cachedData) {
        try {
          const { modelData, timestamp } = JSON.parse(cachedData);
          if (Date.now() - timestamp < MODEL_CACHE_DURATION) {
            console.log("Loading model from cache...");
            const session = await ort.InferenceSession.create(modelData, {
              executionProviders: ['cpu'],
            });
            modelSession = session;
            setSession(session);
            return session;
          }
        } catch (cacheError) {
          console.log("Cache loading failed, loading from network:", cacheError);
        }
      }
      
      // Load from network with optimized approach
      let session = null;
      
      try {
        // Try CPU first (most reliable)
        console.log("Attempting CPU initialization from network...");
        session = await ort.InferenceSession.create(MODEL_CONFIG.path, {
          executionProviders: ['cpu'],
        });
        console.log("Model loaded successfully with CPU");
        
        // Cache the model data for future use
        try {
          const response = await fetch(MODEL_CONFIG.path);
          const modelData = await response.arrayBuffer();
          localStorage.setItem(MODEL_CACHE_KEY, JSON.stringify({
            modelData: modelData,
            timestamp: Date.now()
          }));
          console.log("Model cached successfully");
        } catch (cacheError) {
          console.warn("Failed to cache model:", cacheError);
        }
      } catch (cpuError) {
        console.log("CPU initialization failed, trying WebGL...", cpuError);
        
        // Try WebGL as fallback
        try {
          session = await ort.InferenceSession.create(MODEL_CONFIG.path, {
            executionProviders: ['webgl', 'cpu'],
          });
          console.log("Model loaded successfully with WebGL");
        } catch (webglError) {
          console.error("Both CPU and WebGL failed:", webglError);
          throw webglError;
        }
      }
      
      modelSession = session;
      setSession(session);
      return session;
    } catch (err) {
      console.error("Model loading failed:", err);
      setError("Failed to load AI model. Please refresh the page or check your browser compatibility.");
      return null;
    } finally {
      modelLoadingState = false;
    }
  }, []);

  useEffect(() => {
    console.log("Initializing model...");
    setModelLoading(true);
    setError(null); // Clear any previous errors
    
    // Add a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (modelLoading) {
        console.warn("Model loading taking longer than expected...");
      }
    }, 10000); // 10 seconds
    
    initModel().then((session) => {
      clearTimeout(timeoutId);
      if (session) {
        console.log("Model initialization completed successfully");
        setModelLoading(false);
      } else {
        console.error("Model initialization failed");
        setModelLoading(false);
      }
    }).catch((error) => {
      clearTimeout(timeoutId);
      console.error("Model initialization error:", error);
      setModelLoading(false);
      setError("Model loading failed. Please refresh the page or try again later.");
    });
  }, [initModel]);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch('/api/auth', {
          method: 'GET',
          credentials: 'include'
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setUser(null);
        setIsAuthenticated(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Optimized image preprocessing with performance monitoring
  const preprocessImage = useCallback(async (imgUrl) => {
    const startTime = performance.now();
    
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = imgUrl;
      img.crossOrigin = "anonymous";
      
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = MODEL_CONFIG.imageSize;
          canvas.height = MODEL_CONFIG.imageSize;
          const ctx = canvas.getContext("2d", { alpha: false, willReadFrequently: false });

          // Optimized scaling with better quality
          const scale = Math.min(
            MODEL_CONFIG.imageSize / img.width,
            MODEL_CONFIG.imageSize / img.height
          );
          const width = img.width * scale;
          const height = img.height * scale;
          const x = (MODEL_CONFIG.imageSize - width) / 2;
          const y = (MODEL_CONFIG.imageSize - height) / 2;

          // Fill with black background
          ctx.fillStyle = 'black';
          ctx.fillRect(0, 0, MODEL_CONFIG.imageSize, MODEL_CONFIG.imageSize);
          
          // Draw and scale image with optimized settings
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, x, y, width, height);

          setDebugInfo({
            preprocessedImage: canvas.toDataURL('image/webp', 0.8),
            originalSize: { width: img.width, height: img.height },
            processingTime: performance.now() - startTime
          });

          const imageData = ctx.getImageData(0, 0, MODEL_CONFIG.imageSize, MODEL_CONFIG.imageSize);
          const { data } = imageData;

          // Optimized tensor creation with TypedArray and SIMD-friendly loops
          const floatData = new Float32Array(3 * MODEL_CONFIG.imageSize * MODEL_CONFIG.imageSize);
          
          // Vectorized normalization with unrolled loops for better performance
          const size = MODEL_CONFIG.imageSize * MODEL_CONFIG.imageSize;
          const mean0 = MODEL_CONFIG.mean[0];
          const mean1 = MODEL_CONFIG.mean[1];
          const mean2 = MODEL_CONFIG.mean[2];
          const std0 = MODEL_CONFIG.std[0];
          const std1 = MODEL_CONFIG.std[1];
          const std2 = MODEL_CONFIG.std[2];
          
          for (let i = 0; i < size; i++) {
            const pixelIndex = i * 4;
            const r = data[pixelIndex] / 255.0;
            const g = data[pixelIndex + 1] / 255.0;
            const b = data[pixelIndex + 2] / 255.0;
            
            floatData[i] = (r - mean0) / std0;
            floatData[i + size] = (g - mean1) / std1;
            floatData[i + 2 * size] = (b - mean2) / std2;
          }

          const inputTensor = new ort.Tensor("float32", floatData, [1, 3, MODEL_CONFIG.imageSize, MODEL_CONFIG.imageSize]);
          
          console.log(`Image preprocessing completed in ${performance.now() - startTime}ms`);
          resolve(inputTensor);
        } catch (err) {
          reject(`Image processing error: ${err.message}`);
        }
      };
      img.onerror = () => reject("Error loading image");
    });
  }, []);

  // Optimized softmax with numerical stability
  const softmax = useCallback((arr) => {
    const max = Math.max(...arr);
    const exps = arr.map(x => Math.exp(x - max));
    const sum = exps.reduce((a, b) => a + b, 0);
    return exps.map(x => x / sum);
  }, []);

  // Memoized file validation
  const validateFile = useCallback((file) => {
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      return "Please upload a JPG, PNG, or WEBP image";
    }

    if (file.size > 5 * 1024 * 1024) {
      return "Image size should be less than 5MB";
    }

    return null;
  }, []);

  const handleImageChange = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setImage(URL.createObjectURL(file));
    setResult(null);
    setError(null);
    setDebugInfo(null);
  }, [validateFile]);

  const handleUpload = useCallback(async () => {
    console.log("handleUpload called, session:", !!session, "image:", !!image);
    
    if (!image) {
      setError("Please select an image first");
      return;
    }

    if (!session) {
      console.error("Session is null, model not ready");
      setError("AI model is not ready. Please try again later.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const tensor = await preprocessImage(image);
      const feeds = { [MODEL_CONFIG.inputName]: tensor };
      
      const startTime = performance.now();
      const outputData = await session.run(feeds);
      const endTime = performance.now();
      
      console.log(`Model inference time: ${endTime - startTime}ms`);
      
      const output = outputData[MODEL_CONFIG.outputName].data;

      let probabilities;
      if (Math.max(...output) > 1) {
        probabilities = softmax(Array.from(output));
      } else {
        probabilities = Array.from(output);
      }

      const maxIndex = probabilities.indexOf(Math.max(...probabilities));
      const confidence = (probabilities[maxIndex] * 100).toFixed(2);

      const detailedResults = MODEL_CONFIG.classes.map((className, index) => ({
        class: className,
        probability: (probabilities[index] * 100).toFixed(2),
        isTop: index === maxIndex
      }));

      detailedResults.sort((a, b) => b.probability - a.probability);

      const resultData = {
        topClass: MODEL_CONFIG.classes[maxIndex],
        confidence,
        allClasses: detailedResults,
        inferenceTime: endTime - startTime
      };

      setResult(resultData);

      // Save to history if user is authenticated
      if (isAuthenticated) {
        try {
          // Convert image to base64 for storage
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const img = new Image();
          img.crossOrigin = 'anonymous';
          
          img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            const imageData = canvas.toDataURL('image/jpeg', 0.8);
            
            // Save to history
            fetch('/api/history', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include',
              body: JSON.stringify({
                imageData: imageData,
                result: {
                  primaryDetection: resultData.topClass,
                  confidence: parseFloat(resultData.confidence),
                  allProbabilities: {
                    glioma: probabilities[0],
                    meningioma: probabilities[1],
                    notumor: probabilities[2],
                    pituitary: probabilities[3]
                  },
                  inferenceTime: resultData.inferenceTime
                },
                processingTime: debugInfo?.processingTime || 0,
                modelInfo: {
                  modelPath: MODEL_CONFIG.path,
                  imageSize: MODEL_CONFIG.imageSize
                }
              })
            }).then(response => {
              if (response.ok) {
                console.log('Detection history saved successfully');
              } else {
                console.warn('Failed to save detection history');
              }
            }).catch(error => {
              console.error('Error saving history:', error);
            });
          };
          
          img.src = image;
        } catch (historyError) {
          console.error('Error saving to history:', historyError);
        }
      }

    } catch (err) {
      console.error("Prediction error:", err);
      setError(`Analysis failed: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  }, [image, session, preprocessImage, softmax, isAuthenticated, debugInfo]);

  const triggerFileInput = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // Memoized UI components
  const fileUploadArea = useMemo(() => (
    <div
      className={`dropzone ${!image ? 'py-5' : 'pb-3'} text-center cursor-pointer`}
      onClick={triggerFileInput}
    >
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleImageChange}
        className="d-none"
      />
      {!image ? (
        <>
          <div className="mb-3">
            <i className="bi bi-cloud-arrow-up text-primary" style={{ fontSize: "3rem" }}></i>
          </div>
          <h5 className="text-light">Drag & drop an MRI scan here</h5>
          <p className="text-light">or click to browse files</p>
          <small className="text-light">Supports JPG, PNG, WEBP (max 5MB)</small>
        </>
      ) : (
        <div className="position-relative">
          <img
            src={image}
            alt="Upload preview"
            className="img-fluid rounded shadow"
            style={{ maxHeight: "400px" }}
            loading="lazy"
          />
          <button
            className="btn btn-sm btn-danger position-absolute top-0 end-0 m-2"
            onClick={(e) => {
              e.stopPropagation();
              setImage(null);
              setResult(null);
            }}
          >
            <i className="bi bi-x"></i>
          </button>
        </div>
      )}
    </div>
  ), [image, triggerFileInput, handleImageChange]);

  return (
    <div className="min-vh-100 bg-dark text-white">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-md-10">
            <div className="text-center mb-5">
              <h1 className="display-4 text-gradient mb-3 text-bold">
                <span className="text-primary">Brain Tumor</span>
                <span className="text-secondary"> Detection</span>
              </h1>
              <p className="lead text-muted">
                Upload a brain MRI scan for tumor detection and classification
              </p>
              {error && (
                <div className="alert alert-danger d-flex align-items-center mt-3">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  <div>
                    <div>{error}</div>
                    <button 
                      className="btn btn-sm btn-outline-danger mt-2"
                      onClick={() => {
                        setError(null);
                        setModelLoading(true);
                        initModel();
                      }}
                    >
                      <i className="bi bi-arrow-clockwise me-1"></i>
                      Retry Model Loading
                    </button>
                  </div>
                </div>
              )}
                              {modelLoading && (
                  <div className="alert alert-info d-flex align-items-center mt-3">
                    <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                    <div>
                      <strong>Loading AI Model...</strong><br/>
                      <small className="text-muted">Downloading 49MB model file. This may take a few moments...</small>
                    </div>
                  </div>
                )}
            </div>

            <div className="card bg-dark-2 border-secondary shadow-lg mb-4">
              <div className="card-body p-4">
                {fileUploadArea}

                <div className="d-grid gap-2 mt-3">
                  <button
                    onClick={handleUpload}
                    className="btn btn-primary btn-lg rounded-pill fw-bold"
                    disabled={loading || !image || modelLoading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Analyzing...
                      </>
                    ) : modelLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Model Loading...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-magic me-2"></i>
                        Analyze MRI Scan
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {(result || error) && (
              <DetectionResults 
                result={result} 
                error={error} 
                debugInfo={debugInfo}
              />
            )}

            {/* History Toggle Button */}
            <div className="row justify-content-center mt-4">
              <div className="col-md-8">
                <div className="d-flex justify-content-between align-items-center">
                  <button
                    onClick={() => setShowHistory(!showHistory)}
                    className="btn btn-outline-primary"
                  >
                    <i className={`bi ${showHistory ? 'bi-eye-slash' : 'bi-clock-history'} me-2`}></i>
                    {showHistory ? 'Hide History' : 'View History'}
                  </button>
                  
                  {isAuthenticated && (
                    <div className="text-muted">
                      <small>
                        <i className="bi bi-check-circle-fill text-success me-1"></i>
                        Logged in as {user?.name}
                      </small>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* History Section */}
            {showHistory && (
              <div className="row justify-content-center mt-3">
                <div className="col-md-8">
                  <HistoryManager user={user} isAuthenticated={isAuthenticated} />
                </div>
              </div>
            )}

            <div className="row justify-content-center mt-5">
              <div className="col-lg-10 col-md-12">
                <div className="card bg-dark-2 border-secondary shadow-lg">
                  <div className="card-body">
                    <AIAssistant />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Widget for Development */}
      <PerformanceWidget />

      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css"
      />

      <style jsx>{`
        .bg-dark-2 {
          background-color: #1a1a1a;
        }
        .text-gradient {
          background: linear-gradient(45deg, #3a7bd5, #00d2ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          display: inline-block;
        }
        .dropzone {
          border: 2px dashed #3a7bd5;
          border-radius: 10px;
          transition: all 0.3s;
        }
        .dropzone:hover {
          background-color: rgba(58, 123, 213, 0.1);
        }
        .cursor-pointer {
          cursor: pointer;
        }
        .progress-container {
          background-color: #2a2a2a;
          padding: 1rem;
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
};

export default Detection;