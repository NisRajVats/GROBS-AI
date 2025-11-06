import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

// --- Step 1, 2, 3, 4 (Personal, Edu, Exp, Projects) are unchanged ---
// (Code for these components is redacted for brevity)
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
        <button type="submit" style={{ marginTop: '1.5rem', padding: '0.75rem', cursor: 'pointer' }}>Next: Education</button>
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
  const handleRemove = (index) => {
    const updatedEducation = [...formData.education];
    updatedEducation.splice(index, 1);
    setFormData({ ...formData, education: updatedEducation });
  };
  return (
    <div>
      <h3>Step 2: Education</h3>
      <div style={{ marginBottom: '1.5rem' }}>
        <h4>Your Education Entries:</h4>
        {formData.education.length === 0 ? <p>No entries added yet.</p> : (
          <ul style={{ paddingLeft: '20px' }}>
            {formData.education.map((edu, index) => (
              <li key={index} style={{ marginBottom: '0.5rem' }}>
                <strong>{edu.degree}</strong> at {edu.school}
                <button onClick={() => handleRemove(index)} style={{ marginLeft: '1rem', color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>X</button>
              </li>
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
        <button type="submit" style={{ marginTop: '1.5rem', padding: '0.75rem', cursor: 'pointer', backgroundColor: '#28a745', color: 'white' }}>+ Add This Entry</button>
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
  const handleRemove = (index) => {
    const updatedExperience = [...formData.experience];
    updatedExperience.splice(index, 1);
    setFormData({ ...formData, experience: updatedExperience });
  };
  return (
    <div>
      <h3>Step 3: Work Experience</h3>
      <div style={{ marginBottom: '1.5rem' }}>
        <h4>Your Experience Entries:</h4>
        {formData.experience.length === 0 ? <p>No entries added yet.</p> : (
          <ul style={{ paddingLeft: '20px' }}>
            {formData.experience.map((exp, index) => (
              <li key={index} style={{ marginBottom: '0.5rem' }}>
                <strong>{exp.role}</strong> at {exp.company}
                <button onClick={() => handleRemove(index)} style={{ marginLeft: '1rem', color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>X</button>
              </li>
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
        <button type="submit" style={{ marginTop: '1.5rem', padding: '0.75rem', cursor: 'pointer', backgroundColor: '#28a745', color: 'white' }}>+ Add This Entry</button>
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
  const handleRemove = (index) => {
    const updatedProjects = [...formData.projects];
    updatedProjects.splice(index, 1);
    setFormData({ ...formData, projects: updatedProjects });
  };
  return (
    <div>
      <h3>Step 4: Projects</h3>
      <div style={{ marginBottom: '1.5rem' }}>
        <h4>Your Project Entries:</h4>
        {formData.projects.length === 0 ? <p>No entries added yet.</p> : (
          <ul style={{ paddingLeft: '20px' }}>
            {formData.projects.map((proj, index) => (
              <li key={index} style={{ marginBottom: '0.5rem' }}>
                <strong>{proj.project_name}</strong>
                <button onClick={() => handleRemove(index)} style={{ marginLeft: '1rem', color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>X</button>
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
        <button type="submit" style={{ marginTop: '1.5rem', padding: '0.75rem', cursor: 'pointer', backgroundColor: '#28a745', color: 'white' }}>+ Add This Entry</button>
      </form>
      <div style={{ marginTop: '2rem' }}>
        <button onClick={prevStep} style={{ marginRight: '1rem', padding: '0.75rem' }}>Back: Experience</button>
        <button onClick={nextStep} style={{ padding: '0.75rem' }}>Next: Skills</button>
      </div>
    </div>
  );
}

// --- Step 5: Skills (No Changes) ---
function SkillsStep({ formData, setFormData, nextStep, prevStep }) {
  const [currentSkill, setCurrentSkill] = useState('');
  const handleChange = (e) => { setCurrentSkill(e.target.value); };
  const handleAddSkill = (e) => {
    e.preventDefault();
    if (currentSkill.trim() === '') return;
    setFormData({ ...formData, skills: [...formData.skills, { name: currentSkill }] });
    setCurrentSkill('');
  };
  const handleRemove = (index) => {
    const updatedSkills = [...formData.skills];
    updatedSkills.splice(index, 1);
    setFormData({ ...formData, skills: updatedSkills });
  };
  return (
    <div>
      <h3>Step 5: Skills</h3>
      <div style={{ marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        {formData.skills.length === 0 ? <p>No skills added yet.</p> : (
          formData.skills.map((skill, index) => (
            <span key={index} style={{ padding: '0.5rem 1rem', backgroundColor: '#007bff', color: 'white', borderRadius: '20px', display: 'flex', alignItems: 'center' }}>
              {skill.name}
              <button onClick={() => handleRemove(index)} style={{ marginLeft: '0.5rem', color: 'white', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold' }}>X</button>
            </span>
          ))
        )}
      </div>
      <form onSubmit={handleAddSkill} style={{ display: 'flex', alignItems: 'flex-end', width: '400px', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
        <div style={{ flexGrow: 1, marginRight: '1rem' }}>
          <label htmlFor="skill_name">Add Skill:</label>
          <input type="text" name="skill_name" id="skill_name" value={currentSkill} onChange={handleChange} style={{ padding: '0.5rem', width: '100%' }} placeholder="e.g., Python, React" />
        </div>
        <button type="submit" style={{ padding: '0.5rem 1rem', cursor: 'pointer', backgroundColor: '#28a745', color: 'white', height: '2.5rem' }}>+ Add</button>
      </form>
      <div style={{ marginTop: '2rem' }}>
        <button onClick={prevStep} style={{ marginRight: '1rem', padding: '0.75rem' }}>Back: Projects</button>
        <button onClick={nextStep} style={{ padding: '0.75rem' }}>Next: Select Template</button>
      </div>
    </div>
  );
}

// --- NEW: Step 6 Component (Template Selection) ---
function TemplateStep({ formData, setFormData, nextStep, prevStep }) {
  
  const handleSelectTemplate = (templateName) => {
    setFormData({ ...formData, template_name: templateName });
  };

  const selectedStyle = {
    border: '4px solid #007bff',
    boxShadow: '0 0 10px rgba(0,123,255,0.5)',
    transform: 'scale(1.05)'
  };

  const templateChoiceStyle = {
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '0.5rem',
    cursor: 'pointer',
    transition: 'all 0.2s'
  };

  return (
    <div>
      <h3>Step 6: Select Your Template</h3>
      <p>Choose the look of your final resume. You can always change this later.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', marginTop: '2rem' }}>
        {/* Template 1: Classic */}
        <div 
          style={{ ...templateChoiceStyle, ...(formData.template_name === 'classic' ? selectedStyle : {}) }}
          onClick={() => handleSelectTemplate('classic')}
        >
          <img 
            src="https://placehold.co/150x200/eee/333?text=Classic" 
            alt="Classic Template" 
            style={{ width: '100%', display: 'block' }} 
          />
          <p style={{ textAlign: 'center', margin: '0.5rem 0 0 0' }}>Classic</p>
        </div>

        {/* Template 2: Modern */}
        <div 
          style={{ ...templateChoiceStyle, ...(formData.template_name === 'modern' ? selectedStyle : {}) }}
          onClick={() => handleSelectTemplate('modern')}
        >
          <img 
            src="https://placehold.co/150x200/333/eee?text=Modern" 
            alt="Modern Template" 
            style={{ width: '100%', display: 'block' }} 
          />
          <p style={{ textAlign: 'center', margin: '0.5rem 0 0 0' }}>Modern</p>
        </div>

        {/* Template 3: Simple */}
        <div 
          style={{ ...templateChoiceStyle, ...(formData.template_name === 'simple' ? selectedStyle : {}) }}
          onClick={() => handleSelectTemplate('simple')}
        >
          <img 
            src="https://placehold.co/150x200/fff/777?text=Simple" 
            alt="Simple Template" 
            style={{ width: '100%', display: 'block' }} 
          />
          <p style={{ textAlign: 'center', margin: '0.5rem 0 0 0' }}>Simple</p>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div style={{ marginTop: '2rem' }}>
        <button onClick={prevStep} style={{ marginRight: '1rem', padding: '0.75rem' }}>
          Back: Skills
        </button>
        <button onClick={nextStep} style={{ padding: '0.75rem' }}>
          Next: Review & Submit
        </button>
      </div>
    </div>
  );
}


// --- Main Form Component (UPDATED) ---
function ResumeForm({ existingData, onSave, saveButtonText }) {
  const [currentStep, setCurrentStep] = useState(1);
  
  const [formData, setFormData] = useState(existingData || {
    full_name: '',
    email: '',
    phone: '',
    linkedin_url: '',
    education: [],
    experience: [],
    projects: [],
    skills: [],
    template_name: 'classic' // <-- ADDED default template
  });

  const nextStep = () => setCurrentStep(prev => prev + 1);
  const prevStep = () => setCurrentStep(prev => prev - 1);

  const handleSubmit = () => {
    console.log("Saving data:", formData);
    onSave(formData);
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
        return <SkillsStep formData={formData} setFormData={setFormData} nextStep={nextStep} prevStep={prevStep} />;
      case 6:
        // NEW: Render the TemplateStep
        return <TemplateStep formData={formData} setFormData={setFormData} nextStep={nextStep} prevStep={prevStep} />;
      case 7:
        // UPDATED: Review step is now case 7
        return (
          <div>
            <h3>Step 7: Review & Submit</h3>
            <p>Review your information. When ready, click submit.</p>
            <pre>{JSON.stringify(formData, null, 2)}</pre>
            <div style={{ marginTop: '2rem' }}>
              <button onClick={prevStep} style={{ marginRight: '1rem', padding: '0.75rem' }}>
                Back: Template
              </button>
              <button 
                onClick={handleSubmit} 
                style={{ padding: '0.75rem', backgroundColor: '#007bff', color: 'white' }}
              >
                {saveButtonText}
              </button>
            </div>
          </div>
        );
      default:
        return <div>Error: Unknown step.</div>;
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