import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Home } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const breadcrumbNameMap: { [key: string]: string } = {
    home: 'Home',
    events: 'Begivenheder',
    artists: 'Kunstnere',
    gallery: 'Galleri',
    about: 'Om Os',
    contact: 'Kontakt',
    admin: 'Admin',
    booking: 'Booking',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center space-x-2 text-sm"
    >
      <Link to="/home">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center text-white/60 hover:text-white transition-colors"
        >
          <Home className="w-4 h-4" />
        </motion.div>
      </Link>

      {pathnames.map((value, index) => {
        const last = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const displayName = breadcrumbNameMap[value] || value;

        return (
          <React.Fragment key={to}>
            <ChevronRight className="w-4 h-4 text-white/40" />
            {last ? (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-white font-medium"
              >
                {displayName}
              </motion.span>
            ) : (
              <Link to={to}>
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  {displayName}
                </motion.span>
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </motion.div>
  );
};

export default Breadcrumbs; 