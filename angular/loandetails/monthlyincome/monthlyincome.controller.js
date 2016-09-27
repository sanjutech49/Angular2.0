(function () {
    'use strict';
    angular.module('loanDetails')
        .controller('monthlyIncomeController', monthlyIncomeController);


    function monthlyIncomeController() {
        var vm = this;
        vm.test = 'Monthly Income';
    }
})();