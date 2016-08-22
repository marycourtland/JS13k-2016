var keyAnims = {};

var dirs = {
    left: xy(-1,0),
    right: xy(1,0),
    up: xy(0,-1),
    down: xy(0,1)
}

// these params get passed as an Animation
var inputControlMap = {
    37: {
        onStart: function() { g.me.move(dirs.left); },
        onFrame: function() { g.me.move(dirs.left); },
    },
    39: {
        onStart: function() { g.me.move(dirs.right); },
        onFrame: function() { g.me.move(dirs.right); },
    },
    38: {
        onStart: function() { g.me.move(dirs.up); },
        onFrame: function() { g.me.move(dirs.up); },
    },
    40: {
        onStart: function() { g.me.move(dirs.down); },
        onFrame: function() { g.me.move(dirs.down); },
    }
}


window.addEventListener("keydown", function(event) {
    var params = inputControlMap[event.which];
    if (params && !keyAnims[event.which]) {
        event.preventDefault();
        var anim  = new Animation(params)
        anim.start();
        keyAnims[event.which] = anim;
    }
});

window.addEventListener("keyup", function(event) {
    var anim = keyAnims[event.which];
    if (anim) {
        event.preventDefault();
        anim.stop();
        keyAnims[event.which] = null;
    }
});
