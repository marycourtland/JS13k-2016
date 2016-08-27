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
    this.checkpoints = []; // locations where players can save the game
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
        checkpoints: this.checkpoints,
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
//   distance: 30,   // distance at which it increments to next word
//   trigger: 'whatever' // optional action to trigger
// }

function Mine(data) {
    data = data || {};
    this.words = data.words;
    this.coords = data.coords;
    this.game = data.game;
    this.level = data.level || 0;
    this.singlePlayerOnly = data.singlePlayerOnly || false;
}

Mine.prototype = {};

Mine.prototype.data = function() {
    return {
        words: this.words,
        coords: this.coords,
        game: this.game.code,
        level: this.level,
        singlePlayerOnly: this.singlePlayerOnly
    }
}

Mine.prototype.render = function() {}; // client will overwrite

Mine.prototype.getWord = function(i) {
    if (typeof i === 'undefined') i = this.level;
    return this.words[Math.min(i, this.words.length - 1)];
}


Mine.prototype.levelUp = function() {
    this.level += 1;
    this.render();
}

Mine.prototype.levelDown = function() {
    this.level -= 1;
    this.render();
}
// ======  shared/player.js
function Player(data) {
    data = data || {};
    this.updateFromData(data);
}

Player.prototype = {};

Player.prototype.updateFromData = function(data) {
    this.name = data.name;
    this.game = data.game;
    this.checkpoint = data.checkpoint || xy(0,0);
    this.glitchLevel = data.glitchLevel || 0;
    this.coords = data.coords || xy(100,100);
}


Player.prototype.data = function() {
    return {
        name: this.name,
        game: this.game.code,
        checkpoint: this.checkpoint,
        glitchLevel: this.glitchLevel,
        coords: this.coords
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
