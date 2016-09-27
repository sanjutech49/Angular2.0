/// <reference path="../../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../ts/lib/common.util.ts" />
/// <reference path="../../../ts/global/global.ts" />
//Jacob Nix - 01/05/2016
//Currently only works for numbers.  Any other parameters will fail.
var directive;
(function (directive) {
    var InputFilterDirective = (function () {
        function InputFilterDirective($filter) {
            var _this = this;
            this.$filter = $filter;
            this.require = 'ngModel';
            this.scope = {
                inputFilter: "=",
            };
            this.link = function ($scope, element, attrs, ngModel) {
                if (!ngModel)
                    return;
                ngModel.$formatters.unshift(function (a) {
                    return _this.$filter($scope.inputFilter)(ngModel.$modelValue);
                });
                ngModel.$parsers.unshift(function (viewValue) {
                    var plainNumber = viewValue.replace(/[^\d|\-+]/g, ''); //Wipe out any formatting.
                    element.val(_this.$filter($scope.inputFilter)(plainNumber));
                    return plainNumber;
                });
            };
        }
        InputFilterDirective.createNew = function (args) {
            return new InputFilterDirective(args[0]);
        };
        InputFilterDirective.className = 'inputFilter';
        InputFilterDirective.$inject = ['$filter'];
        return InputFilterDirective;
    })();
    directive.InputFilterDirective = InputFilterDirective;
    moduleRegistration.registerDirective(consumersite.moduleName, InputFilterDirective);
})(directive || (directive = {}));
//# sourceMappingURL=inputfilter.directive.js.map