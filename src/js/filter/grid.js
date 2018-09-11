Filter.GridFilter = (function () {

    function apply(canvas) {
        let cx = canvas.getContext("2d");
        cx.strokeStyle = "blue";
        cx.lineWidth = 1;
        cx.strokeRect(5, 5, 50, 50);
        cx.lineWidth = 5;
        cx.strokeRect(135, 5, 50, 50);
    }

    return {
        apply: apply
    }
})();

Filter.register('grid', Filter.GridFilter);