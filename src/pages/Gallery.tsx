import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, ChevronLeft, ChevronRight } from 'lucide-react';
import Header from '../components/Header';
import Breadcrumbs from '../components/Breadcrumbs';

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  event: string;
  date: string;
  category: string;
}

const Gallery: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  const categories = ['All', 'Events', 'Artists', 'Venue', 'Crowd'];

  const galleryImages: GalleryImage[] = [
    { id: 1, src: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'DJ performing', event: 'Cosmic Vibes', date: '2024-02-14', category: 'Artists' },
    { id: 2, src: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Crowd dancing', event: 'Cosmic Vibes', date: '2024-02-14', category: 'Crowd' },
    { id: 3, src: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Stage lights', event: 'Cosmic Vibes', date: '2024-02-14', category: 'Venue' },
    { id: 4, src: 'https://images.pexels.com/photos/1563356/pexels-photo-1563356.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Concert atmosphere', event: 'Cosmic Vibes', date: '2024-02-14', category: 'Events' },
    { id: 5, src: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'DJ performing', event: 'Neon Nights', date: '2024-01-20', category: 'Artists' },
    { id: 6, src: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Crowd dancing', event: 'Neon Nights', date: '2024-01-20', category: 'Crowd' },
    { id: 7, src: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Stage lights', event: 'Neon Nights', date: '2024-01-20', category: 'Venue' },
    { id: 8, src: 'https://images.pexels.com/photos/1563356/pexels-photo-1563356.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Concert atmosphere', event: 'Neon Nights', date: '2024-01-20', category: 'Events' },
  ];

  const filteredImages = galleryImages.filter(image => {
    const matchesSearch = image.alt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         image.event.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === null || selectedCategory === 'All' || image.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
                    placeholder="Search by event or description..."
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
                      {category}
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
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-white font-semibold">{image.event}</h3>
                        <p className="text-white/70 text-sm">{image.date}</p>
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
                  src={selectedImage.src}
                  alt={selectedImage.alt}
                  className="w-full h-auto rounded-xl"
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent rounded-b-xl">
                  <h3 className="text-white text-xl font-semibold">{selectedImage.event}</h3>
                  <p className="text-white/70">{selectedImage.date}</p>
                  <p className="text-white/70 mt-2">{selectedImage.alt}</p>
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