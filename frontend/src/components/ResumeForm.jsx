import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

// --- Step 1, 2, 3 (Personal, Edu, Exp) are unchanged ---
// (Code for PersonalInfoStep, EducationStep, ExperienceStep is here, but redacted for brevity)
// --- Step 1: Personal Info (No Changes) ---
function PersonalInfoStep({ formData, setFormData, nextStep }) {
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleNext = (e) => { e.preventDefault(); nextStep(); };

  return (
    <form onSubmit={handleNext}>
      <h3>Step 1: Personal Information</h3>
      <div style={{ display: 'flex', flexDirection: 'column', width: '400px' }}>
        <label htmlFor="full_name" style={{ marginTop: '1rem' }}>Full Name:</label>
        <input type="text" name="full_name" id="full_name" value={formData.full_name || ''} onChange={handleChange} required style={{ padding: '0.5rem' }} />
        <label htmlFor="email" style={{ marginTop: '1rem' }}>Email:</label>
        <input type="email" name="email" id="email" value={formData.email || ''} onChange={handleChange} required style={{ padding: '0.5rem' }} />
        <label htmlFor="phone" style={{ marginTop: '1rem' }}>Phone:</label>
        <input type="tel" name="phone" id="phone" value={formData.phone || ''} onChange={handleChange} style={{ padding: '0.5rem' }} />
        <label htmlFor="linkedin_url" style={{ marginTop: '1rem' }}>LinkedIn URL:</label>
        <input type="url" name="linkedin_url" id="linkedin_url" value={formData.linkedin_url || ''} onChange={handleChange} style={{ padding: '0.5rem' }} />
        <button type="submit" style={{ marginTop: '1.5rem', padding: '0.75rem', cursor: 'pointer' }}>
          Next: Education
        </button>
      </div>
    </form>
  );
}

