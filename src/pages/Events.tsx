import React from 'react';
import EventList from '../components/EventList';
import { useSEO } from '../hooks/useSEO';

const Events: React.FC = () => {
  // SEO optimization
  useSEO({
    title: 'L8 Events - Kommende Begivenheder og Musikkopplevelser',
    description: 'Udforsk L8 Events kommende begivenheder og oplev uforglemmelige musikkopplevelser med elektronisk musik. Find datoer, lokationer, billetter og book kunstnere til din event.',
    keywords: 'L8 Events, kommende events, elektronisk musik events, begivenheder, billetter, musikkopplevelser, event kalender, DJ events, musik events Danmark, event booking',
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