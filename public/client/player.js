

Player.prototype.isMe = function() {
    return this.name === g.me.name;
}

Player.prototype.move = function(dir) {
    // dir should be coords
    this.coords.x += dir.x * Settings.velocity;
    this.coords.y += dir.y * Settings.velocity;
    this.checkMargin();
    this.checkWires();
    g.game.updateMines(g.me);
    g.views.updatePlayer(this);
}

Player.prototype.checkMargin = function() {
    var margin1 = Math.max(0, this.coords.x - (g.frame.x + g.bbox.width * (1 - Settings.marginR)));
    var margin2 = Math.min(0, this.coords.x - (g.frame.x + g.bbox.width * Settings.marginL));
    var margin = margin1 || margin2;
    if (margin !== 0) g.views.moveFrame(margin);
}

Player.prototype.checkWires = function() {
    // See if any other players are newly inside the wire radius
    var self = this;
    if (self.name !== g.me.name) return;
    g.game.eachPlayer(function(p) {
        if (p.name === self.name) return;

        var d = distance(p.coords, self.coords);
        if (!self.hasWireTo(p)) {
            // No wire exists yet. Check for new wire.
            // todo: this could be optimized by checking large grained rectangular distance 
            if (d < Settings.wireNear) g.actions['player-meet'](p);
        }
        else {
            if (d > Settings.wireFar) g.actions['player-snap'](p, true); // snap the wire
        }
    })
}

// `CRUNCH: this is same as server, except without the emit
Player.prototype.removeWire = function(player2) {
    if (!this.hasWireTo(player2)) return;
    this.wires.splice(this.wires.indexOf(player2.name), 1)
}


Player.prototype.startMove = function(id, dir) {
    this.moves = this.moves || {};
    if (id in this.moves) return;
    var self = this;
    var anim = new Animation({
        onStart: function() { self.move(dir); },
        onFrame: function() { self.move(dir); }
    })
    this.moves[id] = anim;
    anim.start();
    if (this.isMe()) g.actions['player-move-start']({
        name: this.name,
        move_id: this.name + '-move-' + id,
        dir: dir
    });
}

Player.prototype.stopMove = function(id) {
    if (!(id in this.moves)) return;
    this.moves[id].stop();
    if (this.isMe()) g.actions['player-move-stop']({
        name: this.name,
        move_id: this.name + '-move-' + id,
        final_coords: this.coords
    });
    delete this.moves[id];
    g.actions['player-update-coords']();
}
