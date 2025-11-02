import React, { useState } from 'react';
import LineHistoryChart from './LineHistoryChart';
import BetTrends from './BetTrends';

export default function PropGroup({ prop }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mb-3 bg-white p-2 rounded border">
      <div className="flex justify-between items-center" role="button" onClick={()=>setOpen(!open)} tabIndex={0}>
        <div>
          <div className="font-medium">{prop.player} • {prop.type}</div>
          <div className="text-xs text-gray-500">{prop.market}</div>
        </div>
        <div className="text-sm">{open ? '−' : '+'}</div>
      </div>
      {open && (
        <div className="mt-2 overflow-auto">
          <table className="w-full text-sm">
            <tbody>
              {prop.sportsbooks.map(sb=>(
                <tr key={sb.key} className="border-b last:border-0">
                  <td className="p-2">{sb.name}</td>
                  <td className="p-2 font-mono">{sb.currentLine}</td>
                  <td className="p-2"><LineHistoryChart fixtureId={prop.id} book={sb.key} /></td>
                  <td className="p-2"><BetTrends fixtureId={prop.id} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
