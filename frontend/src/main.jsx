import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
// We're assuming you have an index.css, if not, you can remove this line
import './index.css' 


// 1. Import our new AuthProvider
import { AuthProvider } from './context/AuthContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 2. Wrap the <App /> component with it */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
)