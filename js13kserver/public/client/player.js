var velocity = 5;

Player.prototype.move = function(dir) {
    // dir should be coords
    this.coords.x += dir.x * velocity;
    this.coords.y += dir.y * velocity;
    g.game.updateMines(g.me);
    g.views.updatePlayer();
}
