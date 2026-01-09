// Leaderboard Service - Handles player rankings and scores
// Supports: Local storage, MongoDB, Supabase (pluggable)

class LeaderboardService {
    constructor(dataLayer) {
        this.dataLayer = dataLayer; // Abstracted storage: mongo, supabase, memory, etc.
        this.cache = new Map();
    }

    /**
     * Add or update player score
     * @param {string} playerId - Unique player identifier
     * @param {object} stats - Player statistics {maxHU, maxCPS, prestigeLevel, totalClicks, empire}
     * @returns {Promise<object>} - Updated leaderboard entry
     */
    async addScore(playerId, stats) {
        const entry = {
            playerId,
            ...stats,
            timestamp: Date.now(),
            rank: 0
        };

        const result = await this.dataLayer.upsert('leaderboard', { playerId }, entry);
        this.cache.delete('global'); // Invalidate cache
        return result;
    }

    /**
     * Get top N players globally
     * @param {number} limit - How many top players to return (default 100)
     * @param {string} empire - Filter by empire (optional)
     * @returns {Promise<array>} - Top players with ranks
     */
    async getTopPlayers(limit = 100, empire = null) {
        const cacheKey = `global_${empire || 'all'}`;
        
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        let query = {};
        if (empire) query.empire = empire;

        const players = await this.dataLayer.find(
            'leaderboard',
            query,
            { sort: { maxHU: -1 }, limit }
        );

        // Add ranks
        const ranked = players.map((p, i) => ({
            ...p,
            rank: i + 1
        }));

        this.cache.set(cacheKey, ranked);
        return ranked;
    }

    /**
     * Get player's rank and surrounding competitors
     * @param {string} playerId - Player identifier
     * @param {number} range - How many players around rank (default 5)
     * @returns {Promise<object>} - Player rank data + neighbors
     */
    async getPlayerRank(playerId, range = 5) {
        const topPlayers = await this.getTopPlayers(1000); // Fetch enough to find player
        const playerIndex = topPlayers.findIndex(p => p.playerId === playerId);

        if (playerIndex === -1) {
            return { error: 'Player not found' };
        }

        const neighbors = topPlayers.slice(
            Math.max(0, playerIndex - range),
            Math.min(topPlayers.length, playerIndex + range + 1)
        );

        return {
            player: topPlayers[playerIndex],
            rank: playerIndex + 1,
            totalPlayers: topPlayers.length,
            neighbors
        };
    }

    /**
     * Get leaderboard by category (CPS, Prestige, etc.)
     * @param {string} category - 'maxCPS' | 'maxHU' | 'prestigeLevel' | 'totalClicks'
     * @returns {Promise<array>} - Top players for category
     */
    async getLeaderboardByCategory(category = 'maxHU', limit = 50) {
        const cacheKey = `category_${category}`;
        
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        const players = await this.dataLayer.find(
            'leaderboard',
            {},
            { sort: { [category]: -1 }, limit }
        );

        const ranked = players.map((p, i) => ({
            ...p,
            rank: i + 1
        }));

        this.cache.set(cacheKey, ranked);
        return ranked;
    }

    /**
     * Clear cache (trigger after updates)
     */
    clearCache() {
        this.cache.clear();
    }
}

module.exports = LeaderboardService;
