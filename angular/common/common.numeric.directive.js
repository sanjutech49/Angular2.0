(function () {
    'use strict';

    angular.module('common')
        .directive('impNumeric', impNumeric);

    /**
    * @desc Directive for restricting only numeric input.
    * @example <input type="text" imp-numeric />
    */
    function impNumeric() {
        return {
            restrict: 'A',
            require: '?ngModel',
            link: function (scope, element, attrs, ctrl) {
                if (!ctrl) {
                    return;
                }

                ctrl.$parsers.push(function (val) {
                    if (!(val)) {
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
        };
    }

})();