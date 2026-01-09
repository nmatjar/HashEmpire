// Backend API Client for HashEmpire Frontend
// Usage: Leaderboard fetching, score submission, analytics tracking

class BackendClient {
    constructor(baseUrl = '') {
        this.baseUrl = baseUrl;
        this.playerId = this.generatePlayerId();
        this.isConnected = false;
    }

    /**
     * Generate unique player ID (or load from localStorage)
     */
    generatePlayerId() {
        let id = localStorage.getItem('playerIdHashEmpire');
        if (!id) {
            id = `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            localStorage.setItem('playerIdHashEmpire', id);
        }
        return id;
    }

    /**
     * Check backend connection
     */
    async connect() {
        try {
            const res = await fetch(`${this.baseUrl}/health`);
            if (res.ok) {
                this.isConnected = true;
                console.log('✅ Backend connected');
                return true;
            }
        } catch (err) {
            console.warn('⚠️ Backend unavailable (offline mode)', err.message);
            this.isConnected = false;
        }
        return false;
    }

    /**
     * Submit player score to leaderboard
     */
    async submitScore(stats) {
        if (!this.isConnected) return false;

        try {
            const res = await fetch(`${this.baseUrl}/api/scores`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    playerId: this.playerId,
                    stats: {
                        maxHU: stats.hashUnits || 0,
                        maxCPS: stats.displayedCPS || 0,
                        prestigeLevel: stats.prestigeLevel || 0,
                        totalClicks: stats.totalClicks || 0,
                        empire: stats.empire || 'syndicate',
                        sessionDuration: stats.sessionDuration || 0
                    }
                })
            });

            if (res.ok) {
                const data = await res.json();
                console.log('📤 Score submitted:', data);
                return data;
            }
        } catch (err) {
            console.error('Error submitting score:', err);
        }
        return false;
    }

    /**
     * Get top players leaderboard
     */
    async getLeaderboard(limit = 100, empire = null) {
        if (!this.isConnected) return null;

        try {
            let url = `${this.baseUrl}/api/leaderboard?limit=${limit}`;
            if (empire) url += `&empire=${empire}`;

            const res = await fetch(url);
            if (res.ok) {
                return await res.json();
            }
        } catch (err) {
            console.error('Error fetching leaderboard:', err);
        }
        return null;
    }

    /**
     * Get player's rank and position
     */
    async getPlayerRank() {
        if (!this.isConnected) return null;

        try {
            const res = await fetch(`${this.baseUrl}/api/leaderboard/${this.playerId}`);
            if (res.ok) {
                return await res.json();
            }
        } catch (err) {
            console.error('Error fetching player rank:', err);
        }
        return null;
    }

    /**
     * Get category-specific leaderboard
     */
    async getLeaderboardCategory(category = 'maxCPS', limit = 50) {
        if (!this.isConnected) return null;

        try {
            const res = await fetch(`${this.baseUrl}/api/leaderboard/category/${category}?limit=${limit}`);
            if (res.ok) {
                return await res.json();
            }
        } catch (err) {
            console.error('Error fetching category leaderboard:', err);
        }
        return null;
    }

    /**
     * Submit analytics data
     */
    async submitAnalytics(analyticsData) {
        if (!this.isConnected) return false;

        try {
            const res = await fetch(`${this.baseUrl}/api/analytics`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    playerId: this.playerId,
                    data: analyticsData
                })
            });

            if (res.ok) {
                console.log('📊 Analytics submitted');
                return true;
            }
        } catch (err) {
            console.error('Error submitting analytics:', err);
        }
        return false;
    }

    /**
     * Get player profile
     */
    async getPlayerProfile() {
        if (!this.isConnected) return null;

        try {
            const res = await fetch(`${this.baseUrl}/api/players/${this.playerId}`);
            if (res.ok) {
                return await res.json();
            }
        } catch (err) {
            console.error('Error fetching player profile:', err);
        }
        return null;
    }

    /**
     * Update player profile
     */
    async updatePlayerProfile(profile) {
        if (!this.isConnected) return false;

        try {
            const res = await fetch(`${this.baseUrl}/api/players`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    playerId: this.playerId,
                    profile
                })
            });

            if (res.ok) {
                console.log('👤 Profile updated');
                return true;
            }
        } catch (err) {
            console.error('Error updating profile:', err);
        }
        return false;
    }

    /**
     * Get empire configurations
     */
    async getEmpires() {
        if (!this.isConnected) return null;

        try {
            const res = await fetch(`${this.baseUrl}/api/empires`);
            if (res.ok) {
                return await res.json();
            }
        } catch (err) {
            console.error('Error fetching empires:', err);
        }
        return null;
    }
}

// Export for use in game.js
if (typeof window !== 'undefined') {
    window.BackendClient = BackendClient;
}

module.exports = BackendClient;
