import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { resumeAPI } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  Linkedin,
  GraduationCap,
  Briefcase,
  FolderGit2,
  Plus,
  Trash2,
  Save,
  Code,
} from 'lucide-react';

const CreateResumePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    linkedin_url: '',
    education: [{ school: '', degree: '', start_date: '', end_date: '' }],
    experience: [
      {
        company: '',
        role: '',
        start_date: '',
        end_date: '',
        responsibilities: '',
      },
    ],
    projects: [{ project_name: '', description: '', project_url: '' }],
    skills: [{ name: '' }],
    template_name: 'classic',
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleArrayChange = (section, index, field, value) => {
    const updated = [...formData[section]];
    updated[index][field] = value;
    setFormData({ ...formData, [section]: updated });
  };

  const addSection = (section) => {
    const newItem =
      section === 'education'
        ? { school: '', degree: '', start_date: '', end_date: '' }
        : section === 'experience'
        ? {
            company: '',
            role: '',
            start_date: '',
            end_date: '',
            responsibilities: '',
          }
        : section === 'skills'
        ? { name: '' }
        : { project_name: '', description: '', project_url: '' };

    setFormData({ ...formData, [section]: [...formData[section], newItem] });
  };

  const removeSection = (section, index) => {
    const updated = formData[section].filter((_, i) => i !== index);
    setFormData({ ...formData, [section]: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await resumeAPI.create(formData);
      navigate('/dashboard');
    } catch (error) {
      alert('Failed to create resume');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold gradient-text mb-2">
            Create New Resume
          </h1>
          <p className="text-slate-600 text-lg">
            Fill in your information to build your professional resume
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-effect rounded-2xl p-8"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-br from-primary-500 to-accent-500 p-3 rounded-xl">
                <User className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">
                Personal Information
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 outline-none"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 outline-none"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 outline-none"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  name="linkedin_url"
                  value={formData.linkedin_url}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 outline-none"
                  placeholder="https://linkedin.com/in/johndoe"
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-effect rounded-2xl p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-br from-primary-500 to-accent-500 p-3 rounded-xl">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">Education</h2>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => addSection('education')}
                className="px-4 py-2 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </motion.button>
            </div>

            <div className="space-y-6">
              <AnimatePresence>
                {formData.education.map((edu, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="p-6 bg-slate-50 rounded-xl relative"
                  >
                    {formData.education.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSection('education', index)}
                        className="absolute top-4 right-4 p-2 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    )}

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          School *
                        </label>
                        <input
                          type="text"
                          value={edu.school}
                          onChange={(e) =>
                            handleArrayChange(
                              'education',
                              index,
                              'school',
                              e.target.value
                            )
                          }
                          required
                          className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                          placeholder="University Name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Degree *
                        </label>
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) =>
                            handleArrayChange(
                              'education',
                              index,
                              'degree',
                              e.target.value
                            )
                          }
                          required
                          className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                          placeholder="Bachelor of Science"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Start Date *
                        </label>
                        <input
                          type="text"
                          value={edu.start_date}
                          onChange={(e) =>
                            handleArrayChange(
                              'education',
                              index,
                              'start_date',
                              e.target.value
                            )
                          }
                          required
                          className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                          placeholder="2018"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          End Date *
                        </label>
                        <input
                          type="text"
                          value={edu.end_date}
                          onChange={(e) =>
                            handleArrayChange(
                              'education',
                              index,
                              'end_date',
                              e.target.value
                            )
                          }
                          required
                          className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                          placeholder="2022"
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-effect rounded-2xl p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-br from-primary-500 to-accent-500 p-3 rounded-xl">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">Experience</h2>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => addSection('experience')}
                className="px-4 py-2 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </motion.button>
            </div>

            <div className="space-y-6">
              <AnimatePresence>
                {formData.experience.map((exp, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="p-6 bg-slate-50 rounded-xl relative"
                  >
                    {formData.experience.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSection('experience', index)}
                        className="absolute top-4 right-4 p-2 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    )}

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Company *
                        </label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) =>
                            handleArrayChange(
                              'experience',
                              index,
                              'company',
                              e.target.value
                            )
                          }
                          required
                          className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                          placeholder="Company Name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Role *
                        </label>
                        <input
                          type="text"
                          value={exp.role}
                          onChange={(e) =>
                            handleArrayChange(
                              'experience',
                              index,
                              'role',
                              e.target.value
                            )
                          }
                          required
                          className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                          placeholder="Software Engineer"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Start Date *
                        </label>
                        <input
                          type="text"
                          value={exp.start_date}
                          onChange={(e) =>
                            handleArrayChange(
                              'experience',
                              index,
                              'start_date',
                              e.target.value
                            )
                          }
                          required
                          className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                          placeholder="Jan 2022"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          End Date *
                        </label>
                        <input
                          type="text"
                          value={exp.end_date}
                          onChange={(e) =>
                            handleArrayChange(
                              'experience',
                              index,
                              'end_date',
                              e.target.value
                            )
                          }
                          required
                          className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                          placeholder="Present"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Responsibilities
                      </label>
                      <textarea
                        value={exp.responsibilities}
                        onChange={(e) =>
                          handleArrayChange(
                            'experience',
                            index,
                            'responsibilities',
                            e.target.value
                          )
                        }
                        rows={4}
                        className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                        placeholder="Describe your key responsibilities and achievements..."
                      />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-effect rounded-2xl p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-br from-primary-500 to-accent-500 p-3 rounded-xl">
                  <FolderGit2 className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">Projects</h2>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => addSection('projects')}
                className="px-4 py-2 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </motion.button>
            </div>

            <div className="space-y-6">
              <AnimatePresence>
                {formData.projects.map((proj, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="p-6 bg-slate-50 rounded-xl relative"
                  >
                    {formData.projects.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSection('projects', index)}
                        className="absolute top-4 right-4 p-2 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    )}

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Project Name *
                        </label>
                        <input
                          type="text"
                          value={proj.project_name}
                          onChange={(e) =>
                            handleArrayChange(
                              'projects',
                              index,
                              'project_name',
                              e.target.value
                            )
                          }
                          required
                          className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                          placeholder="My Awesome Project"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Project URL
                        </label>
                        <input
                          type="url"
                          value={proj.project_url}
                          onChange={(e) =>
                            handleArrayChange(
                              'projects',
                              index,
                              'project_url',
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                          placeholder="https://github.com/username/project"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Description
                        </label>
                        <textarea
                          value={proj.description}
                          onChange={(e) =>
                            handleArrayChange(
                              'projects',
                              index,
                              'description',
                              e.target.value
                            )
                          }
                          rows={3}
                          className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                          placeholder="Brief description of the project..."
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-effect rounded-2xl p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-br from-primary-500 to-accent-500 p-3 rounded-xl">
                  <Code className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">Skills</h2>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => addSection('skills')}
                className="px-4 py-2 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </motion.button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence>
                {formData.skills.map((skill, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="relative"
                  >
                    <input
                      type="text"
                      value={skill.name}
                      onChange={(e) =>
                        handleArrayChange('skills', index, 'name', e.target.value)
                      }
                      required
                      className="w-full px-4 py-2 pr-10 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                      placeholder="JavaScript"
                    />
                    {formData.skills.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSection('skills', index)}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-red-100 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex justify-end space-x-4"
          >
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-8 py-4 bg-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-300 transition-colors"
            >
              Cancel
            </button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Create Resume</span>
                </>
              )}
            </motion.button>
          </motion.div>
        </form>
      </div>
    </div>
  );
};

export default CreateResumePage;
