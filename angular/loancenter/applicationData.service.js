(function () {
    'use strict';
    angular.module('util')
        .service('applicationDataService', ['$resource', 'apiRoot', '$filter', '$http', applicationDataService]);

    function applicationDataService($resource, apiRoot, $filter, $http) {
        var appDataApiPath = apiRoot + 'applicationdata/';
        var guidPath = apiRoot + 'IdentityGeneratorService/GetGuids?count=';

        var applicationDataObject = {};

        var service = {
            applicationData: applicationData,
            getUserAccountId: getUserAccountId,
            applicationDataObject: applicationDataObject,
            getGuids: getGuids,
            getUserAccount: getUserAccount
        };

        return service;

        function applicationData() {
            return $resource(appDataApiPath);
        }

        function getGuids(count) {
            return $http.get(guidPath + count);
        }

        function getUserAccountId() {
            return $http.get("/UserAccount/GetUserAccountId");
        //    .success(function (data) {
        //    })
        //    .error(function () {
        //    });
        }

        function getUserAccount(userAccountId) {
            return $http.get(apiRoot + "user/GetUserAccountById", { params: { userAccountId: userAccountId } });
        }
    }
})();