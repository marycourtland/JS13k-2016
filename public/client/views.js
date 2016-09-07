window.g = window.g || {};

// This can be optimized a lot.

g.views = {};

// INTRO

g.views.showIntro = function() {
    $('sidebar').hide();
    $('intro').show();
}

g.views.showStartGame = function(showJoin) {
    $('game-new').hide();
    $('game-join').hide();
    $('start').show();
    $('input-name').show().focus();
    if (showJoin) $('input-code').show().focus();
}

// GAMEPLAY

g.views.showGame = function() {
    $('intro').hide();
    $('gameplay').show();
    $('sidebar').show();
}

g.views.renderGame = function() {
    g.views.renderSidebar();

    // Render mines
    for (var i = 0; i < g.game.mines.length; i++) {
        g.views.renderMine(i);
    }

    // Render player
    g.game.eachPlayer(function(player) {
        g.views.renderPlayer(player);
    })
}

g.views.renderSidebar = function() {
    $('code').text("game " + g.game.code);
    $('players').html('');
    g.game.eachPlayer(g.views.renderSidebarPlayer);
}

g.views.renderSidebarPlayer = function(player) {
    var container = $('players');

    var p = $($('player-sidebar-template').cloneNode(true));
    p.html(p.innerHTML.replace(/\$name/g, player.name)).show();
    p.id = '';
    $('players').appendChild(p);
}

g.views.updateSidebarPlayer = function(player) {
    $('pi-glitches-' + player.name).text('Glitches: ' + player.glitchLevel)
    $('pi-oxy-' + player.name).css({width: Math.ceil(player.oxygen * 100) + '%'})
}

g.views.moveFrame = function(distance) {
    // only horizontal movement
    // TODO: clinch it between left and right borders
    g.frame.x += distance;
    var move = {'left': '-' + g.frame.x + 'px'};
    $('gameplay').css(move);
    $('wires').css(move);
}

// mines

g.views.renderMine = function(index) {
    var $mine = $(document.createElement('div'));
    $mine.className = 'mine';
    $mine.id = 'mine-' + index;
    $('gameplay').appendChild($mine); 
    g.views.updateMine(index);
}

g.views.updateMine = function(index, size) {
    var $mine = $('mine-' + index), mine = g.game.mines[index], word = mine.getWord()
    if (!$mine) return;
    mine.hidden ? $mine.hide() : $mine.show();
    if (mine.hidden) return;

    // TODO: this is getting calculated twice - don't do that
    var size = size || word.size;
    var lines = word.text.split('\n').map(function(l) {
        return g.glitch.transform(l, word.glitchLevel);
    })
    $mine.html(lines.join('<br/>')).css({
        'left': mine.coords.x + 'px',
        'top': mine.coords.y + 'px',
        'color': word.color || 'white',
        'fontWeight': (size <= 8) ? 200 : 800
    })
    if (!$mine.bouncing) $mine.css({'fontSize': size + 'px'})
}

g.views.bounce = function($el) {
    if ($el.bouncing) return;
    var s = parseInt($el.style.fontSize);
    $el.bouncing = true;
    if ($el.className.match(/bounce/)) return;
    $el.className += ' bounce';
    $el.css({'fontSize': s*1.5 + 'px'}) 

    setTimeout(function() {
        $el.css({'fontSize': s + 'px'});
        setTimeout(function() {
            $el.className = $el.className.replace('bounce', '');
            $el.bouncing = false;
        }, 200)
    }, 100)
}


// player avatars

g.views.renderPlayer = function(player) {
    player = player || g.me;
    var $player = $(document.createElement('div'));
    $player.className = 'player';
    $player.id = 'player-' + player.name;
    $('gameplay').appendChild($player); 
    g.views.updatePlayer(player);
}

g.views.updatePlayer = function(player) {
    player = player || g.me;
    var name = g.glitch.transform('@' + player.name, player.glitchLevel);
    $('player-' +  player.name).show().text(name).css({
        left: player.coords.x + 'px',
        top: player.coords.y + 'px'
    })
    
    // render wires. 
    player.wires.forEach(function(p2name) {
        // sort names to avoid duplicates
        var id = 'pwire_' + [player.name, p2name].sort().join('_')
        g.views.addWire(id, 
            player.coords,
            g.game.getPlayer(p2name).coords
        )
    })


    // TODO `crunch: I think this is getting called overly much
    g.views.updateSidebarPlayer(player);
}


// game state

g.views.showGameOver = function(data) {
    var gameover = g.glitch.transform('game over', 10)
    $('game-overlay').css({opacity: 1}); // using opacity instead of show for the transition effect
    $('game-msg').html("- " + gameover + " -<br />" + data.reason);
}

// svg stuff
// temporary wire lines. These will be improved
g.views.wires = {}; 

g.views.addWire = function(id, coordsA, coordsB) {
    // sort them...
    // `TODO `CRUNCH maybe optimize this ???
    var sX = (coordsB.x - coordsA.x); 
    var sY = (coordsB.y - coordsA.y); 
    if ((sX<0 && sY<0)
        || (sX<0 && sY>0 && sY > Math.abs(sX))
        || (sX>0 && sY<0 && sX > Math.abs(sY))
    ) {
        var _coordsB = coordsB;
        coordsB = coordsA;
        coordsA = _coordsB;
    }

    var total = V.subtract(coordsB, coordsA);
    var d = absMin(total.x, total.y);
    var v2 = xy(d * sign(total.x), d * sign(total.y));

    var v1 = V.subtract(total, v2);
    v1.x /= 2;
    v1.y /= 2;

    var coordList = [coordsA];
    coordList.push(V.add(coordsA, v1));
    coordList.push(V.add(coordList[1], v2));
    coordList.push(V.add(coordList[2], v1));

    var pathHtml = g.views.makeLine(id, coordList);
    g.views.wires[id] = pathHtml;
    g.views.renderWires();
    return pathHtml;
}

g.views.makeLine = function(id, coordList) {
    var pathString = 'M' + coordList.map(function(coords) { return coords.x + ' ' + coords.y; }).join(' L ');

    // SVG is finnicky. Have to set the inner html.
    //var pathString = "M" + [coords1.x, coords1.y, 'L', coords2.x, coords2.y, 'Z'].join(' ');
    var pathHtml = '<path id="' + id + '" d="' + pathString + '" stroke-width="3" stroke="white" opacity="0.1" fill="transparent"></path>';

    return pathHtml;
}

g.views.removeWire = function(id) {
    console.log('Deleting id:', id)
    delete g.views.wires[id];
    g.views.renderWires();
}

g.views.renderWires = function() {
    // `crunch this is rather verbose for what it is doing.
    $('wires').html(Object.keys(g.views.wires).map(function(k) { return g.views.wires[k] }).join(''));
}

