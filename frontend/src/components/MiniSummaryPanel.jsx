import React from 'react';
export default function MiniSummaryPanel({odds}){
  const best = [];
  odds.forEach(f => {
    if(f.sportsbooks && f.sportsbooks.length) best.push(...f.sportsbooks.map(s=>({fixture:f, book:s, decimal: s.currentLine})));
  });
  best.sort((a,b)=> (b.decimal||0) - (a.decimal||0));
  const top3 = best.slice(0,3);
  return (
    <div className="mb-4 p-3 bg-white rounded shadow flex gap-4">
      {top3.map((t,i)=>(
        <div key={i} className="flex-1">
          <div className="text-xs text-gray-500">{t.fixture.home_team} vs {t.fixture.away_team}</div>
          <div className="font-semibold">{t.book.key} {t.book.currentLine}</div>
        </div>
      ))}
    </div>
  );
}
