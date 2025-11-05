import React, { useState } from 'react';
import { useLocation, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';

function AnalyzeResumePage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // We now need to update the resume, so we use useState
  // to make 'resume' a state variable.
  const [resume, setResume] = useState(location.state?.resume);
  
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(''); // For success messages

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

  // --- THIS IS THE NEW "WOW" FUNCTION ---
  const handleApplySkills = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    if (!analysisResult || !analysisResult.missing_keywords) {
      setError("No skills to apply. Please run an analysis first.");
      setLoading(false);
      return;
    }

    // 1. Get a set of the user's current skill names
    const currentSkillNames = new Set(resume.skills.map(skill => skill.name.toLowerCase()));
    
    // 2. Find which new skills are *actually* new
    const newSkillsToAdd = analysisResult.missing_keywords
      .filter(keyword => !currentSkillNames.has(keyword.toLowerCase()))
      .map(name => ({ name })); // Convert from string to {name: "string"} object

    if (newSkillsToAdd.length === 0) {
      setSuccess("Your skills are already up to date!");
      setLoading(false);
      return;
    }

    // 3. Create the new, updated resume object
    const updatedResume = {
      ...resume,
      skills: [...resume.skills, ...newSkillsToAdd]
    };

    // 4. Call the 'update' (PUT) endpoint we already built
    try {
      await axios.put(
        `http://127.0.0.1:8000/resume/${resume.id}`,
        updatedResume, // Send the full, updated resume
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      // 5. Update our local state to match
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
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Analyze Resume: {resume.full_name}</h1>
        <p className="text-sm text-gray-600 mt-1">Paste a job description to get AI insights and suggested skills.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Job Description */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="text-base font-semibold text-gray-900">Paste Job Description</h3>
          <textarea
            className="mt-3 h-72 w-full resize-none rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Paste the full job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
          <div className="mt-3 flex items-center gap-3">
            <button
              onClick={handleAnalyzeClick}
              disabled={loading}
              className="inline-flex items-center rounded-lg bg-linear-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 text-sm font-medium shadow-sm hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50"
            >
              {loading ? 'Analyzing...' : 'Analyze with GROBS.AI'}
            </button>
            {error && <span className="text-sm text-rose-600">{error}</span>}
            {success && <span className="text-sm text-emerald-600">{success}</span>}
          </div>
        </div>

        {/* Right: Results */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="text-base font-semibold text-gray-900">AI Analysis Results</h3>

          {loading && <p className="mt-2 text-gray-600">Loading...</p>}

          {analysisResult && (
            <div className="mt-3 space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700">Match Score</h4>
                <p className="mt-1 text-3xl font-extrabold tracking-tight text-blue-700">
                  {analysisResult.score.toFixed(0)} / 100
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700">Missing Keywords</h4>
                <ul className="mt-1 list-disc list-inside text-sm text-gray-700">
                  {analysisResult.missing_keywords.map((keyword, index) => (
                    <li key={index}>{keyword}</li>
                  ))}
                </ul>
                <button
                  onClick={handleApplySkills}
                  disabled={loading}
                  className="mt-3 inline-flex items-center rounded-lg bg-emerald-600 text-white px-3 py-1.5 text-sm font-medium hover:bg-emerald-700 disabled:opacity-50"
                >
                  + Add Missing Skills to My Resume
                </button>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700">Suggestions</h4>
                <p className="mt-1 whitespace-pre-wrap text-sm text-gray-700">{analysisResult.suggestions}</p>
              </div>

              <button
                onClick={() => navigate(`/edit-resume/${resume.id}`)}
                className="inline-flex items-center rounded-lg bg-amber-400 text-gray-900 px-3 py-1.5 text-sm font-medium hover:bg-amber-500"
              >
                Edit Resume Manually
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AnalyzeResumePage;