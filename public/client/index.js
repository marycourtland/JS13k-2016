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
            //console.log('Mine levelled up:', mine.getWord().text)
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

            //console.log('Mine levelled down:', mine.getWord().text)
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
            //console.log(['xyerror', offset.x, offset.y].join('\t') + '\n');
        },

        'player-update': function(data) {
            // TODO `crunch: could be optimized with player-joined
            // and also die
            var p = g.game.getPlayer(data.name);

            // Client holds the master copy of the coords.
            // Living dangerously, woohoo!
            // TODO: ......improvement needed.
            data.player.coords = p.coords;

            var x0 = p.coords.x;
            p.updateFromData(data.player);

            if (p.name === g.me.name) g.views.moveFrame(p.coords.x - x0);

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
            //console.log('CHECKPOINT:', data.coords);
        },

        'die': function(data) {
            var player = g.game.getPlayer(data.name);
            player.updateFromData(data.player);
            player.game = this.game;
            //if (data.name === g.me.name) {
            //    console.log('DEAD') 
            //}
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
