/// <reference path="../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../Services/scripts/ts/lib/DirectiveFactory.ts" />

module common {

    //angular.module('common')
    //    .directive('impNumeric', impNumeric);

    /**
    * @desc Directive for restricting only numeric input.
    * @example <input type="text" imp-numeric />
    */

    export class NumericDirective implements ng.IDirective {

        restrict = 'A';
        require = '?ngModel';
        link = (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs, ctrl) => {
            if (!ctrl) {
                return;
            }

            ctrl.$parsers.push(function (val: string) {
                if (!val) {
                    var val = '';
                }
                var clean = val.replace(/[^0-9]+/g, '');
                if (val !== clean) {
                    ctrl.$setViewValue(clean);
                    ctrl.$render();
                }
                return clean;
            });

            // Prevent SPACE.
            element.bind('keypress', function (event) {
                if (event.keyCode === 32) {
                    event.preventDefault();
                }
            });
        }

        static Factory(): ng.IDirectiveFactory {
            return lib.DirectiveFactory(NumericDirective);
        }
    }
}

//angular.module("").directive("test", common.NumericDirective.Factory());

