import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, Tooltip } from 'recharts';
import axios from 'axios';

export default function LineHistoryChart({ fixtureId, book }) {
  const [data,setData] = useState([]);
  useEffect(() => {
    let mounted = true;
    axios.get(`${import.meta.env.VITE_API_BASE}/api/odds?q=&fixture_id=${fixtureId}`).then(res=>{
      if(!mounted) return;
      // expect history attached by backend or mock
      const fixture = (res.data && res.data.length && res.data.find(f=>f.id===fixtureId)) || res.data[0];
      if(fixture && fixture._history) setData(fixture._history.map(h=>({time: new Date(h.time).toLocaleTimeString(), line: h.line})));
    }).catch(()=>{});
    return ()=> mounted=false;
  },[fixtureId,book]);
  if(!data.length) return <div className="text-xs text-gray-500">no history</div>;
  return (
    <div style={{width:150,height:60}}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <XAxis dataKey="time" hide />
          <Tooltip />
          <Line dataKey="line" stroke="#16a34a" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
