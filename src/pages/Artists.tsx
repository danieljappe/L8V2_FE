import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Music } from 'lucide-react';
import { apiService, Artist } from '../services/api';
import ArtistModal from '../components/ArtistModal';
import LoadingSpinner from '../components/LoadingSpinner';

const Artists: React.FC = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        setLoading(true);
        const response = await apiService.getArtists();
        if (response.error) {
          setError(response.error);
        } else if (response.data) {
          setArtists(response.data);
        }
      } catch (err) {
        setError('Failed to fetch artists');
        console.error('Error fetching artists:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArtists();
  }, []);

  const handleArtistClick = (artist: Artist) => {
    setSelectedArtist(artist);
  };

  const handleCloseModal = () => {
    setSelectedArtist(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Music className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Error Loading Artists</h2>
          <p className="text-white/60">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 via-blue-900/50 to-indigo-900/50" />
        <div className="relative z-10 container mx-auto px-4 py-16 sm:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
              Vores Kunstnere
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Udforsk de talentfulde kunstnere, der bringer musikken til live på L8
            </p>
          </motion.div>
        </div>
      </div>

      {/* Artists Grid */}
      <div className="container mx-auto px-4 py-12">
        {artists.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Music className="w-8 h-8 text-white/60" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Ingen Kunstnere Endnu</h3>
            <p className="text-white/60">Kunstnere vil blive tilføjet snart</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {artists.map((artist, index) => (
              <motion.div
                key={artist.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleArtistClick(artist)}
                className="group cursor-pointer"
              >
                <div className="relative">
                  {/* Circular Artist Image */}
                  <div className="relative w-full aspect-square rounded-full overflow-hidden border-4 border-white/10 group-hover:border-purple-500/50 transition-all duration-300 shadow-lg group-hover:shadow-2xl">
                    <img
                      src={artist.image}
                      alt={artist.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Artist Info Overlay */}
                  <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="text-center">
                      <h3 className="text-white font-bold text-lg mb-1">{artist.name}</h3>
                      <p className="text-purple-300 text-sm">{artist.genre}</p>
                    </div>
                  </div>

                  {/* Click Indicator */}
                  <div className="absolute top-2 right-2 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                </div>

                {/* Artist Info Below Image */}
                <div className="mt-4 text-center">
                  <h3 className="text-white font-bold text-lg mb-1 group-hover:text-purple-300 transition-colors">
                    {artist.name}
                  </h3>
                  <p className="text-white/60 text-sm">{artist.genre}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Artist Modal */}
      <ArtistModal artist={selectedArtist} onClose={handleCloseModal} />
    </div>
  );
};

export default Artists; 