window.$ = function(id) {
    var $el = (typeof id === 'string') ? document.getElementById(id) : id;

    if (!$el) return $el;

    $el.text = function(text) { $el.textContent = text; return this; }
    $el.html = function(html) { $el.innerHTML = html; return this; }

    $el.css = function(css) {
        for (var prop in css) $el.style[prop] = css[prop];
        return this;
    }
    $el.attrs = function(attrs) {
        for (var prop in attrs) $el.setAttribute(prop, attrs[prop]);
        return this;
    }


    $el.hide = function() { $el.css({display: 'none' }); return this; }
    $el.show = function() { $el.css({display: ''}); return this;  }

    $el.bind = function(id, callback) {
        $el.addEventListener('click', callback);
        return this;
    }


    return $el;
}

