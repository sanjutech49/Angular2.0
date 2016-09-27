/// <reference path="../../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../ts/lib/common.util.ts" />
/// <reference path="../../../ts/global/global.ts" />
var directive;
(function (directive) {
    var InputMatchDirective = (function () {
        function InputMatchDirective() {
            this.scope = {
                compareTo: "=",
            };
            this.link = function (scope, element, attributes, ngModel) {
                ngModel.$validators.compareTo = function (modelValue) {
                    return modelValue == scope.otherModelValue;
                };
                scope.$watch("compareTo", function () {
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
//# sourceMappingURL=passwordmatch.directive.js.map