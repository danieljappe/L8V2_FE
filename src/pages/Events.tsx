import React from 'react';
import EventList from '../components/EventList';
import { useSEO } from '../hooks/useSEO';

const Events: React.FC = () => {
  // SEO optimization
  useSEO({
    title: 'Events - Kommende Begivenheder',
    description: 'Udforsk L8 Events kommende begivenheder og oplev uforglemmelige musikkopplevelser med elektronisk musik. Find datoer, lokationer og billetinformation.',
    keywords: 'L8 Events, kommende events, elektronisk musik events, begivenheder, billetter, musikkopplevelser, event kalender',
    url: '/events'
  });

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Main Content */}
      <main className="relative z-10 pt-6">
        <EventList />
      </main>
    </div>
  );
};

export default Events; 