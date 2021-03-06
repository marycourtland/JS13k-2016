// TODO `crunch: see if these are actually being used a lot
// Also see about Math.min Math.max
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

var distance = function(v1, v2) { return Math.sqrt(Math.pow(v1.x - v2.x, 2) + Math.pow(v1.y - v2.y, 2)); }


function xy(x, y) {
    return {x:x, y:y};
}

function absMin(a, b) {
    return (Math.abs(a) < Math.abs(b)) ? a : b;
}

function sign(a) {
    return Math.abs(a) / a;
}

var V = {};

V.add = function(p1, p2) {
    return xy(p1.x + p2.x, p1.y + p2.y);
}

V.subtract = function(p1, p2) {
    return xy(p1.x - p2.x, p1.y - p2.y);
}

V.rth = function(r, theta) {
    return xy(
        r * cos(theta),
        r * sin(theta)
    )
}

V.scale = function(p, c) {
    return xy(
        p.x * c,
        p.y * c
    )
}

V.round = function(p, decimals) {
    var f = Math.pow(10, decimals);
    return xy(
        Math.round(p.x * f)/f,
        Math.round(p.y * f)/f
    )
}
