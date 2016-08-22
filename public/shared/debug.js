// None of these functions (or their calls) should be needed in final build.

function m(n, extra) { extra = extra || ''; console.log('M' + n + ' ' + extra)}

Game.prototype.log = function(log) {
   console.log(this.code + ' > ' + log)
}
