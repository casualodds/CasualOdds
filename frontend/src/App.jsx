import React, { useState, useEffect, useCallback } from 'react';
import StickyHeader from './components/StickyHeader';
import OddsTable from './components/OddsTable';
import MiniSummaryPanel from './components/MiniSummaryPanel';
import DarkModeToggle from './components/DarkModeToggle';
import TopMoversLeaderboard from './components/TopMoversLeaderboard';
import { BACKEND_URL } from './config';

export default function App() {
  const [odds, setOdds] = useState([]);
  const [query, setQuery] = useState('');
  const [league, setLeague] = useState('');
  const [market, setMarket] = useState('all');
  const [refreshInterval, setRefreshInterval] = useState(30000);
  const [darkMode, setDarkMode] = useState(false);

  const loadOdds = useCallback(async () => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/odds?q=${encodeURIComponent(query)}&league=${encodeURIComponent(league)}&market=${encodeURIComponent(market)}&page=1`
      );

      if (!response.ok) throw new Error(`Failed to fetch odds: ${response.status}`);

      const data = await response.json();
      console.log("Fetched odds data:", data); // 👈 Added for debugging
      setOdds(data.odds || []);
    } catch (e) {
      console.error('Error loading odds:', e);
    }
  }, [query, league, market]);

  useEffect(() => {
    loadOdds();
    const id = setInterval(loadOdds, refreshInterval);
    return () => clearInterval(id);
  }, [loadOdds, refreshInterval]);

  return (
    <div className={darkMode ? 'bg-gray-900 text-green-200 min-h-screen' : 'bg-green-50 text-green-900 min-h-screen'}>
      <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
      <StickyHeader
        query={query} setQuery={setQuery}
        league={league} setLeague={setLeague}
        market={market} setMarket={setMarket}
        refreshInterval={refreshInterval} setRefreshInterval={setRefreshInterval}
      />
      <main className="max-w-6xl mx-auto p-4">
        <MiniSummaryPanel odds={odds} />
        <div className="flex gap-4">
          <div className="flex-1"><OddsTable odds={odds} /></div>
          <aside className="w-80 hidden lg:block">
            <TopMoversLeaderboard odds={odds} />
          </aside>
        </div>
      </main>
    </div>
  );
}
