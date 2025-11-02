# CasualOdds

A deploy-ready sportsbook comparison tool (frontend + backend) featuring:
- Live odds (TheOddsAPI) with caching
- Moneyline, spreads, totals, and player prop markets
- Best line highlights, animations, line history charts
- Sticky header, search, debounce, league and market filters
- Pinned favorites (localStorage), dark mode, compact mode
- Backend suitable for deployment on Render, frontend on Vercel

## How to run locally

### Backend
1. cd backend
2. copy .env.template to .env and add THE_ODDS_API_KEY
3. npm install
4. npm start

### Frontend
1. cd frontend
2. copy .env.template to .env and set VITE_API_BASE to http://localhost:5000
3. npm install
4. npm run dev

Deploy backend to Render and frontend to Vercel. Configure VITE_API_BASE to your deployed backend URL.
