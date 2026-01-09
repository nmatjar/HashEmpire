# HashEmpire Backend - Universal Server

Uniwersalny backend dla **HashEmpire** wspierający:
- 🏆 Leaderboard (top players, rankings, kategorie)
- 📊 Analytics (player behavior tracking, export)
- 👥 Player Profiles (multi-profile support, ProfileCoder)
- 🎮 Multi-Empire (Syndicate, Nexus, Verdant configs)

## 🚀 Quick Start

### Installation
```bash
cd backend
npm install
```

### Development (Local)
```bash
npm run dev
```

Server będzie dostępny na `http://localhost:5000`

### Production
```bash
npm start
```

## 📋 Environment Variables

Stwórz `.env` plik w `backend/`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/hashempire
JWT_SECRET=your-secret-key-change-in-production
CORS_ORIGIN=http://localhost:3000
```

## 🔗 API Endpoints

### Health Check
```
GET /health
→ { status: "ok", uptime: ..., environment: "development" }
```

### Leaderboard

**Get Top Players**
```
GET /api/leaderboard?limit=100&empire=syndicate
→ { success: true, data: [...], count: 50 }
```

**Get Player Rank**
```
GET /api/leaderboard/:playerId
→ { success: true, data: { player: {...}, rank: 42, totalPlayers: 1000, neighbors: [...] } }
```

**Get Category Leaderboard**
```
GET /api/leaderboard/category/maxCPS?limit=50
→ { success: true, data: [...], category: "maxCPS", count: 50 }
```

Valid categories:
- `maxHU` - Highest Hash Units
- `maxCPS` - Highest Clicks Per Second
- `prestigeLevel` - Highest Prestige Levels
- `totalClicks` - Total Clicks Count

**Add Score**
```
POST /api/scores
Body: {
  "playerId": "player123",
  "stats": {
    "maxHU": 1000000,
    "maxCPS": 15,
    "prestigeLevel": 3,
    "totalClicks": 50000,
    "empire": "syndicate"
  }
}
→ { success: true, data: {...} }
```

### Analytics

**Submit Analytics**
```
POST /api/analytics
Body: {
  "playerId": "player123",
  "data": {
    "playerChoices": [...],
    "upgradePatterns": [...],
    "sessionDuration": 3600,
    "riskTolerance": 0.7
  }
}
→ { success: true, message: "Analytics recorded" }
```

**Get Player Analytics**
```
GET /api/analytics/:playerId
→ { success: true, data: {...} }
```

### Player Profiles

**Create/Update Profile**
```
POST /api/players
Body: {
  "playerId": "player123",
  "profile": {
    "username": "EchoMind",
    "empire": "nexus",
    "psychometrics": {
      "dopamineSensitivity": 0.8,
      "riskTolerance": 0.6,
      "attentionSpan": 0.7
    }
  }
}
→ { success: true, data: {...} }
```

**Get Player Profile**
```
GET /api/players/:playerId
→ { success: true, data: {...} }
```

### Empire Configuration

**List All Empires**
```
GET /api/empires
→ { success: true, data: { syndicate: {...}, nexus: {...}, verdant: {...} }, count: 3 }
```

**Get Empire Config**
```
GET /api/empires/syndicate
→ { success: true, data: { name: "The Syndicate", emoji: "👁️", currency: "HU", ... } }
```

## 🏗️ Architecture

```
backend/
├── server.js          # Main Express app + routes
├── config.js          # Configuration (DB, empires, limits)
├── leaderboard.js     # Leaderboard service (pluggable)
├── package.json       # Dependencies
├── .env.example       # Env template
└── README.md          # This file
```

### Data Layer Abstraction

`leaderboard.js` używa interfejsu `dataLayer` — łatwo zamienialne:

**Current:** Memory (mock)  
**Available:** MongoDB, Supabase, Firebase  
**Custom:** Implementuj interfejs `{ find(), upsert() }`

```javascript
// Example: Switch to MongoDB
const mongoose = require('mongoose');
class MongoDataLayer {
    async find(collection, query, options) {
        return await mongoose.model(collection).find(query).sort(options.sort).limit(options.limit);
    }
    async upsert(collection, query, data) {
        return await mongoose.model(collection).findOneAndUpdate(query, data, { upsert: true });
    }
}
```

## 📊 Database Schema (MongoDB)

### Leaderboard Collection
```javascript
{
  playerId: String,
  maxHU: Number,
  maxCPS: Number,
  prestigeLevel: Number,
  totalClicks: Number,
  empire: String,
  rank: Number,
  timestamp: Date
}
```

### Analytics Collection
```javascript
{
  playerId: String,
  playerChoices: Array,
  upgradePatterns: Array,
  eventResponses: Array,
  sessionDuration: Number,
  riskTolerance: Number,
  timestamp: Date
}
```

### Players Collection
```javascript
{
  playerId: String,
  username: String,
  empire: String,
  psychometrics: {
    dopamineSensitivity: Number,
    riskTolerance: Number,
    attentionSpan: Number
  },
  createdAt: Date
}
```

## 🔐 Security

- ✅ Helmet: HTTP headers protection
- ✅ CORS: Configurable origins
- ✅ Input validation: JSON schema
- ✅ Rate limiting: Configurable
- ⚠️ JWT: TODO (add authentication)
- ⚠️ DB encryption: TODO (for production)

## 🧪 Testing

```bash
npm test
```

## 🚢 Deployment

### Heroku
```bash
heroku create hashempire-api
git push heroku main
heroku config:set MONGODB_URI=your-mongo-uri
heroku open
```

### AWS Lambda + API Gateway
- Ref: `serverless.yml` (TODO)

### Docker
```bash
docker build -t hashempire-backend .
docker run -p 5000:5000 --env-file .env hashempire-backend
```

## 📝 Future Enhancements

- [ ] MongoDB integration (swap mock data layer)
- [ ] JWT authentication
- [ ] WebSocket real-time leaderboard updates
- [ ] Guilds / Clans system
- [ ] Competitive events API
- [ ] Social features (friends, challenges)
- [ ] Advanced analytics (cohort analysis, retention)
- [ ] Admin dashboard
- [ ] A/B testing framework

## 📞 Support

**Issues?** Check `/health` endpoint first.

```bash
curl http://localhost:5000/health
```

---

**Last Updated:** 2026-01-09  
**Maintained by:** Oriental Group 👁️
