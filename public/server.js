// ======  server/data.js
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
// ======  server/game.js
Game.prototype.addPlayer = function(name, socket) {
    var newbieCoords = xy(40, randInt(40, 440));
    var newbie = new Player({
        name: name,
        game: this,
        coords: newbieCoords,
        checkpoint: newbieCoords // TODO: is this going to get mutated?
    });
    newbie.socket = socket;
    // TODO: set player checkpoint?
    // TODO: also give players some coords 

    this.players.push(newbie);

    this.emit('player_joined', {
        name: newbie.name,
        data: newbie.data()
    })

    this.log('new player: ' + name);
    return newbie;
}

Game.prototype.populate = function() {
    var self = this;
    var mines = generateMineData();
    mines.forEach(function(m) {
        m.game = self;
        self.addMine(new Mine(m));
        var mine = self.mines[self.mines.length - 1];
    })
}

Game.prototype.addMine = function(mine) {
    mine.index = this.mines.length;
    mine.game = this;
    this.mines.push(mine);
    return this;
}

Game.prototype.getArea = function(area) {
    return this.mines.filter(function(m) { return m.area === area; });
}


// TODO: change this to a single socket room
Game.prototype.emit = function(signal, data, options) {
    options = options || {};
    if (!data.game) data.game = this.serialize();
    this.eachPlayer(function(player) {
        player.socket.emit(signal, data);
    })
    return this;
}


Game.prototype.start = function() {
    var self = this;
    self.stage = game_stages.gameplay;
    setTimeout(function() { self.tick(); }, Settings.tickTimeout);
}

// ticks happen at macroscopic intervals (like ~5 seconds)
Game.prototype.tick = function() {
    var self = this;
    if (self.stage !== game_stages.gameplay) return;

    if (self.drainOxygen) {
        self.eachPlayer(function(player) {
            player.drainOxygen(Settings.oxygenDrain);
        })
    }

    self.emit('tick', {}); // If we need a synchronized clock, send it here

    setTimeout(function() { self.tick(); }, Settings.tickTimeout)
}

Game.prototype.win = function() {
    this.stage = game_stages.ending;
    this.emit('game-over', {
        reason: 'You have escaped!' 
    })
}

Game.prototype.lose = function() {
    var self = this;
    self.stage = game_stages.ending;

    // Why the timeout? Because it gives the players a moment to see
    // what happened in the game space
    setTimeout(function() {
        self.emit('game-over', {
            reason: 'Someone ran out of oxygen.'
        })
    }, 2000)
}



// ----------- PUBLIC
var getGame = _.propFinder(games, 'code');
// ======  server/index.js
// All games in session (indexed by code)
var games = {};


// Look up properties and get relevant
// todo: vivify data.name > data.player if game player exists
function vivify(data, socket) {
    if (data.code) {
        if (!(data.code in games)) return socket.emit('bad_code');
        data.game = games[data.code];

        if ('mine_index' in data) {
            data.mine = data.game.getMine(data.mine_index);
        }

        if ('name' in data) {
            data.player = data.game.getPlayer(data.name);
        }

        if ('name2' in data) {
            data.player2 = data.game.getPlayer(data.name2);
        }
    }

    if (data.coords) {
        data.coords.x = parseFloat(data.coords.x);
        data.coords.y = parseFloat(data.coords.y);
    }

    return data;
}


/**
 * Socket.IO on connect event
 * @param {Socket} socket
 */
