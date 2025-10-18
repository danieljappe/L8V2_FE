import React from 'react';

interface StructuredDataProps {
  data: any;
}

export const StructuredData: React.FC<StructuredDataProps> = ({ data }) => {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data, null, 2)
      }}
    />
  );
};

// Helper functions for common structured data types
export const createOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "L8 Events",
  "url": "https://l8events.dk",
  "logo": "https://l8events.dk/l8logo.png",
  "description": "L8 Events skaber uforglemmelige musikkopplevelser med elektronisk musik. Professionel event management og booking service.",
  "sameAs": [
    "https://www.facebook.com/l8events",
    "https://www.instagram.com/l8events",
    "https://soundcloud.com/l8events"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+45-XX-XX-XX-XX",
    "contactType": "customer service",
    "availableLanguage": ["Danish", "English"]
  },
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "DK"
  }
});

export const createEventSchema = (event: any) => ({
  "@context": "https://schema.org",
  "@type": "Event",
  "name": event.title,
  "description": event.description,
  "startDate": event.startDate,
  "endDate": event.endDate,
  "location": {
    "@type": "Place",
    "name": event.venue?.name || "TBA",
    "address": event.venue?.address || "TBA"
  },
  "organizer": {
    "@type": "Organization",
    "name": "L8 Events",
    "url": "https://l8events.dk"
  },
  "offers": event.isBookable ? {
    "@type": "Offer",
    "url": `https://l8events.dk/events/${event.id}`,
    "price": "0",
    "priceCurrency": "DKK",
    "availability": "https://schema.org/InStock"
  } : undefined,
  "image": event.image ? `https://l8events.dk/uploads/events/${event.image}` : "https://l8events.dk/l8logo.png"
});

export const createArtistSchema = (artist: any) => ({
  "@context": "https://schema.org",
  "@type": "Person",
  "name": artist.name,
  "description": artist.bio,
  "image": artist.image ? `https://l8events.dk/uploads/artists/${artist.image}` : "https://l8events.dk/placeholder-artist.jpg",
  "jobTitle": "DJ/Producer",
  "worksFor": {
    "@type": "Organization",
    "name": "L8 Events"
  },
  "sameAs": [
    artist.soundcloudUrl,
    artist.spotifyUrl,
    artist.instagramUrl
  ].filter(Boolean),
  "url": `https://l8events.dk/artists/${artist.name.toLowerCase().replace(/\s+/g, '-')}`
});

export const createWebSiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "L8 Events",
  "url": "https://l8events.dk",
  "description": "L8 Events skaber uforglemmelige musikkopplevelser med elektronisk musik",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://l8events.dk/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
});
