/// <reference path="../../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../ts/generated/viewModels.ts" />
/// <reference path="../../../ts/generated/viewModelClasses.ts" />
/// <reference path="../../../ts/extendedViewModels/extendedViewModels.ts" />
/// <reference path="../../../ts/extendedViewModels/loan.extendedViewModel.ts" />
/// <reference path="../../../ts/extendedViewModels/property.extendedViewModel.ts" />
/// <reference path="../../../ts/extendedViewModels/transactionInfo.ts" />
/// <reference path="../../../ts/lib/referenceWrapper.ts" />
/// <reference path="../../../ts/lib/common.util.ts" />
/// <reference path="../../../ts/lib/IdentityGenerator.ts" />
/// <reference path="../../../loanevents/loanEvents.service.ts" />
/// <reference path="../../../Common/guid.service.ts" />

module credit {
    class RealEstateItemController {

        submitted = false;
        private loanVmCopy: cls.LoanViewModel;
        activeLoanApplication: any; //: cls.LoanApplicationViewModel; temp, must make interface assignable
        realEstateViewModel: srv.IRealEstateViewModel;
        loanType: number;
        disableMortgageInsurance: boolean;
        isLoanHarp: boolean;
        areSixPiecesAcquiredForAllLoanApplications: boolean;
        isReoValidationRequired = false;
        originalPropertyId: string;
        originalLienPosition: number;
        reoPropertyList: srv.IPropertyViewModel[] = [];
        disableOccupancyType: boolean;
        pledgedAssetModel: srv.ILiabilityViewModel;
        newPropertyId: string;

        private propertyExpenseDefaults = [

            { type: srv.PropertyExpenseType.propertyTax, preferredPayPeriod: String(srv.PeriodTypeEnum.Annually), impounded: true },
            { type: srv.PropertyExpenseType.hOADues, preferredPayPeriod: String(srv.PeriodTypeEnum.Monthly), impounded: false },
            { type: srv.PropertyExpenseType.mortgageInsurance, preferredPayPeriod: String(srv.PeriodTypeEnum.Monthly), impounded: true },
            { type: srv.PropertyExpenseType.homeOwnerInsurance, preferredPayPeriod: String(srv.PeriodTypeEnum.Annually), impounded: true },
            { type: srv.PropertyExpenseType.floodInsurance, preferredPayPeriod: String(srv.PeriodTypeEnum.Monthly), impounded: true },
        ];

        propertyTaxExpense: srv.IPropertyExpenseViewModel;
        homeOwnerExpense: srv.IPropertyExpenseViewModel;
        floodInsuranceExpense: srv.IPropertyExpenseViewModel;
        mortgageInsuranceExpense: srv.IPropertyExpenseViewModel;
        hoaDuesExpense: srv.IPropertyExpenseViewModel;

        private shouldResetLienPosition: boolean = false;

        static $inject = ['$modalInstance', '$interval', 'CreditSvc', 'CreditHelpers', 'enums', 'isNew', 'originalPledgedAssetModel', 'disableFields', 'wrappedLoan',
            'debtAccountOwnershipTypes', 'lookup', 'generalSettings', 'loanEvent', 'commonModalWindowFactory', 'modalWindowType', 'CreditStateService', 'guidService', 'modalPopoverFactory'];

        constructor(private $modalInstance, private $interval: ng.ITimeoutService, private CreditSvc, private CreditHelpers, private enums, private isNew, private originalPledgedAssetModel: cls.LiabilityViewModel, private disableFields, private wrappedLoan: lib.referenceWrapper<cls.LoanViewModel>,
            private debtAccountOwnershipTypes, private lookup: srv.ILookupViewModel, private generalSettings, private loanEvent, private commonModalWindowFactory, private modalWindowType, private CreditStateService: CreditStateService, private guidService: common.IGuidService, private modalPopoverFactory) {

            // shallow copy of LoanViewModel , deep copy of TransactionalInfo
            var tiOrig = <cls.TransactionInfo>wrappedLoan.ref.getTransactionInfo();
            this.tiCopy = tiOrig.cloneTransactionInfo();

            var pledgedAssetModel = this.tiCopy.liability.lookup(originalPledgedAssetModel.liabilityInfoId);
            if (!pledgedAssetModel) {
                // it's a new one
                pledgedAssetModel = new cls.LiabilityViewModel(this.tiCopy, originalPledgedAssetModel, originalPledgedAssetModel.borrowerFullName);
            }

            pledgedAssetModel.companyData = new cls.CompanyDataViewModel(originalPledgedAssetModel.companyData);
            pledgedAssetModel.reoInfo = new cls.REOInfoViewModel(originalPledgedAssetModel.reoInfo);
            this.pledgedAssetModel = pledgedAssetModel;

            this.activeLoanApplication = this.tiCopy.loanApplication.lookup(wrappedLoan.ref.active.loanApplicationId);
            this.realEstateViewModel = this.activeLoanApplication.realEstate;
            this.realEstateViewModel.loanType = wrappedLoan.ref.loanPurposeType;
            this.loanType = wrappedLoan.ref.loanPurposeType;
            this.isLoanHarp = wrappedLoan.ref.loanIsHarp;
            this.disableMortgageInsurance = wrappedLoan.ref.loanIsHarp && this.pledgedAssetModel.getProperty() && !this.pledgedAssetModel.getProperty().doYouPayMortgageInsurance;
            this.areSixPiecesAcquiredForAllLoanApplications = wrappedLoan.ref.sixPiecesAcquiredForAllLoanApplications;
            this.originalPropertyId = this.pledgedAssetModel.getProperty() && this.pledgedAssetModel.getProperty().propertyId;

            this.originalLienPosition = this.pledgedAssetModel.lienPosition;
            this.initializePropertyExpenses();           
            if (this.disableFields || this.isReoDisabled(this.borrowerDebtCommentId)) {
                this.pledgedAssetModel.liabilityDisabled = true;
            }
            this.setValuesFromGeneralSettings();
            this.updateOccupancyTypeAttributes();
            this.displayImpoundList();
            this.setSelectedImpound();
            this.validateReo();
            this.buildAddressesList();
            if (this.isNew)
                this.pledgedAssetModel.pledgedAssetLoanType = this.enums.PledgedAssetLoanType.Fixed;
            
            if (!!originalPledgedAssetModel.property) {
                this.propertyId = originalPledgedAssetModel.property.propertyId;
            }          
        }

