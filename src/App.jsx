import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import MainLayout from './components/MainLayout';
import HomeFeed from './pages/HomeFeed';
import Reservations from './pages/Reservations';
import AdminDashboard from './pages/AdminDashboard';
import Spaces from './pages/Spaces';
import Messages from './pages/Messages'; // <-- IMPORT THIS

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/admin" element={<AdminDashboard />} />

        <Route path="/dashboard" element={<MainLayout />}>
          <Route index element={<HomeFeed />} />
          <Route path="reservations" element={<Reservations />} />
          <Route path="spaces" element={<Spaces />} />
          <Route path="messages" element={<Messages />} /> {/* <-- UPDATE THIS ROUTE */}
          <Route path="profile" element={<div className="p-8 text-center text-slate-400 bg-slate-900/50 rounded-2xl border border-white/5">Profile Coming Soon</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;