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

        if (!word) {
            console.log('WTF?')
        }
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

    $el.removeClass = function(c) {
        $el.className = $el.className.replace(c, '').replace('  ', ' ');
        return this;
    }

    $el.addClass = function(c) {
        // prevent duplicate classes
        if (!$el.className.match(c)) $el.className = $el.className + ' ' + c;
        return this;
    }


    return $el;
}

// ======  client/index.js
'use strict';

window.randomWords = false; // blah

(function () {
    window.g = window.g || {};
    g.me = null;
    g.game = null;
    g.errors = {}; // network errors

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
            //if (mine.level === mine.words.length - 1) return; // TODO: Reintroduce this when mine data wonkiness is fixed. It prevents doublebounces etc.
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

        'player-meet': function(player2) {
            socket.emit('player-meet', {
                code: g.game.code,
                name: g.me.name,
                name2: player2.name,
            })
        },

        'player-snap': function(player2) {
            var wire_id = getWireId(g.me.name, player2.name);
            g.views.removeWire(wire_id);
            socket.emit('player-snap', {
                code: g.game.code,
                name: g.me.name,
                name2: player2.name,
            })
        }
    }


    // signals from server
    g.listeners = {
        'tick': function() {
            // MASTER GAME SYNCHRONIZATION TICK *********
            g.actions['player-update-coords'](); 
        },

        'player_joined': function(data) {
            // expect: data.game, data.name
            if (data.name === inputs.name) {
                initGame(data);
                g.views.renderGame();
            }
            else {
                // TODO: aggregate the listening for game updates
                var newbie = new Player(data.data);
                newbie.game = g.game;
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
            mine.index = data.mine_index;

            var levelledUp = (mine.level !== data.mine.level);
            var revealedMine = (!!mine.hidden && mine.hidden !== data.mine.hidden);

            //console.log('>>> update_mine', mine.index, mine.id, levelledUp, mine.level, data.mine.level)

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

        'player-update-coords': function(data) {
            if (data.name === g.me.name) return; 
            var player = g.game.getPlayer(data.name);

            var dist = distance(data.coords, player.coords);
            var offset = V.subtract(data.coords, player.coords);
            var correction = V.scale(offset, 0.02);
            
            g.errors[player.name] = correction;

            //console.log('COORDS ERROR for', player.name);
            //console.log('     ' + JSON.stringify(V.round(data.coords, 2)));
            //console.log('     ' + JSON.stringify(V.round(player.coords, 2)));
            //console.log('     ' + JSON.stringify(V.round(correction, 2)));
            //console.log(['coords', data.coords.x, data.coords.y, '|', player.coords.x, player.coords.y].join('\t'))
            console.log(['xyerror', offset.x, offset.y].join('\t') + '\n');
        },

        'player-update': function(data) {
            // TODO `crunch: could be optimized with player-joined
            // and also die
            var p = g.game.getPlayer(data.name);

            // Client holds the master copy of the coords.
            // Living dangerously, woohoo!
            // TODO: ......improvement needed.
            data.player.coords = p.coords;

            p.updateFromData(data.player);
            p.game = g.game;
            g.views.updatePlayer(p);
        },

        'wire-add': function(data) {
            // The player view update method is responsible for actually rendering
            // the wires, but they'll only do it if this id is registered with g.views.wires
            g.views.wires[data.wire_id] = ' ';
        },

        'wire-remove': function(data) {
            var wire_id = getWireId(data.player1, data.player2);
            var p1 = g.game.getPlayer(data.player1);
            var p2 = g.game.getPlayer(data.player2);
            p1.removeWire(p2);
            p2.removeWire(p1);
            g.views.removeWire(wire_id); 
        },

        'mine-powerup': function(data) {
            var mine = g.game.mines[data.mine_index];
            mine.powered = data.powered;
            g.views.poweredMines[mine.id] = true;
            g.views.updateMine(data.mine_index);
            // TODO:
            // mine.forEachWire: color wire powered up
        },

        'checkpoint': function(data) {
            g.me.checkpoint = data.coords;
            console.log('CHECKPOINT:', data.coords);
        },

        'die': function(data) {
            var player = g.game.getPlayer(data.name);
            player.updateFromData(data.player);
            player.game = this.game;
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

        for (var signal in g.listeners) socket.bind(signal, g.listeners[signal])
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
Player.prototype.isMe = function() {
    return this.name === g.me.name;
}

Player.prototype.move = function(dir) {
    // error correct for network crap
    var errorCorrection = (this.name in g.errors ? g.errors[this.name] : xy(0, 0));
    this.coords.x += dir.x * Settings.velocity + (errorCorrection.x || 0);
    this.coords.y += dir.y * Settings.velocity + (errorCorrection.y || 0);

    if (this.name === g.me.name) this.checkMargin();
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
    if (self.name !== g.me.name) return;
    g.game.eachPlayer(function(p) {
        if (p.name === self.name) return;

        var d = distance(p.coords, self.coords);
        if (!self.hasWireTo(p)) {
            if (d < Settings.wireNear) g.actions['player-meet'](p);
        }
        else {
            if (d > Settings.wireFar) g.actions['player-snap'](p, true); // snap the wire
        }
return;

        var d = distance(p.coords, self.coords);
        var hasWire = self.hasWireTo(p);
        var wire_id = getWireId(p.name, this.name);

        if (d < Settings.wireNear) {
            // No wire exists yet. Check for new wire.
            // todo: this could be optimized by checking large grained rectangular distance 
            if (!hasWire) {
                g.actions['player-meet'](p);
            }
            else if (!(wire_id in g.views.wires)) {
                // bugfix. Only do this when players are meeting so that it pretends to make sense.
                g.listeners['wire-add']({wire_id: wire_id});
            }
        }
        
        if (d > Settings.wireFar && hasWire) {
            g.actions['player-snap'](p, true);
        }
    })
}

// `CRUNCH: this is same as server, except without the emit
Player.prototype.removeWire = function(player2) {
    if (!this.hasWireTo(player2)) return;
    this.wires.splice(this.wires.indexOf(player2.name), 1)
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

g.views.poweredMines = {}; // master list.

g.views.renderMine = function(index) {
    var $mine = $(document.createElement('div'));
    $mine.addClass('mine');
    $mine.id = 'mine-' + index;
    $('gameplay').appendChild($mine); 
    g.views.updateMine(index);
}

g.views.updateMine = function(index, size) {
    var $mine = $('mine-' + index), mine = g.game.mines[index], word = mine.getWord()
    if (!$mine) return;
    mine.hidden ? $mine.hide() : $mine.show();
    if (mine.hidden) return;
    if (mine.wirable) $mine.addClass('wirable');


    if (g.views.poweredMines[mine.id]) {
        $mine.addClass('powered');
    } 
    else {
        $mine.removeClass('powered');
    }

    //console.log('MINE POWERED ?????', mine.id, !!mine.powered, !!g.views.poweredMines[mine.id], $mine.className)

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

    // Render wires. `CRUNCH: similar to player wire rendering
    mine.wires.forEach(function(mine2id) {
        var id = getWireId(mine.id, mine2id);

        // g.views.wires is a 'master list' of wires which 'should' be in view
        if(id in g.views.wires) { 
            g.views.addWire(id, 
                mine.coords,
                g.game.getMineById(mine2id).coords
            )
        }
    })
}

g.views.bounce = function($el) {
    if ($el.bouncing) return;
    var s = parseInt($el.style.fontSize);
    $el.bouncing = true;
    if ($el.className.match(/bounce/)) return;
    $el.addClass('bounce').css({'fontSize': s*1.5 + 'px'}) 

    setTimeout(function() {
        $el.css({'fontSize': s + 'px'});
        setTimeout(function() {
            $el.removeClass('bounce');
            $el.bouncing = false;
        }, 200)
    }, 100)
}


// player avatars

g.views.renderPlayer = function(player) {
    player = player || g.me;
    var $player = $(document.createElement('div'));
    $player.addClass('player').id = 'player-' + player.name;
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
        var id = getWireId(player.name, p2name);
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
    if (!(id in g.views.wires)) return;
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
    if (sX !== 0 && sY !== 0) {
        coordList.push(V.add(coordsA, v1));
        coordList.push(V.add(coordList[1], v2));
    }
    //coordList.push(V.add(coordList[2], v1));
    coordList.push(coordsB);

    var pathHtml = g.views.makeLine(id, coordList, '#ABE3A1')

    g.views.wires[id] = pathHtml;
    g.views.renderWires();
    pathHtml = pathHtml.replace('NaN', '0'); // lol
    return pathHtml;
}

g.views.makeLine = function(id, coordList, color) {
    var pathString = 'M' + coordList.map(function(coords) { return coords.x + ' ' + coords.y; }).join(' L ');

    // SVG is finnicky. Have to set the inner html.
    //var pathString = "M" + [coords1.x, coords1.y, 'L', coords2.x, coords2.y, 'Z'].join(' ');
    function line(opacity, strokeWidth) {
        return '<path d="' + pathString + '" stroke-width="' + strokeWidth.toString() + '" stroke="' + color + '" opacity="' + opacity.toString() + '" fill="transparent"></path>';
    }
    var pathHtml = line(0.1, 8);
    pathHtml += line(0.3, 4);
    pathHtml += line(0.5, 2);
    pathHtml += line(0.6, 1);

    return pathHtml;
}

g.views.removeWire = function(id) {
    delete g.views.wires[id];
    g.views.renderWires();
}

g.views.renderWires = function() {
    // `crunch this is rather verbose for what it is doing.
    $('wires').html('').html(Object.keys(g.views.wires).map(function(k) { return g.views.wires[k] }).join(''));
}

