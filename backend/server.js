import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("CasualOdds Backend is running");
});

app.get("/api/odds", async (req, res) => {
  const { q = "", league = "", market = "h2h", page = 1 } = req.query;

  try {
    const apiKey = process.env.THE_ODDS_API_KEY;
    if (!apiKey) {
      throw new Error("Missing THE_ODDS_API_KEY in environment variables");
    }

    const sport = league || "upcoming";
    const url = `https://api.the-odds-api.com/v4/sports/${sport}/odds/?regions=us&markets=${market}&oddsFormat=decimal&apiKey=${apiKey}`;

    const response = await axios.get(url);
    res.json({ odds: response.data });
  } catch (error) {
    console.error("Odds API error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch odds" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
