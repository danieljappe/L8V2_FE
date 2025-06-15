import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Star, Mail, Phone, Calendar, Music } from 'lucide-react';

const BookingSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventDate: '',
    artistType: '',
    message: ''
  });

  const featuredArtists = [
    {
      id: 1,
      name: 'DJ Synthwave',
      genre: 'Electronic',
      rating: 4.9,
      image: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=300',
      price: 'From $2,500'
    },
    {
      id: 2,
      name: 'Luna Beats',
      genre: 'House',
      rating: 4.8,
      image: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300',
      price: 'From $3,000'
    },
    {
      id: 3,
      name: 'Neon Pulse',
      genre: 'Techno',
      rating: 4.9,
      image: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=300',
      price: 'From $2,800'
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Booking request:', formData);
    // Handle form submission
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

  return (
    <section id="booking" className="min-h-screen flex items-center justify-center p-4 snap-start pt-20">
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
            Book en Kunstner
          </motion.h2>
          <motion.p 
            variants={itemVariants}
            className="text-white/70 text-base sm:text-lg max-w-2xl mx-auto px-4"
          >
            Bring magien til din begivenhed. Vores talentfulde kunstnere er klar til at skabe uforglemmelige oplevelser for dit publikum.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Featured Artists */}
          <motion.div 
            variants={itemVariants}
            className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-4 sm:p-6 shadow-2xl"
          >
            <motion.h3 
              variants={itemVariants}
              className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 flex items-center"
            >
              <Music className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-purple-300" />
              Featured Artists
            </motion.h3>
            
            <motion.div 
              variants={containerVariants}
              className="space-y-4"
            >
              <AnimatePresence>
                {featuredArtists.map((artist, index) => (
                  <motion.div 
                    key={artist.id}
                    variants={itemVariants}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-white/5 backdrop-blur-sm rounded-2xl p-3 sm:p-4 border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer"
                  >
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <motion.div 
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden flex-shrink-0"
                      >
                        <img
                          src={artist.image}
                          alt={artist.name}
                          className="w-full h-full object-cover"
                        />
                      </motion.div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-white text-base sm:text-lg truncate">{artist.name}</h4>
                        <p className="text-white/60 text-sm">{artist.genre}</p>
                        <div className="flex items-center mt-1">
                          <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" />
                          <span className="text-white/80 text-xs sm:text-sm ml-1">{artist.rating}</span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-white font-semibold text-sm sm:text-base">{artist.price}</p>
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="mt-2 px-3 py-1 sm:px-4 sm:py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs sm:text-sm rounded-xl transition-colors"
                        >
                          Book Now
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              className="mt-6 text-center"
            >
              <motion.button 
                whileHover={{ scale: 1.05, x: 5 }}
                whileTap={{ scale: 0.95 }}
                className="text-purple-300 hover:text-purple-200 font-medium transition-colors text-sm sm:text-base"
              >
                Se Alle Kunstnere →
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Booking Form */}
          <motion.div 
            variants={itemVariants}
            className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-4 sm:p-6 shadow-2xl"
          >
            <motion.h3 
              variants={itemVariants}
              className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 flex items-center"
            >
              <Users className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-purple-300" />
              Anmod om Booking
            </motion.h3>

            <motion.form 
              variants={containerVariants}
              onSubmit={handleSubmit} 
              className="space-y-4 sm:space-y-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <motion.div variants={itemVariants}>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Your Name
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-400 transition-colors text-sm sm:text-base"
                    placeholder="Enter your name"
                    required
                  />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Email
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-400 transition-colors text-sm sm:text-base"
                    placeholder="your@email.com"
                    required
                  />
                </motion.div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <motion.div variants={itemVariants}>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Phone
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-400 transition-colors text-sm sm:text-base"
                    placeholder="+1 (555) 123-4567"
                  />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Event Date
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    type="date"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-400 transition-colors text-sm sm:text-base"
                    required
                  />
                </motion.div>
              </div>

              <motion.div variants={itemVariants}>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Artist Type
                </label>
                <motion.select
                  whileFocus={{ scale: 1.02 }}
                  name="artistType"
                  value={formData.artistType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-400 transition-colors text-sm sm:text-base"
                  required
                >
                  <option value="">Vælg kunstnertype</option>
                  <option value="dj">DJ</option>
                  <option value="live-band">Live Band</option>
                  <option value="electronic">Elektronisk Kunstner</option>
                  <option value="other">Andet</option>
                </motion.select>
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Message
                </label>
                <motion.textarea
                  whileFocus={{ scale: 1.02 }}
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-400 transition-colors resize-none text-sm sm:text-base"
                  placeholder="Fortæl os om din begivenhed..."
                ></motion.textarea>
              </motion.div>

              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 sm:py-4 rounded-xl transition-all duration-300 text-sm sm:text-base"
              >
                Send Booking Request
              </motion.button>
            </motion.form>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default BookingSection;