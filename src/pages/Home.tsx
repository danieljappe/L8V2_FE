import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import PlatformChoice from '../components/PlatformChoice';
import UpcomingEvent from '../components/UpcomingEvent';
import PreviousEventGallery from '../components/PreviousEventGallery';
import EventCalendar from '../components/EventCalendar';
import BookingSection from '../components/BookingSection';
import AboutSection from '../components/AboutSection';
import ContactSection from '../components/ContactSection';

const Home: React.FC = () => {
  const [showPlatformChoice, setShowPlatformChoice] = useState(true);

  // Check if user has made a platform choice or is coming from a specific route
  useEffect(() => {
    const platformChoice = localStorage.getItem('l8-platform-choice');
    const currentPath = window.location.pathname;
    
    // If user has already chosen a platform or is on a specific page, show the old home
    if (platformChoice || currentPath !== '/') {
      setShowPlatformChoice(false);
    }
  }, []);

  const handlePlatformChoice = (platform: string) => {
    localStorage.setItem('l8-platform-choice', platform);
    setShowPlatformChoice(false);
  };

  if (showPlatformChoice) {
    return <PlatformChoice />;
  }

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="relative z-10 snap-y snap-mandatory h-screen overflow-y-scroll">
        <UpcomingEvent />
        <PreviousEventGallery />
        <EventCalendar />
        <BookingSection />
        <AboutSection />
        <ContactSection />
      </main>
    </div>
  );
};

export default Home; 