        private _tiCopy: cls.TransactionInfo;
        private get tiCopy(): cls.TransactionInfo {
            return this._tiCopy;
        }
        private set tiCopy(tiCopy: cls.TransactionInfo) {
            this._tiCopy = tiCopy;
        }

        get lienPosition(): number {
            return this.pledgedAssetModel.lienPosition;
        }

        set lienPosition(lienPosition: number) {
            this.pledgedAssetModel.lienPosition = lienPosition;
        }

        private _lienPositionLookups: srv.ILookupItem[] = null;
        get lienPositionLookups(): srv.ILookupItem[] {
            if (this._lienPositionLookups == null) {
                this._lienPositionLookups = this.buildLienPositionLookupList();
            }
            return this._lienPositionLookups;
        }
        set lienPositionLookups(readOnly: srv.ILookupItem[]) {
            /*Read-Only*/
        }

        private buildLienPositionLookupList = (): srv.ILookupItem[] => {
            if (!this.hasProperty)
                return [];

            // calculate taken lien positions for current property
            var property = this.pledgedAssetModel.getProperty();
            var activeBorrower = this.activeLoanApplication.getBorrower().borrowerId;
            var activeCoBorrower = this.activeLoanApplication.getCoBorrower().borrowerId;
            var takenLienPositions: number[] = lib.filterWithProjection(this.tiCopy.liability.getValues(),
                o => o.propertyId == property.propertyId && o.liabilityInfoId != this.pledgedAssetModel.liabilityInfoId && (o.borrowerId == activeBorrower || o.borrowerId == activeCoBorrower) && !o.isRemoved,
                o => o.lienPosition);

            // generate new list of lookup items
            var lienPositionLookups: srv.ILookupItem[] = RealEstateItemController.buildLienPositionLookupListDflt(this.lookup.lienPosition);
            lienPositionLookups.forEach(lu => {
                var exists: boolean = (0 < lib.findFirst(takenLienPositions, o => o == parseInt(lu.value)));
                lu.disabled = exists;
            });

            return lienPositionLookups;
        }

        private static buildLienPositionLookupListDflt = (lookups: srv.ILookupItem[]): srv.ILookupItem[]=> {
            var lienPositionLookups: srv.ILookupItem[] = [];
            lookups.forEach(lu => lienPositionLookups.push(cls.LookupItem.fromLookupItem(lu)));
            return lienPositionLookups;
        }

        public getPropertyTypes = (): srv.IList<srv.ILookupItem> => {

            if (this.pledgedAssetModel.getProperty().isSubjectProperty)
                return this.lookup.subjectPropertyTypes;

            return this.lookup.nonSubjectPropertyTypes;
        }

        private initializePropertyExpenses = () => {

            if (this.pledgedAssetModel.getProperty()) {

                this.propertyTaxExpense = this.getPropertyExpense(srv.PropertyExpenseType.propertyTax);
                this.homeOwnerExpense = this.getPropertyExpense(srv.PropertyExpenseType.homeOwnerInsurance);
                this.floodInsuranceExpense = this.getPropertyExpense(srv.PropertyExpenseType.floodInsurance);
                this.mortgageInsuranceExpense = this.getPropertyExpense(srv.PropertyExpenseType.mortgageInsurance);
                this.hoaDuesExpense = this.getPropertyExpense(srv.PropertyExpenseType.hOADues);

                this._propertyTax = this.formatAmount(this.propertyTaxExpense);
                this._homeOwner = this.formatAmount(this.homeOwnerExpense);
                this._floodInsurance = this.formatAmount(this.floodInsuranceExpense);
                this._hoaDues = this.formatAmount(this.hoaDuesExpense);
                this._mortgageInsurance = this.formatAmount(this.mortgageInsuranceExpense);
            }
        }

        private updateExpense = (propertyExpense: srv.IPropertyExpenseViewModel, amount: number) => {

            if (propertyExpense.preferredPayPeriod == String(srv.PeriodTypeEnum.Annually))
                amount /= 12;
            else if (propertyExpense.preferredPayPeriod == String(srv.PeriodTypeEnum.SemiAnnually))
                amount /= 6;
            else if (propertyExpense.preferredPayPeriod == String(srv.PeriodTypeEnum.Quarterly))
                amount /= 3;

            propertyExpense.monthlyAmount = amount;
        }

        private _propertyTax: number;

        propertyTax = (amount: number): number|void => {
            if (!angular.isDefined(amount))
                return this._propertyTax;
            else {
                this._propertyTax = amount;
            }
        }

        public propertyTaxPayPeriodChanged = () => {
            this.updateExpense(this.propertyTaxExpense, this._propertyTax);
        }

        private _hoaDues: number;

        hoaDues = (amount: number): number|void => {
            if (!angular.isDefined(amount))
                return this._hoaDues;
            else {
                this._hoaDues = amount;
            }
        }

        public hoaDuesPayPeriodChanged = () => {
            this.updateExpense(this.hoaDuesExpense, this._hoaDues);
        }

        private _mortgageInsurance: number;

        mortgageInsurance = (amount: number): number|void => {
            if (!angular.isDefined(amount))
                return this._mortgageInsurance;
            else {
                this._mortgageInsurance = amount;
            }
        }

        triggerOwnership = () => {
            if (!this.pledgedAssetModel.getProperty().OwnershipPercentage) {
                this.pledgedAssetModel.getProperty().OwnershipPercentage = 0;
            }                
        }

