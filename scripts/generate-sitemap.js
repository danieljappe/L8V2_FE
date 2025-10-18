import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// This script would typically fetch data from your API
// For now, we'll generate a basic sitemap with static pages

const generateSitemap = () => {
  const baseUrl = 'https://l8events.dk';
  
  const staticPages = [
    {
      url: '/',
      changefreq: 'weekly',
      priority: 1.0
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

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  staticPages.forEach(page => {
    const fullUrl = page.url.startsWith('http') ? page.url : `${baseUrl}${page.url}`;
    const lastmod = new Date().toISOString().split('T')[0];
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

  return sitemap;
};

// Generate and write sitemap
const sitemap = generateSitemap();
const publicPath = path.join(__dirname, '../public');
const sitemapPath = path.join(publicPath, 'sitemap.xml');

fs.writeFileSync(sitemapPath, sitemap);
console.log('Sitemap generated successfully at:', sitemapPath);
