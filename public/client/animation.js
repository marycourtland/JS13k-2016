var reqAnimFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame;
var blankFunction = function() {};

function Animation(params) {
    this.onStart = params.onStart || blankFunction;
    this.onFrame = params.onFrame || blankFunction; 
    this.onStop = params.onStop || blankFunction; 
    this.running = false;
    this.frame = 0;
}

Animation.prototype = {};

Animation.prototype.start = function() {
    this.running = true;
    this.onStart();
    this.go();
}

Animation.prototype.go = function() {
    if (!this.running) { return; }
    this.frame += 1;
    var self = this;
    reqAnimFrame(function() { self.go(); });
    this.onFrame(this.frame);
}

Animation.prototype.stop = function() {
    this.running = false;
    this.onStop();
}


// `crunch: might not need pause/resume

Animation.prototype.pause = function() {
    this.running = false;
}

Animation.prototype.resume = function() {
    this.running = true;
    this.go();
}
