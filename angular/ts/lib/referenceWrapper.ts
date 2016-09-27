// this class exists so that there is a shared reference and 
// updates done on this reference will propagate across all controllers

module lib {

    export class referenceWrapper<T> {

        constructor(public ref: T) {
        }
    }

    export function mergeContext<T, C>(value: T, context: C|any): T {

        return angular.extend(value, context);
    }
}