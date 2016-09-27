/// <reference path="../../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../../Scripts/typings/underscore/underscore.d.ts" />
var consumersite;
(function (consumersite) {
    var RaceController = (function () {
        // dependencies are injected via AngularJS $injector
        // controller's name is registered in Application.ts and specified from ng-controller attribute in index.html
        function RaceController() {
            this.controllerAsName = "raceCntrl";
        }
        RaceController.className = "raceController";
        RaceController.$inject = [];
        return RaceController;
    })();
    consumersite.RaceController = RaceController;
    moduleRegistration.registerController(consumersite.moduleName, RaceController);
})(consumersite || (consumersite = {}));
//# sourceMappingURL=race.controller.js.map