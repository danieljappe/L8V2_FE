import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Eye, Mail, Phone } from 'lucide-react';
import { Artist } from '../../types';
import ArtistForm from './ArtistForm';

interface ArtistsListProps {
  artists: Artist[];
  onUpdateArtist: (artist: Artist) => void;
  onDeleteArtist: (id: string) => void;
  onAddArtist: (artist: Omit<Artist, 'id' | 'createdAt'>) => void;
}

export default function ArtistsList({ artists, onUpdateArtist, onDeleteArtist, onAddArtist }: ArtistsListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [genreFilter, setGenreFilter] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingArtist, setEditingArtist] = useState<Artist | null>(null);

  const genres = [...new Set(artists.map(artist => artist.genre))];

  const filteredArtists = artists.filter(artist => {
    const matchesSearch = artist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         artist.genre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = genreFilter === 'all' || artist.genre === genreFilter;
    return matchesSearch && matchesGenre;
  });

  const handleEdit = (artist: Artist) => {
    setEditingArtist(artist);
    setShowForm(true);
  };

  const handleSubmit = (artistData: Omit<Artist, 'id' | 'createdAt'>) => {
    if (editingArtist) {
      onUpdateArtist({ ...artistData, id: editingArtist.id, createdAt: editingArtist.createdAt });
    } else {
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
      <ArtistForm
        artist={editingArtist}
        onSubmit={handleSubmit}
        onCancel={handleCloseForm}
      />
    );
  }

  return (
    <div className="space-y-6">
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

      {/* Artists Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredArtists.map((artist) => (
          <div key={artist.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              <img 
                src={artist.image} 
                alt={artist.name}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-4 right-4">
                <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                  {artist.genre}
                </span>
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{artist.name}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{artist.bio}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="w-4 h-4 mr-2" />
                  <span className="truncate">{artist.email}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>{artist.phone}</span>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500">Events Performed:</span>
                <span className="font-bold text-blue-600">{artist.eventsCount}</span>
              </div>

              {/* Social Media Links */}
              {(artist.socialMedia.instagram || artist.socialMedia.twitter || artist.socialMedia.spotify) && (
                <div className="flex items-center space-x-2 mb-4">
                  {artist.socialMedia.instagram && (
                    <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded text-white flex items-center justify-center text-xs">
                      IG
                    </div>
                  )}
                  {artist.socialMedia.twitter && (
                    <div className="w-6 h-6 bg-blue-400 rounded text-white flex items-center justify-center text-xs">
                      TW
                    </div>
                  )}
                  {artist.socialMedia.spotify && (
                    <div className="w-6 h-6 bg-green-500 rounded text-white flex items-center justify-center text-xs">
                      SP
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <span className="text-sm text-gray-500">
                  {new Date(artist.createdAt).toLocaleDateString()}
                </span>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleEdit(artist)}
                    className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => onDeleteArtist(artist.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <div className="w-12 h-12 text-gray-400 mx-auto mb-4">
            👨‍🎤
          </div>
          <p className="text-gray-500">No artists found matching your criteria</p>
        </div>
      )}
    </div>
  );
}