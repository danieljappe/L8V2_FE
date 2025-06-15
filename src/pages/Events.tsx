import React from 'react';
import Header from '../components/Header';
import EventList from '../components/EventList';

const Events: React.FC = () => {
  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="relative z-10">
        <EventList />
      </main>
    </div>
  );
};

export default Events; 