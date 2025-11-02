require('dotenv').config();
const express = require('express');
const cors = require('cors');
const oddsRouter = require('./routes/odds');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/odds', oddsRouter);

// lightweight health check
app.get('/health', (req,res) => res.json({status:'ok'}));

app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
