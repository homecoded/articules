var Filter = (function () {

    var filters = {};

    function register(name, filter) {
        filters[name] = filter
    }

    function applyFilters(names, canvas) {

        for (var id in names) {
            filters[names[id]].apply(canvas);
        }
    }


    return {
        register: register,
        applyFilters: applyFilters
    };
})();