import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Globe } from 'lucide-react';
import { Artist } from '../../types/admin';
import ArtistFormModal from './ArtistFormModal';

interface ArtistsListProps {
  artists: Artist[];
  onAddArtist: (artistData: Omit<Artist, 'id' | 'createdAt'>) => void;
  onUpdateArtist: (artist: Artist) => void;
  onDeleteArtist: (id: string) => void;
}

export default function ArtistsList({
  artists,
  onAddArtist,
  onUpdateArtist,
  onDeleteArtist
}: ArtistsListProps) {
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Update selectedArtist if the artist data changes
  useEffect(() => {
    if (selectedArtist && !isCreating) {
      const updatedArtist = artists.find(artist => artist.id === selectedArtist.id);
      if (updatedArtist) {
        setSelectedArtist(updatedArtist);
      }
    }
  }, [artists, selectedArtist?.id, isCreating]);

  const handleEdit = (artist: Artist) => {
    setSelectedArtist(artist);
    setIsCreating(false);
  };

  const handleCreate = () => {
    setSelectedArtist(null);
    setIsCreating(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this artist?')) {
      onDeleteArtist(id);
    }
  };

  const handleCloseModal = () => {
    setSelectedArtist(null);
    setIsCreating(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Artists Management</h1>
          <p className="text-gray-600">Manage all your artists and performers.</p>
        </div>
        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Artist</span>
        </button>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {artists.map((artist) => (
          <div key={artist.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group">
            {/* Image Section */}
            <div className="relative h-40 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
              {artist.imageUrl ? (
                <img 
                  src={artist.imageUrl} 
                  alt={artist.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
              ) : null}
              {/* Fallback placeholder */}
              <div className={`w-full h-full flex items-center justify-center ${artist.imageUrl ? 'hidden' : ''}`}>
                <div className="w-12 h-12 bg-gradient-to-br from-l8-blue to-l8-blue-light rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl font-bold">{artist.name.charAt(0).toUpperCase()}</span>
                </div>
              </div>
              
            </div>
            
            {/* Content Section */}
            <div className="p-5">
              {/* Artist Name */}
              <div className="mb-3">
                <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                  {artist.name}
                </h3>
                {artist.bio && (
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {artist.bio}
                  </p>
                )}
              </div>
              
              {/* Stats Row */}
              <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                <div className="flex items-center space-x-3">
                  {/* Social Media Count */}
                  {artist.socialMedia && Array.isArray(artist.socialMedia) && artist.socialMedia.length > 0 && (
                    <div className="flex items-center space-x-1">
                      <span className="text-l8-blue">📱</span>
                      <span>{artist.socialMedia.length} social</span>
                    </div>
                  )}
                  
                  {/* Embeddings Count */}
                  {artist.embeddings && artist.embeddings.length > 0 && (
                    <div className="flex items-center space-x-1">
                      <span className="text-green-500">🎵</span>
                      <span>{artist.embeddings.length} media</span>
                    </div>
                  )}
                  
                  {/* Website Indicator */}
                  {artist.website && (
                    <div className="flex items-center space-x-1">
                      <Globe className="w-3 h-3 text-blue-500" />
                      <span>website</span>
                    </div>
                  )}
                  
                  {/* Bookable Indicator */}
                  {artist.isBookable && (
                    <div className="flex items-center space-x-1">
                      <span className="text-green-500">📅</span>
                      <span>bookable</span>
                    </div>
                  )}
                </div>
                
                {/* Status Indicator */}
                <div className="flex items-center space-x-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  <span>Active</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="text-xs text-gray-400">
                  Updated {artist.updatedAt ? new Date(artist.updatedAt).toLocaleDateString() : 'Unknown'}
                </div>
                
                <div className="flex items-center space-x-1">
                  <button 
                    onClick={() => handleEdit(artist)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                    title="Edit Artist"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(artist.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                    title="Delete Artist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {artists.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <div className="w-20 h-20 bg-gradient-to-br from-l8-beige-light to-l8-beige rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-l8-blue to-l8-blue-dark rounded-full flex items-center justify-center">
              <span className="text-white text-2xl">👨‍🎤</span>
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Artists Yet</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Get started by adding your first artist to the roster
          </p>
          <button
            onClick={handleCreate}
            className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
          >
            <Plus className="w-5 h-5" />
            <span>Add Your First Artist</span>
          </button>
        </div>
      )}

      {/* Artist Form Modal for editing/creating */}
      {(selectedArtist || isCreating) && (
        <ArtistFormModal
          artist={selectedArtist}
          onClose={handleCloseModal}
          onSave={(artist) => {
            if (selectedArtist) {
              onUpdateArtist(artist);
            } else {
              onAddArtist(artist);
            }
          }}
        />
      )}
    </div>
  );
}
