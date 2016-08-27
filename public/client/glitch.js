window.g = window.g || {};
g.glitch = {};

g.glitch.chars = [];

for (var i = 768; i <= 879; i++) {
    g.glitch.chars.push(String.fromCharCode(i));
}


g.glitch.transform = function(text, level) {
    var chars = text.split('').map(function(char) {
        for (var i = 0; i < level; i++) {
            char += choice(g.glitch.chars);
        }
        return char;
    })
    return chars.join('');
}

// TODO: is this elsewhere in the codebase? D:
var choice = function(array) {
    var i = Math.floor(Math.random() * array.length);
    return array[i];
}
