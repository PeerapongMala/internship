class LevelSystem {
  constructor(baseXP = 100, growthFactor = 1.5) {
    this.level = 1;
    this.xp = 0;
    this.baseXP = baseXP;
    this.growthFactor = growthFactor;
  }

  getXPForNextLevel() {
    return Math.floor(this.baseXP * Math.pow(this.growthFactor, this.level - 1));
  }

  addXP(amount) {
    this.xp += amount;
    while (this.xp >= this.getXPForNextLevel()) {
      this.levelUp();
    }
  }

  levelUp() {
    this.xp -= this.getXPForNextLevel();
    this.level++;
    console.log(`Congratulations! You've reached level ${this.level}!`);
  }

  getProgress() {
    const nextLevelXP = this.getXPForNextLevel();
    return {
      level: this.level,
      xp: this.xp,
      nextLevelXP: nextLevelXP,
      progress: ((this.xp / nextLevelXP) * 100).toFixed(2) + '%',
    };
  }
}
