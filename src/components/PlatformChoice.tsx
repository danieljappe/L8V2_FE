import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Scene from './3DScene';
import { getRedirectUrl } from '../utils/subdomainUtils';

const PlatformChoice: React.FC = () => {
  const navigate = useNavigate();

  const handlePlatformChoice = (platform: string) => {
    localStorage.setItem('l8-platform-choice', platform);
    if (platform === 'events') {
      const redirectUrl = getRedirectUrl('events');
      window.location.href = redirectUrl;
    } else if (platform === 'booking') {
      const redirectUrl = getRedirectUrl('booking');
      window.location.href = redirectUrl;
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <Scene />
      </div>
      
      {/* Split Background Overlay */}
      <div className="absolute inset-0 flex z-10">
        {/* Left Side - Events */}
        <motion.div 
          className="flex-1 bg-gradient-to-br from-purple-900/50 to-purple-700/50 relative backdrop-blur-sm"
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="absolute inset-0 bg-black/10" />
        </motion.div>
        
        {/* Right Side - Booking */}
        <motion.div 
          className="flex-1 bg-gradient-to-br from-blue-900/50 to-blue-700/50 relative backdrop-blur-sm"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
        >
          <div className="absolute inset-0 bg-black/10" />
        </motion.div>
      </div>

      {/* Center Divider */}
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/20 transform -translate-x-1/2 z-20" />

      {/* Content */}
      <div className="relative z-30 h-screen flex">
        {/* Left Side - Events */}
        <motion.div 
          className="flex-1 flex items-center justify-center relative group cursor-pointer"
          onClick={() => handlePlatformChoice('events')}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-center px-8">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-8"
            >
              <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-white/20 transition-all duration-300">
                <Calendar className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-6xl md:text-7xl font-light text-white mb-2">L8 Events</h1>
              <h2 className="text-xl md:text-2xl font-light text-white/60">events.l8events.dk</h2>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-white/60 text-lg max-w-md mx-auto mb-8 group-hover:text-white/80 transition-colors duration-300"
            >
              Udforsk vores kommende og tidligere events. Køb din billet idag!
            </motion.p>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex items-center justify-center space-x-2 text-white/60 group-hover:text-white transition-colors duration-300"
            >
              <span className="text-sm font-medium">Kom i gang</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </motion.div>

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </motion.div>

        {/* Right Side - Booking */}
        <motion.div 
          className="flex-1 flex items-center justify-center relative group cursor-pointer"
          onClick={() => handlePlatformChoice('booking')}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-center px-8">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mb-8"
            >
              <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-white/20 transition-all duration-300">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-6xl md:text-7xl font-light text-white mb-2">L8 Booking</h1>
              <h2 className="text-xl md:text-2xl font-light text-white/60">booking.l8events.dk</h2>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-white/60 text-lg max-w-md mx-auto mb-8 group-hover:text-white/80 transition-colors duration-300"
            >
              Udforsk og book talentfulde kunstnere til din næste begivenhed
            </motion.p>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="flex items-center justify-center space-x-2 text-white/60 group-hover:text-white transition-colors duration-300"
            >
              <span className="text-sm font-medium">Udforsk kunstnere</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </motion.div>

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PlatformChoice;
