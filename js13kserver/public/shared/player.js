function Player(name, game) {
    this.name = name;
    this.game = game;
    this.waypoint = xy(0,0);
    this.glitchLevel = 0;
    this.coords = xy(100,100);
}

Player.prototype = {};

Player.prototype.data = function() {
    return {
        name: this.name,
        game: this.game.code,
        waypoint: this.waypoint,
        glitchLevel: this.glitchLevel
    }
}
