(function () {
    'use strict';

    angular.module('loanDetails')

    .factory('calculatorSvc', calculatorSvc);

    calculatorSvc.$inject = ['$resource', 'apiRoot'];

    function calculatorSvc($resource, ApiRoot) {

        var calculatorApiPath = ApiRoot + 'Calculator/';

        var GetImpounds = $resource(calculatorApiPath, {}, {
            GetImpounds: { method: 'GET', params: { loanId: 'loanId' } }
        });

        var UpdateImpounds = $resource(calculatorApiPath + ':id', {}, {
            UpdateImpounds: { method: 'PUT' }
        });

        var calculatorService =
           {
               GetImpounds: GetImpounds,
               UpdateImpounds: UpdateImpounds
           }

        return calculatorService;
    };

})();