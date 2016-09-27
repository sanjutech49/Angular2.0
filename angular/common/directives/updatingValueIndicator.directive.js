/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
var UpdatingValueIndicator = (function () {
    function UpdatingValueIndicator() {
        this.updatingValueIndicatorFactory = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            return new UpdatingValueIndicator();
        };
    }
    Object.defineProperty(UpdatingValueIndicator.prototype, "factory", {
        get: function () {
            return this.updatingValueIndicatorFactory;
        },
        enumerable: true,
        configurable: true
    });
    return UpdatingValueIndicator;
})();
//# sourceMappingURL=updatingValueIndicator.directive.js.map