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
    this.mines.push(mine);
}

Game.prototype.getArea = function(area) {
    return this.mines.filter(function(m) { return m.area === area; });
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
