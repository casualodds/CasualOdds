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
  const { q = "", league = "", market = "all", page = 1 } = req.query;

  try {
    const apiKey = process.env.THE_ODDS_API_KEY;
    if (!apiKey) {
      throw new Error("Missing THE_ODDS_API_KEY in environment variables");
    }

    const sport = league || "upcoming";

    // Determine which markets to fetch
    const marketsToFetch =
      market === "all" ? ["h2h", "spreads", "totals"] : [market];

    // Fetch all markets in parallel
    const requests = marketsToFetch.map((mkt) =>
      axios.get(
        `https://api.the-odds-api.com/v4/sports/${sport}/odds/?regions=us&markets=${mkt}&oddsFormat=decimal&apiKey=${apiKey}`
      )
    );

    const responses = await Promise.allSettled(requests);

    // Merge all valid responses
    const combinedData = responses
      .filter((r) => r.status === "fulfilled")
      .flatMap((r) => r.value.data);

    // If all failed, return an error
    if (combinedData.length === 0) {
      throw new Error("All market requests failed");
    }

    res.json({ odds: combinedData });
  } catch (error) {
    console.error("Odds API error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch odds" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
