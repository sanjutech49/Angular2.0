/// <reference path="../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../Scripts/typings/underscore/underscore.d.ts" />
/// <reference path='providers/uiNavigation.provider.ts' />
var consumersite;
(function (consumersite) {
    var ConsumerSiteController = (function () {
        function ConsumerSiteController($state, uiNavigation) {
            var _this = this;
            this.$state = $state;
            this.uiNavigation = uiNavigation;
            this.goToState = function (stateName) {
                return _this.$state.href(stateName);
            };
            this.pageLoader = uiNavigation();
        }
        ConsumerSiteController.className = "consumerSiteController";
        ConsumerSiteController.$inject = ['$state', 'uiNavigation'];
        return ConsumerSiteController;
    })();
    consumersite.ConsumerSiteController = ConsumerSiteController;
    moduleRegistration.registerController(consumersite.moduleName, ConsumerSiteController);
})(consumersite || (consumersite = {}));
//# sourceMappingURL=consumersite.controller.js.map