import React, { useState } from 'react';
import { useLocation, Navigate, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

// --- NEW: A Read-Only Component to Display Your Resume ---
function CompactResumeView({ resume }) {
  const boxStyle = {
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '1rem',
    backgroundColor: '#fff',
    height: '100%', // Make it fill the column
    overflowY: 'auto' // Add scroll if content is long
  };
  const sectionTitle = {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: '#007bff',
    borderBottom: '1px solid #eee',
    paddingBottom: '0.25rem',
    marginTop: '0'
  };
  const itemStyle = {
    marginBottom: '0.5rem',
    paddingBottom: '0.5rem',
    borderBottom: '1px dotted #ddd'
  };

  return (
    <div style={boxStyle}>
      <h3 style={sectionTitle}>Your Resume Snapshot</h3>
      
      {/* Education */}
      <h4 style={{...sectionTitle, fontSize: '1rem', color: '#333', marginTop: '1rem'}}>Education</h4>
      {resume.education.map((edu) => (
        <div key={edu.id || edu.school} style={itemStyle}>
          <strong>{edu.degree}</strong> at {edu.school}
        </div>
      ))}

      {/* Experience */}
      <h4 style={{...sectionTitle, fontSize: '1rem', color: '#333', marginTop: '1rem'}}>Experience</h4>
      {resume.experience.map((exp) => (
        <div key={exp.id || exp.company} style={itemStyle}>
          <strong>{exp.role}</strong> at {exp.company}
          <p style={{ fontSize: '0.9rem', whiteSpace: 'pre-wrap', margin: '0.25rem 0 0 0' }}>
            {exp.responsibilities}
          </p>
        </div>
      ))}

      {/* Projects */}
      <h4 style={{...sectionTitle, fontSize: '1rem', color: '#333', marginTop: '1rem'}}>Projects</h4>
      {resume.projects.map((proj) => (
        <div key={proj.id || proj.project_name} style={itemStyle}>
          <strong>{proj.project_name}</strong>
          <p style={{ fontSize: '0.9rem', whiteSpace: 'pre-wrap', margin: '0.25rem 0 0 0' }}>
            {proj.description}
          </p>
        </div>
      ))}

      {/* Skills */}
      <h4 style={{...sectionTitle, fontSize: '1rem', color: '#333', marginTop: '1rem'}}>Skills</h4>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        {resume.skills.map((skill) => (
          <span key={skill.id || skill.name} style={{ padding: '0.25rem 0.75rem', backgroundColor: '#6c757d', color: 'white', borderRadius: '20px', fontSize: '0.9rem' }}>
            {skill.name}
          </span>
        ))}
      </div>
    </div>
  );
}

// --- Main Page Component ---
function AnalyzeResumePage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [resume, setResume] = useState(location.state?.resume);
  
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const token = localStorage.getItem('grobs-ai-token');

  const handleAnalyzeClick = async () => {
    if (!jobDescription) {
      setError('Please paste a job description first.');
      return;
    }
    setError('');
    setSuccess('');
    setLoading(true);
    setAnalysisResult(null);

    if (!token) {
      setError('You are not logged in. Please log in again.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/resume/${resume.id}/analyze`, 
        { text: jobDescription },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      setAnalysisResult(response.data);
      setLoading(false);

    } catch (err) {
      console.error('Analysis error:', err);
      setError('An error occurred during analysis. Please try again.');
      setLoading(false);
    }
  };

  const handleApplySkills = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    if (!analysisResult || !analysisResult.missing_keywords) {
      setError("No skills to apply. Please run an analysis first.");
      setLoading(false);
      return;
    }

    const currentSkillNames = new Set(resume.skills.map(skill => skill.name.toLowerCase()));
    const newSkillsToAdd = analysisResult.missing_keywords
      .filter(keyword => !currentSkillNames.has(keyword.toLowerCase()))
      .map(name => ({ name }));

    if (newSkillsToAdd.length === 0) {
      setSuccess("Your skills are already up to date!");
      setLoading(false);
      return;
    }

    const updatedResume = {
      ...resume,
      skills: [...resume.skills, ...newSkillsToAdd]
    };

    try {
      await axios.put(
        `http://127.0.0.1:8000/resume/${resume.id}`,
        updatedResume,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      setResume(updatedResume);
      setSuccess(`${newSkillsToAdd.length} new skill(s) added to your resume!`);
      setLoading(false);

    } catch (err) {
      console.error("Error updating resume:", err);
      setError("Could not save new skills. Please try again.");
      setLoading(false);
    }
  };

  if (!resume) {
    return <Navigate to="/" replace />;
  }

  return (
    <div>
      <h1 style={{ borderBottom: '2px solid #eee', paddingBottom: '1rem' }}>
        AI Resume Analyzer
      </h1>
      
      {/* --- NEW 3-COLUMN LAYOUT --- */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr 1fr', // Three equal columns
        gap: '1.5rem',
        marginTop: '2rem',
        height: '70vh' // Set a fixed height for the columns
      }}>
        
        {/* --- Column 1: Your Resume --- */}
        <CompactResumeView resume={resume} />

        {/* --- Column 2: Job Description --- */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h3>Job Description</h3>
          <textarea
            style={{ 
              width: '100%', 
              flexGrow: 1, // Make textarea fill the space
              padding: '0.5rem',
              border: '1px solid #ccc',
              borderRadius: '8px'
            }}
            placeholder="Paste the full job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
          <button 
            onClick={handleAnalyzeClick}
            disabled={loading}
            style={{ 
              padding: '0.75rem 1.5rem', 
              fontSize: '1rem', 
              cursor: 'pointer',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              marginTop: '1rem'
            }}
          >
            {loading ? 'Analyzing...' : 'Analyze with GROBS.AI'}
          </button>
          {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
          {success && <p style={{ color: 'green', marginTop: '1rem' }}>{success}</p>}
        </div>

        {/* --- Column 3: AI Results --- */}
        <div style={{ 
          border: '1px solid #ccc', 
          borderRadius: '8px', 
          padding: '1rem', 
          backgroundColor: '#f9f9f9',
          height: '100%',
          overflowY: 'auto'
        }}>
          <h3>AI Analysis Results</h3>
          
          {!analysisResult && !loading && (
            <p>Your results will appear here after analysis.</p>
          )}
          
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
              
              <button 
                onClick={handleApplySkills} 
                disabled={loading}
                style={{ 
                  padding: '0.5rem 1rem', fontSize: '0.9rem', cursor: 'pointer',
                  backgroundColor: '#28a745', color: 'white', border: 'none',
                  borderRadius: '5px', marginTop: '0.5rem'
                }}
              >
                + Add Missing Skills to My Resume
              </button>

              <h4 style={{ marginTop: '1.5rem' }}>Suggestions:</h4>
              <p style={{ whiteSpace: 'pre-wrap' }}>
                {analysisResult.suggestions}
              </p>
              
              <div style={{ marginTop: '2rem', borderTop: '1px solid #eee', paddingTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                <Link to="/print-preview" state={{ resume: resume }}>
                  <button 
                    style={{ 
                      padding: '0.5rem 1rem', fontSize: '0.9rem', cursor: 'pointer',
                      backgroundColor: '#17a2b8', color: 'white', border: 'none',
                      borderRadius: '5px'
                    }}
                  >
                    Download Updated Resume
                  </button>
                </Link>

                <button 
                  onClick={() => navigate(`/edit-resume/${resume.id}`)}
                  style={{ 
                    padding: '0.5rem 1rem', fontSize: '0.9rem', cursor: 'pointer',
                    backgroundColor: '#ffc107', color: 'black', border: 'none',
                    borderRadius: '5px'
                  }}
                >
                  Edit Resume Manually
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AnalyzeResumePage;