import React, { useState, useEffect } from 'react'; // 1. Import useState and useEffect
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // 2. Import axios

// Page Imports
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import CreateResumePage from './pages/CreateResumePage';

// Component Imports
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// --- Navigation Component (No Changes) ---
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

// --- HomePage Component (This is your Dashboard - UPDATED) ---
function HomePage() {
  // 3. State to hold the list of resumes
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  // 4. useEffect to fetch resumes when the page loads
  useEffect(() => {
    const fetchResumes = async () => {
      try {
        // Call our new backend endpoint
        const response = await axios.get('http://127.0.0.1:8000/resumes/');
        setResumes(response.data); // Store the list in state
        setLoading(false);
      } catch (error) {
        console.error('Error fetching resumes:', error);
        setLoading(false);
      }
    };

    fetchResumes();
  }, []); // The empty array [] means this runs once when the component mounts

  return (
    <div>
      <h1>Welcome to Your Dashboard</h1>
      <p>This is where your saved resumes and other tools will appear.</p>
      
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

      {/* 5. Display the list of resumes */}
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
                borderRadius: '8px' 
              }}>
                <h3>{resume.full_name}</h3>
                <p>{resume.email}</p>
                {/* We'll add a "View" button here later */}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


// --- App Component (Main Router - No Changes) ---
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
            </Route>
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;