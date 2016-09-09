Mine.prototype.increment = function() {
   this.stage += 1; 
}

Mine.prototype.emitUpdate = function() {
    this.game.emit('update_mine', {
        mine_index: this.index,
        mine: this.data()
    })
}

Mine.prototype.trigger = function(player) {
    player._lastTriggeredMine = this.id;

    var triggerList = this.getWord().triggers || {}; 
    for (var t in triggerList) {
        if (t in Triggers) Triggers[t](player, this, triggerList[t]);
    }
}

// TODO `CRUNCH: so.... this is the same as the Player.addWireTo method.
// could stick the same method on the two prototypes
Mine.prototype.addWireTo = function(mine2) {
    console.log('*** ADDING WIRE')
    if (this.hasWireTo(mine2)) return;
    this.wires.push(mine2.id);
    this.game.emit('wire-add', {
        wire_id: getWireId(this.id, mine2.id)
    })
    this.emitUpdate();
    var self = this;
    console.log('*** GOING TO PROPAGATE POWER DOWN WIRE')
    setTimeout(function() {
        console.log('*** PROPAGATING POWER DOWN WIRE')
        self.propagatePower();
    }, 50)
}

Mine.prototype.powerUp = function() {
    console.log('   POWERUP:', this.id)
    if (!this.powered) this.powered = 0.5;
    this.game.emit('mine-powerup', {
        mine_index: this.index,
        powered: this.powered
    })
}

Mine.prototype.propagatePower = function() {
    var self = this;
    console.log('---PROPAGATING POWER this.powered=' + self.powered + ' this.wires=' + JSON.stringify(this.wires));
    if (self.powered === 0) return;
    self.powerUp(); // emits update
    self.wires.forEach(function(mine_id) {
        console.log('   PROPAGATION TO:', mine_id)
        self.game.getMineById(mine_id).propagatePower(); 
    })

}
