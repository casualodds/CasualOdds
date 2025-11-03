app.get("/api/odds", async (req, res) => {
  const axios = await import("axios");
  const { q = "", league = "", market = "h2h", page = 1 } = req.query;

  try {
    const apiKey = process.env.THE_ODDS_API_KEY;
    if (!apiKey) {
      throw new Error("Missing THE_ODDS_API_KEY in environment variables");
    }

    // If no league is selected, use "upcoming" to get general events
    const sport = league || "upcoming";

    const url = `https://api.the-odds-api.com/v4/sports/${sport}/odds/?regions=us&markets=${market}&oddsFormat=decimal&apiKey=${apiKey}`;

    const response = await axios.default.get(url);
    res.json({ odds: response.data });
  } catch (error) {
    console.error("Odds API error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch odds" });
  }
});
