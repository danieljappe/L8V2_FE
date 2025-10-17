import React from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Music, Ticket, Users, AlertCircle } from 'lucide-react';
import Header from '../components/Header';
import ArtistModal from '../components/ArtistModal';
import LoadingSpinner from '../components/LoadingSpinner';
import { useEvent } from '../hooks/useApi';
import { Artist } from '../services/api';
import { constructFullUrl } from '../utils/imageUtils';

const EventDetails: React.FC = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [selectedArtist, setSelectedArtist] = React.useState<Artist | null>(null);

  // Validate eventId before making API call
  const isValidEventId = eventId && typeof eventId === 'string' && eventId.trim() !== '';

  // Fetch event data from API only if eventId is valid
  const { data: event, loading, error } = useEvent(isValidEventId ? eventId : '');

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen overflow-x-hidden">
        <Header />
        <div className="flex items-center justify-center h-[60vh]">
          <LoadingSpinner size="lg" text="Loading event details..." />
        </div>
      </div>
    );
  }

  // Show error state for invalid event ID
  if (!isValidEventId) {
    return (
      <div className="min-h-screen overflow-x-hidden">
        <Header />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Invalid Event ID</h2>
            <p className="text-white/70 mb-4">The event ID in the URL is not valid.</p>
            <button 
              onClick={() => navigate('/events')}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Back to Events
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !event) {
    return (
      <div className="min-h-screen overflow-x-hidden">
        <Header />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Event Not Found</h2>
            <p className="text-white/70 mb-4">The event you're looking for doesn't exist or has been removed.</p>
            <button 
              onClick={() => navigate('/events')}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Back to Events
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Check if event is upcoming or past
  const isUpcoming = new Date(event.date) >= new Date();

  // Billetto link for ticket purchase
  const billettoLink = event.billettoURL || 'https://billetto.dk';

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[500px] w-full overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={event.imageUrl ? constructFullUrl(event.imageUrl) : (event.venue?.image ? constructFullUrl(event.venue.image) : 'https://via.placeholder.com/1920x1080/1a1a2e/ffffff?text=Event+Image')} 
            alt={event.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback to venue image or stock photo if event image fails to load
              const target = e.target as HTMLImageElement;
              if (event.venue?.image && target.src !== constructFullUrl(event.venue.image)) {
                target.src = constructFullUrl(event.venue.image);
              } else if (target.src !== 'https://via.placeholder.com/1920x1080/1a1a2e/ffffff?text=Event+Image') {
                target.src = 'https://via.placeholder.com/1920x1080/1a1a2e/ffffff?text=Event+Image';
              }
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-purple-900/90"></div>
        </div>
        
        {/* Event Title and Info */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
            {event.title}
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 text-white/80 bg-white/10 backdrop-blur-sm p-3 rounded-xl">
              <Calendar className="w-5 h-5 text-purple-300" />
              <div>
                <p className="text-sm text-white/60">Dato</p>
                <p className="font-semibold">
                  {new Date(event.date).toLocaleDateString('da-DK', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 text-white/80 bg-white/10 backdrop-blur-sm p-3 rounded-xl">
              <Clock className="w-5 h-5 text-purple-300" />
              <div>
                <p className="text-sm text-white/60">Tidspunkt</p>
                <p className="font-semibold">{event.startTime || '21:00'}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 text-white/80 bg-white/10 backdrop-blur-sm p-3 rounded-xl">
              <MapPin className="w-5 h-5 text-purple-300" />
              <div>
                <p className="text-sm text-white/60">Sted</p>
                <p className="font-semibold">{event.venue?.name || 'TBA'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 bg-gradient-to-b from-purple-900/80 via-black/50 to-purple-900/80 min-h-screen">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            {/* Description */}
            <div className="bg-black/30 backdrop-blur-xl rounded-3xl border border-white/20 p-6 sm:p-8 mb-8">
              <p className="text-white leading-relaxed text-lg">
                {event.description}
              </p>
            </div>

            {/* Artists Section */}
            {event.eventArtists && event.eventArtists.length > 0 && (
              <div className="bg-black/30 backdrop-blur-xl rounded-3xl border border-white/20 p-6 sm:p-8 mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 flex items-center">
                  <Music className="w-6 h-6 mr-2 text-purple-300" />
                  Kunstnere
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {event.eventArtists.map((eventArtist) => (
                    <motion.div
                      key={eventArtist.id}
                      whileHover={{ 
                        scale: 1.02, 
                        y: -5,
                        transition: { duration: 0.2 }
                      }}
                      onClick={() => setSelectedArtist(eventArtist.artist)}
                      className="group relative bg-black/20 backdrop-blur-sm rounded-2xl p-4 border border-white/20 cursor-pointer overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative flex items-start space-x-4">
                        <motion.div 
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex-shrink-0 overflow-hidden"
                        >
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
                        </motion.div>
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-purple-300 transition-colors duration-300">
                            {eventArtist.artist.name}
                          </h3>
                          <p className="text-purple-300 text-sm mb-2">{eventArtist.artist.genre}</p>
                          <p className="text-white/90 text-sm line-clamp-2">{eventArtist.artist.bio}</p>
                          <div className="mt-3 text-purple-300 text-sm font-medium">
                            Klik for at læse mere →
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Venue Information */}
            {event.venue && (
              <div className="bg-black/30 backdrop-blur-xl rounded-3xl border border-white/20 p-6 sm:p-8 mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 flex items-center">
                  <MapPin className="w-6 h-6 mr-2 text-purple-300" />
                  Lokation
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">{event.venue.name}</h3>
                    <p className="text-white/70 mb-2">{event.venue.address}</p>
                    <p className="text-white/70 mb-4">{event.venue.city}</p>
                    {event.venue.description && (
                      <p className="text-white/80 text-sm leading-relaxed">{event.venue.description}</p>
                    )}
                  </div>
                  <div className="bg-black/20 rounded-2xl p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Users className="w-5 h-5 text-purple-300" />
                      <span className="text-white font-semibold">Kapacitet</span>
                    </div>
                    <p className="text-white/70">{event.venue.capacity.toLocaleString()} personer</p>
                  </div>
                </div>
              </div>
            )}

            {/* Tickets Section - Only show for upcoming events */}
            {isUpcoming && (
              <div className="bg-black/30 backdrop-blur-xl rounded-3xl border border-white/20 p-6 sm:p-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 flex items-center">
                  <Ticket className="w-6 h-6 mr-2 text-purple-300" />
                  Billetter
                </h2>

                <div className="max-w-md mx-auto">
                  <motion.div
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="bg-black/20 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-center"
                  >
                    <motion.a
                      href={billettoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-block w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      Køb Billet på Billetto
                    </motion.a>
                    
                    <p className="text-white/60 text-sm mt-4">
                      Du vil blive omdirigeret til Billetto for at gennemføre købet
                    </p>
                  </motion.div>
                </div>
              </div>
            )}

            {/* Past Event Message */}
            {!isUpcoming && (
              <div className="bg-black/30 backdrop-blur-xl rounded-3xl border border-white/20 p-6 sm:p-8 text-center">
                <h2 className="text-2xl font-bold text-white mb-4">Event Afsluttet</h2>
                <p className="text-white/70 mb-6">
                  Dette event har allerede fundet sted. Tak til alle, der deltog og gjorde det til en fantastisk aften!
                </p>
                <button
                  onClick={() => navigate('/events')}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
                >
                  Se Andre Events
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Artist Modal */}
      <ArtistModal 
        artist={selectedArtist} 
        onClose={() => setSelectedArtist(null)} 
      />
    </div>
  );
};

export default EventDetails; 