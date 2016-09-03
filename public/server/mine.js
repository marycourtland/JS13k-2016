Mine.prototype.increment = function() {
   this.stage += 1; 
}

Mine.prototype.trigger = function(player) {
    var triggerList = this.getWord().triggers || [];
    var self = this;
    triggerList.forEach(function(t) {
        if (t in Triggers) Triggers[t](player, self);
    })
}
