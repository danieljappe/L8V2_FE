import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getPlatformFromSubdomain, shouldShowPlatformChoice, getRedirectUrl } from '../utils/subdomainUtils';
import PlatformChoice from './PlatformChoice';

interface PlatformRouterProps {
  children: React.ReactNode;
}

const PlatformRouter: React.FC<PlatformRouterProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkPlatform = () => {
      const platform = getPlatformFromSubdomain();
      const showChoice = shouldShowPlatformChoice();
      
      // If we should show platform choice, don't redirect
      if (showChoice) {
        setIsChecking(false);
        return;
      }
      
      // Only handle subdomain logic in production (not localhost)
      if (platform !== 'main' && !window.location.hostname.includes('localhost')) {
        const currentPath = location.pathname;
        
        // Redirect to appropriate platform if needed
        if (platform === 'events' && currentPath.startsWith('/booking')) {
          const redirectUrl = getRedirectUrl('events');
          window.location.href = `${redirectUrl}${currentPath.replace('/booking', '')}`;
          return;
        }
        
        // Handle cross-platform navigation - if on booking subdomain and trying to access events content
        if (platform === 'booking' && currentPath.startsWith('/events')) {
          const redirectUrl = getRedirectUrl('events');
          window.location.href = `${redirectUrl}${currentPath}`;
          return;
        }
        
        // Handle other non-booking paths on booking subdomain
        if (platform === 'booking' && !currentPath.startsWith('/booking') && !currentPath.startsWith('/events') && currentPath !== '/') {
          const redirectUrl = getRedirectUrl('booking');
          window.location.href = `${redirectUrl}/booking${currentPath}`;
          return;
        }
        
        // If on booking subdomain and on root path, redirect to /booking
        if (platform === 'booking' && currentPath === '/') {
          const redirectUrl = getRedirectUrl('booking');
          window.location.href = `${redirectUrl}/booking`;
          return;
        }
      }
      
      setIsChecking(false);
    };

    checkPlatform();
  }, [location.pathname, navigate]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <div className="w-8 h-8 bg-white rounded-full" />
          </div>
          <p className="text-white/60">Loading platform...</p>
        </div>
      </div>
    );
  }

  // Show platform choice if needed
  if (shouldShowPlatformChoice()) {
    return <PlatformChoice />;
  }

  return <>{children}</>;
};

export default PlatformRouter;