        public mortgageInsurancePayPeriodChanged = () => {
            this.updateExpense(this.mortgageInsuranceExpense, this._mortgageInsurance);
        }

        private _homeOwner: number;

        homeOwner = (amount: number): number|void => {
            if (!angular.isDefined(amount))
                return this._homeOwner;
            else {
                this._homeOwner = amount;
            }
        }

        public homeOwnerPayPeriodChanged = () => {
            this.updateExpense(this.homeOwnerExpense, this._homeOwner);
        }

        private _floodInsurance: number;

        floodInsurance = (amount: number): number|void => {
            if (!angular.isDefined(amount))
                return this._floodInsurance;
            else {
                this._floodInsurance = amount;
            }
        }

        public floodInsurancePayPeriodChanged = () => {
            this.updateExpense(this.floodInsuranceExpense, this._floodInsurance);
        }

        public formatAmount = (propertyExpense: srv.IPropertyExpenseViewModel): number => {

            if (propertyExpense.preferredPayPeriod == String(srv.PeriodTypeEnum.Annually))
                return Math.round(propertyExpense.monthlyAmount * 12 * 10000) / 10000;
            else if (propertyExpense.preferredPayPeriod == String(srv.PeriodTypeEnum.SemiAnnually))
                return Math.round(propertyExpense.monthlyAmount * 6 * 10000) / 10000;
            else if (propertyExpense.preferredPayPeriod == String(srv.PeriodTypeEnum.Quarterly))
                return Math.round(propertyExpense.monthlyAmount * 3 * 10000) / 10000;
            else
                return propertyExpense.monthlyAmount;
        }

        private getPropertyExpense = (expenseType: srv.PropertyExpenseType): srv.IPropertyExpenseViewModel => {

            var propertyExpense = lib.findFirst(this.pledgedAssetModel.getProperty().propertyExpenses, pe => pe.type == expenseType.toString());
            if (!propertyExpense) {
                var expenseDefault = lib.findFirst(this.propertyExpenseDefaults, ped => ped.type == expenseType);
                propertyExpense = {
                    type: expenseType.toString(), preferredPayPeriod: expenseDefault.preferredPayPeriod, monthlyAmount: 0, impounded: expenseDefault.impounded
                }
                this.pledgedAssetModel.getProperty().propertyExpenses.push(propertyExpense);
            }

            return propertyExpense;
        }

        private setPropertyExpenseImpounds = () => {

            this.hoaDuesExpense.impounded = false;
            this.mortgageInsuranceExpense.impounded = true;

            this.propertyTaxExpense.impounded = false;
            this.homeOwnerExpense.impounded = false;
            this.floodInsuranceExpense.impounded = false;

            var selectedImpound = this.pledgedAssetModel.selectedImpound;

            if (selectedImpound == srv.impoundType.taxesAndInsurance || selectedImpound == srv.impoundType.taxesOnly) {
                this.propertyTaxExpense.impounded = true;
            }

            if (selectedImpound == srv.impoundType.taxesAndInsurance || selectedImpound == srv.impoundType.insuranceOnly) {
                this.homeOwnerExpense.impounded = true;
                this.floodInsuranceExpense.impounded = true;
            }
        }

        // set the selected impound based on the state of the expenses
        public setSelectedImpound = () => {

            if (this.pledgedAssetModel.getProperty()) {

                if (this.propertyTaxExpense.impounded && this.homeOwnerExpense.impounded && this.floodInsuranceExpense.impounded)
                    this.pledgedAssetModel.selectedImpound = srv.impoundType.taxesAndInsurance;
                else if (this.propertyTaxExpense.impounded)
                    this.pledgedAssetModel.selectedImpound = srv.impoundType.taxesOnly;
                else if (this.homeOwnerExpense.impounded && this.floodInsuranceExpense.impounded)
                    this.pledgedAssetModel.selectedImpound = srv.impoundType.insuranceOnly;
                else
                    this.pledgedAssetModel.selectedImpound = srv.impoundType.noImpound;
            }
        }

        public setValuesFromGeneralSettings = () => {
            angular.forEach(this.generalSettings,(setting) => {
                if (setting.settingName == "Show Investment Property") {
                    this.realEstateViewModel.showInvestmentProperty = setting ? setting.status : true;
                }

                if (setting.settingName == "Show Investment Property") {
                    this.realEstateViewModel.showSecondVacationHome = setting ? setting.status : true;
                }
            });
        }

        private buildAddressesList = () => {

            this.realEstateViewModel.addressForDropDown = [];

            var uniqueProperties = this.activeLoanApplication.getUniqueProperties();

            uniqueProperties.forEach(p => this.reoPropertyList.push(new cls.PropertySnapshot(p, this.tiCopy)));

            var reosWithProperties = lib.filter(this.activeLoanApplication.getAllLiabilitiesCombined(), (l: srv.ILiabilityViewModel) => l.isPledged && !!l.propertyId);

            this.reoPropertyList.forEach(propertyItem => {
                this.realEstateViewModel.addressForDropDown.push(new cls.LookupItem(propertyItem.fullAddressString, propertyItem.propertyId));
                var reosWithLienPositions = lib.filter(reosWithProperties, reo => reo.propertyId == propertyItem.propertyId && reo.lienPosition > 0);
            });

            var newProperty = this.createNewDefaultProperty();
            this.newPropertyId = newProperty.propertyId;
            this.realEstateViewModel.addressForDropDown.push(new cls.LookupItem('Not listed - add a property', newProperty.propertyId));
            this.reoPropertyList.push(newProperty);
        }

