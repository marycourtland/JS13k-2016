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
    this.log('game initialized')
}

Game.prototype = {};

Game.prototype.updateFromData = function(data) {
    if (data.mines) {
        data.mines = data.mines.map(function(mineData) { return new Mine(mineData); })
    }
    for (var property in data) {
        this[property] = data[property];
    }
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
    return JSON.stringify(this.data());
}

//TEMPORARY DEBUGGING - TODO delete
Game.prototype.log = function(text) {
    console.log(this.code + ' > ' + text);
}
