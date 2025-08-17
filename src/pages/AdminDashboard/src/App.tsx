import React, { useState, useEffect } from 'react';
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
import { adminApiService } from './services/api';
import ConstraintErrorModal from '../../../components/admin/ConstraintErrorModal';

function App() {
  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');
  const [events, setEvents] = useLocalStorage<Event[]>('admin-events', mockEvents);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [venues, setVenues] = useLocalStorage<Venue[]>('admin-venues', mockVenues);
  const [gallery, setGallery] = useLocalStorage<GalleryItem[]>('admin-gallery', mockGallery);
  const [messages, setMessages] = useLocalStorage<Message[]>('admin-messages', mockMessages);
  const [artistsLoading, setArtistsLoading] = useState(true);

  // Constraint error modal state
  const [constraintError, setConstraintError] = useState<{
    message: string;
    details?: string;
    eventNames?: string;
    eventIds?: string[];
    relatedEvents?: number;
  } | null>(null);

  const unreadMessages = messages.filter(m => !m.read).length;

  // Fetch artists from backend on mount
  useEffect(() => {
    const fetchArtists = async () => {
      try {
        setArtistsLoading(true);
        console.log('🔄 AdminDashboard: Fetching artists from API...');
        const res = await adminApiService.getArtists();
        console.log('📡 AdminDashboard: API response:', res);
        if (res.data) {
          console.log('✅ AdminDashboard: API data received:', res.data);
          // The API response data should already match our Artist type
          setArtists(res.data as Artist[]);
          console.log('💾 AdminDashboard: Artists state set to:', res.data);
        } else {
          console.error('❌ AdminDashboard: Failed to fetch artists:', res.error);
          // Fallback to mock data if API fails
          console.log('🔄 AdminDashboard: Falling back to mock data');
          setArtists(mockArtists);
        }
      } catch (error) {
        console.error('❌ AdminDashboard: Error fetching artists:', error);
        // Fallback to mock data if API fails
        console.log('🔄 AdminDashboard: Falling back to mock data due to error');
        setArtists(mockArtists);
      } finally {
        setArtistsLoading(false);
      }
    };

    fetchArtists();
  }, []);

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
  const handleAddArtist = async (artistData: Omit<Artist, 'id' | 'createdAt' | 'updatedAt'>) => {
    const res = await adminApiService.createArtist(artistData);
    if (res.data) {
      // Transform API data to match AdminDashboard types
      const newArtist: Artist = {
        id: res.data.id,
        name: res.data.name,
        bio: res.data.bio || '',
        imageUrl: res.data.imageUrl || '',
        website: res.data.website || '',
        socialMedia: res.data.socialMedia || [],
        genre: res.data.genre || '',
        createdAt: res.data.createdAt || new Date().toISOString(),
        updatedAt: res.data.updatedAt || new Date().toISOString()
      };
      setArtists((prev) => [...prev, newArtist]);
    } else {
      alert(res.error || 'Failed to create artist');
    }
  };

  const handleUpdateArtist = async (updatedArtist: Artist) => {
    console.log('🔄 AdminDashboard: Updating artist with data:', updatedArtist);
    
    // Prepare the data to send to backend (exclude id, createdAt, updatedAt)
    const updateData = {
      name: updatedArtist.name,
      bio: updatedArtist.bio,
      imageUrl: updatedArtist.imageUrl,
      website: updatedArtist.website,
      socialMedia: updatedArtist.socialMedia,
      genre: updatedArtist.genre
    };
    
    console.log('📤 AdminDashboard: Sending update data to backend:', updateData);
    
    const res = await adminApiService.updateArtist(updatedArtist.id, updateData);
    if (res.data) {
      console.log('✅ AdminDashboard: Backend update response:', res.data);
      
      // Transform API data to match AdminDashboard types
      const transformedArtist: Artist = {
        id: res.data.id,
        name: res.data.name,
        bio: res.data.bio || '',
        imageUrl: res.data.imageUrl || '',
        website: res.data.website || '',
        socialMedia: res.data.socialMedia || [],
        genre: res.data.genre || '',
        createdAt: res.data.createdAt || updatedArtist.createdAt,
        updatedAt: res.data.updatedAt || new Date().toISOString()
      };
      
      console.log('🔄 AdminDashboard: Transformed artist data:', transformedArtist);
      
      setArtists(prev => prev.map(artist => 
        artist.id === updatedArtist.id ? transformedArtist : artist
      ));
      
      console.log('💾 AdminDashboard: Artists state updated successfully');
    } else {
      console.error('❌ AdminDashboard: Failed to update artist:', res.error);
      alert(res.error || 'Failed to update artist');
    }
  };

  const handleDeleteArtist = async (id: string) => {
    const res = await adminApiService.deleteArtist(id);
    if (!res.error) {
      setArtists(artists.filter(artist => artist.id !== id));
    } else {
      // Check if it's a foreign key constraint error
      if (res.error.includes('associated with events') || res.error.includes('foreign key constraint')) {
        // Use errorData if available for detailed information
        if (res.errorData) {
          console.log('Constraint error details:', res.errorData);
          setConstraintError({
            message: res.errorData.message || 'Cannot delete artist. This artist is associated with events and must be removed from all events first.',
            details: res.errorData.details,
            eventNames: res.errorData.eventNames,
            eventIds: res.errorData.eventIds,
            relatedEvents: res.errorData.relatedEvents
          });
        } else {
          // Fallback to parsing the error message
          try {
            if (res.error.includes('following events')) {
              const eventNamesMatch = res.error.match(/following events before deleting: (.+)/);
              const eventNames = eventNamesMatch ? eventNamesMatch[1] : 'Unknown events';
              
              setConstraintError({
                message: 'Cannot delete artist. This artist is associated with events and must be removed from all events first.',
                details: res.error,
                eventNames: eventNames,
                relatedEvents: 1
              });
            } else {
              setConstraintError({
                message: 'Cannot delete artist. This artist is associated with events and must be removed from all events first.',
                details: res.error
              });
            }
          } catch (parseError) {
            setConstraintError({
              message: 'Cannot delete artist. This artist is associated with events and must be removed from all events first.',
              details: res.error
            });
          }
        }
      } else {
        alert(res.error || 'Failed to delete artist');
      }
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
      imageUrl: apiVenue.image || '',
      pricePerHour: apiVenue.pricePerHour || 0,
      isActive: apiVenue.isActive !== undefined ? apiVenue.isActive : true,
      createdAt: apiVenue.createdAt || '',
      updatedAt: apiVenue.updatedAt || ''
    };
  };

  const handleAddVenue = async (venueData: Omit<Venue, 'id' | 'createdAt'>) => {
    const res = await adminApiService.createVenue(venueData);
    if (res.data) {
      setVenues((prev) => [...prev, mapApiVenueToAdminVenue(res.data)]);
    } else {
      alert(res.error || 'Failed to create venue');
    }
  };

  const handleUpdateVenue = async (updatedVenue: Venue) => {
    const res = await adminApiService.updateVenue(updatedVenue.id, updatedVenue);
    if (res.data) {
      setVenues((prev) => prev.map(venue => venue.id === updatedVenue.id ? mapApiVenueToAdminVenue(res.data) : venue));
    } else {
      alert(res.error || 'Failed to update venue');
    }
  };

  const handleDeleteVenue = async (id: string) => {
    const res = await adminApiService.deleteVenue(id);
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
    <>
      <AdminLayout
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        unreadMessages={unreadMessages}
      >
        {renderContent()}
      </AdminLayout>
      
      {/* Constraint Error Modal */}
      {constraintError && (
        <ConstraintErrorModal
          isOpen={!!constraintError}
          onClose={() => setConstraintError(null)}
          error={constraintError}
        />
      )}
    </>
  );
}

export default App;