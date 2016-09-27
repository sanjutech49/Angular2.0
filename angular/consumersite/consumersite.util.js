var consumersite;
(function (consumersite) {
    var json;
    (function (json) {
        // moved this over from the config file because it noise
        function removeFields(payload) {
            function replacer(key, value) {
                if (key == "$promise")
                    return undefined;
                if (key == "_active")
                    return undefined;
                if (key == "_primary")
                    return undefined;
                if (key == "lookup")
                    return undefined;
                if (value && typeof value === 'object') {
                    // var replacement = {};
                    if (Object.prototype.toString.call(value) == "[object Array]") {
                        var replacementArray = new Array();
                        for (var k in value)
                            if (Object.hasOwnProperty.call(value, k))
                                replacementArray.push(replacer(k, value[k]));
                        return replacementArray;
                    }
                    else {
                        var replacementObject = {};
                        for (var k in value) {
                            if (Object.hasOwnProperty.call(value, k)) {
                                replacementObject[k.replace(/^_/, '')] = value[k];
                            }
                        }
                        return replacementObject;
                    }
                }
                return value;
            }
            ;
            var result = JSON.stringify(payload, replacer);
            return result;
        }
        json.removeFields = removeFields;
    })(json = consumersite.json || (consumersite.json = {}));
})(consumersite || (consumersite = {}));
//# sourceMappingURL=consumersite.util.js.map