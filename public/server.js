// ======  server/game.js
var sampleMines = [
    {
        coords: xy(50, 50),
        words: [
            {size:10, glitchLevel: 0, distance: 50, text: 'checkpoint', trigger: 'checkpoint'},
            {size:10, glitchLevel: 0, distance: 0, text: '[checkpoint]'}
        ]
    },
    {
        coords: xy(400, 500),
        words: [
            {size:12, glitchLevel: 0, distance: 150, text: 'a drifting space station'},
            {size:16, glitchLevel: 0, distance: 0, text: "it's a huge wreck"}
        ]
    },
    {
        coords: xy(550, 250),
        words: [
            {size:12, glitchLevel: 0, distance: 120, text: 'a shining speck of light',},
            {size:18, glitchLevel: 1, distance: 80, text: 'noise and chaos', trigger: 'death'},
            {size:36, glitchLevel: 5, distance: 50, text: 'EXPLOSION', trigger: 'death'}
        ]
    }
]
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
    // Sample data for now
    var self = this;
    sampleMines.forEach(function(m) {
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
