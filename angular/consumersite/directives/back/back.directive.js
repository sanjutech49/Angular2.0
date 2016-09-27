/// <reference path="../../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../ts/lib/common.util.ts" />
/// <reference path="../../../ts/global/global.ts" />
var directive;
(function (directive) {
    var BackController = (function () {
        function BackController(navigationService) {
            var _this = this;
            this.navigationService = navigationService;
            this.goToPreviousState = function () {
                _this.navigationService.back();
            };
            this.showBackButton = function () {
                return _this.navigationService.canGoBack();
            };
        }
        BackController.className = 'backController';
        BackController.$inject = ['navigationService'];
        return BackController;
    })();
    directive.BackController = BackController;
    var BackDirective = (function () {
        function BackDirective() {
            this.controller = 'backController';
            this.controllerAs = 'backCntrl';
            this.transclude = true;
            this.restrict = 'E';
            this.bindToController = false;
            this.templateUrl = "/angular/consumersite/directives/back/back.template.html";
        }
        BackDirective.createNew = function (args) {
            return new BackDirective();
        };
        BackDirective.className = 'backButton';
        BackDirective.$inject = [];
        return BackDirective;
    })();
    directive.BackDirective = BackDirective;
    moduleRegistration.registerController(consumersite.moduleName, BackController);
    moduleRegistration.registerDirective(consumersite.moduleName, BackDirective);
})(directive || (directive = {}));
//# sourceMappingURL=back.directive.js.map