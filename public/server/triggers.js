var Triggers = {};

Triggers['death'] = function(player, mine) {
    console.log('TRIGGERING death')
    player.die();
}

Triggers['checkpoint'] = function(player, mine) {
    player.setCheckpoint(mine.coords);
}
