/// <reference path="../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../Scripts/typings/underscore/underscore.d.ts" />
var consumersite;
(function (consumersite) {
    var RatesController = (function () {
        // dependencies are injected via AngularJS $injector
        // controller's name is registered in Application.ts and specified from ng-controller attribute in index.html
        function RatesController() {
            this.controllerAsName = "ratesCntrl";
            this.printSomething = function () {
                console.log("Rates work");
            };
        }
        RatesController.className = "ratesController";
        RatesController.$inject = [];
        return RatesController;
    })();
    consumersite.RatesController = RatesController;
    moduleRegistration.registerController(consumersite.moduleName, RatesController);
})(consumersite || (consumersite = {}));
//# sourceMappingURL=rates.controller.js.map