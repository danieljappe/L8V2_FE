export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  artist: string;
  price: number;
  capacity: number;
  image: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface Artist {
  id: string;
  name: string;
  bio: string;
  genre: string;
  email: string;
  phone: string;
  image: string;
  socialMedia: {
    instagram?: string;
    twitter?: string;
    spotify?: string;
  };
  eventsCount: number;
  createdAt: string;
}

export interface Venue {
  id: string;
  name: string;
  description: string;
  address: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  capacity?: number;
  imageUrl?: string;
  isActive: boolean;
  latitude?: number;
  longitude?: number;
  createdAt: string;
  updatedAt: string;
  pricePerHour?: number;
}

export interface GalleryItem {
  id: string;
  filename: string;
  url: string;
  thumbnailUrl?: string;
  mediumUrl?: string;
  largeUrl?: string;
  caption?: string;
  eventId?: string;
  photographer?: string;
  tags?: string[];
  category: 'event' | 'artist' | 'venue' | 'other';
  orderIndex: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

export type AdminSection = 'dashboard' | 'events' | 'artists' | 'venues' | 'gallery' | 'messages';