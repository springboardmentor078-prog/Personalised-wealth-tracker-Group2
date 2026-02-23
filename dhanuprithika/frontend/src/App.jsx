import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Goals from './pages/Goals';
import Portfolio from './pages/Portfolio';
import Investments from './pages/Investments';
import Transactions from './pages/Transactions';
import Profile from './pages/Profile';
import Reports from './pages/Reports';

const AppContent = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <Register />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/goals" element={<Goals />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/investments" element={<Investments />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* Fallback route */}
      <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
