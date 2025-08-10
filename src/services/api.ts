// API Base URL - adjust this based on your backend deployment
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Common API response interface
interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

// Generic API client
class ApiClient {
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

      // Handle authentication errors
      if (response.status === 401 || response.status === 403) {
        // Clear invalid token and redirect to login
        localStorage.removeItem('token');
        // Use window.location.href for hard redirect to ensure clean state
        window.location.href = '/login';
        throw new Error('Authentication failed. Please login again.');
      }

      // Handle network errors
      if (!response.ok && response.status !== 401 && response.status !== 403) {
        console.error('API Error:', response.status, response.statusText);
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (response.status === 204) {
        // No Content
        return { data: {} as T };
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      console.error('API request failed:', error);
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // GET request
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  // POST request
  async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT request
  async put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Create API client instance
export const apiClient = new ApiClient(API_BASE_URL);

// Data interfaces based on backend models
export interface Artist {
  id: string;
  name: string;
  genre: string;
  image: string;
  bio: string;
  social?: {
    instagram?: string;
    website?: string;
    youtube?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Venue {
  id: number;
  name: string;
  address: string;
  city: string;
  capacity: number;
  description?: string;
  image?: string;
  events?: Event[];
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  ticketPrice: number;
  totalTickets: number;
  soldTickets: number;
  imageUrl?: string;
  isActive: boolean;
  status: string;
  capacity?: number;
  currentAttendees: number;
  venue: Venue;
  eventArtists: EventArtist[];
  tickets?: Ticket[];
  createdAt: string;
  updatedAt: string;
}

export interface EventArtist {
  id: string;
  event: Event;
  artist: Artist;
  performanceTime?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GalleryImage {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  eventId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  updatedAt: string;
}

export interface Ticket {
  id: string;
  event: Event;
  user?: any;
  price: number;
  status: 'available' | 'sold' | 'reserved';
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
}

// API service functions
export const apiService = {
  // Artists
  getArtists: () => apiClient.get<Artist[]>('/artists'),
  getArtist: (id: string) => apiClient.get<Artist>(`/artists/${id}`),
  createArtist: (artist: Partial<Artist>) => apiClient.post<Artist>('/artists', artist),
  updateArtist: (id: string, artist: Partial<Artist>) => apiClient.put<Artist>(`/artists/${id}`, artist),
  deleteArtist: (id: string) => apiClient.delete<null>(`/artists/${id}`),

  // Events
  getEvents: () => apiClient.get<Event[]>('/events'),
  getEvent: (id: string) => apiClient.get<Event>(`/events/${id}`),
  createEvent: (event: Partial<Event>) => apiClient.post<Event>('/events', event),
  updateEvent: (id: string, event: Partial<Event>) => apiClient.put<Event>(`/events/${id}`, event),
  deleteEvent: (id: string) => apiClient.delete<null>(`/events/${id}`),

  // Venues
  getVenues: () => apiClient.get<Venue[]>('/venues'),
  getVenue: (id: number) => apiClient.get<Venue>(`/venues/${id}`),
  createVenue: (venue: Partial<Venue>) => apiClient.post<Venue>('/venues', venue),
  updateVenue: (id: string | number, venue: Partial<Venue>) => apiClient.put<Venue>(`/venues/${id}`, venue),
  deleteVenue: (id: string | number) => apiClient.delete<null>(`/venues/${id}`),

  // Gallery
  getGalleryImages: () => apiClient.get<GalleryImage[]>('/gallery'),
  getGalleryImage: (id: string) => apiClient.get<GalleryImage>(`/gallery/${id}`),
  createGalleryImage: (image: Partial<GalleryImage>) => apiClient.post<GalleryImage>('/gallery', image),

  // Contact
  getContactMessages: () => apiClient.get<ContactMessage[]>('/contact'),
  createContactMessage: (message: Partial<ContactMessage>) => apiClient.post<ContactMessage>('/contact', message),

  // Tickets
  getTickets: () => apiClient.get<Ticket[]>('/tickets'),
  getTicket: (id: string) => apiClient.get<Ticket>(`/tickets/${id}`),
  createTicket: (ticket: Partial<Ticket>) => apiClient.post<Ticket>('/tickets', ticket),

  // Event Artists
  getEventArtists: () => apiClient.get<EventArtist[]>('/event-artists'),
  createEventArtist: (eventArtist: Partial<EventArtist>) => apiClient.post<EventArtist>('/event-artists', eventArtist),

  // Gallery image upload
  uploadGalleryImage: async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const headers: Record<string, string> = token ? { 'Authorization': `Bearer ${token}` } : {};
    const response = await fetch(`${API_BASE_URL}/gallery/upload`, {
      method: 'POST',
      body: formData,
      headers,
    });
    if (!response.ok) {
      throw new Error('Image upload failed');
    }
    return response.json();
  },
};

export default apiService; 