var templates = {};

// TEMPLATES

templates.explosion = function(params) {
    return {
        id: 'explosion' + params.id,
        coords: params.coords,
        area: params.area,
        lvl0border:1,
        noTerminal: 1,
        words: [
            {size: 14, glitchLevel: choice([0, 1]), distance: 200, text:'$cover'},
            {size: 12, glitchLevel: 2, distance: 50, text:'$explosion1', triggers: {'death': 1}},
            {size:36, glitchLevel: 4, distance: 49, text: '$explosion2', trigger: {
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
    }
}

templates.debris = function (params) {
    return {
        id: 'debris' + params.id,
        coords: params.coords,
        words: [
            {size:8, glitchLevel: 2, distance: 30, text: 'debris', triggers: {'death': 1}}
        ]
    }
}

templates.switch = function(params) {
    return {
        id: 'switch' + params.id,
        coords: params.coords,
        area: params.area,
        wirable: 1,
        words: [
            {size: 10, distance: 75, text:'$cover'},
            {size: 12, distance: 30, text:'power router node', triggers: {wire: 1}}
        ]
    }
}

templates.source = function(params) {
    return {
        id: 'source' + params.id,
        coords: params.coords,
        area: params.area,
        wirable: 1,
        words: [
            {size: 10, distance: 100, text:'$cover', triggers: {setPower: 1}},
            {size: 12, distance: 50, text:'$power', glitchLevel: choice([0, 1, 2]), triggers: {wire: 1}},
        ]
    }
}

templates.checkpoint = function(params) {
    return {
        id: 'checkpoint' + params.id,
        coords: params.coords,
        area: params.area,
        words: [
            {size:10, distance: 50, text: 'checkpoint\n[ ][ ]', pbatch:'cp', triggers: {'checkpoint': 1}},
            {size:10, distance: 50, text: 'checkpoint\n[+][ ]', pbatch:'cp', triggers: {'checkpoint': 1}},
            {size:10, distance: 0, text: 'checkpoint\n[+][+]'}
        ]
    }
}

templates.oxygen = function(params) {
    return {
        id: 'oxygen' + params.id,
        coords: params.coords,
        area: params.area,
        words: [
            {size:12, distance: 50, text: 'oxygen supply', triggers: {
              'spawn': {
                template: 'oxy',
                count:4,
                distance: 50,
                delay: 100,
                pause: 00,
                params: {
                    id: params.id
                    // coords will be filled in
                }
              },
              'hide': 1
            }}
        ]
    }
}

templates.oxy = function (params) {
    return {
        id: 'oxy' + params.id,
        coords: params.coords,
        words: [
            {size:8, distance: 30, text: 'oxygen', triggers: {'oxygen': 0.2, 'hide': 1} }
        ]
    }
}

// Random words
var randomWords = {
  cover: [
    'control\npanel',
    'tangled\nwires',
    'system\ncircuitry',
    'exposed\nmotherboard',
    'cluttered\nconsole',
    'messy\ncrawlspace',
    'prominent\nmainframe'
  ],
  power: [
    'solar\narray',
    'nuclear\ngenerator',
    'fusion\nreactor',
    'em drive',
    'thermal\nrecycler',
  ],
  explosion1: [
    'a shining speck\nof light',
    'a blinking\nlight',
    'mysterious\nticking noise',
    'pressurized\nnoxious gas',
    'a tempting\nbutton',
    "don't touch this.",
  ],
  explosion2: [
    'explosion',
    'power surge',
    'localized\ndetonation',
    'sudden blast'
  ]
}

var instructions = [
    [xy(200, 180), 'how to play:'],
    [xy(350, 250), '1.\nmove with arrow keys'],
    [xy(280, 380), '2.\nmeet your teammates\nto create wires'],
    [xy(600, 500), '3.\nplace both ends of the wire\n on two systems\nto connect them together'],
    [xy(800, 350), 'find & power up the shuttle\nso you can escape home!', '#466253'],
    [xy(1100, 480), 'do not run\nout of oxygen.', '#504247'],
]

// Every 300 pixels, should generate a Large Mine at a random Y coord in the center lane.
// Offset, should generate a Small Mine at a random Y coord in either the upper or lower edges.
// Center lane: landmarks, power switches, explosions.
// Edge lanes: power sources (smaller), oxygen, checkpoints, maybe power switches, decorations (if any).

var centerLane = [150, 450];
var upperEdge = [50, 150];
var lowerEdge = [450, 550];
var xstep = 400;
var xmax = 5000;
var start = 720;

function generateMineData() {
    var mines = [];
    
    // put the instructions && station entry first
    for (var i = 0; i < instructions.length; i++) {
        mines.push({
            id: 'instructions' + i,
            coords: instructions[i][0],
            words: [{size: 16, distance: 0, color: instructions[i][2] || '#465462', text: instructions[i][1]}]
        })
    }

    mines.push({
        id: 'l0',
        coords: xy(start, 150),
        words: [
            {size: 24, distance: 70, text:'entry to\nan abandoned\nspace station', pbatch:'ss'},
            {size: 24, distance: 70, text:'entry to\nan abandoned\nspace station\n[+][ ]', pbatch:'ss', triggers: {
              'checkpoint': 1,
              'showArea': 'spacestation',
              'hideArea': 'outside'
            }},
            {size: 36, distance: 10, text:'inside the\nspace station'}
        ]
    })
    
    // backwards order, argh
    var landmarks = [
        {
            id: 'l5',
            area: 'end',
            hidden: 1,
            words: [
                {size: 14, distance: 300, text:'a cylindrical airlock'},
                {size: 28, distance: 100, text:'escape shuttle entrance\n[ ][ ]', pbatch:'end'},
                {size: 28, distance: 100, text:'escape shuttle entrance\n[+][ ]', pbatch:'end', triggers: {'win': 1}},
                {size: 72, distance: 30, text:'blasting away\nto safety'},
            ]
        },
        {
            id: 'l4',
            area: 'spacestation',
            wirable: 1,
            words: [
                {size: 14, distance: 300, text:'$cover'},
                {size: 20, distance: 100, requirePower:1, requireWires: ['l3'], text:'shuttle\nsystem control', triggers: {wire: 1, showArea: 'end'}},
                {size: 28, distance: 30, text:'shuttle\npowered up'},
            ]
        },
        {
            id: 'l3',
            area: 'spacestation',
            wirable: 1,
            words: [
                {size: 14, distance: 300, text:'$cover'},
                {size: 20, distance: 100, requirePower: 1, text:'propulsion\nsystem control', triggers: {'lifeSupportOn': 1, wire: 1}},
                {size: 28, distance: 30, text:'propulsion system\npowered up', triggers: {wire: 1}},
            ]
        },
        {
            id: 'l2',
            area: 'spacestation',
            wirable: 1,
            words: [
                {size: 14, distance: 300, text:'$cover'},
                {size: 20, distance: 100, requirePower: 1, text:'life support\nsystem control', triggers: {'lifeSupportOn': 1, wire: 1}},
                {size: 28, distance: 30, text:'life support\npowered up', triggers: {wire: 1}},
            ]
        }
    ]

    // now start putting the landmark-y mines down the center lane
    var largeTypes = ['switch', 'explosion'];
    var i = 0;
    for (var x = start + xstep; x < xmax; x += xstep) {
        var coords = xy(x, randInt(centerLane[0], centerLane[1]));

        if (i%2 == 0) {
            var next = landmarks.pop(); // not sure why this is backwards
            if (next) {
                next.coords = coords;
                mines.push(next);
            }
            else {
              console.log('OOPS');
            }
        }
        else {
            var params = {id: i, coords: coords, area: 'spacestation'};
            var type = choice(largeTypes);
            largeTypes.forEach(function(lt) {
                if (type == lt) mines.push(templates[lt](params));
            })
        }
        i += 1;
    }

    // and supporting mines down the edges
    var smallTypes = ['source', 'oxygen', 'checkpoint'];

    var i = 0;
    for (var x = start + xstep*3/2; x < xmax; x += xstep) {
        
        var type = (i === 0) ? 'source' : choice(smallTypes);
        var edge = choice([upperEdge, lowerEdge]);
        var params = {id: i, coords: xy(x, randInt(edge[0], edge[1])), area: 'spacestation'};
        
        smallTypes.forEach(function(st) {
            if (type == st) mines.push(templates[st](params));
        })
        
        i += 1;
    }
    
    mines.forEach(function(mine) { if (mine.area === 'spacestation') mine.hidden = 1; })
    
    mines.forEach(function(mine) {
        // REPLACE RANDOM WORDS
        mine.words.forEach(function(w) {
            for (var alias in randomWords) {
                w.text = w.text.replace('$'+alias, choice(randomWords[alias]))
            }
        })
        
        // Append a terminal word to each mine to make things clean
        if (mine.noTerminal) return;
        var lastWord = mine.words[mine.words.length - 1];
        var terminal = {
            distance: -1, // never trigger it
            text: lastWord.text
        }
        var props = ['color', 'size', 'glitchLevel'];
        props.forEach(function(prop) {
          if (lastWord[prop]) terminal[prop] = lastWord[prop];
        })
        
        if (!!lastWord.triggers && 'wire' in lastWord.triggers) {
            terminal.triggers = {wire: lastWord.triggers.wire}; // ugh
        }
        
        mine.words.push(terminal);
        
    })
    return mines;
}
