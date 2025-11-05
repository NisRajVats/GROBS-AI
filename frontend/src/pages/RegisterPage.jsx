import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    // 1. Prevent the browser from refreshing the page
    e.preventDefault();
    
    // 2. Clear any previous errors
    setError('');

    // 3. This is our API call
    try {
      // Send the email and password to the backend
      const response = await axios.post('http://127.0.0.1:8000/register/', {
        email: email,
        password: password
      });

      console.log('Registration successful:', response.data);
      
      // 4. If successful, send the user to the login page
      navigate('/login');

    } catch (err) {
      // 5. If the API returns an error...
      console.error('Registration error:', err);
      if (err.response && err.response.data) {
        // Show the specific error message from the backend
        // (e.g., "Email already registered")
        setError(err.response.data.detail);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <div>
      <h1>Register for GROBS.AI</h1>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '300px' }}>
        
        <label htmlFor="email" style={{ marginTop: '1rem' }}>Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: '0.5rem' }}
        />
        
        <label htmlFor="password" style={{ marginTop: '1rem' }}>Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: '0.5rem' }}
        />
        
        <button 
          type="submit" 
          style={{ marginTop: '1.5rem', padding: '0.75rem', cursor: 'pointer' }}
        >
          Register
        </button>

        {/* 6. Show the error message if 'error' state is not empty */}
        {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
      </form>
    </div>
  );
}

export default RegisterPage;