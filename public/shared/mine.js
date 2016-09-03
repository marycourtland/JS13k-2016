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
    this.updateFromData(data);
}

Mine.prototype = {};

Mine.prototype.updateFromData = function(data) {
    this.id = data.id;
    this.words = data.words;
    this.coords = data.coords;
    this.hidden = data.hidden || 0;
    this.area = data.area || '';
    this.game = data.game;
    this.level = data.level || 0;
    this.singlePlayerOnly = data.singlePlayerOnly || false;
}

Mine.prototype.data = function() {
    return {
        id: this.id,
        words: this.words,
        coords: this.coords,
        hidden: this.hidden,
        area: this.area,
        game: this.game.code,
        level: this.level,
        singlePlayerOnly: this.singlePlayerOnly
    }
}

Mine.prototype.render = function() {}; // client will overwrite

Mine.prototype.getWord = function(i) {
    if (typeof i === 'undefined') i = this.level;
    return this.words[Math.min(i, this.words.length - 1)];
}

Mine.prototype.canPlayerTrigger = function(player) {
    var w = this.getWord();

    // Did the player already trigger one of the words in the pbatch?
    // (Players can only do 1 word per pbatch.)
    if (w.pbatch && player.hasPBatch(this, w)) return false;

    // ... will add other stuff here

    return true;
}


Mine.prototype.levelUp = function(player) {
    var prevWord = this.getWord();
    if (prevWord.pbatch) player.addPBatch(this, prevWord);

    this.level += 1;
    this.render();
}

Mine.prototype.levelDown = function() {
    this.level -= 1;
    this.render();
}
