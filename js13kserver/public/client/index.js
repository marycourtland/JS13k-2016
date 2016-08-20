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
