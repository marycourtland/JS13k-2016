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
    if (this.hasWireTo(mine2)) return;
    this.wires.push(mine2.id);
    this.game.emit('wire-add', {
        wire_id: getWireId(this.id, mine2.id)
    })
    this.emitUpdate();
}

