# 🏆 Leaderboard Integration Guide

## What Was Added

### 1. **index.html** (290 lines total, +96 new lines)
- Added 🏆 button in header stats section
- Added full leaderboard modal with 5 tab views:
  - Global Top 100
  - My Rank (with neighbors)
  - Fastest Clickers (CPS ranking)
  - Prestige Masters
  - Most Clicks (total clicks ranking)

### 2. **styles.css** (1,071 lines total, +294 new lines)
- Leaderboard modal styling (max-width: 900px, 85vh height)
- Tab button styles (active/inactive states)
- Leaderboard row grid layout (Rank | Player | Level | Value)
- Responsive scrollbar with custom styling
- Hover effects and animations
- Rank badges (🥇 🥈 🥉 for top 3)
- Player highlight row for current player

### 3. **game.js** (1,352 lines total, +175 new lines)
- Leaderboard modal event listeners setup
- `loadLeaderboard(category)` - Dispatcher function
- `loadGlobalLeaderboard()` - Fetch and render top 100
- `loadPlayerRank()` - Fetch player rank + neighbors (±3 range)
- `loadCategoryLeaderboard(category)` - Fetch category-specific rankings
- `formatNumber(num)` - Number formatting (1.2B, 3.4M, 567K)
- Tab switching with dynamic content loading

---

## How It Works

### 1. User Clicks 🏆 Button
```javascript
leaderboardToggleBtn.addEventListener('click', () => {
    leaderboardModal.classList.remove('hidden');
    loadLeaderboard('global');  // Load global rankings
});
```

### 2. Leaderboard Fetches Data from Backend
```javascript
const data = await window.backend.getLeaderboard(100);
```

### 3. Data Renders as Rows
```javascript
<div class="leaderboard-row">
    <span class="rank-badge">🥇</span>        <!-- Rank -->
    <span class="name-col">abc123def...</span> <!-- Player ID -->
    <span class="level-col">Level 15</span>   <!-- Level -->
    <span class="value-col">1.2B</span>       <!-- Hash Units -->
</div>
```

### 4. User Switches Tabs
```javascript
leaderboardTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
        loadLeaderboard(e.target.dataset.category);  // Load new category
    });
});
```

---

## Backend API Endpoints Used

```
GET  /api/leaderboard                    # Returns top 100 players
GET  /api/leaderboard/:playerId          # Returns player rank + neighbors
GET  /api/leaderboard/category/maxCPS    # Returns fastest clickers
GET  /api/leaderboard/category/prestige  # Returns prestige masters
GET  /api/leaderboard/category/totalClicks # Returns most clickers
```

All endpoints return data in format:
```json
[
    {
        "rank": 1,
        "playerId": "abc123def456...",
        "illuminationLevel": 15,
        "hashUnits": 1200000000,
        "maxCPS": 45.2,
        "prestigeLevel": 3,
        "totalClicks": 5000000
    },
    ...
]
```

---

## Status Display

### ✅ Backend Connected
- Leaderboard loads normally
- Data updates every time you click a tab
- Numbers formatted nicely (1.2B, 3.4M, etc.)

### ⚠️ Backend Not Connected
- Message: "Backend not connected. Run: cd backend && npm start"
- UI remains visible but shows placeholder text
- No errors thrown (graceful degradation)

### 🟡 Loading State
- "⏳ Loading rankings..." spinner visible during fetch
- Prevents duplicate requests (button disabled during load)
- Auto-hides when data arrives

---

## Quick Start

### Start Backend
```bash
cd backend
npm install
npm run dev
```

Backend will start at `http://localhost:5000`

### Open Game
```bash
open index.html
# or python -m http.server 8000
```

### View Leaderboard
1. Click 🏆 button in header (top-right)
2. Default view: Global Top 100
3. Click tabs to switch views:
   - MY RANK - See your position + neighbors
   - FASTEST CLICKERS - CPS leaderboard
   - PRESTIGE MASTERS - Who's reached highest levels
   - MOST CLICKS - Total clicks all-time

---

## Data Flow Diagram

