/// <reference path="../../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../ts/lib/common.util.ts" />
/// <reference path="../../../ts/global/global.ts" />
var directive;
(function (directive) {
    var SaveContinueController = (function () {
        function SaveContinueController(navigationService, $scope) {
            var _this = this;
            this.navigationService = navigationService;
            this.$scope = $scope;
            this.getNavigationDisplayName = function () {
                return _this.navigationService.getNavigationDisplayName();
            };
            this.goToNextState = function () {
                if (_this.$scope.form.$valid) {
                    _this.navigationService.next();
                }
                else {
                    for (var key in _this.$scope.form.$error) {
                        for (var i = 0; i < _this.$scope.form.$error[key].length; i++) {
                            _this.$scope.form.$error[key][i].$setTouched();
                        }
                    }
                }
            };
            this.alertVisible = function () {
                if (_this.buttonClicked) {
                    _this.alertCannotNavigate = !_this.$scope.form.$valid;
                }
                return _this.alertCannotNavigate;
            };
        }
        SaveContinueController.className = 'saveContinueController';
        SaveContinueController.$inject = ['navigationService', '$scope'];
        return SaveContinueController;
    })();
    directive.SaveContinueController = SaveContinueController;
    var SaveContinueDirective = (function () {
        function SaveContinueDirective() {
            //controller = ($scope: UINavigate) => {
            //    return new SaveContinueController(this.navigationService, $scope);
            //}
            this.controller = 'saveContinueController';
            this.controllerAs = 'saveContCntrl';
            this.transclude = true;
            this.restrict = 'E';
            this.bindToController = false;
            this.scope = {
                form: '='
            };
            this.templateUrl = "/angular/consumersite/directives/savecontinue/savecontinue.template.html";
        }
        SaveContinueDirective.createNew = function (args) {
            return new SaveContinueDirective();
        };
        SaveContinueDirective.className = 'saveContinue';
        SaveContinueDirective.$inject = [];
        return SaveContinueDirective;
    })();
    directive.SaveContinueDirective = SaveContinueDirective;
    moduleRegistration.registerController(consumersite.moduleName, SaveContinueController);
    moduleRegistration.registerDirective(consumersite.moduleName, SaveContinueDirective);
})(directive || (directive = {}));
//# sourceMappingURL=savecontinue.directive.js.map