        private createNewDefaultProperty = (): cls.PropertySnapshot => {
            var defaultProperty = new cls.PropertySnapshot();

            defaultProperty.addressTypeId = srv.AddressType.RealEstate;
            defaultProperty.occupancyType = srv.PropertyUsageTypeEnum.None;
            defaultProperty.OwnershipPercentage = 100;
            defaultProperty.vacancyPercentage = 75;
            defaultProperty.isSubjectProperty = false;

            return defaultProperty;
        }
        onREOAddressChange = () => {
            // set Default Ownership
            if (this.pledgedAssetModel.getProperty() && this.pledgedAssetModel.getProperty().isSubjectProperty) {
                this.pledgedAssetModel.getProperty().OwnershipPercentage = this.activeLoanApplication.ownershipPercentage;
            }
             // Pre-select comment based on address type for refinance
            if (this.loanType == this.enums.LoanTransactionTypes.Refinance) {
                if (this.pledgedAssetModel.getProperty() && this.pledgedAssetModel.getProperty().isSubjectProperty) {
                    this.borrowerDebtCommentId = this.enums.PledgedAssetComment.PayoffAtClose;
        }
                else {
                    this.borrowerDebtCommentId = this.enums.PledgedAssetComment.DoNotPayoff;
                }
            }                          
        }

        public validateReo = () => {
            if (this.areSixPiecesAcquiredForAllLoanApplications) {
                // **(this.pledgedAssetModel.borrowerDebtCommentId !== 0 || this.pledgedAssetModel.borrowerDebtCommentId) - rule to validate zero and check if value is falsy
                if (this.pledgedAssetModel && (this.pledgedAssetModel.borrowerDebtCommentId !== 0 || this.pledgedAssetModel.borrowerDebtCommentId) && this.pledgedAssetModel.borrowerDebtCommentId == 6)  // borrowerDebtCommentId == 6 - Not My Loan
                    this.isReoValidationRequired = false;
                else
                    this.isReoValidationRequired = true;
            }
        }

        public helocHighLimitValidation = () => {
            // *Rules are separated for better readability

            // -- case six pieces completed & reo validation required
            if (!this.areReoValidationAndSixPiecesRequired())
                return false;

            // -- case field disabled
            if (this.pledgedAssetModel.liabilityDisabled ||
                this.pledgedAssetModel.pledgedAssetLoanType != this.enums.PledgedAssetLoanType.Heloc)
                return false;

            // -- case model validation
            return !this.pledgedAssetModel.maximumCreditLine;
        }

        public isLienPositionFirstValidation = () => {
            return this.areReoValidationAndSixPiecesRequired() &&
                !this.pledgedAssetModel.liabilityDisabled &&
                this.pledgedAssetModel.lienPosition == 1; // lienPosition == 1 -> First position
        }

        public areReoValidationAndSixPiecesRequired = () => {
            return (this.areSixPiecesAcquiredForAllLoanApplications && this.isReoValidationRequired);
        }

        public harpMortgageInsuranceChanged = (value) => {
            this.pledgedAssetModel.getProperty().doYouPayMortgageInsurance = value
            this.disableMortgageInsurance = !this.pledgedAssetModel.getProperty().doYouPayMortgageInsurance;
            this.mortgageInsuranceExpense.preferredPayPeriod = '1';
        }

        get borrowerDebtCommentId(): number {
            return this.pledgedAssetModel.borrowerDebtCommentId;
        }
        set borrowerDebtCommentId(borrowerDebtCommentId: number) {
            this.pledgedAssetModel.borrowerDebtCommentId = borrowerDebtCommentId;
            this.reoCommentChanged();
        }

        private reoCommentChanged = () => {
            var unmodifiedBalance = this.pledgedAssetModel.unpaidBalance;
            var unmodifiedPayment = this.pledgedAssetModel.minPayment;

            this.validateReo();

            this.processRulesForREOComment(this.pledgedAssetModel);

            if (!unmodifiedBalance)
                this.pledgedAssetModel.unpaidBalance = 0;

            if (!unmodifiedPayment)
                this.pledgedAssetModel.minPayment = 0;

            if (!this.pledgedAssetModel.companyData) {
                this.pledgedAssetModel.companyData = new cls.CompanyDataViewModel();
            }

            this.updateOccupancyTypeAttributes();
        }

        public processRulesForREOComment = (pledgedAssetModel) => {

            var pledgedAssetComment = parseInt(pledgedAssetModel.borrowerDebtCommentId);

            pledgedAssetModel.liabilityDisabled = this.isReoDisabled(pledgedAssetComment);

            pledgedAssetModel.notMyLoan = pledgedAssetModel.borrowerDebtCommentId == this.enums.PledgedAssetComment.NotMyLoan;

            // cannot impound anything when a property is free and clear
            if (pledgedAssetModel.borrowerDebtCommentId == this.enums.PledgedAssetComment.PaidOffFreeAndClear) {

                lib.conditionalForEach(this.pledgedAssetModel.getProperty().propertyExpenses, pe => +pe.type != srv.propertyExpensesType.PMI, pe => pe.impounded = false);
                this.pledgedAssetModel.selectedImpound = srv.impoundType.noImpound;
                this.pledgedAssetModel.unpaidBalance = 0;
            } 
        }

        private _isDisabledComment: boolean = false;
        get disableComment(): boolean {
            return this.disableFields || this._isDisabledComment;
        }
        set disableComment(disableComment: boolean) {
            this._isDisabledComment = disableComment;
        }

        public isReoDisabled = (pledgedAssetComment) => {

            switch (pledgedAssetComment) {
                case this.enums.PledgedAssetComment.DoNotPayoff:
                case this.enums.PledgedAssetComment.PayoffAtClose:
                case this.enums.PledgedAssetComment.PayoffAtClosingAndCloseAccount:
                case this.enums.PledgedAssetComment.PayoffAtClosingAndDontCloseAccount:
                case this.enums.PledgedAssetComment.PendingSale:
                case this.enums.PledgedAssetComment.Sold:
                    return false;
                case this.enums.PledgedAssetComment.NotAMortgage:
                case this.enums.PledgedAssetComment.NotMyLoan:
                    return true;
            }

            return false;
        }

