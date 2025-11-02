import React, { useEffect, useState } from 'react';
import axios from 'axios';
export default function BetTrends({ fixtureId }) {
  const [trends, setTrends] = useState({ home:{bets:0,money:0}, away:{bets:0,money:0} });
  useEffect(()=>{
    let mounted=true;
    axios.get(`${import.meta.env.VITE_API_BASE}/api/odds?q=&fixture_id=${fixtureId}`).then(res=>{
      if(!mounted) return;
      // backend may not have real trends; using simulated values if not present
      setTrends(res.data && res.data[0] && res.data[0].bet_trends ? res.data[0].bet_trends : {home:{bets:3200,money:150000}, away:{bets:2800,money:130000}});
    }).catch(()=>{});
    return ()=> mounted=false;
  },[fixtureId]);
  return (
    <div className="text-xs">
      <div className="font-semibold">Home</div>
      <div>Bets: {trends.home.bets}</div>
      <div>Money: ${trends.home.money.toLocaleString()}</div>
      <div className="font-semibold mt-2">Away</div>
      <div>Bets: {trends.away.bets}</div>
      <div>Money: ${trends.away.money.toLocaleString()}</div>
    </div>
  );
}
