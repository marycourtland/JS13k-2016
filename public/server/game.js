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
    }, 2000)
}



// ----------- PUBLIC
var getGame = _.propFinder(games, 'code');