module.exports = function (socket) {
    console.log(socket.id + ' > connect');

    setupSocket(socket);

    socket.bind("disconnect", function () {
        // todo: clean up game
    });

    socket.bind("error", function(data) {console.log("error data:", data)})

    socket.bind("new_game", function(data) {
        // expect: data.name
        var payload = vivify(data, socket);
        var game = new Game();
        games[game.code] = game;
        game.populate();
        game.addPlayer(payload.name, socket);

        game.start();
    })

    socket.bind("join_game", function(data) {
        // expect: data.code, data.name
        var payload = vivify(data, socket);
        if (payload.game) payload.game.addPlayer(payload.name, socket)
    })


    // GAMEPLAY
    socket.bind("mine_level_up", function(data) {
        // expect: data.code, data.mine_index, data.name
        var payload = vivify(data, socket);
        if (payload.mine && payload.game) {
            if (!payload.mine.canPlayerTrigger(payload.player)) return;

            payload.mine.trigger(payload.player);
            payload.mine.levelUp(payload.player);
            payload.mine.emitUpdate();

        }
    })

    socket.bind("mine_level_down", function(data) {
        // expect: data.code, data.mine_index, data.name
        var payload = vivify(data, socket);
        if (payload.mine && payload.game) {
            if (!payload.mine.canPlayerTrigger(payload.player)) return;

            payload.mine.levelDown(payload.player);
            payload.mine.emitUpdate();
        }
    })
    
    socket.bind("player-update-coords", function(data) {
        var payload = vivify(data, socket);
        payload.player.coords = payload.coords;

        // todo: if we had the original nonvivified copy of the data,
        // we could just cleanly forward it
        payload.game.emit('player-update-coords', {
            code: payload.game.code,
            name: payload.player.name,
            coords: payload.coords
        })
        
        // TODO: broadcast player coords to everyone, for nice position syncing. Maybe in the tick function
    })

    socket.bind("player-meet", function(data) {
        var payload = vivify(data, socket);
        var p1 = payload.player, p2 = payload.player2;

        // Debounce if lots of these signals get spammed at once
        if (p1.hasWireTo(p2)) return;

        p1.addWireTo(p2);
        p2.addWireTo(p1);
    })

    socket.bind('player-snap', function(data) {
        var payload = vivify(data, socket);
        var p1=payload.player, p2=payload.player2;
        p1.removeWire(p2);
        p2.removeWire(p1);
        
    })


    // "Forwarding" signals: send the same event to all players in the game
    // (with no involvement from the server)
    var forwardSignals = [
        'player-move-start',
        'player-move-stop'
    ]

    forwardSignals.forEach(function(signal) {
        socket.bind(signal, function(data) {
            // no need to vivify
            games[data.code].emit(signal, data);
        })
    })
};

// ======  server/mine.js
Mine.prototype.increment = function() {
   this.stage += 1; 
}

Mine.prototype.emitUpdate = function() {
    this.game.emit('update_mine', {
        mine_index: this.index,
        mine: this.data()
    })
}

Mine.prototype.trigger = function(player) {
    player._lastTriggeredMine = this.id;

    var triggerList = this.getWord().triggers || {}; 
    for (var t in triggerList) {
        if (t in Triggers) Triggers[t](player, this, triggerList[t]);
    }
}

// TODO `CRUNCH: so.... this is the same as the Player.addWireTo method.
// could stick the same method on the two prototypes
Mine.prototype.addWireTo = function(mine2) {
    if (this.hasWireTo(mine2)) return;
    //console.log(this.id, '*** ADDING WIRE')
    this.wires.push(mine2.id);
    this.game.emit('wire-add', {
        wire_id: getWireId(this.id, mine2.id)
    })
    this.emitUpdate();
    var self = this;
    //console.log(this.id, '*** GOING TO PROPAGATE POWER DOWN WIRE')
    setTimeout(function() {
        //console.log(self.id, '*** PROPAGATING POWER DOWN WIRE')
        self.propagatePower();
    }, 200)
}

Mine.prototype.powerUp = function() {
    //console.log(this.id, '   POWERUP:', this.id)
    if (!this.powered) this.powered = 0.5;
    this.game.emit('mine-powerup', {
        mine_index: this.index,
        powered: this.powered
    })
}

Mine.prototype.propagatePower = function() {
    var self = this;
    if (self.powered === 0) return;
    //console.log(this.id, '---PROPAGATING POWER this.powered=' + self.powered + ' this.wires=' + JSON.stringify(this.wires));
    self.powerUp(); // emits update
    self.wires.forEach(function(mine_id) {
       // console.log(self.id,'   PROPAGATION TO:', mine_id)
        var mine2 = self.game.getMineById(mine_id);
        if (!!mine2.powered) return; // it probably already propagated
        mine2.powerUp();
        setTimeout(function() { mine2.propagatePower(); }, 200);
    })

}
// ======  server/player.js
Player.prototype.emitUpdate = function() {
    this.game.emit('player-update', {name: this.name, player: this.data()})
}

