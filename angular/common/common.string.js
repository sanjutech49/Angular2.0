var common;
(function (common) {
    var string;
    (function (string) {
        /**
        * @desc Returns true if string is null or white spaces.
        */
        function isNullOrWhiteSpace(value) {
            try {
                return (value == null || value.trim().length === 0);
            }
            catch (ex) {
                return true;
            }
        }
        string.isNullOrWhiteSpace = isNullOrWhiteSpace;
        /**
        * @desc Returns true if string has the value of Guid.Empty.
        */
        function isEmptyGuid(value) {
            return value === "00000000-0000-0000-0000-000000000000";
        }
        string.isEmptyGuid = isEmptyGuid;
        /**
        * @desc Returns true if string guid is null or whitespace or has the value of Guid.Empty.
        */
        function isEmptyGuidOrNull(value) {
            return isNullOrWhiteSpace(value) || isEmptyGuid(value);
        }
        string.isEmptyGuidOrNull = isEmptyGuidOrNull;
        /**
        * @desc Builds comma separated string from collection of strings.
        */
        function buildCommaSeparatedString(stringCollection) {
            var retVal = '';
            if (stringCollection != null && stringCollection.length > 0) {
                for (var i = 0; i < stringCollection.length; i++) {
                    retVal += stringCollection[i];
                    retVal += ', ';
                }
                // Clean up.
                retVal = retVal.trim();
                // Remove trailing comma.
                if (retVal.length > 0 && retVal.substring(retVal.length - 1) == ',')
                    retVal = retVal.substring(0, retVal.length - 1);
            }
            return retVal;
        }
        string.buildCommaSeparatedString = buildCommaSeparatedString;
        /**
        * @desc Converts string to boolean.
        */
        function toBool(value) {
            if (!!value) {
                if (value.toLowerCase() == "false" || value == "0") {
                    return false;
                }
                else if (value.toLowerCase() == "true" || value == "1") {
                    return true;
                }
                else {
                    throw new Error("Invalid cast");
                }
            }
            return null;
        }
        string.toBool = toBool;
    })(string = common.string || (common.string = {}));
})(common || (common = {}));
//# sourceMappingURL=common.string.js.map