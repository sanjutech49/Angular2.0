(function () {
    'use strict';

    angular.module('contextualBar').factory('comparisonSvc', comparisonSvc);

    comparisonSvc.$inject = ['$resource', 'apiRoot'];

    function comparisonSvc($resource, apiRoot) {

        var comparisonApiPath = apiRoot + 'Comparison/';

        //get methods for contextual bar
        var comparisonServices = $resource(comparisonApiPath + ':action', { path: '@action' }, {
            getComparisonHistory: { method: 'GET', params: { loanId: 'loanId', userAccountId: 'userAccountId' } }
        });


        var service = {
            comparisonServices: comparisonServices
        }

        return service;


    }
})();