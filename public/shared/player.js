function Player(data) {
    data = data || {};
    this.name = data.name;
    this.game = data.game;
    this.waypoint = data.waypoint || xy(0,0);
    this.glitchLevel = data.glitchLevel || 0;
    this.coords = data.coords || xy(100,100);
}

Player.prototype = {};

Player.prototype.data = function() {
    return {
        name: this.name,
        game: this.game.code,
        waypoint: this.waypoint,
        glitchLevel: this.glitchLevel,
        coords: this.coords
    }
}
