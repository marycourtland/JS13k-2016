var sampleMines = [
    {
        coords: xy(50, 50),
        words: [
            {size:10, glitchLevel: 0, distance: 20, text: 'checkpoint', trigger: 'checkpoint'},
            {size:10, glitchLevel: 0, distance: 0, text: "checked"}
        ]
    },
    {
        coords: xy(400, 500),
        words: [
            {size:12, glitchLevel: 0, distance: 150, text: 'a drifting space station'},
            {size:16, glitchLevel: 2, distance: 0, text: "it's a huge wreck"}
        ]
    },
    {
        coords: xy(550, 250),
        words: [
            {size:12, glitchLevel: 0, distance: 120, text: 'a shining speck of light',},
            {size:18, glitchLevel: 3, distance: 80, text: 'noise and chaos', trigger: 'death'},
            {size:36, glitchLevel: 5, distance: 0, text: 'EXPLOSION'}
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
