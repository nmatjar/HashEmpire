(function(){
    window.EMPIRE_DATA = window.EMPIRE_DATA || {};

    window.EMPIRE_DATA['default'] = {
        config: {
            rewardScaleBase: 0.05,
            eventCooldownSec: 60
        },
        levels: [
            0, 100, 500, 2000, 10000, 50000, 250000, 1000000, 5000000, 25000000,
            100000000, 500000000, 2500000000, 12500000000, 62500000000,
            312500000000, 1562500000000, 7812500000000, 39062500000000, 195312500000000,
            976562500000000, 4882812500000000, 24414062500000000, 122070312500000000,
            610351562500000000, 3051757812500000000, 15258789062500000000,
            76293945312500000000, 381469726562500000000, 1907348632812500000000,
            9536743164062500000000, 47683715820312500000000, 238418579101562500000000
        ],
        events: {
            tier1: [
                { id: 't1_e1', title: 'First Sale Success', weight: 40, options: [{text:'Accept Payment', rewardType:'mult', reward:1.15},{text:'Hold Out', rewardType:'mult', reward:1.05}] },
                { id: 't1_e2', title: 'Got a Regular Customer', weight: 35, options: [{text:'Offer Discount', rewardType:'mult', reward:1.25},{text:'Keep Price', rewardType:'mult', reward:1.1}] },
                { id: 't1_e3', title: 'Street Vendor Tip', weight: 15, options: [{text:'Follow Tip', rewardType:'flat', reward:200},{text:'Ignore', rewardType:'mult', reward:1.02}] },
                { id: 't1_e4', title: 'Local Flyer Distribution', weight: 6, options: [{text:'Invest 10%', costPct:0.1, rewardType:'mult', reward:1.35},{text:'Pass', rewardType:'mult', reward:1.01}] },
                { id: 't1_e5', title: 'Friendly Rival', weight: 3, options: [{text:'Share Leads', rewardType:'flat', reward:500},{text:'Compete', rewardType:'mult', reward:1.05}] },
                { id: 't1_e6', title: 'Hidden Cache', weight: 1, options: [{text:'Take It', rewardType:'flat', reward:2000},{text:'Report', rewardType:'mult', reward:1.0}] }
            ],
            tier2: [
                { id: 't2_e1', title: 'Police Patrol (Mild)', weight: 30, options: [{text:'Lay Low', costPct:0.05, rewardType:'mult', reward:1.15},{text:'Ignore', rewardType:'mult', reward:1.05}] },
                { id: 't2_e2', title: 'New Market Opportunity', weight: 30, options: [{text:'Invest 20%', costPct:0.2, rewardType:'mult', reward:1.4},{text:'Invest 10%', costPct:0.1, rewardType:'mult', reward:1.2}] },
                { id: 't2_e3', title: 'Supplier Issues (Mild)', weight: 20, options: [{text:'Find New Supplier', costPct:0.1, rewardType:'mult', reward:1.15},{text:'Wait', rewardType:'mult', reward:1.05}] },
                { id: 't2_e4', title: 'Local Promotion', weight: 10, options: [{text:'Run Promo', costPct:0.05, rewardType:'flat', reward:2000},{text:'Skip', rewardType:'mult', reward:1.02}] },
                { id: 't2_e5', title: 'Informant Tip', weight: 7, options: [{text:'Follow', costPct:0.02, rewardType:'flat', reward:5000},{text:'Ignore', rewardType:'mult', reward:1.0}] },
                { id: 't2_e6', title: 'Rare: Local Festival', weight: 1, options: [{text:'Capitalize', costPct:0.15, rewardType:'flat', reward:20000},{text:'Sit Out', rewardType:'mult', reward:1.0}] }
            ],
            tier3: [
                { id: 't3_e1', title: 'Police Raid (High Stakes)', weight: 30, options: [{text:'Pay Bribe', costPct:0.3, rewardType:'mult', reward:1.5},{text:'Evade', costPct:0.2, rewardType:'mult', reward:1.2},{text:'Surrender Stash', costPct:0.5, rewardType:'mult', reward:1.0}] },
                { id: 't3_e2', title: 'Market Consolidation', weight: 25, options: [{text:'Merge Aggressively', costPct:0.4, rewardType:'mult', reward:2.0},{text:'Friendly Merge', costPct:0.25, rewardType:'mult', reward:1.6},{text:'Decline', rewardType:'mult', reward:1.0}] },
                { id: 't3_e3', title: 'Rival Territory War', weight: 20, options: [{text:'Fortify', costPct:0.35, rewardType:'mult', reward:1.8},{text:'Negotiate', costPct:0.2, rewardType:'mult', reward:1.4},{text:'Retreat', rewardType:'mult', reward:1.0}] },
                { id: 't3_e4', title: 'Supply Chain Windfall', weight: 15, options: [{text:'Invest Returns', rewardType:'flat', reward:50000},{text:'Pocket', rewardType:'mult', reward:1.05}] },
                { id: 't3_e5', title: 'Regional Partnership', weight: 8, options: [{text:'Form Alliance', costPct:0.2, rewardType:'tokens', tokens:2},{text:'Solo', rewardType:'mult', reward:1.05}] },
                { id: 't3_e6', title: 'Rare: Hidden Investor', weight: 2, options: [{text:'Accept Funding', costPct:0.3, rewardType:'flat', reward:150000},{text:'Decline', rewardType:'mult', reward:1.0}] }
            ],
            tier4: [
                { id: 't4_e1', title: 'Geopolitical Crisis', weight: 28, options: [{text:'Exploit Crisis', costPct:0.45, rewardType:'mult', reward:2.5},{text:'Hedge', costPct:0.2, rewardType:'mult', reward:1.5},{text:'Wait', rewardType:'mult', reward:1.0}] },
                { id: 't4_e2', title: 'DEA Manhunt', weight: 25, options: [{text:'Pay Informants', costPct:0.5, rewardType:'mult', reward:1.8},{text:'Go Underground', costPct:0.25, rewardType:'mult', reward:1.4},{text:'Skip Prestige', rewardType:'mult', reward:0}] },
                { id: 't4_e3', title: 'Media Scandal', weight: 20, options: [{text:'Spin Narrative', costPct:0.4, rewardType:'mult', reward:2.0},{text:'Keep Silent', costPct:0.1, rewardType:'mult', reward:1.1}] },
                { id: 't4_e4', title: 'Corporate Espionage', weight: 12, options: [{text:'Counter-Hack', costPct:0.3, rewardType:'flat', reward:100000},{text:'Pay Off', costPct:0.25, rewardType:'mult', reward:1.3}] },
                { id: 't4_e5', title: 'Market Boom', weight: 4, options: [{text:'Scale Fast', costPct:0.35, rewardType:'flat', reward:300000},{text:'Consolidate', rewardType:'mult', reward:1.2}] },
                { id: 't4_e6', title: 'Rare: International Leak', weight: 1, options: [{text:'Leverage', rewardType:'tokens', tokens:5},{text:'Suppress', rewardType:'mult', reward:1.0}] }
            ],
            tier5: [
                { id: 't5_e1', title: 'International Cartel Conflict', weight: 30, options: [{text:'Forge Alliance', costPct:0.6, rewardType:'mult', reward:3.2},{text:'Play Both Sides', costPct:0.35, rewardType:'mult', reward:2.0},{text:'Neutrality', rewardType:'mult', reward:1.0}] },
                { id: 't5_e2', title: 'Data Breach Risk', weight: 25, options: [{text:'Hire Hackers', costPct:0.5, rewardType:'mult', reward:2.5},{text:'DIY', costPct:0.2, rewardType:'mult', reward:1.4}] },
                { id: 't5_e3', title: 'Illuminati Recruitment', weight: 20, options: [{text:'Accept', costPct:1.0, rewardType:'mult', reward:0, tokens:5},{text:'Decline', rewardType:'mult', reward:1.0}] },
                { id: 't5_e4', title: 'Global Market Surge', weight: 15, options: [{text:'All-In', costPct:0.5, rewardType:'flat', reward:1000000},{text:'Hedge', costPct:0.2, rewardType:'mult', reward:1.3}] },
                { id: 't5_e5', title: 'Legendary: World Summit Invite', weight: 7, options: [{text:'Attend', costPct:0.4, rewardType:'tokens', tokens:10},{text:'Decline', rewardType:'mult', reward:1.0}] },
                { id: 't5_e6', title: 'Secret Vault Discovery', weight: 3, options: [{text:'Open', rewardType:'flat', reward:2000000},{text:'Seal', rewardType:'mult', reward:1.0}] }
            ]
        },
        achievements: []
    };
})();
