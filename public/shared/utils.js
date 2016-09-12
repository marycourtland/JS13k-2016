var _ = {};
if (typeof window !== 'undefined') window._ = _;

function ensureFunction(f) {
    return (typeof f === 'function') ? f : function() {}
}

_.propFinder = function(objArray, property) {
    return function(value) {
        var matches = objArray.filter(function(obj) {
            return obj[property] === value;
        })
        return (matches.length > 0) ? matches[0] : null;
    }
}

_.mapProp = function(objArray, property) {
    return objArray.map(function(obj) { return obj[property]; })
}

function getWireId(s1, s2) {
    return 'wire_' + [s1, s2].sort().join('_');
}

function shallowCopy(obj) {
    var newObj = {};
    for (var prop in obj) {
        newObj[prop] = obj[prop];
    }
    return newObj;
}

function choice(array) {
    return array[Math.floor(Math.random() * array.length)]
}
