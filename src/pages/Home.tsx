import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, ArrowRight, Info } from 'lucide-react';
import UpcomingEvent from '../components/UpcomingEvent';
import PreviousEventGallery from '../components/PreviousEventGallery';
import SocialMediaSection from '../components/SocialMediaSection';
import { useSEO } from '../hooks/useSEO';
import { StructuredData, createOrganizationSchema, createWebSiteSchema } from '../components/StructuredData';
// No subdomain utilities needed

const Home: React.FC = () => {
  const navigate = useNavigate();

  // SEO optimization
  useSEO({
    title: 'L8 Events - Uforglemmelige Musikkopplevelser',
    description: 'L8 Events skaber uforglemmelige musikoplevelser. Book kunstnere, deltag i vores begivenheder, og se afholdte events. Event management og booking service.',
    keywords: 'L8, l8events, L8 Events, event booking, kunstnere, events, booking, musik, DJ, producer',
    url: '/'
  });

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Structured Data for SEO */}
      <StructuredData data={createOrganizationSchema()} />
      <StructuredData data={createWebSiteSchema()} />
      
      {/* Main Content */}
      <main className="relative z-10 pt-6">
        <UpcomingEvent />
        <SocialMediaSection />
        <PreviousEventGallery />
        
        {/* Quick Navigation Section */}
        <section className="py-16 flex items-center justify-center p-4 snap-start">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
                Udforsk L8 Events
              </h2>
              <p className="text-white/70 text-base sm:text-lg max-w-2xl mx-auto px-4">
                Opdag kommende begivenheder, gennemse vores galleri, eller book dine favoritkunstnere til dit næste event.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Events Navigation */}
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="group cursor-pointer"
                onClick={() => navigate('/events')}
              >
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-2xl hover:bg-white/15 transition-all duration-300 hover:scale-105 h-80 flex flex-col">
                  <div className="flex items-center justify-center w-16 h-16 bg-l8-blue/20 rounded-2xl mb-6 mx-auto group-hover:bg-l8-blue/30 transition-colors">
                    <Calendar className="w-8 h-8 text-l8-beige" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Begivenheder</h3>
                  <p className="text-white/70 mb-6 flex-grow">
                    Opdag vores kommende begivenheder eller se highlights fra tidligere events.
                  </p>
                  <div className="flex items-center justify-center text-l8-beige group-hover:text-l8-beige-light transition-colors mt-auto">
                    <span className="mr-2">Udforsk Begivenheder</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>

              {/* Booking Navigation */}
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="group cursor-pointer"
                onClick={() => navigate('/booking')}
              >
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-2xl hover:bg-white/15 transition-all duration-300 hover:scale-105 h-80 flex flex-col">
                  <div className="flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-2xl mb-6 mx-auto group-hover:bg-blue-500/30 transition-colors">
                    <Users className="w-8 h-8 text-blue-300" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Booking</h3>
                  <p className="text-white/70 mb-6 flex-grow">
                    Book talentfulde artister til dine events og skab uforglemmelige oplevelser.
                  </p>
                  <div className="flex items-center justify-center text-blue-300 group-hover:text-blue-200 transition-colors mt-auto">
                    <span className="mr-2">Book Kunstnere</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>

              {/* About Us Navigation */}
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="group cursor-pointer"
                onClick={() => navigate('/about')}
              >
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-2xl hover:bg-white/15 transition-all duration-300 hover:scale-105 h-80 flex flex-col">
                  <div className="flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-2xl mb-6 mx-auto group-hover:bg-green-500/30 transition-colors">
                    <Info className="w-8 h-8 text-green-300" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Om Os</h3>
                  <p className="text-white/70 mb-6 flex-grow">
                    Lær mere om L8 Events og vores mission om at skabe uforglemmelige musikoplevelser.
                  </p>
                  <div className="flex items-center justify-center text-green-300 group-hover:text-green-200 transition-colors mt-auto">
                    <span className="mr-2">Læs Mere</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home; 