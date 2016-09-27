/// <reference path="../../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../../Scripts/typings/underscore/underscore.d.ts" />
/// <reference path='../../providers/uiNavigation.provider.ts' />
var consumersite;
(function (consumersite) {
    var HomeController = (function () {
        function HomeController($state, uiNavigation) {
            var _this = this;
            this.$state = $state;
            this.uiNavigation = uiNavigation;
            this.goToState = function (stateName) {
                return _this.$state.href(stateName);
            };
            this.pageLoader = uiNavigation();
        }
        HomeController.className = "homeController";
        HomeController.contollerAsName = "homeCntrl";
        HomeController.$inject = ['$state', 'uiNavigation'];
        return HomeController;
    })();
    consumersite.HomeController = HomeController;
    moduleRegistration.registerController(consumersite.moduleName, HomeController);
})(consumersite || (consumersite = {}));
//# sourceMappingURL=home.controller.js.map