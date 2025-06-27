import React from 'react';
import { Calendar, Users, MapPin, Image, MessageSquare, TrendingUp } from 'lucide-react';
import { Event, Artist, Venue, GalleryItem, Message } from '../../types';

interface DashboardOverviewProps {
  events: Event[];
  artists: Artist[];
  venues: Venue[];
  gallery: GalleryItem[];
  messages: Message[];
}

export default function DashboardOverview({ 
  events, 
  artists, 
  venues, 
  gallery, 
  messages 
}: DashboardOverviewProps) {
  const unreadMessages = messages.filter(m => !m.read).length;
  const upcomingEvents = events.filter(e => e.status === 'upcoming').length;
  const totalRevenue = events.reduce((sum, event) => sum + (event.price * 0.8), 0); // Estimated 80% capacity

  const stats = [
    {
      title: 'Total Events',
      value: events.length,
      icon: Calendar,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'Active Artists',
      value: artists.length,
      icon: Users,
      color: 'bg-green-500',
      change: '+8%'
    },
    {
      title: 'Available Venues',
      value: venues.length,
      icon: MapPin,
      color: 'bg-purple-500',
      change: '+3%'
    },
    {
      title: 'Gallery Items',
      value: gallery.length,
      icon: Image,
      color: 'bg-orange-500',
      change: '+15%'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600 mt-1">Monitor your events, artists, and venues</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 px-4 py-2">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">System Online</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`${stat.color} rounded-lg p-3`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex items-center mt-4">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600 font-medium">{stat.change}</span>
                <span className="text-sm text-gray-500 ml-1">from last month</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity & Messages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Events */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Events</h3>
            <span className="text-sm text-gray-500">{upcomingEvents} events</span>
          </div>
          <div className="space-y-3">
            {events.filter(e => e.status === 'upcoming').slice(0, 3).map((event) => (
              <div key={event.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <img 
                  src={event.image} 
                  alt={event.title}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{event.title}</p>
                  <p className="text-sm text-gray-500">{event.date} at {event.time}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">${event.price}</p>
                  <p className="text-xs text-gray-500">{event.venue}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Messages */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Messages</h3>
            {unreadMessages > 0 && (
              <span className="bg-red-100 text-red-600 text-xs font-medium px-2 py-1 rounded-full">
                {unreadMessages} unread
              </span>
            )}
          </div>
          <div className="space-y-3">
            {messages.slice(0, 3).map((message) => (
              <div key={message.id} className={`p-3 rounded-lg border ${
                !message.read ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium text-gray-900">{message.name}</p>
                  <div className="flex items-center space-x-2">
                    {!message.read && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      message.priority === 'high' ? 'bg-red-100 text-red-600' :
                      message.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {message.priority}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 truncate">{message.subject}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(message.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">${totalRevenue.toFixed(0)}</p>
            <p className="text-sm text-gray-600">Estimated Revenue</p>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">{upcomingEvents}</p>
            <p className="text-sm text-gray-600">Events This Month</p>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">
              {venues.reduce((sum, venue) => sum + venue.capacity, 0).toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">Total Venue Capacity</p>
          </div>
        </div>
      </div>
    </div>
  );
}