/// <reference path="../../scripts/typings/angularjs/angular.d.ts" />
var appData;
(function (appData) {
    var ApplicationDataService2 = (function () {
        function ApplicationDataService2($q, applicationDataResolver, applicationDataService, enums, $log) {
            var _this = this;
            this.$q = $q;
            this.applicationDataResolver = applicationDataResolver;
            this.applicationDataService = applicationDataService;
            this.enums = enums;
            this.$log = $log;
            this.getApplicationData = function () {
                var deferred = _this.$q.defer();
                var self = _this;
                _this.applicationDataService.getUserAccountId().then(function (result) {
                    var userAccountId = parseInt(result.data);
                    deferred.resolve(self.applicationDataResolver(self.applicationDataService, null, null, self.enums, userAccountId));
                }, function (error) {
                    this.$log.error('Failure loading UserAccountId', error);
                    return deferred.reject;
                });
                return deferred.promise;
            };
        }
        ApplicationDataService2.$inject = ['$q', 'applicationDataResolver', 'applicationDataService', 'enums', '$log'];
        return ApplicationDataService2;
    })();
    angular.module('util').service('applicationDataService2', ApplicationDataService2);
})(appData || (appData = {}));
//# sourceMappingURL=applicationdata.service2.js.map