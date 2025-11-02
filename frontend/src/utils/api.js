export async function fetchOdds(query='', league='', market='all', page=1){
  const params = new URLSearchParams({ q: query, league, market, page });
  const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/odds?${params.toString()}`);
  if(!res.ok) throw new Error('Failed to fetch odds');
  return res.json();
}
