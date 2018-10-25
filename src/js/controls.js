var controls = (function () {

    function getFilterList() {
        var $filter = document.getElementsByClassName('filter-input');
        var filterList = ['copy'];

        for (var i = 0; i < $filter.length; i++) {
            var filter = $filter[i].value;
            var active = $filter[i].checked;

            if (active) {
                filterList.push(filter);
            }
        }

        return filterList;
    }

    return {
        getFilterList: getFilterList
    }
})();