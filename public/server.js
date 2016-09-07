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

var landmarks = [
    {
        id: 'l0',
        coords: {x:960,y:270},
        words: [
            //{size: 36, glitchLevel:0, distance: 400, text:'an\norbiting\nmass'},
            {size: 24, glitchLevel:0, distance: 400, text:'a ruined\nspace station'},
            //{size: 36, glitchLevel:0, distance: 200, text:'one functioning port', pbatch:'ss', triggers: {'checkpoint': 1}},
            {size: 48, glitchLevel:0, distance: 200, text:'one functioning port\n[+][ ]', pbatch:'ss', triggers: {
              'checkpoint': 1,
              'showArea': 'spacestation',
              'hideArea': 'outside'
            }},
            {size: 48, glitchLevel:0, distance: 10, text:'inside the\nspace station'}
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
            {size: 20, glitchLevel:0, distance: 100, text:'life support\nsystem control', triggers: {'lifeSupportOn': 1}},
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
            {size: 28, glitchLevel:0, distance: 100, text:'escape shuttle entrance', triggers: {'win': 1}},
            {size: 72, glitchLevel:0, distance: 30, text:'blasting away\nto safety'},
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
        coords: xy(450, 350),
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
            {size: 10, glitchLevel:0, distance: 100, text:'a doodad'},
            {size: 12, glitchLevel:0, distance: 80, text:'quite interesting', triggers: {'death': 1}},
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

// TESTING - nonlevelling mines
mineData.push({
    id: 'nl0',
    coords: xy(250, 100),
    words: [
        {size:10, distance: 50, text: 'test1'},
        {size:16, distance: 0, text: 'test1b', color: '#ADD8E6', levelDownDistance: 80}
    ]
})
mineData.push({
    id: 'nl1',
    coords: xy(100, 300),
    words: [
        {size:10, distance: 120, text: 'something to investigate'},
        {size:16, distance: 50, text: 'investigating...', color: '#ADD8E6', levelDownDistance: 120},
        {size:16, distance: 0, text: 'something interesting', color: '#4AB8DC'}
    ]
})


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
// ======  server/game.js
Game.prototype.addPlayer = function(name, socket) {
    var newbie = new Player({name: name, game: this, checkpoint: xy(200,50)});
    newbie.socket = socket;
    // TODO: set player checkpoint?
    // TODO: also give players some coords 

    this.players.push(newbie);

    this.emit('player_joined', {
        name: newbie.name
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

    setTimeout(function() { self.tick(); }, Settings.tickTimeout)
}

Game.prototype.win = function() {
    this.stage = game_stages.ending;
    this.emit('game-over', {
        reason: 'You have found the shuttle!' 
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

            payload.game.emit('update_mine', {
                mine_index: data.mine_index,
                mine: payload.mine.data()
            })
        }
    })

    // `CRUNCH - COMBINE WITH ABOVE **
    socket.bind("mine_level_down", function(data) {
        // expect: data.code, data.mine_index, data.name
        var payload = vivify(data, socket);
        if (payload.mine && payload.game) {
            if (!payload.mine.canPlayerTrigger(payload.player)) return;

            payload.mine.trigger(payload.player);
            payload.mine.levelDown(payload.player);

            payload.game.emit('update_mine', {
                mine_index: data.mine_index,
                mine: payload.mine.data()
            })
        }
    })
    
    socket.bind("player-update-coords", function(data) {
        var payload = vivify(data, socket);
        payload.player.coords = payload.coords;
        
        // TODO: broadcast player coords to everyone, for nice position syncing. Maybe in the tick function
    })

    socket.bind("player-meet", function(data) {
        var payload = vivify(data, socket);
        var p1 = payload.player;
        var p2 = payload.player2;

        if (data.snapWire) {
            p1.removeWire(p2);
            p2.removeWire(p1);
            return;
        }

        // Debounce if lots of these signals get spammed at once
        if (p1.hasWireTo(p2)) return;

        p1.addWireTo(p2);
        p2.addWireTo(p1);
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

Mine.prototype.trigger = function(player) {
    var triggerList = this.getWord().triggers || {}; 
    for (var t in triggerList) {
        if (t in Triggers) Triggers[t](player, this, triggerList[t]);
    }
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
    this.emitUpdate();
}

Player.prototype.removeWire = function(player2) {
    if (!this.hasWireTo(player2)) return;
    this.wires.splice(this.wires.indexOf(player2.name), 1)
    this.emitUpdate();
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
