app.get("/api/odds", async (req, res) => {
  const axios = await import("axios");
  const { q = "", league = "", market = "h2h", page = 1 } = req.query;

  try {
    const apiKey = process.env.ODDS_API_KEY;
    const url = `https://api.the-odds-api.com/v4/sports/${league || "upcoming"}/odds/?regions=us&markets=${market}&oddsFormat=decimal&apiKey=${apiKey}`;
    
    const response = await axios.default.get(url);
    const data = response.data;

    res.json({ odds: data });
  } catch (error) {
    console.error("Odds API error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch real odds" });
  }
});
