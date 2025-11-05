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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xl">G</span>
          </div>
          <h1 className="mt-6 text-3xl font-bold text-gray-900">Create your account</h1>
          <p className="mt-2 text-sm text-gray-600">Join GROBS.AI to craft standout resumes</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="w-full inline-flex justify-center rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 text-sm font-medium shadow-sm hover:from-blue-700 hover:to-indigo-700">
            Create account
          </button>

          {error && <p className="text-sm text-rose-600">{error}</p>}

          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <button type="button" onClick={() => navigate('/login')} className="font-medium text-blue-600 hover:text-blue-500">Sign in</button>
          </p>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;