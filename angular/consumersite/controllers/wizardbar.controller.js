/// <reference path="../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../Scripts/typings/underscore/underscore.d.ts" />
var consumersite;
(function (consumersite) {
    var WizardBarController = (function () {
        // dependencies are injected via AngularJS $injector
        // controller's name is registered in Application.ts and specified from ng-controller attribute in index.html
        function WizardBarController() {
        }
        WizardBarController.className = "wizardBarController";
        WizardBarController.$inject = [];
        return WizardBarController;
    })();
    consumersite.WizardBarController = WizardBarController;
    moduleRegistration.registerController(consumersite.moduleName, WizardBarController);
})(consumersite || (consumersite = {}));
//# sourceMappingURL=wizardbar.controller.js.map