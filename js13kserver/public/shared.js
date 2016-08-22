// ======  shared/debug.js
// None of these functions (or their calls) should be needed in final build.

function m(n, extra) { extra = extra || ''; console.log('M' + n + ' ' + extra)}

Game.prototype.log = function(log) {
   console.log(this.code + ' > ' + log)
}
// ======  shared/game.js
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

// MINES
Game.prototype.getMine = function(index) {
    return this.mines[Math.min(index, this.mines.length - 1)]
}



//TEMPORARY DEBUGGING - TODO delete
Game.prototype.log = function(text) {
    console.log(this.code + ' > ' + text);
}
// ======  shared/index.js
// ======  shared/math.js

function xy(x, y) {
    return {x:x, y:y};
}
// ======  shared/mine.js
// Each word data looks like:
// {
//   text: 'abc',    // displayed word
//   size: 12,       // displayed size
//   glitchLevel: 2, // displayed glitch level
//   distance: 30    // distance at which it increments to next word
// }

function Mine(data) {
    data = data || {};
    this.words = data.words;
    this.coords = data.coords;
    this.game = data.game;
    this.level = data.level || 0;
}

Mine.prototype = {};

Mine.prototype.data = function() {
    return {
        words: this.words,
        coords: this.coords,
        game: this.game.code,
        level: this.level
    }
}

Mine.prototype.render = function() {}; // client will overwrite

Mine.prototype.levelUp = function() {
    this.level += 1;
    this.render();
}

Mine.prototype.levelDown = function() {
    this.level -= 1;
    this.render();
}
// ======  shared/player.js
function Player(name, game) {
    this.name = name;
    this.game = game;
    this.waypoint = xy(0,0);
    this.glitchLevel = 0;
    this.coords = xy(100,100);
}

Player.prototype = {};

Player.prototype.data = function() {
    return {
        name: this.name,
        game: this.game.code,
        waypoint: this.waypoint,
        glitchLevel: this.glitchLevel
    }
}
// ======  shared/socket.js
function setupSocket(socket) {
    var _emit = socket.emit;
    socket.emit = function() {
        console.log(socket.id + ' emit: ' + arguments[0])
        _emit.apply(socket, arguments);
    }

    socket.bind = function(signal, callback) {
        callback = ensureFunction(callback);
        socket.on(signal, function() {
            console.log(socket.id + ' > ' + signal);
            callback.apply(null, arguments);
        })
    }

    return socket;
}

// ======  shared/utils.js
var _ = {};
if (typeof window !== 'undefined') window._ = _;

function ensureFunction(f) {
    return (typeof f === 'function') ? f : function() {}
}

_.propFinder = function(objArray, property) {
    return function(value) {
        var matches = objArray.filter(function(obj) {
            return obj[property] === value;
        })
        return (matches.length > 0) ? matches[0] : null;
    }
}

_.mapProp = function(objArray, property) {
    return objArray.map(function(obj) { return obj[property]; })
}
