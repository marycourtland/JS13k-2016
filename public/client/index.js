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
            mine.levelUp();
            if (!mine.getWord().singlePlayerOnly)
                socket.emit('mine_level_up', {
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
