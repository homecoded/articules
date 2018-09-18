var Filter = (function () {

    var filters = {};

    function register(name, filter) {
        filters[name] = filter
    }

    function applyFilters(names, taget_canvas, source_canvas) {

        function next(id) {
            applyFilter(id, next)
        }

        function applyFilter (id, next) {
            if (id >= names.length)
                return;

            var filter = filters[names[id]];

            filter.apply(
                taget_canvas,
                source_canvas,
                function () {
                    next(id +1)
                }
            );
        }

        next(0);
    }

    return {
        register: register,
        applyFilters: applyFilters
    };
})();