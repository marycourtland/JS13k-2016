var templates = {};
var mineData = [];

// Static data for now. Maybe more procedural in the future.

// Area A: outside the space station
// Area B: inside the space station

var checkpoints = [
    xy(850, 150),
    xy(2600, 260)
];


var oxyCans = [
    xy(200, 550),
    xy(1200, 500),
    xy(1600, 250),
    xy(2200, 75)
]

for (var i = 0; i < checkpoints.length; i++) {
    mineData.push({
        id: 'c' + i,
        coords: checkpoints[i],
        words: [
            {size:10, distance: 50, text: 'checkpoint\n[ ][ ]', pbatch:'cp', triggers: {'checkpoint': 1}},
            {size:10, distance: 50, text: 'checkpoint\n[+][ ]', pbatch:'cp', triggers: {'checkpoint': 1}},
            {size:10, distance: 0, text: 'checkpoint\n[+][+]'}
        ]
    })
}


// Decoration templates
var decorations = {
    'A': {
        template: [
            {size: 10, distance: 80, text:'space junk'},
            {size: 14, distance: 10,  text:'more detail'}
        ],
        coords: [
            //{x:120,y:280},
            //{x:280,y:360},
            //{x:465,y:170},
            //{x:670,y:450},
            {x:750,y:85},
            {x:950,y:500},
        ],
    },
    'B': {
        template: [
            {size: 10, distance: 50, text:'a doodad'},
            {size: 14, distance: 10, text:'something interesting'}
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
        continue;
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
        coords: xy(550, 500),
        words: [
            {size:12, distance: 120, text: 'a shining speck of light',},
            {size:18, glitchLevel: 1, distance: 80, text: 'noise and chaos', triggers: {
              'spawn':{
                template: 'debris',
                count: 7,
                distance: 120,
                delay: 50,
                pause: 00,
                params: {
                    id: 'g0' + Math.random()
                }
              },
              'death':1
            }},
            {size:36, glitchLevel: 5, distance: 50, text: 'EXPLOSION', triggers: {'death': 1} }
        ]
    },
    {
        id: 'g1',
        coords: {x:1950,y:490},
        words: [
            {size: 10, distance: 100, text:'a doodad'},
            {size: 12, distance: 80, text:'quite interesting', triggers: {'death': 1}},
            {size: 14, glitchLevel:1, distance: 50, text:'DANGER', triggers: {
              'death': 1,
              'spawn': {
                template: 'debris',
                count:5,
                distance: 50,
                delay: 150,
                pause: 0,
                params: {
                    id: 'g1' + Math.random()
                }
              }
            }}
        ]
    },
    {
        id: 'g2',
        coords: xy(2600, 150),
        words: [
            {size:12, distance: 100, text: 'a plain button',},
            {size:18, distance: 50, text: 'it is really tempting', trigger: {'death': 1}},
            {size:36, glitchLevel: 4, distance: 49, text: 'EXPLOSION', trigger: {'death': 1}}
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
            {size:12, distance: 50, text: 'oxygen supply', triggers: {
              'spawn': {
                template: 'oxygen',
                count:3,
                distance: 50,
                delay: 100,
                pause: 00,
                params: {
                    id: id
                    // coords will be filled in
                }
              },
              'hide': 1
            }},
            {size:12, distance: 0, text: ''},
        ]
    })
}

for (var i = 0; i < oxyCans.length; i++) {
    makeOxygenCannister('oxyCan'+i, oxyCans[i]);
}


// TEMPLATES
templates.oxygen = function (params) {
    return {
        id: 'oxy' + params.id,
        coords: params.coords,
        words: [
            {size:8, distance: 30, text: 'oxygen', triggers: {'oxygen': 0.2, 'hide': 1} },
            {size:8, distance: 0, text: ''},
        ]
    }
}

templates.debris = function (params) {
    return {
        id: 'debris' + params.id,
        coords: params.coords,
        words: [
            {size:8, glitchLevel: 2, distance: 30, text: 'debris', triggers: {'death': 1}},
            {size:8, glitchLevel: 2, distance: 0, text: 'debris'},
        ]
    }
}


