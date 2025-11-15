import React from 'react';
import { motion } from 'framer-motion';

const SocialMediaSection: React.FC = () => {
  const socialLinks = [
    { 
      name: 'Facebook', 
      icon: '/icons/facebook_icon.png', 
      href: 'https://www.facebook.com/profile.php?id=61556066605549',
      description: ''
    },
    { 
      name: 'TikTok', 
      icon: '/icons/tiktokicon.png', 
      href: 'https://www.tiktok.com/@aldrigl8',
      description: ''
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
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
    <section className="py-16 flex items-center justify-center px-4 sm:px-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="w-full max-w-screen-2xl mx-auto"
      >
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Følg Med
          </h2>
          <p className="text-white/70 text-base sm:text-lg max-w-2xl mx-auto px-4">
            Hold dig opdateret på vores events, kunstnere og de seneste nyheder fra L8 Events
          </p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mb-12 border border-white/10 rounded-3xl w-full sm:p-6 shadow-2xl"
          style={{ minHeight: 720, backgroundColor: '#fafafa' }}
        >
          <iframe
            src="https://emb.fouita.com/widget/0x34cf9e/ftbngklcwg"
            title="Carousel Instagram Feed"
            width="100%"
            height="720"
            frameBorder="0"
            scrolling="no"
            className="w-full h-full min-h-[720px]"
            style={{ width: '100%' }}
            allowFullScreen
          />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {socialLinks.map((social) => (
            <motion.a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="group bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-6 shadow-2xl hover:bg-white/15 transition-all duration-300 text-center"
            >
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all duration-300">
                  <img 
                    src={social.icon} 
                    alt={social.name} 
                    className={`${social.name === 'TikTok' ? 'w-8 h-8' : 'w-6 h-6'} object-contain`}
                  />
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-l8-beige transition-colors">
                {social.name}
              </h3>
              
              <p className="text-white/60 text-sm group-hover:text-white/80 transition-colors">
                {social.description}
              </p>
              
              <div className="mt-4 flex items-center justify-center text-l8-beige group-hover:text-l8-beige-light transition-colors">
                <span className="text-sm font-medium">Besøg {social.name}</span>
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </div>
            </motion.a>
          ))}
        </div>

      </motion.div>
    </section>
  );
};

export default SocialMediaSection;
