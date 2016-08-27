// ======  server/data.js
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
// ======  server/game.js
Game.prototype.addPlayer = function(name, socket) {
    var newbie = new Player({name: name, game: this, checkpoint: xy(50,50)});
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
    this.mines.push(mine);
}

// TODO: change this to a single socket room
Game.prototype.emit = function(signal, data, options) {
    options = options || {};
    if (!data.game) data.game = this.serialize();
    this.players.forEach(function(player) {
        player.socket.emit(signal, data);
    })
}

// UNUSED
Game.prototype.getRoom = function() { return 'game_' + this.code; }


Game.prototype.start = function() {

}

Game.prototype.win = function() {

}

Game.prototype.lose = function() {

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
            payload.mine.trigger(payload.player);
            payload.mine.levelUp();
            payload.game.emit('update_mine', {
                mine_index: data.mine_index,
                mine: payload.mine.data()
            })
        }
    })
    
    socket.bind("player-update-coords", function(data) {
        var payload = vivify(data, socket);
        payload.player.coords = payload.coords;
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

function debugGame() {
    console.log('GAME:', games[Object.keys(games)[0]].serialize())
}
// ======  server/mine.js
Mine.prototype.increment = function() {
   this.stage += 1; 
}

Mine.prototype.trigger = function(player) {
    var t = this.getWord().trigger;
    if (t in Triggers) Triggers[t](player, this);
}
// ======  server/player.js
// TODO: ...server side settings file?
var glitchPerDeath = 0.5;

Player.prototype.setCheckpoint = function(coords) {
    this.checkpoint = coords;
    this.socket.emit('checkpoint', {
        coords: coords
    })
}

Player.prototype.die = function() {
    this.coords = this.checkpoint;
    this.glitchLevel += glitchPerDeath;
    this.game.emit('die', {
        name: this.name,
        player: this.data()
    });
}
// ======  server/triggers.js
var Triggers = {};

Triggers['death'] = function(player, mine) {
    console.log('TRIGGERING death')
    player.die();
}

Triggers['checkpoint'] = function(player, mine) {
    player.setCheckpoint(mine.coords);
}
