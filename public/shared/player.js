function Player(data) {
    data = data || {};
    this.updateFromData(data);
}

Player.prototype = {};

Player.prototype.updateFromData = function(data) {
    this.name = data.name;
    this.id = data.name; // for player/mine interop
    this.game = data.game;
    this.checkpoint = data.checkpoint || xy(0,0);
    this.glitchLevel = data.glitchLevel || 0;
    this.coords = data.coords || xy(40, 40);
    this.mineState = data.mineState || {};
    this.oxygen = (typeof data.oxygen === 'number') ? data.oxygen : 1;
    this.wires = data.wires || [];
}


Player.prototype.data = function() {
    return {
        name: this.name,
        id: this.id,
        game: this.game.code,
        checkpoint: this.checkpoint,
        glitchLevel: this.glitchLevel,
        coords: this.coords,
        mineState: this.mineState,
        oxygen: this.oxygen,
        wires: this.wires
    }
}

Player.prototype.getMineState = function(mine) {
    if (!(mine.id in this.mineState)) this.mineState[mine.id] = {
        pbatches: [],
        // will put more things here
    }
    return this.mineState[mine.id];
}

Player.prototype.addPBatch = function(mine, word) {
    this.getMineState(mine).pbatches.push(word.pbatch);
}

Player.prototype.hasPBatch = function(mine, word) {
    return (mine.id in this.mineState) && (this.mineState[mine.id].pbatches.indexOf(word.pbatch) !== -1);
}

Player.prototype.hasWireTo = function(player2) {
    return this.wires.indexOf(player2.name) !== -1;
}

// Looks for all other players on other ends of the wires that this player is holding,
// and executes callback for each of those players
Player.prototype.forEachWire = function(callback) {
    var self = this;
    self.wires.forEach(function(name) {
        var player2 = self.game.getPlayer(name);

        // ignore asymmetric/incomplete wires
        if (!player2.hasWireTo(self)) return;

        callback(player2);
    })
}

Player.prototype.lastTriggeredMine = function(callback) {
    return this.game.getMineById(this._lastTriggeredMine);
}
