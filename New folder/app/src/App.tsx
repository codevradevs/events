import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useEventStore } from '@/store/eventStore';

// Pages
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Feed from '@/pages/Feed';
import Events from '@/pages/Events';
import EventDetail from '@/pages/EventDetail';
import Profile from '@/pages/Profile';
import Tickets from '@/pages/Tickets';
import Groups from '@/pages/Groups';
import Chat from '@/pages/Chat';
import OrganizerDashboard from '@/pages/OrganizerDashboard';
import AdminPanel from '@/pages/AdminPanel';
import CreateEvent from '@/pages/CreateEvent';
import NotFound from '@/pages/NotFound';

// Components
import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';

function App() {
  const { isAuthenticated, user } = useAuthStore();
  const { fetchEvents } = useEventStore();

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return (
    <Router>
      <div className="min-h-screen bg-[#07070A] text-[#F4F4F5]">
        <Navbar />
        <main className="pb-20 md:pb-0">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<EventDetail />} />
            <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/feed" />} />
            <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/feed" />} />
            
            {/* Protected Routes */}
            <Route path="/feed" element={isAuthenticated ? <Feed /> : <Navigate to="/login" />} />
            <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/tickets" element={isAuthenticated ? <Tickets /> : <Navigate to="/login" />} />
            <Route path="/groups" element={isAuthenticated ? <Groups /> : <Navigate to="/login" />} />
            <Route path="/chat" element={isAuthenticated ? <Chat /> : <Navigate to="/login" />} />
            <Route path="/chat/:id" element={isAuthenticated ? <Chat /> : <Navigate to="/login" />} />
            
            {/* Organizer Routes */}
            <Route 
              path="/organizer" 
              element={isAuthenticated && (user?.role === 'event-worker' || user?.role === 'admin') ? 
                <OrganizerDashboard /> : <Navigate to="/" />} 
            />
            <Route 
              path="/create-event" 
              element={isAuthenticated && (user?.role === 'event-worker' || user?.role === 'admin') ? 
                <CreateEvent /> : <Navigate to="/" />} 
            />
            
            {/* Admin Routes */}
            <Route 
              path="/admin" 
              element={isAuthenticated && user?.role === 'admin' ? 
                <AdminPanel /> : <Navigate to="/" />} 
            />
            
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <BottomNav />
      </div>
    </Router>
  );
}

export default App;