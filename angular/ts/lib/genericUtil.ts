/// <reference path="../../common/common.objects.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />

module lib {

    export function createClassArray<Intf, coll, cls>(cls: { new (Intf): cls; }, interfaces: Intf[]): Array<cls>|srv.ICollection<cls>|srv.IList<cls> {

        var classes: cls[] = [];

        if (interfaces) {
            interfaces.forEach(intf => classes.push(new cls(intf)));
        }
        return classes;
    }

    export function cast<T>(item: T): T {
        return <T>item;
    }

}