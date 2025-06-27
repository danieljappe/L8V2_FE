import { Event, Artist, Venue, GalleryItem, Message } from '../types/admin';

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Summer Music Festival',
    description: 'A three-day music festival featuring top artists from around the world.',
    date: '2024-07-15',
    time: '18:00',
    venue: 'Central Park Arena',
    artist: 'Various Artists',
    price: 150,
    capacity: 5000,
    image: '/images/event1.jpg',
    status: 'upcoming',
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    title: 'Jazz Night',
    description: 'An intimate evening of jazz music with local and international artists.',
    date: '2024-06-20',
    time: '20:00',
    venue: 'Blue Note Club',
    artist: 'Jazz Ensemble',
    price: 75,
    capacity: 200,
    image: '/images/event2.jpg',
    status: 'upcoming',
    createdAt: '2024-01-10T14:30:00Z'
  },
  {
    id: '3',
    title: 'Rock Concert',
    description: 'High-energy rock concert with multiple bands.',
    date: '2024-05-10',
    time: '19:00',
    venue: 'Stadium Arena',
    artist: 'Rock Band',
    price: 120,
    capacity: 10000,
    image: '/images/event3.jpg',
    status: 'completed',
    createdAt: '2024-01-05T09:15:00Z'
  }
];

export const mockArtists: Artist[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    bio: 'A talented singer-songwriter with a unique voice and compelling lyrics.',
    genre: 'Pop/Folk',
    email: 'sarah@example.com',
    phone: '+1-555-0123',
    image: '/images/artist1.jpg',
    socialMedia: {
      instagram: '@sarahjohnson',
      twitter: '@sarahjohnson',
      spotify: 'sarahjohnson'
    },
    eventsCount: 5,
    createdAt: '2024-01-01T08:00:00Z'
  },
  {
    id: '2',
    name: 'The Jazz Trio',
    bio: 'A professional jazz ensemble with over 10 years of experience.',
    genre: 'Jazz',
    email: 'jazz@example.com',
    phone: '+1-555-0124',
    image: '/images/artist2.jpg',
    socialMedia: {
      instagram: '@jazztrio',
      spotify: 'jazztrio'
    },
    eventsCount: 3,
    createdAt: '2024-01-02T10:30:00Z'
  },
  {
    id: '3',
    name: 'Rock Band XYZ',
    bio: 'High-energy rock band known for their electrifying performances.',
    genre: 'Rock',
    email: 'rock@example.com',
    phone: '+1-555-0125',
    image: '/images/artist3.jpg',
    socialMedia: {
      instagram: '@rockbandxyz',
      twitter: '@rockbandxyz',
      spotify: 'rockbandxyz'
    },
    eventsCount: 8,
    createdAt: '2024-01-03T12:45:00Z'
  }
];

export const mockVenues: Venue[] = [
  {
    id: '1',
    name: 'Central Park Arena',
    address: '123 Central Park Ave',
    city: 'New York',
    capacity: 5000,
    description: 'A large outdoor arena perfect for major events and festivals.',
    amenities: ['Parking', 'Food & Beverage', 'VIP Areas', 'Sound System'],
    contactEmail: 'info@centralparkarena.com',
    contactPhone: '+1-555-0200',
    image: '/images/venue1.jpg',
    pricePerHour: 5000,
    createdAt: '2024-01-01T06:00:00Z'
  },
  {
    id: '2',
    name: 'Blue Note Club',
    address: '456 Jazz Street',
    city: 'New York',
    capacity: 200,
    description: 'An intimate jazz club with excellent acoustics.',
    amenities: ['Bar', 'VIP Seating', 'Professional Sound', 'Lighting'],
    contactEmail: 'booking@bluenote.com',
    contactPhone: '+1-555-0201',
    image: '/images/venue2.jpg',
    pricePerHour: 800,
    createdAt: '2024-01-02T07:30:00Z'
  },
  {
    id: '3',
    name: 'Stadium Arena',
    address: '789 Stadium Blvd',
    city: 'Los Angeles',
    capacity: 10000,
    description: 'A massive stadium perfect for large concerts and events.',
    amenities: ['Parking', 'Concessions', 'VIP Suites', 'Professional Stage'],
    contactEmail: 'events@stadiumarena.com',
    contactPhone: '+1-555-0202',
    image: '/images/venue3.jpg',
    pricePerHour: 15000,
    createdAt: '2024-01-03T09:00:00Z'
  }
];

export const mockGallery: GalleryItem[] = [
  {
    id: '1',
    title: 'Summer Festival Highlights',
    description: 'Amazing moments from our summer music festival.',
    image: '/images/gallery1.jpg',
    category: 'event',
    tags: ['festival', 'summer', 'music'],
    uploadedBy: 'Admin',
    createdAt: '2024-01-15T16:00:00Z'
  },
  {
    id: '2',
    title: 'Sarah Johnson Performance',
    description: 'Sarah Johnson performing her latest hits.',
    image: '/images/gallery2.jpg',
    category: 'artist',
    tags: ['sarah johnson', 'performance', 'live'],
    uploadedBy: 'Photographer',
    createdAt: '2024-01-14T14:30:00Z'
  },
  {
    id: '3',
    title: 'Blue Note Club Interior',
    description: 'The beautiful interior of our jazz club.',
    image: '/images/gallery3.jpg',
    category: 'venue',
    tags: ['venue', 'jazz', 'interior'],
    uploadedBy: 'Admin',
    createdAt: '2024-01-13T11:45:00Z'
  }
];

export const mockMessages: Message[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    subject: 'Event Booking Inquiry',
    message: 'I would like to book your venue for a corporate event next month.',
    read: false,
    priority: 'high',
    createdAt: '2024-01-15T09:00:00Z'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    subject: 'Artist Collaboration',
    message: 'I am interested in collaborating with your artists for an upcoming project.',
    read: true,
    priority: 'medium',
    createdAt: '2024-01-14T15:30:00Z'
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    subject: 'General Question',
    message: 'What are your booking policies and requirements?',
    read: false,
    priority: 'low',
    createdAt: '2024-01-13T12:15:00Z'
  }
]; 