        get hasProperty(): boolean {
            return !!this.pledgedAssetModel && !!this.pledgedAssetModel.getProperty() && !!this.pledgedAssetModel.getProperty().propertyId
                && this.pledgedAssetModel.getProperty().propertyId != lib.getEmptyGuid();
        }

        set hasProperty(hasProperty: boolean) {
            /* Read-Only */
        }

        get propertyId() {

            return this.pledgedAssetModel.getProperty() ? this.pledgedAssetModel.getProperty().propertyId : lib.getEmptyGuid();
        }

        set propertyId(propertyId: string) {

            this.shouldResetLienPosition = propertyId != (this.pledgedAssetModel.hasProperty() && this.pledgedAssetModel.getProperty().propertyId);

            this.pledgedAssetModel.setProperty(lib.findFirst(this.reoPropertyList, (l: srv.IPropertyViewModel) => l.propertyId == propertyId));
            this.initializePropertyExpenses();
            this.setSelectedImpound();
            this.disableComment = false;
            this.updateOccupancyTypeAttributes();
            this.displayImpoundList();

            // Reset lien positions ; have to shake into submission
            //
            this.resetLienPositionsAsynch();
            //
            // this.resetLienPositionsSynch();
        }

        private resetLienPositionsAsynchIdx: number = -1;
        private resetLienPositionsAsynchCtx: ng.IPromise<any> = null;

        private resetLienPositionsAsynch = (): void => {
            this.resetLienPositionsAsynchIdx = 1;
            this.resetLienPositionsAsynchCtx = this.$interval(this.resetLienPositionsCb, 128);
        }

        private resetLienPositionsCb = (): void => {

            this.resetLienPositionsSynch();

            if (0 > --this.resetLienPositionsAsynchIdx) {
                this.$interval.cancel(this.resetLienPositionsAsynchCtx);
            }
        }

        private resetLienPositionsSynch = (): void => {
            try {
                var luDflt = RealEstateItemController.buildLienPositionLookupListDflt(this.lookup.lienPosition);
                var luTx = this.buildLienPositionLookupList();

                this._lienPositionLookups = luDflt;
                this._lienPositionLookups = luTx;
                if (this.shouldResetLienPosition) {
                this.lienPosition = null;
                }

                this.resetLienPositionsJQuery();
        }
            catch (e) {
                console.error(e.toString());
            }
        }

        private resetLienPositionsJQuery = (): void => {

            //
            // @see optionsDisabled directive in ./MML.Web.LoanCenter/angular/common/common.directives.js
            //
            // Due to deficiencies in [optionsDisabled] directive , we must use JQuery here
            //      and we must be reliant upon HTML <select/> name attritbute
            //      <select name="lienPosition" ... >...</select>

            var bry:boolean[] = lib.filterWithProjection(this._lienPositionLookups, o => true, o => o.disabled);
            var theSelectElement = $("select[name=lienPosition]");
            $("option[value!=''][value!='?']", theSelectElement).each(function (i, e) {
                $(this).attr("disabled",(bry[i] ? "" : null));
            });
        }

        get isInvestmentProperty(): boolean {
            return this.hasProperty && this.pledgedAssetModel.getProperty().OccupancyType == this.enums.OccupancyTypes.InvestmentProperty;
        }
        set isInvestmentProperty(readOnly: boolean) {
            /*Read-Only*/
        }

        public loanTypeChanged = (asset) => {
            // If loan type is not heloc, reset MaximumCreditLine
            if (asset.pledgedAssetLoanType != this.enums.PledgedAssetLoanType.Heloc)
                asset.maximumCreditLine = "";
        }

        private updateOccupancyTypeAttributes = () => {
            var listOccupancyType: srv.ILookupItem[] = [];
            var isDisabledOccupancyType: boolean = false;

            if (this.hasProperty) {
                listOccupancyType = this.copyListOccupancyType();

                var pvm = this.pledgedAssetModel.getProperty();
                var omtx = this.locateOccupancyMtx(pvm);
            
                if (!!omtx) {
                    // option disabled?
                    for (var i = 0; i < listOccupancyType.length; i++) {
                        var enabled: boolean = !!lib.findFirst(omtx.occupancyTypeList, o => o.text == listOccupancyType[i].text);
                        listOccupancyType[i].disabled = !enabled;
                    }

                    // select disabled?
                    isDisabledOccupancyType = omtx.isDisabled;

                    // valid comments?
                    this._isValidComments = omtx.isValidComments;

                    //handle specific cases for purchase loans
                    if (this.wrappedLoan.ref.loanPurposeType == srv.LoanPurposeTypeEnum.Purchase) {
                 
                        // Is currently selected occupancy type on property valid? If not, set to None
                        if (pvm.OccupancyType != srv.PropertyUsageTypeEnum.None && !isDisabledOccupancyType) {
                            var currentOccupancyLookupItem = lib.findSingle(listOccupancyType, o => o.value == String(pvm.OccupancyType));
                            if (!!currentOccupancyLookupItem && currentOccupancyLookupItem.disabled && String(pvm.OccupancyType) == currentOccupancyLookupItem.value) {
                                pvm.OccupancyType = srv.PropertyUsageTypeEnum.None;
                            }
                        }

                        //for purchase loan, if occupancy type is disabled, it is set to primary
                        if (isDisabledOccupancyType && this._isValidComments) {                        
                            pvm.OccupancyType = srv.PropertyUsageTypeEnum.PrimaryResidence;                            
                        }
                    }
                }
        }

            this._listOccupancyType = listOccupancyType;
            this._isDisabledOccupancyType = isDisabledOccupancyType;
        }

        private copyListOccupancyType = (): srv.ILookupItem[]=> {
            var listOccupancyType: srv.ILookupItem[] = [];
            for (var i = 0; i < this.lookup.occupancyTypeList.length; i++) {
                var li = cls.LookupItem.fromLookupItem(this.lookup.occupancyTypeList[i]);
                li.selected = false;
                li.disabled = false;
                listOccupancyType.push(li);
            }
            return listOccupancyType;
        }

