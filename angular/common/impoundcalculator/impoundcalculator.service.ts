(function () {
    'use strict';

    angular.module('impoundCalculator')

        .factory('impoundCalculatorSvc', impoundCalculatorSvc);
    impoundCalculatorSvc.$inject = ['$resource', 'apiRoot'];

    function impoundCalculatorSvc($resource, apiRoot) {
        var miCalculatorApiPath = apiRoot + 'MICalculator/';
        var CalculateMiAmount = $resource(miCalculatorApiPath + 'CalculateMiAmount/');
        var impoundService =
            {
                calculateMiAmount: CalculateMiAmount
            }

        return impoundService;
    };

})(); 