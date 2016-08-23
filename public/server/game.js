Game.prototype.addPlayer = function(name, socket) {
    var newbie = new Player({name: name, game: this});
    newbie.socket = socket;
    // TODO: set player waypoint?
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
