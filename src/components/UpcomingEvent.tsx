import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, Music, Ticket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ArtistModal from './ArtistModal';
import LoadingSpinner from './LoadingSpinner';
import { useEvents, useArtists } from '../hooks/useApi';
import { Artist, Event } from '../services/api';

const UpcomingEvent: React.FC = () => {
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const navigate = useNavigate();

  // Fetch events and artists from API
  const { data: events, loading: eventsLoading, error: eventsError } = useEvents();
  const { data: artists, loading: artistsLoading, error: artistsError } = useArtists();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  // Get the next upcoming event
  const upcomingEvent = events?.find(event => {
    const eventDate = new Date(event.date);
    const today = new Date();
    return eventDate >= today;
  });

  // Get artists for the upcoming event
  const eventArtists = upcomingEvent?.eventArtists?.map(ea => ea.artist) || [];

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (upcomingEvent) {
      navigate(`/events/${upcomingEvent.id}`, { replace: true });
    }
  };

  // Show loading state
  if (eventsLoading || artistsLoading) {
    return (
      <section id="events" className="min-h-screen flex items-center justify-center p-4 snap-start pt-20">
        <LoadingSpinner size="lg" text="Loading upcoming events..." />
      </section>
    );
  }

  // Show error state
  if (eventsError || artistsError) {
    return (
      <section id="events" className="min-h-screen flex items-center justify-center p-4 snap-start pt-20">
        <div className="text-center">
          <p className="text-red-400 mb-4">Failed to load events</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  // Show fallback if no upcoming events
  if (!upcomingEvent) {
    return (
      <section id="events" className="min-h-screen flex items-center justify-center p-4 snap-start pt-20">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">No Upcoming Events</h2>
          <p className="text-white/70">Check back soon for new events!</p>
        </div>
      </section>
    );
  }

  // Format event date
  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('da-DK', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <section id="events" className="min-h-screen flex items-center justify-center p-4 snap-start pt-20">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="container mx-auto max-w-4xl"
      >
        <motion.button 
          onClick={handleClick}
          className="w-full text-left"
          style={{ background: 'none', border: 'none', padding: 0 }}
        >
          <motion.div 
            variants={itemVariants}
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-6 sm:p-8 md:p-12 shadow-2xl transition-all duration-300"
          >
            {/* Event Badge */}
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center px-3 py-2 sm:px-4 bg-purple-500/20 backdrop-blur-sm rounded-full border border-purple-300/30 mb-4 sm:mb-6"
            >
              <Ticket className="w-4 h-4 text-purple-300 mr-2" />
              <span className="text-purple-200 text-xs sm:text-sm font-medium">Næste Begivenhed</span>
            </motion.div>

            {/* Event Title */}
            <motion.h1 
              variants={itemVariants}
              className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight"
            >
              {upcomingEvent.title}
              <motion.span 
                variants={itemVariants}
                className="block text-purple-300 text-lg sm:text-2xl md:text-3xl font-medium mt-2"
              >
                {upcomingEvent.venue?.name || 'Multi-Kunstner Oplevelse'}
              </motion.span>
            </motion.h1>

            {/* Event Details */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8"
            >
              {[
                { icon: Calendar, label: 'Dato', value: formatEventDate(upcomingEvent.date), color: 'blue' },
                { icon: Clock, label: 'Tidspunkt', value: upcomingEvent.startTime || '21:00 - 03:00', color: 'green' },
                { icon: MapPin, label: 'Sted', value: upcomingEvent.venue?.name || 'Warehouse District', color: 'orange' }
              ].map((detail, index) => (
                <motion.div
                  key={detail.label}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="flex items-center space-x-3 text-white/80 bg-white/5 p-3 sm:p-4 rounded-2xl border border-white/10"
                >
                  <div className={`p-2 sm:p-3 bg-${detail.color}-500/20 rounded-xl`}>
                    <detail.icon className="w-4 h-4 sm:w-5 sm:h-5 text-${detail.color}-300" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm text-white/60">{detail.label}</p>
                    <p className="font-semibold text-sm sm:text-base truncate">{detail.value}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Artists */}
            <motion.div variants={itemVariants} className="mb-6 sm:mb-8">
              <motion.h3 
                variants={itemVariants}
                className="text-lg sm:text-xl font-semibold text-white mb-4 flex items-center"
              >
                <Music className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-purple-300" />
                Fremhævede Kunstnere
              </motion.h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                {eventArtists.slice(0, 4).map((artist, index) => (
                  <motion.div
                    key={artist.id}
                    variants={itemVariants}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedArtist(artist);
                    }}
                    className="bg-white/5 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/10 cursor-pointer group"
                  >
                    <motion.div 
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-2 sm:mb-3 mx-auto overflow-hidden"
                    >
                      <img 
                        src={artist.image || 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=300'} 
                        alt={artist.name}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                    <p className="text-white font-medium text-center text-xs sm:text-sm group-hover:text-purple-300 transition-colors duration-300">{artist.name}</p>
                    <p className="text-purple-300 text-center text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">{artist.genre}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Event Description */}
            {upcomingEvent.description && (
              <motion.div variants={itemVariants} className="mb-6 sm:mb-8">
                <motion.p 
                  variants={itemVariants}
                  className="text-white/80 text-sm sm:text-base leading-relaxed"
                >
                  {upcomingEvent.description}
                </motion.p>
              </motion.div>
            )}

            {/* CTA Button */}
            <motion.div variants={itemVariants} className="text-center">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 mx-auto text-sm sm:text-base"
              >
                <Ticket className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Book Billetter</span>
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.button>
      </motion.div>

      {/* Artist Modal */}
      {selectedArtist && (
        <ArtistModal
          artist={selectedArtist}
          onClose={() => setSelectedArtist(null)}
        />
      )}
    </section>
  );
};

export default UpcomingEvent;