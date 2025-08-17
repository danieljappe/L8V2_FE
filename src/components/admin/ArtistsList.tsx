import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Globe, Star } from 'lucide-react';
import { Artist } from '../../types/admin';

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
  const [showForm, setShowForm] = useState(false);
  const [editingArtist, setEditingArtist] = useState<Artist | null>(null);

  // Update editingArtist if the artist data changes
  useEffect(() => {
    if (editingArtist) {
      const updatedArtist = artists.find(artist => artist.id === editingArtist.id);
      if (updatedArtist) {
        console.log('ArtistsList: updating editingArtist with new data:', updatedArtist);
        setEditingArtist(updatedArtist);
      }
    }
  }, [artists, editingArtist?.id]);

  const handleEdit = (artist: Artist) => {
    setEditingArtist(artist);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this artist?')) {
      onDeleteArtist(id);
    }
  };

  const handleFormSubmit = (artistData: Omit<Artist, 'id' | 'createdAt'>) => {
    if (editingArtist) {
      onUpdateArtist({ ...editingArtist, ...artistData });
      setEditingArtist(null);
    } else {
      onAddArtist(artistData);
    }
    setShowForm(false);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingArtist(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Artists Management</h1>
          <p className="text-gray-600">Manage all your artists and performers.</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Artist</span>
        </button>
      </div>

      {showForm && (
        <ArtistForm
          key={editingArtist?.id || 'new'}
          artist={editingArtist}
          onSubmit={handleFormSubmit}
          onCancel={handleCancel}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {artists.map((artist) => (
          <div key={artist.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group">
            {/* Image Section */}
            <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
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
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                    <span className="text-white text-2xl font-bold">{artist.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <p className="text-gray-500 text-sm font-medium">No Image</p>
                </div>
              </div>
              
              {/* Status Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-2">
                {artist.genre && (
                  <span className="bg-white/95 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-xs font-semibold shadow-sm border border-gray-200/50">
                    {artist.genre}
                  </span>
                )}
              </div>
              
              {/* Social Media Count Badge */}
              {artist.socialMedia && Array.isArray(artist.socialMedia) && artist.socialMedia.length > 0 && (
                <div className="absolute top-3 right-3">
                  <div className="bg-white/95 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1 shadow-sm border border-gray-200/50">
                    <span className="text-sm font-semibold text-gray-800">
                      {artist.socialMedia.length} social
                    </span>
                  </div>
                </div>
              )}
              
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
            </div>
            
            {/* Content Section */}
            <div className="p-6">
              {/* Artist Name and Bio */}
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                  {artist.name}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed" style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {artist.bio || 'No biography available'}
                </p>
              </div>
              
              {/* Artist Details */}
              <div className="space-y-3 mb-6">
                {/* Website */}
                {artist.website && (
                  <div className="flex items-center text-sm text-gray-600 group/website">
                    <Globe className="w-4 h-4 mr-2 text-blue-500 group-hover/website:text-blue-600 transition-colors" />
                    <a 
                      href={artist.website} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-600 hover:text-blue-700 hover:underline truncate transition-colors"
                    >
                      {artist.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}
                
                {/* Social Media */}
                {artist.socialMedia && (
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="mr-2 text-purple-500">📱</span>
                    <span className="truncate">
                      {typeof artist.socialMedia === 'string' 
                        ? artist.socialMedia 
                        : JSON.stringify(artist.socialMedia)
                      }
                    </span>
                  </div>
                )}
                
                {/* Rating Display */}
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-medium">Social Media: {Array.isArray(artist.socialMedia) ? artist.socialMedia.length : 0} platforms</span>
                </div>
              </div>

              {/* Footer Section */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="text-xs text-gray-500 space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                    <span>Created: {artist.createdAt ? new Date(artist.createdAt).toLocaleDateString() : 'Unknown'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                    <span>Updated: {artist.updatedAt ? new Date(artist.updatedAt).toLocaleDateString() : 'Unknown'}</span>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex items-center space-x-1">
                  <button 
                    onClick={() => handleEdit(artist)}
                    className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200 hover:scale-110"
                    title="Edit Artist"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(artist.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-110"
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
          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-2xl">👨‍🎤</span>
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Artists Yet</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Get started by adding your first artist to the roster
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
          >
            <Plus className="w-5 h-5" />
            <span>Add Your First Artist</span>
          </button>
        </div>
      )}
    </div>
  );
}

// Simple ArtistForm component
function ArtistForm({ artist, onSubmit, onCancel }: {
  artist?: Artist | null;
  onSubmit: (artistData: Omit<Artist, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<{
    name: string;
    bio: string;
    imageUrl: string;
    website: string;
    socialMedia: Array<{ platform: string; url: string }>;
    genre: string;
  }>({
    name: '',
    bio: '',
    imageUrl: '',
    website: '',
    socialMedia: [],
    genre: ''
  });

  useEffect(() => {
    if (artist) {
      // Convert old string socialMedia to new array format if needed
      let socialMediaArray: Array<{ platform: string; url: string }> = [];
      if (artist.socialMedia) {
        if (Array.isArray(artist.socialMedia)) {
          socialMediaArray = artist.socialMedia;
        } else if (typeof artist.socialMedia === 'string') {
          const socialMediaString = artist.socialMedia as string;
          if (socialMediaString.trim()) {
            // Convert old string format to new array format
            // This handles the transition from old data
            socialMediaArray = [{ platform: 'Legacy', url: socialMediaString }];
          }
        }
      }
      
      setFormData({
        name: artist.name,
        bio: artist.bio || '',
        imageUrl: artist.imageUrl || '',
        website: artist.website || '',
        socialMedia: socialMediaArray,
        genre: artist.genre || ''
      });
    } else {
      setFormData({
        name: '',
        bio: '',
        imageUrl: '',
        website: '',
        socialMedia: [],
        genre: ''
      });
    }
  }, [artist]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      updatedAt: new Date().toISOString()
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {artist ? 'Edit Artist' : 'Add New Artist'}
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="artist-name" className="block text-sm font-medium text-gray-700 mb-1">Artist Name</label>
            <input
              id="artist-name"
              type="text"
              placeholder="Artist Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div>
            <label htmlFor="artist-bio" className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea
              id="artist-bio"
              placeholder="Bio"
              value={formData.bio}
              onChange={(e) => setFormData({...formData, bio: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              rows={3}
            />
          </div>
          <div>
            <label htmlFor="artist-genre" className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
            <input
              id="artist-genre"
              type="text"
              placeholder="Genre"
              value={formData.genre}
              onChange={(e) => setFormData({...formData, genre: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label htmlFor="artist-imageUrl" className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
            <input
              id="artist-imageUrl"
              type="url"
              placeholder="https://example.com/image.jpg"
              value={formData.imageUrl}
              onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label htmlFor="artist-website" className="block text-sm font-medium text-gray-700 mb-1">Website</label>
            <input
              id="artist-website"
              type="url"
              placeholder="https://example.com"
              value={formData.website}
              onChange={(e) => setFormData({...formData, website: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label htmlFor="artist-socialMedia" className="block text-sm font-medium text-gray-700 mb-1">Social Media</label>
            <div className="space-y-2">
              {Array.isArray(formData.socialMedia) && formData.socialMedia.map((media, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Platform (e.g., Instagram)"
                    value={media.platform}
                    onChange={(e) => {
                      const currentSocialMedia = Array.isArray(formData.socialMedia) ? formData.socialMedia : [];
                      const newSocialMedia = [...currentSocialMedia];
                      newSocialMedia[index].platform = e.target.value;
                      setFormData({...formData, socialMedia: newSocialMedia});
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="url"
                    placeholder="URL"
                    value={media.url}
                    onChange={(e) => {
                      const currentSocialMedia = Array.isArray(formData.socialMedia) ? formData.socialMedia : [];
                      const newSocialMedia = [...currentSocialMedia];
                      newSocialMedia[index].url = e.target.value;
                      setFormData({...formData, socialMedia: newSocialMedia});
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const currentSocialMedia = Array.isArray(formData.socialMedia) ? formData.socialMedia : [];
                      const newSocialMedia = currentSocialMedia.filter((_, i) => i !== index);
                      setFormData({...formData, socialMedia: newSocialMedia});
                    }}
                    className="px-3 py-2 text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  const currentSocialMedia = Array.isArray(formData.socialMedia) ? formData.socialMedia : [];
                  setFormData({
                    ...formData, 
                    socialMedia: [...currentSocialMedia, { platform: '', url: '' }]
                  });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
              >
                + Add Social Media
              </button>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {artist ? 'Update Artist' : 'Add Artist'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 