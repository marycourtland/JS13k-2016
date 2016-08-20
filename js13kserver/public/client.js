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
            console.log('Mine levelled up:', mine.getWord().text)
            mine.levelUp();
            g.views.updateMine(i);
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

    var inputs = {
        startSignal: 'new_game',
        name: '',
        code: ''
    };
    var pullInput = function(input) { inputs[input] = $("input-" + input).value; }

    var socket; //Socket.IO client

    // stage-switching

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
            }
            else {
                // TODO: aggregate the listening for game updates
                g.game.updateFromData(JSON.parse(data.game));
            }
            g.views.renderGame();
        }
    }

    function initGame(data) {
        g.game = new Game(JSON.parse(data.game));
        g.me = new Player(data.name);
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
var keyAnims = {};

var dirs = {
    left: xy(-1,0),
    right: xy(1,0),
    up: xy(0,-1),
    down: xy(0,1)
}

// these params get passed as an Animation
var inputControlMap = {
    37: {
        onStart: function() { g.me.move(dirs.left); },
        onFrame: function() { g.me.move(dirs.left); },
    },
    39: {
        onStart: function() { g.me.move(dirs.right); },
        onFrame: function() { g.me.move(dirs.right); },
    },
    38: {
        onStart: function() { g.me.move(dirs.up); },
        onFrame: function() { g.me.move(dirs.up); },
    },
    40: {
        onStart: function() { g.me.move(dirs.down); },
        onFrame: function() { g.me.move(dirs.down); },
    }
}


window.addEventListener("keydown", function(event) {
    var params = inputControlMap[event.which];
    if (params && !keyAnims[event.which]) {
        event.preventDefault();
        var anim  = new Animation(params)
        anim.start();
        keyAnims[event.which] = anim;
    }
});

window.addEventListener("keyup", function(event) {
    var anim = keyAnims[event.which];
    if (anim) {
        event.preventDefault();
        anim.stop();
        keyAnims[event.which] = null;
    }
});
// ======  client/math.js
distance = function(v1, v2) { return Math.sqrt(Math.pow(v1.x - v2.x, 2) + Math.pow(v1.y - v2.y, 2)); }
// ======  client/mine.js
var d0 = 100; // distance at which the first text starts enlarging

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

Player.prototype.move = function(dir) {
    // dir should be coords
    this.coords.x += dir.x * velocity;
    this.coords.y += dir.y * velocity;
    g.game.updateMines(g.me);
    g.views.updatePlayer();
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
    $('input-name').show();
    $('start').show();
}

g.views.showJoinGame = function() {
    $('game-new').hide();
    $('game-join').hide();
    $('input-name').show();
    $('input-code').show();
    $('start').show();
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
        var $mine = $(document.createElement('span'));
        $mine.className = 'mine';
        $mine.id = 'mine-' + i;
        $('gameplay').appendChild($mine); 
        g.views.updateMine(i);
    }

    // Render player
    g.views.updatePlayer()
}

g.views.updatePlayer = function() {
    $('player').show().css({
        left: g.me.coords.x + 'px',
        top: g.me.coords.y + 'px'
    })
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
