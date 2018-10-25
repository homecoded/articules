var Filter = (function () {

    var filters = {};

    function register(name, filter, options) {
        filters[name] = {
            filter: filter,
            options: options
        }
    }

    function applyFilters(names, taget_canvas, source_canvas) {

        function next(id) {
            applyFilter(id, next)
        }

        function applyFilter (id, next) {
            if (id >= names.length)
                return;

            var filter = filters[names[id]];

            filter['filter'].apply(
                taget_canvas,
                source_canvas,
                filter['options'],
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