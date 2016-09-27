var common;
(function (common) {
    var date;
    (function (date) {
        /**
        * @desc Returns true if date is not undefined or null or min date.
        */
        function isValidDate(value, validateNineteenHundred) {
            if (validateNineteenHundred === void 0) { validateNineteenHundred = false; }
            try {
                var retVal = value != null && value.trim().length != 0 && value.trim().length >= 10 && value.substring(0, 4) != '0001';
                if (retVal && validateNineteenHundred) {
                    var a = new Date(value);
                    var b = new Date("01/01/1900");
                    retVal = a > b;
                }
                return retVal;
            }
            catch (ex) {
                return false;
            }
        }
        date.isValidDate = isValidDate;
    })(date = common.date || (common.date = {}));
})(common || (common = {}));
//# sourceMappingURL=common.date.js.map