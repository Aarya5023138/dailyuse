const mongoose = require('mongoose');

const gamificationSchema = new mongoose.Schema({
  totalXP: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  lastActiveDate: { type: Date },
  tasksCompleted: { type: Number, default: 0 },
  diaryEntries: { type: Number, default: 0 },
  achievements: [{
    name: { type: String },
    description: { type: String },
    icon: { type: String },
    unlockedAt: { type: Date, default: Date.now },
  }],
}, { timestamps: true });

// Calculate level from XP
gamificationSchema.methods.calculateLevel = function() {
  this.level = Math.floor(this.totalXP / 100) + 1;
  return this.level;
};

// Check and update streak
gamificationSchema.methods.updateStreak = function() {
  const now = new Date();
  const lastActive = this.lastActiveDate ? new Date(this.lastActiveDate) : null;
  
  if (!lastActive) {
    this.currentStreak = 1;
  } else {
    const diffDays = Math.floor((now - lastActive) / (1000 * 60 * 60 * 24));
    if (diffDays === 1) {
      this.currentStreak += 1;
    } else if (diffDays > 1) {
      this.currentStreak = 1;
    }
  }
  
  if (this.currentStreak > this.longestStreak) {
    this.longestStreak = this.currentStreak;
  }
  
  this.lastActiveDate = now;
  return this.currentStreak;
};

module.exports = mongoose.model('Gamification', gamificationSchema);
