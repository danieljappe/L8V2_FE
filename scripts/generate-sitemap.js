import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// API Base URL - adjust this based on your backend deployment
const API_BASE_URL = process.env.VITE_API_URL || 'https://l8events.dk/api';

// Helper function to fetch data from API
const fetchFromAPI = async (endpoint) => {
  try {
    // Add timeout to prevent hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      console.warn(`Failed to fetch ${endpoint}: ${response.status} ${response.statusText}`);
      return [];
    }
    
    const jsonData = await response.json();
    
    // Handle API response format: { data: [...] } or just [...]
    let data = jsonData;
    if (jsonData && typeof jsonData === 'object' && 'data' in jsonData) {
      data = jsonData.data;
    }
    
    // Ensure we return an array
    if (!Array.isArray(data)) {
      console.warn(`Unexpected data format from ${endpoint}, expected array`);
      return [];
    }
    
    return data || [];
  } catch (error) {
    if (error.name === 'AbortError') {
      console.warn(`Timeout fetching ${endpoint} (10s limit)`);
    } else {
      console.warn(`Error fetching ${endpoint}:`, error.message);
    }
    return [];
  }
};

// Generate sitemap with both static and dynamic content
const generateSitemap = async () => {
  const baseUrl = 'https://l8events.dk';
  
  // Static pages
  const staticPages = [
    {
      url: '/',
      changefreq: 'weekly',
      priority: 1.0
    },
    {
      url: '/home',
      changefreq: 'weekly',
      priority: 0.9
    },
    {
      url: '/events',
      changefreq: 'daily',
      priority: 0.9
    },
    {
      url: '/artists',
      changefreq: 'weekly',
      priority: 0.8
    },
    {
      url: '/gallery',
      changefreq: 'weekly',
      priority: 0.7
    },
    {
      url: '/booking',
      changefreq: 'monthly',
      priority: 0.8
    },
    {
      url: '/booking/artists',
      changefreq: 'monthly',
      priority: 0.7
    },
    {
      url: '/booking/contact',
      changefreq: 'monthly',
      priority: 0.6
    },
    {
      url: '/about',
      changefreq: 'monthly',
      priority: 0.6
    },
    {
      url: '/contact',
      changefreq: 'monthly',
      priority: 0.6
    }
  ];

  // Fetch dynamic content from API
  console.log('Fetching dynamic content from API...');
  console.log(`API Base URL: ${API_BASE_URL}`);
  
  const [events, artists] = await Promise.all([
    fetchFromAPI('/events'),
    fetchFromAPI('/artists')
  ]);

  console.log(`Found ${events.length} events and ${artists.length} artists`);
  
  if (events.length === 0 && artists.length === 0) {
    console.warn('⚠️  Warning: No dynamic content fetched from API. Sitemap will only include static pages.');
    console.warn('   This may be normal if the API is unavailable during build time.');
    console.warn('   The sitemap will still be generated with static pages.');
  }

  // Add dynamic event pages
  const eventPages = events.map(event => ({
    url: `/events/${event.id}`,
    lastmod: event.updatedAt ? new Date(event.updatedAt).toISOString().split('T')[0] : undefined,
    changefreq: 'weekly',
    priority: 0.8
  }));

  // Add dynamic artist pages (for booking platform)
  const artistPages = artists.map(artist => {
    const slug = artist.name.toLowerCase().replace(/\s+/g, '-');
    return {
      url: `/booking/artists/${slug}`,
      lastmod: artist.updatedAt ? new Date(artist.updatedAt).toISOString().split('T')[0] : undefined,
      changefreq: 'monthly',
      priority: 0.7
    };
  });

  // Combine all pages
  const allPages = [...staticPages, ...eventPages, ...artistPages];

  // Generate XML
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  allPages.forEach(page => {
    const fullUrl = page.url.startsWith('http') ? page.url : `${baseUrl}${page.url}`;
    const lastmod = page.lastmod || new Date().toISOString().split('T')[0];
    const changefreq = page.changefreq || 'weekly';
    const priority = page.priority || 0.5;

    sitemap += `
  <url>
    <loc>${fullUrl}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  });

  sitemap += `
</urlset>`;

  return {
    sitemap,
    staticCount: staticPages.length,
    dynamicCount: eventPages.length + artistPages.length,
    totalCount: allPages.length
  };
};

// Generate and write sitemap
const main = async () => {
  try {
    console.log('Generating sitemap...');
    const { sitemap, staticCount, dynamicCount, totalCount } = await generateSitemap();
    
    const publicPath = path.join(__dirname, '../public');
    const sitemapPath = path.join(publicPath, 'sitemap.xml');
    
    // Ensure public directory exists
    if (!fs.existsSync(publicPath)) {
      fs.mkdirSync(publicPath, { recursive: true });
    }
    
    fs.writeFileSync(sitemapPath, sitemap);
    
    console.log('✅ Sitemap generated successfully at:', sitemapPath);
    console.log(`   Total URLs: ${totalCount} (${staticCount} static, ${dynamicCount} dynamic)`);
    
    if (dynamicCount === 0) {
      console.log('   ⚠️  Note: No dynamic URLs included. If this is unexpected, check API connectivity.');
      console.log('   The sitemap will still work with static pages only.');
    }
  } catch (error) {
    console.error('Error generating sitemap:', error);
    process.exit(1);
  }
};

main();
