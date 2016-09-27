module srv {
    export interface IHDMADisclosure {
        isNotDisclosing: boolean;
        isNativeAmericanOrAlaskanNative: boolean;
        isBlackOrAfricanAmerican: boolean;
        isAsian: boolean;
        isHawaiinNativeOrOtherPaficIslander: boolean;
        isWhite: boolean;
        isHispanic: boolean;
        isNonHispanic: boolean;
    }

}

module cls {
    export class HDMADisclosure implements srv.IHDMADisclosure {
        public isNotDisclosing: boolean;
        public isNativeAmericanOrAlaskanNative: boolean;
        public isBlackOrAfricanAmerican: boolean;
        public isAsian: boolean;
        public isHawaiinNativeOrOtherPaficIslander: boolean;
        public isWhite: boolean;
        public isHispanic: boolean;
        public isNonHispanic: boolean;
    }
}