        private _listOccupancyType: srv.ILookupItem[] = [];
        get listOccupancyType(): srv.ILookupItem[] {
            return this._listOccupancyType;
        }
        set listOccupancyType(readOnly: srv.ILookupItem[]) {
            /*Read-Only*/
        }

        private _isDisabledOccupancyType: boolean = false;
        get isDisabledOccupancyType(): boolean {
            return this._isDisabledOccupancyType;
        }
        set isDisabledOccupancyType(readOnly: boolean) {
            /*Read-Only*/
        }

        private _isValidComments: boolean = true;
        get isValidComments(): boolean {
            return this._isValidComments;
        }
        set isValidComments(readOnly: boolean) {
            /*Read-Only*/
        }

        private locateOccupancyMtx = (pvm: srv.IPropertyViewModel): OccupancyMtx => {
            var omtxInp = this.buildOccupancyMtx(pvm);
            var omtxOut = omtxInp.locate(this.lookup);

            return omtxOut;
        }

        private buildOccupancyMtx = (pvm: srv.IPropertyViewModel): OccupancyMtx => {

            var loanPurpCd = <srv.LoanPurposeTypeEnum>this.loanType;
            var subjOccupancy = this.subjPropOccupancy;
            var residenceSubjCd = this.isCurentResidenceSameAsSubject;
            var residenceOwnership = this.currentResidenceOwnership;
            var reoCtgCd = this.calculateReoCategorization(pvm);
            var comments = this.lookup.pledgetAssetCommentsFlgFromValues([this.pledgedAssetModel.borrowerDebtCommentId.toString()]);

            var omtx = new OccupancyMtx(loanPurpCd, subjOccupancy, residenceSubjCd, residenceOwnership, reoCtgCd, comments);

            return omtx;
        }


        get subjPropOccupancy(): srv.PropertyUsageTypeEnum {
            return this.wrappedLoan.ref.getSubjectProperty().OccupancyType;
        }
        set subjPropOccupancy(occupancy: srv.PropertyUsageTypeEnum) {
            /*Read-Only*/
        }

        get isCurentResidenceSameAsSubject(): SubjPropRelationEnum {
            if (this.wrappedLoan.ref.active.getBorrower().getCurrentAddress().isSameAsPropertyAddress)
                return SubjPropRelationEnum.IsSame;
            else
                return SubjPropRelationEnum.IsDiff;
        }
        set isCurentResidenceSameAsSubject(isSame: SubjPropRelationEnum) {
            /*Read-Only*/
                    }

        get currentResidenceOwnership(): srv.OwnershipStatusTypeEnum {
            return this.wrappedLoan.ref.active.getBorrower().getCurrentAddress().ownership;
                    }
        set currentResidenceOwnership(ownership: srv.OwnershipStatusTypeEnum) {
            /*Read-Only*/
        }

        private calculateReoCategorization = (pvm: srv.IPropertyViewModel): lib.IFlaggedEnum => {

            var reoctgcd: lib.IFlaggedEnum = new ReoCategorizationFlg(0);
            
            // Subject Property is Subject Property
            var isSubjectProperty: boolean = this.isSubjectProperty(pvm);
            // Add the flag
            if (isSubjectProperty)
                reoctgcd = reoctgcd.add(ReoCategorizationEnum.SubjectProperty);
            else
                reoctgcd = reoctgcd.add(ReoCategorizationEnum.NonSubjectProperty);

            // Current Residence could be Current Residence or Subject Property
            var isCurrentResidence: boolean;
            if (pvm.propertyId == this.wrappedLoan.ref.active.getBorrower().getCurrentAddress().propertyId) {
                isCurrentResidence = true;
                }
            else if (isSubjectProperty && this.wrappedLoan.ref.active.getBorrower().getCurrentAddress().isSameAsPropertyAddress) {
                isCurrentResidence = true;
                    }
            else
                isCurrentResidence = false;
            // Add the flag
            if (isCurrentResidence)
                reoctgcd = reoctgcd.add(ReoCategorizationEnum.CurrentResidence);
            else
                reoctgcd = reoctgcd.add(ReoCategorizationEnum.NonCurrentResidence);

            // Niether means ad-hoc
            if (!isSubjectProperty && !isCurrentResidence)
                reoctgcd = reoctgcd.add(ReoCategorizationEnum.AdHoc);
            else
                reoctgcd = reoctgcd.add(ReoCategorizationEnum.NonAdHoc);

            // done.
            return reoctgcd;
                    }

        private isSubjectProperty = (propertyVm: srv.IPropertyViewModel): boolean => {
            return !!propertyVm && propertyVm.isSubjectProperty;
                }

        private isCurrentResidence = (propertyVm: srv.IPropertyViewModel): boolean => {
            if (!propertyVm || !propertyVm.propertyId)
                return false;
            if (!this.wrappedLoan || !this.wrappedLoan.ref || !this.wrappedLoan.ref.active || !this.wrappedLoan.ref.active.getBorrower() || !this.wrappedLoan.ref.active.getBorrower().getCurrentAddress() || !this.wrappedLoan.ref.active.getBorrower().getCurrentAddress() || !this.wrappedLoan.ref.active.getBorrower().getCurrentAddress().propertyId)
                return false;

            // Is same Id as borrower current residence address ?
            return propertyVm.propertyId == this.wrappedLoan.ref.active.getBorrower().getCurrentAddress().propertyId;
        }

        public selectedImpound = (impound: srv.impoundType): srv.impoundType|void => {
            if (!angular.isDefined(impound))
                return this.pledgedAssetModel.selectedImpound;
            else {
                this.pledgedAssetModel.selectedImpound = impound;
                this.setPropertyExpenseImpounds();
            }
        }

