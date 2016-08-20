// ======  server/game.js
Game.prototype.addPlayer = function(name, socket) {
    var newbie = new Player(name, this);
    newbie.socket = socket;
    // TODO: set player waypoint?
    // TODO: also give players some coords 

    this.players.push(newbie);

    var gameData = this.serialize();
    this.emit('player_joined', {
        game: gameData,
        name: newbie.name
    })

    this.log('new player: ' + name);
    return newbie;
}

Game.prototype.populate = function() {
    // Sample data for now
    this.addMine(new Mine({
        game: this,
        coords: xy(400, 500),
        words: [
            {text: 'a drifting space station', size:12, glitchLevel: 0, distance: 150},
            {text: "it's a huge wreck", size:16, glitchLevel: 2, distance: 0}
        ]
    }))

    this.addMine(new Mine({
        game: this,
        coords: xy(550, 250),
        words: [
            {text: 'a shining speck of light', size:12, glitchLevel: 0, distance: 120},
            {text: 'noise and chaos', size:18, glitchLevel: 3, distance: 80},
            {text: 'EXPLOSION', size:36, glitchLevel: 5, distance: 0}
        ]
    }))
}

Game.prototype.addMine = function(mine) {
    this.mines.push(mine);
}

// TODO: change this to a single socket room
Game.prototype.emit = function() {
    var args = arguments;
    this.players.forEach(function(player) {
        player.socket.emit.apply(player.socket, args)
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


// Look up properties and get relevant objects
function vivify(data, socket) {
    if (data.code) {
        if (!(data.code in games)) return socket.emit('bad_code');
        data.game = games[data.code];
    }

    if (data.game && data.name) {
        // TODO: look up player object in game.players
        // ... except if this is coming from join_game, then there might not be a player yet
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
        data = vivify(data, socket);
        var game = new Game();
        games[game.code] = game;
        game.populate();
        game.addPlayer(data.name, socket);
    })

    socket.bind("join_game", function(data) {
        // expect: data.code, data.name
        data = vivify(data, socket);
        if (data.game) data.game.addPlayer(data.name, socket)
    })
};

// ======  server/mine.js
Mine.prototype.increment = function() {
   this.stage += 1; 
}
