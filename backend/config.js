// Backend Server Configuration
// Supports: Leaderboard, Analytics, Multi-profile, Auth

const PORT = process.env.PORT || 5000;
const DB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hashempire';
const NODE_ENV = process.env.NODE_ENV || 'development';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';

module.exports = {
    port: PORT,
    dbUri: DB_URI,
    nodeEnv: NODE_ENV,
    jwtSecret: JWT_SECRET,
    corsOrigin: CORS_ORIGIN,
    
    // Game Configurations per Empire
    empires: {
        syndicate: {
            name: 'The Syndicate',
            emoji: '👁️',
            currency: 'HU',
            tier_count: 33,
            base_click_power: 1,
            dopamine_multiplier: 1.2
        },
        nexus: {
            name: 'Nexus Corp',
            emoji: '💠',
            currency: 'CR',
            tier_count: 33,
            base_click_power: 0.8,
            dopamine_multiplier: 0.9
        },
        verdant: {
            name: 'Verdant Flow',
            emoji: '🌿',
            currency: 'LF',
            tier_count: 33,
            base_click_power: 0.5,
            dopamine_multiplier: 0.7
        }
    },

    // API Rate Limiting
    rateLimit: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        maxRequests: 100
    },

    // Leaderboard Config
    leaderboard: {
        topPlayers: 100,
        updateInterval: 60000, // 1 minute
        ttl: 24 * 60 * 60 // 24 hours cache
    },

    // Analytics Config
    analytics: {
        maxEntriesPerUser: 1000,
        aggregationInterval: 3600000, // 1 hour
        retention: 90 // days
    }
};
