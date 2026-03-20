import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import EventDetails from './pages/EventDetails';
import EventMap from './pages/EventMap';
import MyTickets from './pages/MyTickets';
import CreateEvent from './pages/CreateEvent';
import LocationSelector from './pages/LocationSelector';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import OrganizerDashboard from './pages/OrganizerDashboard';
import QRScanner from './pages/QRScanner';
import AdminDashboard from './pages/AdminDashboard';
import PaymentConfirm from './pages/PaymentConfirm';
import PayoutPage from './pages/PayoutPage';
import TransactionAnalytics from './pages/TransactionAnalytics';
import EventAnalytics from './pages/EventAnalytics';
import AdminEventStats from './pages/AdminEventStats';
import SubscriptionUpgrade from './pages/SubscriptionUpgrade';
import DemographicInsights from './pages/DemographicInsights';
import Features from './pages/Features';
import UserDashboard from './pages/UserDashboard';
import Browse from './pages/Browse';
import OrganizerProfile from './pages/OrganizerProfile';
import Settings from './pages/Settings';
import Chat from './pages/Chat';
import SocialFeed from './pages/SocialFeed';
import Blog from './pages/Blog';
import Holidays from './pages/Holidays';
import Sidebar from './components/Sidebar';
import { SocketProvider } from './context/SocketContext';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Router>
          <div className="App">
            <Navbar />
            <Sidebar />
            <div style={{ marginLeft: '250px' }}>
              <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/event/:id" element={<EventDetails />} />
            <Route path="/map/:id" element={<EventMap />} />
            <Route path="/payment-confirm/:ticketId" element={<PaymentConfirm />} />
            <Route path="/payout" element={<PayoutPage />} />
            <Route path="/transaction-analytics" element={<TransactionAnalytics />} />
            <Route path="/event-analytics/:eventId" element={<EventAnalytics />} />
            <Route path="/admin-event-stats/:eventId" element={<AdminEventStats />} />
            <Route path="/my-tickets" element={<MyTickets />} />
            <Route path="/create-event" element={<CreateEvent />} />
            <Route path="/location-selector" element={<LocationSelector />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/dashboard" element={<OrganizerDashboard />} />
            <Route path="/scanner" element={<QRScanner />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/subscription" element={<SubscriptionUpgrade />} />
            <Route path="/demographics/:eventId" element={<DemographicInsights />} />
            <Route path="/features" element={<Features />} />
            <Route path="/user-dashboard" element={<UserDashboard />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/organizer/:id" element={<OrganizerProfile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/feed" element={<SocialFeed />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/holidays" element={<Holidays />} />
          </Routes>
            </div>
        </div>
      </Router>
    </SocketProvider>
  </AuthProvider>
  );
}

export default App;
