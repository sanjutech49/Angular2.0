/// <reference path="../../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../../Scripts/typings/underscore/underscore.d.ts" />
var consumersite;
(function (consumersite) {
    var ActivationController = (function () {
        // dependencies are injected via AngularJS $injector
        // controller's name is registered in Application.ts and specified from ng-controller attribute in index.html
        function ActivationController() {
        }
        ActivationController.className = "activationController";
        ActivationController.$inject = [];
        return ActivationController;
    })();
    consumersite.ActivationController = ActivationController;
    moduleRegistration.registerController(consumersite.moduleName, ActivationController);
})(consumersite || (consumersite = {}));
//# sourceMappingURL=activation.controller.js.map