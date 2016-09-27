(function () {
    'use strict';

    angular.module('util')
        .provider('userAccountIdResolver', userAccountIdResolver);

    function userAccountIdResolver() {

        // Used for retrieval of logged user id for enabling fetching Application Data and My Lists from server in parallel
        // This is temporary solution until LC3.0 user logging is implemented

        var userAccountId;

        this.$get = function () {
            return resolver;
        };

        function resolver(applicationDataService) {
            
            if (userAccountId)
                return userAccountId;

            userAccountId = applicationDataService.getUserAccountId().then(function (result) {
                var id = parseInt(result.data);

                return id;
            },
            function (error) {
                $log.error('Failure loading UserAccountId', error);
            });

            return userAccountId;
        }
    }
})();