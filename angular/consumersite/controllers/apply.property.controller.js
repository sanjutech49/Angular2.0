/// <reference path="../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../Scripts/typings/underscore/underscore.d.ts" />
var consumersite;
(function (consumersite) {
    var PropertyController = (function () {
        // dependencies are injected via AngularJS $injector
        // controller's name is registered in Application.ts and specified from ng-controller attribute in index.html
        function PropertyController() {
        }
        PropertyController.className = "propertyController";
        PropertyController.$inject = [];
        return PropertyController;
    })();
    consumersite.PropertyController = PropertyController;
    moduleRegistration.registerController(consumersite.moduleName, PropertyController);
})(consumersite || (consumersite = {}));
//# sourceMappingURL=apply.property.controller.js.map