import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Users, Mail, Phone, Music } from 'lucide-react';
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
          artist={editingArtist}
          onSubmit={handleFormSubmit}
          onCancel={handleCancel}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {artists.map((artist) => (
          <div key={artist.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{artist.name}</h3>
                <p className="text-sm text-gray-500">{artist.genre}</p>
              </div>
            </div>

            <p className="text-gray-600 text-sm mb-4 line-clamp-3">{artist.bio}</p>

            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-500">
                <Mail className="w-4 h-4 mr-2" />
                {artist.email}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Phone className="w-4 h-4 mr-2" />
                {artist.phone}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Music className="w-4 h-4 mr-2" />
                {artist.eventsCount} events
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => handleEdit(artist)}
                className="text-blue-600 hover:text-blue-900 p-1"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(artist.id)}
                className="text-red-600 hover:text-red-900 p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Simple ArtistForm component
function ArtistForm({ artist, onSubmit, onCancel }: {
  artist?: Artist | null;
  onSubmit: (artistData: Omit<Artist, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    genre: '',
    email: '',
    phone: '',
    image: '',
    socialMedia: { instagram: '', twitter: '', spotify: '' },
    eventsCount: 0
  });

  useEffect(() => {
    if (artist) {
      setFormData({
        name: artist.name || '',
        bio: artist.bio || '',
        genre: artist.genre || '',
        email: artist.email || '',
        phone: artist.phone || '',
        image: artist.image || '',
        socialMedia: {
          instagram: artist.socialMedia?.instagram || '',
          twitter: artist.socialMedia?.twitter || '',
          spotify: artist.socialMedia?.spotify || ''
        },
        eventsCount: artist.eventsCount || 0
      });
    } else {
      setFormData({
        name: '',
        bio: '',
        genre: '',
        email: '',
        phone: '',
        image: '',
        socialMedia: { instagram: '', twitter: '', spotify: '' },
        eventsCount: 0
      });
    }
  }, [artist]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
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
              required
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
              required
            />
          </div>
          <div>
            <label htmlFor="artist-email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              id="artist-email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div>
            <label htmlFor="artist-phone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              id="artist-phone"
              type="tel"
              placeholder="Phone"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {artist ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 