/// <reference path='../../../angular/ts/extendedViewModels/asset.extendedViewModel.ts' />

module consumersite.vm {

    export enum OwnerTypeEnum {
        None = 0,
        Borrower = 1,
        CoBorrower = 2,
        Joint = 3,
    }

    export class Asset {

        private currentOwnerType;
        private _assetTypeName;
        private getLoanApplication: () => cls.LoanApplicationViewModel;
        private getAsset: () => cls.AssetViewModel;

        constructor(loanApplication: cls.LoanApplicationViewModel, asset: cls.AssetViewModel) {

            this.getLoanApplication = () => loanApplication;
            this.getAsset = () => asset;

            // @todo: Review , more thought needed on overal factory/construction standards
            if (!asset.assetId) {
                asset.assetId = util.IdentityGenerator.nextGuid();
            }
        }

        private _borrowerFullName = "";

        get borrowerFullName(): string {
            switch (this.currentOwnerType) {
                case OwnerTypeEnum.Borrower:
                    this._borrowerFullName = this.getLoanApplication().getBorrower().getFullName();
                    break;
                case OwnerTypeEnum.CoBorrower:
                    this._borrowerFullName = this.getLoanApplication().getCoBorrower().getFullName();
                    break;
                case OwnerTypeEnum.Joint:
                    this._borrowerFullName = "Joint";
                    break;
            }
            return this._borrowerFullName;
        }

        get ownerType(): number {
            return this.currentOwnerType;
        }

        set ownerType(ownerType: number) {

            if (ownerType == OwnerTypeEnum.CoBorrower && this.currentOwnerType == OwnerTypeEnum.Borrower) {
                lib.removeFirst(this.getLoanApplication().getBorrower().getAssets(), asset => asset.assetId == this.getAsset().assetId);
            }
            else if ((ownerType == OwnerTypeEnum.Borrower || ownerType == OwnerTypeEnum.Joint) && this.currentOwnerType == OwnerTypeEnum.CoBorrower) {
                lib.removeFirst(this.getLoanApplication().getCoBorrower().getAssets(), asset => asset.assetId == this.getAsset().assetId);
            }

            var owningBorrower: cls.BorrowerViewModel;
            if (ownerType == OwnerTypeEnum.CoBorrower) {
                owningBorrower = this.getLoanApplication().getCoBorrower();
            }
            else {
                owningBorrower = this.getLoanApplication().getBorrower();
            }
            this.ownerTypePushIfNotExists(owningBorrower);

            this.currentOwnerType = ownerType;
            this.getAsset().jointAccount = ownerType == OwnerTypeEnum.Joint;
        }

        private ownerTypePushIfNotExists = (borrower: cls.BorrowerViewModel) => {
            var thisAsset = this.getAsset();
            var existingAsset = lib.findFirst(borrower.getAssets(), a => a.assetId == thisAsset.assetId);
            if (!existingAsset) {
                borrower.getAssets().push(thisAsset);
            }
        }

        get assetType(): number {
            return this.getAsset().assetType;
        }
        set assetType(assetType: number) {
            this.getAsset().assetType = assetType;;
        }

        get assetTypeName(): string {
            return this._assetTypeName;
        }
        setAssetTypeName(lookupArray: any[], typeVal: number): void {

            for (var i = 0; i < lookupArray.length; i++) {
                if (lookupArray[i].value == typeVal)
                    this._assetTypeName = lookupArray[i].text;
            }
        }

        get financialInstitutionName(): string {
            return this.getAsset().institiutionContactInfo.companyName;
        }
        set financialInstitutionName(financialInstitutionName: string) {
            this.getAsset().institiutionContactInfo.companyName = financialInstitutionName;
        }

        get accountNumber(): string {
            return this.getAsset().accountNumber;
        }
        set accountNumber(accountNumber: string) {
            this.getAsset().accountNumber = accountNumber;
        }

        get assetValue(): number {
            return this.getAsset().monthlyAmount;
        }
        set assetValue(assetValue: number) {
            this.getAsset().monthlyAmount = assetValue;
        }

        get isRemoved(): boolean {
            return this.getAsset().isRemoved;
        }

        set isRemoved(isRemove: boolean) {
            this.getAsset().isRemoved = isRemove;
        }
    }
}