# 🏆 Leaderboard UI Modal - Feature Documentation

## Overview
Complete leaderboard UI modal with 5 tabs for viewing global rankings, personal rank, and category-specific leaderboards.

## Features

### UI Components
- **Header Button**: 🏆 Trophy icon in top-right stats panel
- **Modal Dialog**: Fullscreen-aware, 85vh max-height with scrollable content
- **5 Tabs**:
  1. **GLOBAL TOP 100** - Top 100 players by Hash Units (default view)
  2. **MY RANK** - Personal rank with ±3 neighbors visualization
  3. **FASTEST CLICKERS** - Sorted by max CPS (clicks-per-second)
  4. **PRESTIGE MASTERS** - Sorted by prestige level reached
  5. **MOST CLICKS** - Sorted by total clicks (all time)

### Visual Design
- **Color Scheme**: Orange (#ff6600) + Yellow (#ffff00) accents on retro CRT aesthetic
- **Icons**: 🥇 🥈 🥉 for top 3, plus rank numbers
- **Responsive**: Works on mobile (auto-scrolling on ≤60vh height)
- **Status Indicators**:
  - ⏳ Loading state during API calls
  - ⚠️ Offline warning if backend unavailable
  - 🎯 Highlighted player row with yellow background

### Data Display

#### Global Top 100
| Column | Details |
|--------|---------|
| Rank | 1-100 with medals for top 3 |
| Player | Player ID (first 12 chars) |
| Level | Current illumination level |
| Hash Units | Formatted (1.2B, 3.4M, etc.) |

#### My Rank
- **Player Stats Card**: Current rank, ID, level, hash units, CPS
- **Neighbors List**: ±3 players surrounding your rank with hover effects

#### Category Leaderboards
- Same grid structure as Global Top 100
- Value column changes based on category (CPS, Prestige Level, Total Clicks)

## Integration

### Backend Requirements
The leaderboard depends on `window.backend` (BackendClient) with these methods:
```javascript
await backend.getLeaderboard(limit)              // Global top N
await backend.getPlayerRank(playerId, range)    // Player rank + neighbors
await backend.getLeaderboardCategory(category)  // Category-specific (maxCPS, prestige, totalClicks)
```

### Backend Server Routes
```
GET /api/leaderboard                    # Global leaderboard
GET /api/leaderboard/:playerId          # Player rank + neighbors
GET /api/leaderboard/category/:category # Category leaderboard
```

## Offline Fallback
If backend is unavailable:
- ⚠️ Warning displayed: "Backend not connected. Run: cd backend && npm start"
- UI remains functional (graceful degradation)
- Player can still see UI structure

## Quick Start

### 1. Start Backend
```bash
cd backend
npm install
npm run dev
```

### 2. Open Game
- Click 🏆 button in header to open leaderboard
- View global rankings or switch to other tabs

### 3. Submit Scores
- Scores auto-sync every 60s (if backend running)
- Your rank updates in "MY RANK" tab

## Customization

### Add New Category
1. Edit `backend/server.js`: Add new `/api/leaderboard/category/:custom` route
2. Edit `index.html`: Add new tab button with `data-category="custom"`
3. Edit `game.js`: Handle in `loadCategoryLeaderboard()` switch statement

### Styling Customization
Edit `styles.css` section "LEADERBOARD STYLES" (~250 lines):
- `.leaderboard-btn` - Header button
- `.leaderboard-modal` - Modal container
- `.leaderboard-tab-btn` - Tab buttons
- `.leaderboard-row` - Individual rank rows
- `.rank-neighbor-item` - Neighbor cards

### Color Schemes
Current: Orange + Yellow on black CRT
```css
/* Modify these in styles.css: */
border-color: #ff6600;              /* Orange */
color: #ffff00;                     /* Yellow */
background: rgba(255, 102, 0, 0.2); /* Transparent orange */
```

## Performance Notes
- Leaderboard loads on-demand (not on page load)
- Data cached by backend for 24 hours (configurable)
- Scrollbar optimized for smooth 60fps interaction
- Grid layout prevents reflow on size changes

## Error Handling
All async operations wrapped in try-catch:
- Network errors → User-friendly message
- Missing backend → Helpful setup instructions
- Empty results → "No players yet" message
- Invalid categories → Graceful fallback

## Future Enhancements
- ⏱️ Real-time WebSocket updates (live rank changes)
- 📊 Stats sparklines (trend visualization)
- 🎯 Achievement badges on player names
- 🔗 Player profile cards (click to view details)
- 🌍 Regional leaderboards (by empire)
- 📈 Weekly/monthly variants

## Testing Checklist
- [ ] Click 🏆 button → Modal opens
- [ ] Global tab shows players (or setup message)
- [ ] Click other tabs → Content switches correctly
- [ ] My Rank displays current player stats
- [ ] Close button (×) hides modal
- [ ] Clicking background also closes modal
- [ ] Scroll works on mobile (≤600px width)
- [ ] Backend unavailable → Warning shows
- [ ] Number formatting works (1.2B, etc.)

## File Changes
- ✅ `index.html` - Added modal HTML + button
- ✅ `styles.css` - Added 250 lines of styling
- ✅ `game.js` - Added leaderboard functions + event listeners

Total lines added: ~520 (modal + CSS + JS)
