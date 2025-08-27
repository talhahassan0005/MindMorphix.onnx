'use client';
import { useState, useCallback, useMemo } from 'react';

export default function AIAssistant() {
  const [question, setQuestion] = useState('');
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Memoized chat history to prevent unnecessary re-renders
  const chatHistory = useMemo(() => chat, [chat]);

  const askAI = useCallback(async () => {
    if (!question.trim()) {
      setError('Please enter a question');
      return;
    }

    setError('');
    const userMessage = { sender: 'user', text: question, timestamp: Date.now() };
    setChat((prev) => [...prev, userMessage]);
    setQuestion('');
    setLoading(true);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: question }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        const errorData = await res.json();
        if (res.status === 500 && errorData.details?.includes('Missing GEMINI_API_KEY')) {
          throw new Error('AI Assistant is not configured. Please contact support to enable this feature.');
        } else {
          throw new Error(`AI Assistant error: ${errorData.error || 'Something went wrong'}`);
        }
      }
      
      const data = await res.json();
      const aiMessage = { 
        sender: 'ai', 
        text: data.text || 'No response generated',
        timestamp: Date.now()
      };
      setChat((prev) => [...prev, aiMessage]);
    } catch (err) {
      if (err.name === 'AbortError') {
        setError('Request timed out. Please try again.');
      } else {
        setError(err.message || 'Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  }, [question]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      askAI();
    }
  }, [askAI]);

  const clearChat = useCallback(() => {
    setChat([]);
    setError('');
  }, []);

  return (
    <div className="p-4 bg-dark text-light">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="text-primary mb-0">💬 Ask AI About Tumors or Treatments</h2>
        {chatHistory.length > 0 && (
          <button 
            className="btn btn-sm btn-outline-secondary"
            onClick={clearChat}
          >
            Clear Chat
          </button>
        )}
      </div>

      {/* Optimized Chat History */}
      <div 
        className="mb-3 chat-container" 
        style={{ 
          maxHeight: '400px', 
          overflowY: 'auto',
          scrollBehavior: 'smooth'
        }}
      >
        {chatHistory.length === 0 && (
          <div className="text-muted text-center py-3">
            <i className="bi bi-chat-dots" style={{ fontSize: '2rem' }}></i>
            <p className="mt-2">Start a conversation about brain tumors, treatments, or medical imaging</p>
            <small className="text-warning">
              <i className="bi bi-exclamation-triangle"></i>
              Note: AI Assistant requires a valid Gemini API key to function
            </small>
          </div>
        )}
        
        {chatHistory.map((msg, index) => (
          <div
            key={`${msg.timestamp}-${index}`}
            className={`p-3 mb-2 rounded ${msg.sender === 'user' ? 'bg-primary text-white' : 'bg-secondary text-white'}`}
            style={{ 
              animation: 'fadeIn 0.3s ease-in',
              wordBreak: 'break-word'
            }}
          >
            <div className="d-flex justify-content-between align-items-start mb-1">
              <strong>{msg.sender === 'user' ? 'You' : 'AI'}:</strong>
              <small className="text-muted">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </small>
            </div>
            <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
          </div>
        ))}
        
        {loading && (
          <div className="text-info p-2 text-center">
            <div className="spinner-border spinner-border-sm me-2" role="status"></div>
            AI is thinking...
          </div>
        )}
      </div>

      {/* Optimized Input Area */}
      <div className="input-group">
        <textarea
          className="form-control bg-dark text-light"
          rows="4"
          placeholder="Enter your question here... (Press Enter to send, Shift+Enter for new line)"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
          style={{ resize: 'none', minHeight: '120px' }}
        ></textarea>
        <button 
          className="btn btn-primary" 
          onClick={askAI} 
          disabled={loading || !question.trim()}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
              Thinking...
            </>
          ) : (
            <>
              <i className="bi bi-send me-2"></i>
              Ask AI
            </>
          )}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mt-3 p-3 bg-danger text-white rounded">
          <div className="d-flex align-items-center">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            <div>
              <strong>Error:</strong>
              <p className="mb-0">{error}</p>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .chat-container::-webkit-scrollbar {
          width: 6px;
        }
        .chat-container::-webkit-scrollbar-track {
          background: #2a2a2a;
        }
        .chat-container::-webkit-scrollbar-thumb {
          background: #555;
          border-radius: 3px;
        }
        .chat-container::-webkit-scrollbar-thumb:hover {
          background: #777;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
