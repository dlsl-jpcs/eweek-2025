const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 5000;
const Score = require('./models/Score');
const cors = require('cors');

app.use(cors());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.error('Error connecting to MongoDB Atlas:', err));

app.use(express.json());

app.use(express.static(path.join(__dirname, '../client/dist')));

app.post('/api/scores', async (req, res) => {
  try {
    const { name, score } = req.body;
    if (!name || typeof score !== 'number') {
      return res.status(400).json({ error: 'Name and score are required.' });
    }
    const newScore = new Score({ name, score });
    await newScore.save();
    res.status(201).json({ message: 'Score saved successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save score.' });
  }
});

app.get('/api/leaderboard', async (req, res) => {
  try {
    const topScores = await Score.find().sort({ score: -1, createdAt: 1 }).limit(10);
    res.json(topScores);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch leaderboard.' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
