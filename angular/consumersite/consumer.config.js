/// <reference path='../../Scripts/typings/ui-router/angular-ui-router.d.ts'/>
/// <reference path='../../angular/consumersite/services/statelookup.service.ts'/>
var consumersite;
(function (consumersite) {
    var config = (function () {
        function config($stateProvider, $urlRouterProvider) {
            this.$stateProvider = $stateProvider;
            this.$urlRouterProvider = $urlRouterProvider;
            this.init();
        }
        config.prototype.init = function () {
            this.$urlRouterProvider.otherwise('/consumersite');
            for (var i = 0; i < consumersite.consumerStateArray.length; i++) {
                this.$stateProvider.state(consumersite.consumerStateArray[i].name), function () {
                    consumersite.consumerStateArray[i];
                };
            }
        };
        return config;
    })();
    consumersite.config = config;
})(consumersite || (consumersite = {}));
var app = angular.module('consumersite').config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {
        return new consumersite.config($stateProvider, $urlRouterProvider);
    }
]);
app.run(["$rootScope", "$state", function ($rootScope, $state) {
        $rootScope.$on("$stateChangeError", function (event, toState, toParams, fromState, fromParams, error) {
            console.log("ERROR ::: " + error);
        });
        $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams, error) {
        });
    }]);
//# sourceMappingURL=consumer.config.js.map