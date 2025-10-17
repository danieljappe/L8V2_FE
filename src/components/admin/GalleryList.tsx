import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Image, Tag, User } from 'lucide-react';
import { GalleryItem } from '../../types/admin';
import { apiService } from '../../services/api';

interface GalleryListProps {
  gallery: GalleryItem[];
  onAddGallery: (galleryData: Omit<GalleryItem, 'id' | 'createdAt'>) => void;
  onUpdateGallery: (item: GalleryItem) => void;
  onDeleteGallery: (id: string) => void;
}

export default function GalleryList({
  gallery,
  onAddGallery,
  onUpdateGallery,
  onDeleteGallery
}: GalleryListProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);

  const handleEdit = (item: GalleryItem) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this gallery item?')) {
      onDeleteGallery(id);
    }
  };

  const handleFormSubmit = (galleryData: Omit<GalleryItem, 'id' | 'createdAt'>) => {
    if (editingItem) {
      onUpdateGallery({ ...editingItem, ...galleryData });
      setEditingItem(null);
    } else {
      onAddGallery(galleryData);
    }
    setShowForm(false);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  const getCategoryColor = (category: GalleryItem['category']) => {
    switch (category) {
      case 'event':
        return 'bg-blue-100 text-blue-800';
      case 'artist':
        return 'bg-green-100 text-green-800';
      case 'venue':
        return 'bg-purple-100 text-purple-800';
      case 'other':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gallery Management</h1>
          <p className="text-gray-600">Manage all your gallery images and content.</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Item</span>
        </button>
      </div>

      {showForm && (
        <GalleryForm
          item={editingItem}
          onSubmit={handleFormSubmit}
          onCancel={handleCancel}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gallery.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="aspect-w-16 aspect-h-9 bg-gray-200">
              {item.url && (
                <img
                  src={item.url}
                  alt={item.caption || item.filename}
                  className="w-full h-48 object-cover"
                />
              )}
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{item.caption || item.filename}</h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(item.category)}`}>
                  {item.category}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.photographer}</p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-500">
                  <User className="w-4 h-4 mr-2" />
                  {item.photographer}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Tag className="w-4 h-4 mr-2" />
                  {(item.tags || []).join(', ')}
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="text-blue-600 hover:text-blue-900 p-1"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-red-600 hover:text-red-900 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Simple GalleryForm component
function GalleryForm({ item, onSubmit, onCancel }: {
  item?: GalleryItem | null;
  onSubmit: (galleryData: Omit<GalleryItem, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    filename: item?.filename || '',
    url: item?.url || '',
    thumbnailUrl: item?.thumbnailUrl || '',
    mediumUrl: item?.mediumUrl || '',
    largeUrl: item?.largeUrl || '',
    caption: item?.caption || '',
    event: item?.event || '',
    photographer: item?.photographer || '',
    tags: item?.tags || [],
    category: item?.category || 'event' as GalleryItem['category'],
    orderIndex: item?.orderIndex || 0,
    isPublished: item?.isPublished || false,
  });
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [fileUploaded, setFileUploaded] = useState(false);

  // Update form data when item changes
  useEffect(() => {
    if (item) {
      setFormData({
        filename: item.filename || '',
        url: item.url || '',
        thumbnailUrl: item.thumbnailUrl || '',
        mediumUrl: item.mediumUrl || '',
        largeUrl: item.largeUrl || '',
        caption: item.caption || '',
        event: item.event || '',
        photographer: item.photographer || '',
        tags: item.tags || [],
        category: item.category || 'event',
        orderIndex: item.orderIndex || 0,
        isPublished: item.isPublished || false,
      });
    }
  }, [item]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    try {
      // Create FormData with file and all form data
      const uploadFormData = new FormData();
      uploadFormData.append('image', file);
      uploadFormData.append('title', formData.caption || file.name);
      uploadFormData.append('description', formData.caption || file.name);
      uploadFormData.append('category', formData.category);
      uploadFormData.append('tags', JSON.stringify(formData.tags));
      uploadFormData.append('uploadedBy', formData.photographer || 'Admin');
      
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const headers: Record<string, string> = token ? { 'Authorization': `Bearer ${token}` } : {};
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/gallery/upload`, {
        method: 'POST',
        body: uploadFormData,
        headers,
      });
      
      if (!response.ok) {
        throw new Error('Image upload failed');
      }
      
      const result = await response.json();
      setFormData(prev => ({
        ...prev,
        filename: result.galleryImage.filename,
        url: result.galleryImage.url,
        caption: result.galleryImage.caption,
        category: result.galleryImage.category,
        photographer: result.galleryImage.photographer,
        tags: result.galleryImage.tags,
        isPublished: result.galleryImage.isPublished,
        orderIndex: result.galleryImage.orderIndex,
        // Optionally set thumbnailUrl, mediumUrl, largeUrl if backend returns them
      }));
      setFileUploaded(true);
    } catch (err: any) {
      setUploadError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // If we're adding a new item and a file was uploaded, the backend already created the record
    // We just need to close the form since the record is already created
    if (!item && fileUploaded) {
      // For new items with file upload, the record is already created, just close the form
      onCancel();
    } else if (item) {
      // For editing existing items, update the record
      onSubmit({ ...formData, updatedAt: new Date().toISOString() });
    } else {
      // For new items without file upload, create a new record
      onSubmit({ ...formData, updatedAt: new Date().toISOString() });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {item ? 'Edit Gallery Item' : 'Add New Gallery Item'}
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="gallery-filename" className="block text-sm font-medium text-gray-700 mb-1">Filename</label>
              <input
                id="gallery-filename"
                type="text"
                placeholder="Filename"
                value={formData.filename}
                onChange={(e) => setFormData({...formData, filename: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label htmlFor="gallery-category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                id="gallery-category"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value as GalleryItem['category']})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="event">Event</option>
                <option value="artist">Artist</option>
                <option value="venue">Venue</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          
          <div>
            <label htmlFor="gallery-caption" className="block text-sm font-medium text-gray-700 mb-1">Caption</label>
            <input
              id="gallery-caption"
              type="text"
              placeholder="Caption"
              value={formData.caption}
              onChange={(e) => setFormData({...formData, caption: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          
          <div>
            <label htmlFor="gallery-image" className="block text-sm font-medium text-gray-700 mb-1">Image Upload</label>
            <input
              id="gallery-image"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
            {uploading && <p className="text-xs text-blue-600 mt-1">Uploading...</p>}
            {uploadError && <p className="text-xs text-red-600 mt-1">{uploadError}</p>}
            {formData.url && (
              <img src={formData.url} alt="Preview" className="mt-2 w-full h-40 object-cover rounded" />
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="gallery-orderIndex" className="block text-sm font-medium text-gray-700 mb-1">Order Index</label>
              <input
                id="gallery-orderIndex"
                type="number"
                placeholder="0"
                value={formData.orderIndex}
                onChange={(e) => setFormData({...formData, orderIndex: parseInt(e.target.value) || 0})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label htmlFor="gallery-isPublished" className="flex items-center space-x-2">
                <input
                  id="gallery-isPublished"
                  type="checkbox"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData({...formData, isPublished: e.target.checked})}
                  className="rounded border-gray-300"
                />
                <span className="text-sm font-medium text-gray-700">Published</span>
              </label>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="gallery-tags" className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
              <input
                id="gallery-tags"
                type="text"
                placeholder="Tags (comma separated)"
                value={formData.tags.join(', ')}
                onChange={(e) => setFormData({...formData, tags: e.target.value.split(',').map(tag => tag.trim())})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label htmlFor="gallery-photographer" className="block text-sm font-medium text-gray-700 mb-1">Photographer</label>
              <input
                id="gallery-photographer"
                type="text"
                placeholder="Photographer"
                value={formData.photographer}
                onChange={(e) => setFormData({...formData, photographer: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
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
              {item ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 