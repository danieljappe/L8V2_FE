import React, { useState, useEffect } from 'react';
import Header from '../components/Header';

interface SimpleImage {
  id: string;
  url: string;
  caption?: string;
  event?: { title?: string };
  createdAt: string;
}

const Gallery: React.FC = () => {
  const [images, setImages] = useState<SimpleImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/gallery');
        const data = await response.json();
        
        if (data && Array.isArray(data)) {
          const publishedImages = data.filter((img: any) => img.isPublished);
          setImages(publishedImages);
        }
      } catch (error) {
        console.error('Failed to fetch images:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Header />
        <div className="pt-24 text-center">
          <div className="text-white text-xl">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      
      <div className="pt-24 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-white text-center mb-8">Gallery</h1>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((image) => (
              <div key={image.id} className="bg-gray-800 rounded-lg overflow-hidden">
                <img
                  src={image.url}
                  alt={image.caption || 'Gallery image'}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-white font-semibold">
                    {image.event?.title || 'Event'}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {new Date(image.createdAt).toLocaleDateString()}
                  </p>
                  {image.caption && (
                    <p className="text-gray-300 text-sm mt-2">{image.caption}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {images.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No images found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Gallery; 