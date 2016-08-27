Player.prototype.setCheckpoint = function(coords) {
    this.checkpoint = coords;
    this.socket.emit('checkpoint', {
        coords: coords
    })
}

Player.prototype.die = function() {
    this.coords = this.checkpoint;
    this.game.emit('die', {
        name: this.name,
        player: this.data()
    });
}
