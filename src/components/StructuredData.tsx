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
  "logo": "https://l8events.dk/l8logo.webp",
  "image": "https://l8events.dk/l8logo.webp",
  "description": "L8 Events skaber events med fokus på vækstlaget i dansk musik og agerer som booker for spirrende artister. Kom for koncerterne, bliv for festen. Dont be L8!",
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
  "image": event.image ? `https://l8events.dk/uploads/events/${event.image}` : "https://l8events.dk/l8logo.webp"
});

export const createArtistSchema = (artist: any) => {
  // Extract social media URLs from the socialMedia array
  const socialUrls = artist.socialMedia && Array.isArray(artist.socialMedia)
    ? artist.socialMedia.map((social: any) => social.url).filter(Boolean)
    : [];
  
  // Add website if available
  if (artist.website) {
    socialUrls.push(artist.website);
  }

  // Construct image URL
  let imageUrl = "https://l8events.dk/l8logo.webp";
  if (artist.imageUrl) {
    if (artist.imageUrl.startsWith('http')) {
      imageUrl = artist.imageUrl;
    } else {
      imageUrl = `https://l8events.dk${artist.imageUrl}`;
    }
  }

  // Construct page URL
  const artistSlug = artist.name.toLowerCase().replace(/\s+/g, '-');
  const pageUrl = `https://l8events.dk/booking/artists/${artistSlug}`;

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": artist.name,
    "description": artist.bio || `${artist.name} er en talentfuld artist booket gennem L8 Events. Book ${artist.name} til dit event.`,
    "image": imageUrl,
    "jobTitle": artist.genre ? `${artist.genre} Artist` : "Musik Artist",
    "worksFor": {
      "@type": "Organization",
      "name": "L8 Events",
      "url": "https://l8events.dk"
    },
    "sameAs": socialUrls.length > 0 ? socialUrls : undefined,
    "url": pageUrl,
    "knowsAbout": artist.genre ? [artist.genre, "Musik", "Booking", "Events"] : ["Musik", "Booking", "Events"],
    ...(artist.website ? { "mainEntityOfPage": artist.website } : {})
  };
};

export const createWebSiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "L8 Events",
  "url": "https://l8events.dk",
  "description": "L8 Events skaber events med fokus på vækstlaget i dansk musik og agerer som booker for spirrende artister. Kom for koncerterne, bliv for festen. Dont be L8!",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://l8events.dk/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
});
