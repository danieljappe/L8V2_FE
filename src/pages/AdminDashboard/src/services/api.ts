// Local API service for AdminDashboard
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

// Artist type that matches our backend Artist model exactly
interface ApiArtist {
  id: string;
  name: string;
  bio?: string;
  imageUrl?: string;
  website?: string;
  socialMedia?: Array<{
    platform: string;
    url: string;
  }>;
  genre?: string;
  createdAt: string;
  updatedAt: string;
}

class AdminApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const baseHeaders: Record<string, string> = { 'Content-Type': 'application/json' };
      let extraHeaders: Record<string, string> = {};
      if (options.headers && typeof options.headers === 'object' && !(options.headers instanceof Headers)) {
        extraHeaders = options.headers as Record<string, string>;
      }
      if (token) {
        extraHeaders['Authorization'] = `Bearer ${token}`;
      }
      const headers = Object.assign({}, baseHeaders, extraHeaders);
      
      const response = await fetch(url, {
        headers,
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (response.status === 204) {
        return { data: {} as T };
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      console.error('API request failed:', error);
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

const apiClient = new AdminApiClient(API_BASE_URL);

export const adminApiService = {
  // Artist endpoints
  getArtists: () => apiClient.get<ApiArtist[]>('/artists'),
  createArtist: (artist: Omit<ApiArtist, 'id' | 'createdAt' | 'updatedAt'>) => 
    apiClient.post<ApiArtist>('/artists', artist),
  updateArtist: (id: string, artist: Partial<ApiArtist>) => 
    apiClient.put<ApiArtist>(`/artists/${id}`, artist),
  deleteArtist: (id: string) => apiClient.delete(`/artists/${id}`),
  
  // Venue endpoints
  getVenues: () => apiClient.get<any[]>('/venues'),
  createVenue: (venue: any) => apiClient.post<any>('/venues', venue),
  updateVenue: (id: string, venue: any) => apiClient.put<any>(`/venues/${id}`, venue),
  deleteVenue: (id: string) => apiClient.delete(`/venues/${id}`),
};

// Artist image upload
export const uploadArtistImage = async (file: File) => {
  const formData = new FormData();
  formData.append('image', file);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const headers: Record<string, string> = token ? { 'Authorization': `Bearer ${token}` } : {};
  const response = await fetch(`${API_BASE_URL}/artists/upload-image`, {
    method: 'POST',
    body: formData,
    headers,
  });
  if (!response.ok) {
    throw new Error('Artist image upload failed');
  }
  return response.json();
};
