// All games in session (indexed by code)
var games = {};


// Look up properties and get relevant objects
function vivify(data, socket) {
    if (data.code) {
        if (!(data.code in games)) return socket.emit('bad_code');
        data.game = games[data.code];
    }

    if (data.game && data.name) {
        // TODO: look up player object in game.players
        // ... except if this is coming from join_game, then there might not be a player yet
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

    socket.bind("disconnect", function () {});
    socket.bind("error", function(d1, d2) {console.log("error data:", d1, d2)})

    socket.bind("new_game", function(data) {
        // expect: data.name
        data = vivify(data, socket);
        var game = new Game();
        games[game.code] = game;
        game.populate();
        game.addPlayer(data.name, socket);
    })

    socket.bind("join_game", function(data) {
        // expect: data.code, data.name
        data = vivify(data, socket);
        if (data.game) data.game.addPlayer(data.name, socket)
    })
};

