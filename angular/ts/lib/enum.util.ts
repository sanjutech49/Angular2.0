/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />

module lib {

    export function enumToLookupList<E>(e: E): srv.IList<srv.ILookupItem> {
        if (e == null)
            return [];

        var enumList: srv.IList<srv.ILookupItem> = [];
        var enumMapped = getNamesAndValues(e);

        for (var i=0; i < enumMapped.length; i++) {
            enumList.push(new cls.LookupItem(enumMapped[i].name, enumMapped[i].value.toString()));
        }

        return enumList;
    }

    function getValues(e: any) {
        return Object.keys(e).map(v => parseInt(v, 10)).filter(v => !isNaN(v));
    }

    function getNamesAndValues(e: any) {
        return getValues(e).map(v => { return { name: <string>e[v], value: v }; });
    }
}