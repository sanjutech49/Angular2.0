/// <reference path="../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../Scripts/typings/underscore/underscore.d.ts" />
var consumersite;
(function (consumersite) {
    var ApplyWizardBarController = (function () {
        // dependencies are injected via AngularJS $injector
        // controller's name is registered in Application.ts and specified from ng-controller attribute in index.html
        function ApplyWizardBarController() {
        }
        ApplyWizardBarController.className = "applyWizardBarController";
        ApplyWizardBarController.$inject = [];
        return ApplyWizardBarController;
    })();
    consumersite.ApplyWizardBarController = ApplyWizardBarController;
    moduleRegistration.registerController(consumersite.moduleName, ApplyWizardBarController);
})(consumersite || (consumersite = {}));
//# sourceMappingURL=apply.wizardbar.controller.js.map