mineData = [
    {
        id: 'l0',
        coords: {x:720,y:150},
        words: [
            {size: 24, distance: 70, text:'entry to\nan abandoned\nspace station', pbatch:'ss'},
            {size: 24, distance: 70, text:'entry to\nan abandoned\nspace station\n[+][ ]', pbatch:'ss', triggers: {
              'checkpoint': 1,
              'showArea': 'spacestation',
              'hideArea': 'outside'
            }},
            {size: 36, distance: 10, text:'inside the\nspace station'}
        ]
    },
    {
        id: 'l1',
        area: 'spacestation',
        coords: {x:1300,y:220},
        wirable: 1,
        words: [
            {size: 14, distance: 100, text:'$cover'},
            {size: 20, distance: 50, text:'master power control', triggers: {setPower: 1}},
            {size: 28, distance: 30, text:'master power on', triggers: {wire: {playerRadius: 50}}},
        ]
    },
    {
        id: 'l2',
        area: 'spacestation',
        coords: {x:1880,y:440},
        wirable: 1,
        words: [
            {size: 14, distance: 300, text:'$cover'},
            {size: 20, distance: 100, requirePower: 1, text:'life support\nsystem control', triggers: {'lifeSupportOn': 1, wire: {playerRadius: 50}}},
            {size: 28, distance: 30, text:'life support\npowered up', triggers: {wire: {playerRadius: 50}}},
        ]
    },
    {
        id: 'l3',
        area: 'spacestation',
        coords: {x:1980,y:120},
        wirable: 1,
        words: [
            {size: 14, distance: 300, text:'$cover'},
            {size: 20, distance: 100, requirePower: 1, text:'propulsion\nsystem control', triggers: {'lifeSupportOn': 1, wire: {playerRadius: 50}}},
            {size: 28, distance: 30, text:'propulsion system\npowered up', triggers: {wire: {playerRadius: 50}}},
        ]
    },
    {
        id: 'l3',
        area: 'spacestation',
        coords: {x:2620,y:350},
        wirable: 1,
        words: [
            {size: 14, distance: 300, text:'$cover'},
            {size: 20, distance: 100, requirePower:1, text:'shuttle\nsystem control', triggers: {wire: {playerRadius: 50}, showArea: 'end'}},
            {size: 28, distance: 30, text:'shuttle\npowered up'},
        ]
    },
    {
        id: 'l4',
        area: 'end',
        hidden: 1,
        coords: {x:2700,y:200},
        words: [
            {size: 14, distance: 300, text:'a cylindrical airlock'},
            {size: 28, distance: 100, text:'escape shuttle entrance\n[ ][ ]', pbatch:'end'},
            {size: 28, distance: 100, text:'escape shuttle entrance\n[+][ ]', pbatch:'end', triggers: {'win': 1}},
            {size: 72, distance: 30, text:'blasting away\nto safety'},
        ]
    }
]

var instructions = [
    [xy(200, 180), 'how to play:'],
    [xy(350, 250), '1.\nmove with arrow keys'],
    [xy(280, 380), '2.\nmeet your teammates\nto create wires'],
    [xy(600, 500), '3.\nplace both ends of the wire\n on two systems\nto connect them together'],
    [xy(800, 350), 'find & power up the shuttle\nso you can escape home!', '#466253'],
    [xy(1100, 480), 'do not run\nout of oxygen.', '#504247'],
]
for (var i = 0; i < instructions.length; i++) {
    mineData.push({
        id: 'instructions' + i,
        coords: instructions[i][0],
        words: [{size: 16, distance: 0, color: instructions[i][2] || '#465462', text: instructions[i][1]}]
    })
}
    
    
            var s = 'how to play:'
              + '\nmove with arrow keys'
              + '\nmeet your teammates to create wires'
              + "\ntwo players can simultaneously connect two systems together if they're holding a wire"
              + '\ndo not run out of oxygen'
              + '\nfind the shuttle, power it up, and escape!'
    
//mineData = mineData.concat(landmarks);

// TEMPORARY: set the spaceship area to be everything at x > 1000 (i.e. past the spaceship entry)
/*
mineData.forEach(function(mine) {
  return;
    if (!!mine.area) return;
    if (mine.coords.x < 960) {
        mine.area = 'outside';
    }
    else if (mine.coords.x > 960) {
        mine.area = 'spacestation';
        mine.hidden = 1;
    }
})
*/

mineData.forEach(function(mine) { if (mine.area === 'spacestation') mine.hidden = 1; })

// Random words
var randomWords = {
  cover: [
    'control panel',
    'tangled wires',
    'exposed motherboard',
    'cluttered console',
    'messy crawlspace',
    'prominent mainframe'
  ],
  power: [
    'solar array',
    'nuclear generator',
    'fusion reactor',
    'em drive',
    'thermal recycler',
  ]  
}


// Append a terminal word to each mine to make things clean
mineData.forEach(function(mine) {
    var lastWord = mine.words[mine.words.length - 1];
    var terminal = {
        distance: -1, // never trigger it
        text: lastWord.text
    }
    var props = ['color', 'size', 'glitchLevel'];
    props.forEach(function(prop) {
      if (lastWord[prop]) terminal[prop] = lastWord[prop];
    })
    mine.words.push(terminal);
})


