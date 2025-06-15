import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Music, Ticket, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  venue: string;
  status: 'upcoming' | 'past';
  color: string;
  description: string;
  artists: string[];
}

const EventList: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const navigate = useNavigate();

  const events: Event[] = [
    {
      id: 1,
      title: 'Neon Nætter',
      date: '2025-03-15',
      time: '21:00',
      venue: 'Warehouse District',
      status: 'upcoming',
      color: 'purple',
      description: 'En aften fyldt med elektronisk musik og lysshow, hvor de bedste DJs i byen tager dig med på en rejse gennem lyd og lys.',
      artists: ['DJ Synthwave', 'Luna Beats', 'Neon Pulse', 'Echo Dreams']
    },
    {
      id: 2,
      title: 'Cosmic Vibes',
      date: '2025-02-14',
      time: '20:30',
      venue: 'Main Stage',
      status: 'past',
      color: 'blue',
      description: 'En kosmisk rejse gennem lyd og rum, hvor elektronisk musik møder visuelle effekter i en unik oplevelse.',
      artists: ['Cosmic DJ', 'Space Beats', 'Galaxy Sound']
    },
    {
      id: 3,
      title: 'Electric Dreams',
      date: '2025-04-12',
      time: '22:00',
      venue: 'Underground Club',
      status: 'upcoming',
      color: 'green',
      description: 'En nat med elektrisk energi og drømmeagtige beats, hvor musik og kunst smelter sammen i en magisk oplevelse.',
      artists: ['Electric Soul', 'Dream Weaver', 'Neon Lights']
    },
    {
      id: 4,
      title: 'Rhythm & Lights',
      date: '2025-01-18',
      time: '21:30',
      venue: 'City Hall',
      status: 'past',
      color: 'orange',
      description: 'En festlig aften med rytmisk musik og imponerende lysshow, der bringer liv til byens hjerte.',
      artists: ['Rhythm Master', 'Light Show', 'City Beats']
    }
  ];

  // Sort events by date (latest first)
  const sortedEvents = [...events].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const getColorClasses = (color: string) => {
    const colors = {
      purple: 'bg-purple-500/20 border-purple-300/30 text-purple-200',
      blue: 'bg-blue-500/20 border-blue-300/30 text-blue-200',
      green: 'bg-green-500/20 border-green-300/30 text-green-200',
      orange: 'bg-orange-500/20 border-orange-300/30 text-orange-200'
    };
    return colors[color as keyof typeof colors] || colors.purple;
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

  if (selectedEvent) {
    return (
      <section className="min-h-screen flex items-center justify-center p-4 snap-start pt-20">
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
                <Calendar className="w-5 h-5 text-purple-300" />
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
                <Clock className="w-5 h-5 text-purple-300" />
                <div>
                  <p className="text-sm text-white/60">Tidspunkt</p>
                  <p className="font-semibold">{selectedEvent.time}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 text-white/80 bg-white/5 p-3 rounded-2xl">
                <MapPin className="w-5 h-5 text-purple-300" />
                <div>
                  <p className="text-sm text-white/60">Sted</p>
                  <p className="font-semibold">{selectedEvent.venue}</p>
                </div>
              </div>
            </motion.div>

            <motion.div className="mb-6">
              <motion.h3 className="text-xl font-semibold text-white mb-3 flex items-center">
                <Music className="w-5 h-5 mr-2 text-purple-300" />
                Kunstnere
              </motion.h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {selectedEvent.artists.map((artist, index) => (
                  <motion.div
                    key={index}
                    className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-2 mx-auto"></div>
                    <p className="text-white font-medium text-center text-sm">{artist}</p>
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
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-6 py-3 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Køb Billetter
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </section>
    );
  }

  return (
    <section id="events-list" className="min-h-screen flex items-center justify-center p-4 snap-start pt-20">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="container mx-auto max-w-6xl"
      >
        <motion.div variants={itemVariants} className="text-center mb-8 sm:mb-12">
          <motion.h2 
            variants={itemVariants}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 mt-8"
          >
            Alle Begivenheder
          </motion.h2>
          {/* <motion.p 
            variants={itemVariants}
            className="text-white/70 text-base sm:text-lg max-w-2xl mx-auto px-4"
          >
            Udforsk vores kommende og tidligere begivenheder. Find din næste uforglemmelige oplevelse.
          </motion.p> */}
        </motion.div>

        <motion.div 
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {sortedEvents.map((event) => (
            <motion.div
              key={event.id}
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setSelectedEvent(event);
                navigate(`/events/${event.id}`);
              }}
              className={`${getColorClasses(event.color)} backdrop-blur-xl rounded-3xl border p-6 cursor-pointer transition-all duration-300`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(event.date).toLocaleDateString('da-DK', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                    <div className="flex items-center text-sm">
                      <Clock className="w-4 h-4 mr-2" />
                      {event.time}
                    </div>
                    <div className="flex items-center text-sm">
                      <MapPin className="w-4 h-4 mr-2" />
                      {event.venue}
                    </div>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  event.status === 'upcoming' 
                    ? 'bg-green-500/20 text-green-300' 
                    : 'bg-gray-500/20 text-gray-300'
                }`}>
                  {event.status === 'upcoming' ? 'Kommende' : 'Afholdt'}
                </div>
              </div>
              <p className="text-sm opacity-80 line-clamp-2">{event.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex -space-x-2">
                  {event.artists.slice(0, 3).map((artist, index) => (
                    <div
                      key={index}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 border-2 border-white/20"
                    />
                  ))}
                  {event.artists.length > 3 && (
                    <div className="w-8 h-8 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center text-xs">
                      +{event.artists.length - 3}
                    </div>
                  )}
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-sm font-medium"
                >
                  Se Detaljer →
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default EventList; 