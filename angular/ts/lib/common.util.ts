/// <reference path="../../common/common.objects.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />

module lib {

    var emptyGuid = '00000000-0000-0000-0000-000000000000';

    var noCopyFlagPfx = "$$";

    export interface IPredicate<T> {
        (item: T): boolean;
    }

    export interface IEquality<T> {
        (first: T, second: T): boolean;
    }

    export interface IAccessor<T, TResult> {
        (item: T): TResult;
    }

    export interface IAction<T> {
        (item: T): void;
    }

    export function getEmptyGuid() {
        return emptyGuid;
    }

    export interface IBindValue<T, Val> {
        (item: T, value: Val): void;
    };

    export interface IClassFactory<intf> {
        (intf: intf): intf;
    }

    export function IdIsNullOrDefault(id: string): boolean {
        return !id || id == emptyGuid;
    }

    export function assert(obj: any, error: string) {
        if (common.objects.isNullOrUndefined(obj))
            throw new Error(error);
    }

    export function getNumericValue(value: any, defaultVal: number = 0) {
        return isNaN(+value) ? defaultVal : +value;
    }

    export function reduceNumeric(func: (x: number, y: number) => number, ...numbers): number {
        if (numbers.length == 0) {
            return 0;
        }

        var rslt: number = getNumericValue(numbers[0]);
        for (var i = 1; i < numbers.length; i++) {
            rslt = func(rslt, getNumericValue(numbers[i]));
        }

        return rslt;
    }

    // Does not work , would be nice to find some elegant solution here ...
    //export function reduceNumericAdd(...numbers): number {
    //    return reduceNumeric((x, y) => x + y, ...numbers);
    //}

    export function copyState(source, target, respectNoCopyFlag:boolean = false) {

        for (var key in source) {
            // specialized behaviors
            if (respectNoCopyFlag) {
                //
                // check for prefix , > (as opposed to >=) is intentional to ensure actual identifier
                //

                var keyString = key.toString();
                if (!!keyString && keyString.length > noCopyFlagPfx.length && noCopyFlagPfx == keyString.substr(0, noCopyFlagPfx.length)) {
                    // skip keys flagged as no copy
                    continue;
                }
            }

            // standard behaviors
            if (source.hasOwnProperty(key) && typeof source[key] != "function")
                target[key] = source[key];
        }
    }

    export function filterWithProjection<T, TResult>(source: T[], pred: IPredicate<T>, accessor: IAccessor<T, TResult>): TResult[] {

        var items: TResult[] = [];

        if (source) {
            source.forEach(item => {
                if (pred(item))
                    items.push(accessor(item));
            });
        }

        return items;
    }

    export function filter<T>(source: T[], pred: IPredicate<T>): T[] {

        var items: T[] = [];

        if (source) {
            source.forEach(item => {
                if (pred(item))
                    items.push(item);
            });
        }

        return items;
    }

    export function diff<T>(a: T[], b: T[], eq: IEquality<T>): T[] {
        var retVal: T[] = [];

        if (!a) {
            return retVal;
        }

        if (!b) {
            return a;
        }
             
        retVal = filter(a, aItem => {
            return filter(b, bItem => {
                return eq(bItem, aItem)
            }).length == 0
        });

        return retVal;
    }

    export function findIndex<T>(source: T[], pred: IPredicate<T>, defaultValue: number = -1): number {

        if (source) {
            for (var i = 0; i < source.length; i++) {
                if (pred(source[i]))
                    return i;
            }
        }
        return defaultValue;
    }

    export function findFirst<T>(source: T[], pred: IPredicate<T>, defaultValue?: T): T {

        if (source) {
            for (var i = 0; i < source.length; i++) {
                if (pred(source[i]))
                    return source[i];
            }
        }

        return defaultValue;
    }

    /**
   * @desc Finds single item in collection for the specified predicate. 
   * Throws exception if more matching elements are found.
   */
    export function findSingle<T>(source: T[], pred: IPredicate<T>, defaultValue?: T): T {

        if (source) {
            var results = new Array<T>();
            for (var i = 0; i < source.length; i++) {
                var item = source[i];
                if (pred(item)) {
                    results.push(item);
                }

                if (results.length > 1) {
                    throw new Error("More than one matching element found");
                }
            }

            if (results.length === 1) {
                return results[0];
            }
        }

        return defaultValue;
    }

    export function max<T>(source: T[], accessor: IAccessor<T, number>, defaultReturn?: number): number {

        var max = defaultReturn ? defaultReturn : 0;

        if (source) {
            source.forEach(item => {
                var val = accessor(item);
                max = val > max ? val : max;
            });
        }
        return max;
    }

    export function removeFirst<T>(source: T[], pred: IPredicate<T>): boolean {

        if (source) {
            for (var i = 0; i < source.length; i++) {
                if (pred(source[i])) {
                    source.splice(i, 1);
                    return true;
                }
            }
        }
        return false;
    }

    export function replace<T>(source: T[], item: T, pred: IPredicate<T>): boolean {

        if (source) {
            for (var i = 0; i < source.length; i++) {
                if (pred(source[i])) {
                    source[i] = item;
                    return true;
                }
            }
        }
        return false;
    }

