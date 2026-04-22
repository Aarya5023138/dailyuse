const express = require('express');
const router = express.Router();
const Gamification = require('../models/Gamification');

// Get gamification stats
router.get('/', async (req, res) => {
  try {
    let stats = await Gamification.findOne();
    if (!stats) {
      stats = await new Gamification().save();
    }
    const xpForNextLevel = (stats.level) * 100;
    const currentLevelXP = stats.totalXP - ((stats.level - 1) * 100);
    res.json({
      ...stats.toObject(),
      xpForNextLevel,
      currentLevelXP,
      xpProgress: Math.round((currentLevelXP / 100) * 100),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reset streaks (for testing)
router.post('/reset', async (req, res) => {
  try {
    let stats = await Gamification.findOne();
    if (!stats) stats = new Gamification();
    stats.currentStreak = 0;
    stats.totalXP = 0;
    stats.level = 1;
    stats.tasksCompleted = 0;
    stats.diaryEntries = 0;
    stats.achievements = [];
    await stats.save();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reset only the streak
router.post('/reset-streak', async (req, res) => {
  try {
    let stats = await Gamification.findOne();
    if (!stats) stats = new Gamification();
    stats.currentStreak = 0;
    await stats.save();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
