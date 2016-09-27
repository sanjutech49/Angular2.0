/// <reference path="../../common/common.objects.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
var lib;
(function (lib) {
    function createClassArray(cls, interfaces) {
        var classes = [];
        if (interfaces) {
            interfaces.forEach(function (intf) { return classes.push(new cls(intf)); });
        }
        return classes;
    }
    lib.createClassArray = createClassArray;
    function cast(item) {
        return item;
    }
    lib.cast = cast;
})(lib || (lib = {}));
//# sourceMappingURL=genericUtil.js.map