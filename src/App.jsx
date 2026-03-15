import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import MainLayout from './components/MainLayout';
import HomeFeed from './pages/HomeFeed';
import Reservations from './pages/Reservations';
import AdminDashboard from './pages/AdminDashboard';
import Spaces from './pages/Spaces';
import Messages from './pages/Messages';
import Profile from './pages/Profile';
import Schedule from './pages/Schedule';
import AdminOnboarding from './pages/AdminOnboarding';
import SuperAdminDashboard from './pages/SuperAdminDashboard';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/onboarding" element={<AdminOnboarding />} />
        <Route path="/superadmin" element={<SuperAdminDashboard />} />


        {/* The Dashboard Shell */}
        <Route path="/dashboard" element={<MainLayout />}>
          <Route index element={<HomeFeed />} />
          <Route path="schedule" element={<Schedule />} />
          <Route path="reservations" element={<Reservations />} />
          <Route path="spaces" element={<Spaces />} />
          <Route path="messages" element={<Messages />} />
          <Route path="profile" element={<Profile />} />


        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;