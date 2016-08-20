var d0 = 100; // distance at which the first text starts enlarging

Mine.prototype.getWord = function(i) {
    if (typeof i === 'undefined') i = this.level;
    return this.words[Math.min(i, this.words.length - 1)];
}

Mine.prototype.interpolateSize = function(distance, i) {
    var word = this.getWord(i);
    if (i >= this.words.length - 1) return word.size;
    var prevWord = (i === 0) ? {distance: word.distance + d0} : this.getWord(i - 1);
    var nextWord = this.getWord(i+1);

    var delta = prevWord.distance - word.distance;
    var p = prevWord.distance - distance;
    var progress = p / delta;

    return Math.max(word.size, word.size + (nextWord.size - word.size) * progress)
    return Math.max(prevWord.size, prevWord.size + (word.size - prevWord.size) / progress);
}
