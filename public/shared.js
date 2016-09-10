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
    var d = this.data();
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
// ======  shared/index.js
// ======  shared/math.js
// TODO `crunch: see if these are actually being used a lot
// Also see about Math.min Math.max
var cos = Math.cos;
var sin = Math.sin;
var sqrt = Math.sqrt;
var random = Math.random;


function randFloat(min, max) {
    if (typeof max === 'undefined') {
        max = min;
        min = 0;
    }

    return min + random() * (max - min);
}

function randInt(min, max) { // inclusive
    return Math.floor(randFloat(min, max));
}

function clamp(n, min, max) {
    return Math.max(Math.min(n, max), min);
}

function range(min, max, step) {
    step = (typeof step === 'undefined') ? 1 : step;
    var r = [];
    for (var i = min; i < max; i += step) { r.push(i); }
    return r;
}

var distance = function(v1, v2) { return Math.sqrt(Math.pow(v1.x - v2.x, 2) + Math.pow(v1.y - v2.y, 2)); }


function xy(x, y) {
    return {x:x, y:y};
}

function absMin(a, b) {
    return (Math.abs(a) < Math.abs(b)) ? a : b;
}

function sign(a) {
    return Math.abs(a) / a;
}

var V = {};

V.add = function(p1, p2) {
    return xy(p1.x + p2.x, p1.y + p2.y);
}

V.subtract = function(p1, p2) {
    return xy(p1.x - p2.x, p1.y - p2.y);
}

V.rth = function(r, theta) {
    return xy(
        r * cos(theta),
        r * sin(theta)
    )
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
    this.updateFromData(data);
}

Mine.prototype = {};

Mine.prototype.updateFromData = function(data) {
    this.id = data.id;
    this.words = data.words;
    this.coords = data.coords;
    this.hidden = data.hidden || 0;
    this.area = data.area || '';
    this.game = data.game;
    this.level = data.level || 0;
    this.singlePlayerOnly = data.singlePlayerOnly || 0; // TODO `crunch is this used...?
    this.wires = data.wires || [];
    this.wirable = data.wirable || 0;
    this.levelDownDistance = data.levelDownDistance || 0;
    this.powered = 0;

    // `crunch also populate words with default data (like glitchLevel=0)
}

Mine.prototype.data = function() {
    return {
        id: this.id,
        words: this.words,
        coords: this.coords,
        hidden: this.hidden,
        area: this.area,
        game: this.game.code,
        level: this.level,
        singlePlayerOnly: this.singlePlayerOnly,
        wirable: this.wirable,
        wires: this.wires,
        levelDownDistance: this.levelDownDistance,
        powered: this.powered
    }
}

Mine.prototype.getWord = function(i) {
    if (typeof i === 'undefined') i = this.level;
    return this.words[Math.min(i, this.words.length - 1)];
}

Mine.prototype.canPlayerTrigger = function(player) {
    var w = this.getWord();

    // Did the player already trigger one of the words in the pbatch?
    // (Players can only do 1 word per pbatch.)
    if (w.pbatch && player.hasPBatch(this, w)) return false;

    // ... will add other stuff here

    return true;
}


Mine.prototype.levelUp = function(player) {
    var prevWord = this.getWord();
    if (prevWord.pbatch) player.addPBatch(this, prevWord);

    this.level += 1;
    this.level = Math.min(this.words.length - 1, this.level);
}

Mine.prototype.levelDown = function() {
    this.level -= 1;
    this.level = Math.max(0, this.level);
}

Mine.prototype.hasWireTo = function(mine2) {
    return this.wires.indexOf(mine2.id) !== -1;
}
// ======  shared/player.js
function Player(data) {
    data = data || {};
    this.updateFromData(data);
}

Player.prototype = {};

Player.prototype.updateFromData = function(data) {
    this.name = data.name;
    this.id = data.name; // for player/mine interop
    this.game = data.game;
    this.checkpoint = data.checkpoint || xy(0,0);
    this.glitchLevel = data.glitchLevel || 0;
    this.coords = data.coords || xy(40, randInt(40, 440));
    this.mineState = data.mineState || {};
    this.oxygen = (typeof data.oxygen === 'number') ? data.oxygen : 1;
    this.wires = data.wires || [];
}


Player.prototype.data = function() {
    return {
        name: this.name,
        id: this.id,
        game: this.game.code,
        checkpoint: this.checkpoint,
        glitchLevel: this.glitchLevel,
        coords: this.coords,
        mineState: this.mineState,
        oxygen: this.oxygen,
        wires: this.wires
    }
}

Player.prototype.getMineState = function(mine) {
    if (!(mine.id in this.mineState)) this.mineState[mine.id] = {
        pbatches: [],
        // will put more things here
    }
    return this.mineState[mine.id];
}

Player.prototype.addPBatch = function(mine, word) {
    this.getMineState(mine).pbatches.push(word.pbatch);
}

Player.prototype.hasPBatch = function(mine, word) {
    return (mine.id in this.mineState) && (this.mineState[mine.id].pbatches.indexOf(word.pbatch) !== -1);
}

Player.prototype.hasWireTo = function(player2) {
    return this.wires.indexOf(player2.name) !== -1;
}

// Looks for all other players on other ends of the wires that this player is holding,
// and executes callback for each of those players
Player.prototype.forEachWire = function(callback) {
    var self = this;
    self.wires.forEach(function(name) {
        var player2 = self.game.getPlayer(name);

        // ignore asymmetric/incomplete wires
        if (!player2.hasWireTo(self)) return;

        callback(player2);
    })
}

Player.prototype.lastTriggeredMine = function(callback) {
    return this.game.getMineById(this._lastTriggeredMine);
}
// ======  shared/settings.js
var Settings = {};

// SERVER SIDE ==============================
Settings.tickTimeout = 5000; // ms
Settings.oxygenDrain = 0.05; // player will die in 20 ticks
Settings.glitchPerDeath = 1;
Settings.playerWireRadius = 50; // if the player on the other side is closer than that, make a wire


// CLIENT SIDE ==============================

// margins control how far the player goes the view starts scrolling 
Settings.marginR = 0.4; // percent of the view
Settings.marginL = 0.2;

Settings.velocity = 5;

// wireNear and wireFar control when player wires form and break
Settings.wireNear = 30; // pixels
Settings.wireFar = 600; // pixels, as the crow flies 
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
//            console.log(socket.id + ' > ' + signal);
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

function getWireId(s1, s2) {
    return 'wire_' + [s1, s2].sort().join('_');
}
