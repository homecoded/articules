(function () {
    var nav = document.querySelector('#nav');
    var icon = document.querySelector('#menu-icon');
    icon.onclick = function () {
        nav.classList.toggle('open');
        var event = new Event('menu_open');
        document.dispatchEvent(event);
    };
})();
