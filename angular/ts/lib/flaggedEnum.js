var lib;
(function (lib) {
    /** create a class definition for a Flagged Enum
     * @method create
     * @param _enum {enum} The enum definition being exteded
     * @param _max {number} the maximum possible value of the enum being extended
     * @returns {IFlaggedEnum} the class definition for the provided enum
     */
    lib.createFlaggedEnum = function (_enum, _max) {
        var base = _enum, max = _max;
        var Base = function (val) {
            if (typeof (val) === "string") {
                val = base[val];
            }
            this.value = val + 0;
        };
        var proto = Base.prototype;
        proto.valueOf = function () {
            return this.value;
        };
        proto.toString = function () {
            var list = [];
            for (var i = 1; i < max; i = i << 1) {
                if ((this.value & i) !== 0) {
                    list.push(base[i]);
                }
            }
            return list.toString();
        };
        proto.toArray = function () {
            var list = [];
            for (var i = 1; i < max; i = i << 1) {
                if ((this.value & i) !== 0) {
                    list.push(new Base(i));
                }
            }
            return list;
        };
        proto.contains = function (val) {
            if (typeof (val) === "string") {
                val = base[val];
            }
            return (this.value & val) === (val + 0);
        };
        proto.add = function (val) {
            if (typeof (val) === "string") {
                val = base[val];
            }
            return new Base(this.value | val);
        };
        proto.remove = function (val) {
            if (typeof (val) === "string") {
                val = this.base[val];
            }
            return new Base((this.value ^ val) & this.value);
        };
        proto.intersect = function (val) {
            if (typeof (val) === "string") {
                val = base[val];
            }
            //final is JavaScript Reserved Word, compress.msbuild is failing!
            var final_ = 0;
            for (var i = 1; i < max; i = (i << 1)) {
                if ((this.value & i) !== 0 && (val & i) !== 0) {
                    final_ += i;
                }
            }
            return new Base(final_);
        };
        proto.equals = function (val) {
            if (typeof (val) === "string") {
                val = base[val];
            }
            return this.value === (val + 0);
        };
        return Base;
    };
})(lib || (lib = {}));
//# sourceMappingURL=flaggedEnum.js.map