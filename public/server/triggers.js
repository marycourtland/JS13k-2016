var Triggers = {};

Triggers['death'] = function(player, mine) {
    player.die();
}

Triggers['checkpoint'] = function(player, mine) {
    player.setCheckpoint(mine.coords);
}

Triggers['hide'] = function(player, mine) {
    if (mine.hidden) return;
    // TODO: if any more mine.hidden code, do a mine.hide()
    mine.hidden = 1;
    mine.game.emit('update_mine', {mine_index: mine.index, mine: mine.data()})
}

var displayTriggers = ['showArea', 'hideArea'];
displayTriggers.forEach(function(trigger) {
    Triggers[trigger] = function(player, mine) {
        console.log("TRIGGER:", trigger)
        var w = mine.getWord();
        var words = mine.game.getArea(w[trigger]);
        console.log('W:', w);
        console.log(w[trigger]);
        console.log('AREA WORDS:', words)
        mine.game.getArea(mine.getWord()[trigger]).forEach(function(m) {
            console.log('SHOW MINE:', m.id, m.index);
            m.hidden = (trigger === 'hideArea');
            mine.game.emit('update_mine', {mine_index: m.index, mine: m.data()})
        })
    }
})
