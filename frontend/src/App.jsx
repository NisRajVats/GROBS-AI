import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Page Imports
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import CreateResumePage from './pages/CreateResumePage';
import PrintResumePage from './pages/PrintResumePage';
import AnalyzeResumePage from './pages/AnalyzeResumePage';
import EditResumePage from './pages/EditResumePage'; // 1. IMPORT NEW EDIT PAGE

// Component Imports
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// --- Navigation Component (No Changes) ---
function Navigation() {
  const auth = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { auth.logout(); navigate('/login'); };
  return (
    <nav className="sticky top-0 z-30 w-full bg-white/70 backdrop-blur supports-backdrop-filter:bg-white/60 border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="inline-flex items-center gap-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-r from-blue-600 to-indigo-600 text-white font-bold">G</span>
              <span className="text-lg font-semibold text-gray-900">GROBS.AI</span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            {auth.isLoggedIn ? (
              <button onClick={handleLogout} className="inline-flex items-center rounded-lg bg-gray-900 text-white px-3 py-2 text-sm font-medium shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900">
                Logout
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
                  Login
                </Link>
                <Link to="/register" className="inline-flex items-center rounded-lg bg-linear-to-r from-blue-600 to-indigo-600 text-white px-3 py-2 text-sm font-medium shadow-sm hover:from-blue-700 hover:to-indigo-700">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

// --- HomePage Component (Dashboard - UPDATED) ---
function HomePage() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const auth = useAuth();
  const token = localStorage.getItem('grobs-ai-token');

  useEffect(() => {
    const fetchResumes = async () => {
      if (!token) {
        auth.logout(); navigate('/login'); return;
      }
      try {
        const response = await axios.get('http://127.0.0.1:8000/resumes/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setResumes(response.data);
      } catch (error) {
        console.error('Error fetching resumes:', error);
        if (error.response?.status === 401) {
          alert("Session expired."); auth.logout(); navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchResumes();
  }, [auth, navigate, token]);

  const handleDelete = async (resumeId) => {
    try {
      await axios.delete(
        `http://127.0.0.1:8000/resume/${resumeId}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      setResumes(resumes.filter(resume => resume.id !== resumeId));
    } catch (error) {
      console.error('Error deleting resume:', error);
      alert("Could not delete resume.");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-indigo-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">Welcome to your dashboard</h1>
          <Link to="/create-resume" className="inline-flex items-center rounded-lg bg-linear-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 text-sm font-medium shadow-sm hover:from-blue-700 hover:to-indigo-700">
            + Create New Resume
          </Link>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900">Your Saved Resumes</h2>
          {loading ? (
            <p className="mt-4 text-gray-600">Loading...</p>
          ) : resumes.length === 0 ? (
            <p className="mt-4 text-gray-600">You haven't created any resumes yet.</p>
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {resumes.map((resume) => (
                <div key={resume.id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">{resume.full_name}</h3>
                    <p className="text-sm text-gray-600">{resume.email}</p>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link to="/print-preview" state={{ resume: resume }} className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
                      View & Print
                    </Link>
                    <Link to={`/resume/${resume.id}/analyze`} state={{ resume: resume }} className="inline-flex items-center rounded-lg bg-emerald-600 text-white px-3 py-1.5 text-sm font-medium hover:bg-emerald-700">
                      Analyze
                    </Link>
                    <Link to={`/edit-resume/${resume.id}`} className="inline-flex items-center rounded-lg bg-amber-400 text-gray-900 px-3 py-1.5 text-sm font-medium hover:bg-amber-500">
                      Edit
                    </Link>
                    <button onClick={() => handleDelete(resume.id)} className="inline-flex items-center rounded-lg bg-rose-600 text-white px-3 py-1.5 text-sm font-medium hover:bg-rose-700">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- App Component (Main Router - UPDATED) ---
function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <Navigation />
        <div className="pt-6">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/create-resume" element={<CreateResumePage />} />
              <Route path="/print-preview" element={<PrintResumePage />} />
              <Route path="/resume/:resumeId/analyze" element={<AnalyzeResumePage />} />
              
              {/* 3. ADD THE NEW EDIT ROUTE */}
              <Route path="/edit-resume/:resumeId" element={<EditResumePage />} />
            </Route>
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;