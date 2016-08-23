// map keycode > player movement direction
var keyboardMovements = {
    37: xy(-1,0),
    39: xy(1,0),
    38: xy(0,-1),
    40: xy(0,1)
}

window.addEventListener("keydown", function(event) {
    var key = event.which;
    if (key in keyboardMovements) {
        event.preventDefault();
        g.me.startMove(key, keyboardMovements[key]);
    }    
})

window.addEventListener("keyup", function(event) {
    var key = event.which;
    if (key in keyboardMovements) {
        event.preventDefault();
        g.me.stopMove(key);
    }    
})
