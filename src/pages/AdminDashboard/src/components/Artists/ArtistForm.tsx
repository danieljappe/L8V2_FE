import React, { useState, useEffect } from 'react';
import { X, Upload, Trash2, ArrowLeft, Save, Image as ImageIcon } from 'lucide-react';
import { Artist } from '../../types';
import { uploadArtistImage } from '../../services/api';

interface ArtistFormProps {
  artist?: Artist | null;
  onSubmit: (artist: Omit<Artist, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export default function ArtistForm({ artist, onSubmit, onCancel }: ArtistFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    imageUrl: '',
    website: '',
    socialMedia: [] as Array<{ platform: string; url: string }>,
    genre: ''
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    console.log('🔄 ArtistForm: artist prop changed:', artist);
    console.log('🔄 ArtistForm: current formData before update:', formData);
    if (artist) {
      console.log('✅ ArtistForm: setting form data with:', {
        name: artist.name,
        bio: artist.bio,
        imageUrl: artist.imageUrl,
        website: artist.website,
        socialMedia: artist.socialMedia,
        genre: artist.genre
      });
      const newFormData = {
        name: artist.name,
        bio: artist.bio || '',
        imageUrl: artist.imageUrl || '',
        website: artist.website || '',
        socialMedia: artist.socialMedia || [],
        genre: artist.genre || ''
      };
      setFormData(newFormData);
      console.log('💾 ArtistForm: formData after update:', newFormData);
      setSelectedFile(null);
      setUploadError(null);
      setUploadProgress(0);
    } else {
      console.log('🔄 ArtistForm: no artist provided, resetting form');
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

  // Debug: Log form data changes
  useEffect(() => {
    console.log('📝 ArtistForm: formData changed:', formData);
  }, [formData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // When editing, don't override updatedAt - let the backend handle it
    // When creating new, we don't need updatedAt as it will be set by backend
    const submitData = artist ? 
      { ...formData } : // For editing, just send form data
      { ...formData, updatedAt: new Date().toISOString() }; // For new artists
    
    console.log('ArtistForm: submitting data:', submitData);
    console.log('ArtistForm: is editing:', !!artist);
    onSubmit(submitData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadError(null);
    }
  };

  const handleImageUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);
    setUploadError(null);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      const result = await uploadArtistImage(selectedFile);
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      // Update form with uploaded image URL
      setFormData(prev => ({
        ...prev,
        imageUrl: result.file.url
      }));

      // Clear selected file
      setSelectedFile(null);

      // Reset progress after a short delay
      setTimeout(() => setUploadProgress(0), 1000);

    } catch (error: any) {
      setUploadError(error.message || 'Upload failed');
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, imageUrl: '' }));
    setSelectedFile(null);
    setUploadError(null);
  };

  return (
    <div className="space-y-6">
      {/* Debug Information */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-yellow-800 mb-2">Debug Info</h3>
        <div className="text-xs text-yellow-700 space-y-1">
          <div><strong>Artist Prop:</strong> {artist ? JSON.stringify(artist, null, 2) : 'null'}</div>
          <div><strong>Form Data:</strong> {JSON.stringify(formData, null, 2)}</div>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <button
          onClick={onCancel}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {artist ? 'Edit Artist' : 'Add New Artist'}
          </h1>
          <p className="text-gray-600 mt-1">
            {artist ? 'Update artist information' : 'Add a new artist to your roster'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Artist Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter artist name"
              />
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                Biography
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Tell us about the artist"
              />
            </div>

            <div>
              <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-2">
                Genre
              </label>
              <input
                type="text"
                id="genre"
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Jazz, Rock, Electronic"
              />
            </div>

            <div>
              <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                Website
              </label>
              <input
                type="url"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com"
              />
            </div>

            <div>
              <label htmlFor="socialMedia" className="block text-sm font-medium text-gray-700 mb-2">
                Social Media
              </label>
              <div className="space-y-2">
                {formData.socialMedia.map((media, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Platform (e.g., Instagram)"
                      value={media.platform}
                      onChange={(e) => {
                        const newSocialMedia = [...formData.socialMedia];
                        newSocialMedia[index].platform = e.target.value;
                        setFormData({...formData, socialMedia: newSocialMedia});
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="url"
                      placeholder="URL"
                      value={media.url}
                      onChange={(e) => {
                        const newSocialMedia = [...formData.socialMedia];
                        newSocialMedia[index].url = e.target.value;
                        setFormData({...formData, socialMedia: newSocialMedia});
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newSocialMedia = formData.socialMedia.filter((_, i) => i !== index);
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
                    setFormData({
                      ...formData, 
                      socialMedia: [...formData.socialMedia, { platform: '', url: '' }]
                    });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  + Add Social Media
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Artist Image
              </label>
              
              {/* File Upload Section */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                {!formData.imageUrl && !selectedFile ? (
                  <div>
                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <span className="mt-2 block text-sm font-medium text-gray-900">
                          Upload an image
                        </span>
                        <span className="mt-1 block text-xs text-gray-500">
                          PNG, JPG, WebP up to 5MB
                        </span>
                      </label>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    {selectedFile && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-center">
                          <img
                            src={URL.createObjectURL(selectedFile)}
                            alt="Preview"
                            className="h-32 w-32 object-cover rounded-lg"
                          />
                        </div>
                        <div className="text-sm text-gray-600">
                          {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                        </div>
                        <div className="flex space-x-2">
                          <button
                            type="button"
                            onClick={handleImageUpload}
                            disabled={isUploading}
                            className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                          >
                            {isUploading ? 'Uploading...' : 'Upload Image'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setSelectedFile(null)}
                            className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                          >
                            Remove
                          </button>
                        </div>
                        {isUploading && (
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${uploadProgress}%` }}
                            ></div>
                          </div>
                        )}
                        {uploadError && (
                          <p className="text-red-600 text-sm">{uploadError}</p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Current Image Display */}
              {formData.imageUrl && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Image
                  </label>
                  <div className="relative">
                    <img
                      src={formData.imageUrl}
                      alt="Current artist image"
                      className="w-full h-40 object-cover rounded-lg border border-gray-300"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center space-x-2 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
            <span>Cancel</span>
          </button>
          <button
            type="submit"
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>{artist ? 'Update Artist' : 'Add Artist'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}