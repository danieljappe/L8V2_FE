import React, { useState, useEffect } from 'react';
import { Menu, X, Music, Calendar, Info, Phone, Instagram, Facebook, Youtube, Image, Users, Settings } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Breadcrumbs from './Breadcrumbs';
import { motion, AnimatePresence } from 'framer-motion';
import { getPlatformFromPath } from '../utils/subdomainUtils';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // Get navigation items based on current platform
  const getNavItems = () => {
    const platform = getPlatformFromPath();
    
    if (platform === 'booking') {
      return [
        { name: 'Kunstnere', path: '/booking/artists', icon: Users },
        { name: 'Book', path: '/booking', icon: Music },
        { name: 'Om Os', path: '/booking/about', icon: Info }
      ];
    } else {
      // Events platform navigation
      return [
        { name: 'Begivenheder', path: '/events', icon: Calendar },
        { name: 'Kunstnere', path: '/artists', icon: Users },
        { name: 'Galleri', path: '/gallery', icon: Image },
        { name: 'Om Os', path: '/about', icon: Info },
        { name: 'Kontakt', path: '/contact', icon: Phone },
        { name: 'Admin', path: '/admin', icon: Settings }
      ];
    }
  };

  const navItems = getNavItems();

  // Platform switch handler
  const handlePlatformSwitch = () => {
    const platform = getPlatformFromPath();
    if (platform === 'booking') {
      navigate('/events');
    } else {
      navigate('/booking');
    }
  };

  const socialLinks = [
    { name: 'Instagram', icon: Instagram, href: 'https://instagram.com' },
    { name: 'Facebook', icon: Facebook, href: 'https://facebook.com' },
    { name: 'YouTube', icon: Youtube, href: 'https://youtube.com' }
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black/80 backdrop-blur-lg' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo and Platform Switch */}
          <div className="flex items-center space-x-3">
            {/* Platform Switch Icon */}
            <button
              onClick={handlePlatformSwitch}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300 text-white/80 hover:text-white"
              title={`Switch to ${getPlatformFromPath() === 'booking' ? 'Events' : 'Booking'}`}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-5 h-5"
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </motion.div>
            </button>

            <Link to={getPlatformFromPath() === 'booking' ? '/booking' : '/'}>
              <div className="flex items-center space-x-2">
                <img 
                  src="/l8logo.png" 
                  alt="L8 Logo" 
                  className="w-10 h-10 object-contain rounded-xl"
                />
                <span className="text-white font-bold text-xl">
                  {getPlatformFromPath() === 'booking' ? 'Booking' : 'Events'}
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.path} to={item.path}>
                  <div
                    className={`flex items-center space-x-2 px-3 py-2 rounded-xl transition-colors whitespace-nowrap ${
                      location.pathname === item.path
                        ? 'bg-white/10 text-white'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </div>
                </Link>
              );
            })}
            
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-white/60 hover:text-white"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Breadcrumbs - Show on all pages except root */}
        {location.pathname !== '/' && (
          <div className="pb-4">
            <Breadcrumbs />
          </div>
        )}
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm md:hidden"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`fixed top-0 right-0 h-full w-[240px] bg-gradient-to-br backdrop-blur-xl border-l border-white/10 shadow-2xl md:hidden ${
                getPlatformFromPath() === 'booking' 
                  ? 'from-booking-dark/95 via-booking-dark/95 to-booking-teal-dark/95'
                  : 'from-l8-dark/95 via-l8-blue-dark/95 to-l8-blue/95'
              }`}
            >
              <div className="flex flex-col h-full">
                {/* Menu Header */}
                <div className="p-4 border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <img 
                        src="/l8logo.png" 
                        alt="L8 Logo" 
                        className="w-8 h-8 object-contain rounded-lg"
                      />
                      <span className="text-white font-bold text-lg">
                        {getPlatformFromPath() === 'booking' ? 'L8 Booking' : 'L8'}
                      </span>
                    </div>
                    <button
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-2 text-white/60 hover:text-white transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Navigation Items */}
                <nav className="flex-1 flex items-center justify-center">
                  <div className="w-full px-4 space-y-4">
                    {navItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block"
                        >
                          <motion.div
                            whileHover={{ x: 5 }}
                            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                              location.pathname === item.path
                                ? 'bg-white/10 text-white shadow-lg'
                                : 'text-white/60 hover:text-white hover:bg-white/5'
                            }`}
                          >
                            <Icon className="w-5 h-5" />
                            <span className="text-base">{item.name}</span>
                          </motion.div>
                        </Link>
                      );
                    })}
                    
                    {/* Platform Switch Button */}
                    <div className="border-t border-white/20 pt-4">
                      <motion.button
                        whileHover={{ x: 5 }}
                        onClick={() => {
                          handlePlatformSwitch();
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 text-white/60 hover:text-white hover:bg-white/5"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                        <span className="text-base">
                          Switch to {getPlatformFromPath() === 'booking' ? 'Events' : 'Booking'}
                        </span>
                      </motion.button>
                    </div>
                  </div>
                </nav>

                {/* Social Links */}
                <div className="p-4 border-t border-white/10">
                  <div className="flex justify-center space-x-4">
                    {socialLinks.map((social) => {
                      const Icon = social.icon;
                      return (
                        <motion.a
                          key={social.name}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.1, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white/60 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                          <Icon className="w-5 h-5" />
                        </motion.a>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;