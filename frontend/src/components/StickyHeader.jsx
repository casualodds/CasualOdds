import React, { useMemo } from 'react';
import { debounce } from '../utils/debounce';

export default function StickyHeader({query, setQuery, league, setLeague, market, setMarket, refreshInterval, setRefreshInterval}){
  const onChange = useMemo(() => debounce((e)=> setQuery(e.target.value), 300), [setQuery]);

  const leagues = ['all','basketball_nba','football_nfl','baseball_mlb'];

  return (
    <div className="sticky top-0 bg-white dark:bg-gray-800 z-20 p-3 border-b shadow-sm">
      <div className="max-w-6xl mx-auto flex gap-3 items-center">
        <input defaultValue={query} onChange={onChange} placeholder="Search teams, players, wagers..." className="flex-1 p-2 border rounded" aria-label="Search fixtures"/>
        <select value={league} onChange={(e)=>setLeague(e.target.value)} className="p-2 border rounded">
          {leagues.map(l => <option key={l} value={l==='all'?'':l}>{l}</option>)}
        </select>
        <select value={market} onChange={(e)=>setMarket(e.target.value)} className="p-2 border rounded">
          <option value="all">All Markets</option>
          <option value="moneyline">Moneyline</option>
          <option value="spreads">Spreads</option>
          <option value="totals">Totals</option>
          <option value="props">Player Props</option>
        </select>
        <select value={refreshInterval} onChange={(e)=>setRefreshInterval(Number(e.target.value))} className="p-2 border rounded">
          <option value={15000}>15s</option>
          <option value={30000}>30s</option>
          <option value={60000}>60s</option>
        </select>
      </div>
    </div>
  );
}
