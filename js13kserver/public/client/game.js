Game.prototype.updateMines = function(player) {
    for (var i = 0; i < this.mines.length; i++) {
        // TODO: filter mines which are in view
        var mine = this.mines[i];
        var d = distance(player.coords, mine.coords);
        if (d < mine.getWord().distance) {
            console.log('Mine levelled up:', mine.getWord().text)
            mine.levelUp();
            g.views.updateMine(i);
        }
        else {
            // render the mine text at a different size
            g.views.updateMine(i, mine.interpolateSize(d, mine.level))
        }
    } 
}

