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
        if (mine.hidden) continue;

        var word = mine.getWord();

        var d = distance(player.coords, mine.coords);
        if (d < word.distance) {
            g.actions['mine-level-up'](i);
        }
        else if (d > word.levelDownDistance) {
            g.actions['mine-level-down'](i)
        }
        else {
            // render the mine text at a different size
            g.views.updateMine(i, mine.interpolateSize(d, mine.level))
        }
    } 
}

// ======  client/glitch.js
window.g = window.g || {};
g.glitch = {};

g.glitch.chars = [];

for (var i = 768; i <= 879; i++) {
    g.glitch.chars.push(String.fromCharCode(i));
}


g.glitch.transform = function(text, level) {
    var chars = text.split('').map(function(char) {
        for (var i = 0; i < level; i++) {
            char += choice(g.glitch.chars);
        }
        return char;
    })
    return chars.join('');
}

// TODO: is this elsewhere in the codebase? D:
var choice = function(array) {
    var i = randInt(array.length);
    return array[i];
}
// ======  client/html-utils.js
window.$ = function(id) {
    var $el = (typeof id === 'string') ? document.getElementById(id) : id;

    if (!$el) return $el;

    $el.text = function(text) { $el.textContent = text; return this; }
    $el.html = function(html) { $el.innerHTML = html; return this; }

    $el.css = function(css) {
        for (var prop in css) $el.style[prop] = css[prop];
        return this;
    }
    $el.attrs = function(attrs) {
        for (var prop in attrs) $el.setAttribute(prop, attrs[prop]);
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
    // `CRUNCH: could combine mine-level-up and mine-level-down
    g.actions = {
        'mine-level-up': function(i) {
            var mine = g.game.mines[i];
            if (!mine.canPlayerTrigger(g.me)) return;
            //if (mine.level === mine.words.length - 1) return; // no need
            console.log('Mine levelled up:', mine.getWord().text)
            mine.levelUp(g.me);

            if (!mine.getWord().singlePlayerOnly)
                socket.emit('mine_level_up', {
                    code: g.game.code,
                    name: g.me.name,
                    mine_index: i
                })

            g.views.updateMine(i);
            g.views.bounce($('mine-' + i));
        },

        'mine-level-down': function(i) {
            var mine = g.game.mines[i];
            if (!mine.canPlayerTrigger(g.me)) return;

            console.log('Mine levelled down:', mine.getWord().text)
            mine.levelDown(g.me);

            if (!mine.getWord().singlePlayerOnly)
                socket.emit('mine_level_down', {
                    code: g.game.code,
                    name: g.me.name,
                    mine_index: i
                })

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
        },

        'player-meet': function(player2, snapWire) {
            // TODO: this is not always erasing the wire. Probably because of multiple
            // signals overriding the first signal. Please fix.
            if (snapWire) {
                 g.views.removeWire('pwire_' + [g.me.name, player2.name].sort().join('_'));
            }

            socket.emit('player-meet', {
                code: g.game.code,
                name: g.me.name,
                name2: player2.name,
                snapWire: snapWire
            })


            // NOTE: in the snapWire case, the players aren't meeting.
            // Just reusing this code for that.
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
                g.views.renderSidebar();
                g.views.renderPlayer(newbie);
            }
        },

        'update_mine': function(data) {
            // expect: data.mine_index, data.mine
            var makeNew = data.new;
            if (makeNew) g.game.mines[data.mine_index] = new Mine(data.mine);
            var mine = g.game.mines[data.mine_index];

            var levelledUp = (mine.level !== data.mine.level);
            var revealedMine = (!!mine.hidden && mine.hidden !== data.mine.hidden);

            // special effect: randomly popping newly revealed mines into view
            var delay = typeof data.delay === 'number' ? data.delay : (revealedMine) ? randFloat(1000) : 0;

            mine.hidden = 1; // argh. make sure that player movement doesn't trigger a redraw

            setTimeout(function() {
                g.game.mines[data.mine_index].updateFromData(data.mine);

                g.views[makeNew ? 'renderMine' : 'updateMine'](data.mine_index);
                if (levelledUp || revealedMine) g.views.bounce($('mine-' + data.mine_index));
            }, delay)
        },

        'player-move-start': function(data) {
            if (data.name !== g.me.name) 
                g.game.getPlayer(data.name).startMove(data.move_id, data.dir);
        },

        'player-move-stop': function(data) {
            if (data.name !== g.me.name) 
                g.game.getPlayer(data.name).stopMove(data.move_id);
        },

        'player-update': function(data) {
            // TODO `crunch: could be optimized with player-joined
            // and also die
            var p = g.game.getPlayer(data.name);

            if (p.wires.length > 0) console.log('Player update wires:', p.name, p.wires)

            // Client holds the master copy of the coords.
            // Living dangerously, woohoo!
            // TODO: ......improvement needed.
            data.player.coords = g.game.getPlayer(data.name).coords;

            p.updateFromData(data.player);
            g.views.updatePlayer(p);
        },

        'checkpoint': function(data) {
            g.me.checkpoint = data.coords;
            console.log('CHECKPOINT:', data.coords);
        },

        'die': function(data) {
            var player = g.game.getPlayer(data.name);
            player.updateFromData(data.player);
            if (data.name === g.me.name) {
                console.log('DEAD') 
            }
            g.views.updatePlayer(player);
        },

        'game-over': function(data) {
            g.views.showGameOver(data);
        }
    }

    // direct input
    var actionClicks = {
        'game-new': function() {
            g.views.showStartGame();
        },

        'game-join': function() {
            inputs.startSignal = 'join_game';
            g.views.showStartGame(true);
        },

        'start': function() {
            ['name', 'code'].forEach(pullInput);
            socket.emit(inputs.startSignal, inputs);
        }
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
        g.bbox = document.body.getBoundingClientRect();
        g.frame = xy(0, 0);
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

Mine.prototype.interpolateSize = function(distance, i) {
    var word = this.getWord(i);
    if (i >= this.words.length - 1) return word.size;
    var prevWord = (i === 0) ? {distance: word.distance + d0} : this.getWord(i - 1);
    var nextWord = this.getWord(i+1);

    var progress = (prevWord.distance - distance) / (prevWord.distance - word.distance);

    return Math.max(word.size, word.size + (nextWord.size - word.size) * progress)
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
    this.checkMargin();
    this.checkWires();
    g.game.updateMines(g.me);
    g.views.updatePlayer(this);
}

Player.prototype.checkMargin = function() {
    var margin1 = Math.max(0, this.coords.x - (g.frame.x + g.bbox.width * (1 - Settings.marginR)));
    var margin2 = Math.min(0, this.coords.x - (g.frame.x + g.bbox.width * Settings.marginL));
    var margin = margin1 || margin2;
    if (margin !== 0) g.views.moveFrame(margin);
}

Player.prototype.checkWires = function() {
    // See if any other players are newly inside the wire radius
    var self = this;
    g.game.eachPlayer(function(p) {
        if (p.name === self.name) return;

        var d = distance(p.coords, self.coords);
        if (!self.hasWireTo(p)) {
            // No wire exists yet. Check for new wire.
            // todo: this could be optimized by checking large grained rectangular distance 
            if (d < Settings.wireNear) g.actions['player-meet'](p);
        }
        else {
            if (d > Settings.wireFar) g.actions['player-meet'](p, true); // snap the wire
        }
    })
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
    $('sidebar').hide();
    $('intro').show();
}

g.views.showStartGame = function(showJoin) {
    $('game-new').hide();
    $('game-join').hide();
    $('start').show();
    $('input-name').show().focus();
    if (showJoin) $('input-code').show().focus();
}

// GAMEPLAY

g.views.showGame = function() {
    $('intro').hide();
    $('gameplay').show();
    $('sidebar').show();
}

g.views.renderGame = function() {
    g.views.renderSidebar();

    // Render mines
    for (var i = 0; i < g.game.mines.length; i++) {
        g.views.renderMine(i);
    }

    // Render player
    g.game.eachPlayer(function(player) {
        g.views.renderPlayer(player);
    })
}

g.views.renderSidebar = function() {
    $('code').text("game " + g.game.code);
    $('players').html('');
    g.game.eachPlayer(g.views.renderSidebarPlayer);
}

g.views.renderSidebarPlayer = function(player) {
    var container = $('players');

    var p = $($('player-sidebar-template').cloneNode(true));
    p.html(p.innerHTML.replace(/\$name/g, player.name)).show();
    p.id = '';
    $('players').appendChild(p);
}

g.views.updateSidebarPlayer = function(player) {
    $('pi-glitches-' + player.name).text('Glitches: ' + player.glitchLevel)
    $('pi-oxy-' + player.name).css({width: Math.ceil(player.oxygen * 100) + '%'})
}

g.views.moveFrame = function(distance) {
    // only horizontal movement
    // TODO: clinch it between left and right borders
    g.frame.x += distance;
    var move = {'left': '-' + g.frame.x + 'px'};
    $('gameplay').css(move);
    $('wires').css(move);
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
    if (!$mine) return;
    mine.hidden ? $mine.hide() : $mine.show();
    if (mine.hidden) return;

    // TODO: this is getting calculated twice - don't do that
    var size = size || word.size;
    var lines = word.text.split('\n').map(function(l) {
        return g.glitch.transform(l, word.glitchLevel);
    })
    $mine.html(lines.join('<br/>')).css({
        'left': mine.coords.x + 'px',
        'top': mine.coords.y + 'px',
        'color': word.color || 'white',
        'fontWeight': (size <= 8) ? 200 : 800
    })
    if (!$mine.bouncing) $mine.css({'fontSize': size + 'px'})
}

g.views.bounce = function($el) {
    if ($el.bouncing) return;
    var s = parseInt($el.style.fontSize);
    $el.bouncing = true;
    if ($el.className.match(/bounce/)) return;
    $el.className += ' bounce';
    $el.css({'fontSize': s*1.5 + 'px'}) 

    setTimeout(function() {
        $el.css({'fontSize': s + 'px'});
        setTimeout(function() {
            $el.className = $el.className.replace('bounce', '');
            $el.bouncing = false;
        }, 200)
    }, 100)
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
    var name = g.glitch.transform('@' + player.name, player.glitchLevel);
    $('player-' +  player.name).show().text(name).css({
        left: player.coords.x + 'px',
        top: player.coords.y + 'px'
    })
    
    // render wires. 
    player.wires.forEach(function(p2name) {
        // sort names to avoid duplicates
        var id = 'pwire_' + [player.name, p2name].sort().join('_')
        g.views.addWire(id, 
            player.coords,
            g.game.getPlayer(p2name).coords
        )
    })


    // TODO `crunch: I think this is getting called overly much
    g.views.updateSidebarPlayer(player);
}


// game state

g.views.showGameOver = function(data) {
    var gameover = g.glitch.transform('game over', 10)
    $('game-overlay').css({opacity: 1}); // using opacity instead of show for the transition effect
    $('game-msg').html("- " + gameover + " -<br />" + data.reason);
}

// svg stuff
// temporary wire lines. These will be improved
g.views.wires = {}; 

g.views.addWire = function(id, coordsA, coordsB) {
    // sort them...
    // `TODO `CRUNCH maybe optimize this ???
    var sX = (coordsB.x - coordsA.x); 
    var sY = (coordsB.y - coordsA.y); 
    if ((sX<0 && sY<0)
        || (sX<0 && sY>0 && sY > Math.abs(sX))
        || (sX>0 && sY<0 && sX > Math.abs(sY))
    ) {
        var _coordsB = coordsB;
        coordsB = coordsA;
        coordsA = _coordsB;
    }

    var total = V.subtract(coordsB, coordsA);
    var d = absMin(total.x, total.y);
    var v2 = xy(d * sign(total.x), d * sign(total.y));

    var v1 = V.subtract(total, v2);
    v1.x /= 2;
    v1.y /= 2;

    var coordList = [coordsA];
    coordList.push(V.add(coordsA, v1));
    coordList.push(V.add(coordList[1], v2));
    coordList.push(V.add(coordList[2], v1));

    var pathHtml = g.views.makeLine(id, coordList);
    g.views.wires[id] = pathHtml;
    g.views.renderWires();
    return pathHtml;
}

g.views.makeLine = function(id, coordList) {
    var pathString = 'M' + coordList.map(function(coords) { return coords.x + ' ' + coords.y; }).join(' L ');

    // SVG is finnicky. Have to set the inner html.
    //var pathString = "M" + [coords1.x, coords1.y, 'L', coords2.x, coords2.y, 'Z'].join(' ');
    var pathHtml = '<path id="' + id + '" d="' + pathString + '" stroke-width="3" stroke="white" opacity="0.1" fill="transparent"></path>';

    return pathHtml;
}

g.views.removeWire = function(id) {
    console.log('Deleting id:', id)
    delete g.views.wires[id];
    g.views.renderWires();
}

g.views.renderWires = function() {
    // `crunch this is rather verbose for what it is doing.
    $('wires').html(Object.keys(g.views.wires).map(function(k) { return g.views.wires[k] }).join(''));
}

