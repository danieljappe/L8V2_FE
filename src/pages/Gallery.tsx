import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Calendar, User, Tag, ArrowLeft, ArrowRight } from 'lucide-react';
import Header from '../components/Header';
import { useGalleryImages } from '../hooks/useApi';
import { GalleryImage } from '../services/api';
import { constructFullUrl } from '../utils/imageUtils';
import ImagePreview from '../components/admin/ImagePreview';
import LoadingSpinner from '../components/LoadingSpinner';

const Gallery: React.FC = () => {
  const { data: images, loading, error } = useGalleryImages();
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Filter published images - temporarily show all images for debugging
  const publishedImages = images || [];

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

  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const handleImageClick = (image: GalleryImage, index: number) => {
    setSelectedImage(image);
    setCurrentImageIndex(index);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  const handlePreviousImage = () => {
    const newIndex = currentImageIndex > 0 ? currentImageIndex - 1 : publishedImages.length - 1;
    setCurrentImageIndex(newIndex);
    setSelectedImage(publishedImages[newIndex]);
  };

  const handleNextImage = () => {
    const newIndex = currentImageIndex < publishedImages.length - 1 ? currentImageIndex + 1 : 0;
    setCurrentImageIndex(newIndex);
    setSelectedImage(publishedImages[newIndex]);
  };

  if (loading) {
    return (
      <div className="min-h-screen overflow-x-hidden">
        <Header />
        <section className="min-h-screen flex items-center justify-center p-4 snap-start pt-20">
          <LoadingSpinner size="lg" text="Loading gallery..." />
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen overflow-x-hidden">
        <Header />
        <section className="min-h-screen flex items-center justify-center p-4 snap-start pt-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <motion.div 
              className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-2xl"
            >
              <p className="text-red-400 mb-4 text-lg">Failed to load gallery</p>
              <p className="text-white/70 mb-6">
                {error || 'Unknown error occurred'}
              </p>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.reload()} 
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-6 py-3 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Retry
              </motion.button>
            </motion.div>
          </motion.div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Header />
      
      <main className="relative z-10">
        <section className="min-h-screen flex items-center justify-center p-4 snap-start pt-20">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="container mx-auto max-w-7xl"
          >
            <motion.div variants={itemVariants} className="text-center mb-8 sm:mb-12">
              <motion.h1 
                variants={itemVariants}
                className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4"
              >
                Galleri
              </motion.h1>
              <motion.p 
                variants={itemVariants}
                className="text-white/70 text-base sm:text-lg max-w-2xl mx-auto px-4"
              >
                Udforsk vores samling af fantastiske billeder fra begivenheder, kunstnere og magiske øjeblikke.
              </motion.p>
            </motion.div>

            {publishedImages.length === 0 ? (
              <motion.div 
                variants={itemVariants}
                className="text-center py-12"
              >
                <motion.div 
                  className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-2xl"
                >
                  <Camera className="w-16 h-16 text-white/40 mx-auto mb-4" />
                  <div className="text-white/70 text-lg mb-4">Ingen billeder fundet</div>
                  <p className="text-white/50 text-sm">
                    Billeder vil vises her når de er uploadet og publiceret.
                  </p>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div 
                variants={containerVariants}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8"
              >
                {publishedImages.map((image, index) => (
                  <motion.div
                    key={image.id}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleImageClick(image, index)}
                    className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 overflow-hidden shadow-2xl cursor-pointer transition-all duration-300 group"
                  >
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src={constructFullUrl(image.url)}
                        alt={image.caption || 'Gallery image'}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <p className="text-sm font-medium">Klik for at se større</p>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-white font-semibold text-lg mb-3 group-hover:text-purple-300 transition-colors duration-300">
                        {image.caption || 'Untitled'}
                      </h3>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-white/70">
                          <Calendar className="w-4 h-4 text-purple-300" />
                          <span className="text-sm">
                            {new Date(image.createdAt).toLocaleDateString('da-DK', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                        {image.photographer && (
                          <div className="flex items-center space-x-2 text-white/70">
                            <User className="w-4 h-4 text-purple-300" />
                            <span className="text-sm">{image.photographer}</span>
                          </div>
                        )}
                        {image.category && (
                          <div className="flex items-center space-x-2 text-white/70">
                            <Tag className="w-4 h-4 text-purple-300" />
                            <span className="text-sm">{image.category}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
        </section>
      </main>

      {/* Image Modal */}
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
          onClick={handleCloseModal}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="relative max-w-6xl max-h-[90vh] bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors duration-200"
            >
              ×
            </button>

            {/* Navigation buttons */}
            {publishedImages.length > 1 && (
              <>
                <button
                  onClick={handlePreviousImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors duration-200"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors duration-200"
                >
                  <ArrowRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Image */}
            <div className="relative">
              <img
                src={constructFullUrl(selectedImage.url)}
                alt={selectedImage.caption || 'Gallery image'}
                className="w-full h-auto max-h-[70vh] object-contain"
              />
            </div>

            {/* Image info */}
            <div className="p-6">
              <h3 className="text-white font-semibold text-xl mb-3">
                {selectedImage.caption || 'Untitled'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-white/70">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-purple-300" />
                  <span className="text-sm">
                    {new Date(selectedImage.createdAt).toLocaleDateString('da-DK', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                {selectedImage.photographer && (
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-purple-300" />
                    <span className="text-sm">{selectedImage.photographer}</span>
                  </div>
                )}
                {selectedImage.category && (
                  <div className="flex items-center space-x-2">
                    <Tag className="w-4 h-4 text-purple-300" />
                    <span className="text-sm">{selectedImage.category}</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Gallery;