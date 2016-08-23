// ======  client/animation.js
var reqAnimFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame;
var blankFunction = function() {};

function Animation(params) {
    this.onStart = params.onStart || blankFunction;
    this.onFrame = params.onFrame || blankFunction; 
    this.onStop = params.onStop || blankFunction; 
    this.running = false;
    this.frame = 0;
}

Animation.prototype = {};

Animation.prototype.start = function() {
    this.running = true;
    this.onStart();
    this.go();
}

Animation.prototype.go = function() {
    if (!this.running) { return; }
    this.frame += 1;
    var self = this;
    reqAnimFrame(function() { self.go(); });
    this.onFrame(this.frame);
}

Animation.prototype.stop = function() {
    this.running = false;
    this.onStop();
}


// `crunch: might not need pause/resume

Animation.prototype.pause = function() {
    this.running = false;
}

Animation.prototype.resume = function() {
    this.running = true;
    this.go();
}
// ======  client/game.js
Game.prototype.updateMines = function(player) {
    for (var i = 0; i < this.mines.length; i++) {
        // TODO: filter mines which are in view
        var mine = this.mines[i];
        var d = distance(player.coords, mine.coords);
        if (d < mine.getWord().distance) {
            g.actions['mine-level-up'](i);
        }
        else {
            // render the mine text at a different size
            g.views.updateMine(i, mine.interpolateSize(d, mine.level))
        }
    } 
}

// ======  client/html-utils.js
window.$ = function(id) {
    var $el = (typeof id === 'string') ? document.getElementById(id) : id;

    if (!$el) return $el;

    $el.text = function(text) { $el.textContent = text; return this; }

    $el.css = function(css) {
        for (var prop in css) $el.style[prop] = css[prop];
        return this;
    }
    $el.hide = function() { $el.css({display: 'none' }); return this; }
    $el.show = function() { $el.css({display: ''}); return this;  }

    $el.bind = function(id, callback) {
        $el.addEventListener('click', callback);
        return this;
    }


    return $el;
}

// ======  client/index.js
'use strict';

(function () {
    window.g = window.g || {};
    g.me = null;
    g.game = null;

    // for the game intro
    var inputs = {
        startSignal: 'new_game',
        name: '',
        code: ''
    };
    var pullInput = function(input) { inputs[input] = $("input-" + input).value; }

    var socket; //Socket.IO client

    // gameplay actions
    g.actions = {
        'mine-level-up': function(i) {
            var mine = g.game.mines[i];
            console.log('Mine levelled up:', mine.getWord().text)
            socket.emit('mine_level_up', {
                code: g.game.code,
                mine_index: i
            })
            mine.levelUp();
            g.views.updateMine(i);
        },

        'player-move-start': function(data) {
            data.code = g.game.code;
            socket.emit('player-move-start', data);
        },

        'player-move-stop': function(data) {
            data.code = g.game.code;
            socket.emit('player-move-stop', data);
        },

        'player-update-coords': function() {
            socket.emit('player-update-coords', {
                code: g.game.code,
                name: g.me.name,
                coords: g.me.coords
            })
        }
    }


    // direct input
    var actionClicks = {
        'game-new': function() {
            g.views.showNewGame();
        },

        'game-join': function() {
            inputs.startSignal = 'join_game';
            g.views.showJoinGame();
        },

        'start': function() {
            ['name', 'code'].forEach(pullInput);
            socket.emit(inputs.startSignal, inputs);
        }
    }

    // signals from server
    var listeners = {
        'player_joined': function(data) {
            // expect: data.game, data.name
            if (data.name === inputs.name) {
                initGame(data);
                g.views.renderGame();
            }
            else {
                // TODO: aggregate the listening for game updates
                var newbie = new Player({name: data.name, game: g.game});
                g.game.players.push(newbie);
                g.views.renderPlayer(newbie);
            }
        },

        'update_mine': function(data) {
            // expect: data.mine, data.mine_index
            g.game.mines[data.mine_index] = new Mine(data.mine);
            g.views.updateMine(data.mine_index);
        },

        'player-move-start': function(data) {
            if (data.name === g.me.name) return; // i fired it
            g.game.getPlayer(data.name).startMove(data.move_id, data.dir);
        },

        'player-move-stop': function(data) {
            if (data.name === g.me.name) return; // i fired it
            g.game.getPlayer(data.name).stopMove(data.move_id);
        },
    }

    function initGame(data) {
        g.game = new Game(JSON.parse(data.game));
        g.me = g.game.getPlayer(data.name);
        g.views.showGame();
    }

    function initSocket() {
        setupSocket(socket);

        socket.bind("connect", function () {});
        socket.bind("disconnect", function () {});
        socket.bind("error", function(data) {
            console.log('Error:', data);
            $('error').text(data);
        }) 

        for (var signal in listeners) socket.bind(signal, listeners[signal])
    }

    function onLoad() {
        g.views.showIntro();
        socket = io({ upgrade: false, transports: ["websocket"] });
        for (var actionId in actionClicks) {
            $(actionId).bind('click', actionClicks[actionId]);
        }
        initSocket();
    }

    window.addEventListener("load", onLoad, false);

})();
// ======  client/keyboard.js
// map keycode > player movement direction
var keyboardMovements = {
    37: xy(-1,0),
    39: xy(1,0),
    38: xy(0,-1),
    40: xy(0,1)
}

