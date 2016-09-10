var game_stages = {
    intro: 0,
    gameplay: 1,
    ending: 2
}

function Game(data) {
    this.code = randInt(1e4).toString();
    this.players = [];
    this.mines = [];
    this.checkpoints = []; // locations where players can save the game
    this.stage = game_stages.intro;
    if (data) this.updateFromData(data);
    this.init()
    this.log('game initialized')

    // TODO detect this after everyone joins the game
    this.numPlayers = 2;

    // GAMEPLAY
    this.drainOxygen = 1;
}

Game.prototype = {};


// TODO: find a better way to do this
Game.prototype.init = function() {
    this.getPlayer = _.propFinder(this.players, 'name')
    this.getMineById = _.propFinder(this.mines, 'id')
}

Game.prototype.updateFromData = function(data) {
    ['Mine', 'Player'].forEach(function(obj) {
        var prop = obj.toLowerCase() + 's';
        var Obj = eval(obj);
        if (data[prop]) data[prop] = data[prop].map(function(d) { return new Obj(d); })
    })
    for (var property in data) {
        this[property] = data[property];
    }
    this.init();
}

Game.prototype.data = function() {
    var getData = function(obj) { return obj.data(); }
    return {
        code: this.code,
        stage: this.stage,
        checkpoints: this.checkpoints,
        mines: this.mines.map(getData),
        players: this.players.map(getData)
    }
}

Game.prototype.serialize = function() {
    return JSON.stringify(this.data());
}

// PLAYERS
Game.prototype.eachPlayer = function(callback) {
    var self = this;
    self.players.forEach(function(p) { callback.call(self, p); })
}


// MINES
Game.prototype.getMine = function(index) {
    return this.mines[Math.min(index, this.mines.length - 1)]
}



//TEMPORARY DEBUGGING - TODO delete
Game.prototype.log = function(text) {
    console.log(this.code + ' > ' + text);
}
