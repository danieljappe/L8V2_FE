import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, MapPin } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';
import { useEvents } from '../hooks/useApi';
import { Event } from '../services/api';

const EventCalendar: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Fetch events from API
  const { data: events, loading, error } = useEvents();

  // Process events data
  const processedEvents = events?.map(event => ({
    id: event.id,
    title: event.title,
    date: event.date,
    time: event.startTime || '21:00',
    venue: event.venue?.name || 'TBA',
    status: new Date(event.date) >= new Date() ? 'upcoming' : 'past',
    color: getEventColor(event.id)
  })) || [];

  const upcomingEvents = processedEvents.filter(event => event.status === 'upcoming');

  function getEventColor(eventId: string): string {
    const colors = ['purple', 'blue', 'green', 'orange', 'pink', 'indigo'];
    // Simple hash function to convert string to number
    let hash = 0;
    for (let i = 0; i < eventId.length; i++) {
      const char = eventId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return colors[Math.abs(hash) % colors.length];
  }

  const getColorClasses = (color: string) => {
    const colors = {
      purple: 'bg-purple-500/20 border-purple-300/30 text-purple-200',
      blue: 'bg-blue-500/20 border-blue-300/30 text-blue-200',
      green: 'bg-green-500/20 border-green-300/30 text-green-200',
      orange: 'bg-orange-500/20 border-orange-300/30 text-orange-200',
      pink: 'bg-pink-500/20 border-pink-300/30 text-pink-200',
      indigo: 'bg-indigo-500/20 border-indigo-300/30 text-indigo-200'
    };
    return colors[color as keyof typeof colors] || colors.purple;
  };

  // Show loading state
  if (loading) {
    return (
      <section id="calendar" className="min-h-screen flex items-center justify-center p-4 snap-start pt-20">
        <LoadingSpinner size="lg" text="Loading calendar..." />
      </section>
    );
  }

  // Show error state
  if (error) {
    return (
      <section id="calendar" className="min-h-screen flex items-center justify-center p-4 snap-start pt-20">
        <div className="text-center">
          <p className="text-red-400 mb-4">Failed to load events</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  // Get events for current month
  const getEventsForMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return processedEvents.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getFullYear() === year && eventDate.getMonth() === month;
    });
  };

  const monthEvents = getEventsForMonth(currentMonth);

  // Generate calendar days
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= lastDay || days.length < 42) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return days;
  };

  const calendarDays = getDaysInMonth(currentMonth);

  // Check if a day has an event
  const hasEventOnDay = (day: Date) => {
    return monthEvents.some(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === day.toDateString();
    });
  };

  // Get events for a specific day
  const getEventsForDay = (day: Date) => {
    return monthEvents.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === day.toDateString();
    });
  };

  return (
    <section id="calendar" className="min-h-screen flex items-center justify-center p-4 snap-start pt-20">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Begivenhedskalender
          </h2>
          <p className="text-white/70 text-base sm:text-lg max-w-2xl mx-auto px-4">
            Hold dig opdateret med vores kommende begivenheder og gå aldrig glip af noget. Marker din kalender for den næste fantastiske oplevelse.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Calendar View */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-4 sm:p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center">
                <Calendar className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-purple-300" />
                {currentMonth.toLocaleDateString('da-DK', { month: 'long', year: 'numeric' })}
              </h3>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </button>
                <button 
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-4">
              {['Søn', 'Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør'].map((day) => (
                <div 
                  key={day}
                  className="text-center text-white/60 text-xs sm:text-sm font-medium py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {calendarDays.map((day, index) => {
                const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
                const isToday = day.toDateString() === new Date().toDateString();
                const hasEvent = hasEventOnDay(day);
                const dayEvents = getEventsForDay(day);
                
                return (
                  <div
                    key={index}
                    className={`aspect-square flex items-center justify-center text-xs sm:text-sm rounded-lg sm:rounded-xl transition-all duration-200 cursor-pointer ${
                      isCurrentMonth
                        ? hasEvent
                          ? 'bg-purple-500/30 text-white font-bold border border-purple-300/50 hover:bg-purple-500/40'
                          : isToday
                          ? 'bg-white/20 text-white font-semibold hover:bg-white/30'
                          : 'text-white/70 hover:bg-white/10'
                        : 'text-white/30'
                    }`}
                    title={dayEvents.length > 0 ? dayEvents.map(e => e.title).join(', ') : ''}
                  >
                    {day.getDate()}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upcoming Events List */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-4 sm:p-6 shadow-2xl">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">
              Kommende Begivenheder
            </h3>
            
            {upcomingEvents.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-white/60">Ingen kommende begivenheder</p>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingEvents.slice(0, 5).map((event) => (
                  <div
                    key={event.id}
                    className={`p-3 sm:p-4 rounded-2xl border ${getColorClasses(event.color)} transition-all duration-300 cursor-pointer hover:scale-105`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-base sm:text-lg mb-2 truncate">
                          {event.title}
                        </h4>
                        <div className="space-y-1">
                          <div className="flex items-center text-xs sm:text-sm opacity-80">
                            <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0" />
                            <span className="truncate">
                              {new Date(event.date).toLocaleDateString('da-DK', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                          <div className="flex items-center text-xs sm:text-sm opacity-80">
                            <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0" />
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center text-xs sm:text-sm opacity-80">
                            <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0" />
                            <span className="truncate">{event.venue}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventCalendar;