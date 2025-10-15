import React from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import UpcomingEvent from '../components/UpcomingEvent';
import PreviousEventGallery from '../components/PreviousEventGallery';
import EventCalendar from '../components/EventCalendar';
import BookingSection from '../components/BookingSection';
import AboutSection from '../components/AboutSection';
import ContactSection from '../components/ContactSection';

const Home: React.FC = () => {
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