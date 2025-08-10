import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, ChevronLeft, ChevronRight, Upload, Plus } from 'lucide-react';
import Header from '../components/Header';
import Breadcrumbs from '../components/Breadcrumbs';
import { apiService, GalleryImage } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const Gallery: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const categories = ['All', 'event', 'venue', 'artist', 'other'];

  // Fetch gallery images from backend
  /*
useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiService.getGalleryImages();
        if (response.error) {
          throw new Error(response.error);
        }
        if (response.data) {
          // Filter to only show published images
          const publishedImages = response.data.filter(img => img.isPublished);
          setGalleryImages(publishedImages);
        }
      } catch (err) {
        console.error('Error fetching gallery images:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch gallery images');
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryImages();
  }, []);
  */

  const filteredImages = galleryImages.filter(image => {
    const matchesSearch = (image.caption?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
                         (image.event?.title?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
                         (image.photographer?.toLowerCase().includes(searchQuery.toLowerCase()) || false);
    const matchesCategory = selectedCategory === null || selectedCategory === 'All' || image.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getImageUrl = (image: GalleryImage, size: 'thumbnail' | 'medium' | 'large' | 'original' = 'medium') => {
    switch (size) {
      case 'thumbnail':
        return image.thumbnailUrl || image.url;
      case 'medium':
        return image.mediumUrl || image.url;
      case 'large':
        return image.largeUrl || image.url;
      default:
        return image.url;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
        duration: 0.5
      }
    }
  };

  if (loading) {
    return (
      <>
        <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900" />
        <div className="relative min-h-screen">
          <Header />
          <main className="pt-24 pb-12">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-center min-h-[400px]">
                <LoadingSpinner />
              </div>
            </div>
          </main>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900" />
        <div className="relative min-h-screen">
          <Header />
          <main className="pt-24 pb-12">
            <div className="container mx-auto px-4">
              <div className="text-center py-12">
                <p className="text-red-400 text-lg mb-4">Error loading gallery: {error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="px-6 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          </main>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900" />
      <div className="relative min-h-screen">
        <Header />
        
        <main className="pt-24 pb-12">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-6xl mx-auto"
            >
              {/* Breadcrumbs */}
              <div className="mb-8">
                <Breadcrumbs />
              </div>

              {/* Header */}
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">Event Gallery</h1>
                <p className="text-white/70 text-lg">Relive the magic of our past events through these unforgettable moments</p>
              </div>

              {/* Search and Filter */}
              <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50" />
                  <input
                    type="text"
                    placeholder="Search by caption, event, or photographer..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10 text-white placeholder-white/50 focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category === 'All' ? null : category)}
                      className={`px-4 py-2 rounded-xl whitespace-nowrap transition-colors ${
                        (selectedCategory === null && category === 'All') || selectedCategory === category
                          ? 'bg-purple-600 text-white'
                          : 'bg-white/10 text-white/70 hover:bg-white/20'
                      }`}
                    >
                      {category === 'All' ? 'All' : category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Gallery Grid */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
              >
                {filteredImages.map((image) => (
                  <motion.div
                    key={image.id}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02, y: -5 }}
                    onClick={() => setSelectedImage(image)}
                    className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer"
                  >
                    <img
                      src={getImageUrl(image, 'medium')}
                      alt={image.caption || 'Gallery image'}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      onError={(e) => {
                        // Fallback to original URL if medium fails
                        const target = e.target as HTMLImageElement;
                        target.src = image.url;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-white font-semibold">{image.event?.title || 'Event'}</h3>
                        <p className="text-white/70 text-sm">{formatDate(image.createdAt)}</p>
                        {image.caption && (
                          <p className="text-white/70 text-xs mt-1 truncate">{image.caption}</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* No Results */}
              {filteredImages.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-white/70 text-lg">No images found matching your search criteria</p>
                </div>
              )}
            </motion.div>
          </div>
        </main>

        {/* Image Modal */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImage(null)}
              className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="relative max-w-4xl w-full"
              >
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute -top-12 right-0 p-2 text-white/70 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
                <img
                  src={getImageUrl(selectedImage, 'large')}
                  alt={selectedImage.caption || 'Gallery image'}
                  className="w-full h-auto rounded-xl"
                  onError={(e) => {
                    // Fallback to original URL if large fails
                    const target = e.target as HTMLImageElement;
                    target.src = selectedImage.url;
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent rounded-b-xl">
                  <h3 className="text-white text-xl font-semibold">{selectedImage.event?.title || 'Event'}</h3>
                  <p className="text-white/70">{formatDate(selectedImage.createdAt)}</p>
                  {selectedImage.caption && (
                    <p className="text-white/70 mt-2">{selectedImage.caption}</p>
                  )}
                  {selectedImage.photographer && (
                    <p className="text-white/70 mt-1">Photo by: {selectedImage.photographer}</p>
                  )}
                  {selectedImage.tags && selectedImage.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedImage.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-white/20 text-white/80 text-xs rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default Gallery; 