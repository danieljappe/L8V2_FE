import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Music, Ticket, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';
import { useEvents } from '../hooks/useApi';
import { Event } from '../services/api';
import { constructFullUrl } from '../utils/imageUtils';

interface ProcessedEvent extends Event {
  status: 'upcoming' | 'past';
  color: string;
  artists: string[];
}

const EventList: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<ProcessedEvent | null>(null);
  const navigate = useNavigate();

  // Fetch events from API
  const { data: events, loading, error } = useEvents();

  // Process events data
  const processedEvents: ProcessedEvent[] = events?.map(event => ({
    ...event,
    status: new Date(event.date) >= new Date() ? 'upcoming' : 'past',
    color: getEventColor(event.id),
    artists: event.eventArtists?.map(ea => ea.artist.name) || []
  })) || [];

  function getEventColor(eventId: string): string {
    const colors = ['l8-blue', 'l8-beige', 'l8-blue-light', 'l8-beige-dark', 'l8-blue-dark', 'l8-beige-light'];
    // Simple hash function to convert string to number
    let hash = 0;
    for (let i = 0; i < eventId.length; i++) {
      const char = eventId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return colors[Math.abs(hash) % colors.length];
  }

  // Sort events by date (latest first)
  const sortedEvents = [...processedEvents].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const getColorClasses = (color: string) => {
    const colors = {
      'l8-blue': 'bg-l8-blue/20 border-l8-blue/30 text-l8-blue-light',
      'l8-beige': 'bg-l8-beige/20 border-l8-beige/30 text-l8-beige-light',
      'l8-blue-light': 'bg-l8-blue-light/20 border-l8-blue-light/30 text-l8-blue',
      'l8-beige-dark': 'bg-l8-beige-dark/20 border-l8-beige-dark/30 text-l8-beige',
      'l8-blue-dark': 'bg-l8-blue-dark/20 border-l8-blue-dark/30 text-l8-blue-light',
      'l8-beige-light': 'bg-l8-beige-light/20 border-l8-beige-light/30 text-l8-beige-dark'
    };
    return colors[color as keyof typeof colors] || colors['l8-blue'];
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
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

  // Show loading state
  if (loading) {
    return (
      <section className="min-h-screen flex items-center justify-center p-4 snap-start pt-20 lg:pt-16">
        <LoadingSpinner size="lg" text="Loading events..." />
      </section>
    );
  }

  // Show error state
  if (error) {
    return (
      <section className="min-h-screen flex items-center justify-center p-4 snap-start pt-20 lg:pt-16">
        <div className="text-center">
          <p className="text-red-400 mb-4">Failed to load events</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-l8-blue hover:bg-l8-blue-dark text-white px-4 py-2 rounded-lg"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  // Show empty state
  if (!events || events.length === 0) {
    return (
      <section className="min-h-screen flex items-center justify-center p-4 snap-start pt-20 lg:pt-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">No Events Found</h2>
          <p className="text-white/70">Check back soon for upcoming events!</p>
        </div>
      </section>
    );
  }

  if (selectedEvent) {
    return (
      <section className="min-h-screen flex items-center justify-center p-4 snap-start pt-20 lg:pt-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container mx-auto max-w-4xl"
        >
          <motion.div 
            className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-6 sm:p-8 shadow-2xl"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedEvent(null)}
              className="flex items-center text-white/80 hover:text-white mb-6"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Tilbage til begivenheder
            </motion.button>

            <motion.h2 
              className="text-3xl sm:text-4xl font-bold text-white mb-4"
            >
              {selectedEvent.title}
            </motion.h2>

            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6"
            >
              <div className="flex items-center space-x-3 text-white/80 bg-white/5 p-3 rounded-2xl">
                <Calendar className="w-5 h-5 text-l8-beige" />
                <div>
                  <p className="text-sm text-white/60">Dato</p>
                  <p className="font-semibold">
                    {new Date(selectedEvent.date).toLocaleDateString('da-DK', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3 text-white/80 bg-white/5 p-3 rounded-2xl">
                <Clock className="w-5 h-5 text-l8-beige" />
                <div>
                  <p className="text-sm text-white/60">Tidspunkt</p>
                  <p className="font-semibold">{selectedEvent.startTime || '21:00'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 text-white/80 bg-white/5 p-3 rounded-2xl">
                <MapPin className="w-5 h-5 text-l8-beige" />
                <div>
                  <p className="text-sm text-white/60">Sted</p>
                  <p className="font-semibold">{selectedEvent.venue?.name || 'TBA'}</p>
                </div>
              </div>
            </motion.div>

            <motion.div className="mb-6">
              <motion.h3 className="text-xl font-semibold text-white mb-3 flex items-center">
                <Music className="w-5 h-5 mr-2 text-l8-beige" />
                Kunstnere
              </motion.h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {selectedEvent.eventArtists?.map((eventArtist, index) => (
                  <motion.div
                    key={eventArtist.id}
                    className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-l8-blue to-l8-blue-light rounded-full mb-2 mx-auto overflow-hidden">
                      <img 
                        src={eventArtist.artist.imageUrl ? constructFullUrl(eventArtist.artist.imageUrl) : 'https://via.placeholder.com/300x300/1a1a2e/ffffff?text=Artist'} 
                        alt={eventArtist.artist.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback to stock photo if artist image fails to load
                          const target = e.target as HTMLImageElement;
                          if (target.src !== 'https://via.placeholder.com/300x300/1a1a2e/ffffff?text=Artist') {
                            target.src = 'https://via.placeholder.com/300x300/1a1a2e/ffffff?text=Artist';
                          }
                        }}
                      />
                    </div>
                    <p className="text-white font-medium text-center text-sm">{eventArtist.artist.name}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div className="mb-6">
              <motion.h3 className="text-xl font-semibold text-white mb-3">
                Om Begivenheden
              </motion.h3>
              <motion.p className="text-white/80 leading-relaxed">
                {selectedEvent.description}
              </motion.p>
            </motion.div>

            {selectedEvent.status === 'upcoming' && (
              <motion.div className="text-center">
                <motion.button 
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(`/events/${selectedEvent.id}`)}
                  className="bg-gradient-to-r from-l8-blue to-l8-blue-light hover:from-l8-blue-dark hover:to-l8-blue text-white font-semibold px-6 py-3 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 mx-auto"
                >
                  <Ticket className="w-5 h-5" />
                  <span>Se Detaljer & Køb Billetter</span>
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="min-h-screen flex items-center justify-center p-4 snap-start pt-20 xl:pt-0">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="container mx-auto max-w-6xl"
      >
        <motion.div variants={itemVariants} className="text-center mb-8 sm:mb-12">
          <motion.h1 
            variants={itemVariants}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Alle Begivenheder
          </motion.h1>
          <motion.p 
            variants={itemVariants}
            className="text-white/70 text-base sm:text-lg max-w-2xl mx-auto px-4"
          >
            Udforsk vores kommende og tidligere begivenheder. Find din næste fantastiske oplevelse eller relive magiske øjeblikke fra fortiden.
          </motion.p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {sortedEvents.map((event) => (
            <motion.div
              key={event.id}
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(`/events/${event.id}`)}
              className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-6 sm:p-8 shadow-2xl cursor-pointer transition-all duration-300 group"
            >
              {/* Event Status Badge */}
              <motion.div
                variants={itemVariants}
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mb-4 ${
                  event.status === 'upcoming' 
                    ? 'bg-green-500/20 text-green-200 border border-green-300/30' 
                    : 'bg-gray-500/20 text-gray-200 border border-gray-300/30'
                }`}
              >
                {event.status === 'upcoming' ? 'Kommende' : 'Afsluttet'}
              </motion.div>

              {/* Event Title */}
              <motion.h3 
                variants={itemVariants}
                className="text-xl sm:text-2xl font-bold text-white mb-4 group-hover:text-l8-beige transition-colors duration-300"
              >
                {event.title}
              </motion.h3>

              {/* Event Details */}
              <motion.div
                variants={itemVariants}
                className="space-y-3 mb-6"
              >
                <div className="flex items-center space-x-3 text-white/80">
                  <Calendar className="w-4 h-4 text-l8-beige flex-shrink-0" />
                  <span className="text-sm">
                    {new Date(event.date).toLocaleDateString('da-DK', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                <div className="flex items-center space-x-3 text-white/80">
                  <Clock className="w-4 h-4 text-l8-beige flex-shrink-0" />
                  <span className="text-sm">{event.startTime || '21:00'}</span>
                </div>
                <div className="flex items-center space-x-3 text-white/80">
                  <MapPin className="w-4 h-4 text-l8-beige flex-shrink-0" />
                  <span className="text-sm truncate">{event.venue?.name || 'TBA'}</span>
                </div>
              </motion.div>

              {/* Artists Preview */}
              {event.eventArtists && event.eventArtists.length > 0 && (
                <motion.div variants={itemVariants} className="mb-6">
                  <motion.h4 className="text-sm font-semibold text-white/80 mb-3 flex items-center">
                    <Music className="w-4 h-4 mr-2 text-l8-beige" />
                    Kunstnere
                  </motion.h4>
                  <div className="flex flex-wrap gap-2">
                    {event.eventArtists.slice(0, 3).map((eventArtist) => (
                      <span 
                        key={eventArtist.id}
                        className="text-xs bg-white/10 px-2 py-1 rounded-full text-white/70"
                      >
                        {eventArtist.artist.name}
                      </span>
                    ))}
                    {event.eventArtists.length > 3 && (
                      <span className="text-xs bg-white/10 px-2 py-1 rounded-full text-white/70">
                        +{event.eventArtists.length - 3} mere
                      </span>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Event Description */}
              <motion.p 
                variants={itemVariants}
                className="text-white/70 text-sm leading-relaxed mb-6 line-clamp-3"
              >
                {event.description}
              </motion.p>

              {/* CTA Button - now just for style, not navigation */}
              <motion.div variants={itemVariants} className="text-center">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-l8-blue to-l8-blue-light hover:from-l8-blue-dark hover:to-l8-blue text-white font-semibold px-4 py-2 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 w-full text-sm pointer-events-none"
                  tabIndex={-1}
                >
                  <Ticket className="w-4 h-4" />
                  <span>{event.status === 'upcoming' ? 'Se Detaljer' : 'Se Opsummering'}</span>
                </motion.button>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default EventList; 