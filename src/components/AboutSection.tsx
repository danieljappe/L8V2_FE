import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Users, Music, Award, Target, Zap } from 'lucide-react';

const AboutSection: React.FC = () => {
  const stats = [
    { icon: Users, label: 'Afholdte Begivenheder', value: '50+' },
    { icon: Music, label: 'Bookede Kunstnere', value: '200+' },
    { icon: Heart, label: 'Glade Deltagere', value: '25K+' },
    { icon: Award, label: 'Års Erfaring', value: '5+' }
  ];

  const values = [
    {
      icon: Target,
      title: 'Vores Mission',
      description: 'At skabe uforglemmelige oplevelser, der bringer mennesker sammen gennem musik og kunsts kraft.'
    },
    {
      icon: Zap,
      title: 'Vores Vision',
      description: 'At være det førende begivenhedsproduktionsselskab, kendt for innovation, kvalitet og skabelse af magiske øjeblikke.'
    }
  ];

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
    <section id="about" className="min-h-screen flex items-center justify-center p-4 snap-start pt-20">
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
            Om L8 Events
          </motion.h2>
          <motion.p 
            variants={itemVariants}
            className="text-white/70 text-base sm:text-lg max-w-2xl mx-auto px-4"
          >
            Vi er passionerede omkring at skabe ekstraordinære oplevelser, der forbinder mennesker gennem musik, kunst og fællesskab.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
          {/* Story */}
          <motion.div 
            variants={itemVariants}
            whileHover={{ scale: 1.02, y: -5 }}
            className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-6 sm:p-8 shadow-2xl"
          >
            <motion.h3 
              variants={itemVariants}
              className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6"
            >
              Vores Historie
            </motion.h3>
            <motion.div 
              variants={containerVariants}
              className="space-y-4 text-white/80 leading-relaxed text-sm sm:text-base"
            >
              <motion.p variants={itemVariants}>
                Grundlagt i 2020 startede L8 Events som en lille gruppe musikentusiaster, der troede på live-oplevelsers transformative kraft. Det, der startede som intime sammenkomster i undergrundslokaler, er vokset til et førende begivenhedsproduktionsselskab.
              </motion.p>
              <motion.p variants={itemVariants}>
                Vores rejse har været præget af et engagement i excellence, innovation og skabelse af øjeblikke, der resonerer længe efter den sidste beat. Vi har haft privilegiet af at arbejde med utrolige kunstnere og bygge et fællesskab af musikelskere, der deler vores passion.
              </motion.p>
              <motion.p variants={itemVariants}>
                I dag udvider vi vores vision til at inkludere kunstnerbooking-tjenester, der hjælper med at forbinde talentfulde kunstnere med et publikum, der sætter pris på deres kunst. Hver begivenhed, vi producerer, er et bevis på vores tro på, at musik har kraften til at forene, inspirere og transformere.
              </motion.p>
            </motion.div>
          </motion.div>

          {/* Values */}
          <motion.div 
            variants={containerVariants}
            className="space-y-4 sm:space-y-6"
          >
            {values.map((value, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-4 sm:p-6 shadow-2xl"
              >
                <div className="flex items-start space-x-4">
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="p-2 sm:p-3 bg-purple-500/20 rounded-xl flex-shrink-0"
                  >
                    <value.icon className="w-5 h-5 sm:w-6 sm:h-6 text-purple-300" />
                  </motion.div>
                  <div className="min-w-0">
                    <motion.h4 
                      variants={itemVariants}
                      className="text-lg sm:text-xl font-bold text-white mb-2"
                    >
                      {value.title}
                    </motion.h4>
                    <motion.p 
                      variants={itemVariants}
                      className="text-white/70 leading-relaxed text-sm sm:text-base"
                    >
                      {value.description}
                    </motion.p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ scale: 1.02, y: -5 }}
          className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-6 sm:p-8 shadow-2xl mb-8 sm:mb-12"
        >
          <motion.h3 
            variants={itemVariants}
            className="text-xl sm:text-2xl font-bold text-white mb-6 sm:mb-8 text-center"
          >
            By the Numbers
          </motion.h3>
          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6"
          >
            {stats.map((stat, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -5 }}
                className="text-center"
              >
                <motion.div 
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-3 sm:mb-4 mx-auto"
                >
                  <stat.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </motion.div>
                <motion.div 
                  variants={itemVariants}
                  className="text-2xl sm:text-3xl font-bold text-white mb-1"
                >
                  {stat.value}
                </motion.div>
                <motion.div 
                  variants={itemVariants}
                  className="text-white/60 text-xs sm:text-sm"
                >
                  {stat.label}
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Team Preview */}
        <motion.div 
          variants={itemVariants}
          className="text-center"
        >
          <motion.div 
            variants={itemVariants}
            whileHover={{ scale: 1.02, y: -5 }}
            className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-6 sm:p-8 shadow-2xl"
          >
            <motion.h3 
              variants={itemVariants}
              className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6"
            >
              Meet Our Team
            </motion.h3>
            <motion.div 
              variants={containerVariants}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6"
            >
              {[
                { name: 'Alex Chen', role: 'Founder & Creative Director' },
                { name: 'Sarah Rodriguez', role: 'Event Producer' },
                { name: 'Mike Thompson', role: 'Artist Relations' }
              ].map((member, index) => (
                <motion.div 
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="text-center"
                >
                  <motion.div 
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mx-auto mb-3"
                  ></motion.div>
                  <motion.h4 
                    variants={itemVariants}
                    className="font-semibold text-white text-sm sm:text-base"
                  >
                    {member.name}
                  </motion.h4>
                  <motion.p 
                    variants={itemVariants}
                    className="text-white/60 text-xs sm:text-sm"
                  >
                    {member.role}
                  </motion.p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default AboutSection;