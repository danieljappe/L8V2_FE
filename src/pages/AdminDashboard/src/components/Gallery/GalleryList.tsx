import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Filter, Upload } from 'lucide-react';
import { GalleryItem } from '../../types';
import GalleryForm from './GalleryForm';
import { constructFullUrl } from '../../../../../utils/imageUtils';
import ImagePreview from './ImagePreview';

interface GalleryListProps {
  gallery: GalleryItem[];
  onUpdateGallery: (item: GalleryItem) => void;
  onDeleteGallery: (id: string) => void;
  onAddGallery: (item: Omit<GalleryItem, 'id' | 'createdAt'>) => void;
}

export default function GalleryList({ gallery, onUpdateGallery, onDeleteGallery, onAddGallery }: GalleryListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);

  const categories = [...new Set((gallery || []).map(item => item.category))];

  const filteredGallery = gallery.filter(item => {
    const matchesSearch = (item.caption?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (item.filename?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (item.tags || []).some(tag => (tag?.toLowerCase() || '').includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleEdit = (item: GalleryItem) => {
    console.log('Editing gallery item:', item);
    setEditingItem(item);
    setShowForm(true);
  };

  const handleSubmit = (itemData: Omit<GalleryItem, 'id' | 'createdAt'>) => {
    if (editingItem) {
      onUpdateGallery({ ...itemData, id: editingItem.id, createdAt: editingItem.createdAt });
    } else {
      onAddGallery(itemData);
    }
    setShowForm(false);
    setEditingItem(null);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'event': return 'bg-blue-100 text-blue-800';
      case 'artist': return 'bg-green-100 text-green-800';
      case 'venue': return 'bg-purple-100 text-purple-800';
      case 'other': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (showForm) {
    return (
      <GalleryForm
        item={editingItem}
        onSubmit={handleSubmit}
        onCancel={handleCloseForm}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gallery Management</h1>
          <p className="text-gray-600 mt-1">Manage your photo and media collection</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Media</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by caption, filename, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {(filteredGallery || []).map((item) => {
          console.log('Gallery item data:', item);
          return (
          <div key={item.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group">
            <div className="relative aspect-square overflow-hidden">
              <ImagePreview
                src={item.url || ''}
                alt={item.caption || item.filename || 'Gallery image'}
                size="large"
                className="w-full h-full"
                clickable={true}
                allImages={filteredGallery.map(img => ({ 
                  src: img.url || '', 
                  alt: img.caption || img.filename || 'Gallery image', 
                  id: img.id 
                }))}
                currentImageIndex={filteredGallery.findIndex(img => img.id === item.id)}
                onImageChange={() => {}} // No-op for grid context
              />
              <div className="absolute top-3 left-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
                  {item.category}
                </span>
              </div>
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex items-center space-x-1">
                  <button 
                    onClick={() => handleEdit(item)}
                    className="p-1.5 bg-white/90 text-gray-700 hover:bg-white rounded-full transition-colors"
                  >
                    <Edit className="w-3 h-3" />
                  </button>
                  <button 
                    onClick={() => onDeleteGallery(item.id)}
                    className="p-1.5 bg-white/90 text-gray-700 hover:bg-white rounded-full transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                {item.caption || item.filename || 'Untitled'}
              </h3>
              
              {item.filename && (
                <p className="text-gray-600 text-sm mb-2 line-clamp-1">
                  {item.filename}
                </p>
              )}
              
              {(item.tags && item.tags.length > 0) && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {item.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                  {item.tags.length > 3 && (
                    <span className="text-xs text-gray-500 px-2 py-1">
                      +{item.tags.length - 3}
                    </span>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>By {item.photographer || 'Unknown'}</span>
                <span>{new Date(item.createdAt || Date.now()).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        );
        })}
      </div>

      {(!filteredGallery || filteredGallery.length === 0) && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No gallery items found matching your criteria</p>
        </div>
      )}
    </div>
  );
}