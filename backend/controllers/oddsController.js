const axios = require('axios');
const cache = require('../utils/cache');

const SPORTS = ["basketball_nba","football_nfl","baseball_mlb"];
const PROP_MARKETS = [
  "player_points","player_goals","player_assists","player_rebounds",
  "player_saves","player_touchdowns","player_yards","player_hitting"
];

let prevLines = {};

async function fetchAllOdds(apiKey) {
  const markets = ["moneyline","totals","spreads", ...PROP_MARKETS];
  const responses = await Promise.all(
    SPORTS.flatMap(sport =>
      markets.map(market =>
        axios.get(`https://api.the-odds-api.com/v4/sports/${sport}/odds`, {
          params: { apiKey, regions: "us", markets: market }
        }).then(res => res.data).catch(err => {
          // swallow single-market errors but continue
          return [];
        })
      )
    )
  );
  // flatten and dedupe by id if necessary
  return responses.flat();
}

exports.getOdds = async (req, res) => {
  try {
    const apiKey = process.env.THE_ODDS_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "THE_ODDS_API_KEY not set in environment" });

    const query = (req.query.q || "").toLowerCase();
    const league = req.query.league || null;

    // Refresh cache if stale
    if (!cache.data || (Date.now() - cache.timestamp) > cache.ttl) {
      cache.data = await fetchAllOdds(apiKey);
      cache.timestamp = Date.now();
    }

    let results = cache.data.filter(f =>
      (f.home_team && f.home_team.toLowerCase().includes(query)) ||
      (f.away_team && f.away_team.toLowerCase().includes(query))
    );

    if (league) results = results.filter(f => f.league && f.league === league);

    // Compute mover per sportsbook and attach simple snapshots
    results.forEach(fixture => {
      if (!fixture.sportsbooks) return;
      fixture.sportsbooks.forEach(sb => {
        const key = `${fixture.id}:${sb.key}`;
        const prev = prevLines[key];
        sb.mover = prev !== undefined ? Math.abs((sb.last_update || sb.currentLine || 0) - prev) : 0;
        prevLines[key] = sb.currentLine || sb.last_update || 0;
      });
      // attach a small mock history if not present
      fixture._history = fixture._history || [
        { time: new Date(Date.now()-3600*1000).toISOString(), line: fixture.openingLine || null },
        { time: new Date(Date.now()-1800*1000).toISOString(), line: fixture.openingLine ? fixture.openingLine+ (Math.random()*6-3) : null },
        { time: new Date().toISOString(), line: fixture.sportsbooks && fixture.sportsbooks[0] ? fixture.sportsbooks[0].currentLine : null }
      ];
    });

    res.json(results);
  } catch (err) {
    console.error(err && err.stack ? err.stack : err);
    res.status(500).json({ error: 'Failed to fetch odds' });
  }
};
