(function () {
    'use strict';
    angular.module('loanDetails')
        .controller('monthlyLiabilitiesController', monthlyLiabilitiesController);

    function monthlyLiabilitiesController() {
        var vm = this;
        vm.test = 'Monthly Liabilities';
    }
})();