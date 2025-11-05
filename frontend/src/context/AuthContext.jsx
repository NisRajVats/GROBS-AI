import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// 1. Create the context
const AuthContext = createContext(null);

// 2. Create the AuthProvider component
export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('grobs-ai-token'));

  // 3. This effect runs on app load
  // It checks if a token exists in localStorage and sets up axios
  useEffect(() => {
    const storedToken = localStorage.getItem('grobs-ai-token');
    if (storedToken) {
      setToken(storedToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }
  }, []); // Empty array means this runs only once on mount

  // 4. Login function
  // This will be called from our LoginPage
  const login = (newToken) => {
    setToken(newToken);
    localStorage.setItem('grobs-ai-token', newToken);
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
  };

  // 5. Logout function
  // This will be called from our new Logout button
  const logout = () => {
    setToken(null);
    localStorage.removeItem('grobs-ai-token');
    delete axios.defaults.headers.common['Authorization'];
  };

  // 6. The value we share with the rest of the app
  const value = {
    token,
    isLoggedIn: !!token, // A simple boolean: true if token exists, false if not
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// 7. A custom "hook" to make it easy to use our context
export function useAuth() {
  return useContext(AuthContext);
}