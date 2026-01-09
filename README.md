# Hashish Empire: The Illumination Clicker - Complete RPA Platform

## 🌿 Project Overview

**Hashish Empire** is a revolutionary Reality Game Platform (RPA) combining addictive clicker gameplay with sophisticated business intelligence analytics. Built as per the Game Design Document (GDD) and PROJECT ORIENTAL specifications from `instrukcja.ai`.

**Key Features:**
- 33 Illumination Levels across 6 progression tiers
- Advanced terminal interface (Ctrl+`) with fleet management & hacking
- Achievement system with 25+ tiered achievements & notifications
- Comprehensive behavioral analytics & data export (CSV/JSON)
- Retro CRT aesthetic with responsive design
- Reality Bridge: Morocco-Poland supply chain simulation
- **NEW:** 🔊 Web Audio API synthesized sound feedback (click, combo, level-up)
- **NEW:** 🏆 Universal backend with leaderboard, analytics, multi-profile support

## 📁 Project Structure

```
HashEmpire/
├── index.html                 # Main game (clicker + analytics)
├── styles.css                 # Retro CRT styling
├── game.js                    # Core game engine (+ AudioEngine)
├── backend-client.js          # Frontend API client for backend
├── terminal.js                # Advanced command interface
├── achievements.js            # Achievement system
├── empires.js                 # Empire configurations (Syndicate/Nexus/Verdant)
├── instrukcja.ai              # PROJECT ORIENTAL specs
├── README.md                  # This file
├── PROJECT_ANALYSIS.md        # Development stages analysis
├── backend/                   # 🆕 Universal backend folder
│   ├── server.js              # Express API server
│   ├── leaderboard.js         # Leaderboard service (pluggable)
│   ├── config.js              # Configuration (empires, rates, etc.)
│   ├── package.json           # Backend dependencies
│   ├── .env.example           # Environment template
│   └── README.md              # Backend API documentation
└── illumination-store/        # Separate merch crowdfunding site
    └── index.html             # Indiegogo-style sales page
```

## 🎮 Game Features

### Core Mechanics
- **Clicking**: Generate Hash Units (HU) - fixed NaN bug
- **Upgrades**: Production, Distribution, Influence trees
- **Prestige**: Permanent bonuses at Level 10+
- **Path Choices**: Risk vs Safety strategic decisions
- **Random Events**: Crisis management scenarios
- **CPS Tracking**: Live clicks-per-second counter with EMA smoothing
- **Combo System**: Multiplicative rewards for fast clicking (x1.0 → x2.5)
- **Progress Bar**: Visual progression towards next level

### Audio Feedback (NEW)
- 🔊 **Click Sound:** Crisp 880Hz beep (80ms) for immediate tactile feedback
- 🎵 **Combo Audio:** E-G major chord progression (330Hz + 392Hz) at combo x2+
- 🎼 **Level Up:** Fanfara (G-E-G arpeggio) with 800ms epic feel
- 💰 **Upgrade:** Coin sweep (1000Hz → 600Hz transition)
- ⚠️ **Event Alert:** Dual A-note (440Hz) alarm for warnings
- 👑 **Prestige:** C-E-G major chord ascending fanfara (epicness!)
- 🔇 **Toggle:** 🔊/🔇 button in header to enable/disable sounds

### Advanced Systems
- **Terminal (Ctrl+`)**: `help`, `fleet`, `routes`, `analytics`, `export`, `hack`, `achievements`
- **Achievements**: 25+ with Bronze-Platinum-Legendary tiers
- **Analytics**: Player behavior, risk tolerance, upgrade patterns
- **Leaderboard (Optional):** Local + Mock global with backend API integration

## 🛒 Merchandise Crowdfunding (illumination-store/index.html)
- Indiegogo-style single-page site
- 5 tiers: Observer Node ($33) → Grand Architect ($333,333)
- Modern cyberpunk aesthetic (different branding)
- Responsive, animated, pledge simulation

## 🚀 Backend Setup (NEW)

### Quick Start
```bash
cd backend
npm install
npm run dev
```

Backend runs on `http://localhost:5000`

### API Endpoints
```
GET  /health                           # Health check
GET  /api/leaderboard                  # Top 100 players
GET  /api/leaderboard/:playerId        # Player rank
GET  /api/leaderboard/category/maxCPS  # Category rankings
POST /api/scores                       # Submit score
POST /api/analytics                    # Submit analytics
GET  /api/players/:playerId            # Player profile
GET  /api/empires                      # Empire configs
```

### Features
- ✅ Leaderboard with player rankings
- ✅ Analytics tracking & export
- ✅ Multi-empire support (Syndicate/Nexus/Verdant)
- ✅ Player profiles with psychometrics
- ✅ Pluggable data layer (memory/MongoDB/Supabase)
- ✅ CORS, Helmet security, Rate limiting
- 🟡 JWT auth (TODO)
- 🟡 WebSocket real-time updates (TODO)

See [backend/README.md](backend/README.md) for full API documentation.

## 🎯 Frontend Integration

Backend is **optional** (offline mode works):
```javascript
// In game.js (auto-initialized):
window.backend = new BackendClient();
window.backend.connect().then(connected => {
    if (connected) {
        // Submit score every 60s
        // Submit analytics every 5min
    }
});
```

## 🔊 Audio System

Uses **Web Audio API** with procedural synthesis (no file downloads):

```javascript
// AudioEngine class in game.js
this.audio.playClick();        // Immediate feedback
this.audio.playCombo(level);   // Combo milestone
this.audio.playLevelUp();      // Progression fanfara
this.audio.toggle();            // Enable/disable via UI
```

All sounds are generated in-browser, Zero latency, Retro feel.

## 🔧 Technical Stack
- **Frontend**: Vanilla HTML5/CSS3/JS (no frameworks)
- **Storage**: localStorage (save/load) + optional backend
- **Audio**: Web Audio API (synthesized procedural sounds)
- **Backend**: Express.js + optional MongoDB/Supabase
- **Responsive**: Mobile-first CSS Grid/Flexbox
- **Performance**: requestAnimationFrame game loop (60fps potential)
- ✅ Save/Load persistent
- ✅ Responsive on mobile
- ✅ Merch page fully functional
- ✅ Git-ready structure

## 📄 License
Educational/research use only. Satirical business simulation.

**🌿 The Eye watches. Your empire awaits. Deploy and illuminate.**

**Last Updated: 2026-01-05**
