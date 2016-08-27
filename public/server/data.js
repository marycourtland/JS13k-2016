// Static data for now. Maybe more procedural in the future.

var checkpoints = [
    {
        coords: xy(100, 100),
        words: [
            {size:10, glitchLevel: 0, distance: 50, text: 'checkpoint', trigger: 'checkpoint'},
            {size:10, glitchLevel: 0, distance: 0, text: '[checkpoint]'}
        ]
    },
    {
        coords: {x:1400,y:300},
        words: [
            {size:10, glitchLevel: 0, distance: 50, text: 'checkpoint', trigger: 'checkpoint'},
            {size:10, glitchLevel: 0, distance: 0, text: '[checkpoint]'}
        ]
    },
    {
      coords: {x:2600,y:260},
        words: [
            {size:10, glitchLevel: 0, distance: 50, text: 'checkpoint', trigger: 'checkpoint'},
            {size:10, glitchLevel: 0, distance: 0, text: '[checkpoint]'}
        ]
    },
]
    
var landmarks = [
    {
        coords: {x:960,y:270},
        words: [
            {size: 36, glitchLevel:0, distance: 300, text:'an\norbiting\nmass'},
            {size: 48, glitchLevel:0, distance: 200, text:'a mostly ruined\nspace station'},
            {size: 50, glitchLevel:0, distance: 100, text:'one functioning port'}
        ]
    },
    {
        coords: {x:2180,y:220},
        words: [
            {size: 14, glitchLevel:0, distance: 300, text:'a control panel'},
            {size: 20, glitchLevel:0, distance: 100, text:'master power control'},
            {size: 28, glitchLevel:0, distance: 30, text:'master power on'},
        ]
    },
    {
        coords: {x:2480,y:440},
        words: [
            {size: 14, glitchLevel:0, distance: 300, text:'a control panel'},
            {size: 20, glitchLevel:0, distance: 100, text:'life support\nsystem control'},
            {size: 28, glitchLevel:0, distance: 30, text:'life support\n powered up'},
        ]
    },
    {
        coords: {x:2820,y:300},
        words: [
            {size: 14, glitchLevel:0, distance: 300, text:'a control panel'},
            {size: 20, glitchLevel:0, distance: 100, text:'shuttle\nsystem control'},
            {size: 28, glitchLevel:0, distance: 30, text:'shuttle\n powered up'},
        ]
    },
    {
        coords: {x:3400,y:400},
        words: [
            {size: 14, glitchLevel:0, distance: 300, text:'a round porthole'},
            {size: 28, glitchLevel:0, distance: 100, text:'escape shuttle entrance'},
            {size: 72, glitchLevel:0, distance: 30, text:'blasting away\nto safety', trigger: 'win'},
        ]
    }
]

var decorations = [
    // outside the space station
    {
        coords: {x:120,y:280},
        words: [
            {size: 10, glitchLevel:0, distance: 80, text:'space junk'},
            {size: 14, glitchLevel:1, distance: 10,  text:'more detail'}
        ]
    },
    {
        coords: {x:280,y:360},
        words: [
            {size: 10, glitchLevel:0, distance: 80, text:'space junk'},
            {size: 14, glitchLevel:0, distance: 10,  text:'more detail'}
        ]
    },
    {
        coords: {x:465,y:170},
        words: [
            {size: 10, glitchLevel:0, distance: 80, text:'space junk'},
            {size: 14, glitchLevel:0, distance: 10,  text:'more detail'}
        ]
    },
    {
        coords: {x:670,y:450},
        words: [
            {size: 10, glitchLevel:0, distance: 80, text:'space junk'},
            {size: 14, glitchLevel:0, distance: 10,  text:'more detail'}
        ]
    },
    {
        coords: {x:960,y:500},
        words: [
            {size: 10, glitchLevel:0, distance: 80, text:'space junk'},
            {size: 14, glitchLevel:0, distance: 10,  text:'more detail'}
        ]
    },
    {
        coords: {x:750,y:85},
        words: [
            {size: 10, glitchLevel:0, distance: 100, text:'space junk'},
            {size: 14, glitchLevel:1, distance: 10,  text:'more detail'}
        ]
    },
    
    // Inside the space station
    {
        coords: {x:1340,y:140},
        words: [
            {size: 10, glitchLevel:0, distance: 50, text:'a doodad'},
            {size: 14, glitchLevel:0, distance: 10, text:'something interesting'}
        ]
    },
    {
        coords: {x:1460,y:515},
        words: [
            {size: 10, glitchLevel:0, distance: 50, text:'a doodad'},
            {size: 14, glitchLevel:0, distance: 10, text:'something interesting'}
        ]
    },
    {
        coords: {x:1690,y:410},
        words: [
            {size: 10, glitchLevel:0, distance: 50, text:'a doodad'},
            {size: 14, glitchLevel:0, distance: 10, text:'something interesting'}
        ]
    },
    {
        coords: {x:1800,y:180},
        words: [
            {size: 10, glitchLevel:0, distance: 50, text:'a doodad'},
            {size: 14, glitchLevel:0, distance: 10, text:'something interesting'}
        ]
    }
]


var danger = [
    {
        coords: xy(600, 550),
        words: [
            {size:12, glitchLevel: 0, distance: 120, text: 'a shining speck of light',},
            {size:18, glitchLevel: 1, distance: 80, text: 'noise and chaos', trigger: 'death'},
            {size:36, glitchLevel: 5, distance: 50, text: 'EXPLOSION', trigger: 'death'}
        ]
    },
    {
        coords: {x:1950,y:490},
        words: [
            {size: 10, glitchLevel:0, distance: 100, text:'a doodad'},
            {size: 12, glitchLevel:0, distance: 80, text:'quite interesting', trigger: 'death'},
            {size: 14, glitchLevel:1, distance: 50, text:'DANGER', trigger: 'death'},
        ]
    },
    {
        coords: xy(2600, 150),
        words: [
            {size:12, glitchLevel: 0, distance: 100, text: 'a plain button',},
            {size:18, glitchLevel: 0, distance: 50, text: 'it is really tempting', trigger: 'death'},
            {size:36, glitchLevel: 4, distance: 49, text: 'EXPLOSION', trigger: 'death'}
        ]
    },
]

var mineData = [];
[checkpoints, landmarks, decorations, danger].forEach(function(category) { mineData = mineData.concat(category); });
