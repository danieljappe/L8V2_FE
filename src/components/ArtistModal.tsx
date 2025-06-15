import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Instagram, Globe, Youtube } from 'lucide-react';

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

interface ArtistModalProps {
  artist: Artist | null;
  onClose: () => void;
}

const ArtistModal: React.FC<ArtistModalProps> = ({ artist, onClose }) => {
  if (!artist) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={e => e.stopPropagation()}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl border border-white/10 shadow-2xl"
        >
          {/* Close Button */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-black/50 backdrop-blur-sm rounded-full border border-white/10 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </motion.button>

          {/* Artist Image */}
          <div className="relative h-48 sm:h-64 md:h-80">
            <img
              src={artist.image}
              alt={artist.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
          </div>

          {/* Content */}
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  {artist.name}
                </h2>
                <p className="text-purple-300 text-lg">{artist.genre}</p>
              </div>
              
              {/* Social Links */}
              <div className="flex gap-3">
                {artist.social?.instagram && (
                  <motion.a
                    href={artist.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10 text-white/80 hover:text-white hover:bg-white/20 transition-colors"
                  >
                    <Instagram className="w-5 h-5" />
                  </motion.a>
                )}
                {artist.social?.website && (
                  <motion.a
                    href={artist.social.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10 text-white/80 hover:text-white hover:bg-white/20 transition-colors"
                  >
                    <Globe className="w-5 h-5" />
                  </motion.a>
                )}
                {artist.social?.youtube && (
                  <motion.a
                    href={artist.social.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10 text-white/80 hover:text-white hover:bg-white/20 transition-colors"
                  >
                    <Youtube className="w-5 h-5" />
                  </motion.a>
                )}
              </div>
            </div>

            <div className="prose prose-invert max-w-none">
              <p className="text-white/80 text-base sm:text-lg leading-relaxed">
                {artist.bio}
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ArtistModal; 