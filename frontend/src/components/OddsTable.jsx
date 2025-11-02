import React, { useState, useMemo } from 'react';
import PropGroup from './PropGroup';
import LineHistoryChart from './LineHistoryChart';
import BetTrends from './BetTrends';

function americanToDecimal(a){ if(a===null||a===undefined) return null; if(a>0) return 1 + a/100; return 1 - 100/a; }

export default function OddsTable({ odds }) {
  const [compact, setCompact] = useState(false);
  const [sortBy, setSortBy] = useState('best'); // best, avg, opening

  const fixtures = useMemo(()=> odds || [], [odds]);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex gap-2">
          <button onClick={()=>setCompact(!compact)} className="px-2 py-1 border rounded">{compact? 'Normal' : 'Compact'}</button>
          <select value={sortBy} onChange={e=>setSortBy(e.target.value)} className="p-1 border rounded text-sm">
            <option value="best">Best</option>
            <option value="avg">Average</option>
            <option value="opening">Opening</option>
          </select>
        </div>
        <div className="text-xs text-gray-500">Fixtures: {fixtures.length}</div>
      </div>

      <div className={compact ? 'text-sm' : ''}>
        {fixtures.map(fixture => (
          <div key={fixture.id} className="mb-4 bg-white rounded shadow p-3">
            <div className="flex justify-between items-center mb-2">
              <div>
                <div className="font-semibold">{fixture.home_team} vs {fixture.away_team}</div>
                <div className="text-xs text-gray-500">{fixture.sport_key || fixture.league}</div>
              </div>
              <div className="flex gap-2 items-center">
                <div className="text-xs text-gray-500">Opening: {fixture.openingLine || '-'}</div>
              </div>
            </div>

            {/* Standard sportsbooks table */}
            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-green-700">
                    <th className="p-2">Book</th>
                    <th className="p-2">Current</th>
                    <th className="p-2">History</th>
                    <th className="p-2">Trends</th>
                  </tr>
                </thead>
                <tbody>
                  {fixture.sportsbooks && fixture.sportsbooks.map(sb => {
                    const dec = americanToDecimal(sb.currentLine);
                    return (
                      <tr key={sb.key} className="border-b last:border-0">
                        <td className="p-2 font-medium">{sb.name}</td>
                        <td className="p-2 font-mono transition-all duration-300">{sb.currentLine}</td>
                        <td className="p-2"><LineHistoryChart fixtureId={fixture.id} book={sb.key} /></td>
                        <td className="p-2"><BetTrends fixtureId={fixture.id} /></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Player props */}
            <div className="mt-3">
              {fixture.player_props && fixture.player_props.length > 0 && (
                <div>
                  <div className="text-sm font-medium mb-2">Player Props</div>
                  {fixture.player_props.map(p=> <PropGroup key={p.id} prop={p} />)}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
