/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
var lib;
(function (lib) {
    function directiveFactory(t) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var directive = function (t) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            return new t(args);
        };
        directive.$inject = t.$inject;
        return directive;
    }
    lib.directiveFactory = directiveFactory;
})(lib || (lib = {}));
//# sourceMappingURL=directiveFactory.js.map