window.addEventListener("keydown", function(event) {
    var key = event.which;
    if (key in keyboardMovements) {
        event.preventDefault();
        g.me.startMove(key, keyboardMovements[key]);
    }    
})

window.addEventListener("keyup", function(event) {
    var key = event.which;
    if (key in keyboardMovements) {
        event.preventDefault();
        g.me.stopMove(key);
    }    
})
// ======  client/math.js
distance = function(v1, v2) { return Math.sqrt(Math.pow(v1.x - v2.x, 2) + Math.pow(v1.y - v2.y, 2)); }
// ======  client/mine.js
var d0 = 200; // distance at which the first text starts enlarging

Mine.prototype.getWord = function(i) {
    if (typeof i === 'undefined') i = this.level;
    return this.words[Math.min(i, this.words.length - 1)];
}

Mine.prototype.interpolateSize = function(distance, i) {
    var word = this.getWord(i);
    if (i >= this.words.length - 1) return word.size;
    var prevWord = (i === 0) ? {distance: word.distance + d0} : this.getWord(i - 1);
    var nextWord = this.getWord(i+1);

    var delta = prevWord.distance - word.distance;
    var p = prevWord.distance - distance;
    var progress = p / delta;

    return Math.max(word.size, word.size + (nextWord.size - word.size) * progress)
    return Math.max(prevWord.size, prevWord.size + (word.size - prevWord.size) / progress);
}
// ======  client/player.js
var velocity = 5;

Player.prototype.isMe = function() {
    return this.name === g.me.name;
}

Player.prototype.move = function(dir) {
    // dir should be coords
    this.coords.x += dir.x * velocity;
    this.coords.y += dir.y * velocity;
    g.game.updateMines(g.me);
    g.views.updatePlayer(this);
}


Player.prototype.startMove = function(id, dir) {
    this.moves = this.moves || {};
    if (id in this.moves) return;
    var self = this;
    var anim = new Animation({
        onStart: function() { self.move(dir); },
        onFrame: function() { self.move(dir); }
    })
    this.moves[id] = anim;
    anim.start();
    if (this.isMe()) g.actions['player-move-start']({
        name: this.name,
        move_id: this.name + '-move-' + id,
        dir: dir
    });
}

Player.prototype.stopMove = function(id) {
    if (!(id in this.moves)) return;
    this.moves[id].stop();
    if (this.isMe()) g.actions['player-move-stop']({
        name: this.name,
        move_id: this.name + '-move-' + id,
        final_coords: this.coords
    });
    delete this.moves[id];
    g.actions['player-update-coords']();
}
// ======  client/views.js
window.g = window.g || {};

// This can be optimized a lot.

g.views = {};

// INTRO

g.views.showIntro = function() {
    $('game').hide();
    $('input-name').hide();
    $('input-code').hide();
    $('start').hide();
    $('intro').show();
}

g.views.showNewGame = function() {
    $('game-new').hide();
    $('game-join').hide();
    $('start').show();
    $('input-name').show().focus();
}

g.views.showJoinGame = function() {
    $('game-new').hide();
    $('game-join').hide();
    $('input-code').show();
    $('start').show();
    $('input-name').show().focus();
}

// GAMEPLAY

g.views.showGame = function() {
    $('intro').hide();
    $('game').show();
}

g.views.renderGame = function() {
    $('players').text("team: " + _.mapProp(g.game.players, 'name').join(', '));
    $('code').text("game code: " + g.game.code);

    // Render mines
    for (var i = 0; i < g.game.mines.length; i++) {
        g.views.renderMine(i);
    }

    // Render player
    g.game.players.forEach(function(player) {
        g.views.renderPlayer(player);
    })
}


// mines

g.views.renderMine = function(index) {
    var $mine = $(document.createElement('div'));
    $mine.className = 'mine';
    $mine.id = 'mine-' + index;
    $('gameplay').appendChild($mine); 
    g.views.updateMine(index);
}

g.views.updateMine = function(index, size) {
    var $mine = $('mine-' + index), mine = g.game.mines[index], word = mine.getWord()
    // TODO: this is getting calculated twice - don't do that
    size = size || word.size;
    $mine.text(word.text).css({
        'font-size': size + 'px',
        'left': mine.coords.x + 'px',
        'top': mine.coords.y + 'px',
    })
}


// player avatars

g.views.renderPlayer = function(player) {
    player = player || g.me;
    var $player = $(document.createElement('div'));
    $player.className = 'player';
    $player.id = 'player-' + player.name;
    $('gameplay').appendChild($player); 
    g.views.updatePlayer(player);
}

g.views.updatePlayer = function(player) {
    player = player || g.me;
    $('player-' +  player.name).show().css({
        left: player.coords.x + 'px',
        top: player.coords.y + 'px'
    })
}
