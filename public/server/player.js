Player.prototype.emitUpdate = function() {
    this.game.emit('player-update', {name: this.name, player: this.data()})
}

Player.prototype.setCheckpoint = function(coords) {
    this.checkpoint = coords;
    this.socket.emit('checkpoint', {
        coords: coords
    })
}

Player.prototype.addWireTo = function(player2) {
    if (this.hasWireTo(player2)) return;
    this.wires.push(player2.name);
    this.emitUpdate();
}

Player.prototype.removeWire = function(player2) {
    if (!this.hasWireTo(player2)) return;
    this.wires.splice(this.wires.indexOf(player2.name), 1)
    this.emitUpdate();
}


Player.prototype.drainOxygen = function(amt) {
    this.oxygen = clamp(this.oxygen - amt, 0, 1);
    this.emitUpdate();
    if (this.oxygen <= 0) this.reallyDie();
}


Player.prototype.die = function() {
    this.coords = this.checkpoint;
    this.glitchLevel += Settings.glitchPerDeath;
    this.game.emit('die', {
        name: this.name,
        player: this.data()
    });
}

Player.prototype.reallyDie = function() {
    // Died from oxygen.
    this.game.lose();
}
