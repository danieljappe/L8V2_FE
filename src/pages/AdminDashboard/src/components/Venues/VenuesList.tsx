import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Eye, MapPin, Users, DollarSign } from 'lucide-react';
import { Venue } from '../../types';
import VenueForm from './VenueForm';

interface VenuesListProps {
  venues: Venue[];
  onUpdateVenue: (venue: Venue) => void;
  onDeleteVenue: (id: string) => void;
  onAddVenue: (venue: Omit<Venue, 'id' | 'createdAt'>) => void;
}

export default function VenuesList({ venues, onUpdateVenue, onDeleteVenue, onAddVenue }: VenuesListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingVenue, setEditingVenue] = useState<Venue | null>(null);

  const cities = [...new Set(venues.map(venue => venue.city))];

  const filteredVenues = venues.filter(venue => {
    const matchesSearch = venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         venue.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         venue.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = cityFilter === 'all' || venue.city === cityFilter;
    return matchesSearch && matchesCity;
  });

  const handleEdit = (venue: Venue) => {
    setEditingVenue(venue);
    setShowForm(true);
  };

  const handleSubmit = (venueData: Omit<Venue, 'id' | 'createdAt'>) => {
    if (editingVenue) {
      onUpdateVenue({ ...venueData, id: editingVenue.id, createdAt: editingVenue.createdAt });
    } else {
      onAddVenue(venueData);
    }
    setShowForm(false);
    setEditingVenue(null);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingVenue(null);
  };

  if (showForm) {
    return (
      <VenueForm
        venue={editingVenue}
        onSubmit={handleSubmit}
        onCancel={handleCloseForm}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Venues Management</h1>
          <p className="text-gray-600 mt-1">Manage your event venues and locations</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Venue</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search venues, addresses, or cities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Cities</option>
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Venues Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredVenues.map((venue) => (
          <div key={venue.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              <img 
                src={venue.image} 
                alt={venue.name}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-4 right-4">
                <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                  ${venue.pricePerHour}/hr
                </span>
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{venue.name}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{venue.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span className="truncate">{venue.address}, {venue.city}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="w-4 h-4 mr-2" />
                  <span>Capacity: {venue.capacity.toLocaleString()}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <DollarSign className="w-4 h-4 mr-2" />
                  <span>Rate: ${venue.pricePerHour}/hour</span>
                </div>
              </div>

              {/* Amenities */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Amenities:</p>
                <div className="flex flex-wrap gap-1">
                  {venue.amenities.slice(0, 3).map((amenity) => (
                    <span
                      key={amenity}
                      className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full"
                    >
                      {amenity}
                    </span>
                  ))}
                  {venue.amenities.length > 3 && (
                    <span className="text-xs text-gray-500 px-2 py-1">
                      +{venue.amenities.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <span className="text-sm text-gray-500">
                  {new Date(venue.createdAt).toLocaleDateString()}
                </span>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleEdit(venue)}
                    className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => onDeleteVenue(venue.id)}
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

      {filteredVenues.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No venues found matching your criteria</p>
        </div>
      )}
    </div>
  );
}