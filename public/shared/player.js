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
    this.coords = data.coords || xy(70,70);
}


Player.prototype.data = function() {
    return {
        name: this.name,
        game: this.game.code,
        checkpoint: this.checkpoint,
        glitchLevel: this.glitchLevel,
        coords: this.coords
    }
}
