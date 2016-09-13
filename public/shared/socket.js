function setupSocket(socket) {
    var _emit = socket.emit;
    socket.emit = function() {
//        console.log(socket.id + ' emit: ' + arguments[0])
        _emit.apply(socket, arguments);
    }

    socket.bind = function(signal, callback) {
        callback = ensureFunction(callback);
        socket.on(signal, function() {
//            console.log(socket.id + ' > ' + signal);
            callback.apply(null, arguments);
        })
    }

    return socket;
}

