/// <reference path="../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../Scripts/typings/underscore/underscore.d.ts" />
var consumersite;
(function (consumersite) {
    var BorrowerController = (function () {
        // dependencies are injected via AngularJS $injector
        // controller's name is registered in Application.ts and specified from ng-controller attribute in index.html
        function BorrowerController() {
        }
        BorrowerController.className = "borrowerController";
        BorrowerController.$inject = [];
        return BorrowerController;
    })();
    consumersite.BorrowerController = BorrowerController;
    moduleRegistration.registerController(consumersite.moduleName, BorrowerController);
})(consumersite || (consumersite = {}));
//# sourceMappingURL=apply.borrower.controller.js.map