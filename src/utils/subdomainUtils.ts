// Subdomain detection and routing utilities

export const getSubdomain = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  const hostname = window.location.hostname;
  
  // Handle localhost development
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    const port = window.location.port;
    if (port === '3000') return 'events'; // Default to events for localhost:3000
    if (port === '3001') return 'booking'; // Booking platform on localhost:3001
    return null;
  }
  
  // Handle production subdomains
  const parts = hostname.split('.');
  if (parts.length >= 3) {
    const subdomain = parts[0];
    // Skip www subdomain - treat it as main domain
    if (subdomain === 'www') return null;
    if (subdomain === 'events' || subdomain === 'booking') {
      return subdomain;
    }
  }
  
  return null;
};

export const getPlatformFromSubdomain = (): 'events' | 'booking' | 'main' => {
  const subdomain = getSubdomain();
  
  if (subdomain === 'events') return 'events';
  if (subdomain === 'booking') return 'booking';
  return 'main';
};

export const getRedirectUrl = (platform: 'events' | 'booking'): string => {
  const currentHost = window.location.host;
  const protocol = window.location.protocol;
  
  if (currentHost.includes('localhost')) {
    // Development environment
    const port = platform === 'booking' ? '3001' : '3000';
    return `${protocol}//localhost:${port}`;
  }
  
  // Production environment
  const subdomain = platform === 'booking' ? 'booking' : 'events';
  const domain = currentHost.replace(/^(events|booking)\./, '');
  return `${protocol}//${subdomain}.${domain}`;
};

export const shouldShowPlatformChoice = (): boolean => {
  const subdomain = getSubdomain();
  
  // If we're on a subdomain, don't show platform choice
  if (subdomain) return false;
  
  // Only show platform choice on the root path of main domain (www.l8events.dk)
  return window.location.pathname === '/';
};
