var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var cls;
(function (cls) {
    var AssetViewModel = (function (_super) {
        __extends(AssetViewModel, _super);
        function AssetViewModel(asset) {
            _super.call(this);
            //get InstitiutionContactInfo(): srv.ICompanyDataViewModel {
            //    return (this.institiutionContactInfo ? this.institiutionContactInfo : (this.institiutionContactInfo = new cls.CompanyDataViewModel()));                 
            //}
            //set InstitiutionContactInfo(newInfo: srv.ICompanyDataViewModel) {
            //    this.institiutionContactInfo = newInfo;
            //}
            this.checkIteminstitiutionContactInfoModified = function (item) {
                if (!item)
                    return false;
                var result = item.attn || item.phone || item.fax || item.email || (item.addressViewModel && (item.addressViewModel.streetName || item.addressViewModel.cityName || item.addressViewModel.stateName || item.addressViewModel.zipCode));
                return !result ? false : true;
            };
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
        return AssetViewModel;
    })(srv.cls.AssetViewModel);
    cls.AssetViewModel = AssetViewModel;
    var AutomobileAssetViewModel = (function (_super) {
        __extends(AutomobileAssetViewModel, _super);
        function AutomobileAssetViewModel() {
            _super.call(this);
            this.isUserEntry = true;
            this.assetType = 15;
        }
        return AutomobileAssetViewModel;
    })(AssetViewModel);
    cls.AutomobileAssetViewModel = AutomobileAssetViewModel;
    var DownPaymentAssetViewModel = (function (_super) {
        __extends(DownPaymentAssetViewModel, _super);
        function DownPaymentAssetViewModel() {
            _super.call(this);
            this.isDownPayment = true;
            this.monthlyAmount = 0;
            this.assetType = 14;
        }
        return DownPaymentAssetViewModel;
    })(AssetViewModel);
    cls.DownPaymentAssetViewModel = DownPaymentAssetViewModel;
    var FinancialsAssetViewModel = (function (_super) {
        __extends(FinancialsAssetViewModel, _super);
        function FinancialsAssetViewModel() {
            _super.call(this);
            this.isUserEntry = true;
            this.institiutionContactInfoModified = false;
            this.assetType = 0;
        }
        return FinancialsAssetViewModel;
    })(AssetViewModel);
    cls.FinancialsAssetViewModel = FinancialsAssetViewModel;
    var LifeInsuranceAssetViewModel = (function (_super) {
        __extends(LifeInsuranceAssetViewModel, _super);
        function LifeInsuranceAssetViewModel() {
            _super.call(this);
            this.isUserEntry = true;
            this.assetType = 13;
        }
        return LifeInsuranceAssetViewModel;
    })(AssetViewModel);
    cls.LifeInsuranceAssetViewModel = LifeInsuranceAssetViewModel;
})(cls || (cls = {}));
//# sourceMappingURL=asset.extendedViewModel.js.map