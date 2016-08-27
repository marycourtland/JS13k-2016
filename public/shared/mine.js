// Each word data looks like:
// {
//   text: 'abc',    // displayed word
//   size: 12,       // displayed size
//   glitchLevel: 2, // displayed glitch level
//   distance: 30,   // distance at which it increments to next word
//   trigger: 'whatever' // optional action to trigger
// }

function Mine(data) {
    data = data || {};
    this.words = data.words;
    this.coords = data.coords;
    this.game = data.game;
    this.level = data.level || 0;
    this.singlePlayerOnly = data.singlePlayerOnly || false;
}

Mine.prototype = {};

Mine.prototype.data = function() {
    return {
        words: this.words,
        coords: this.coords,
        game: this.game.code,
        level: this.level,
        singlePlayerOnly: this.singlePlayerOnly
    }
}

Mine.prototype.render = function() {}; // client will overwrite

Mine.prototype.levelUp = function() {
    this.level += 1;
    this.render();
}

Mine.prototype.levelDown = function() {
    this.level -= 1;
    this.render();
}
