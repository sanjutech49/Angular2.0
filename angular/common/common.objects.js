var common;
(function (common) {
    var objects;
    (function (objects) {
        function copyObject(object) {
            var objectCopy = {};
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
        objects.copyObject = copyObject;
        /**
        * @desc Maps two objects.
        */
        function automap(target, source) {
            for (var key in source) {
                if (source.hasOwnProperty(key))
                    target[key] = source[key];
            }
        }
        objects.automap = automap;
        /**
        * @desc Defaults values in object NOTE: works great if b is not empty object
        */
        function setDefault(a, b) {
            for (var key in b) {
                if (b[key] === null)
                    a[key] = null;
                else if (typeof b[key] === 'string')
                    a[key] = "";
                else if (typeof b[key] === 'boolean')
                    a[key] = false;
                else if (typeof b[key] === 'number')
                    a[key] = 0;
                else if (Array.isArray(b[key]))
                    a[key] = [];
                else if (typeof b[key] === 'object') {
                    setDefault(a[key] = {}, b[key]);
                }
            }
        }
        objects.setDefault = setDefault;
        function isSame(a, b, leaveOutKeys) {
            for (var key in a) {
                if (a.hasOwnProperty(key) && b.hasOwnProperty(key) && leaveOutKeys && (leaveOutKeys.indexOf(key) == -1)) {
                    if (typeof a[key] == 'object') {
                        var result = isSame(a[key], b[key], leaveOutKeys);
                        if (!result)
                            return false;
                    }
                    if (a[key] != b[key])
                        return false;
                }
            }
            return true;
        }
        objects.isSame = isSame;
        function isNullOrUndefined(a) {
            return a == null || a == undefined;
        }
        objects.isNullOrUndefined = isNullOrUndefined;
        function boolToString(obj) {
            return !common.objects.isNullOrUndefined(obj) ? String(obj) : '';
        }
        objects.boolToString = boolToString;
    })(objects = common.objects || (common.objects = {}));
})(common || (common = {}));
//# sourceMappingURL=common.objects.js.map