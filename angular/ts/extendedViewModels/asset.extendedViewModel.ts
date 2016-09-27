

module srv {
    export interface IAssetViewModel {
        getAutomobiles?: () => any;
        isCoBorrower?: boolean;
        ownerType?: srv.OwnerTypeEnum;
    }
}

module cls {
    export class AssetViewModel extends srv.cls.AssetViewModel {
        institiutionContactInfoModified: boolean;
        isUserEntry: boolean;
        isRemoved: boolean;

        constructor(asset?: srv.IAssetViewModel) {
            super();
            if (asset) {
                common.objects.automap(this, asset);
            }
            else {
                //
                // @todo: Review initialization for AssetViewModel
                //
                this.financialInstitutionName = "";
                this.accountNumber = "";
                this.jointAccount = false;
                this.institiutionContactInfo = new cls.CompanyDataViewModel();
                this.institiutionContactInfo.companyName = this.financialInstitutionName;
            }

            if (!this.institiutionContactInfo) {
                this.institiutionContactInfo = new cls.CompanyDataViewModel();
                this.institiutionContactInfoModified = false;
            }
            else {
                //this.institiutionContactInfo = new cls.CompanyDataViewModel(this.institiutionContactInfo);
                this.institiutionContactInfoModified = this.checkIteminstitiutionContactInfoModified(this.institiutionContactInfo);
            }
            this.isRemoved = false;
        }

        //get InstitiutionContactInfo(): srv.ICompanyDataViewModel {
        //    return (this.institiutionContactInfo ? this.institiutionContactInfo : (this.institiutionContactInfo = new cls.CompanyDataViewModel()));                 
        //}
        //set InstitiutionContactInfo(newInfo: srv.ICompanyDataViewModel) {
        //    this.institiutionContactInfo = newInfo;
        //}

        checkIteminstitiutionContactInfoModified = (item: any): any => {
            if (!item) return false;

            var result = item.attn || item.phone || item.fax || item.email ||
                (item.addressViewModel &&
                    (item.addressViewModel.streetName ||
                        item.addressViewModel.cityName ||
                        item.addressViewModel.stateName ||
                        item.addressViewModel.zipCode));

            return !result ? false : true;

        }

    }

    export class AutomobileAssetViewModel extends AssetViewModel {
        constructor() {
            super();
            this.isUserEntry = true;
            this.assetType = 15;
        }
    }

    export class DownPaymentAssetViewModel extends AssetViewModel {
        constructor() {
            super();
            this.isDownPayment = true;
            this.monthlyAmount = 0;
            this.assetType = 14;
        }
    }

    export class FinancialsAssetViewModel extends AssetViewModel {
        constructor() {
            super();
            this.isUserEntry = true;
            this.institiutionContactInfoModified = false;
            this.assetType = 0;
        }
    }

    export class LifeInsuranceAssetViewModel extends AssetViewModel {
        constructor() {
            super();
            this.isUserEntry = true;
            this.assetType = 13;
        }
    }
    
}