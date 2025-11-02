import React from 'react';
export default function TopMoversLeaderboard({odds}) {
  const movers = [];
  odds.forEach(f => {
    if(f.sportsbooks) f.sportsbooks.forEach(s => {
      movers.push({fixture: f, book: s, mover: s.mover || 0});
    });
  });
  movers.sort((a,b)=>b.mover - a.mover);
  const top = movers.slice(0,8);
  return (
    <div className="p-3 bg-white rounded shadow">
      <h3 className="font-semibold mb-2">Top Movers</h3>
      <ul className="text-sm space-y-2">
        {top.map((t,i)=>(
          <li key={i} className="flex justify-between"><span>{t.fixture.home_team} · {t.book.key}</span><span>{t.mover.toFixed(2)}</span></li>
        ))}
      </ul>
    </div>
  );
}
