import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import Gallery from './pages/Gallery';
import AboutUs from './pages/AboutUs';
import Contact from './pages/Contact';
import Artists from './pages/Artists';
import Booking from './pages/Booking';
import BookingHome from './pages/BookingHome';
import BookingArtists from './pages/BookingArtists';
import ArtistPage from './pages/ArtistPage';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Header from './components/Header';
import PlatformRouter from './components/PlatformRouter';
import { useAuth } from './hooks/useAuth';
import { AuthProvider } from './contexts/AuthContext';

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

const AppContent = () => {
  const location = useLocation();
  const isAdminPage = location.pathname === '/admin';
  const isLoginPage = location.pathname === '/login';
  const isBookingPage = location.pathname.startsWith('/booking');
  const isEventsPage = location.pathname.startsWith('/events');

  return (
    <div className="relative min-h-screen">
      {!isAdminPage && !isLoginPage && (
        <div className={`fixed inset-0 bg-gradient-to-br -z-10 ${
          isBookingPage 
            ? 'from-blue-900 via-cyan-900 to-indigo-900'
            : 'from-purple-900 via-blue-900 to-indigo-900'
        }`} />
      )}
      <div className="relative z-10">
        {!isAdminPage && !isLoginPage && <Header />}
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:eventId" element={<EventDetails />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/artists" element={<Artists />} />
            <Route path="/booking" element={<BookingHome />} />
            <Route path="/booking/artists" element={<BookingArtists />} />
            <Route path="/booking/artists/:artistName" element={<ArtistPage />} />
            <Route path="/booking/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<PrivateRoute><Admin /></PrivateRoute>} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <PlatformRouter>
          <AppContent />
        </PlatformRouter>
      </AuthProvider>
    </Router>
  );
};

export default App;