import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, ArrowRight } from 'lucide-react';
import UpcomingEvent from '../components/UpcomingEvent';
import PreviousEventGallery from '../components/PreviousEventGallery';
import { getRedirectUrl } from '../utils/subdomainUtils';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Main Content */}
      <main className="relative z-10">
        <UpcomingEvent />
        <PreviousEventGallery />
        
        {/* Quick Navigation Section */}
        <section className="min-h-screen flex items-center justify-center p-4 snap-start pt-20">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
                Explore L8 Events
              </h2>
              <p className="text-white/70 text-base sm:text-lg max-w-2xl mx-auto px-4">
                Discover upcoming events, browse our gallery, or book your favorite artists for your next event.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Events Navigation */}
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="group cursor-pointer"
                onClick={() => {
                  const redirectUrl = getRedirectUrl('events');
                  window.location.href = redirectUrl;
                }}
              >
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-2xl hover:bg-white/15 transition-all duration-300 hover:scale-105">
                  <div className="flex items-center justify-center w-16 h-16 bg-purple-500/20 rounded-2xl mb-6 mx-auto group-hover:bg-purple-500/30 transition-colors">
                    <Calendar className="w-8 h-8 text-purple-300" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Events</h3>
                  <p className="text-white/70 mb-6">
                    Discover our upcoming events and immerse yourself in the world of electronic music.
                  </p>
                  <div className="flex items-center justify-center text-purple-300 group-hover:text-purple-200 transition-colors">
                    <span className="mr-2">Explore Events</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>

              {/* Booking Navigation */}
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="group cursor-pointer"
                onClick={() => {
                  const redirectUrl = getRedirectUrl('booking');
                  window.location.href = redirectUrl;
                }}
              >
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-2xl hover:bg-white/15 transition-all duration-300 hover:scale-105">
                  <div className="flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-2xl mb-6 mx-auto group-hover:bg-blue-500/30 transition-colors">
                    <Users className="w-8 h-8 text-blue-300" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Booking</h3>
                  <p className="text-white/70 mb-6">
                    Book talented artists for your events and create unforgettable experiences.
                  </p>
                  <div className="flex items-center justify-center text-blue-300 group-hover:text-blue-200 transition-colors">
                    <span className="mr-2">Book Artists</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home; 