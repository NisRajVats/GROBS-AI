import React from 'react';
import ResumeForm from '../components/ResumeForm'; // 1. Import your new form

function CreateResumePage() {
  return (
    <div>
      <h1>Create Your Resume</h1>
      <p>Fill out the form below to get started.</p>

      {/* 2. Render the form component */}
      <ResumeForm />
    </div>
  );
}

export default CreateResumePage;