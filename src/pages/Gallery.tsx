import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { useGalleryImages } from '../hooks/useApi';
import { GalleryImage } from '../services/api';
import { constructFullUrl } from '../utils/imageUtils';

// Create a fallback image as a data URL to avoid external dependencies
const FALLBACK_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzc0MTUxIiBzdHJva2U9IiM2Mzc1OTEiIHN0cm9rZS13aWR0aD0iMiIvPjx0ZXh0IHg9IjUwJSIgeT0iNDAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5Q0ExQTciIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBOb3QgRm91bmQ8L3RleHQ+PHRleHQgeD0iNTAlIiB5PSI2MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzZCNzI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPjQwMCB4IDMwMDwvdGV4dD48L3N2Zz4=';

interface ImageWithErrorHandlingProps {
  image: GalleryImage;
  imageUrl: string;
}

const ImageWithErrorHandling: React.FC<ImageWithErrorHandlingProps> = ({ image, imageUrl }) => {
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(imageUrl);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error(`Failed to load image: ${currentSrc}`);
    
    if (!hasError) {
      setHasError(true);
      setCurrentSrc(FALLBACK_IMAGE);
      setIsLoading(false);
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  // Reset error state when imageUrl changes
  useEffect(() => {
    setHasError(false);
    setCurrentSrc(imageUrl);
    setIsLoading(true);
  }, [imageUrl]);

  return (
    <div className="relative">
      {isLoading && !hasError && (
        <div className="absolute inset-0 bg-gray-700 animate-pulse flex items-center justify-center">
          <div className="text-gray-400 text-sm">Loading...</div>
        </div>
      )}
      <img
        src={currentSrc}
        alt={image.caption || 'Gallery image'}
        className={`w-full h-48 object-cover transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        onError={handleError}
        onLoad={handleLoad}
        loading="lazy"
      />
      {hasError && (
        <div className="absolute top-2 right-2 bg-red-500 bg-opacity-75 text-white text-xs px-2 py-1 rounded">
          Failed to load
        </div>
      )}
    </div>
  );
};

const Gallery: React.FC = () => {
  const { data: images, loading, error } = useGalleryImages();

  // Filter published images - temporarily show all images for debugging
  const publishedImages = images || [];

  useEffect(() => {
    // Debug: Log the images data
    console.log('Gallery images:', images);
    if (images && images.length > 0) {
      console.log('First image URL:', constructFullUrl(images[0].url));
    }
  }, [images]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Header />
        <div className="pt-24 text-center">
          <div className="text-white text-xl">Loading gallery...</div>
          <div className="mt-4">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Header />
        <div className="pt-24 text-center">
          <div className="text-red-400 text-xl mb-4">Failed to load gallery</div>
          <div className="text-gray-400 text-sm">
            Error: {error.message || 'Unknown error occurred'}
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
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
          
          {/* Debug info - remove in production */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mb-4 p-4 bg-gray-800 rounded-lg text-sm text-gray-300">
              <strong>Debug Info:</strong> Found {publishedImages.length} images
              {publishedImages.length > 0 && (
                <div className="mt-2">
                  <strong>Sample URL:</strong> {constructFullUrl(publishedImages[0].url)}
                </div>
              )}
            </div>
          )}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {publishedImages.map((image) => {
              const imageUrl = constructFullUrl(image.url);
              
              return (
                <div key={image.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <ImageWithErrorHandling image={image} imageUrl={imageUrl} />
                  <div className="p-4">
                    <h3 className="text-white font-semibold text-lg mb-2">
                      {image.caption || 'Untitled'}
                    </h3>
                    <p className="text-gray-400 text-sm mb-2">
                      {new Date(image.createdAt).toLocaleDateString()}
                    </p>
                    {image.photographer && (
                      <p className="text-gray-300 text-sm mb-1">
                        <span className="text-gray-400">By:</span> {image.photographer}
                      </p>
                    )}
                    {image.category && (
                      <p className="text-gray-300 text-sm">
                        <span className="text-gray-400">Category:</span> {image.category}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          {publishedImages.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-4">No images found</div>
              <p className="text-gray-500 text-sm">
                Images will appear here once they are uploaded and published.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Gallery;