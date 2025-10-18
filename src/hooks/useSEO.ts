import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

export const useSEO = ({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website'
}: SEOProps) => {
  useEffect(() => {
    const baseTitle = 'L8 Events - Uforglemmelige Musikkopplevelser';
    const baseDescription = 'L8 Events skaber uforglemmelige musikkopplevelser med elektronisk musik. Book kunstnere, deltag i vores begivenheder og oplev noget ekstraordinært.';
    const baseUrl = 'https://l8events.dk';
    
    const finalTitle = title ? `${title} | ${baseTitle}` : baseTitle;
    const finalDescription = description || baseDescription;
    const finalUrl = url ? `${baseUrl}${url}` : baseUrl;
    const finalImage = image ? `${baseUrl}${image}` : `${baseUrl}/l8logo.png`;

    // Update document title
    document.title = finalTitle;

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', finalDescription);
    }

    // Update meta keywords
    if (keywords) {
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute('content', keywords);
    }

    // Update Open Graph tags
    const ogTags = {
      'og:title': finalTitle,
      'og:description': finalDescription,
      'og:url': finalUrl,
      'og:image': finalImage,
      'og:type': type
    };

    Object.entries(ogTags).forEach(([property, content]) => {
      let metaTag = document.querySelector(`meta[property="${property}"]`);
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.setAttribute('property', property);
        document.head.appendChild(metaTag);
      }
      metaTag.setAttribute('content', content);
    });

    // Update Twitter tags
    const twitterTags = {
      'twitter:title': finalTitle,
      'twitter:description': finalDescription,
      'twitter:url': finalUrl,
      'twitter:image': finalImage
    };

    Object.entries(twitterTags).forEach(([name, content]) => {
      let metaTag = document.querySelector(`meta[name="${name}"]`);
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.setAttribute('name', name);
        document.head.appendChild(metaTag);
      }
      metaTag.setAttribute('content', content);
    });

    // Update canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', finalUrl);

  }, [title, description, keywords, image, url, type]);
};
