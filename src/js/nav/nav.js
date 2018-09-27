(function () {
    var nav = document.querySelector('#nav');
    var icon = document.querySelector('#menu-icon');
    icon.onclick = function () {
        nav.classList.toggle('open');
    };
})();
