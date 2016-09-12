// ======  server/data.js
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


//var landmarks = [
mineData = [
    {
        id: 'l0',
        coords: {x:380,y:220},
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
        coords: {x:1000,y:220},
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
        coords: {x:1580,y:440},
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
        coords: {x:1680,y:120},
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
        coords: {x:2320,y:350},
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
        coords: {x:2400,y:200},
        words: [
            {size: 14, distance: 300, text:'a cylindrical airlock'},
            {size: 28, distance: 100, text:'escape shuttle entrance\n[ ][ ]', pbatch:'end'},
            {size: 28, distance: 100, text:'escape shuttle entrance\n[+][ ]', pbatch:'end', triggers: {'win': 1}},
            {size: 72, distance: 30, text:'blasting away\nto safety'},
        ]
    }
]
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
    mineData.forEach(function(m) {
        m.game = self;
        self.addMine(new Mine(m));
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

    socket.bind("disconnect", function () {});
    socket.bind("error", function(d1, d2) {console.log("error data:", d1, d2)})

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
        if (!mine2) return;
        if (!mine2.wirable) return;
        if (mine2.hasWireTo(mine)) return;
        if (mine.hasWireTo(mine2)) return;
        console.log(
            'NEW WIRE: ',
            player.name + '|' + mine.id,
            '..>>..',
            player2.name + '|' + mine2.id
        )

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
