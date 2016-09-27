/// <reference path="../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../Scripts/typings/underscore/underscore.d.ts" />
var consumersite;
(function (consumersite) {
    var ConsumerSiteController = (function () {
        // dependencies are injected via AngularJS $injector
        // controller's name is registered in Application.ts and specified from ng-controller attribute in index.html
        function ConsumerSiteController() {
        }
        ConsumerSiteController.className = "consumerSiteController";
        ConsumerSiteController.$inject = [];
        return ConsumerSiteController;
    })();
    consumersite.ConsumerSiteController = ConsumerSiteController;
    moduleRegistration.registerController(consumersite.moduleName, ConsumerSiteController);
})(consumersite || (consumersite = {}));
//# sourceMappingURL=consumersite.controller.js.map