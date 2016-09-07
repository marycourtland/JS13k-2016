Game.prototype.updateMines = function(player) {
    for (var i = 0; i < this.mines.length; i++) {
        // TODO: filter mines which are in view
        var mine = this.mines[i];
        if (mine.hidden) continue;

        var word = mine.getWord();

        var d = distance(player.coords, mine.coords);
        if (d < word.distance) {
            g.actions['mine-level-up'](i);
        }
        else if (d > word.levelDownDistance) {
            g.actions['mine-level-down'](i)
        }
        else {
            // render the mine text at a different size
            g.views.updateMine(i, mine.interpolateSize(d, mine.level))
        }
    } 
}