Player.prototype.setCheckpoint = function(coords) {
    this.checkpoint = coords;
    this.socket.emit('checkpoint', {
        coords: coords
    })
}

Player.prototype.addWireTo = function(player2) {
    if (this.hasWireTo(player2)) return;
    this.wires.push(player2.name);

    // it would be nice to not have two emits here... but oh well.
    this.game.emit('wire-add', {
        wire_id: getWireId(this.name, player2.name)
    })
    this.emitUpdate();
}

Player.prototype.removeWire = function(player2) {
    if (!this.hasWireTo(player2)) return;
    this.wires.splice(this.wires.indexOf(player2.name), 1)
    this.game.emit('wire-remove', {
        player1: this.name,
        player2: player2.name
    });
}


Player.prototype.drainOxygen = function(amt) {
    this.oxygen = clamp(this.oxygen - amt, 0, 1);
    this.emitUpdate();
    if (this.oxygen <= 0) this.reallyDie();
}


Player.prototype.die = function() {
    this.coords = this.checkpoint;
    this.glitchLevel += Settings.glitchPerDeath;
    this.game.emit('die', {
        name: this.name,
        player: this.data()
    });
}

Player.prototype.reallyDie = function() {
    // Died from oxygen.
    this.game.lose();
}
// ======  server/triggers.js
var Triggers = {};

Triggers['death'] = function(player, mine) {
    player.die();
}

Triggers['checkpoint'] = function(player, mine) {
    player.setCheckpoint(mine.coords);
}

Triggers['oxygen'] = function(player, mine, amount) {
    player.drainOxygen(-amount);
}

Triggers['hide'] = function(player, mine) {
    if (mine.hidden) return;
    // TODO: if any more mine.hidden code, do a mine.hide()
    mine.hidden = 1;
    mine.game.emit('update_mine', {mine_index: mine.index, mine: mine.data()})
}

var displayTriggers = ['showArea', 'hideArea'];
displayTriggers.forEach(function(trigger) {
    Triggers[trigger] = function(player, mine, area) {
        mine.game.getArea(area).forEach(function(m) {
            m.hidden = (trigger === 'hideArea');
            mine.game.emit('update_mine', {mine_index: m.index, mine: m.data()})
        })
    }
})

Triggers['spawn'] = function(player, mine, spawnData) {
    // TODO: infinite spawning (count=-1)

    var angles = range(0, 2*Math.PI, 2*Math.PI/spawnData.count);
    // TODO: shuffle angles first so that it looks more random?

    for (var i = 0; i < angles.length; i++) {
        spawnData.params.coords = V.add(mine.coords, V.rth(spawnData.distance, angles[i]));
        var spawnedMine = new Mine(templates[spawnData.template](spawnData.params))

        spawnedMine.area = spawnedMine.area || mine.area;

        mine.game.addMine(spawnedMine).emit('update_mine', {
            new: 1, 
            delay: spawnData.delay + i * spawnData.pause,
            mine_index: spawnedMine.index,
            mine: spawnedMine.data()
        })
    }
}

// WIRING MINES TOGETHER
Triggers['wire'] = function(player, mine, data) {
    // ASSUMPTION: mine.wirable = true
    player.forEachWire(function(player2) {
        var mine2 = player2.getCloseMine();
        if (!mine2 || !mine2.wirable) return;
        if (mine2.hasWireTo(mine)) return;
        if (mine.hasWireTo(mine2)) return;

        // if the player is within a good distance of a wirable mine, then we're good to go!!
        mine.addWireTo(mine2);
        mine2.addWireTo(mine);
        player.removeWire(player2);
        player2.removeWire(player);
    })
}


// GAME STATE

Triggers['win'] = function(player, mine) {
    player.game.win();
}


// Systems

Triggers['lifeSupportOn'] = function(player, mine) {
    player.game.drainOxygen = 0;
    player.game.eachPlayer(function(p) {
        p.drainOxygen(-(1 - p.oxygen))
    })
}

Triggers['setPower'] = function(player, mine, powerLevel) {
    var newPower = (mine.powered === 0);
    mine.powered = powerLevel;
    if (newPower) mine.propagatePower();
}
