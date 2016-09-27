/// <reference path="../../ts/generated/viewModels.ts" />

//interface Array<T> {
//    getItems?: () => Array<T>;
//    getItem?: (index: number) => T;
//    deleteItem?: (itemIndex: number, collection?: any) => any;
//    indexOfItem?: (obj: T, fromIndex?: number) => number;
//    moveItemTo?: (index: number, other: Array<T>) => void
//    add?: (item: T) => void;
//}

//// Gets all items from a collection
//if (!Array.prototype.getItems) {
//    Array.prototype.getItems = function (): Array<any> {
//        return this;
//    }
//}

//// Get a specific item from a collection given it's index
//if (!Array.prototype.getItem) {
//    Array.prototype.getItem = function (index: number): any {
//        return this[index];
//    }
//}

//// Moves item to another collection of the same type.
//if (!Array.prototype.moveItemTo) {
//    Array.prototype.moveItemTo =  function (index: number, other: Array<any>): void {
//        if (other) {
//            other.push(this[index]);
//            this.deleteItem(index);
//        }
//    }
//}

//// Delete an object from the collection 
//if (!Array.prototype.deleteItem) {
//    Array.prototype.deleteItem =  function (itemIndex: number): void {
//        this.splice(itemIndex, 1);
//    }
//}   

//// Find the index of a given object in a collection
//if (!Array.prototype.indexOfItem) {
//    Array.prototype.indexOfItem = function (obj: any, fromIndex?: number): number {
//        if (fromIndex == null) {
//            fromIndex = 0;
//        } else if (fromIndex < 0) {
//            fromIndex = Math.max(0, this.length + fromIndex);
//        }
//        for (var i = fromIndex, j = this.length; i < j; i++) {
//            if (this[i] === obj)
//                return i;
//        }
//        return -1;
//    }
//}

//// Adds the specified item to the collection.
//if (!Array.prototype.add) {
//    Array.prototype.add = function (item: any): void {
//        this.push(item);
//    }
//}
        
module srv {

    export interface IEnumerable<T> extends Array<T> {
    }

    export interface ICollection<T> extends IEnumerable<T> {
    }

    export interface IOrderedEnumerable<T> extends IEnumerable<T> {
    }

    export interface IList<T> extends ICollection<T> {
    }

    export interface IKeyValuePair<K, V> {
        key: K;
        value: V;
    }

    export interface IDictionary<K, V> extends IEnumerable<IKeyValuePair<K, V>> {
    }

    export interface ISerializableDictionary<K, V> extends IDictionary<K, V> {
    } 
}


