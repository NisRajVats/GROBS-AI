import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Page Imports
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import CreateResumePage from './pages/CreateResumePage';
import PrintResumePage from './pages/PrintResumePage';
import AnalyzeResumePage from './pages/AnalyzeResumePage';

// Component Imports
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// --- Navigation Component ---
function Navigation() {
  const auth = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.logout();
    navigate('/login');
  };

  return (
    <nav style={{ padding: '1rem', backgroundColor: '#eee' }}>
      <Link to="/" style={{ marginRight: '1rem' }}>Home</Link>
      {auth.isLoggedIn ? (
        <button onClick={handleLogout}>Logout</button>
      ) : (
        <>
          <Link to="/login" style={{ marginRight: '1rem' }}>Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
}

// --- HomePage Component ---
function HomePage() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const auth = useAuth();

  useEffect(() => {
    const fetchResumes = async () => {
      const token = localStorage.getItem('grobs-ai-token');
      if (!token) {
        console.error('No token found');
        auth.logout();
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get('http://127.0.0.1:8000/resumes/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setResumes(response.data);
      } catch (error) {
        console.error('Error fetching resumes:', error);
        if (error.response?.status === 401) {
          alert("Session expired. Please log in again.");
          auth.logout();
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchResumes();
  }, [auth, navigate]);

  return (
    <div>
      <h1>Welcome to Your Dashboard</h1>
      <Link to="/create-resume" style={{ textDecoration: 'none' }}>
        <button style={{
          padding: '0.75rem 1.5rem',
          fontSize: '1rem',
          cursor: 'pointer',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          marginTop: '1rem'
        }}>
          + Create New Resume
        </button>
      </Link>

      <div style={{ marginTop: '2rem' }}>
        <h2>Your Saved Resumes</h2>
        {loading ? (
          <p>Loading...</p>
        ) : resumes.length === 0 ? (
          <p>You haven't created any resumes yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {resumes.map((resume) => (
              <div key={resume.id} style={{
                padding: '1rem',
                border: '1px solid #ccc',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <h3>{resume.full_name}</h3>
                  <p>{resume.email}</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {/* View/Print */}
                  <Link to="/print-preview" state={{ resume: resume }}>
                    <button style={{ padding: '0.5rem 1rem' }}>
                      View & Print
                    </button>
                  </Link>
                  {/* Analyze */}
                  <Link to="/analyze-resume" state={{ resume: resume }}>
                    <button style={{ padding: '0.5rem 1rem', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}>
                      Analyze
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// --- App Component ---
function App() {
  return (
    <BrowserRouter>
      <div>
        <Navigation />
        <div style={{ padding: '2rem' }}>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/create-resume" element={<CreateResumePage />} />
              <Route path="/print-preview" element={<PrintResumePage />} />
              <Route path="/analyze-resume" element={<AnalyzeResumePage />} />
            </Route>
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
