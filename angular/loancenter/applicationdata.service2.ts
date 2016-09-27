/// <reference path="../../scripts/typings/angularjs/angular.d.ts" />

module appData {
    class ApplicationDataService2 {

        static $inject = ['$q', 'applicationDataResolver', 'applicationDataService', 'enums', '$log'];

        constructor(private $q: ng.IQService, private applicationDataResolver, private applicationDataService, private enums, private $log) {
        }

        getApplicationData = (): ng.IPromise<any> => {

            var deferred = this.$q.defer();

            var self = this;

            this.applicationDataService.getUserAccountId().then(function (result) {

                var userAccountId = parseInt(result.data);
                deferred.resolve(self.applicationDataResolver(self.applicationDataService, null, null, self.enums, userAccountId));
            },
                function (error) {
                    this.$log.error('Failure loading UserAccountId', error);
                    return deferred.reject;
                });

            return deferred.promise;
        }
    }

    angular.module('util').service('applicationDataService2', ApplicationDataService2);
}