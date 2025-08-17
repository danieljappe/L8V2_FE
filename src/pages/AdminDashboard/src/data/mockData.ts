import { Event, Artist, Venue, GalleryItem, Message } from '../types';

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Summer Music Festival',
    description: 'A celebration of indie and alternative music featuring top artists.',
    date: '2024-07-15',
    time: '18:00',
    venue: 'Central Park Amphitheater',
    artist: 'The Midnight Collective',
    price: 75,
    capacity: 5000,
    image: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg',
    status: 'upcoming',
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    title: 'Jazz Night Under Stars',
    description: 'Intimate jazz performance in a cozy outdoor setting.',
    date: '2024-06-20',
    time: '20:00',
    venue: 'Riverside Lounge',
    artist: 'Sofia Martinez Trio',
    price: 45,
    capacity: 200,
    image: 'https://images.pexels.com/photos/1047442/pexels-photo-1047442.jpeg',
    status: 'upcoming',
    createdAt: '2024-01-10T14:30:00Z'
  },
  {
    id: '3',
    title: 'Rock Revolution',
    description: 'High-energy rock concert with pyrotechnics and special effects.',
    date: '2024-05-10',
    time: '19:30',
    venue: 'Metropolitan Arena',
    artist: 'Thunderstorm',
    price: 120,
    capacity: 15000,
    image: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg',
    status: 'completed',
    createdAt: '2024-01-05T09:15:00Z'
  }
];

export const mockArtists: Artist[] = [
  {
    id: '1',
    name: 'The Midnight Collective',
    bio: 'Indie alternative band known for their ethereal soundscapes and introspective lyrics.',
    imageUrl: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg',
    website: 'https://midnightcollective.com',
    socialMedia: 'Instagram: @midnightcollective, Twitter: @themidnightcol, Spotify: the-midnight-collective',
    genre: 'Indie Alternative',
    rating: 4.8,
    isActive: true,
    createdAt: '2023-12-01T10:00:00Z',
    updatedAt: '2023-12-01T10:00:00Z'
  },
  {
    id: '2',
    name: 'Sofia Martinez Trio',
    bio: 'Renowned jazz pianist with over 20 years of experience performing worldwide.',
    imageUrl: 'https://images.pexels.com/photos/1047442/pexels-photo-1047442.jpeg',
    website: 'https://sofiamartineztrio.com',
    socialMedia: 'Instagram: @sofiamartineztrio, Spotify: sofia-martinez-trio',
    genre: 'Jazz',
    rating: 4.9,
    isActive: true,
    createdAt: '2023-11-15T16:20:00Z',
    updatedAt: '2023-11-15T16:20:00Z'
  },
  {
    id: '3',
    name: 'Thunderstorm',
    bio: 'Heavy metal band that has been rocking stages for over a decade.',
    imageUrl: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg',
    website: 'https://thunderstormband.com',
    socialMedia: 'Instagram: @thunderstormofficial, Twitter: @thunderstormband, Spotify: thunderstorm-metal',
    genre: 'Heavy Metal',
    rating: 4.7,
    isActive: true,
    createdAt: '2023-10-20T12:45:00Z',
    updatedAt: '2023-10-20T12:45:00Z'
  }
];

export const mockVenues: Venue[] = [
  {
    id: '1',
    name: 'Central Park Amphitheater',
    address: '123 Park Avenue',
    city: 'New York, NY',
    capacity: 5000,
    description: 'Beautiful outdoor amphitheater with excellent acoustics and city skyline views.',
    amenities: ['Sound System', 'Lighting', 'Backstage Area', 'VIP Section', 'Parking'],
    contactEmail: 'bookings@centralamphitheater.com',
    contactPhone: '+1-555-1000',
    image: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg',
    pricePerHour: 2500,
    createdAt: '2023-12-15T08:00:00Z'
  },
  {
    id: '2',
    name: 'Riverside Lounge',
    address: '456 Riverside Drive',
    city: 'Portland, OR',
    capacity: 200,
    description: 'Intimate venue perfect for acoustic performances and private events.',
    amenities: ['Bar Service', 'Stage', 'Piano', 'Intimate Seating', 'River View'],
    contactEmail: 'events@riversidelounge.com',
    contactPhone: '+1-555-2000',
    image: 'https://images.pexels.com/photos/1047442/pexels-photo-1047442.jpeg',
    pricePerHour: 800,
    createdAt: '2023-11-30T14:30:00Z'
  },
  {
    id: '3',
    name: 'Metropolitan Arena',
    address: '789 Downtown Boulevard',
    city: 'Los Angeles, CA',
    capacity: 15000,
    description: 'Premier large-scale venue for major concerts and events.',
    amenities: ['Professional Sound', 'LED Screens', 'Multiple Bars', 'VIP Suites', 'Security'],
    contactEmail: 'booking@metropolitanarena.com',
    contactPhone: '+1-555-3000',
    image: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg',
    pricePerHour: 8000,
    createdAt: '2023-10-10T11:15:00Z'
  }
];

export const mockGallery: GalleryItem[] = [
  {
    id: '1',
    title: 'Summer Festival Crowd',
    description: 'Amazing energy from the crowd at our summer music festival.',
    image: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg',
    category: 'event',
    tags: ['festival', 'crowd', 'summer', 'energy'],
    uploadedBy: 'Admin',
    createdAt: '2024-01-20T16:45:00Z'
  },
  {
    id: '2',
    title: 'Jazz Night Ambiance',
    description: 'Intimate setting of our monthly jazz nights.',
    image: 'https://images.pexels.com/photos/1047442/pexels-photo-1047442.jpeg',
    category: 'event',
    tags: ['jazz', 'intimate', 'night', 'ambiance'],
    uploadedBy: 'Event Manager',
    createdAt: '2024-01-18T20:30:00Z'
  },
  {
    id: '3',
    title: 'Artist Backstage',
    description: 'Behind the scenes with our featured artists.',
    image: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg',
    category: 'artist',
    tags: ['backstage', 'artist', 'preparation', 'behind-scenes'],
    uploadedBy: 'Photographer',
    createdAt: '2024-01-15T19:20:00Z'
  }
];

export const mockMessages: Message[] = [
  {
    id: '1',
    name: 'Emily Johnson',
    email: 'emily.johnson@email.com',
    subject: 'Booking Inquiry for Corporate Event',
    message: 'Hi, I\'m interested in booking your venue for a corporate event in March. Could you please send me more information about availability and pricing?',
    read: false,
    priority: 'high',
    createdAt: '2024-01-25T14:30:00Z'
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael.chen@email.com',
    subject: 'Artist Partnership Opportunity',
    message: 'I represent a local band that would love to perform at your venue. They have a great following and would bring a good crowd. Let\'s discuss!',
    read: false,
    priority: 'medium',
    createdAt: '2024-01-24T10:15:00Z'
  },
  {
    id: '3',
    name: 'Sarah Williams',
    email: 'sarah.williams@email.com',
    subject: 'Thank you for amazing event!',
    message: 'Just wanted to thank you for the incredible jazz night last weekend. The atmosphere was perfect and Sofia Martinez was phenomenal!',
    read: true,
    priority: 'low',
    createdAt: '2024-01-22T16:45:00Z'
  },
  {
    id: '4',
    name: 'David Rodriguez',
    email: 'david.rodriguez@email.com',
    subject: 'Sound System Issues',
    message: 'During last night\'s show, there were some audio feedback issues. I think the sound system might need some maintenance or adjustment.',
    read: false,
    priority: 'high',
    createdAt: '2024-01-23T22:30:00Z'
  }
];