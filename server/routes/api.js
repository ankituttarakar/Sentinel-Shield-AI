const express = require('express');
const router = express.Router();
const Review = require('../models/Review');

// Get System Stats for StatChart.jsx
router.get('/stats', async (req, res) => {
  try {
    const total = await Review.countDocuments();
    // In a real app, you'd scan the text for keywords like "Critical"
    res.json([
      { name: 'Critical', value: 5 },
      { name: 'Warning', value: 12 },
      { name: 'Info', value: total }
    ]);
  } catch (err) {
    res.status(500).send("Stats error");
  }
});

module.exports = router;