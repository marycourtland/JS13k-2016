var game_stages = {
    intro: 0,
    gameplay: 1,
    ending: 2
}

function Game(data) {
    this.code = Math.round(Math.random() * 1e4).toString();
    this.players = [];
    this.mines = [];
    this.waypoints = []; // locations where players can save the game
    this.stage = game_stages.intro;
    if (data) this.updateFromData(data);
    this.init()
    this.log('game initialized')
}

Game.prototype = {};


// TODO: find a better way to do this
Game.prototype.init = function() {
    this.getPlayer = _.propFinder(this.players, 'name')
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
        waypoints: this.waypoints,
        mines: this.mines.map(getData),
        players: this.players.map(getData)
    }
}

Game.prototype.serialize = function() {
    var d = this.data();
    return JSON.stringify(this.data());
}


// MINES
Game.prototype.getMine = function(index) {
    return this.mines[Math.min(index, this.mines.length - 1)]
}



//TEMPORARY DEBUGGING - TODO delete
Game.prototype.log = function(text) {
    console.log(this.code + ' > ' + text);
}
