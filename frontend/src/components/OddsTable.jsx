import React from "react";

export default function OddsTable({ odds = [] }) {
  if (!Array.isArray(odds) || odds.length === 0) {
    return <p className="text-center text-gray-400">No games available right now.</p>;
  }

  return (
    <table className="w-full border-collapse text-sm sm:text-base">
      <thead>
        <tr className="bg-green-700 text-white">
          <th className="p-2 text-left">Matchup</th>
          <th className="p-2 text-left">Best Home Odds</th>
          <th className="p-2 text-left">Best Away Odds</th>
          <th className="p-2 text-left">Top Bookmaker</th>
          <th className="p-2 text-left">Start Time (UTC)</th>
        </tr>
      </thead>
      <tbody>
        {odds.map((game) => {
          // Flatten all bookmakers' outcomes
          const allOutcomes = game.bookmakers?.flatMap((b) =>
            b.markets?.flatMap((m) =>
              m.outcomes?.map((o) => ({
                bookmaker: b.title,
                name: o.name,
                price: o.price,
              }))
            )
          ).filter(Boolean) || [];

          // Find odds for home and away teams
          const homeOutcomes = allOutcomes.filter(
            (o) => o.name === game.home_team
          );
          const awayOutcomes = allOutcomes.filter(
            (o) => o.name === game.away_team
          );

          // Pick best odds for each side
          const bestHome = homeOutcomes.length
            ? homeOutcomes.reduce((a, b) => (a.price > b.price ? a : b))
            : null;
          const bestAway = awayOutcomes.length
            ? awayOutcomes.reduce((a, b) => (a.price > b.price ? a : b))
            : null;

          return (
            <tr key={game.id} className="border-b border-gray-700 hover:bg-gray-800">
              <td className="p-2">
                <div className="font-semibold">{game.home_team}</div>
                <div className="text-gray-400 text-sm">vs {game.away_team}</div>
              </td>
              <td className="p-2 text-green-300">
                {bestHome ? bestHome.price.toFixed(2) : "—"}
              </td>
              <td className="p-2 text-green-300">
                {bestAway ? bestAway.price.toFixed(2) : "—"}
              </td>
              <td className="p-2">
                {bestHome?.bookmaker || bestAway?.bookmaker || "—"}
              </td>
              <td className="p-2 text-gray-400">
                {new Date(game.commence_time).toLocaleString("en-US", {
                  dateStyle: "short",
                  timeStyle: "short",
                })}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
