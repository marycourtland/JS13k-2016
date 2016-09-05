// TODO: ...server side settings file?
var glitchPerDeath = 0.5;
var oxygenDrain = 0.05; // player will die in 20 ticks

Player.prototype.setCheckpoint = function(coords) {
    this.checkpoint = coords;
    this.socket.emit('checkpoint', {
        coords: coords
    })
}

Player.prototype.drainOxygen = function() {
    this.oxygen -= oxygenDrain;
    this.game.emit('player-update', {name: this.name, player: this.data()})
    if (this.oxygen <= 0) this.reallyDie();

}


Player.prototype.die = function() {
    this.coords = this.checkpoint;
    this.glitchLevel += glitchPerDeath;
    this.game.emit('die', {
        name: this.name,
        player: this.data()
    });
}

Player.prototype.reallyDie = function() {
    // Died from oxygen.
    this.game.lose();
}
