/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
var lib;
(function (lib) {
    function enumToLookupList(e) {
        if (e == null)
            return [];
        var enumList = [];
        var enumMapped = getNamesAndValues(e);
        for (var i = 0; i < enumMapped.length; i++) {
            enumList.push(new cls.LookupItem(enumMapped[i].name, enumMapped[i].value.toString()));
        }
        return enumList;
    }
    lib.enumToLookupList = enumToLookupList;
    function getValues(e) {
        return Object.keys(e).map(function (v) { return parseInt(v, 10); }).filter(function (v) { return !isNaN(v); });
    }
    function getNamesAndValues(e) {
        return getValues(e).map(function (v) {
            return { name: e[v], value: v };
        });
    }
})(lib || (lib = {}));
//# sourceMappingURL=enum.util.js.map