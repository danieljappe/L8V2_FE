import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Instagram, Globe, Youtube } from 'lucide-react';
import { constructFullUrl } from '../utils/imageUtils';
import { Artist } from '../services/api';

interface ArtistModalProps {
  artist: Artist | null;
  onClose: () => void;
}

const ArtistModal: React.FC<ArtistModalProps> = ({ artist, onClose }) => {
  if (!artist) return null;

  // Fix socialMedia data - handle both string and array formats
  let socialMediaArray: Array<{ platform: string; url: string }> = [];
  if (artist.socialMedia) {
    if (Array.isArray(artist.socialMedia)) {
      socialMediaArray = artist.socialMedia;
    } else if (typeof artist.socialMedia === 'string') {
      try {
        // Parse JSON string to array
        socialMediaArray = JSON.parse(artist.socialMedia);
      } catch (error) {
        socialMediaArray = [];
      }
    }
  }

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
          className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl border border-white/10 shadow-2xl"
        >
          {/* Close Button */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-3 bg-black/70 backdrop-blur-sm rounded-full border border-white/20 text-white hover:text-white hover:bg-black/80 transition-all duration-200 shadow-lg"
          >
            <X className="w-5 h-5" />
          </motion.button>

          {/* Artist Image */}
          <div className="relative h-48 sm:h-64 md:h-80">
            <img
              src={constructFullUrl(artist.imageUrl)}
              alt={artist.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
            
            {/* Artist Name Overlay on Image */}
            <div className="absolute bottom-4 left-4 right-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                {artist.name}
              </h1>
              
              {/* Social Media Logos - Under Name */}
              {socialMediaArray && socialMediaArray.length > 0 && (
                <div className="flex gap-2">
                  {socialMediaArray.map((media, index) => (
                    <motion.a
                      key={index}
                      href={media.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30 text-white/80 hover:text-white hover:bg-white/30 transition-all duration-200 flex items-center justify-center"
                      title={media.platform}
                    >
                      {media.platform.toLowerCase().includes('instagram') && <img src="/icons/Instagram_icon.png" alt="Instagram" className="w-5 h-5" />}
                      {media.platform.toLowerCase().includes('youtube') && <img src="/icons/Youtube_icon.png" alt="YouTube" className="w-5 h-5" />}
                      {media.platform.toLowerCase().includes('spotify') && <img src="/icons/Spotify_icon.svg.png" alt="Spotify" className="w-5 h-5" />}
                      {media.platform.toLowerCase().includes('soundcloud') && <img src="/icons/soundcloud_icon.png" alt="SoundCloud" className="w-5 h-5" />}
                      {media.platform.toLowerCase().includes('x') && <img src="/icons/x_icon.png" alt="X" className="w-5 h-5" />}
                      {media.platform.toLowerCase().includes('facebook') && <span className="text-blue-600 text-2xl font-bold">📘</span>}
                      {media.platform.toLowerCase().includes('tiktok') && <span className="text-pink-400 text-2xl font-bold">🎵</span>}
                      {media.platform.toLowerCase().includes('linkedin') && <span className="text-blue-700 text-2xl font-bold">💼</span>}
                      {media.platform.toLowerCase().includes('twitch') && <span className="text-purple-400 text-2xl font-bold">🎮</span>}
                      {media.platform.toLowerCase().includes('discord') && <span className="text-indigo-400 text-2xl font-bold">💬</span>}
                      {!media.platform.toLowerCase().includes('instagram') && 
                       !media.platform.toLowerCase().includes('youtube') && 
                       !media.platform.toLowerCase().includes('spotify') && 
                       !media.platform.toLowerCase().includes('soundcloud') && 
                       !media.platform.toLowerCase().includes('twitter') && 
                       !media.platform.toLowerCase().includes('facebook') && 
                       !media.platform.toLowerCase().includes('tiktok') && 
                       !media.platform.toLowerCase().includes('linkedin') && 
                       !media.platform.toLowerCase().includes('twitch') && 
                       !media.platform.toLowerCase().includes('discord') && 
                       <Globe className="w-5 h-5" />}
                    </motion.a>
                  ))}
                </div>
              )}
            </div>
            
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-320px)]">
            <div className="p-6 sm:p-8">
              <div className="mb-8">
                {artist.bio && (
                  <p className="text-white/80 text-base sm:text-lg leading-relaxed mb-4">
                    {artist.bio}
                  </p>
                )}
                
                {/* Website Link and Genre */}
                <div className="flex flex-wrap items-center gap-6 mb-4">
                  {artist.website && (
                    <a
                      href={artist.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <Globe className="w-5 h-5" />
                      <span className="underline">{artist.website}</span>
                    </a>
                  )}
                  
                  {artist.website && artist.genre && (
                    <div className="w-px h-6 bg-white/20"></div>
                  )}
                  
                  {artist.genre && (
                    <span className="px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white/80 border border-white/20">
                      {artist.genre}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ArtistModal; 