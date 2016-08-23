window.g = window.g || {};

// This can be optimized a lot.

g.views = {};

// INTRO

g.views.showIntro = function() {
    $('game').hide();
    $('input-name').hide();
    $('input-code').hide();
    $('start').hide();
    $('intro').show();
}

g.views.showNewGame = function() {
    $('game-new').hide();
    $('game-join').hide();
    $('start').show();
    $('input-name').show().focus();
}

g.views.showJoinGame = function() {
    $('game-new').hide();
    $('game-join').hide();
    $('input-code').show();
    $('start').show();
    $('input-name').show().focus();
}

// GAMEPLAY

g.views.showGame = function() {
    $('intro').hide();
    $('game').show();
}

g.views.renderGame = function() {
    $('players').text("team: " + _.mapProp(g.game.players, 'name').join(', '));
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
    // TODO: this is getting calculated twice - don't do that
    size = size || word.size;
    $mine.text(word.text).css({
        'font-size': size + 'px',
        'left': mine.coords.x + 'px',
        'top': mine.coords.y + 'px',
    })
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
    $('player-' +  player.name).show().css({
        left: player.coords.x + 'px',
        top: player.coords.y + 'px'
    })
}