        public displayImpoundList = () => {
            // hide Impound dll if lien position is not first
            return this.pledgedAssetModel.lienPosition == 1;
        }

        public cancel = () => {
            this.$modalInstance.dismiss('cancel');
            this.updateDTI(false);
        }

        // @todo-cl: Is this really necessary?
        _updateDTI = false;

        public updateDTI = (shouldUpdate) => {
            this._updateDTI = shouldUpdate;
        }

        public done = (form) => {

            // @todo-cl: Remove if not required
            // var ti = <cls.TransactionInfo>this.wrappedLoan.ref.getTransactionInfo();

            // @todo-cl: Review , what's the deal with DebtsAccountOwnershipType
            // var ownershipType: number = parseInt(this.pledgedAssetModel.DebtsAccountOwnershipType);
            var ownershipType: number = parseInt(this.pledgedAssetModel.debtsAccountOwnershipType);

            var isCoBorrowerOwner = this.activeLoanApplication.isSpouseOnTheLoan && (ownershipType == srv.DebtsAccountOwnershipType.CoBorrower || ownershipType == srv.DebtsAccountOwnershipType.CoBorrowerWithOther);

            this.pledgedAssetModel.borrowerId = isCoBorrowerOwner ? this.activeLoanApplication.getCoBorrower().borrowerId : this.activeLoanApplication.getBorrower().borrowerId;
            this.pledgedAssetModel.isJoint = ownershipType == srv.DebtsAccountOwnershipType.Joint;
            this.pledgedAssetModel.isJointWithSingleBorrowerID = ownershipType == srv.DebtsAccountOwnershipType.CoBorrowerWithOther || ownershipType == srv.DebtsAccountOwnershipType.BorrowerWithOther;
            // @todo-cl::PROPERTY-ADDRESS
            // this.pledgedAssetModel.propertyAddressDisplayValue = this.pledgedAssetModel.getProperty().fullAddressString

            //
            // var reo = realestate.util.createREO(this.pledgedAssetModel, this.wrappedLoan);

            //
            //var reo = new cls.LiabilityViewModel(() => this.wrappedLoan.ref, this.pledgedAssetModel);
            //if (!!reo.getProperty() && !reo.getProperty().loanApplicationId) {
            //    // apply loanApplicationId if not exists
            //    // @todo-cc: review
            //    reo.getProperty().loanApplicationId = this.wrappedLoan.ref.active.loanApplicationId;
            //}         

            //
            var propertyPndg = this.pledgedAssetModel.getProperty();
            var propertyFinl: srv.IPropertyViewModel;
            if (!!propertyPndg) {
                // property
                propertyFinl = new cls.PropertyViewModel(this.wrappedLoan.ref.getTransactionInfoRef(), propertyPndg, this.wrappedLoan.ref.homeBuyingType);
                propertyFinl.borrowerId = this.pledgedAssetModel.borrowerId;

                if (!propertyFinl.loanId) {
                    // apply loanApplicationId if not exists
                    // @todo-cc: review
                    propertyFinl.loanId = this.wrappedLoan.ref.loanId;
                }
                if (!propertyFinl.loanApplicationId) {
                    // apply loanApplicationId if not exists
                    // @todo-cc: review
                    propertyFinl.loanApplicationId = this.wrappedLoan.ref.active.loanApplicationId;
                }

                // net rental income
                // @todo-cl: resolve nonsensical indirection and nonsense here mostly resulting from Property Snapshot inheritence
                propertyFinl.OccupancyType = propertyPndg.OccupancyType;
                if (propertyFinl.OccupancyType == srv.PropertyUsageTypeEnum.InvestmentProperty) {
                    propertyFinl.grossRentalIncome = propertyPndg.grossRentalIncome;
                    propertyFinl.OwnershipPercentage = propertyPndg.OwnershipPercentage;
                    propertyFinl.vacancyPercentage = propertyPndg.vacancyPercentage;
                }
                this.updateExpense(this.propertyTaxExpense, this._propertyTax);
                this.updateExpense(this.hoaDuesExpense, this._hoaDues);
                this.updateExpense(this.mortgageInsuranceExpense, this._mortgageInsurance);
                this.updateExpense(this.homeOwnerExpense, this._homeOwner);
                this.updateExpense(this.floodInsuranceExpense, this._floodInsurance);
            }
            else {
                propertyFinl = null;
            }

            var reo = new cls.LiabilityViewModel(this.wrappedLoan.ref.getTransactionInfoRef(), this.pledgedAssetModel, this.pledgedAssetModel.borrowerFullName);
            reo.isPledged = true;
            reo.setProperty(propertyFinl);

            //
            this.CreditStateService.updateREO(reo);
            this.CreditStateService.updateCredit(this.wrappedLoan);

            this.$modalInstance.close();

            this.loanEvent.broadcastPropertyChangedEvent(events.LoanFieldIdentifier.todo/*all*/);
        }
        public getPledgedAssets = () => {
            return this.wrappedLoan.ref.active.reos;
        }

        public addressNotSelected = () => {
            return !this.pledgedAssetModel.getProperty() || !this.pledgedAssetModel.getProperty().propertyId;
        }

        // Checks the validity of the REO form
        public isValid = (form) => {
            this.validateInputFields(form);

            if (form.propertyTax.$invalid || form.currentEstimatedValue.$invalid || form.subjectPropertyTypes.$invalid || form.occupancyTypeList.$invalid || form.mortgageInsurance.$invalid)
                return false;

            // Validate Investment Property rules
            if (this.isInvestmentProperty && (form.ownershipPercentage.$invalid || form.vacancyPercentage.$invalid))
                return false;

            // Validate property address fields
            if (form.realEstateItemStreetName.$invalid || form.realEstateItemCityName.$invalid || form.realEstateItemStateName.$invalid || form.realEstateItemZipCode.$invalid)
                return false;

            return true;
        }

