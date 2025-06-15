import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Music, ArrowLeft, Ticket, Users } from 'lucide-react';
import Header from '../components/Header';
import ArtistModal from '../components/ArtistModal';

interface Artist {
  name: string;
  genre: string;
  image: string;
  bio: string;
  social?: {
    instagram?: string;
    website?: string;
    youtube?: string;
  };
}

const EventDetails: React.FC = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [selectedArtist, setSelectedArtist] = React.useState<Artist | null>(null);

  // This would normally come from an API or database
  const event = {
    id: eventId,
    title: 'Neon Nætter',
    date: '2025-03-15',
    time: '21:00',
    venue: 'Warehouse District',
    status: 'upcoming',
    color: 'purple',
    image: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=1920',
    description: 'En aften fyldt med elektronisk musik og lysshow, hvor de bedste DJs i byen tager dig med på en rejse gennem lyd og lys. Forbered dig på en magisk oplevelse med verdensklasse kunstnere, imponerende lysshow og en atmosfære, der vil få dig til at danse hele natten.',
    artists: [
      {
        name: 'DJ Synthwave',
        genre: 'Electronic',
        image: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=300',
        bio: 'Kendt for sine unikke synthwave beats og energiske live shows. Med over 10 års erfaring i den elektroniske musikscene har DJ Synthwave udviklet en særpræget stil, der kombinerer retro synthwave med moderne elektronisk musik.',
        social: {
          instagram: 'https://instagram.com/djsynthwave',
          website: 'https://djsynthwave.com',
          youtube: 'https://youtube.com/djsynthwave'
        }
      },
      {
        name: 'Luna Beats',
        genre: 'House',
        image: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300',
        bio: 'En af de mest innovative house DJs i scenen lige nu. Luna Beats har revolutioneret house-musikken med deres unikke blend af klassisk house og moderne elektroniske elementer.',
        social: {
          instagram: 'https://instagram.com/lunabeats',
          website: 'https://lunabeats.com'
        }
      },
      {
        name: 'Neon Pulse',
        genre: 'Techno',
        image: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=300',
        bio: 'Specialiseret i hård techno og psykedelisk elektronisk musik. Neon Pulse skaber en intens og hypnotisk oplevelse, der tager lytteren med på en rejse gennem lyd og lys.',
        social: {
          instagram: 'https://instagram.com/neonpulse',
          youtube: 'https://youtube.com/neonpulse'
        }
      },
      {
        name: 'Echo Dreams',
        genre: 'Ambient',
        image: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=300',
        bio: 'Skaber drømmeagtige ambient lydlandskaber. Echo Dreams kombinerer ambient musik med eksperimentelle lydelementer for at skabe en unik og meditativ oplevelse.',
        social: {
          instagram: 'https://instagram.com/echodreams',
          website: 'https://echodreams.com'
        }
      }
    ],
    ticketTypes: [
      {
        name: 'Standard',
        price: '299 DKK',
        features: ['Adgang til eventet', 'Gratis garderobe', 'Program']
      },
      {
        name: 'VIP',
        price: '599 DKK',
        features: ['Adgang til eventet', 'Gratis garderobe', 'Program', 'VIP-område', 'Gratis drinks', 'Møde med kunstnere']
      }
    ]
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[500px] w-full overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={event.image} 
            alt={event.title}
            className="w-full h-full object-cover"
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
                <p className="font-semibold">{event.time}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 text-white/80 bg-white/10 backdrop-blur-sm p-3 rounded-xl">
              <MapPin className="w-5 h-5 text-purple-300" />
              <div>
                <p className="text-sm text-white/60">Sted</p>
                <p className="font-semibold">{event.venue}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-10">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            {/* Description */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-6 sm:p-8 mb-8">
              <p className="text-white/80 leading-relaxed text-lg">
                {event.description}
              </p>
            </div>

            {/* Artists Section */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-6 sm:p-8 mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 flex items-center">
                <Music className="w-6 h-6 mr-2 text-purple-300" />
                Kunstnere
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {event.artists.map((artist, index) => (
                  <div
                    key={artist.name}
                    whileHover={{ 
                      scale: 1.02, 
                      y: -5,
                      transition: { duration: 0.2 }
                    }}
                    onClick={() => setSelectedArtist(artist)}
                    className="group relative bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 cursor-pointer overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative flex items-start space-x-4">
                      <div 
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex-shrink-0 overflow-hidden"
                      >
                        <img 
                          src={artist.image} 
                          alt={artist.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-purple-300 transition-colors duration-300">
                          {artist.name}
                        </h3>
                        <p className="text-purple-300 text-sm mb-2">{artist.genre}</p>
                        <p className="text-white/70 text-sm line-clamp-2">{artist.bio}</p>
                        <div className="mt-3 text-purple-300 text-sm font-medium">
                          Klik for at læse mere →
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tickets Section */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 flex items-center">
                <Ticket className="w-6 h-6 mr-2 text-purple-300" />
                Billetter
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {event.ticketTypes.map((ticket, index) => (
                  <div
                    key={ticket.name}
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
                  >
                    <h3 className="text-xl font-semibold text-white mb-2">{ticket.name}</h3>
                    <p className="text-2xl font-bold text-purple-300 mb-4">{ticket.price}</p>
                    <ul className="space-y-2 mb-6">
                      {ticket.features.map((feature, i) => (
                        <li className="flex items-center text-white/80">
                          <div className="w-1.5 h-1.5 bg-purple-300 rounded-full mr-2"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-xl transition-all duration-300"
                    >
                      Køb {ticket.name} Billet
                    </button>
                  </div>
                ))}
              </div>
            </div>
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