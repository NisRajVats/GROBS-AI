import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// --- Step 1: Personal Info ---
function PersonalInfoStep({ formData, setFormData, nextStep }) {
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleNext = (e) => { e.preventDefault(); nextStep(); };
  return (
    <form onSubmit={handleNext} className="space-y-4 max-w-xl">
      <h3 className="text-lg font-semibold text-gray-900">Step 1: Personal Information</h3>
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">Full Name</label>
          <input type="text" name="full_name" id="full_name" value={formData.full_name || ''} onChange={handleChange} required className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" name="email" id="email" value={formData.email || ''} onChange={handleChange} required className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
          <input type="tel" name="phone" id="phone" value={formData.phone || ''} onChange={handleChange} className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label htmlFor="linkedin_url" className="block text-sm font-medium text-gray-700">LinkedIn URL</label>
          <input type="url" name="linkedin_url" id="linkedin_url" value={formData.linkedin_url || ''} onChange={handleChange} className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 focus:ring-2 focus:ring-blue-500" />
        </div>
        <button type="submit" className="inline-flex items-center rounded-lg bg-linear-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 text-sm font-medium shadow-sm hover:from-blue-700 hover:to-indigo-700">Next: Education</button>
      </div>
    </form>
  );
}

// --- Step 2: Education ---
function EducationStep({ formData, setFormData, nextStep, prevStep }) {
  const [currentEntry, setCurrentEntry] = useState({ school: '', degree: '', start_date: '', end_date: '' });
  const handleChange = (e) => setCurrentEntry({ ...currentEntry, [e.target.name]: e.target.value });
  const handleAddEducation = (e) => {
    e.preventDefault();
    setFormData({ ...formData, education: [...formData.education, currentEntry] });
    setCurrentEntry({ school: '', degree: '', start_date: '', end_date: '' });
  };
  // NEW: Function to remove an entry
  const handleRemove = (index) => {
    const updatedEducation = [...formData.education];
    updatedEducation.splice(index, 1);
    setFormData({ ...formData, education: updatedEducation });
  };
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Step 2: Education</h3>
      <div>
        <h4 className="text-sm font-medium text-gray-700">Your Education Entries</h4>
        {formData.education.length === 0 ? <p className="text-sm text-gray-600 mt-1">No entries added yet.</p> : (
          <ul className="mt-2 space-y-2">
            {formData.education.map((edu, index) => (
              <li key={index} className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3">
                <span><strong>{edu.degree}</strong> at {edu.school}</span>
                <button onClick={() => handleRemove(index)} className="text-rose-600 hover:text-rose-700 text-sm font-medium">Remove</button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <form onSubmit={handleAddEducation} className="grid grid-cols-1 gap-3 max-w-xl border-t border-gray-200 pt-4">
        <h4 className="text-sm font-medium text-gray-700">Add a New Entry</h4>
        <div>
          <label htmlFor="school" className="block text-sm font-medium text-gray-700">School/University</label>
          <input type="text" name="school" id="school" value={currentEntry.school} onChange={handleChange} required className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label htmlFor="degree" className="block text-sm font-medium text-gray-700">Degree/Course</label>
          <input type="text" name="degree" id="degree" value={currentEntry.degree} onChange={handleChange} required className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">Start Date</label>
            <input type="text" name="start_date" id="start_date" placeholder="e.g., Aug 2020" value={currentEntry.start_date} onChange={handleChange} required className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label htmlFor="end_date" className="block text-sm font-medium text-gray-700">End Date</label>
            <input type="text" name="end_date" id="end_date" placeholder="e.g., May 2024 or Present" value={currentEntry.end_date} onChange={handleChange} required className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
        <button type="submit" className="inline-flex items-center rounded-lg bg-emerald-600 text-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-emerald-700">+ Add This Entry</button>
      </form>
      <div className="pt-2 flex items-center gap-2">
        <button onClick={prevStep} className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Back: Personal</button>
        <button onClick={nextStep} className="inline-flex items-center rounded-lg bg-linear-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 text-sm font-medium shadow-sm hover:from-blue-700 hover:to-indigo-700">Next: Experience</button>
      </div>
    </div>
  );
}

// --- Step 3: Experience ---
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
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Step 3: Work Experience</h3>
      <div>
        <h4 className="text-sm font-medium text-gray-700">Your Experience Entries</h4>
        {formData.experience.length === 0 ? <p className="text-sm text-gray-600 mt-1">No entries added yet.</p> : (
          <ul className="mt-2 space-y-2">
            {formData.experience.map((exp, index) => (
              <li key={index} className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3">
                <span><strong>{exp.role}</strong> at {exp.company}</span>
                <button onClick={() => handleRemove(index)} className="text-rose-600 hover:text-rose-700 text-sm font-medium">Remove</button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <form onSubmit={handleAddExperience} className="grid grid-cols-1 gap-3 max-w-xl border-t border-gray-200 pt-4">
        <h4 className="text-sm font-medium text-gray-700">Add a New Entry</h4>
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-700">Company</label>
          <input type="text" name="company" id="company" value={currentEntry.company} onChange={handleChange} required className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role/Job Title</label>
          <input type="text" name="role" id="role" value={currentEntry.role} onChange={handleChange} required className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">Start Date</label>
            <input type="text" name="start_date" id="start_date" placeholder="e.g., Aug 2022" value={currentEntry.start_date} onChange={handleChange} required className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label htmlFor="end_date" className="block text-sm font-medium text-gray-700">End Date</label>
            <input type="text" name="end_date" id="end_date" placeholder="e.g., May 2023 or Present" value={currentEntry.end_date} onChange={handleChange} required className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
        <div>
          <label htmlFor="responsibilities" className="block text-sm font-medium text-gray-700">Responsibilities/Achievements</label>
          <textarea name="responsibilities" id="responsibilities" value={currentEntry.responsibilities} onChange={handleChange} rows="4" placeholder="Enter bullet points, one per line..." className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 focus:ring-2 focus:ring-blue-500" />
        </div>
        <button type="submit" className="inline-flex items-center rounded-lg bg-emerald-600 text-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-emerald-700">+ Add This Entry</button>
      </form>
      <div className="pt-2 flex items-center gap-2">
        <button onClick={prevStep} className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Back: Education</button>
        <button onClick={nextStep} className="inline-flex items-center rounded-lg bg-linear-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 text-sm font-medium shadow-sm hover:from-blue-700 hover:to-indigo-700">Next: Projects</button>
      </div>
    </div>
  );
}

// --- Step 4: Projects ---
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
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Step 4: Projects</h3>
      <div>
        <h4 className="text-sm font-medium text-gray-700">Your Project Entries</h4>
        {formData.projects.length === 0 ? <p className="text-sm text-gray-600 mt-1">No entries added yet.</p> : (
          <ul className="mt-2 space-y-2">
            {formData.projects.map((proj, index) => (
              <li key={index} className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3">
                <span><strong>{proj.project_name}</strong></span>
                <button onClick={() => handleRemove(index)} className="text-rose-600 hover:text-rose-700 text-sm font-medium">Remove</button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <form onSubmit={handleAddProject} className="grid grid-cols-1 gap-3 max-w-xl border-t border-gray-200 pt-4">
        <h4 className="text-sm font-medium text-gray-700">Add a New Entry</h4>
        <div>
          <label htmlFor="project_name" className="block text-sm font-medium text-gray-700">Project Name</label>
          <input type="text" name="project_name" id="project_name" value={currentEntry.project_name} onChange={handleChange} required className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label htmlFor="project_url" className="block text-sm font-medium text-gray-700">Project URL (GitHub, etc.)</label>
          <input type="url" name="project_url" id="project_url" value={currentEntry.project_url} onChange={handleChange} className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea name="description" id="description" value={currentEntry.description} onChange={handleChange} rows="3" placeholder="A brief description of your project..." className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 focus:ring-2 focus:ring-blue-500" />
        </div>
        <button type="submit" className="inline-flex items-center rounded-lg bg-emerald-600 text-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-emerald-700">+ Add This Entry</button>
      </form>
      <div className="pt-2 flex items-center gap-2">
        <button onClick={prevStep} className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Back: Experience</button>
        <button onClick={nextStep} className="inline-flex items-center rounded-lg bg-linear-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 text-sm font-medium shadow-sm hover:from-blue-700 hover:to-indigo-700">Next: Skills</button>
      </div>
    </div>
  );
}

// --- Step 5: Skills ---
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
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Step 5: Skills</h3>
      <div className="flex flex-wrap gap-2">
        {formData.skills.length === 0 ? <p className="text-sm text-gray-600">No skills added yet.</p> : (
          formData.skills.map((skill, index) => (
            <span key={index} className="inline-flex items-center gap-2 rounded-full bg-blue-600 text-white px-3 py-1 text-sm">
              {skill.name}
              <button onClick={() => handleRemove(index)} className="font-semibold">×</button>
            </span>
          ))
        )}
      </div>
      <form onSubmit={handleAddSkill} className="max-w-xl border-t border-gray-200 pt-4 flex items-end gap-3">
        <div className="flex-1">
          <label htmlFor="skill_name" className="block text-sm font-medium text-gray-700">Add Skill</label>
          <input type="text" name="skill_name" id="skill_name" value={currentSkill} onChange={handleChange} className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 focus:ring-2 focus:ring-blue-500" placeholder="e.g., Python, React" />
        </div>
        <button type="submit" className="h-10 inline-flex items-center rounded-lg bg-emerald-600 text-white px-4 text-sm font-medium shadow-sm hover:bg-emerald-700">+ Add</button>
      </form>
      <div className="pt-2 flex items-center gap-2">
        <button onClick={prevStep} className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Back: Projects</button>
        <button onClick={nextStep} className="inline-flex items-center rounded-lg bg-linear-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 text-sm font-medium shadow-sm hover:from-blue-700 hover:to-indigo-700">Next: Review & Submit</button>
      </div>
    </div>
  );
}

// --- Main Form Component (THE REFACTOR) ---
function ResumeForm({ existingData, onSave, saveButtonText }) {
  const [currentStep, setCurrentStep] = useState(1);
  
  // *** THIS IS THE KEY CHANGE ***
  // If existingData is provided, use it. Otherwise, start fresh.
  const [formData, setFormData] = useState(existingData || {
    full_name: '',
    email: '',
    phone: '',
    linkedin_url: '',
    education: [],
    experience: [],
    projects: [],
    skills: []
  });

  const nextStep = () => setCurrentStep(prev => prev + 1);
  const prevStep = () => setCurrentStep(prev => prev - 1);

  // The submit button now calls the 'onSave' prop
  const handleSubmit = () => {
    console.log("Saving data:", formData);
    onSave(formData); // Pass data to the parent (CreateResumePage or EditResumePage)
  };

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
                {saveButtonText} {/* Use the prop for the button text */}
              </button>
            </div>
          </div>
        );
      default:
        return <div>Error: Unknown step.</div>;
    }
  };

  return (
    <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      {renderStep()}
    </div>
  );
}

export default ResumeForm;