(function () {
    'use strict';
    angular.module('loanDetails')
        .controller('housingExpenseController', housingExpenseController);

    function housingExpenseController() {
        var vm = this;
        vm.test = 'Housing expense';
    }
})();

