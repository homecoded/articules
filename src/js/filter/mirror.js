Filter.MirrorFilter = (function () {

    function apply(target, source, options, doneCallback) {
        var cx = target.getContext("2d");

        target.width = source.width;
        target.height = source.height;

        cx.save();
        cx.scale(-1, 1);
        cx.drawImage(source, 0 - target.width, 0);
        cx.restore();
        doneCallback();
    }

    return {
        apply: apply
    }
})();

Filter.register('mirror', Filter.MirrorFilter);