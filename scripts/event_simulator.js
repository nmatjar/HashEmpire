// Event simulator for HashEmpire
// Simulates triggerRandomEvent selection distribution per tier

const tierEventPool = {
    tier1: [
        { id: 't1_e1', title: 'First Sale Success', optionCount: 2 },
        { id: 't1_e2', title: 'Got a Regular Customer', optionCount: 2 }
    ],
    tier2: [
        { id: 't2_e1', title: 'Police Patrol (Mild)', optionCount: 2 },
        { id: 't2_e2', title: 'New Market Opportunity', optionCount: 2 },
        { id: 't2_e3', title: 'Supplier Issues (Mild)', optionCount: 2 }
    ],
    tier3: [
        { id: 't3_e1', title: 'Police Raid (High Stakes)', optionCount: 3 },
        { id: 't3_e2', title: 'Market Consolidation Opportunity', optionCount: 3 },
        { id: 't3_e3', title: 'Rival Territory War', optionCount: 3 }
    ],
    tier4: [
        { id: 't4_e1', title: 'Geopolitical Crisis', optionCount: 3 },
        { id: 't4_e2', title: 'DEA Manhunt', optionCount: 3 },
        { id: 't4_e3', title: 'Media Scandal', optionCount: 2 }
    ],
    tier5: [
        { id: 't5_e1', title: 'International Cartel Conflict', optionCount: 3 },
        { id: 't5_e2', title: 'Data Breach Risk', optionCount: 2 },
        { id: 't5_e3', title: 'Illuminati Recruitment', optionCount: 2 }
    ]
};

function pickEventForLevel(level) {
    let tierEvents = [];
    if (level <= 5) tierEvents = tierEventPool.tier1;
    else if (level <= 10) tierEvents = tierEventPool.tier2;
    else if (level <= 15) tierEvents = tierEventPool.tier3;
    else if (level <= 20) tierEvents = tierEventPool.tier4;
    else tierEvents = tierEventPool.tier5;

    const idx = Math.floor(Math.random() * tierEvents.length);
    return tierEvents[idx];
}

function simulate(tierName, levelRange, trials) {
    const counts = {};
    for (const ev of tierEventPool[tierName]) counts[ev.id] = 0;

    for (let i = 0; i < trials; i++) {
        const level = levelRange[Math.floor(Math.random() * levelRange.length)];
        const ev = pickEventForLevel(level);
        counts[ev.id]++;
    }

    // compute percentages
    const results = Object.keys(counts).map(id => ({ id, count: counts[id], pct: (counts[id] / trials) * 100 }));
    results.sort((a,b) => b.count - a.count);
    return results;
}

function range(a,b){ const r=[]; for(let i=a;i<=b;i++) r.push(i); return r; }

(async function main(){
    const trialsPerTier = 100000;
    const report = {};

    report.tier1 = simulate('tier1', range(1,5), trialsPerTier);
    report.tier2 = simulate('tier2', range(6,10), trialsPerTier);
    report.tier3 = simulate('tier3', range(11,15), trialsPerTier);
    report.tier4 = simulate('tier4', range(16,20), trialsPerTier);
    report.tier5 = simulate('tier5', range(21,33), trialsPerTier);

    console.log('\nEvent selection distribution (each tier simulated ' + trialsPerTier + ' times)\n');
    for (const tier of ['tier1','tier2','tier3','tier4','tier5']){
        console.log('--- ' + tier + ' ---');
        report[tier].forEach(r => console.log(`${r.id}: ${r.count} (${r.pct.toFixed(2)}%)`));
        console.log('');
    }
})();