    export function update<T>(source: T[], item: T, pred: IPredicate<T>): boolean {

        if (source) {
            for (var i = 0; i < source.length; i++) {
                if (pred(source[i])) {
                    angular.extend(source[i], item);
                    return true;
                }
            }
        }
        return false;
    }

    export function move<T>(source: T[], dest: T[], pred: IPredicate<T>): boolean {

        if (source && dest) {
            var item = lib.findFirst(source, pred);
            if (item) {
                lib.removeFirst(source, pred);
                dest.push(item);
                return true;
            }
        }

        return false;
    }

    export function forEach<T>(source: T[], action: (item: T) => void) {
        if (source) {
            source.forEach(item => action(item));
        }
    }

    export function conditionalForEach<T>(source: T[], pred: IPredicate<T>, action: (item: T) => void) {
        if (source) {
            source.forEach(item => {
                if (pred(item)) {
                    action(item);
                }
            });
        }
    }

    export function summate<T>(source: T[], pred: IPredicate<T>, accessor: IAccessor<T, number>): number {

        var total = 0;

        if (source) {
            source.forEach(item => {
                if (pred(item)) {
                    total += accessor(item);
                }
            });
        }
        return total;
    }

    export function summateAll<T>(source: T[], accessor: IAccessor<T, number>): number {

        var total = 0;

        if (source) {
            source.forEach(item => {
                total += accessor(item);
            });
        }
        return total;
    }

    export function shallowCopy<T>(items: T[]): T[] {

        var list: T[] = [];

        if (items) {
            list = [].concat(items);
        }

        return list;
    }

    export function contains<T>(items: T[], pred: IPredicate<T>) {

        if (items) {
            for (var i = 0; i < items.length; i++) {
                if (pred(items[i])) {
                    return true;
                }
            }
        }
        return false;
    }

    export function distinct<T>(items: T[], eq: IEquality<T>): T[] {

        var indicesToRemove: number[] = [];
        var distinctItems: T[] = [];

        if (items) {
            for (var index = 0; index < items.length; index++) {
                var item = items[index];
                var pred = currentItem => eq(currentItem, item);
                for (var i = index + 1; i < items.length; i++) { // start the search position to one higher than the current index
                    if (!indicesToRemove.some(idx => idx == i) && pred(items[i]))
                        indicesToRemove.push(i);
                }
            }

            if (indicesToRemove.length == 0)
                distinctItems = shallowCopy(items);
            else {

                // sort the indices from lowest to highest
                indicesToRemove = indicesToRemove.sort();
                
                // get the first index to skip
                var idxToSkip = indicesToRemove.shift();

                for (var i = 0; i < items.length; i++) {
                    if (i != idxToSkip)
                        distinctItems.push(items[i]);
                    else
                        idxToSkip = indicesToRemove.length > 0 ? indicesToRemove.shift() : -1; // set to -1 in order to copy the remaining items
                }
            }
        }

        return distinctItems;
    }

    export function updateAndReturnNonMatching<intf>(srcList: intf[], destList: intf[], equality: IEquality<intf>, classFactory: IClassFactory<intf>): intf[] {

        var nonMatching: intf[] = [];

        if (srcList && destList) {

            srcList.forEach(srcItem => {

                var pred = destItem => equality(srcItem, destItem);

                var index = findIndex(destList, pred, -1);
                if (index != -1)
                    destList[index] = classFactory(srcItem);
                else
                    nonMatching.push(classFactory(srcItem));
            });
        }

        return nonMatching;
    }

    export function startsWith(prefix: string, text: string): boolean {
        if (prefix && text)
            return text.slice(0, prefix.length) == prefix;

        return false;
    }

    /**
    * @desc Gets array of string values from lookup.
    */
    export function getLookupStrings(lookup: srv.IList<srv.ILookupItem>): string[] {
        if (!lookup)
            throw new Error("Lookup not defined");

        var retVal = [];

        // Populate list.
        lib.forEach(lookup,(item) => retVal.push(item.text));

        return retVal;
    }

    /**
    * @desc Gets lookup string value by provided enum collection.
    */
    export function getLookupStringsByEnum(lookup: srv.IList<srv.ILookupItem>, enumTypes: any[]) {
        if (!lookup)
            throw new Error("Lookup not defined");

        if (!enumTypes)
            throw new Error("enumTypes not defined");

        var retVal: string[] = [];

        lib.forEach(enumTypes, enumType => retVal.push(this.getLookupStringByEnum(lookup, enumType)));

        return retVal;
    }

    /**
    * @desc Gets lookup string value by enum.
    */
    export function getLookupStringByEnum(lookup: srv.IList<srv.ILookupItem>, enumType: any): string {
        if (!lookup)
            throw new Error("Lookup not defined");

        if (angular.isUndefined(enumType))
            throw new Error("enumType not defined");

        var typ = lib.findFirst(lookup, o => o.value == String(enumType));
        if (!!typ)
            return typ.text;
    }

    /**
    * @desc Check if value is number
    */
    export function isNumber(value: any): boolean {
        return typeof (value) === "number";
    }
}