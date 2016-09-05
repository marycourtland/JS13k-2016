// TODO `crunch: see if these are actually being used a lot
var cos = Math.cos;
var sin = Math.sin;
var sqrt = Math.sqrt;
var random = Math.random;


function randFloat(min, max) {
    if (typeof max === 'undefined') {
        max = min;
        min = 0;
    }

    return min + random() * (max - min);
}

function randInt(min, max) { // inclusive
    return Math.floor(randFloat(min, max));
}

function clamp(n, min, max) {
    return Math.max(Math.min(n, max), min);
}

function range(min, max, step) {
    step = (typeof step === 'undefined') ? 1 : step;
    var r = [];
    for (var i = min; i < max; i += step) { r.push(i); }
    return r;
}

function xy(x, y) {
    return {x:x, y:y};
}

var V = {};

V.add = function(p1, p2) {
    return xy(p1.x + p2.x, p1.y + p2.y);
}

V.rth = function(r, theta) {
    return xy(
        r * cos(theta),
        r * sin(theta)
    )
}


