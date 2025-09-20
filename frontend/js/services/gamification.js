class GamificationService {
    constructor() {
        this.achievements = {
            waste_classification: [
                { id: 'first_scan', title: 'First Scan', points: 50, icon: '🔍', description: 'Classify your first waste item' },
                { id: 'recycling_pro', title: 'Recycling Pro', points: 200, icon: '♻️', description: 'Classify 50 items correctly' },
                { id: 'waste_master', title: 'Waste Master', points: 500, icon: '👑', description: 'Achieve 100 correct classifications' }
            ],
            carbon_reduction: [
                { id: 'carbon_aware', title: 'Carbon Aware', points: 100, icon: '🌱', description: 'Complete your first carbon footprint calculation' },
                { id: 'eco_warrior', title: 'Eco Warrior', points: 300, icon: '⚔️', description: 'Reduce your carbon footprint by 20%' },
                { id: 'planet_savior', title: 'Planet Savior', points: 1000, icon: '🌍', description: 'Maintain low carbon footprint for 30 days' }
            ],
            challenges: [
                { id: 'challenge_starter', title: 'Challenge Accepted', points: 75, icon: '🎯', description: 'Complete your first eco challenge' },
                { id: 'challenge_master', title: 'Challenge Master', points: 400, icon: '🏆', description: 'Complete 10 eco challenges' },
                { id: 'community_leader', title: 'Community Leader', points: 800, icon: '👥', description: 'Lead a community challenge' }
            ]
        };
        
        this.levels = [
            { level: 1, pointsNeeded: 0, title: 'Eco Novice' },
            { level: 2, pointsNeeded: 100, title: 'Green Apprentice' },
            { level: 3, pointsNeeded: 300, title: 'Sustainability Scout' },
            { level: 4, pointsNeeded: 600, title: 'Earth Guardian' },
            { level: 5, pointsNeeded: 1000, title: 'Environmental Elite' }
        ];

        this.loadUserProgress();
    }

    loadUserProgress() {
        this.progress = JSON.parse(localStorage.getItem('ecoProgress')) || {
            points: 0,
            level: 1,
            achievements: [],
            history: [],
            streaks: {
                current: 0,
                longest: 0,
                lastActivity: null
            }
        };
    }

    saveProgress() {
        localStorage.setItem('ecoProgress', JSON.stringify(this.progress));
        this.updateUI();
    }

    addPoints(points, activity) {
        this.progress.points += points;
        this.progress.history.push({
            timestamp: new Date(),
            activity: activity,
            points: points
        });
        
        this.updateStreak();
        this.checkLevelUp();
        this.checkAchievements();
        this.saveProgress();
    }

    updateStreak() {
        const today = new Date().toDateString();
        const lastActivity = this.progress.streaks.lastActivity;
        
        if (lastActivity) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            
            if (new Date(lastActivity).toDateString() === yesterday.toDateString()) {
                this.progress.streaks.current++;
                this.progress.streaks.longest = Math.max(this.progress.streaks.current, this.progress.streaks.longest);
            } else if (new Date(lastActivity).toDateString() !== today) {
                this.progress.streaks.current = 1;
            }
        } else {
            this.progress.streaks.current = 1;
        }
        
        this.progress.streaks.lastActivity = today;
    }

    checkLevelUp() {
        const currentLevel = this.levels.find(l => l.level === this.progress.level);
        const nextLevel = this.levels.find(l => l.level === this.progress.level + 1);
        
        if (nextLevel && this.progress.points >= nextLevel.pointsNeeded) {
            this.progress.level++;
            this.showLevelUpNotification(nextLevel);
        }
    }

    checkAchievements() {
        const allAchievements = [
            ...this.achievements.waste_classification,
            ...this.achievements.carbon_reduction,
            ...this.achievements.challenges
        ];

        allAchievements.forEach(achievement => {
            if (!this.progress.achievements.includes(achievement.id)) {
                if (this.hasMetAchievementCriteria(achievement)) {
                    this.unlockAchievement(achievement);
                }
            }
        });
    }

    hasMetAchievementCriteria(achievement) {
        // Implement specific criteria checks based on achievement ID
        const stats = this.getActivityStats();
        
        switch(achievement.id) {
            case 'first_scan':
                return stats.totalScans > 0;
            case 'recycling_pro':
                return stats.totalScans >= 50;
            case 'carbon_aware':
                return stats.carbonCalculations > 0;
            // Add more achievement criteria
            default:
                return false;
        }
    }

    unlockAchievement(achievement) {
        this.progress.achievements.push(achievement.id);
        this.addPoints(achievement.points, `Achievement: ${achievement.title}`);
        this.showAchievementNotification(achievement);
    }

    getActivityStats() {
        return {
            totalScans: this.progress.history.filter(h => h.activity.includes('waste_scan')).length,
            carbonCalculations: this.progress.history.filter(h => h.activity.includes('carbon_calc')).length,
            challengesCompleted: this.progress.history.filter(h => h.activity.includes('challenge')).length
        };
    }

    showLevelUpNotification(newLevel) {
        const toast = document.createElement('div');
        toast.className = 'toast toast--success';
        toast.innerHTML = `
            <i class="fas fa-level-up-alt"></i>
            <div>
                <strong>Level Up!</strong>
                <p>You've reached level ${newLevel.level}: ${newLevel.title}</p>
            </div>
        `;
        document.querySelector('.toast-container').appendChild(toast);
        setTimeout(() => toast.remove(), 5000);
    }

    showAchievementNotification(achievement) {
        const toast = document.createElement('div');
        toast.className = 'toast toast--achievement';
        toast.innerHTML = `
            <span class="achievement-icon">${achievement.icon}</span>
            <div>
                <strong>${achievement.title} Unlocked!</strong>
                <p>+${achievement.points} points - ${achievement.description}</p>
            </div>
        `;
        document.querySelector('.toast-container').appendChild(toast);
        setTimeout(() => toast.remove(), 5000);
    }

    updateUI() {
        // Update points display
        const pointsDisplay = document.getElementById('userPoints');
        if (pointsDisplay) {
            pointsDisplay.textContent = this.progress.points;
        }

        // Update level display
        const levelDisplay = document.getElementById('userLevel');
        if (levelDisplay) {
            const currentLevel = this.levels.find(l => l.level === this.progress.level);
            levelDisplay.textContent = currentLevel.title;
        }

        // Update streak display
        const streakDisplay = document.getElementById('currentStreak');
        if (streakDisplay) {
            streakDisplay.textContent = this.progress.streaks.current;
        }
    }
}

export const gamification = new GamificationService();