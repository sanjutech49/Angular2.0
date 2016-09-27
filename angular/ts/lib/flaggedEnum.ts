module lib {

    /**
    *   Credit: 
    *       flagged-enum-ts
    *       https://bitbucket.org/danatcofo/flagged-enum-ts
    *       Bringing the power of enum flags to TypeScript
    *       http://www.codeproject.com/Tips/787235/Bringing-the-power-of-enum-flags-to-TypeScript
    *       Daniel Gidman ; http://www.codeproject.com/script/Membership/View.aspx?mid=1967244
    */

    export interface IFlaggedEnumGenerator {
        (_enum: any, _max: number): IFlaggedEnum;
    }

    export interface IFlaggedEnum {
        (val: IFlaggedEnum): void;
        (val: number): void;
        (val: string): void;

        /** array of the individual enum flags that represent the value 
         */
        toArray(): IFlaggedEnum[];

        /** does this instance contain all the flags of the value 
         */
        contains(val: IFlaggedEnum): boolean;
        contains(val: number): boolean;
        contains(val: string): boolean;

        /** adds the flags to the value and returns a new instance 
         */
        add(val: IFlaggedEnum): IFlaggedEnum;
        add(val: number): IFlaggedEnum;
        add(val: string): IFlaggedEnum;

        /** removes the flags from the value and returns a new instance 
         */
        remove(val: IFlaggedEnum): IFlaggedEnum;
        remove(val: number): IFlaggedEnum;
        remove(val: string): IFlaggedEnum;

        /** returns an instance containing all intersecting flags 
         */
        intersect(val: IFlaggedEnum): IFlaggedEnum;
        intersect(val: number): IFlaggedEnum;
        intersect(val: string): IFlaggedEnum;

        /** does the two instances equal each other 
         */
        equals(val: IFlaggedEnum): boolean;
        equals(val: number): boolean;
        equals(val: string): boolean;

    }

    /** create a class definition for a Flagged Enum
     * @method create
     * @param _enum {enum} The enum definition being exteded
     * @param _max {number} the maximum possible value of the enum being extended
     * @returns {IFlaggedEnum} the class definition for the provided enum
     */
    export var createFlaggedEnum: IFlaggedEnumGenerator = function (_enum: any, _max: number): IFlaggedEnum {

        var base: any = _enum,
            max: number = _max;

        var Base: IFlaggedEnum = <any>function (val: any): void {
            if (typeof (val) === "string") {
                val = base[val];
            }
            this.value = val + 0;
        };

        var proto: any = Base.prototype;

        proto.valueOf = function (): number { return <number>this.value; };
        proto.toString = function (): string {
            var list: string[] = [];
            for (var i: number = 1; i < max; i = i << 1) {
                if ((this.value & i) !== 0) {
                    list.push(base[i]);
                }
            }
            return list.toString();
        };

        proto.toArray = function (): IFlaggedEnum[] {
            var list: IFlaggedEnum[] = [];
            for (var i: number = 1; i < max; i = i << 1) {
                if ((this.value & i) !== 0) {
                    list.push(new Base(i));
                }
            }
            return list;
        };

        proto.contains = function (val: any): boolean {
            if (typeof (val) === "string") {
                val = base[val];
            }
            return (this.value & val) === (val + 0);
        };

        proto.add = function (val: any): IFlaggedEnum {
            if (typeof (val) === "string") {
                val = base[val];
            }
            return new Base(this.value | val);
        };

        proto.remove = function (val: any): IFlaggedEnum {
            if (typeof (val) === "string") {
                val = this.base[val];
            }
            return new Base((this.value ^ val) & this.value);
        };

        proto.intersect = function (val: any): IFlaggedEnum {
            if (typeof (val) === "string") {
                val = base[val];
            }

            //final is JavaScript Reserved Word, compress.msbuild is failing!
            var final_: number = 0;
            for (var i: number = 1; i < max; i = (i << 1)) {
                if ((this.value & i) !== 0 && (val & i) !== 0) {
                    final_ += i;
                }
            }
            return new Base(final_);
        };

        proto.equals = function (val: any): boolean {
            if (typeof (val) === "string") {
                val = base[val];
            }
            return this.value === (val + 0);
        };

        return Base;

    };
}
