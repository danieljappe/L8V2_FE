// Subdomain detection and routing utilities

export const getSubdomain = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  const hostname = window.location.hostname;
  
  // Handle localhost development - check for test subdomains
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    // Check for test subdomain parameters (for testing production behavior locally)
    const urlParams = new URLSearchParams(window.location.search);
    const testSubdomain = urlParams.get('test-subdomain');
    if (testSubdomain === 'events' || testSubdomain === 'booking') {
      return testSubdomain;
    }
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
  
  // For development on localhost, check if we're testing subdomain behavior
  if (currentHost.includes('localhost')) {
    const urlParams = new URLSearchParams(window.location.search);
    const testSubdomain = urlParams.get('test-subdomain');
    
    // If testing subdomain behavior, simulate production redirects
    if (testSubdomain) {
      const subdomain = platform === 'booking' ? 'booking' : 'events';
      return `${protocol}//${subdomain}.l8events.dk`;
    }
    
    // Normal localhost behavior - just navigate to path
    const path = platform === 'booking' ? '/booking' : '/events';
    return `${protocol}//${currentHost}${path}`;
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
