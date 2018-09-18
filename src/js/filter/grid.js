Filter.GridFilter = (function () {

    function apply(target, source, doneCallback) {
        var gridX = target.width / 3;
        var gridY = target.height / 3;

        let cx = target.getContext("2d");
        cx.strokeStyle = "rgba(0,0,0,0.5)";
        cx.lineWidth = 1;

        cx.beginPath();
        cx.moveTo(gridX, 0)
        cx.lineTo(gridX, target.height);
        cx.stroke();

        cx.beginPath();
        cx.moveTo(gridX * 2, 0);
        cx.lineTo(gridX * 2, target.height);
        cx.stroke();

        cx.beginPath();
        cx.moveTo(0, gridY);
        cx.lineTo(target.width, gridY);
        cx.stroke();

        cx.beginPath();
        cx.moveTo(0, gridY * 2)
        cx.lineTo(target.width, gridY * 2);
        cx.stroke();

        doneCallback();
    }

    return {
        apply: apply
    }
})();

Filter.register('grid', Filter.GridFilter);