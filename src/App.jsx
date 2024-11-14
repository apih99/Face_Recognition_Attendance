import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import RegisterStudent from './components/RegisterStudent';
import AttendanceMarking from './components/AttendanceMarking';
import Records from './components/Records';
import Settings from './components/Settings';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Redirect from root to dashboard */}
          <Route index element={<Navigate to="/dashboard" replace />} />
          
          {/* Main routes */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="register" element={<RegisterStudent />} />
          <Route path="attendance" element={<AttendanceMarking />} />
          <Route path="records" element={<Records />} />
          <Route path="settings" element={<Settings />} />
          
          {/* Catch all route for 404 */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
