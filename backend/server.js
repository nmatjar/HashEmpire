// Express Server - Universal Backend for HashEmpire
// Routes: Leaderboard, Analytics, Player Profiles, Multi-empire Support

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();
const { Redis } = require('@upstash/redis');
const { createClient } = require('@supabase/supabase-js');

const config = require('./config');

// Initialize Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Initialize Redis
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// Initialize Express app
const app = express();

// Middleware
app.use(helmet());
app.use(morgan('combined'));
app.use(cors());
app.use(express.json());

// ==================== HEALTH CHECK ====================
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: config.nodeEnv
    });
});

// ==================== LEADERBOARD ROUTES ====================

/**
 * POST /api/scores
 * Add/update player score
 */
app.post('/api/scores', async (req, res) => {
    try {
        const { playerId, stats } = req.body;
        if (!playerId || !stats) {
            return res.status(400).json({ error: 'Missing playerId or stats' });
        }

        if (stats.illuminationLevel < 10) {
            // Shadow Buffer: Store in Redis
            await redis.zadd('leaderboard:shadow', { score: stats.maxHU, member: playerId });
            await redis.set(`player:${playerId}`, JSON.stringify(stats));
            res.json({ success: true, message: 'Score updated in Shadow Buffer' });
        } else {
            // Architect Level: Store in Supabase
            const redisData = await redis.get(`player:${playerId}`);
            if (redisData) {
                // Migrate from Redis to Supabase
                const playerData = JSON.parse(redisData);
                await supabase.from('players').upsert({ player_id: playerId, stats: playerData, updated_at: new Date() });
                await redis.del(`player:${playerId}`);
                await redis.zrem('leaderboard:shadow', playerId);
            }
            const { data, error } = await supabase.from('players').upsert({ player_id: playerId, stats, updated_at: new Date() });
            if (error) throw error;
            res.json({ success: true, data });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * GET /api/leaderboard
 * Get top players globally
 */
app.get('/api/leaderboard', async (req, res) => {
    try {
        const limit = Math.min(parseInt(req.query.limit) || 100, 500);
        
        // Get from both sources
        const shadowPlayers = await redis.zrevrange('leaderboard:shadow', 0, limit - 1, { withScores: true });
        const { data: architectPlayers, error } = await supabase.from('players').select('*').order('stats->>maxHU', { ascending: false }).limit(limit);
        if (error) throw error;
        
        const combined = [];
        for (let i = 0; i < shadowPlayers.length; i += 2) {
            const playerStats = await redis.get(`player:${shadowPlayers[i]}`);
            if (playerStats) {
                combined.push({ playerId: shadowPlayers[i], ...JSON.parse(playerStats), maxHU: shadowPlayers[i+1] });
            }
        }
        
        architectPlayers.forEach(p => {
            combined.push({ playerId: p.player_id, ...p.stats, maxHU: p.stats.maxHU });
        });
        
        // Sort and slice
        combined.sort((a, b) => b.maxHU - a.maxHU);
        const rankedPlayers = combined.slice(0, limit).map((p, i) => ({
            ...p,
            rank: i + 1
        }));

        res.json({ success: true, data: rankedPlayers, count: rankedPlayers.length });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * GET /api/leaderboard/:playerId
 * Get player's rank and position
 */
app.get('/api/leaderboard/:playerId', async (req, res) => {
    try {
        const { playerId } = req.params;
        const { data: allPlayers, error } = await supabase.from('players').select('*').order('stats->>maxHU', { ascending: false });
        if (error) throw error;
        
        const playerIndex = allPlayers.findIndex(p => p.player_id === playerId);

        if (playerIndex === -1) {
            // Check shadow buffer
            const rank = await redis.zrevrank('leaderboard:shadow', playerId);
            if (rank === null) {
                return res.status(404).json({ error: 'Player not found' });
            }
            const stats = await redis.get(`player:${playerId}`);
            const range = 5;
            const neighbors = await redis.zrevrange('leaderboard:shadow', Math.max(0, rank - range), rank + range, { withScores: true });
            
            const neighborData = [];
            for (let i = 0; i < neighbors.length; i += 2) {
                const neighborStats = await redis.get(`player:${neighbors[i]}`);
                neighborData.push({
                    playerId: neighbors[i],
                    ...JSON.parse(neighborStats),
                    rank: await redis.zrevrank('leaderboard:shadow', neighbors[i]) + 1,
                    maxHU: neighbors[i+1]
                });
            }

            return res.json({ success: true, data: {
                player: { playerId, ...JSON.parse(stats) },
                rank: rank + 1,
                totalPlayers: await redis.zcard('leaderboard:shadow'),
                neighbors: neighborData
            }});
        }
        
        const range = 5;
        const neighbors = allPlayers.slice(
            Math.max(0, playerIndex - range),
            Math.min(allPlayers.length, playerIndex + range + 1)
        ).map((p, i) => ({
            ...p.stats,
            playerId: p.player_id,
            rank: Math.max(0, playerIndex - range) + i + 1
        }));

        res.json({ success: true, data: {
            player: { playerId: allPlayers[playerIndex].player_id, ...allPlayers[playerIndex].stats },
            rank: playerIndex + 1,
            totalPlayers: allPlayers.length,
            neighbors
        } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * GET /api/leaderboard/category/:category
 * Get leaderboard by category (CPS, Prestige, etc.)
 */
app.get('/api/leaderboard/category/:category', async (req, res) => {
    try {
        const { category } = req.params;
        const limit = Math.min(parseInt(req.query.limit) || 50, 500);
        
        const validCategories = ['maxHU', 'maxCPS', 'prestigeLevel', 'totalClicks'];
        if (!validCategories.includes(category)) {
            return res.status(400).json({ error: 'Invalid category' });
        }

        const { data: players, error } = await supabase.from('players').select('*').order(`stats->>${category}`, { ascending: false }).limit(limit);
        if (error) throw error;

        const rankedPlayers = players.map((p, i) => ({
            ...p.stats,
            playerId: p.player_id,
            rank: i + 1
        }));
        res.json({ success: true, data: rankedPlayers, category, count: rankedPlayers.length });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ==================== ANALYTICS ROUTES ====================

/**
 * POST /api/analytics
 * Submit player analytics data
 */
app.post('/api/analytics', async (req, res) => {
    try {
        const { playerId, data } = req.body;
        if (!playerId || !data) {
            return res.status(400).json({ error: 'Missing playerId or data' });
        }

        // Validate data limits
        if (data.playerChoices && data.playerChoices.length > config.analytics.maxEntriesPerUser) {
            data.playerChoices = data.playerChoices.slice(-config.analytics.maxEntriesPerUser);
        }

        const { data: result, error } = await supabase.from('analytics').upsert({ player_id: playerId, data, updated_at: new Date() });
        if (error) throw error;

        res.json({ success: true, message: 'Analytics recorded' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * GET /api/analytics/:playerId
 * Get player's analytics summary
 */
app.get('/api/analytics/:playerId', async (req, res) => {
    try {
        const { playerId } = req.params;
        const { data: analytics, error } = await supabase.from('analytics').select('*').eq('player_id', playerId).single();
        if (error) throw error;
        
        if (!analytics) {
            return res.status(404).json({ error: 'No analytics found' });
        }

        res.json({ success: true, data: analytics });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ==================== PLAYER PROFILE ROUTES ====================

/**
 * POST /api/players
 * Create/update player profile
 */
app.post('/api/players', async (req, res) => {
    try {
        const { playerId, profile } = req.body;
        if (!playerId || !profile) {
            return res.status(400).json({ error: 'Missing playerId or profile' });
        }

        const { data, error } = await supabase.from('players').upsert({ player_id: playerId, stats: profile, updated_at: new Date() });
        if (error) throw error;

        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * GET /api/players/:playerId
 * Get player profile
 */
app.get('/api/players/:playerId', async (req, res) => {
    try {
        const { playerId } = req.params;
        const { data: player, error } = await supabase.from('players').select('*').eq('player_id', playerId).single();
        if (error) throw error;
        
        if (!player) {
            return res.status(404).json({ error: 'Player not found' });
        }

        res.json({ success: true, data: player });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ==================== EMPIRE CONFIG ROUTES ====================

/**
 * GET /api/empires
 * Get available empires and configurations
 */
app.get('/api/empires', (req, res) => {
    res.json({
        success: true,
        data: config.empires,
        count: Object.keys(config.empires).length
    });
});

/**
 * GET /api/empires/:empireKey
 * Get specific empire configuration
 */
app.get('/api/empires/:empireKey', (req, res) => {
    const { empireKey } = req.params;
    const empire = config.empires[empireKey];
    
    if (!empire) {
        return res.status(404).json({ error: 'Empire not found' });
    }

    res.json({ success: true, data: empire });
});

// ==================== ERROR HANDLING ====================

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Internal Server Error',
        message: config.nodeEnv === 'development' ? err.message : undefined
    });
});

app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});


module.exports = app;
