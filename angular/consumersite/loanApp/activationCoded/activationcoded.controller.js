/// <reference path="../../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../../Scripts/typings/underscore/underscore.d.ts" />
var consumersite;
(function (consumersite) {
    var ActivationCodedController = (function () {
        // dependencies are injected via AngularJS $injector
        // controller's name is registered in Application.ts and specified from ng-controller attribute in index.html
        function ActivationCodedController() {
            this.controllerAsName = "activationCodedCntrl";
        }
        ActivationCodedController.className = "activationCodedController";
        ActivationCodedController.$inject = [];
        return ActivationCodedController;
    })();
    consumersite.ActivationCodedController = ActivationCodedController;
    moduleRegistration.registerController(consumersite.moduleName, ActivationCodedController);
})(consumersite || (consumersite = {}));
//# sourceMappingURL=activationcoded.controller.js.map