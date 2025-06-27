import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Instagram, Twitter, Facebook, CheckCircle, AlertCircle } from 'lucide-react';
import { useCreateContactMessage } from '../hooks/useApi';
import { ContactMessage } from '../services/api';

const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [formStatus, setFormStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const { mutate: createContactMessage, loading, error } = useCreateContactMessage();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setFormStatus('error');
      setStatusMessage('Please fill in all fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setFormStatus('error');
      setStatusMessage('Please enter a valid email address');
      return;
    }

    try {
      const result = await createContactMessage(formData as Partial<ContactMessage>);
      
      if (result?.error) {
        setFormStatus('error');
        setStatusMessage(result.error);
      } else {
        setFormStatus('success');
        setStatusMessage('Message sent successfully! We\'ll get back to you soon.');
        setFormData({ name: '', email: '', subject: '', message: '' });
      }
    } catch (err) {
      setFormStatus('error');
      setStatusMessage('Failed to send message. Please try again.');
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      label: 'E-mail',
      value: 'hello@l8events.com',
      href: 'mailto:hello@l8events.com'
    },
    {
      icon: Phone,
      label: 'Telefon',
      value: '+1 (555) 123-4567',
      href: 'tel:+15551234567'
    },
    {
      icon: MapPin,
      label: 'Lokation',
      value: 'Los Angeles, CA',
      href: '#'
    }
  ];

  const socialMedia = [
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Facebook, href: '#', label: 'Facebook' }
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
    <section id="contact" className="min-h-screen flex items-center justify-center p-4 snap-start pt-20">
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
            Kontakt Os
          </motion.h2>
          <motion.p 
            variants={itemVariants}
            className="text-white/70 text-base sm:text-lg max-w-2xl mx-auto px-4"
          >
            Har du spørgsmål om vores begivenheder eller ønsker at booke en kunstner? Vi vil meget gerne høre fra dig. Lad os skabe noget fantastisk sammen.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Contact Form */}
          <motion.div 
            variants={itemVariants}
            className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-6 sm:p-8 shadow-2xl"
          >
            <motion.h3 
              variants={itemVariants}
              className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6"
            >
              Send us a Message
            </motion.h3>
            
            {/* Status Message */}
            {formStatus !== 'idle' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mb-4 p-3 rounded-lg flex items-center space-x-2 ${
                  formStatus === 'success' 
                    ? 'bg-green-500/20 border border-green-300/30 text-green-200' 
                    : 'bg-red-500/20 border border-red-300/30 text-red-200'
                }`}
              >
                {formStatus === 'success' ? (
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                )}
                <span className="text-sm">{statusMessage}</span>
              </motion.div>
            )}
            
            <motion.form 
              variants={containerVariants}
              onSubmit={handleSubmit} 
              className="space-y-4 sm:space-y-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <motion.div variants={itemVariants}>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Name
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-400 transition-colors text-sm sm:text-base"
                    placeholder="Your name"
                    required
                    disabled={loading}
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
                    disabled={loading}
                  />
                </motion.div>
              </div>

              <motion.div variants={itemVariants}>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Subject
                </label>
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-400 transition-colors text-sm sm:text-base"
                  placeholder="What's this about?"
                  required
                  disabled={loading}
                />
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
                  rows={5}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-400 transition-colors resize-none text-sm sm:text-base"
                  placeholder="Tell us more about your inquiry..."
                  required
                  disabled={loading}
                ></motion.textarea>
              </motion.div>

              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 sm:py-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 text-sm sm:text-base disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Send Message</span>
                  </>
                )}
              </motion.button>
            </motion.form>
          </motion.div>

          {/* Contact Info */}
          <div className="space-y-4 sm:space-y-6">
            {/* Contact Details */}
            <motion.div 
              variants={itemVariants}
              className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-6 sm:p-8 shadow-2xl"
            >
              <motion.h3 
                variants={itemVariants}
                className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6"
              >
                Contact Information
              </motion.h3>
              
              <motion.div 
                variants={containerVariants}
                className="space-y-4"
              >
                {contactInfo.map((info, index) => (
                  <motion.a
                    key={info.label}
                    variants={itemVariants}
                    href={info.href}
                    whileHover={{ scale: 1.02, x: 5 }}
                    className="flex items-center space-x-3 text-white/80 hover:text-white transition-colors duration-300"
                  >
                    <div className="p-2 sm:p-3 bg-purple-500/20 rounded-xl">
                      <info.icon className="w-4 h-4 sm:w-5 sm:h-5 text-purple-300" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-white/60">{info.label}</p>
                      <p className="font-semibold text-sm sm:text-base">{info.value}</p>
                    </div>
                  </motion.a>
                ))}
              </motion.div>
            </motion.div>

            {/* Social Media */}
            <motion.div 
              variants={itemVariants}
              className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-6 sm:p-8 shadow-2xl"
            >
              <motion.h3 
                variants={itemVariants}
                className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6"
              >
                Follow Us
              </motion.h3>
              
              <motion.div 
                variants={containerVariants}
                className="flex items-center space-x-4"
              >
                {socialMedia.map((social, index) => (
                  <motion.a
                    key={social.label}
                    variants={itemVariants}
                    href={social.href}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-3 sm:p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300"
                  >
                    <social.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </motion.a>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default ContactSection;