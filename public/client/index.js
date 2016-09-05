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

        'player-update-coords': function(data) {
            if (data.name !== g.me.name)
                socket.emit('player-update-coords', {
                    code: g.game.code,
                    name: g.me.name,
                    coords: g.me.coords
                })
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
