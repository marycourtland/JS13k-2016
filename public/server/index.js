// All games in session (indexed by code)
var games = {};


// Look up properties and get relevant
// todo: vivify data.name > data.player if game player exists
function vivify(data, socket) {
    if (data.code) {
        if (!(data.code in games)) return socket.emit('bad_code');
        data.game = games[data.code];

        if ('mine_index' in data) {
            data.mine = data.game.getMine(data.mine_index);
        }

        if ('name' in data) {
            data.player = data.game.getPlayer(data.name);
        }

        if ('name2' in data) {
            data.player2 = data.game.getPlayer(data.name2);
        }
    }

    if (data.coords) {
        data.coords.x = parseFloat(data.coords.x);
        data.coords.y = parseFloat(data.coords.y);
    }

    return data;
}


/**
 * Socket.IO on connect event
 * @param {Socket} socket
 */
module.exports = function (socket) {
    console.log(socket.id + ' > connect');

    setupSocket(socket);

    socket.bind("disconnect", function () {
        // todo: clean up game
    });

    socket.bind("error", function(data) {console.log("error data:", data)})

    socket.bind("new_game", function(data) {
        // expect: data.name
        var payload = vivify(data, socket);
        var game = new Game();
        games[game.code] = game;
        game.populate();
        game.addPlayer(payload.name, socket);

        game.start();
    })

    socket.bind("join_game", function(data) {
        // expect: data.code, data.name
        var payload = vivify(data, socket);
        if (payload.game) payload.game.addPlayer(payload.name, socket)
    })


    // GAMEPLAY
    socket.bind("mine_level_up", function(data) {
        // expect: data.code, data.mine_index, data.name
        var payload = vivify(data, socket);
        if (payload.mine && payload.game) {
            if (!payload.mine.canPlayerTrigger(payload.player)) return;

            payload.mine.trigger(payload.player);
            payload.mine.levelUp(payload.player);
            payload.mine.emitUpdate();

        }
    })

    socket.bind("mine_level_down", function(data) {
        // expect: data.code, data.mine_index, data.name
        var payload = vivify(data, socket);
        if (payload.mine && payload.game) {
            if (!payload.mine.canPlayerTrigger(payload.player)) return;

            payload.mine.levelDown(payload.player);
            payload.mine.emitUpdate();
        }
    })
    
    socket.bind("player-update-coords", function(data) {
        var payload = vivify(data, socket);
        payload.player.coords = payload.coords;

        // todo: if we had the original nonvivified copy of the data,
        // we could just cleanly forward it
        payload.game.emit('player-update-coords', {
            code: payload.game.code,
            name: payload.player.name,
            coords: payload.coords
        })
        
        // TODO: broadcast player coords to everyone, for nice position syncing. Maybe in the tick function
    })

    socket.bind("player-meet", function(data) {
        var payload = vivify(data, socket);
        var p1 = payload.player, p2 = payload.player2;

        // Debounce if lots of these signals get spammed at once
        if (p1.hasWireTo(p2)) return;

        p1.addWireTo(p2);
        p2.addWireTo(p1);
    })

    socket.bind('player-snap', function(data) {
        var payload = vivify(data, socket);
        var p1=payload.player, p2=payload.player2;
        p1.removeWire(p2);
        p2.removeWire(p1);
        
    })


    // "Forwarding" signals: send the same event to all players in the game
    // (with no involvement from the server)
    var forwardSignals = [
        'player-move-start',
        'player-move-stop'
    ]

    forwardSignals.forEach(function(signal) {
        socket.bind(signal, function(data) {
            // no need to vivify
            games[data.code].emit(signal, data);
        })
    })
};

