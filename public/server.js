// ======  server/data.js
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
            {size:8, distance: 30, text: 'oxygen', triggers: ['oxygen', 'hide'], oxygen: 0.2},
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
// ======  server/game.js
// TODO: ...server side settings file?
var tickTimeout = 5000; // ms
var oxygenDrain = 0.05; // player will die in 20 ticks


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
    setTimeout(function() { self.tick(); }, tickTimeout);
}

// ticks happen at macroscopic intervals (like ~5 seconds)
Game.prototype.tick = function() {
    var self = this;
    if (self.stage !== game_stages.gameplay) return;

    if (self.drainOxygen) {
        self.eachPlayer(function(player) {
            player.drainOxygen(oxygenDrain);
        })
    }

    setTimeout(function() { self.tick(); }, tickTimeout)
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
    }, 5000)
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
    
    socket.bind("player-update-coords", function(data) {
        var payload = vivify(data, socket);
        payload.player.coords = payload.coords;
        
        // TODO: broadcast player coords to everyone. Maybe in the tick function
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
    var triggerList = this.getWord().triggers || [];
    var self = this;
    triggerList.forEach(function(t) {
        if (t in Triggers) Triggers[t](player, self);
    })
}
// ======  server/player.js
// TODO: ...server side settings file?
var glitchPerDeath = 1;
var oxygenDrain = 0.05; // player will die in 20 ticks

Player.prototype.setCheckpoint = function(coords) {
    this.checkpoint = coords;
    this.socket.emit('checkpoint', {
        coords: coords
    })
}

Player.prototype.drainOxygen = function(amt) {
    this.oxygen = clamp(this.oxygen - amt, 0, 1);
    this.game.emit('player-update', {name: this.name, player: this.data()})
    if (this.oxygen <= 0) this.reallyDie();

}


Player.prototype.die = function() {
    this.coords = this.checkpoint;
    this.glitchLevel += glitchPerDeath;
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

Triggers['oxygen'] = function(player, mine) {
    player.drainOxygen(-mine.getWord().oxygen);
}

Triggers['hide'] = function(player, mine) {
    if (mine.hidden) return;
    // TODO: if any more mine.hidden code, do a mine.hide()
    mine.hidden = 1;
    mine.game.emit('update_mine', {mine_index: mine.index, mine: mine.data()})
}

var displayTriggers = ['showArea', 'hideArea'];
displayTriggers.forEach(function(trigger) {
    Triggers[trigger] = function(player, mine) {
        mine.game.getArea(mine.getWord()[trigger]).forEach(function(m) {
            m.hidden = (trigger === 'hideArea');
            mine.game.emit('update_mine', {mine_index: m.index, mine: m.data()})
        })
    }
})

Triggers['spawn'] = function(player, mine) {
    // TODO: infinite spawning (count=-1)
    var spawnData = mine.getWord().spawn;

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
