import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, MapPin, Users, DollarSign, Mail, Phone } from 'lucide-react';
import { Venue } from '../../types/admin';

interface VenuesListProps {
  venues: Venue[];
  onAddVenue: (venueData: Omit<Venue, 'id' | 'createdAt'>) => void;
  onUpdateVenue: (venue: Venue) => void;
  onDeleteVenue: (id: string) => void;
}

export default function VenuesList({
  venues,
  onAddVenue,
  onUpdateVenue,
  onDeleteVenue
}: VenuesListProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingVenue, setEditingVenue] = useState<Venue | null>(null);

  const handleEdit = (venue: Venue) => {
    setEditingVenue(venue);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this venue?')) {
      onDeleteVenue(id);
    }
  };

  const handleFormSubmit = (venueData: Omit<Venue, 'id' | 'createdAt'>) => {
    if (editingVenue) {
      onUpdateVenue({ ...editingVenue, ...venueData });
      setEditingVenue(null);
    } else {
      onAddVenue(venueData);
    }
    setShowForm(false);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingVenue(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Venues Management</h1>
          <p className="text-gray-600">Manage all your venues and locations.</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Venue</span>
        </button>
      </div>

      {showForm && (
        <VenueForm
          venue={editingVenue}
          onSubmit={handleFormSubmit}
          onCancel={handleCancel}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {venues.map((venue) => (
          <div key={venue.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{venue.name}</h3>
                <p className="text-sm text-gray-500">{venue.city}</p>
              </div>
            </div>

            <p className="text-gray-600 text-sm mb-4 line-clamp-3">{venue.description}</p>

            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-500">
                <MapPin className="w-4 h-4 mr-2" />
                {venue.address}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Users className="w-4 h-4 mr-2" />
                Capacity: {venue.capacity}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <DollarSign className="w-4 h-4 mr-2" />
                ${venue.pricePerHour}/hour
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => handleEdit(venue)}
                className="text-blue-600 hover:text-blue-900 p-1"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(venue.id)}
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

// Simple VenueForm component
function VenueForm({ venue, onSubmit, onCancel }: {
  venue?: Venue | null;
  onSubmit: (venueData: Omit<Venue, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    capacity: 0,
    description: '',
    amenities: [] as string[],
    image: '',
    pricePerHour: 0
  });

  useEffect(() => {
    if (venue) {
      setFormData({
        name: venue.name || '',
        address: venue.address || '',
        city: venue.city || '',
        capacity: venue.capacity || 0,
        description: venue.description || '',
        amenities: venue.amenities || [],
        image: venue.image || '',
        pricePerHour: venue.pricePerHour || 0
      });
    } else {
      setFormData({
        name: '',
        address: '',
        city: '',
        capacity: 0,
        description: '',
        amenities: [],
        image: '',
        pricePerHour: 0
      });
    }
  }, [venue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {venue ? 'Edit Venue' : 'Add New Venue'}
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="venue-name" className="block text-sm font-medium text-gray-700 mb-1">Venue Name</label>
            <input
              id="venue-name"
              type="text"
              placeholder="Venue Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div>
            <label htmlFor="venue-address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input
              id="venue-address"
              type="text"
              placeholder="Address"
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div>
            <label htmlFor="venue-city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <input
              id="venue-city"
              type="text"
              placeholder="City"
              value={formData.city}
              onChange={(e) => setFormData({...formData, city: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div>
            <label htmlFor="venue-capacity" className="block text-sm font-medium text-gray-700 mb-1">Capacity (number of people)</label>
            <input
              id="venue-capacity"
              type="number"
              placeholder="Capacity"
              value={formData.capacity}
              onChange={(e) => setFormData({...formData, capacity: Number(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div>
            <label htmlFor="venue-price" className="block text-sm font-medium text-gray-700 mb-1">Price per Hour (USD)</label>
            <input
              id="venue-price"
              type="number"
              placeholder="Price per Hour"
              value={formData.pricePerHour}
              onChange={(e) => setFormData({...formData, pricePerHour: Number(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div>
            <label htmlFor="venue-description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              id="venue-description"
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              rows={3}
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
              {venue ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 