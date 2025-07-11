import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/admin/AdminLayout';
import DashboardOverview from '../components/admin/DashboardOverview';
import EventsList from '../components/admin/EventsList';
import ArtistsList from '../components/admin/ArtistsList';
import VenuesList from '../components/admin/VenuesList';
import GalleryList from '../components/admin/GalleryList';
import MessagesList from '../components/admin/MessagesList';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { mockEvents, mockArtists, mockVenues, mockGallery, mockMessages } from '../data/mockData';
import { AdminSection, Event, Artist, Venue, GalleryItem, Message } from '../types/admin';
import { apiService, Event as ApiEvent, Artist as ApiArtist, Venue as ApiVenue } from '../services/api';

// Map backend event to admin event type
function mapApiEventToAdminEvent(apiEvent: ApiEvent): Event {
  // Always parse the date string to YYYY-MM-DD
  let dateStr = '';
  if (typeof apiEvent.date === 'string') {
    dateStr = apiEvent.date.length > 10 ? apiEvent.date.slice(0, 10) : apiEvent.date;
  } else {
    dateStr = '';
  }
  return {
    id: apiEvent.id,
    title: apiEvent.title,
    description: apiEvent.description,
    date: dateStr,
    time: apiEvent.startTime || '',
    endTime: apiEvent.endTime || '',
    // Use venue ID for the form
    venue: typeof apiEvent.venue === 'object' && apiEvent.venue ? String(apiEvent.venue.id) : '',
    artist: apiEvent.eventArtists && apiEvent.eventArtists.length > 0 ? apiEvent.eventArtists.map(ea => ea.artist?.name).join(', ') : '',
    artists: apiEvent.eventArtists ? apiEvent.eventArtists.map(ea => ea.artist?.id).filter(Boolean) : [],
    price: apiEvent.ticketPrice || 0,
    capacity: apiEvent.capacity || apiEvent.totalTickets || 0,
    image: apiEvent.imageUrl || '',
    status: apiEvent.status as any,
    createdAt: apiEvent.createdAt,
  } as Event & { artists: string[] };
}

// Map admin event form data to backend event format
function mapAdminEventToApiEvent(event: Partial<Event>, venues?: Venue[]): Partial<ApiEvent> {
  const apiEvent: Partial<ApiEvent> = {
    title: event.title,
    description: event.description,
    date: event.date,
    startTime: event.time,
    endTime: event.endTime,
    ticketPrice: event.price,
    capacity: event.capacity,
    imageUrl: event.image,
    // Only allow valid status values
    status: ['upcoming', 'ongoing', 'completed', 'cancelled'].includes(event.status || '') ? event.status : 'upcoming',
  };

  if (event.capacity) {
    apiEvent.totalTickets = event.capacity;
  }

  // Find the venue by ID if venues are provided and event.venue is a name
  if (event.venue) {
    // If event.venue is already a UUID, use it. Otherwise, look up by name.
    let venueId = event.venue;
    if (venues && venues.length > 0) {
      const foundVenue = venues.find(v => v.id === event.venue || v.name === event.venue);
      if (foundVenue) {
        venueId = foundVenue.id;
      }
    }
    (apiEvent as any).venueId = venueId;
  } else {
    (apiEvent as any).venueId = null;
  }

  return apiEvent;
}

function mapApiArtistToAdminArtist(apiArtist: ApiArtist): Artist {
  return {
    id: apiArtist.id,
    name: apiArtist.name,
    bio: apiArtist.bio || '',
    genre: apiArtist.genre || '',
    email: '',
    phone: '',
    image: apiArtist.image || '',
    socialMedia: {},
    eventsCount: 0,
    createdAt: apiArtist.createdAt,
  };
}

function mapApiVenueToAdminVenue(apiVenue: ApiVenue): Venue {
  return {
    id: String(apiVenue.id),
    name: apiVenue.name,
    address: apiVenue.address || '',
    city: apiVenue.city || '',
    capacity: apiVenue.capacity || 0,
    description: apiVenue.description || '',
    amenities: [],
    contactEmail: apiVenue.contactEmail || '',
    contactPhone: apiVenue.contactPhone || '',
    image: apiVenue.image || '',
    pricePerHour: 0,
    createdAt: apiVenue.createdAt,
  };
}

