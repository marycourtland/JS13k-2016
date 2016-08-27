// TODO: ...server side settings file?
var glitchPerDeath = 0.5;

Player.prototype.setCheckpoint = function(coords) {
    this.checkpoint = coords;
    this.socket.emit('checkpoint', {
        coords: coords
    })
}

Player.prototype.die = function() {
    this.coords = this.checkpoint;
    this.glitchLevel += glitchPerDeath;
    this.game.emit('die', {
        name: this.name,
        player: this.data()
    });
}
