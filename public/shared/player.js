function Player(data) {
    data = data || {};
    this.updateFromData(data);
}

Player.prototype = {};

Player.prototype.updateFromData = function(data) {
    this.name = data.name;
    this.game = data.game;
    this.checkpoint = data.checkpoint || xy(0,0);
    this.glitchLevel = data.glitchLevel || 0;
    this.coords = data.coords || xy(140,40);
    this.mineState = data.mineState || {};
    this.oxygen = (typeof data.oxygen === 'number') ? data.oxygen : 1;
}


Player.prototype.data = function() {
    return {
        name: this.name,
        game: this.game.code,
        checkpoint: this.checkpoint,
        glitchLevel: this.glitchLevel,
        coords: this.coords,
        mineState: this.mineState,
        oxygen: this.oxygen
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