// --- Step 2: Education (No Changes) ---
function EducationStep({ formData, setFormData, nextStep, prevStep }) {
  const [currentEntry, setCurrentEntry] = useState({ school: '', degree: '', start_date: '', end_date: '' });
  const handleChange = (e) => setCurrentEntry({ ...currentEntry, [e.target.name]: e.target.value });
  const handleAddEducation = (e) => {
    e.preventDefault();
    setFormData({ ...formData, education: [...formData.education, currentEntry] });
    setCurrentEntry({ school: '', degree: '', start_date: '', end_date: '' });
  };

  return (
    <div>
      <h3>Step 2: Education</h3>
      <div style={{ marginBottom: '1.5rem' }}>
        <h4>Your Education Entries:</h4>
        {formData.education.length === 0 ? <p>No entries added yet.</p> : (
          <ul style={{ paddingLeft: '20px' }}>
            {formData.education.map((edu, index) => (
              <li key={index}><strong>{edu.degree}</strong> at {edu.school} ({edu.start_date} - {edu.end_date})</li>
            ))}
          </ul>
        )}
      </div>
      <form onSubmit={handleAddEducation} style={{ display: 'flex', flexDirection: 'column', width: '400px', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
        <h4>Add a New Entry:</h4>
        <label htmlFor="school">School/University:</label>
        <input type="text" name="school" id="school" value={currentEntry.school} onChange={handleChange} required style={{ padding: '0.5rem' }} />
        <label htmlFor="degree" style={{ marginTop: '1rem' }}>Degree/Course:</label>
        <input type="text" name="degree" id="degree" value={currentEntry.degree} onChange={handleChange} required style={{ padding: '0.5rem' }} />
        <label htmlFor="start_date" style={{ marginTop: '1rem' }}>Start Date:</label>
        <input type="text" name="start_date" id="start_date" placeholder="e.g., Aug 2020" value={currentEntry.start_date} onChange={handleChange} required style={{ padding: '0.5rem' }} />
        <label htmlFor="end_date" style={{ marginTop: '1rem' }}>End Date:</label>
        <input type="text" name="end_date" id="end_date" placeholder="e.g., May 2024 or Present" value={currentEntry.end_date} onChange={handleChange} required style={{ padding: '0.5rem' }} />
        <button type="submit" style={{ marginTop: '1.5rem', padding: '0.75rem', cursor: 'pointer', backgroundColor: '#28a745', color: 'white' }}>
          + Add This Entry
        </button>
      </form>
      <div style={{ marginTop: '2rem' }}>
        <button onClick={prevStep} style={{ marginRight: '1rem', padding: '0.75rem' }}>Back: Personal</button>
        <button onClick={nextStep} style={{ padding: '0.75rem' }}>Next: Experience</button>
      </div>
    </div>
  );
}

// --- Step 3: Experience (No Changes) ---
function ExperienceStep({ formData, setFormData, nextStep, prevStep }) {
  const [currentEntry, setCurrentEntry] = useState({ company: '', role: '', start_date: '', end_date: '', responsibilities: '' });
  const handleChange = (e) => setCurrentEntry({ ...currentEntry, [e.target.name]: e.target.value });
  const handleAddExperience = (e) => {
    e.preventDefault();
    setFormData({ ...formData, experience: [...formData.experience, currentEntry] });
    setCurrentEntry({ company: '', role: '', start_date: '', end_date: '', responsibilities: '' });
  };

  return (
    <div>
      <h3>Step 3: Work Experience</h3>
      <div style={{ marginBottom: '1.5rem' }}>
        <h4>Your Experience Entries:</h4>
        {formData.experience.length === 0 ? <p>No entries added yet.</p> : (
          <ul style={{ paddingLeft: '20px' }}>
            {formData.experience.map((exp, index) => (
              <li key={index}><strong>{exp.role}</strong> at {exp.company} ({exp.start_date} - {exp.end_date})</li>
            ))}
          </ul>
        )}
      </div>
      <form onSubmit={handleAddExperience} style={{ display: 'flex', flexDirection: 'column', width: '400px', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
        <h4>Add a New Entry:</h4>
        <label htmlFor="company">Company:</label>
        <input type="text" name="company" id="company" value={currentEntry.company} onChange={handleChange} required style={{ padding: '0.5rem' }} />
        <label htmlFor="role" style={{ marginTop: '1rem' }}>Role/Job Title:</label>
        <input type="text" name="role" id="role" value={currentEntry.role} onChange={handleChange} required style={{ padding: '0.5rem' }} />
        <label htmlFor="start_date" style={{ marginTop: '1rem' }}>Start Date:</label>
        <input type="text" name="start_date" id="start_date" placeholder="e.g., Aug 2022" value={currentEntry.start_date} onChange={handleChange} required style={{ padding: '0.5rem' }} />
        <label htmlFor="end_date" style={{ marginTop: '1rem' }}>End Date:</label>
        <input type="text" name="end_date" id="end_date" placeholder="e.g., May 2023 or Present" value={currentEntry.end_date} onChange={handleChange} required style={{ padding: '0.5rem' }} />
        <label htmlFor="responsibilities" style={{ marginTop: '1rem' }}>Responsibilities/Achievements:</label>
        <textarea name="responsibilities" id="responsibilities" value={currentEntry.responsibilities} onChange={handleChange} rows="4" placeholder="Enter bullet points, one per line..." style={{ padding: '0.5rem' }} />
        <button type="submit" style={{ marginTop: '1.5rem', padding: '0.75rem', cursor: 'pointer', backgroundColor: '#28a745', color: 'white' }}>
          + Add This Entry
        </button>
      </form>
      <div style={{ marginTop: '2rem' }}>
        <button onClick={prevStep} style={{ marginRight: '1rem', padding: '0.75rem' }}>Back: Education</button>
        <button onClick={nextStep} style={{ padding: '0.75rem' }}>Next: Projects</button>
      </div>
    </div>
  );
}

// --- Step 4: Projects (No Changes) ---
function ProjectsStep({ formData, setFormData, nextStep, prevStep }) {
  const [currentEntry, setCurrentEntry] = useState({ project_name: '', description: '', project_url: '' });
  const handleChange = (e) => setCurrentEntry({ ...currentEntry, [e.target.name]: e.target.value });
  const handleAddProject = (e) => {
    e.preventDefault();
    setFormData({ ...formData, projects: [...formData.projects, currentEntry] });
    setCurrentEntry({ project_name: '', description: '', project_url: '' });
  };

  return (
    <div>
      <h3>Step 4: Projects</h3>
      <div style={{ marginBottom: '1.5rem' }}>
        <h4>Your Project Entries:</h4>
        {formData.projects.length === 0 ? <p>No entries added yet.</p> : (
          <ul style={{ paddingLeft: '20px' }}>
            {formData.projects.map((proj, index) => (
              <li key={index}>
                <strong>{proj.project_name}</strong>
                {proj.project_url && <span> (<a href={proj.project_url} target="_blank" rel="noopener noreferrer">Link</a>)</span>}
              </li>
            ))}
          </ul>
        )}
      </div>
      <form onSubmit={handleAddProject} style={{ display: 'flex', flexDirection: 'column', width: '400px', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
        <h4>Add a New Entry:</h4>
        <label htmlFor="project_name">Project Name:</label>
        <input type="text" name="project_name" id="project_name" value={currentEntry.project_name} onChange={handleChange} required style={{ padding: '0.5rem' }} />
        <label htmlFor="project_url" style={{ marginTop: '1rem' }}>Project URL (GitHub, etc.):</label>
        <input type="url" name="project_url" id="project_url" value={currentEntry.project_url} onChange={handleChange} style={{ padding: '0.5rem' }} />
        <label htmlFor="description" style={{ marginTop: '1rem' }}>Description:</label>
        <textarea name="description" id="description" value={currentEntry.description} onChange={handleChange} rows="3" placeholder="A brief description of your project..." style={{ padding: '0.5rem' }} />
        <button type="submit" style={{ marginTop: '1.5rem', padding: '0.75rem', cursor: 'pointer', backgroundColor: '#28a745', color: 'white' }}>
          + Add This Entry
        </button>
      </form>
      <div style={{ marginTop: '2rem' }}>
        <button onClick={prevStep} style={{ marginRight: '1rem', padding: '0.75rem' }}>Back: Experience</button>
        <button onClick={nextStep} style={{ padding: '0.75rem' }}>Next: Skills</button>
      </div>
    </div>
  );
}

// --- NEW: Step 5 Component (Skills) ---
function SkillsStep({ formData, setFormData, nextStep, prevStep }) {
  // Local state for the *current* skill being added
  const [currentSkill, setCurrentSkill] = useState('');

  const handleChange = (e) => {
    setCurrentSkill(e.target.value);
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (currentSkill.trim() === '') return; // Don't add empty skills
    
    // Add the skill as an object to match our schema
    setFormData({
      ...formData,
      skills: [...formData.skills, { name: currentSkill }]
    });
    // Clear the input
    setCurrentSkill('');
  };

  return (
    <div>
      <h3>Step 5: Skills</h3>
      
      {/* Display skills already added */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        {formData.skills.length === 0 ? (
          <p>No skills added yet.</p>
        ) : (
          formData.skills.map((skill, index) => (
            <span key={index} style={{ padding: '0.5rem 1rem', backgroundColor: '#007bff', color: 'white', borderRadius: '20px' }}>
              {skill.name}
            </span>
          ))
        )}
      </div>

      {/* Form for adding a new skill */}
      <form onSubmit={handleAddSkill} style={{ display: 'flex', alignItems: 'flex-end', width: '400px', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
        <div style={{ flexGrow: 1, marginRight: '1rem' }}>
          <label htmlFor="skill_name">Add Skill:</label>
          <input 
            type="text" 
            name="skill_name" 
            id="skill_name" 
            value={currentSkill} 
            onChange={handleChange} 
            style={{ padding: '0.5rem', width: '100%' }}
            placeholder="e.g., Python, React"
          />
        </div>
        <button 
          type="submit" 
          style={{ padding: '0.5rem 1rem', cursor: 'pointer', backgroundColor: '#28a745', color: 'white', height: '2.5rem' }}
        >
          + Add
        </button>
      </form>

      {/* Navigation Buttons */}
      <div style={{ marginTop: '2rem' }}>
        <button onClick={prevStep} style={{ marginRight: '1rem', padding: '0.75rem' }}>
          Back: Projects
        </button>
        <button onClick={nextStep} style={{ padding: '0.75rem' }}>
          Next: Review & Submit
        </button>
      </div>
    </div>
  );
}


// --- The Main Form Component (UPDATED) ---
function ResumeForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    education: [],
    experience: [],
    projects: [],
    skills: [] // <-- ADDED
  });
  
  const auth = useAuth(); 
  const navigate = useNavigate();

  const nextStep = () => setCurrentStep(prev => prev + 1);
  const prevStep = () => setCurrentStep(prev => prev - 1);

  const handleSubmit = async () => {
    console.log("Submitting all data:", formData);
    
    if (!auth.isLoggedIn) {
      console.error("User is not logged in!");
      alert("Error: You are not logged in.");
      return;
    }
    
    try {
      const response = await axios.post('http://127.0.0.1:8000/resume/', formData);
      console.log("Resume saved successfully:", response.data);
      navigate('/'); // Redirect to dashboard
    
    } catch (err) {
      console.error("Error saving resume:", err);
      if (err.response && err.response.data) {
        alert("Error: " + JSON.stringify(err.response.data.detail));
      } else {
        alert("An unexpected error occurred.");
      }
    }
  };

  // UPDATED: The renderStep function
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <PersonalInfoStep formData={formData} setFormData={setFormData} nextStep={nextStep} />;
      case 2:
        return <EducationStep formData={formData} setFormData={setFormData} nextStep={nextStep} prevStep={prevStep} />;
      case 3:
        return <ExperienceStep formData={formData} setFormData={setFormData} nextStep={nextStep} prevStep={prevStep} />;
      case 4:
        return <ProjectsStep formData={formData} setFormData={setFormData} nextStep={nextStep} prevStep={prevStep} />;
      case 5:
        // NEW: Render the SkillsStep
        return <SkillsStep formData={formData} setFormData={setFormData} nextStep={nextStep} prevStep={prevStep} />;
      case 6:
        // UPDATED: Review step is now case 6
        return (
          <div>
            <h3>Step 6: Review & Submit</h3>
            <p>Review your information. When ready, click submit.</p>
            <pre>{JSON.stringify(formData, null, 2)}</pre>
            <div style={{ marginTop: '2rem' }}>
              <button onClick={prevStep} style={{ marginRight: '1rem', padding: '0.75rem' }}>
                Back: Skills
              </button>
              <button 
                onClick={handleSubmit} 
                style={{ padding: '0.75rem', backgroundColor: '#007bff', color: 'white' }}
              >
                Save & Submit Resume
              </button>
            </div>
          </div>
        );
      default:
        return <div>Saving...</div>;
    }
  };

  return (
    <div style={{ 
      marginTop: '2rem',
      padding: '2rem', 
      border: '1px solid #ccc',
      borderRadius: '8px' 
    }}>
      {renderStep()}
    </div>
  );
}

export default ResumeForm;