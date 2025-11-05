import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ResumeForm from '../components/ResumeForm'; // Import the refactored form

function EditResumePage() {
  const [resumeData, setResumeData] = useState(null); // Start as null
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { resumeId } = useParams(); // Get the resume ID from the URL
  const navigate = useNavigate();
  const token = localStorage.getItem('grobs-ai-token');

  // 1. Fetch the existing resume data
  useEffect(() => {
    const fetchResume = async () => {
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        const response = await axios.get(`http://127.0.0.1:8000/resume/${resumeId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setResumeData(response.data); // Set the data
        setLoading(false);
      } catch (err) {
        console.error("Error fetching resume:", err);
        setError("Could not load resume data.");
        setLoading(false);
      }
    };
    fetchResume();
  }, [resumeId, token, navigate]);

  // 2. This function will be passed to the form's 'onSave' prop
  const handleUpdate = async (formData) => {
    try {
      await axios.put(
        `http://127.0.0.1:8000/resume/${resumeId}`, 
        formData, // Send the full, updated data
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      navigate('/'); // Go back to dashboard on success
    } catch (err) {
      console.error("Error updating resume:", err);
      setError("Could not update resume. Please try again.");
    }
  };

  if (loading) return <p>Loading resume data...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!resumeData) return <p>No resume data found.</p>;

  // 3. Render the form, passing the data and save function
  return (
    <div>
      <h1>Edit Your Resume</h1>
      <ResumeForm 
        existingData={resumeData} 
        onSave={handleUpdate} 
        saveButtonText="Save Changes"
      />
    </div>
  );
}

export default EditResumePage;