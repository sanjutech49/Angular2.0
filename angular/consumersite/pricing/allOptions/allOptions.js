/// <reference path="../../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../../Scripts/typings/underscore/underscore.d.ts" />
var consumersite;
(function (consumersite) {
    var AllOptionsController = (function () {
        function AllOptionsController($modalInstance) {
            var _this = this;
            this.$modalInstance = $modalInstance;
            this.controllerAsName = "allOptionsCtrl";
            this.close = function () {
                _this.$modalInstance.dismiss('cancel');
            };
        }
        AllOptionsController.className = "allOptionsController";
        AllOptionsController.$inject = [];
        return AllOptionsController;
    })();
    consumersite.AllOptionsController = AllOptionsController;
    moduleRegistration.registerController(consumersite.moduleName, AllOptionsController);
})(consumersite || (consumersite = {}));
//# sourceMappingURL=allOptions.js.map