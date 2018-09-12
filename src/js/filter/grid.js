Filter.GridFilter = (function () {

    function apply(canvas) {
        var gridX = canvas.width / 3;
        var gridY = canvas.height / 3;

        let cx = canvas.getContext("2d");
        cx.strokeStyle = "rgba(0,0,0,0.5)";
        cx.lineWidth = 1;

        cx.beginPath();
        cx.moveTo(gridX, 0)
        cx.lineTo(gridX, canvas.height);
        cx.stroke();

        cx.beginPath();
        cx.moveTo(gridX * 2, 0);
        cx.lineTo(gridX * 2, canvas.height);
        cx.stroke();

        cx.beginPath();
        cx.moveTo(0, gridY);
        cx.lineTo(canvas.width, gridY);
        cx.stroke();

        cx.beginPath();
        cx.moveTo(0, gridY * 2)
        cx.lineTo(canvas.width, gridY * 2);
        cx.stroke();

    }

    return {
        apply: apply
    }
})();

Filter.register('grid', Filter.GridFilter);