export default function Admin() {
  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');
  // Events: use backend
  const [events, setEvents] = useState<Event[]>([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [eventsError, setEventsError] = useState<string | null>(null);

  // Artists and Venues: use backend
  const [artists, setArtists] = useState<Artist[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [artistsLoading, setArtistsLoading] = useState(false);
  const [venuesLoading, setVenuesLoading] = useState(false);

  // The rest still use local storage for now
  const [gallery, setGallery] = useLocalStorage<GalleryItem[]>('admin-gallery', mockGallery);
  const [messages, setMessages] = useLocalStorage<Message[]>('admin-messages', mockMessages);

  const unreadMessages = messages.filter(m => !m.read).length;

  // Fetch events, artists, and venues from backend on mount
  useEffect(() => {
    const fetchEvents = async () => {
      setEventsLoading(true);
      setEventsError(null);
      const res = await apiService.getEvents();
      if (res.data) {
        setEvents((res.data as ApiEvent[]).map(mapApiEventToAdminEvent));
      } else {
        setEventsError(res.error || 'Failed to fetch events');
      }
      setEventsLoading(false);
    };
    const fetchArtists = async () => {
      setArtistsLoading(true);
      const res = await apiService.getArtists();
      if (res.data) {
        setArtists((res.data as ApiArtist[]).map(mapApiArtistToAdminArtist));
      }
      setArtistsLoading(false);
    };
    const fetchVenues = async () => {
      setVenuesLoading(true);
      const res = await apiService.getVenues();
      if (res.data) {
        setVenues((res.data as ApiVenue[]).map(mapApiVenueToAdminVenue));
      }
      setVenuesLoading(false);
    };
    fetchEvents();
    fetchArtists();
    fetchVenues();
  }, []);

  // Event handlers (backend)
  const handleAddEvent = async (eventData: Omit<Event, 'id' | 'createdAt'>) => {
    const res = await apiService.createEvent(mapAdminEventToApiEvent(eventData, venues));
    if (res.data) {
      setEvents((prev) => [...prev, mapApiEventToAdminEvent(res.data as ApiEvent)]);
    } else {
      alert(res.error || 'Failed to create event');
    }
  };

  const handleUpdateEvent = async (updatedEvent: Event) => {
    const res = await apiService.updateEvent(updatedEvent.id, mapAdminEventToApiEvent(updatedEvent, venues));
    if (res.data) {
      setEvents((prev) => prev.map(event => event.id === updatedEvent.id ? mapApiEventToAdminEvent(res.data as ApiEvent) : event));
    } else {
      alert(res.error || 'Failed to update event');
    }
  };

  const handleDeleteEvent = async (id: string) => {
    const res = await apiService.deleteEvent(id);
    if (!res.error) {
      setEvents((prev) => prev.filter(event => event.id !== id));
    } else {
      alert(res.error || 'Failed to delete event');
    }
  };

  // Artist handlers
  const handleAddArtist = async (artistData: Omit<Artist, 'id' | 'createdAt'>) => {
    const res = await apiService.createArtist(artistData);
    if (res.data) {
      setArtists((prev) => [...prev, mapApiArtistToAdminArtist(res.data as ApiArtist)]);
    } else {
      alert(res.error || 'Failed to create artist');
    }
  };

  const handleUpdateArtist = async (updatedArtist: Artist) => {
    const res = await apiService.updateArtist(updatedArtist.id, updatedArtist);
    if (res.data) {
      setArtists((prev) => prev.map(artist => artist.id === updatedArtist.id ? mapApiArtistToAdminArtist(res.data as ApiArtist) : artist));
    } else {
      alert(res.error || 'Failed to update artist');
    }
  };

  const handleDeleteArtist = async (id: string) => {
    const res = await apiService.deleteArtist(id);
    if (!res.error) {
      setArtists(artists.filter(artist => artist.id !== id));
    } else {
      alert(res.error || 'Failed to delete artist');
    }
  };

  // Venue handlers
  const handleAddVenue = async (venueData: Omit<Venue, 'id' | 'createdAt'>) => {
    const res = await apiService.createVenue(venueData);
    if (res.data) {
      setVenues((prev) => [...prev, mapApiVenueToAdminVenue(res.data as ApiVenue)]);
    } else {
      alert(res.error || 'Failed to create venue');
    }
  };

  const handleUpdateVenue = async (updatedVenue: Venue) => {
    const res = await apiService.updateVenue(updatedVenue.id, { ...updatedVenue, id: updatedVenue.id });
    if (res.data) {
      setVenues((prev) => prev.map(venue => venue.id === updatedVenue.id ? mapApiVenueToAdminVenue(res.data as ApiVenue) : venue));
    } else {
      alert(res.error || 'Failed to update venue');
    }
  };

  const handleDeleteVenue = async (id: string) => {
    const res = await apiService.deleteVenue(id);
    if (!res.error) {
      setVenues(venues.filter(venue => venue.id !== id));
    } else {
      alert(res.error || 'Failed to delete venue');
    }
  };

  // Gallery handlers
  const handleAddGallery = (galleryData: Omit<GalleryItem, 'id' | 'createdAt'>) => {
    const newItem: GalleryItem = {
      ...galleryData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setGallery([...gallery, newItem]);
  };

  const handleUpdateGallery = (updatedItem: GalleryItem) => {
    setGallery(gallery.map(item => item.id === updatedItem.id ? updatedItem : item));
  };

  const handleDeleteGallery = (id: string) => {
    setGallery(gallery.filter(item => item.id !== id));
  };

  // Message handlers
  const handleMarkAsRead = (id: string) => {
    setMessages(messages.map(message => 
      message.id === id ? { ...message, read: true } : message
    ));
  };

  const handleDeleteMessage = (id: string) => {
    setMessages(messages.filter(message => message.id !== id));
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <DashboardOverview
            events={events}
            artists={artists}
            venues={venues}
            gallery={gallery}
            messages={messages}
          />
        );
      case 'events':
        return (
          <EventsList
            events={events}
            onAddEvent={handleAddEvent}
            onUpdateEvent={handleUpdateEvent}
            onDeleteEvent={handleDeleteEvent}
            artists={artists}
            venues={venues}
          />
        );
      case 'artists':
        return (
          <ArtistsList
            artists={artists}
            onAddArtist={handleAddArtist}
            onUpdateArtist={handleUpdateArtist}
            onDeleteArtist={handleDeleteArtist}
          />
        );
      case 'venues':
        return (
          <VenuesList
            venues={venues}
            onAddVenue={handleAddVenue}
            onUpdateVenue={handleUpdateVenue}
            onDeleteVenue={handleDeleteVenue}
          />
        );
      case 'gallery':
        return (
          <GalleryList
            gallery={gallery}
            onAddGallery={handleAddGallery}
            onUpdateGallery={handleUpdateGallery}
            onDeleteGallery={handleDeleteGallery}
          />
        );
      case 'messages':
        return (
          <MessagesList
            messages={messages}
            onMarkAsRead={handleMarkAsRead}
            onDeleteMessage={handleDeleteMessage}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-screen w-full">
      <AdminLayout
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        unreadMessages={unreadMessages}
      >
        {renderContent()}
      </AdminLayout>
    </div>
  );
} 