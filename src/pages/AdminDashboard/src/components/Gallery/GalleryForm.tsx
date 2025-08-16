import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Save, X, Plus, Trash2, Upload } from 'lucide-react';
import { GalleryItem } from '../../types';
import { constructFullUrl } from '../../../../../utils/imageUtils';
import ImagePreview from './ImagePreview';

interface GalleryFormProps {
  item?: GalleryItem | null;
  onSubmit: (item: Omit<GalleryItem, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

export default function GalleryForm({ item, onSubmit, onCancel }: GalleryFormProps) {
  const [formData, setFormData] = useState({
    caption: '',
    photographer: '',
    url: '', // Always keep this as a string
    category: 'event' as GalleryItem['category'],
    tags: [''],
    filename: '',
    orderIndex: 0,
    isPublished: true,
    updatedAt: new Date().toISOString()
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = useCallback(() => {
    setSelectedFile(null);
    setFormData({
      caption: '',
      photographer: '',
      url: '',
      category: 'event',
      tags: [''],
      filename: '',
      orderIndex: 0,
      isPublished: true,
      updatedAt: new Date().toISOString()
    });
    // Reset the file input
    const fileInput = document.getElementById('image') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }, []);

  useEffect(() => {
    if (item) {
      console.log('Setting form data for item:', item);
      setFormData({
        caption: item.caption || '',
        photographer: item.photographer || '',
        url: item.url || '',
        category: item.category,
        tags: item.tags || [''],
        filename: item.filename || '',
        orderIndex: item.orderIndex || 0,
        isPublished: item.isPublished !== undefined ? item.isPublished : true,
        updatedAt: new Date().toISOString()
      });
    } else {
      // Reset form when no item is provided (new item mode)
      resetForm();
    }
  }, [item, resetForm]);

  // Cleanup function to revoke object URLs
  useEffect(() => {
    return () => {
      // Clean up any object URLs to prevent memory leaks
      if (selectedFile) {
        // The object URL will be automatically cleaned up when the component unmounts
        // but we can set selectedFile to null to help with cleanup
        setSelectedFile(null);
      }
    };
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Don't upload yet, just store the file for later
      // Also don't update the image field until upload is complete
    }
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    // Reset the file input
    const fileInput = document.getElementById('image') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form submitted:', { 
      selectedFile: !!selectedFile, 
      formDataUrl: !!formData.url, 
      isUploading, 
      isSubmitting 
    });
    
    if (isSubmitting || isUploading) {
      console.log('Form submission blocked - already processing');
      return; // Prevent multiple submissions
    }
    
    // Validate required fields
    if (!formData.caption.trim() && !formData.photographer.trim()) {
      alert('Please provide either a caption or photographer for the image.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (formData.url && !selectedFile) {
        console.log('Handling form submission without file (editing mode)');
        // Handle form submission without file (existing behavior for editing)
        const filteredTags = formData.tags.filter(tag => tag.trim() !== '');
        const submitData = { 
          ...formData, 
          tags: filteredTags,
          updatedAt: new Date().toISOString()
        };
        console.log('Submitting form data:', submitData);
        onSubmit(submitData);
      } else if (selectedFile) {
        console.log('File selected - use upload button instead');
        alert('Please use the "Upload & Add to Gallery" button to upload your file.');
      } else {
        console.log('No file selected and no existing image');
        // No file selected and no existing image
        alert('Please select an image file to upload.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;

    console.log('Starting file upload...');
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('image', selectedFile);
      formDataToSend.append('title', formData.caption || selectedFile.name);
      formDataToSend.append('description', formData.photographer);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('tags', JSON.stringify(formData.tags.filter(tag => tag.trim() !== '')));
      formDataToSend.append('uploadedBy', formData.photographer);

      console.log('Uploading to /api/gallery/upload...');

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

      const response = await fetch('/api/gallery/upload', {
        method: 'POST',
        body: formDataToSend,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
          // Note: Don't set Content-Type for FormData - browser will set it automatically with boundary
        }
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      console.log('Upload response:', response.status, response.ok);

      if (response.ok) {
        const result = await response.json();
        console.log('Upload successful, result:', result);
        // Upload successful - show success message and close form
        alert('Image uploaded successfully!');
        
        // Reset form state
        resetForm();
        
        console.log('Calling onCancel() to close form...');
        // Close the form - the upload endpoint already created the gallery item
        onCancel();
      } else {
        const error = await response.json();
        console.log('Upload failed:', error);
        alert(`Upload failed: ${error.message}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTagChange = (index: number, value: string) => {
    const newTags = [...formData.tags];
    newTags[index] = value;
    setFormData(prev => ({ ...prev, tags: newTags }));
  };

  const addTag = () => {
    setFormData(prev => ({ ...prev, tags: [...prev.tags, ''] }));
  };

  const removeTag = (index: number) => {
    const newTags = formData.tags.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, tags: newTags }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={onCancel}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {item ? 'Edit Gallery Item' : 'Add New Gallery Item'}
          </h1>
          <p className="text-gray-600 mt-1">
            {item ? 'Update media information' : 'Add new media to your gallery'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div>
              <label htmlFor="caption" className="block text-sm font-medium text-gray-700 mb-2">
                Caption
              </label>
              <input
                type="text"
                id="caption"
                name="caption"
                value={formData.caption}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter image caption (optional)"
              />
            </div>

            <div>
              <label htmlFor="photographer" className="block text-sm font-medium text-gray-700 mb-2">
                Photographer
              </label>
              <input
                type="text"
                id="photographer"
                name="photographer"
                value={formData.photographer}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 border-transparent"
                placeholder="Enter photographer name (optional)"
              />
            </div>



            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="event">Event</option>
                  <option value="artist">Artist</option>
                  <option value="venue">Venue</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label htmlFor="orderIndex" className="block text-sm font-medium text-gray-700 mb-2">
                  Order Index
                </label>
                <input
                  type="number"
                  id="orderIndex"
                  name="orderIndex"
                  value={formData.orderIndex}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPublished"
                  name="isPublished"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData(prev => ({ ...prev, isPublished: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isPublished" className="ml-2 text-sm text-gray-700">
                  Published
                </label>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Tags
                </label>
                <button
                  type="button"
                  onClick={addTag}
                  className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Tag</span>
                </button>
              </div>
              <div className="space-y-2">
                {formData.tags.map((tag, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={tag}
                      onChange={(e) => handleTagChange(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="e.g., festival, outdoor, summer"
                    />
                    {formData.tags.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTag(index)}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                {formData.url ? 'Replace Image (Optional)' : 'Image File *'}
              </label>
              <div className="flex space-x-2">
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleFileSelect}
                  required={!formData.url}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {selectedFile && (
                  <button
                    type="button"
                    onClick={clearSelectedFile}
                    className="px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              {selectedFile && (
                <div className="mt-2 text-sm text-gray-600">
                  Selected file: {selectedFile.name}
                  {isUploading && (
                    <span className="ml-2 text-blue-600"> ({uploadProgress}%)</span>
                  )}
                </div>
              )}
              <p className="mt-1 text-xs text-gray-500">
                {formData.url 
                  ? 'Select a new image file to replace the current one, or leave empty to keep the current image.'
                  : 'Select an image file. The file will be uploaded when you submit the form.'
                }
              </p>
            </div>

            {formData.url && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Image
                </label>
                <div className="flex items-center">
                  <ImagePreview
                    src={formData.url}
                    alt="Current gallery image"
                    size="medium"
                    showOverlay={true}
                    overlayText="Current image"
                    overlaySubtext="Select new file to replace"
                    clickable={true}
                    allImages={[{ src: formData.url, alt: "Current gallery image" }]}
                    currentImageIndex={0}
                    onImageChange={() => {}} // No-op for form context
                  />
                  <div className="flex-1 ml-4">
                    <p className="text-sm text-gray-600">
                      <strong>Filename:</strong> {formData.filename || 'Unknown filename'}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      <strong>URL:</strong> {formData.url}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Show selected file preview before upload */}
            {selectedFile && !formData.url && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selected File Preview
                </label>
                <div className="flex items-center">
                  <div 
                    className="relative w-32 h-32 cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => {
                      const newWindow = window.open();
                      if (newWindow) {
                        newWindow.document.write(`
                          <html>
                            <head><title>File Preview</title></head>
                            <body style="margin:0;padding:20px;background:#000;display:flex;justify-content:center;align-items:center;min-height:100vh;">
                              <img src="${URL.createObjectURL(selectedFile)}" style="max-width:100%;max-height:100%;object-fit:contain;" />
                            </body>
                          </html>
                        `);
                      }
                    }}
                  >
                    <img
                      src={URL.createObjectURL(selectedFile)}
                      alt="File preview"
                      className="w-full h-full object-cover rounded-lg border border-gray-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                      <div className="text-white text-center bg-black bg-opacity-50 px-3 py-2 rounded">
                        <div className="text-sm">File selected</div>
                        <div className="text-xs">Click to preview</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 ml-4">
                    <p className="text-sm text-gray-600">
                      <strong>Filename:</strong> {selectedFile.name}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      <strong>Size:</strong> {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      <strong>Type:</strong> {selectedFile.type}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {isUploading && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 text-blue-700">
                  <div className="w-4 h-4 border-2 border-blue-700 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm font-medium">Uploading image...</span>
                </div>
                <div className="mt-2 w-full bg-blue-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <div className="text-xs text-blue-600 mt-1">{uploadProgress}% complete</div>
              </div>
            )}

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Upload Guidelines</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Use high-quality images (minimum 1200px width)</li>
                <li>• Supported formats: JPEG, PNG, WebP</li>
                <li>• Keep file size under 5MB for best performance</li>
                <li>• Use descriptive titles and tags for better organization</li>
              </ul>
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
          
          {/* Separate upload button for files */}
          {selectedFile && (
            <button
              type="button"
              onClick={handleFileUpload}
              disabled={isUploading || isSubmitting}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                isUploading || isSubmitting
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {isUploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Upload & Add to Gallery</span>
                </>
              )}
            </button>
          )}
          
          {/* Form submit button for non-file submissions */}
          {!selectedFile && (
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                isSubmitting 
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{item ? 'Update Item' : 'Save Details'}</span>
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}