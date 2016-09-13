var Triggers = {};

Triggers['death'] = function(player, mine) {
    player.die();
}

Triggers['checkpoint'] = function(player, mine) {
    player.setCheckpoint(mine.coords);
}

Triggers['oxygen'] = function(player, mine, amount) {
    player.drainOxygen(-amount);
}

Triggers['hide'] = function(player, mine) {
    if (mine.hidden) return;
    // TODO: if any more mine.hidden code, do a mine.hide()
    mine.hidden = 1;
    mine.game.emit('update_mine', {mine_index: mine.index, mine: mine.data()})
}

var displayTriggers = ['showArea', 'hideArea'];
displayTriggers.forEach(function(trigger) {
    Triggers[trigger] = function(player, mine, area) {
        mine.game.getArea(area).forEach(function(m) {
            m.hidden = (trigger === 'hideArea');
            mine.game.emit('update_mine', {mine_index: m.index, mine: m.data()})
        })
    }
})

Triggers['spawn'] = function(player, mine, spawnData) {
    // TODO: infinite spawning (count=-1)

    var angles = range(0, 2*Math.PI, 2*Math.PI/spawnData.count);
    // TODO: shuffle angles first so that it looks more random?

    for (var i = 0; i < angles.length; i++) {
        spawnData.params.coords = V.add(mine.coords, V.rth(spawnData.distance, angles[i]));
        var spawnedMine = new Mine(templates[spawnData.template](spawnData.params))

        spawnedMine.area = spawnedMine.area || mine.area;

        mine.game.addMine(spawnedMine).emit('update_mine', {
            new: 1, 
            delay: spawnData.delay + i * spawnData.pause,
            mine_index: spawnedMine.index,
            mine: spawnedMine.data()
        })
    }
}

// WIRING MINES TOGETHER
Triggers['wire'] = function(player, mine, data) {
    // ASSUMPTION: mine.wirable = true
    player.forEachWire(function(player2) {
        var mine2 = player2.getCloseMine();
        if (!mine2 || !mine2.wirable) return;
        if (mine2.hasWireTo(mine)) return;
        if (mine.hasWireTo(mine2)) return;

        // if the player is within a good distance of a wirable mine, then we're good to go!!
        mine.addWireTo(mine2);
        mine2.addWireTo(mine);
        player.removeWire(player2);
        player2.removeWire(player);
    })
}


// GAME STATE

Triggers['win'] = function(player, mine) {
    player.game.win();
}


// Systems

Triggers['lifeSupportOn'] = function(player, mine) {
    player.game.drainOxygen = 0;
    player.game.eachPlayer(function(p) {
        p.drainOxygen(-(1 - p.oxygen))
    })
}

Triggers['setPower'] = function(player, mine, powerLevel) {
    var newPower = (mine.powered === 0);
    mine.powered = powerLevel;
    if (newPower) mine.propagatePower();
}
