/// <reference path="../../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../../Scripts/typings/underscore/underscore.d.ts" />
var consumersite;
(function (consumersite) {
    var CreditScoresController = (function () {
        // dependencies are injected via AngularJS $injector
        // controller's name is registered in Application.ts and specified from ng-controller attribute in index.html
        function CreditScoresController() {
            this.controllerAsName = "creditScoresCntrl";
        }
        CreditScoresController.className = "creditScoresController";
        CreditScoresController.$inject = [];
        return CreditScoresController;
    })();
    consumersite.CreditScoresController = CreditScoresController;
    moduleRegistration.registerController(consumersite.moduleName, CreditScoresController);
})(consumersite || (consumersite = {}));
//# sourceMappingURL=creditscores.controller.js.map