(function () {
    'use strict';

    angular.module('loanDetails')

    .factory('propertyDetailsSvc', propertyDetailsSvc);

    propertyDetailsSvc.$inject = ['$resource', 'apiRoot'];

    function propertyDetailsSvc($resource, ApiRoot) {
        var propertyDetailsApiPath = ApiRoot + 'PropertyDetails/';

        var GetPropertyDetailsData = $resource(propertyDetailsApiPath, {}, {
            GetPropertyDetailsData: { method: 'GET', params: { loanId: 'loanId' } }
        });

        var UpdatePropertyDetailsData = $resource(propertyDetailsApiPath + ':id', {}, {
            UpdatePropertyDetailsData: { method: 'PUT', params: { userId: 'userId' } }
        });

        var propertyDetailsService =
           {
               GetPropertyDetailsData: GetPropertyDetailsData,
               UpdatePropertyDetailsData: UpdatePropertyDetailsData
           }

        return propertyDetailsService;
    };

})();