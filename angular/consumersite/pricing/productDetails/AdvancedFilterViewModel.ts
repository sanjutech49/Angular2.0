module consumersite.vm {
    export class AdvancedFilterViewModel {
        static _show30Fixed: boolean = true;
        public get Show30Fixed(): boolean {
            return AdvancedFilterViewModel._show30Fixed;
        }
        public set Show30Fixed(value: boolean) {
            AdvancedFilterViewModel._show30Fixed = value;
        }
        static _show25Fixed: boolean = true;
        public get Show25Fixed(): boolean {
            return AdvancedFilterViewModel._show25Fixed;
        }
        public set Show25Fixed(value: boolean) {
            AdvancedFilterViewModel._show25Fixed = value;
        }
        static _show20Fixed: boolean = true;
        public get Show20Fixed(): boolean {
            return AdvancedFilterViewModel._show20Fixed;
        }
        public set Show20Fixed(value: boolean) {
            AdvancedFilterViewModel._show20Fixed = value;
        }
        static _show15Fixed: boolean = true;
        public get Show15Fixed(): boolean {
            return AdvancedFilterViewModel._show15Fixed;
        }
        public set Show15Fixed(value: boolean) {
            AdvancedFilterViewModel._show15Fixed = value;
        }
        static _show10Fixed: boolean = true;
        public get Show10Fixed(): boolean {
            return AdvancedFilterViewModel._show10Fixed;
        }
        public set Show10Fixed(value: boolean) {
            AdvancedFilterViewModel._show10Fixed = value;
        }
        //
        static _show10Arm: boolean = true;
        public get Show10Arm(): boolean {
            return AdvancedFilterViewModel._show10Arm;
        }
        public set Show10Arm(value: boolean) {
            AdvancedFilterViewModel._show10Arm = value;
        }

        static _show7Arm: boolean = true;
        public get Show7Arm(): boolean {
            return AdvancedFilterViewModel._show7Arm;
        }
        public set Show7Arm(value: boolean) {
            AdvancedFilterViewModel._show7Arm = value;
        }
        static _show5Arm: boolean = true;
        public get Show5Arm(): boolean {
            return AdvancedFilterViewModel._show5Arm;
        }
        public set Show5Arm(value: boolean) {
            AdvancedFilterViewModel._show5Arm = value;
        }

        static _show3Arm: boolean = true;
        public get Show3Arm(): boolean {
            return AdvancedFilterViewModel._show3Arm;
        }
        public set Show3Arm(value: boolean) {
            AdvancedFilterViewModel._show3Arm = value;
        }
        //
        static _sortField: string;
        public get SortField(): string {
            return AdvancedFilterViewModel._sortField;
        }
        public set SortField(value: string) {
            AdvancedFilterViewModel._sortField = value;
        }
        static _sortAsc: boolean;
        public get SortAsc(): boolean {
            return AdvancedFilterViewModel._sortAsc;
        }
        public set SortAsc(value: boolean) {
            AdvancedFilterViewModel._sortAsc = value;
        }
        _isVAEligible: boolean;
        public get isVAEligible(): boolean {
            return this._isVAEligible;
        }
        public set isVAEligible(value: boolean) {
            this._isVAEligible = value;
        }

        _wasVAUsedBefore: boolean;
        public get wasVAUsedBefore(): boolean {
            return this._wasVAUsedBefore
        }

        _onVADisablity: boolean;
        public get onVADisability(): boolean {
            return this._onVADisablity;
        }
        public set onVADisablity(value: boolean) {
            this._onVADisablity = value;
        }

    }
}