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
    $('players').html("team:<br>@" + _.mapProp(g.game.players, 'name').join('<br>@'));
    $('code').text("game code: " + g.game.code);

    // Render mines
    for (var i = 0; i < g.game.mines.length; i++) {
        g.views.renderMine(i);
    }

    // Render player
    g.game.players.forEach(function(player) {
        g.views.renderPlayer(player);
    })
}

g.views.moveFrame = function(distance) {
    // only horizontal movement
    // TODO: clinch it between left and right borders
    g.frame.x += distance;
    $('gameplay').css({'left': '-' + g.frame.x + 'px'})
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
}
