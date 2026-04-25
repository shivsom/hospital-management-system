import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

// Components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Appointments from './components/Appointments';
import Patients from './components/Patients';
import Doctors from './components/Doctors';
import MedicalRecords from './components/MedicalRecords';
import Bills from './components/Bills';
import ChatBot from './components/ChatBot';

// Services
import authService from './services/authService';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showChatbot, setShowChatbot] = useState(false);

  useEffect(() => {
    // Get user info from localStorage on app load
    const userData = authService.getCurrentUser();
    if (userData) {
      setUser(userData);
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    );
  }

  return (
    <Router>
      <div className="App">
        <Navbar user={user} onLogout={handleLogout} />
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-3 col-lg-2 p-0">
              <Sidebar user={user} />
            </div>
            <div className="col-md-9 col-lg-10 main-content p-4">
              <Routes>
                <Route path="/" element={<Dashboard user={user} />} />
                <Route path="/dashboard" element={<Dashboard user={user} />} />
                <Route path="/appointments" element={<Appointments user={user} />} />
                <Route path="/patients" element={<Patients user={user} />} />
                <Route path="/doctors" element={<Doctors user={user} />} />
                <Route path="/medical-records" element={<MedicalRecords user={user} />} />
                <Route path="/bills" element={<Bills user={user} />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </div>
          </div>
        </div>

        {/* Chatbot Toggle Button */}
        <button
          className="btn btn-primary position-fixed"
          style={{ bottom: '20px', right: '20px', borderRadius: '50%', width: '60px', height: '60px' }}
          onClick={() => setShowChatbot(!showChatbot)}
        >
          💬
        </button>

        {/* Chatbot */}
        {showChatbot && <ChatBot onClose={() => setShowChatbot(false)} />}
      </div>
    </Router>
  );
}

export default App;