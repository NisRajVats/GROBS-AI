import React, { useState } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import axios from 'axios'; // 1. Import axios

function AnalyzeResumePage() {
  const location = useLocation();
  const { resume } = location.state || {};

  // 2. Add state for the form
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null); // To store the AI's response
  const [error, setError] = useState('');

  // 3. This is the function for our button
  const handleAnalyzeClick = async () => {
    if (!jobDescription) {
      setError('Please paste a job description first.');
      return;
    }
    setError('');
    setLoading(true);
    setAnalysisResult(null);

    // Get the token from localStorage
    const token = localStorage.getItem('grobs-ai-token');
    if (!token) {
      setError('You are not logged in. Please log in again.');
      setLoading(false);
      return;
    }

    try {
      // 4. Call the new backend endpoint
      const response = await axios.post(
        `http://127.0.0.1:8000/resume/${resume.id}/analyze`, 
        { text: jobDescription }, // This is the request body
        {
          headers: {
            'Authorization': `Bearer ${token}` // This is the security
          }
        }
      );
      
      // 5. Save the AI's JSON response in our state
      setAnalysisResult(response.data);
      setLoading(false);

    } catch (err) {
      console.error('Analysis error:', err);
      setError('An error occurred during analysis. Please try again.');
      setLoading(false);
    }
  };

  if (!resume) {
    return <Navigate to="/" replace />;
  }

  return (
    <div>
      <h1>Analyze Resume: {resume.full_name}</h1>
      <p>This is where the AI analysis will go.</p>

      <div style={{ marginTop: '2rem', display: 'flex', gap: '2rem' }}>
        {/* Left Side: Job Description */}
        <div style={{ flex: 1 }}>
          <h3>Paste Job Description Below:</h3>
          <textarea
            style={{ width: '100%', height: '300px', padding: '0.5rem' }}
            placeholder="Paste the full job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
          <button 
            onClick={handleAnalyzeClick}
            disabled={loading} // Disable button while loading
            style={{ 
              padding: '0.75rem 1.5rem', 
              fontSize: '1rem', 
              cursor: 'pointer',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              marginTop: '1rem'
            }}
          >
            {loading ? 'Analyzing...' : 'Analyze with GROBS.AI'}
          </button>
          {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
        </div>

        {/* Right Side: AI Results */}
        <div style={{ flex: 1, border: '1px solid #ccc', borderRadius: '8px', padding: '1rem', backgroundColor: '#f9f9f9' }}>
          <h3>AI Analysis Results</h3>
          
          {/* 6. Display the results from our state */}
          {loading && <p>Loading...</p>}
          
          {analysisResult && (
            <div>
              <h4 style={{ margin: '0 0 0.5rem 0' }}>Match Score:</h4>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: '#007bff' }}>
                {analysisResult.score.toFixed(0)} / 100
              </p>

              <h4 style={{ marginTop: '1.5rem' }}>Missing Keywords:</h4>
              <ul style={{ paddingLeft: '20px' }}>
                {analysisResult.missing_keywords.map((keyword, index) => (
                  <li key={index}>{keyword}</li>
                ))}
              </ul>

              <h4 style={{ marginTop: '1.5rem' }}>Suggestions:</h4>
              {/* We use 'pre-wrap' to respect the newlines (bullet points) from the AI */}
              <p style={{ whiteSpace: 'pre-wrap' }}>
                {analysisResult.suggestions}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AnalyzeResumePage;