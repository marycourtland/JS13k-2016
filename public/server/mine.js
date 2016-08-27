Mine.prototype.increment = function() {
   this.stage += 1; 
}

Mine.prototype.trigger = function(player) {
    var t = this.getWord().trigger;
    if (t in Triggers) Triggers[t](player, this);
}
