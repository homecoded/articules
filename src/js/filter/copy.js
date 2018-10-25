Filter.CopyFilter = (function () {

    function apply(target, source, options, doneCallback) {
        var cx = target.getContext("2d");

        target.width = source.width;
        target.height = source.height;

        cx.drawImage(source, 0, 0);
        doneCallback()
    }

    return {
        apply: apply
    }
})();

Filter.register('copy', Filter.CopyFilter);