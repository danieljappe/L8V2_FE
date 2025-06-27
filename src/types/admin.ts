export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  endTime?: string;
  venue: string;
  artist: string;
  artists?: string[];
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
  address: string;
  city: string;
  capacity: number;
  description: string;
  amenities: string[];
  image: string;
  pricePerHour: number;
  createdAt: string;
}

export interface GalleryItem {
  id: string;
  filename: string;
  url: string;
  thumbnailUrl?: string;
  mediumUrl?: string;
  largeUrl?: string;
  caption?: string;
  event?: string | null;
  photographer?: string;
  tags?: string[];
  category: 'event' | 'venue' | 'artist' | 'other';
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