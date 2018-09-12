Filter.MirrorFilter = (function () {

    function apply(canvas) {
        var cx = canvas.getContext("2d");

        var image = new Image();
        image.onload = function () {
            cx.save();
            cx.scale(-1, 1);
            cx.drawImage(image, 0 - canvas.width, 0);
            cx.restore();
        };
        image.src = canvas.toDataURL();
        
    }

    return {
        apply: apply
    }
})();

Filter.register('mirror', Filter.MirrorFilter);