        // Validates currency and percentage input fields for zero/empty values
        public validateInputFields = (form) => {
            // Validate current estimated value for property
            if (this.pledgedAssetModel.getProperty().currentEstimatedValue == undefined || this.pledgedAssetModel.getProperty().currentEstimatedValue == 0)
                this.CreditHelpers.setInvalidValidationFlag(form.currentEstimatedValue);
            else
                this.CreditHelpers.resetInvalidValidationFlag(form.currentEstimatedValue);

            // Validate property tax
            if (this.pledgedAssetModel.getProperty().propertyTaxExpense.monthlyAmount == 0)
                this.CreditHelpers.setInvalidValidationFlag(form.propertyTax);
            else
                this.CreditHelpers.resetInvalidValidationFlag(form.propertyTax);

            // Validate high limit (MaximumCreditLine) for HELOC loan type
            if (form.highLimit != undefined && this.pledgedAssetModel.pledgedAssetLoanType == this.enums.PledgedAssetLoanType.Heloc) {
                var highLimitValue = this.pledgedAssetModel.maximumCreditLine;
                if (!highLimitValue)
                    this.CreditHelpers.setInvalidValidationFlag(form.highLimit);
                else
                    this.CreditHelpers.resetTouchedValidationFlag(form.highLimit);
            }

            // Validate MortgageInsurance for HARP
            if (this.isLoanHarp && this.pledgedAssetModel.getProperty().doYouPayMortgageInsurance) {
                if (!this.pledgedAssetModel.getProperty().mortgageInsuranceExpense.monthlyAmount)
                    this.CreditHelpers.setInvalidValidationFlag(form.mortgageInsurance);
                else
                    this.CreditHelpers.resetTouchedValidationFlag(form.mortgageInsurance);
            }

            // Validate Investment Property rules
            if (this.isInvestmentProperty) {
                if (!this.isValidPercentage(this.pledgedAssetModel.getProperty().OwnershipPercentage))
                    this.CreditHelpers.setInvalidValidationFlag(form.ownershipPercentage);
                else
                    this.CreditHelpers.resetTouchedValidationFlag(form.ownershipPercentage);

                if (!this.isValidPercentage(this.pledgedAssetModel.getProperty().vacancyPercentage))
                    this.CreditHelpers.setInvalidValidationFlag(form.vacancyPercentage);
                else
                    this.CreditHelpers.resetTouchedValidationFlag(form.vacancyPercentage);
            }

            // Validate comment rules
            if (this.submitted && this.pledgedAssetModel.isLenderSectionVisible) {
                this.CreditHelpers.setTouchedValidationFlag(form.debtsAccountOwnershipType);
                this.CreditHelpers.setTouchedValidationFlag(form.companyName);
                this.CreditHelpers.setTouchedValidationFlag(form.lienPosition);
                this.CreditHelpers.setTouchedValidationFlag(form.unpaidBalance);
                this.CreditHelpers.setTouchedValidationFlag(form.minPayment);
            }

            // Validate property address fields 
            if (this.submitted) {
                this.CreditHelpers.setTouchedValidationFlag(form.realEstateItemStreetName);
                this.CreditHelpers.setTouchedValidationFlag(form.realEstateItemCityName);
                this.CreditHelpers.setTouchedValidationFlag(form.realEstateItemStateName);
                this.CreditHelpers.setTouchedValidationFlag(form.realEstateItemZipCode);
            }
        }

        public isValidPercentage = (value) => {
            return value != null && value != undefined && value != "" && !isNaN(value);
        }

        public getMortgageInsurancePreferredPayPeriodStyle = (form) => {
            return (this.pledgedAssetModel.liabilityDisabled || this.disableMortgageInsurance || this.addressNotSelected()) ? 'disabled' :
                ((this.isLoanHarp && this.pledgedAssetModel.getProperty().doYouPayMortgageInsurance) && (this.submitted || form.mortgageInsurance.$touched)
                    && (form.mortgageInsurance.$invalid || this._mortgageInsurance == 0)) ? 'ng-invalid ng-dirty' : '';
        }
        
        //TODO: Refactor rest of the items to use this method
        public isPropertyInvestment = () => {
            this.isInvestmentProperty = this.pledgedAssetModel.getProperty() && this.pledgedAssetModel.getProperty().OccupancyType == this.enums.OccupancyTypes.InvestmentProperty;
            return this.isInvestmentProperty; 
        }

        public showPriorAdverseRatingHistory = ($event, priorAdverseRatings) => {
            var ctrl = {
                lookups: this.lookup
            };

            this.modalPopoverFactory.openModalPopover('angular/loanapplication/credit/realestate/priorAdverseRating.html', ctrl, priorAdverseRatings, event);
        }

        public isValidInvalidComment = () => {
            return this.borrowerDebtCommentId != this.enums.PledgedAssetComment.NotMyLoan
                || this.borrowerDebtCommentId != this.enums.PledgedAssetComment.Duplicate;
        }

        public isAddressInvalid = () => {
            return !this.pledgedAssetModel.getProperty() &&
                this.borrowerDebtCommentId != this.enums.PledgedAssetComment.NotMyLoan &&
                this.borrowerDebtCommentId != this.enums.PledgedAssetComment.NotAMortgage &&
                !!this.wrappedLoan.ref.areSixPiecesAcquiredForAllLoanApplications == true;
        }

        public isOccupancyValid = () => {
            return this.isReoValidationRequired && !this.pledgedAssetModel.getProperty().OccupancyType && !!this.pledgedAssetModel.getProperty().propertyId;
        }

        public pledgetAssetCommentsFiltered = () => {
            if (this.wrappedLoan.ref.loanPurposeType == srv.LoanPurposeTypeEnum.Purchase) {
                return lib.filter(this.lookup.pledgetAssetComments, p => +p.value != srv.pledgedAssetCommentType.Duplicate);
            }
            return this.lookup.pledgetAssetComments;
        }
    }

    angular.module('loanApplication').controller('realEstateItemController', RealEstateItemController);
}

