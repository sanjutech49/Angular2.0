/// <reference path="../../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../ts/lib/common.util.ts" />
/// <reference path="../../../ts/global/global.ts" />
//Jacob Nix - 01/05/2016
//A directive that accepts a single value to compare the elements ngModel value to.
//
//<input class="blah input bluh" input-match="passwordOne" ngModel="passwordTwo"></input>
//
//Preferred method would have been to throw the validators as shown, that functionality is
//still present.  However, classing issue forced developer add/remove defined error thrown classes.
var directive;
(function (directive) {
    var InputMatchDirective = (function () {
        function InputMatchDirective() {
            this.require = 'ngModel';
            this.scope = {
                inputMatch: "=",
            };
            this.link = function ($scope, element, attr, ngModel) {
                var errorClasses = 'input-match';
                ngModel.$validators.comparedTo = function (modelValue) {
                    if (element.parent().hasClass(errorClasses)) {
                        element.parent().removeClass(errorClasses);
                    }
                    if (ngModel.$dirty && (modelValue != $scope.inputMatch)) {
                        element.parent().addClass(errorClasses);
                        return false;
                    }
                    return true;
                };
                $scope.$watch('inputMatch', function () {
                    ngModel.$validate();
                });
            };
        }
        InputMatchDirective.createNew = function (args) {
            return new InputMatchDirective();
        };
        InputMatchDirective.className = 'inputMatch';
        InputMatchDirective.$inject = [];
        return InputMatchDirective;
    })();
    directive.InputMatchDirective = InputMatchDirective;
    moduleRegistration.registerDirective(consumersite.moduleName, InputMatchDirective);
})(directive || (directive = {}));
//# sourceMappingURL=inputmatch.directive.js.map