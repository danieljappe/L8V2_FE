import React from 'react';
import EventList from '../components/EventList';

const Events: React.FC = () => {
  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Main Content */}
      <main className="relative z-10">
        <EventList />
      </main>
    </div>
  );
};

export default Events; 