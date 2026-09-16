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
import StudentGroup from './pages/StudentGroup';
import StudentTeachers from './pages/StudentTeachers';
import ProfDirectory from './pages/ProfDirectory';


import Schedule from './pages/Schedule';
import AdminOnboarding from './pages/AdminOnboarding';
import PendingVerification from './pages/PendingVerification';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import ProfDashboard from './pages/ProfDashboard';


import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <Toaster 
        position="top-right" 
        toastOptions={{ 
          className: 'bg-slate-900 text-white border border-white/10',
          style: {
            background: '#0f172a',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
          }
        }} 
      />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/onboarding" element={<AdminOnboarding />} />
          <Route path="/pending" element={<PendingVerification />} />
          <Route path="/superadmin" element={<SuperAdminDashboard />} />
          <Route path="/prof" element={<ProfDashboard />} />


          {/* The Dashboard Shell */}
          <Route path="/dashboard" element={<MainLayout />}>
            <Route index element={<HomeFeed />} />
            <Route path="schedule" element={<Schedule />} />
            <Route path="reservations" element={<Reservations />} />
            <Route path="spaces" element={<Spaces />} />
            <Route path="messages" element={<Messages />} />
            <Route path="profile" element={<Profile />} />
            <Route path="group" element={<StudentGroup />} />
            <Route path="teachers" element={<StudentTeachers />} />
            <Route path="directory" element={<ProfDirectory />} />




          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;