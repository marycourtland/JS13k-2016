var d0 = 200; // distance at which the first text starts enlarging

Mine.prototype.interpolateSize = function(distance, i) {
    var word = this.getWord(i);
    if (i >= this.words.length - 1) return word.size;
    var prevWord = (i === 0) ? {distance: word.distance + d0} : this.getWord(i - 1);
    var nextWord = this.getWord(i+1);

    var progress = (prevWord.distance - distance) / (prevWord.distance - word.distance);

    return Math.max(word.size, word.size + (nextWord.size - word.size) * progress)
}
