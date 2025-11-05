import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ResumeForm from '../components/ResumeForm'; // Import the refactored form

function CreateResumePage() {
  const navigate = useNavigate();
  const token = localStorage.getItem('grobs-ai-token');
  const [error, setError] = useState('');

  // This function will be passed to the form's 'onSave' prop
  const handleCreate = async (formData) => {
    try {
      await axios.post(
        'http://127.0.0.1:8000/resume/', 
        formData, 
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      navigate('/'); // Go back to dashboard on success
    } catch (err) {
      console.error("Error creating resume:", err);
      setError("Could not create resume. Please try again.");
    }
  };

  return (
    <div>
      <h1>Create Your Resume</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ResumeForm 
        onSave={handleCreate} 
        saveButtonText="Save & Submit Resume"
      />
    </div>
  );
}

export default CreateResumePage;