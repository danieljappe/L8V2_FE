import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Eye, Globe, Star } from 'lucide-react';
import { Artist } from '../../types';
import ArtistForm from './ArtistForm';

interface ArtistsListProps {
  artists: Artist[];
  onUpdateArtist: (artist: Artist) => void;
  onDeleteArtist: (id: string) => void;
  onAddArtist: (artist: Omit<Artist, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export default function ArtistsList({ artists, onUpdateArtist, onDeleteArtist, onAddArtist }: ArtistsListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [genreFilter, setGenreFilter] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingArtist, setEditingArtist] = useState<Artist | null>(null);

  const genres = [...new Set(artists.map(artist => artist.genre).filter(Boolean))];

  // 🚨 VISUAL TEST - THIS SHOULD BE VISIBLE! 🚨
  console.log('🎨 ArtistsList Component Rendered with Enhanced Design!');

  // Update editingArtist if the artist data changes
  useEffect(() => {
    if (editingArtist) {
      const updatedArtist = artists.find(artist => artist.id === editingArtist.id);
      if (updatedArtist) {
        console.log('🔄 ArtistsList: updating editingArtist with new data:', updatedArtist);
        setEditingArtist(updatedArtist);
      }
    }
  }, [artists, editingArtist?.id]);

  // Debug: Log when artists array changes
  useEffect(() => {
    console.log('📊 ArtistsList: artists array changed:', artists);
    console.log('📊 ArtistsList: artists array structure check:');
    artists.forEach((artist, index) => {
      console.log(`  Artist ${index}:`, {
        id: artist.id,
        name: artist.name,
        imageUrl: artist.imageUrl,
        website: artist.website,
        socialMedia: artist.socialMedia
      });
    });
  }, [artists]);

  const filteredArtists = artists.filter(artist => {
    const matchesSearch = artist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (artist.genre && artist.genre.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesGenre = genreFilter === 'all' || artist.genre === genreFilter;
    return matchesSearch && matchesGenre;
  });

  const handleEdit = (artist: Artist) => {
    console.log('ArtistsList: handleEdit called with artist:', artist);
    console.log('ArtistsList: setting editingArtist to:', artist);
    setEditingArtist(artist);
    setShowForm(true);
  };

  const handleSubmit = (artistData: Omit<Artist, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingArtist) {
      // For editing, preserve the existing id, createdAt, and let backend handle updatedAt
      const updateData: Artist = {
        ...artistData,
        id: editingArtist.id,
        createdAt: editingArtist.createdAt,
        updatedAt: editingArtist.updatedAt // Keep existing updatedAt, backend will update it
      };
      console.log('ArtistsList: updating artist with data:', updateData);
      onUpdateArtist(updateData);
    } else {
      // For new artists, backend will set id, createdAt, and updatedAt
      console.log('ArtistsList: adding new artist with data:', artistData);
      onAddArtist(artistData);
    }
    setShowForm(false);
    setEditingArtist(null);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingArtist(null);
  };

  if (showForm) {
    return (
      <div className="space-y-4">
        {/* Debug Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-blue-800 mb-2">Debug Info - ArtistsList</h3>
          <div className="text-xs text-blue-700 space-y-1">
            <div><strong>Editing Artist:</strong> {editingArtist ? JSON.stringify(editingArtist, null, 2) : 'null'}</div>
            <div><strong>Artists Count:</strong> {artists.length}</div>
            <div><strong>First Artist:</strong> {artists[0] ? JSON.stringify(artists[0], null, 2) : 'none'}</div>
          </div>
        </div>
        
        <ArtistForm
          key={editingArtist?.id || 'new'}
          artist={editingArtist}
          onSubmit={handleSubmit}
          onCancel={handleCloseForm}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 🚨 ENHANCED DESIGN ACTIVE - YOU SHOULD SEE THIS! 🚨 */}
      <div className="bg-gradient-to-r from-red-500 to-purple-600 text-white p-4 rounded-lg border-4 border-yellow-400 shadow-lg">
        <div className="flex items-center justify-center space-x-3">
          <span className="text-2xl">🎨</span>
          <h1 className="text-xl font-bold">ENHANCED ARTIST DESIGN IS ACTIVE!</h1>
          <span className="text-2xl">✨</span>
        </div>
        <p className="text-center mt-2 text-red-100">If you can see this banner, the enhanced design is working!</p>
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Artists Management</h1>
          <p className="text-gray-600 mt-1">Manage your roster of talented artists</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Artist</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search artists or genres..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={genreFilter}
            onChange={(e) => setGenreFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Genres</option>
            {genres.map(genre => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Artists Grid - ENHANCED DESIGN */}
      <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
        <div className="flex items-center space-x-2">
          <span className="text-blue-600">✨</span>
          <span className="text-sm font-medium text-blue-800">Enhanced Artist Display Active</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredArtists.map((artist) => (
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
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 hover:scale-110"
                    title="View Artist Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleEdit(artist)}
                    className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200 hover:scale-110"
                    title="Edit Artist"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => onDeleteArtist(artist.id)}
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

      {filteredArtists.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-2xl">👨‍🎤</span>
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Artists Found</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            {searchTerm || genreFilter !== 'all' 
              ? `No artists match your search criteria "${searchTerm}"${genreFilter !== 'all' ? ` in ${genreFilter}` : ''}`
              : 'Get started by adding your first artist to the roster'
            }
          </p>
          {!searchTerm && genreFilter === 'all' && (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
            >
              <Plus className="w-5 h-5" />
              <span>Add Your First Artist</span>
            </button>
          )}
          {(searchTerm || genreFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setGenreFilter('all');
              }}
              className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span>Clear Filters</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}