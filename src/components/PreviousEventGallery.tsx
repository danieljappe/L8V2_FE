import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Heart, Share2 } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';
import { useGalleryImages, useEvents } from '../hooks/useApi';
import { GalleryImage, Event } from '../services/api';

const PreviousEventGallery: React.FC = () => {
  // Fetch gallery images and events from API
  const { data: galleryImages, loading: galleryLoading, error: galleryError } = useGalleryImages();
  const { data: events, loading: eventsLoading, error: eventsError } = useEvents();

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

  // Get the most recent past event
  const recentPastEvent = events?.find(event => {
    const eventDate = new Date(event.date);
    const today = new Date();
    return eventDate < today;
  });

  // Get gallery images for the recent event (or use all if no specific event)
  const eventGalleryImages = galleryImages?.filter(img => 
    !recentPastEvent || img.eventId === recentPastEvent.id
  ) || [];

  // Use fallback images if no gallery images are available
  const displayImages = eventGalleryImages.length > 0 ? eventGalleryImages : [
    { id: 1, imageUrl: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800', title: 'DJ performing' } as GalleryImage,
    { id: 2, imageUrl: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=800', title: 'Crowd dancing' } as GalleryImage,
    { id: 3, imageUrl: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=800', title: 'Stage lights' } as GalleryImage,
    { id: 4, imageUrl: 'https://images.pexels.com/photos/1563356/pexels-photo-1563356.jpeg?auto=compress&cs=tinysrgb&w=800', title: 'Concert atmosphere' } as GalleryImage,
  ];

  // Show loading state
  if (galleryLoading || eventsLoading) {
    return (
      <section id="gallery" className="min-h-screen flex items-center justify-center p-4 snap-start">
        <LoadingSpinner size="lg" text="Loading gallery..." />
      </section>
    );
  }

  // Show error state
  if (galleryError || eventsError) {
    return (
      <section id="gallery" className="min-h-screen flex items-center justify-center p-4 snap-start">
        <div className="text-center">
          <p className="text-red-400 mb-4">Failed to load gallery</p>
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

  // Format event date
  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <section id="gallery" className="min-h-screen flex items-center justify-center p-4 snap-start">
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
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Last Event Highlights
          </motion.h2>
          <motion.p 
            variants={itemVariants}
            className="text-white/70 text-base sm:text-lg max-w-2xl mx-auto px-4"
          >
            {recentPastEvent 
              ? `Relive the magic of "${recentPastEvent.title}" - our most recent event with incredible performances and unforgettable moments.`
              : 'Relive the magic of our most electrifying events with incredible performances and unforgettable moments.'
            }
          </motion.p>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-4 sm:p-6 md:p-8 shadow-2xl"
        >
          {/* Event Info */}
          <motion.div 
            variants={itemVariants}
            className="flex items-center justify-between mb-4 sm:mb-6"
          >
            <div>
              <motion.h3 
                variants={itemVariants}
                className="text-xl sm:text-2xl font-bold text-white"
              >
                {recentPastEvent?.title || 'Recent Event'}
              </motion.h3>
              <motion.p 
                variants={itemVariants}
                className="text-white/60 text-sm sm:text-base"
              >
                {recentPastEvent 
                  ? `${formatEventDate(recentPastEvent.date)} • ${recentPastEvent.venue?.name || 'Venue'}`
                  : 'Recent event highlights'
                }
              </motion.p>
            </div>
            <div className="flex items-center space-x-2">
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
              >
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
              >
                <Share2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </motion.button>
            </div>
          </motion.div>

          {/* Gallery Grid */}
          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6"
          >
            {displayImages.slice(0, 4).map((image, index) => (
              <motion.div 
                key={image.id}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="relative group cursor-pointer"
              >
                <div className="aspect-square rounded-2xl overflow-hidden">
                  <motion.img
                    src={image.imageUrl}
                    alt={image.title || `Gallery image ${index + 1}`}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  />
                  <motion.div 
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"
                  ></motion.div>
                  {index === 0 && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0 }}
                      whileHover={{ opacity: 1, scale: 1 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <motion.div 
                        whileHover={{ scale: 1.1 }}
                        className="p-2 sm:p-3 bg-white/20 backdrop-blur-sm rounded-full"
                      >
                        <Play className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                      </motion.div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Stats */}
          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-3 gap-4 mb-4 sm:mb-6"
          >
            {[
              { value: recentPastEvent?.venue?.capacity ? `${Math.floor(recentPastEvent.venue.capacity * 0.8)}` : '2.5K', label: 'Attendees' },
              { value: recentPastEvent?.eventArtists?.length?.toString() || '6', label: 'Artists' },
              { value: '8hrs', label: 'Duration' }
            ].map((stat, index) => (
              <motion.div 
                key={stat.label}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -5 }}
                className="text-center bg-white/5 p-3 sm:p-4 rounded-2xl border border-white/10"
              >
                <motion.p 
                  variants={itemVariants}
                  className="text-xl sm:text-2xl font-bold text-white"
                >
                  {stat.value}
                </motion.p>
                <motion.p 
                  variants={itemVariants}
                  className="text-white/60 text-xs sm:text-sm"
                >
                  {stat.label}
                </motion.p>
              </motion.div>
            ))}
          </motion.div>

          {/* View More Button */}
          <motion.div 
            variants={itemVariants}
            className="text-center"
          >
            <motion.button 
              whileHover={{ scale: 1.05, x: 5 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white font-medium px-4 sm:px-6 py-2 sm:py-3 rounded-xl transition-all duration-300 border border-white/20 text-sm sm:text-base"
            >
              <span>View Full Gallery</span>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <ArrowRight className="w-4 h-4" />
              </motion.div>
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default PreviousEventGallery;