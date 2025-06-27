import React from 'react';
import { Calendar, Users, MapPin, Image, MessageSquare, TrendingUp, TrendingDown } from 'lucide-react';
import { Event, Artist, Venue, GalleryItem, Message } from '../../types/admin';

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
  const upcomingEvents = events.filter(event => event.status === 'upcoming').length;
  const completedEvents = events.filter(event => event.status === 'completed').length;
  const unreadMessages = messages.filter(message => !message.read).length;
  const totalRevenue = events.reduce((sum, event) => sum + (event.price * event.capacity * 0.7), 0);

  const stats = [
    {
      title: 'Total Events',
      value: events.length,
      change: '+12%',
      trend: 'up',
      icon: Calendar,
      color: 'bg-blue-500'
    },
    {
      title: 'Active Artists',
      value: artists.length,
      change: '+5%',
      trend: 'up',
      icon: Users,
      color: 'bg-green-500'
    },
    {
      title: 'Venues',
      value: venues.length,
      change: '+2%',
      trend: 'up',
      icon: MapPin,
      color: 'bg-purple-500'
    },
    {
      title: 'Gallery Items',
      value: gallery.length,
      change: '+8%',
      trend: 'up',
      icon: Image,
      color: 'bg-orange-500'
    },
    {
      title: 'Unread Messages',
      value: unreadMessages,
      change: '-3%',
      trend: 'down',
      icon: MessageSquare,
      color: 'bg-red-500'
    },
    {
      title: 'Total Revenue',
      value: `$${totalRevenue.toLocaleString()}`,
      change: '+15%',
      trend: 'up',
      icon: TrendingUp,
      color: 'bg-emerald-500'
    }
  ];

  const recentEvents = events
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const recentMessages = messages
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your events.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                {stat.trend === 'up' ? (
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                )}
                <span className={`text-sm font-medium ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
                <span className="text-sm text-gray-600 ml-1">from last month</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Events */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Events</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentEvents.map((event) => (
                <div key={event.id} className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{event.title}</p>
                    <p className="text-sm text-gray-500">{event.date} at {event.time}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    event.status === 'upcoming' ? 'bg-green-100 text-green-800' :
                    event.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {event.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Messages */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Messages</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentMessages.map((message) => (
                <div key={message.id} className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-700">
                      {message.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{message.subject}</p>
                    <p className="text-sm text-gray-500">{message.name} • {message.email}</p>
                  </div>
                  {!message.read && (
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 