```
User Click → 🏆 Button
    ↓
leaderboardToggleBtn.click()
    ↓
leaderboardModal.classList.remove('hidden')  // Show modal
    ↓
loadLeaderboard('global')
    ↓
window.backend.getLeaderboard(100)
    ↓
Backend: GET /api/leaderboard
    ↓
Return top 100 players array
    ↓
loadGlobalLeaderboard() renders rows
    ↓
User sees leaderboard with rank, player, level, hashUnits
```

---

## Customization Examples

### Change Colors
Edit `styles.css` around line 790:
```css
.leaderboard-btn {
    border: 2px solid #ff6600;  /* Orange */
    color: #ff6600;
}
/* Change to your color: */
border: 2px solid #00ffff;  /* Cyan */
color: #00ffff;
```

### Change Modal Size
Edit `styles.css`:
```css
.leaderboard-modal {
    max-width: 900px;        /* Width */
    max-height: 85vh;        /* Height */
}
/* Make bigger: */
max-width: 1000px;
max-height: 90vh;
```

### Add New Tab
1. Edit `index.html` - Add button:
```html
<button class="leaderboard-tab-btn" data-category="custom">CUSTOM</button>
```

2. Edit `index.html` - Add table div:
```html
<div class="leaderboard-table" id="category-custom">
    <div class="leaderboard-header-row">...</div>
    <div class="leaderboard-rows" id="custom-rows"></div>
</div>
```

3. Edit `game.js` - Handle in switch:
```javascript
case 'custom':
    value = player.customValue || 0;
    break;
```

4. Backend - Add route:
```javascript
app.get('/api/leaderboard/category/custom', (req, res) => {
    // Return custom ranking data
});
```

---

## Testing

### Test Offline Mode
1. Stop backend (`Ctrl+C` in backend terminal)
2. Click 🏆 button
3. Should show: "Backend not connected. Run: cd backend && npm start"
4. Modal still opens, no crashes ✅

### Test Tab Switching
1. Click each tab
2. Content should change dynamically ✅
3. Loading spinner should appear briefly ✅

### Test Data Rendering
1. Global tab should show ≤100 rows
2. My Rank should show your stats + 3-6 neighbors
3. Each row should format numbers correctly (1.2B, not 1200000000)

### Test Mobile Responsiveness
1. Open DevTools → Toggle device toolbar
2. Try on iPhone SE (375px) and iPad (768px)
3. Should scroll smoothly, text readable ✅

---

## Performance Notes

- Modal loads data **on-demand** (not on page init)
- Backend caches results for 24 hours
- Grid layout prevents layout thrashing
- Custom scrollbar optimized for 60fps
- Numbers formatted to 3 significant figures max

---

## Debugging

### Check if Backend is Running
```bash
curl http://localhost:5000/health
# Should return: {"status":"ok",...}
```

### Check Player ID
In browser console:
```javascript
console.log(window.backend.playerId);
```

### Monitor Network Requests
1. Open DevTools → Network tab
2. Click 🏆 button
3. Should see requests to:
   - `/api/leaderboard`
   - `/api/leaderboard/:playerId`
   - `/api/leaderboard/category/*`

### View Leaderboard Logs
```javascript
// In game.js, add logging:
console.log('Loading category:', category);
console.log('API Response:', data);
console.log('Rendered rows:', rows.children.length);
```

---

## Known Limitations

1. **No Real-Time Updates** - Click tab to refresh (WebSocket coming soon)
2. **No User Profiles** - Player links not yet implemented (v2 feature)
3. **No Search** - Can't search for specific players (coming soon)
4. **No Filtering** - Can't filter by level/empire (future enhancement)
5. **24h Cache** - Rankings update max every 24 hours on backend

---

## Files Modified

| File | Changes | Lines |
|------|---------|-------|
| `index.html` | Modal + button | +96 |
| `styles.css` | Styling | +294 |
| `game.js` | Functions + listeners | +175 |
| `LEADERBOARD.md` | NEW Documentation | 200 |

**Total:** ~565 lines added

---

## Next Steps (Optional)

1. **WebSocket Updates** - Real-time rank changes
2. **Player Profiles** - Click player name to view stats
3. **Regional Filtering** - Filter by empire (Syndicate/Nexus/Verdant)
4. **Achievement Badges** - Show earned achievements next to names
5. **Search & Filter** - Find specific players, filter by level
6. **Weekly/Monthly Leaderboards** - Time-based variants

