module common {

    export module objects {
        export function copyObject<T>(object: T): T {
            var objectCopy = <T>{};

            for (var key in object) {
                if (object.hasOwnProperty(key)) {

                    if (typeof object[key] == "object")
                        objectCopy[key] = object[key].deepClone();
                    else
                        objectCopy[key] = object[key];
                }
            }

            return objectCopy;
        }

        /**
        * @desc Maps two objects.
        */
        export function automap(target: any, source: any): void {
            for (var key in source) {
                if (source.hasOwnProperty(key))
                    target[key] = source[key];
            }
        }

        /**
        * @desc Defaults values in object NOTE: works great if b is not empty object
        */
        export function setDefault(a: any, b: any): void {
            for (var key in b) {
                if (b[key] === null) a[key] = null;
                else if (typeof b[key] === 'string') a[key] = "";
                else if (typeof b[key] === 'boolean') a[key] = false;
                else if (typeof b[key] === 'number') a[key] = 0;
                else if (Array.isArray(b[key])) a[key] = [];
                else if (typeof b[key] === 'object') { setDefault(a[key] = {}, b[key]); }
            }
        }

        export function isSame<T>(a: T, b: T, leaveOutKeys: string[]): boolean {
            for (var key in a)
            {
                if (a.hasOwnProperty(key) && b.hasOwnProperty(key) && leaveOutKeys && (leaveOutKeys.indexOf(key) == -1)) {
                    if (typeof a[key] == 'object') {

                        var result = isSame<T>(a[key], b[key], leaveOutKeys);
                        if (!result)
                            return false;
                    }
                    if (a[key] != b[key])
                        return false;
                }
            }
            return true;
        }

        export function isNullOrUndefined(a: any): boolean {
            return a == null || a == undefined;
        }

        export function boolToString(obj: boolean): string {
            return !common.objects.isNullOrUndefined(obj) ? String(obj) : '';
        }
    }

}