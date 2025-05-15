const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const Search = require('../models/search'); 

router.get('/top-searches', async (req, res) => {
  try {
    const topSearches = await Search.aggregate([
      { $group: { _id: '$query', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);
    res.json(topSearches.map(item => item._id));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch top searches' });
  }
});

router.get('/history', async (req, res) => {
  if (!req.user || !req.user._id) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  try {
    const history = await Search.find({ userId: req.user._id })
      .sort({ date: -1 })
      .limit(10);

    res.json(history.map(item => item.query));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch search history' });
  }
});

// Unsplash Image Search
router.get('/images', async (req, res) => {
  const query = req.query.query || 'random';
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;

  try {
    const unsplashRes = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=10&client_id=${accessKey}`);
    const data = await unsplashRes.json();

    const images = data.results.map(img => ({
      url: img.urls.small,
      alt: img.alt_description,
      author: img.user.name,
    }));

    if (req.user && query.toLowerCase() !== 'random') {
      try {
        await Search.create({ userId: req.user._id, query, date: new Date() });
      } catch (err) {
        console.error('Failed to save search:', err);
      }
    }

    res.json(images);
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({ error: 'Failed to fetch images' });
  }
});

module.exports = router;
