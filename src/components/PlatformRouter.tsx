import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getPlatformFromPath, shouldShowPlatformChoice } from '../utils/subdomainUtils';
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
      const showChoice = shouldShowPlatformChoice();
      
      // If we should show platform choice, don't redirect
      if (showChoice) {
        setIsChecking(false);
        return;
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
