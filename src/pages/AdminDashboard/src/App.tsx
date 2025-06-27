import React, { useState } from 'react';
import AdminLayout from './components/Layout/AdminLayout';
import DashboardOver from './components/Dashboard/DashboardOverview';
import EventsList from './components/Events/EventsList';
import ArtistsList from './components/Artists/ArtistsList';
import VenuesList from './components/Venues/VenuesList';
import GalleryList from './components/Gallery/GalleryList';
import MessagesList from './components/Messages/MessagesList';
import { useLocalStorage } from './hooks/useLocalStorage';
import { mockEvents, mockArtists, mockVenues, mockGallery, mockMessages } from './data/mockData';
import { AdminSection, Event, Artist, Venue, GalleryItem, Message } from './types';
import { apiService } from '../../../services/api';

function App() {
  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');
  const [events, setEvents] = useLocalStorage<Event[]>('admin-events', mockEvents);
  const [artists, setArtists] = useLocalStorage<Artist[]>('admin-artists', mockArtists);
  const [venues, setVenues] = useLocalStorage<Venue[]>('admin-venues', mockVenues);
  const [gallery, setGallery] = useLocalStorage<GalleryItem[]>('admin-gallery', mockGallery);
  const [messages, setMessages] = useLocalStorage<Message[]>('admin-messages', mockMessages);

  const unreadMessages = messages.filter(m => !m.read).length;

  // Event handlers
  const handleAddEvent = (eventData: Omit<Event, 'id' | 'createdAt'>) => {
    const newEvent: Event = {
      ...eventData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setEvents([...events, newEvent]);
  };

  const handleUpdateEvent = (updatedEvent: Event) => {
    setEvents(events.map(event => event.id === updatedEvent.id ? updatedEvent : event));
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter(event => event.id !== id));
  };

  // Artist handlers
  const handleAddArtist = (artistData: Omit<Artist, 'id' | 'createdAt'>) => {
    const newArtist: Artist = {
      ...artistData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setArtists([...artists, newArtist]);
  };

  const handleUpdateArtist = (updatedArtist: Artist) => {
    setArtists(artists.map(artist => artist.id === updatedArtist.id ? updatedArtist : artist));
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
  const mapApiVenueToAdminVenue = (apiVenue: any): Venue => {
    return {
      id: String(apiVenue.id),
      name: apiVenue.name || '',
      address: apiVenue.address || '',
      city: apiVenue.city || '',
      capacity: apiVenue.capacity || 0,
      description: apiVenue.description || '',
      amenities: apiVenue.amenities || [],
      contactEmail: apiVenue.contactEmail || '',
      contactPhone: apiVenue.contactPhone || '',
      image: apiVenue.image || '',
      pricePerHour: apiVenue.pricePerHour || 0,
      createdAt: apiVenue.createdAt || ''
    };
  };

  const handleAddVenue = async (venueData: Omit<Venue, 'id' | 'createdAt'>) => {
    const res = await apiService.createVenue(venueData);
    if (res.data) {
      setVenues((prev) => [...prev, mapApiVenueToAdminVenue(res.data)]);
    } else {
      alert(res.error || 'Failed to create venue');
    }
  };

  const handleUpdateVenue = async (updatedVenue: Venue) => {
    const res = await apiService.updateVenue(Number(updatedVenue.id), { ...updatedVenue, id: Number(updatedVenue.id) });
    if (res.data) {
      setVenues((prev) => prev.map(venue => venue.id === updatedVenue.id ? mapApiVenueToAdminVenue(res.data) : venue));
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
          <DashboardOver
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
    <AdminLayout
      activeSection={activeSection}
      onSectionChange={setActiveSection}
      unreadMessages={unreadMessages}
    >
      {renderContent()}
    </AdminLayout>
  );
}

export default App;