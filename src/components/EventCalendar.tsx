import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, MapPin } from 'lucide-react';

const EventCalendar: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const events = [
    {
      id: 1,
      title: 'Neon Nights',
      date: '2025-03-15',
      time: '21:00',
      venue: 'Warehouse District',
      status: 'upcoming',
      color: 'purple'
    },
    {
      id: 2,
      title: 'Cosmic Vibes',
      date: '2025-02-14',
      time: '20:30',
      venue: 'Main Stage',
      status: 'past',
      color: 'blue'
    },
    {
      id: 3,
      title: 'Electric Dreams',
      date: '2025-04-12',
      time: '22:00',
      venue: 'Underground Club',
      status: 'upcoming',
      color: 'green'
    },
    {
      id: 4,
      title: 'Rhythm & Lights',
      date: '2025-01-18',
      time: '21:30',
      venue: 'City Hall',
      status: 'past',
      color: 'orange'
    }
  ];

  const upcomingEvents = events.filter(event => event.status === 'upcoming');

  const getColorClasses = (color: string) => {
    const colors = {
      purple: 'bg-purple-500/20 border-purple-300/30 text-purple-200',
      blue: 'bg-blue-500/20 border-blue-300/30 text-blue-200',
      green: 'bg-green-500/20 border-green-300/30 text-green-200',
      orange: 'bg-orange-500/20 border-orange-300/30 text-orange-200'
    };
    return colors[color as keyof typeof colors] || colors.purple;
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
                March 2025
              </h3>
              <div className="flex items-center space-x-2">
                <button className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </button>
                <button className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div 
                  key={day}
                  className="text-center text-white/60 text-xs sm:text-sm font-medium py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {Array.from({ length: 35 }, (_, i) => {
                const day = i - 6; // Adjust for month start
                const isToday = day === 15;
                const hasEvent = day === 15;
                
                return (
                  <div
                    key={i}
                    className={`aspect-square flex items-center justify-center text-xs sm:text-sm rounded-lg sm:rounded-xl transition-all duration-200 ${
                      day > 0 && day <= 31
                        ? hasEvent
                          ? 'bg-purple-500/30 text-white font-bold border border-purple-300/50 cursor-pointer'
                          : isToday
                          ? 'bg-white/20 text-white font-semibold cursor-pointer'
                          : 'text-white/70 hover:bg-white/10 cursor-pointer'
                        : 'text-white/30'
                    }`}
                  >
                    {day > 0 && day <= 31 ? day : ''}
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
            
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className={`p-3 sm:p-4 rounded-2xl border ${getColorClasses(event.color)} transition-all duration-300 cursor-pointer`}
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
                            {new Date(event.date).toLocaleDateString('en-US', {
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventCalendar;