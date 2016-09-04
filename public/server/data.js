var templates = {};
var mineData = [];

// Static data for now. Maybe more procedural in the future.

// Area A: outside the space station
// Area B: inside the space station

var checkpoints = [
    xy(200, 100),
    xy(2600, 260)
];

for (var i = 0; i < checkpoints.length; i++) {
    mineData.push({
        id: 'c' + i,
        coords: checkpoints[i],
        words: [
            {size:10, distance: 50, text: 'checkpoint\n[ ][ ]', pbatch:'cp', triggers: ['checkpoint']},
            {size:10, distance: 50, text: 'checkpoint\n[+][ ]', pbatch:'cp', triggers: ['checkpoint']},
            {size:10, distance: 0, text: 'checkpoint\n[+][+]'}
        ]
    })
}

var landmarks = [
    {
        id: 'l0',
        coords: {x:960,y:270},
        words: [
            //{size: 36, glitchLevel:0, distance: 400, text:'an\norbiting\nmass'},
            {size: 24, glitchLevel:0, distance: 400, text:'a ruined\nspace station'},
            //{size: 36, glitchLevel:0, distance: 200, text:'one functioning port', pbatch:'ss', triggers: ['checkpoint']},
            {size: 48, glitchLevel:0, distance: 200, text:'one functioning port\n[+][ ]', pbatch:'ss', triggers: ['checkpoint', 'showArea', 'hideArea'], showArea: 'spacestation', hideArea: 'outside'},
            {size: 48, glitchLevel:0, distance: 10, text:'one functioning port\n[+][+]'}
        ]
    },
    {
        id: 'l1',
        coords: {x:2180,y:220},
        words: [
            {size: 14, glitchLevel:0, distance: 300, text:'a control panel'},
            {size: 20, glitchLevel:0, distance: 100, text:'master power control'},
            {size: 28, glitchLevel:0, distance: 30, text:'master power on'},
        ]
    },
    {
        id: 'l2',
        coords: {x:2480,y:440},
        words: [
            {size: 14, glitchLevel:0, distance: 300, text:'a control panel'},
            {size: 20, glitchLevel:0, distance: 100, text:'life support\nsystem control'},
            {size: 28, glitchLevel:0, distance: 30, text:'life support\n powered up'},
        ]
    },
    {
        id: 'l3',
        coords: {x:2820,y:300},
        words: [
            {size: 14, glitchLevel:0, distance: 300, text:'a control panel'},
            {size: 20, glitchLevel:0, distance: 100, text:'shuttle\nsystem control'},
            {size: 28, glitchLevel:0, distance: 30, text:'shuttle\n powered up'},
        ]
    },
    {
        id: 'l4',
        coords: {x:3400,y:400},
        words: [
            {size: 14, glitchLevel:0, distance: 300, text:'a round porthole'},
            {size: 28, glitchLevel:0, distance: 100, text:'escape shuttle entrance'},
            {size: 72, glitchLevel:0, distance: 30, text:'blasting away\nto safety', triggers: ['win']},
        ]
    }
]
mineData = mineData.concat(landmarks);


// Decoration templates
var decorations = {
    'A': {
        template: [
            {size: 10, glitchLevel:0, distance: 80, text:'space junk'},
            {size: 14, glitchLevel:0, distance: 10,  text:'more detail'}
        ],
        coords: [
            {x:120,y:280},
            {x:280,y:360},
            //{x:465,y:170},
            //{x:670,y:450},
            {x:750,y:85},
            {x:950,y:500},
        ],
    },
    'B': {
        template: [
            {size: 10, glitchLevel:0, distance: 50, text:'a doodad'},
            {size: 14, glitchLevel:0, distance: 10, text:'something interesting'}
        ],
        coords: [
            {x:1340,y:140},
            {x:1460,y:515},
            {x:1690,y:410},
            {x:1800,y:180},
        ]
    }
}

for (var category in decorations) {
    for (var i = 0; i < decorations[category].coords.length; i++) {
        mineData.push({
            id: 'd' + category + i,
            coords: decorations[category].coords[i],
            words: decorations[category].template,
        })
    }
}


var glitchy = [
    {
        id: 'g0',
        coords: xy(600, 550),
        words: [
            {size:12, distance: 120, text: 'a shining speck of light',},
            {size:18, glitchLevel: 1, distance: 80, text: 'noise and chaos', triggers: ['spawn', 'death'], spawn: {
                template: 'debris',
                count: 7,
                distance: 120,
                delay: 50,
                pause: 00,
                params: {
                    id: 'g0' + Math.random()
                }
            }},
            {size:36, glitchLevel: 5, distance: 50, text: 'EXPLOSION', triggers: ['death']}
        ]
    },
    {
        id: 'g1',
        coords: {x:1950,y:490},
        words: [
            {size: 10, glitchLevel:0, distance: 100, text:'a doodad'},
            {size: 12, glitchLevel:0, distance: 80, text:'quite interesting', triggers: ['death']},
            {size: 14, glitchLevel:1, distance: 50, text:'DANGER', triggers: ['death', 'spawn'], spawn: {
                template: 'debris',
                count:5,
                distance: 50,
                delay: 150,
                pause: 00,
                params: {
                    id: 'g1' + Math.random()
                }
            }},
        ]
    },
    {
        id: 'g2',
        coords: xy(2600, 150),
        words: [
            {size:12, distance: 100, text: 'a plain button',},
            {size:18, distance: 50, text: 'it is really tempting', trigger: ['death']},
            {size:36, glitchLevel: 4, distance: 49, text: 'EXPLOSION', trigger: ['death']}
        ]
    },
]
mineData = mineData.concat(glitchy);



function makeOxygenCannister(id, coords) {
    mineData.push({
        id: 'cannister_' + id,
        coords: coords,
        words: [
            {size:10, distance: 150, text: 'a cannister',},
            {size:12, distance: 50, text: 'oxygen supply', triggers: ['spawn', 'hide'], spawn: {
                template: 'oxygen',
                count:3,
                distance: 50,
                delay: 100,
                pause: 00,
                params: {
                    id: id
                    // coords will be filled in
                }
            }},
            {size:12, distance: 0, text: ''},
        ]
    })
}

var oxyCans = [
    xy(470, 150),
    xy(400, 350),
    xy(200, 550),
    xy(1200, 500),
    xy(1500, 200),
]

for (var i = 0; i < oxyCans.length; i++) {
    makeOxygenCannister('oxyCan'+i, oxyCans[i]);
}


// TEMPLATES
templates.oxygen = function (params) {
    return {
        id: 'oxy' + params.id,
        coords: params.coords,
        words: [
            {size:8, distance: 30, text: 'oxygen', triggers: ['hide']},
            {size:8, distance: 0, text: ''},
        ]
    }
}

templates.debris = function (params) {
    return {
        id: 'debris' + params.id,
        coords: params.coords,
        words: [
            {size:8, glitchLevel: 2, distance: 30, text: 'debris', triggers: ['death']},
            {size:8, glitchLevel: 2, distance: 0, text: 'debris'},
        ]
    }
}

// TEMPORARY: set the spaceship area to be everything at x > 1000 (i.e. past the spaceship entry)
mineData.forEach(function(mine) {
    if (!!mine.area) return;
    if (mine.coords.x < 960) {
        mine.area = 'outside';
    }
    else if (mine.coords.x > 960) {
        mine.area = 'spacestation';
        mine.hidden = 1;
    }
})
