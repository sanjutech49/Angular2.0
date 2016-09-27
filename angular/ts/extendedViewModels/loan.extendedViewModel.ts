/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/moment/moment.d.ts" />
/// <reference path="../../../scripts/typings/underscore/underscore.d.ts" />
/// <reference path="../../ts/generated/viewModels.ts" />
/// <reference path="../../ts/generated/viewModelClasses.ts" />
/// <reference path="../../ts/extendedViewModels/extendedViewModels.ts" />
/// <reference path="../../ts/extendedViewModels/enums.extendedViewModel.ts" />
/// <reference path="../../ts/extendedViewModels/loanApplication.extendedViewModel.ts" />
/// <reference path="../../ts/extendedViewModels/housingExpenses.extendedViewModel.ts" />
/// <reference path="../../ts/extendedViewModels/transactionInfo.ts" />
/// <reference path="../../common/common.objects.ts" />
/// <reference path="../../common/common.string.ts" />
/// <reference path="../../common/common.collections.ts" />
/// <reference path="../../ts/lib/underscore.extended.ts" />

module srv {

    export interface ILoanViewModel {
        active?: ILoanApplicationViewModel;
        doesYourAgentAlsoRepresentsSeller?: boolean;
        getLoanPurposeTypeText? (): string;
        isPropertyPieceAcquired? (): boolean;
        areSixPiecesAcquiredForAllLoanApplications? (): boolean;
        areSixPiecesAcquiredForCurrentLoanApplication? (): boolean;
        allPiecesAcquiredForCurrentLoanApplication? (): boolean;
        downPayment?: number;
        fullyIndexedRate?: number;
        stateLtvLimit?: number;
        primary?: srv.ILoanApplicationViewModel;
        otherIncomes?: srv.ICollection<srv.IIncomeInfoViewModel>;
        prepareForSubmit? (): void;
        getFirstMortgageHolder? (): string;
        getHomeBuyingTypeText? (): string;
        ownershipLastThreeYears? (): number;
        isIntentToProceedDateSet? (): boolean;
        calculateSubordinate? (): any;
        checkDisclosureStatusRules? (): void;
        updateDisclosureStatus? (loanApp: srv.ILoanApplicationViewModel, sixPiecesAcquired: boolean): void;
        updateDisclosureStatusForAllLoanApplications? (disclosureStatus): void;
        updateComplianceCheckStatusForAllLoanApplications? (complianceCheckStatus): void;
        updateComplianceCheckStatusForLoanApplication? (complianceCheckStatus, loanApplicationId): void;
        getLicencedStates? (appData): srv.ILookupItem[];
        getSubjectProperty? (): srv.IPropertyViewModel;
        setSubjectProperty? (subjProp: srv.IPropertyViewModel): void;
        getProperty? (propertyId: string): IPropertyViewModel;
        getPropertyByAddressId? (propertyId: string): IPropertyViewModel;
        getOtherIncomeSumForBorrowerWithMiscExpenses? (borrower: srv.IBorrowerViewModel): number;
        getCombinedOtherIncomeTotal? (): number;
        getCombinedNonSubjectPropertyIncomeTotal? (): number;
        getNonSubjectPropertiesNetRentalIncome? (borrower: srv.IBorrowerViewModel): number;
        getSubjectPropertiesNetRentalIncome? (borrower: srv.IBorrowerViewModel): number;
        getCashFlowForNetRentalIncomes? (borrower: srv.IBorrowerViewModel, isNegative: boolean): number;
        incomeTotalForBorrower? (borrower: srv.IBorrowerViewModel): number;
        incomeTotalForBorrowerWithMiscExpenses? (borrower: srv.IBorrowerViewModel): number;
        getOtherIncomeTotal? (borrower: srv.IBorrowerViewModel): number;
        addOrUpdateProperty? (property: srv.IPropertyViewModel): void;
        getTotalMonthlyPropertyObligations? (): number;
        getPropertiesByAddressId? (propertyId: string): srv.ICollection<srv.IPropertyViewModel>;
        removePropertiesByAddressId? (property: srv.IPropertyViewModel, propertyId: string): void;
        //createNewCurrentAddressProperty? (currentAddress: srv.IBorrowerAddressViewModel, loanApplicationId: string): srv.IPropertyViewModel;

        shouldLoanNumberBeVisible? (): boolean;
        //
        //transactionInfo?: srv.ITransactionInfo;
        getTransactionInfo?: srv.ITransactionInfoCallback;

        getLoanApplications? (): srv.ICollection<srv.ILoanApplicationViewModel>;
        setLoanApplications? (loanApplicationList: srv.ICollection<srv.ILoanApplicationViewModel>): void;

        getOtherIncomes? (): srv.IIncomeInfoViewModel[];
        setOtherIncomes? (otherIncomes: srv.IIncomeInfoViewModel[]): void;

        checkAgentsDifferences? (): boolean;
        sixPiecesAcquiredForAllLoanApplications?: boolean;
        downPaymentAmount? (amount: number): number|void;
        isSpouseOnTheLoan?: boolean;
        allLoanAppsCompleted? (): boolean;
        isSubordinateFinancing? (): boolean;
        getLowestMiddleFicoScore? (): string;     
        cashFlowBorrower? (): number;
        cashFlowCoBorrower? (): number;
        totalIncomeForBorrower? (): number;
        totalIncomeForCoBorrower? (): number;
        remainingOwnershipCalculation? (excludeActiveLoanApplication?: boolean): number;
        isDataValidForAggregateAdjustmentCalculation? (): boolean;
        resetMonthsToBePaid? (): void;
        isNewProspectSaved?: boolean;
        FirstLienReoItem?: srv.ILiabilityViewModel;
        JuniorLienReoItem?: srv.ILiabilityViewModel;
        recoupmentPeriodCalculated?: srv.IRecoupmentPeriodResponse;
        getCombinedPledgedAssetsForAll1003s? (): srv.IList<srv.ILiabilityViewModel>;
        getActiveDisclosureDetailsViewModel? (): srv.cls.DisclosuresDetailsViewModel;
        getCombinedPledgedAssetsForAll1003s? (): srv.IList<srv.ILiabilityViewModel>;
        updateGovermentEligibility? (calculatorType: srv.MortgageTypeEnum, isEligible: boolean): void;

        vaTabEnabled? (): boolean;

        fhaCountyLoanLimit?: number;
        vaCountyLoanLimit?: number;
    }

    export interface ITransactionInfoGlobal {
        prepareSave(): void;
    }

    export interface ITransactionInfoCallback {
        (): srv.ITransactionInfoGlobal;
    }
}

module cls {

    export class LoanViewModel extends srv.cls.LoanViewModel {

        isSpouseOnTheLoan: boolean;
        fullyIndexedRate: number;
        stateLtvLimit: number;
        fhaCountyLoanLimit: number;
        vaCountyLoanLimit: number;

        getTransactionInfo: srv.ITransactionInfoCallback;
        recoupmentPeriodCalculated: srv.IRecoupmentPeriodResponse = new srv.cls.RecoupmentPeriodResponse();

        prepareSave = (): void => {
            var foo = this.getTransactionInfo;
            foo().prepareSave();
        }

        getPropertyMap = (): Map<srv.IPropertyViewModel> => {
            // @todo-cc: Use Lib
            var ti = <cls.TransactionInfo>this.getTransactionInfo();
            if (ti && ti.property) {
                return ti.property;
            }
            throw new Error("LoanExtendedViewModel: getPropertyMap is not available");
        }

        private hasTransactionInfo = (): boolean => {
            return (!!this.getTransactionInfo && !!this.getTransactionInfo());
        }

        public getTransactionInfoRef = (): cls.TransactionInfo => {
            if (this.hasTransactionInfo()) {
                return <cls.TransactionInfo>this.getTransactionInfo();
            }
            else {
                return null;
            }
        }

        private hasTransactionInfoLoanApplication = (): boolean => {
            return (this.hasTransactionInfo() && !!this.getTransactionInfoRef().loanApplication);
        }

        private getTransactionInfoLoanApplication = (): Map<srv.ILoanApplicationViewModel> => {
            if (this.hasTransactionInfoLoanApplication()) {
                return this.getTransactionInfoRef().loanApplication;
            }
            return new Map<srv.ILoanApplicationViewModel>();
        }

        get NegativeAmortization(): string {
            return common.objects.boolToString(this.negativeAmortization);
        }
        set NegativeAmortization(value: string) {
            this.negativeAmortization = common.string.toBool(value);
        }

        get PrePaymentPenalty(): string {
            return common.objects.boolToString(this.prePaymentPenalty);
        }
        set PrePaymentPenalty(value: string) {
            this.prePaymentPenalty = common.string.toBool(value);
        }    

        getLoanApplications = (excludeActive: boolean = false): srv.ICollection<srv.ILoanApplicationViewModel> => {
            var loanApplications: srv.ICollection<srv.ILoanApplicationViewModel> = [];

            if (this.hasTransactionInfoLoanApplication()) {
                loanApplications = this.getTransactionInfoLoanApplication().getValues();
            }

            if (excludeActive) {
                if (!!loanApplications && loanApplications.length > 0) {
                    loanApplications = lib.filter(loanApplications, la => la.loanApplicationId != this.active.loanApplicationId);
                }
            }

            return loanApplications;
        }

        vaTabEnabled = (): boolean => {
            return this.financialInfo && this.financialInfo.mortgageType == srv.MortageType.VA;
        }

        setLoanApplications = (loanApplicationList: srv.ICollection<srv.ILoanApplicationViewModel>): void => {
            if (!loanApplicationList || !this.hasTransactionInfoLoanApplication())
                return;
            this.getTransactionInfoLoanApplication().mapAll(loanApplicationList);
        }

        public selectedAppIndex: number;
        public sixPiecesAcquiredForAllLoanApplications: boolean;

        constructor(private loan?: srv.ILoanViewModel, private $filter?: ng.IFilterService, public isWholeSale: boolean = false) {
            super();

            if (loan) {
                lib.copyState(loan, this);

                var loanCls = <cls.LoanViewModel>loan;
                if (!this.$filter && !!loanCls.$filter) {
                    this.$filter = loanCls.$filter;
                }
            }

            this.isWholeSale = isWholeSale;
            this.initialize(loan);
        }

        private static _lookupInfo: srv.ILookupViewModel;
        public static getLookups(): srv.ILookupViewModel {
            return LoanViewModel._lookupInfo;
        }

        private getActiveApplication = (): cls.LoanApplicationViewModel => {
            return <cls.LoanApplicationViewModel>this.active;
        }

        transactionInfo: srv.ITransactionInfo;
        doesYourAgentAlsoRepresentsSeller: boolean = false;
        maxNumberOfLoanApplications: number;
        primary: srv.ILoanApplicationViewModel;
        isContextualBarCollapsed: boolean;

        /**
        * @desc Gets remaining ownership percentage available for investment properties.
        */
        remainingOwnershipCalculation = (excludeActiveLoanApplication: boolean = true): number => {         
            var loanApplications = this.getLoanApplications(excludeActiveLoanApplication);

            var investmentPropertyLoanApplications = lib.filter(loanApplications, la => la.OccupancyType == srv.PropertyUsageTypeEnum.InvestmentProperty);

            var totalOwnership: number = 0;
            lib.forEach(investmentPropertyLoanApplications, la => totalOwnership += la.OwnershipPercentage);
            
            var remainingOwnership: number = 0;
            remainingOwnership = 100 - totalOwnership;
            if (remainingOwnership < 0) {
                return 0;
            }
            else {
                return remainingOwnership;
            }               
        }
        
        ownershipLastThreeYears = (): number => {

            //purchase
            if (this.active && this.active.occupancyType == srv.PropertyUsageTypeEnum.PrimaryResidence && this.loanPurposeType == srv.LoanPurposeTypeEnum.Purchase) {
                return 1; //No is selected
            }

            //refinance
            if (this.active && this.active.occupancyType == srv.PropertyUsageTypeEnum.PrimaryResidence && this.loanPurposeType == srv.LoanPurposeTypeEnum.Refinance) {
                return 0; //Yes is selected
            }

            return null;
        }

        getCombinedPledgedAssetsForAll1003s = (): srv.IList<srv.ILiabilityViewModel> => {

            var loanApplications = this.getLoanApplications(false);

            var combinedPledgedAssetsForAll1003s: srv.IList<srv.ILiabilityViewModel> = [];

            angular.forEach(loanApplications, function (loanApp) {
                if (loanApp) {
                    combinedPledgedAssetsForAll1003s = combinedPledgedAssetsForAll1003s.concat(loanApp.getCombinedPledgedAssets());
                }
                
            });

            return combinedPledgedAssetsForAll1003s;
        }


        isSubordinateFinancing(): boolean {
            var items = lib.filter(this.primary.getCombinedPledgedAssets(), (item: srv.ILiabilityViewModel) => {
                return this.loanPurposeType == srv.LoanPurposeTypeEnum.Refinance && (item.lienPosition > 1 && item.getProperty().isSubjectProperty &&
                    (item.borrowerDebtCommentId == srv.PledgedAssetCommentTypeEnum.PayoffAtClose ||
                        item.borrowerDebtCommentId == srv.PledgedAssetCommentTypeEnum.PayoffAtClosingAndCloseAccount ||
                        item.borrowerDebtCommentId == srv.PledgedAssetCommentTypeEnum.PayoffAtClosingAndDontCloseAccount));
            });
            return items.length > 0 || this.otherInterviewData.secondMortgageRefinanceComment != String(srv.RefinanceCommentTypeEnum.DoNotPayoff);
        }

        areSixPiecesAcquiredForCurrentLoanApplication = (): boolean => {
            return this.allPiecesAcquiredForCurrentLoanApplication() && this.homeBuyingType != srv.HomeBuyingType.GetPreApproved;
        }

        allPiecesAcquiredForCurrentLoanApplication = (): boolean => {
            return this.active.areSixPiecesOfLoanApplicationCompleted() && this.isPropertyPieceAcquired();
        }

        /**
        * @desc Validates if 6 pieces are acquired for all loan applications 
        */

        isLoanApplicationCompleted = (loanApplication: srv.ILoanApplicationViewModel): boolean => {

            return loanApplication.isLoanApplicationCompleted(this.getSubjectProperty(), this.loanPurposeType, this.loanAmount, !this.active.getCoBorrower().getCurrentAddress().isSameAsPrimaryBorrowerCurrentAddress, this.financialInfo.downPaymentTypeCode, this.areSixPiecesAcquiredForCurrentLoanApplication());

        }

        disableRunCreditButton = (): boolean => {
            if (!angular.isDefined(this.subjectProperty)) 
            {
                return true;
            }

            if (this.subjectProperty.stateId != srv.US_StateEnum.Washington)
            {
                return false;
            }

            if (this.allPiecesAcquiredForCurrentLoanApplication() && this.subjectProperty.stateId == srv.US_StateEnum.Washington)
            {
                return false;
            } 

            return true;
        }

        allLoanAppsCompleted = (): boolean => {

            var allLoanAppsCompleted = true;
            for (var i = 0; i < this.getLoanApplications().length; i++) {
                var loanApplication: srv.ILoanApplicationViewModel = this.getLoanApplications()[i];

                var loanAppCompleted = this.isLoanApplicationCompleted(loanApplication);
                allLoanAppsCompleted = allLoanAppsCompleted && loanAppCompleted;
            }
            return allLoanAppsCompleted;
        }

        areSixPiecesAcquiredForAllLoanApplications = (): boolean => {

            this.sixPiecesAcquiredForAllLoanApplications = true;
            var milestoneStatus = new cls.MilestoneStatus();


            // There are no loan applications or street address is 'TBD', six pieces are not acquired.
            if (!this.getLoanApplications() || this.getLoanApplications().length == 0 || this.homeBuyingType == srv.HomeBuyingType.GetPreApproved) {
                this.sixPiecesAcquiredForAllLoanApplications = false;
            }
            else {

            // This piece is the same for all loan applications. Retrieve it only once.
            var isPropertyPieceAcquired = this.isPropertyPieceAcquired();
            //refactor to use allLoanAppsCompleted() function
            var allLoanAppsCompleted = true;

            for (var i = 0; i < this.getLoanApplications().length; i++) {
                var loanApplication: srv.ILoanApplicationViewModel = this.getLoanApplications()[i];

                var loanAppCompleted = this.isLoanApplicationCompleted(loanApplication);
                allLoanAppsCompleted = allLoanAppsCompleted && loanAppCompleted;

                if (!(isPropertyPieceAcquired && loanApplication.isPersonalPieceAcquired() && loanApplication.isIncomePieceAcquired())) {
                    // If any of the 6 pieces is not acquired, break.
                        this.sixPiecesAcquiredForAllLoanApplications = false;
                    }
                }
            }
            // 6 pieces for all loan applications are acquired.
            this.checkDisclosureStatusRules();

            if (!this.isMilestoneStatusManual && this.currentMilestone != srv.milestoneStatus.processing && this.currentMilestone != srv.milestoneStatus.cancelled && this.currentMilestone != srv.milestoneStatus.adverse)
                this.currentMilestone = milestoneStatus.setStatus(this.isWholeSale, allLoanAppsCompleted, this.sixPiecesAcquiredForAllLoanApplications, this.homeBuyingType);

            return this.sixPiecesAcquiredForAllLoanApplications;
        }

        areLoanAntiSteeringOptionsCompleted = (model): boolean => {
            return model.firstInterestRate && (model.firstTotalPoints || model.firstTotalPoints == 0) && model.secondInterestRate &&
                (model.secondTotalPoints || model.secondTotalPoints == 0) && model.thirdInterestRate && (model.thirdTotalPoints || model.thirdTotalPoints == 0);
        }

        checkDisclosureStatusRules = (): void => {
            var loanNumberNotSet = !this.loanNumber || this.loanNumber == "Pending";
            if (loanNumberNotSet && (!this.applicationDate || moment('0001-01-01').diff(moment(this.applicationDate)) == 0)) {
                var sixPiecesAcquired = this.sixPiecesAcquiredForAllLoanApplications;
                var action = (loanApp: srv.ILoanApplicationViewModel) => this.updateDisclosureStatus(loanApp, sixPiecesAcquired);
                lib.forEach(this.getLoanApplications(), action);
            }
        }

        updateDisclosureStatusForAllLoanApplications = (disclosureStatus): void => {
            var loanApps = this.getLoanApplications();
            for (var i = 0; i < loanApps.length; i++) {
                loanApps[i].disclosureStatusDetails.disclosureStatus = disclosureStatus;
            }
        }

        updateComplianceCheckStatusForAllLoanApplications = (complianceCheckStatus): void => {
            var loanApps = this.getLoanApplications();
            for (var i = 0; i < loanApps.length; i++) {
                loanApps[i].complianceCheckStatus = complianceCheckStatus;
            }
        }

        updateComplianceCheckStatusForLoanApplication = (complianceCheckStatus, loanApplicationId): void => {
            var loanApps = this.getLoanApplications();
            for (var i = 0; i < loanApps.length; i++) {
                if (loanApps[i].loanApplicationId == loanApplicationId) {
                    loanApps[i].complianceCheckStatus = complianceCheckStatus;
                }
            }
        }

        updateDisclosureStatus = (loanApp: srv.ILoanApplicationViewModel, sixPiecesAcquired: boolean): void => {
            if (!loanApp.disclosureStatusDetails)
                loanApp.disclosureStatusDetails = <srv.IDisclosureStatusDetailsViewModel>{};

            if (sixPiecesAcquired) {
                loanApp.disclosureStatusDetails.disclosureStatus = srv.DisclosureStatusEnum.InitialDisclosureRequired;
                loanApp.disclosureStatusDetails.disclosureStatusText = "Initial Disclosure Required";
                loanApp.disclosureStatusDetails.disclosureStatusReasons = ['The Loan Application Date will be set for ' + moment().format('MM/DD/YY')];
                loanApp.alertPanelVisible = true;
            }
            else {
                loanApp.disclosureStatusDetails.disclosureStatus = srv.DisclosureStatusEnum.NotNeeded;
                loanApp.disclosureStatusDetails.disclosureStatusText = "";
                loanApp.disclosureStatusDetails.disclosureStatusReasons = [];
                loanApp.alertPanelVisible = false;
            }
        }

        isValidForSave = (): boolean => {
            var retVal: boolean = true;
            for (var i = 0; i < this.getLoanApplications().length; i++) {
                if (!this.getLoanApplications()[i].isValidForSave()) {
                    retVal = false;
                    this.getLoanApplications()[i].isFirstAndLastNameEnteredForBorrowers = false;
                }
                else
                    this.getLoanApplications()[i].isFirstAndLastNameEnteredForBorrowers = true;
            }
            return retVal;
        }

        private stateExist = (states: srv.ILookupItem[]): boolean => {
            for (var i = 0; i < states.length; i++) {
                if (this.getSubjectProperty().stateId != null && states[i].value == (this.getSubjectProperty().stateId).toString())
                    return true;
            }

            return false;
        }

        getLicencedStates = (appData): srv.ILookupItem[]=> {
            if (!this.conciergeId) return appData.lookup.statesForSkyline;
            if (this.conciergeId == appData.currentUserId) {
                if (this.getSubjectProperty().stateId != null && !this.stateExist(appData.lookup.statesForCurrentUser))
                    this.getSubjectProperty().clearAddress(true);
                return appData.lookup.statesForCurrentUser;
            }
            var licesesForLO = [];
            for (var i = 0; i < appData.licenses.length; i++) {
                if (appData.licenses[i].userAccountId == this.conciergeId) {
                    licesesForLO.push(appData.licenses[i]);
                }
            }
            var licensedStatesForLO = [];
            for (var i = 0; i < licesesForLO.length; i++) {
                for (var j = 0; j < appData.lookup.states.length; j++) {
                    if (licesesForLO[i].stateId == appData.lookup.states[j].value)
                        licensedStatesForLO.push(appData.lookup.states[j]);
                }
            }
            if (!this.stateExist(licensedStatesForLO)) {
                this.getSubjectProperty().clearAddress(true);
            }
            return licensedStatesForLO;
        }

        getLoanApplication = (loanApplicationId: string): cls.LoanApplicationViewModel => {

            if (this.getLoanApplications()) {
                for (var i = 0; i < this.getLoanApplications().length; i++) {
                    this.setPrimaryLoanApplication(this.getLoanApplications()[i]);
                    if (this.getLoanApplications()[i].loanApplicationId == loanApplicationId)
                        return <cls.LoanApplicationViewModel>this.getLoanApplications()[i];
                }
            }
            return null;
        }

        updateLoanApplication = (loanApplication: cls.LoanApplicationViewModel): boolean => {
            if (loanApplication && this.hasTransactionInfoLoanApplication()) {
                var loanApplicationExisting = this.getTransactionInfoLoanApplication().replace(loanApplication);
                return !!loanApplicationExisting;
            }
            return false;
        }

        downPaymentAmount = (amount: number): number|void => {
            if (this.loan.loanPurposeType == srv.LoanType.Purchase) {
                if (!angular.isDefined(amount))
                    return this.primary.getBorrower().filterDownPaymentAsset(this.getSubjectProperty().purchasePrice - this.loanAmount)[0].monthlyAmount;
                else
                    this.primary.getBorrower().filterDownPaymentAsset()[0].monthlyAmount = amount;
            }
        }

        downPaymentPercentage = (): number => {
            var retVal: number;
            if (this.loan.loanPurposeType == srv.LoanType.Purchase) {
                var downPayment = this.primary.getBorrower().filterDownPaymentAsset(this.getSubjectProperty().purchasePrice - this.loanAmount)[0].monthlyAmount;
                if (this.getSubjectProperty().purchasePrice && downPayment)
                    retVal = (downPayment / this.getSubjectProperty().purchasePrice) * 100;
            }
            return retVal;
        }

        /*
        * @desc Gets company name that is First Morgage Holder
        */
        getFirstMortgageHolder = (): string => {
            var firstMortgageHolder: string = "";

            if (this.primary.getBorrower().getLiabilities() && this.primary.getBorrower().getLiabilities().length > 0) {
                var asset = this.primary.getBorrower().getLiabilities().filter((liability: srv.ILiabilityViewModel) => {
                    return liability.getProperty() && liability.lienPosition && liability.lienPosition == 1 && liability.getProperty().isSubjectProperty;
                });

                if (asset && asset.length > 0 && asset[0].companyData.companyName) {
                    firstMortgageHolder = asset[0].companyData.companyName;
                }
            }

            return firstMortgageHolder;
        }

        getLoanLienPositions = (): string => {
            var loanLienPositions: string = "1st";

            //this.loanLienPosition .All(p => p.Checked == true) == true ? "1st, 2nd" : (loan.LoanLienPositions.SingleOrDefault(p => p.LienPosition == 1) != null ? "1st" : "2nd");
            /*
            if (!this.loanLienPositions)
                return loanLienPositions;

            var allLienPositionsChecked: boolean = true;

            for (var i = 0; i < this.loanLienPositions.length; i++) {
                if (!this.loanLienPositions[i].checked) {
                    allLienPositionsChecked = false;
                } else if (this.loanLienPositions[i].lienPosition == 1 ){
                    loanLienPositions = "1st";
                } else if (this.loanLienPositions[i].lienPosition == 2) {
                    loanLienPositions = "2nd";
                }
            }

            if (allLienPositionsChecked) {
                loanLienPositions = "1st, 2nd";
            }
            */
            return loanLienPositions;
        }

        getFinancialsTotal = (loanApplication: srv.ILoanApplicationViewModel, typeOfTotal: string): number => {
            return this.getAssetsTotals(loanApplication.getBorrower().getFinancials(), loanApplication.getCoBorrower().getFinancials(), loanApplication.getCombinedAssetsFinancials(), typeOfTotal);
        }

        getAssetsTotals = (borrowerAssets: srv.IAssetViewModel[], coBorrowerAssets: srv.IAssetViewModel[], combinedAssets: srv.IAssetViewModel[], typeOfTotal: string): number => {
            var total: number = 0;

            switch (typeOfTotal) {
                case 'borrower':
                    total = this.calculateAssetsTotal(borrowerAssets);
                    break;
                case 'coborrower':
                    total = this.calculateAssetsTotal(coBorrowerAssets);
                    break;
                case 'bothForBorrowerAndCoborrower':
                    total = this.calculateAssetsTotal(combinedAssets);
            }

            return total;
        }

        calculateAssetsTotal = (assets: srv.IAssetViewModel[]): number => {
            var total: number = 0;
            for (var i = 0; i < assets.length; i++) {
                if (!assets[i].isRemoved && assets[i].monthlyAmount) {
                    total += parseFloat(assets[i].monthlyAmount.toString());
                }
            }
            return total;
        }
        /** 
          * @desc Misc Expanses total calculation
          * @params loanApplication [object], borrower [boolean]
          * @param borrower - if data should be get from borrower or joint borrower & coBorrower from loanApp 
          * @param loanApplication - loanApplication object, if not sent it will take the active loan
          */
        getMiscExpensesTotal = (loanApplication, borrower): number => {

            var total = 0,
                msicExpanses;

            if (!loanApplication) {
                loanApplication = this.active;
            }

            // total or seperate data
            msicExpanses = borrower ?
                borrower.getMiscDebts() :
                loanApplication.getCombinedMiscDebts();

            if (!msicExpanses)
                return total;

            for (var i = 0; i < msicExpanses.length; i++) {
                if (!msicExpanses[i].isRemoved && msicExpanses[i].amount) {
                    total += parseFloat(msicExpanses[i].amount);
                }
            }

            return total;
        }

        isIntentToProceedDateSet = (): boolean => {

            if (!this.primary)
                return false;

            if (this.primary.getBorrower().eApprovalConfirmation && this.primary.getBorrower().eApprovalConfirmation.confirmationCodeConfirmed) {
                if (this.primary.isSpouseOnTheLoan) {
                    if (this.primary.getCoBorrower().eApprovalConfirmation && this.primary.getCoBorrower().eApprovalConfirmation.confirmationCodeConfirmed)
                        return true;

                    return false;
                }

                return true;
            }

            return false;
        }

        public getAutomobilesTotal = (loanApplication: srv.ILoanApplicationViewModel, typeOfTotal: string): number  => {
            return this.getAssetsTotals(loanApplication.getBorrower().getAutomobiles(), loanApplication.getCoBorrower().getAutomobiles(), loanApplication.getCombinedAssetsAutomobiles(), typeOfTotal);
        }

        public separateMiscDebts = (borrowerCheckedYes, coBorrowerCheckedYes) => {
            var miscDebtCopy;
            var newMiscDebt;
            var groupedMiscDebts = (_.groupByMulti(this.getActiveApplication().getCombinedMiscDebts().filter(function (item) {
                return !item.isRemoved && (!item.isDefaultValue || item.isDefaultValue === undefined || item.payee != "");
            }), ['typeId', 'payee']))[srv.MiscellaneousDebtTypes.ChildCareExpensesForVALoansOnly];

            for (var key in groupedMiscDebts) {
                if (groupedMiscDebts[key].length == 1) {
                    miscDebtCopy = angular.copy(groupedMiscDebts[key][0]);
                    newMiscDebt = new cls.MiscellaneousDebtViewModel();

                    newMiscDebt.isCoBorrower = !miscDebtCopy.isCoBorrower;
                    newMiscDebt.typeId = srv.MiscellaneousDebtTypes.ChildCareExpensesForVALoansOnly;
                    newMiscDebt.amount = 0;
                    newMiscDebt.payee = miscDebtCopy.payee;
                    newMiscDebt.isUserEntry = true;
                    newMiscDebt.monthsLeft = miscDebtCopy.monthsLeft;
                    newMiscDebt.isRemoved = true;
                    if (newMiscDebt.isCoBorrower == false && borrowerCheckedYes)
                        this.getActiveApplication().getBorrower().addMiscDebts(newMiscDebt);
                    else if (newMiscDebt.isCoBorrower == true && coBorrowerCheckedYes)
                        this.getActiveApplication().getCoBorrower().addMiscDebts(newMiscDebt);

                    groupedMiscDebts[key].push(newMiscDebt);
                }
            }
            return groupedMiscDebts;
        }

        public getDefaultRowChildAlimony = () => {
            return (_.groupByMulti(this.getActiveApplication().getCombinedMiscDebts().filter(function (item) { return item.isDefaultValue; }), ['typeId', 'payee']))[srv.MiscellaneousDebtTypes.ChildCareExpensesForVALoansOnly];
        }

        public updateDefaultStatus = () => {
            var grouped = (_.groupByMulti(this.getActiveApplication().getCombinedMiscDebts().filter(function (item) { return item.isDefaultValue; }), ['typeId', 'payee']))[srv.MiscellaneousDebtTypes.ChildCareExpensesForVALoansOnly];
            for (var key in grouped) {
                grouped[key][0].isDefaultValue = false;
                if (grouped[key][1] != undefined)
                    grouped[key][1].isDefaultValue = false;
            }
        }

        public getLifeInsuranceTotal = (loanApplication: srv.ILoanApplicationViewModel, typeOfTotal: string): number => {
            return this.getAssetsTotals(loanApplication.getBorrower().getLifeInsurance(), loanApplication.getCoBorrower().getLifeInsurance(), loanApplication.getCombinedAssetsLifeInsurence(), typeOfTotal);
        }

        // todo: figure out why the signature of of getLifeInsuranceTotal, getFinancialsTotal, and getAutomobilesTotal
        public getTotalLiquidAssets = (): number => {
            return this.getLifeInsuranceTotal(this.active, 'bothForBorrowerAndCoborrower') + this.getFinancialsTotal(this.active, 'bothForBorrowerAndCoborrower');
        }

        public getTotalAssetsWithoutDownPayment = (): number => {
            //
            // @todo-cc: Review for API
            //

            var flg = 'bothForBorrowerAndCoborrower';
            var total = 0.00;
            total += this.getLifeInsuranceTotal(this.active, flg);
            total += this.getFinancialsTotal(this.active, flg);
            total += this.getAutomobilesTotal(this.active, flg);

            var properties = this.getPropertyMap().getValues();
            for (var i = 0; i < properties.length; i++) {
                // @todo-cc: filter
                // @todo-cc: enums/constants (Refinance)
                if (!!properties[i] && !!properties[i].currentEstimatedValue && properties[i].currentEstimatedValue > 0
                // this condition for "Only consider Subject Property for Refinance Loans"
                    && (this.loanPurposeType == 2/*Refinance*/ || !properties[i].isSubjectProperty)
                // this condition of "Belongs to active application" covers all current scenarios including subject property (Refinance)
                //      because subject property should always and only be applied to the assets of the "Primary" Loan application
                //      for all Refinance loan scenarios
                    && properties[i].loanApplicationId === this.active.loanApplicationId) {
                    total += properties[i].currentEstimatedValue;
                }
            }

            return total;
        }
        
        //public changeBorrowerForSection = (borrower, item) => {
        //    assetsUtil.changeBorrowerForSection(borrower, item, this.active)
        //}

        /*Property Expenses*/
        public getHoaPropertyExpense = () => {
            return this.$filter('filter')(this.getSubjectProperty().propertyExpenses, { type: '4' }, true)[0];
        }

        /*Costs*/
        public getTotalEstimatedReserves = (cost) => {
            return (cost.noOfMonthlyReserves * Math.round(this.getMonthlyAmount(cost) * 10000) / 10000) * (cost.impounded ? 1 : 0);
        }

        public getMonthlyAmount = (cost) => {
            if (cost.amount == '')
                cost.amount = 0;

            if (cost.factor > 0 && this.loanPurposeType === 1) {
                if (cost.hudLineNumber == 1002) {
                    cost.amount = Math.round(cost.factor * this.loanAmount / 12) * 0.12;
                }
                else if (cost.hudLineNumber == 1004) {
                    cost.amount = Math.round(cost.factor * this.getSubjectProperty().purchasePrice / 12) * 0.12;
                }
            }
            cost.monthlyAmount = cost.paymentType == 'Annual' ? cost.amount / 12 : cost.amount;
            return cost.monthlyAmount;
        }


        getHomeBuyingTypeText = (): string => {
            var retVal: string;
            switch (this.homeBuyingType) {
                case 1:
                    retVal = "Offer Accepted";
                    break;
                case 2:
                    retVal = "Offer Pending Found A House";
                    break;
                case 3:
                    retVal = "Get PreApproved"
                    break;
                case 4:
                    retVal = "What Can I Afford"
                    break;
                default:
                    retVal = "";
                    break;
            }
            return retVal;
        }

        /**
        * @desc Gets the loan purpose type string representation.
        */
        getLoanPurposeTypeText = (): string => {

            var retVal: string = 'None';
            switch (this.loanPurposeType) {
                case 1:
                    retVal = 'Purchase';
                    break;
                case 2:
                    retVal = 'Refinance';
                    break;
                //default:
                //    retVal = 'None';
            }

            return retVal;
        }

        private _active: srv.ILoanApplicationViewModel;
        get active(): srv.ILoanApplicationViewModel {
            return this._active ? this._active : (this._active = this.getLoanApplications()[0]);
        }
        set active(active: srv.ILoanApplicationViewModel) {
            this.selectedAppIndex = this.getLoanApplications().indexOf(active);
            this._active = active;
        }

        switchActiveLoanApplication = (loanApp: srv.ILoanApplicationViewModel): void => {
            this.active = loanApp;
        }

        /**
        * @desc Validates if 3rd, 4th and 5th piece of 6 pieces is acquired.
        */
        isPropertyPieceAcquired = (): boolean => {
            var retVal: boolean = false;

            retVal =
            (this.getSubjectProperty() && this.getSubjectProperty() && this.getSubjectProperty().isValid() // 3rd piece - subject property street.
                && (!!this.getSubjectProperty().currentEstimatedValue || !!this.getSubjectProperty().purchasePrice)) // 5th piece - estimated value of subject property.
            && !!this.loanAmount; // 4th piece - loan amount.

            return retVal;
        }

        checkAgentsDifferences = (): boolean => {
            return this.doesYourAgentAlsoRepresentsSeller = this.doesAgentRepresentsSeller(this.buyersAgentContact, this.sellersAgentContact);
        }

        /**
        * @desc Adds new 1003 application
        */
        addLoanApplication = (loanApplication: srv.ILoanApplicationViewModel): void => {
            if (this.getLoanApplications().length < this.maxNumberOfLoanApplications || this.maxNumberOfLoanApplications === 0 && this.hasTransactionInfoLoanApplication()) {
                loanApplication.isUserEntry = true;

                this.getTransactionInfoLoanApplication().map(loanApplication);

                this.active = loanApplication;
                // @todo-cc: Review , new one always becomes primary ???
                this.setPrimaryLoanApplication(loanApplication);
            }
        }

        /**
        *@desc Sets the 1003 primary status ; @todo-cc: REMOVE
        */
        setPrimaryLoanApplication = (loanApplication: srv.ILoanApplicationViewModel): void => {
            if (loanApplication.loanApplicationId == this.loanId) {
                loanApplication.isPrimary == true;
            } else { loanApplication.isPrimary == false; }
        }

        /**
        * @desc Removes all 1003 applications that are added prior saving
        */
        removeLoanApplications = (): void => {
            //
            // @todo-cl: Review ; why/how Loan Applications should be removed and/or deleted
            //

            //var itemsToRemove = this.filterUserAddedLoanApplications();
            //for (var key in itemsToRemove) {
            //    common.deleteItem(common.indexOfItem(itemsToRemove[key], this.getLoanApplications()), this.getLoanApplications());
            //}

        }

        /*--------------------------------------
       * Product model logic
       *---------------------------------------*/

        /**
         * @desc Populate and format product class
         */
        populateAndFormatProductClass = (): void => {
            this.product.conforming = this.financialInfo.conforming;
            this.product.name = this.formatProgramName();
        }

        /**
         * @desc Calculate Lock Expiration Number from Lock Expiration Date
         */
        calculateLockExpirationNumber = (): number => {
            var lockExpirationDate: any,
                dateNow: any;


            if (!moment(this.lockingInformation.lockExpirationDate).isValid())
                return null;

            if (!this.lockingInformation.lockExpirationDate) return null;


            dateNow = moment().startOf('day');
            var duration: any = moment(this.lockingInformation.lockExpirationDate).diff(dateNow, 'days');
            return duration;

        }
        
        /**
         * @desc Fromat program name for title row
         */
        formatProgramName = (): string => {


            var name: string = '';
            var amortizationType: number = this.financialInfo.amortizationType,
                mortageType: number = this.financialInfo.mortgageType,
                loanAmortizationTerm: number = this.financialInfo.term,
                IsBaloonPayment: boolean = this.financialInfo.isBaloonPayment != null ? this.financialInfo.isBaloonPayment : false,
                isHarp: boolean = this.loan.loanIsHarp,
                loanAmortizationFixedTerm: number = this.financialInfo.fixedRateTerm;

            if (amortizationType === srv.AmortizationType.ARM && loanAmortizationTerm !== loanAmortizationFixedTerm) {

                if (loanAmortizationFixedTerm != null) {
                    name += loanAmortizationFixedTerm;
                }


                name += (IsBaloonPayment ? ' Year Adjustable due in ' + 0 + ' years ' : (isHarp ? ' Year Fixed HARP ' : ' Year Fixed '));
                if (amortizationType != null) {
                    name += this.getObjectKeyFromValue(srv.AmortizationType, amortizationType);
                }

                if (mortageType === srv.MortageType.FHA || mortageType === srv.MortageType.VA) {
                    name += ' ' + this.getObjectKeyFromValue(srv.MortageType, mortageType) + ' ';
                }

            } else {
                if (loanAmortizationTerm != null) {
                    name += loanAmortizationTerm;
                }

                name += (IsBaloonPayment ? ' Year Fixed due in ' + 0 + ' years ' : (isHarp ? ' Year HARP ' : ' Year '));
                if (amortizationType != null) {
                    name += this.getObjectKeyFromValue(srv.AmortizationType, amortizationType);
                }

                //add mortgage type if AmortizationType is not ARM
                if (amortizationType !== srv.AmortizationType.ARM) {
                    name += ' ' + this.getObjectKeyFromValue(srv.MortageType, mortageType) + ' ';
                }


            }

            return name;

        }

        /**
         * @desc Build lock experation text via lock experation number
         */
        getLockExpirationText = (): string => {

            var lockExpirationNumber: number = this.calculateLockExpirationNumber(),
                absLockExpirationNumber: number,
                name: string = '';

            if (!lockExpirationNumber) return '';

            absLockExpirationNumber = Math.abs(lockExpirationNumber);
            name += 'Expire';

            if (lockExpirationNumber >= 0) {
                name += 's ';
                name += (lockExpirationNumber === 0) ? 'Today' : 'in ' + absLockExpirationNumber + ' Days';

            } else {
                name += 'd ' + absLockExpirationNumber + ' Days Ago';
            }

            return name;
        }

        /**
         * @desc Get lock color via lock experation number for title row on loan details
         */
        getLockColor = (): string => {
            return (this.calculateLockExpirationNumber() >= 0) ? '#1fb25a' : '#E73302';
        }

        /**
         * @desc Get lock expired and is locked
         */
        getLockStatus = (): any => {
            return {
                isLockExpired: this.calculateLockExpirationNumber() < 0,
                isLocked: this.lockingInformation.lockStatus === srv.LockStatus.Locked
            };
        }

        /**
         * @desc Convert date to UTC format, so we can include day light saving time and diffrence of timezones
         */
        private treatDateAsUTC = (date): number => {
            var d = new Date(date);
            return d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
        }

        /**
        * @desc Get object key from value
        */
        private getObjectKeyFromValue = (obj, value): any => {
            return Object.keys(obj).filter(function (key) { return obj[key] === value })[0];
        }

        private doesAgentRepresentsSeller = (buyersAgent: srv.IAgentContactViewModel, sellersAgent: srv.IAgentContactViewModel) => {

            if (buyersAgent != null && sellersAgent != null) {
                if (buyersAgent.firstname == sellersAgent.firstname && buyersAgent.lastname == sellersAgent.lastname &&
                    buyersAgent.company == sellersAgent.company && buyersAgent.preferedPhone == sellersAgent.preferedPhone &&
                    buyersAgent.preferedPhoneType == sellersAgent.preferedPhoneType && buyersAgent.alternatePhoneType == sellersAgent.alternatePhoneType &&
                    buyersAgent.alternatePhone == sellersAgent.alternatePhone && buyersAgent.email == buyersAgent.email) {
                    return true;
                }
                else {
                    return false;
                }
            }
            else {
                return false;
            }
        }

        private filterUserAddedLoanApplications = (): srv.ILoanApplicationViewModel[]=> {
            return this.getLoanApplications().filter((loanApplication: srv.ILoanApplicationViewModel) => {
                return loanApplication.isUserEntry;
            });
        }

        public prepareForSubmit = (): void => {
            // @todo-cl::PROPERTY-ADDRESS
            // this.getLoanApplications().map(a => a.prepareForSubmit());
        }

        public getTotalMonthlyPropertyObligations = (): number => {
            if (!this.housingExpenses)
                return 0;

            return this.housingExpenses.newTotalHousingExpenses;
        }

        returnLoanPurposeType = (): number => {
            return this.loanPurposeType;
        }

        getPrimaryAppOccupancyType = (): srv.PropertyUsageTypeEnum => {
            return angular.isDefined(this.primary) ? this.primary.occupancyType : srv.PropertyUsageTypeEnum.PrimaryResidence;
        }

        private hasTransactionalInfoOtherIncomes = (): boolean => {
            if (this.hasTransactionInfo() && !!this.getTransactionInfoRef().incomeInfo) {
                return true;
            }
            else {
                return false;
            }
        }
        private getTransactionInfoOtherIncome = (): Map<srv.IIncomeInfoViewModel> => {
            if (this.hasTransactionalInfoOtherIncomes()) {
                return this.getTransactionInfoRef().incomeInfo;
            }
            return new Map<srv.IIncomeInfoViewModel>();
        }

        getOtherIncomes = (): srv.IIncomeInfoViewModel[]=> {
            if (this.hasTransactionalInfoOtherIncomes) {
                return this.getTransactionInfoOtherIncome().getValues();
            }
            return [];
        }

        setOtherIncomes = (incomes: srv.IIncomeInfoViewModel[]): void => {
            if (!!incomes && this.hasTransactionalInfoOtherIncomes) {
                this.getTransactionInfoOtherIncome().mapAll(incomes);
            }
        }

        getReoItemByLienPosition = (postion: number): srv.ILiabilityViewModel => {
            var result = lib.filter(this.primary.getBorrower().getLiabilities(),(item: srv.ILiabilityViewModel) => { return item.isPledged && item.lienPosition == postion && item.property.isSubjectProperty; });
            if (result && result.length > 0) {
                var reo = result[0];
                if (!!reo.reoInfo && !(reo.reoInfo instanceof REOInfoViewModel)) {
                    reo.reoInfo = new REOInfoViewModel(reo.reoInfo);
                }

                return reo;
            }
            else
                return null;
        }

        get otherIncomes(): srv.IIncomeInfoViewModel[] {
            return this.getOtherIncomes();
        }
        set otherIncomes(incomes: srv.IIncomeInfoViewModel[]) {
            this.setOtherIncomes(incomes);
        }

        get OtherIncomes(): srv.IIncomeInfoViewModel[] {
            return this.getOtherIncomes();
        }
        set OtherIncomes(incomes: srv.IIncomeInfoViewModel[]) {
            this.setOtherIncomes(incomes);
        }

        private hasTransactionalInfoLiabilities = (): boolean => {
            if (this.hasTransactionInfo() && !!this.getTransactionInfoRef().liability) {
                return true;
            }
            else {
                return false;
            }
        }

        private getTransactionInfoLiabilities = (): Map<srv.ILiabilityViewModel> => {
            if (this.hasTransactionalInfoLiabilities) {
                return this.getTransactionInfoRef().liability;
            }
            return new Map<srv.ILiabilityViewModel>();
        }

        getCurrentLoanOriginationDate = (): Date => {
            if (this.hasTransactionalInfoLiabilities) {
                var liabilities = this.getTransactionInfoLiabilities().getValues();
                for (var i = 0; i < liabilities.length; i++) {
                    if (liabilities[i].getProperty() && liabilities[i].getProperty().isSubjectProperty && liabilities[i].lienPosition == srv.LienPosition.First) {
                        return liabilities[i].loanOriginationDate;
                    }
                }

            }
            return null;
        }

        setCurrentLoanOriginationDate = (originationDate: Date): void => {
            if (!!originationDate && this.hasTransactionalInfoLiabilities) {
                var liabilities = this.getTransactionInfoLiabilities().getValues();
                for (var i = 0; i < liabilities.length; i++) {
                    if (liabilities[i].getProperty() && liabilities[i].getProperty().isSubjectProperty && liabilities[i].lienPosition == srv.LienPosition.First) {
                        liabilities[i].loanOriginationDate = originationDate;
                        break;
                    }
                }
            }
        }

        get CurrentLoanOriginationDate(): Date {
            return this.getCurrentLoanOriginationDate();
        }
        set CurrentLoanOriginationDate(originationDate: Date) {
            this.setCurrentLoanOriginationDate(originationDate);
        }


        get FirstLienReoItem(): srv.ILiabilityViewModel {
            return this.getReoItemByLienPosition(1);
        }

        get JuniorLienReoItem(): srv.ILiabilityViewModel {
            return this.getReoItemByLienPosition(2);
        }

        incomeTotalForBorrower = (borrower: srv.IBorrowerViewModel): number => {
            var total: number = 0;
            //add base income.
            total += borrower.baseIncomeTotal;

            // Add other income.
                total += this.getOtherIncomeSumForBorrower(borrower.borrowerId);

            return total;
        }

        getCurrentAccountOpenDate = (): Date => {
            if (this.hasTransactionalInfoLiabilities) {
                var liabilities = this.getTransactionInfoLiabilities().getValues();
                for (var i = 0; i < liabilities.length; i++) {
                    if (liabilities[i].getProperty() && liabilities[i].getProperty().isSubjectProperty && liabilities[i].lienPosition == srv.LienPosition.First) {
                        return liabilities[i].accountOpenDate;
                    }
                }

            }
            return null;
        }

        setCurrentAccountOpenDate = (accountOpenDate: Date): void => {
            if (!!accountOpenDate && this.hasTransactionalInfoLiabilities) {
                var liabilities = this.getTransactionInfoLiabilities().getValues();
                for (var i = 0; i < liabilities.length; i++) {
                    if (liabilities[i].getProperty() && liabilities[i].getProperty().isSubjectProperty && liabilities[i].lienPosition == srv.LienPosition.First) {
                        liabilities[i].accountOpenDate = accountOpenDate;
                        break;
                    }
                }
            }
        }

        get CurrentAccountOpenDate(): Date {
            return this.getCurrentAccountOpenDate();
        }
        
        set CurrentAccountOpenDate(accountOpenDate: Date) {
            this.setCurrentAccountOpenDate(accountOpenDate);
        }

        /**
        * @desc: Retrieves absolute value of cashFromToBorrower
        */
        getCashFromToBorrower = (): number => {
            if (this.detailsOfTransaction.cashFromToBorrower < 0)
                return Math.abs(this.detailsOfTransaction.cashFromToBorrower);
            return 0;
        }

        get CashFromToBorrower(): number {
            return this.getCashFromToBorrower();
        }

        incomeTotalForBorrowerWithMiscExpenses = (borrower: srv.IBorrowerViewModel, skipMiscExpenses: boolean = false): number => {
            var total: number = 0;
            //add base income.
            total += borrower.baseIncomeTotal;

            // Add other income.
            if (skipMiscExpenses) {
                total += this.getOtherIncomeSumForBorrower(borrower.borrowerId);
            } else {
                total += this.getOtherIncomeSumForBorrowerWithMiscExpenses(borrower);
            }
            

            return total;
        }


        incomeTotalForCoBorrower = (borrower: srv.IBorrowerViewModel): number => {
        
            var total: number = 0;
            //add base income.
            total += borrower.baseIncomeTotal;

            // Add other income.
            total += this.getOtherIncomeSumForBorrower(borrower.borrowerId);

            return total;
        }

        private getOtherIncomeSumForBorrower = (borrowerId: string): number => {

            // @todo-cl: Needs to be clean-up and consolodated with all the other summations , =/12 , etc. from all over the place

            var total: number = 0;
            var otherIncomes = this.OtherIncomes.filter(function (i) { return (i.borrowerId == borrowerId && (!i.employmentInfoId || i.employmentInfoId == lib.getEmptyGuid())) });
            if (otherIncomes) {
                angular.forEach(otherIncomes, function (income) {
                    if (income && !income.isRemoved && income.manualAmount && income.incomeTypeId != srv.incomeTypeEnum.netRentalIncome) {
                        var amount: number = Number(income.manualAmount);
                        if (income.preferredPaymentPeriodId == srv.preferredPaymentPeriodsTypeEnum.Annual) {
                            amount /= 12;
                        }
                        total += amount;
                    }
                });
            }
            return total;
        }

        getOtherIncomeSumForBorrowerWithMiscExpenses = (borrower: srv.IBorrowerViewModel): number => {

            var total: number = this.getOtherIncomeSumForBorrower(borrower.borrowerId);

            var miscDebts = borrower.getMiscDebts().filter(function (i) { return (i.typeId == srv.MiscellaneousDebtTypes.Expenses2106FromTaxReturns) });

            return total += this.calculateMiscExpenses(miscDebts);
        }


        private calculateMiscExpenses = (miscDebts: srv.IMiscellaneousDebtViewModel[]): number => {

            var total: number = 0;
            var amount: number = 0;

            angular.forEach(miscDebts, function (debt) {
                if (debt && !debt.isRemoved && debt.amount) {
                    amount = Number(debt.amount);
                    total -= amount;
                }
            });

            return total;
        }

        getOtherIncomeTotalForBorrower = (borrower: srv.IBorrowerViewModel): number => {
            return this.getOtherIncomeSumForBorrowerWithMiscExpenses(borrower) + this.getCashFlowForNetRentalIncomes(borrower, false);
        }

        getOtherIncomeTotal = (borrower: srv.IBorrowerViewModel): number => {
            return this.getOtherIncomeSumForBorrower(borrower.borrowerId) + this.getCashFlowForNetRentalIncomes(borrower, false);
        }
        getCombinedOtherIncomeTotal = (): number => {
            if (this.active.isSpouseOnTheLoan)
                return this.getOtherIncomeTotal(this.active.getBorrower()) + this.getOtherIncomeTotal(this.active.getCoBorrower());
            else
                return this.getOtherIncomeTotal(this.active.getBorrower());

        }

        //addOtherIncome = (otherIncome: srv.IIncomeInfoViewModel): void => {
        //    otherIncome.borrowerId = this.active.getBorrower().borrowerId;
        //    otherIncome.isCurrentlyAdded = true;
        //    if (!this.otherIncomes)
        //        this.otherIncomes = [];
        //    this.otherIncomes.push(otherIncome);
        //}

        deleteOtherIncome = (otherIncome: srv.IIncomeInfoViewModel): void => {
            common.deleteItem(common.indexOfItem(otherIncome, this.otherIncomes), this.otherIncomes);
        }

        removeOtherIncome = (otherIncome: srv.IIncomeInfoViewModel): void => {
            otherIncome.isRemoved = true;
        }

        getCombinedNonSubjectPropertyIncomeTotal = (): number => {
            var retVal = Number(this.getNonSubjectPropertiesNetRentalIncome(this.active.getBorrower()));
            if (this.active.isSpouseOnTheLoan)
                retVal += Number(this.getNonSubjectPropertiesNetRentalIncome(this.active.getCoBorrower()));

            return retVal;
        }

        getNonSubjectPropertiesNetRentalIncome = (borrower: srv.IBorrowerViewModel): number => {

            return this.netRentalIncomeSum(borrower, false);

        }
        getSubjectPropertiesNetRentalIncome = (borrower: srv.IBorrowerViewModel): number => {

            return this.netRentalIncomeSum(borrower, true);

        }

        getCashFlowForNetRentalIncomes = (borrower: srv.IBorrowerViewModel, isNegative: boolean): number => {
            var total: number = 0;
            var subjectPropertyNetRental: number = this.getSubjectPropertiesNetRentalIncome(borrower);
            var nonSubjectPropertiesNetRental: number = this.getNonSubjectPropertiesNetRentalIncome(borrower);

            return this.getNetRentalAmount(isNegative, subjectPropertyNetRental) + this.getNetRentalAmount(isNegative, nonSubjectPropertiesNetRental);
        }
        private getNetRentalAmount = (isNegative: boolean, amount: number): number => {
            if (isNegative) {
                if (amount < 0)
                    return amount;
                else
                    return 0;
            } else {
                if (amount > 0)
                    return amount;
                else return 0;
            }
        }

        private netRentalIncomeSum = (borrower: srv.IBorrowerViewModel, isSubjectProperty: boolean): number => {
            var total: number = 0;
            var otherIncome = this.OtherIncomes.filter(function (i) {
                return (i.borrowerId == borrower.borrowerId && i.isNetRental && i.isSubjectProperty == isSubjectProperty)
            });

            if (otherIncome) {
                angular.forEach(otherIncome, function (income) {
                    if (!income.isRemoved) {
                        var amount = Number(income.manualAmount);

                        if (income.preferredPaymentPeriodId == srv.preferredPaymentPeriodsTypeEnum.Annual) {
                            amount /= 12;
                        }
                        total += amount;
                    }
                });
            }

            return total;
        }

        private processPropertyRules = () => {
            if (this.loanPurposeType == srv.LoanPurposeTypeEnum.Refinance)
                lib.forEach(this.getLoanApplications(), la => {
                    {
                        if (la.OccupancyType == srv.PropertyUsageTypeEnum.PrimaryResidence)
                            la.getBorrower().getCurrentAddress().isSameAsPropertyAddress = true;
                    }
                });
        }

        private initialize = (loan?: srv.ILoanViewModel) => {
                var ti = new cls.TransactionInfo();
                this.getTransactionInfo = () => ti;

            if (loan) {
                ti.populate(() => this, loan.transactionInfo);

                // todo: not clear why something static is dependent on the loan instance
                if (!LoanViewModel._lookupInfo)
                    LoanViewModel._lookupInfo = loan.lookup;

                // assign active first
                //      @todo-cc: Loan should always have loanId  , remove this conditional and else{}
                if (loan.loanId) {
                    if (!loan.selectedAppIndex) {
                        this.active = this.getActiveLoanApplication(this);
                    } else {
                        //Set selected LoanApplication before save
                        this.active = this.getActiveLoanApplicationByIndex(this);
                        if (this.active === undefined)
                            this.active = this.getActiveLoanApplication(this);
                    }

                    // Get the primary loan.
                    this.primary = this.getPrimaryLoan(this);
                }
                else {
                    var loanApplicationDefault = (loan.getLoanApplications().length > 0) ? <cls.LoanApplicationViewModel>this.getLoanApplications()[0] : new cls.LoanApplicationViewModel(this.getTransactionInfoRef(), null);
                    this.setLoanApplicationsDefaults(loanApplicationDefault);
                }

                //initialize streetName if not exists for GetPreapproved home buying type
                if (this.homeBuyingType == srv.HomeBuyingType.GetPreApproved && !this.getSubjectProperty().streetName)
                    this.getSubjectProperty().streetName = 'TBD';

                //initialize other Incomes for collection

                lib.forEach(loan.otherIncomes, p => (p.isNetRental) ? this.otherIncomes.push(new cls.NetRentalIncomeInfoViewModel(p)) : this.otherIncomes.push(new cls.OtherIncomeInfoViewModel(this.getTransactionInfoRef(), p)));

                if (this.loanPurposeType == 1) {
                    // accessing will create if not exists (lazy)
                    this.getSubjectProperty().getNetRentalIncome();
                }                 

                //placeholder for loading otherIncomes              

                if (this.pricingAdjustments && this.pricingAdjustments.adjustments && this.pricingAdjustments.adjustments.length > 0) {
                    var adjs = this.pricingAdjustments.adjustments;
                    var newadj = [];
                    for (var i = 0; i < adjs.length; i++) {
                        newadj.push(new cls.AdjustmentsViewModel(adjs[i]));

                    }
                    this.pricingAdjustments.adjustments = newadj;
                }

                // @todo-cl: Review , this should come loaded as-is and be a predicate of of Transaction Info (not a property)
                if (!this.primary) {
                    this.setLoanApplicationsDefaults(<cls.LoanApplicationViewModel>ti.loanApplication.getValues()[0]);
                }

                //Initialize product
                this.populateAndFormatProductClass();

                //initialize locking information
                this.populateLockingInformation();

                //processPropertyRules
                this.processPropertyRules();

                //this.housingExpenses = new cls.HousingExpensesViewModel(loan.housingExpenses, this.primary.getCombinedReoPropertyList, this.getCosts, this.loanPurposeType, this.getCombinedPledgedAssetsForAll1003s, this.getSubjectProperty());

                // force create borrower lookup lists
                this.getLoanApplications().forEach(app => { app.Borrowers(false, true, false); });
            }
            else {
                // @todo-cc: Need to sort out creation services and TS
                if (!this.transactionInfo) {
                    this.transactionInfo = new srv.cls.TransactionInfo();
                }
                ti.populate(() => this, null);
                this.financialInfo = new srv.cls.LoanFinancialInfoViewModel();
                this.setLoanApplicationsDefaults(new cls.LoanApplicationViewModel(this.getTransactionInfoRef(), null));
            }

            this.areSixPiecesAcquiredForAllLoanApplications();

            this.isNewProspectSaved = true;
        }

        private getCosts = () => {
            if (!this.closingCost || !this.closingCost.costs)
                return new Array<srv.ICostViewModel>();

            return this.closingCost.costs;
        }

        private setLoanApplicationsDefaults(loanApplication: cls.LoanApplicationViewModel) {

            this.setLoanApplications([loanApplication]);

            //Initialize SubjectProperty

            // todo - get default subject property
            // this.subjectProperty = new cls.PropertyViewModel(loan.subjectProperty);

            // Get the active loan application.
            this.active = loanApplication;

            // Get the primary loan.
            this.primary = loanApplication;
            this.primary.isPrimary = true;

            this.loanPurposeType = 2;
        }

        // todo, $filter should not be dependency for this cls.LoanViewModel
        private getActiveLoanApplication = (loan: cls.LoanViewModel) => this.$filter('filter')(loan.getLoanApplications(), { loanApplicationId: loan.active.loanApplicationId }, true)[0];
        private getPrimaryLoan = (loan: cls.LoanViewModel) => this.$filter('filter')(loan.getLoanApplications(), { isPrimary: true }, true)[0];
        private getActiveLoanApplicationByIndex = (loan: cls.LoanViewModel) => loan.getLoanApplications()[loan.selectedAppIndex];

        private updateLoanDateHistory = (dateValue: Date, currentUserName: string, dateOfChange: Date, impoundSchedules: any, title: string) => {

            var loanDateHistory = new cls.LoanDateHistoryViewModel();
            loanDateHistory.dateValue = dateValue;
            loanDateHistory.dateOfChange = dateOfChange;
            loanDateHistory.userName = currentUserName;
            loanDateHistory.isActive = true;  
            loanDateHistory.userCurrentlyEditing = true;
                  

            if (title == "Closing Date") {
                if (!this.closingDate.dateHistory) {
                    this.closingDate.dateHistory = new Array<srv.ILoanDateHistoryViewModel>();
                }
                else {
                    var userCurrentlyEditnigDateHistories = lib.filter(this.closingDate.dateHistory, dateHistory => new cls.LoanDateHistoryViewModel(dateHistory).userCurrentlyEditing);
                    if (userCurrentlyEditnigDateHistories.length > 0) {
                        this.closingDate.dateHistory.pop();
                    }
                }
                this.closingDate.dateHistory.push(loanDateHistory);
            }
            else if (title == "Appraisal Due Date") {
                if (!this.appraisalContingencyDate.dateHistory) {
                    this.appraisalContingencyDate.dateHistory = new Array<srv.ILoanDateHistoryViewModel>();
                }
                else {
                    var userCurrentlyEditnigDateHistories = lib.filter(this.appraisalContingencyDate.dateHistory, dateHistory => new cls.LoanDateHistoryViewModel(dateHistory).userCurrentlyEditing);
                    if (userCurrentlyEditnigDateHistories.length > 0) {
                        this.appraisalContingencyDate.dateHistory.pop();
                    }
                    else if (this.appraisalContingencyDate.dateHistory.length > 0) {
                        lib.filter(this.appraisalContingencyDate.dateHistory, dateHistory => dateHistory.isActive)[0].isActive = false;
                    }            
                }
                if (loanDateHistory.dateValue) {
                    this.appraisalContingencyDate.dateHistory.push(loanDateHistory);
                }
            }
            if (title == "Approval Due Date") {
                if (!this.approvalContingencyDate.dateHistory) {
                    this.approvalContingencyDate.dateHistory = new Array<srv.ILoanDateHistoryViewModel>();
                }
                else {
                    var userCurrentlyEditnigDateHistories = lib.filter(this.approvalContingencyDate.dateHistory, dateHistory => new cls.LoanDateHistoryViewModel(dateHistory).userCurrentlyEditing);
                    if (userCurrentlyEditnigDateHistories.length > 0) {
                        this.approvalContingencyDate.dateHistory.pop();
                    }
                    else if (this.approvalContingencyDate.dateHistory.length > 0) {
                        lib.filter(this.approvalContingencyDate.dateHistory, dateHistory => dateHistory.isActive)[0].isActive = false;
                    }             
                }
                if (loanDateHistory.dateValue) {
                    this.approvalContingencyDate.dateHistory.push(loanDateHistory);
                }
            }
        }

        private reoItemsForSubjectPropertyWithLienSecondOrMore: srv.IList<srv.ILiabilityViewModel>;

        private getReoItemsForSubjectPropertyOnAllLoanApplications = (): void => {
            this.reoItemsForSubjectPropertyWithLienSecondOrMore = new Array<srv.ILiabilityViewModel>();
            this.getLoanApplications().forEach((la, idx) => {
                this.reoItemsForSubjectPropertyWithLienSecondOrMore = this.reoItemsForSubjectPropertyWithLienSecondOrMore.concat(la.getAllLiabilitiesCombined().filter(function (item) { return item.isPledged && item.getProperty() && item.getProperty().isSubjectProperty && item.lienPosition >= 2; }));
            });

        }

        calculateSubordinate = (): any => {

            if (this.loanPurposeType == srv.LoanPurposeTypeEnum.Refinance) {

                this.getReoItemsForSubjectPropertyOnAllLoanApplications();

                //if no Reo Items Subordinate will be empty string
                if (!this.reoItemsForSubjectPropertyWithLienSecondOrMore.length)
                    return "";

                //if for all reo items on all loanapplication DebtComments are PayoffAtClose or PayoffAtClosingAndCloseAccount subordinate will be N\A
                if (this.reoItemsForSubjectPropertyWithLienSecondOrMore.filter(function (item) {
                    return item.borrowerDebtCommentId == srv.pledgedAssetCommentType.PayoffAtClose || item.borrowerDebtCommentId == srv.pledgedAssetCommentType.PayoffAtClosingAndCloseAccount;
                }).length == this.reoItemsForSubjectPropertyWithLienSecondOrMore.length)
                    return "N/A";

                //if comment are PayoffAtClosingAndDontCloseAccount
                if (this.reoItemsForSubjectPropertyWithLienSecondOrMore.filter(function (item) {
                    return item.borrowerDebtCommentId == srv.pledgedAssetCommentType.PayoffAtClosingAndDontCloseAccount
                }).length == this.reoItemsForSubjectPropertyWithLienSecondOrMore.length)
                    return 0;

                //in other cases will be sum of all reo items with other comments
                return this.sumBalanceForAllLoanAplication();
            }
            return "";
        }

        isDataValidForAggregateAdjustmentCalculation = (): boolean => {
            var costs = lib.filter(this.getCosts(), c => c.hudLineNumber == 1002 || c.hudLineNumber == 1004 || c.hudLineNumber == 1006
                || (c.isRemoved != true && (c.hudLineNumber == 1010 || c.hudLineNumber == 1007 || c.hudLineNumber == 1012 || c.originalHUDLineNumber == 1010 || c.originalHUDLineNumber == 1007 || c.originalHUDLineNumber == 1012)));

            for (var i = 0; i < costs.length; i++) {
                if (costs[i].amountMethod != srv.AmountMethodEnum.Itemized) {
                    if (!costs[i].impounded || !costs[i].amountPerMonth) {
                        continue;
                    }

                    // If period type != monthly and due dates aren't initialized, don't trigger aggregate adjustment calculation
                    if (costs[i].preferredPaymentPeriod != srv.PeriodTypeEnum.Monthly && costs[i].periodPaymentMonths.length == 0) {
                        this.totalAggregateAdjustment = 0;
                        return false;
                    }

                    for (var j = 0; j < costs[i].periodPaymentMonths.length; j++) {
                        if (!costs[i].periodPaymentMonths[j].isRemoved && !costs[i].periodPaymentMonths[j].month) {
                            this.totalAggregateAdjustment = 0;
                            return false;
                        }
                    }
                }
                else {
                    for (var k = 0; k < costs[i].itemizedPropertyTaxes.length; k++) {
                        if (costs[i].itemizedPropertyTaxes[k].amount && !costs[i].itemizedPropertyTaxes[k].month) {
                            this.totalAggregateAdjustment = 0;
                            return false;
                        }
                    }
                }
            }
            return true;
        }

        resetEscrowsMonthsToBePaid = (): void => {
            var costs = lib.filter(this.getCosts(), c => c.hudLineNumber == 1002 || c.hudLineNumber == 1004 || c.hudLineNumber == 1006
                || (c.isRemoved != true && (c.hudLineNumber == 1010 || c.hudLineNumber == 1007 || c.hudLineNumber == 1012 || c.originalHUDLineNumber == 1010 || c.originalHUDLineNumber == 1007 || c.originalHUDLineNumber == 1012)));
            
            for (var i = 0; i < costs.length; i++) {
                if (costs[i].originalMonthsToBePaid != null && costs[i].originalMonthsToBePaid > 0) {
                    costs[i].monthsToBePaid = costs[i].originalMonthsToBePaid;
                }
            }
        }

        private sumBalanceForAllLoanAplication = (): number => {

            var retVal: number = 0;

            for (var key in this.reoItemsForSubjectPropertyWithLienSecondOrMore) {
                if (this.reoItemsForSubjectPropertyWithLienSecondOrMore[key].borrowerDebtCommentId != srv.pledgedAssetCommentType.PayoffAtClose &&
                    this.reoItemsForSubjectPropertyWithLienSecondOrMore[key].borrowerDebtCommentId != srv.pledgedAssetCommentType.PayoffAtClosingAndCloseAccount &&
                    this.reoItemsForSubjectPropertyWithLienSecondOrMore[key].borrowerDebtCommentId != srv.pledgedAssetCommentType.PayoffAtClosingAndDontCloseAccount)
                    retVal += this.reoItemsForSubjectPropertyWithLienSecondOrMore[key].unpaidBalance;
            }
            return retVal;
        }

        getSubjectProperty = (): srv.IPropertyViewModel => {
            var subjectProperty = lib.findFirst(this.getPropertyMap().getValues(), p => p.isSubjectProperty);

            if (!subjectProperty) {
                console.warn("SUBJECT PROPERTY NOT FOUND");
            }

            return subjectProperty;
        }

        setSubjectProperty = (subjProp: srv.IPropertyViewModel): void => {
            var subjPropExisting = this.getSubjectProperty();
            if (!!subjPropExisting) {
                this.getPropertyMap().remove(subjPropExisting);
            }
            this.getPropertyMap().map(subjProp);
        }

        public bindSubjectProperty = (subjProp: srv.IPropertyViewModel): srv.IPropertyViewModel => {
            if (angular.isDefined(subjProp)) {
                this.setSubjectProperty(subjProp);
            }
            var retVal = this.getSubjectProperty();
            return retVal;
        }

        get subjectProperty(): srv.IPropertyViewModel {
            return this.getSubjectProperty();
        }
        set subjectProperty(subjProp: srv.IPropertyViewModel) {
            /*Read-Only*/
            console.warn("LoanViewModel::<set subjectProperty> should not be called ; use setSubjectProperty() instead.");
        }

        getProperty = (propertyId: string): srv.IPropertyViewModel => {

            var property = this.getPropertyMap().lookup(propertyId);
            return property;
        }

        getPropertiesByAddressId = (propertyId: string): srv.ICollection<srv.IPropertyViewModel> => {

            var properties = lib.filter(this.getPropertyMap().getValues(), p => p.propertyId == propertyId);
            return properties;
        }

        addOrUpdateProperty = (property: srv.IPropertyViewModel): void => {

            if (!property || !property.propertyId || property.propertyId == lib.getEmptyGuid())
                throw "loanVM::addOrUpdateProperty => input property is null or without id";

            property.loanId = this.loanId;

            this.getPropertyMap().map(property);
        }

        removePropertiesByAddressId = (property: srv.IPropertyViewModel, propertyId: string): void => {
            var currentAddressProperties = this.getPropertiesByAddressId(propertyId);
            if (currentAddressProperties) {
                lib.forEach(this.active.getCombinedPledgedAssets(), reo => {
                    if (lib.contains(currentAddressProperties, p => p.propertyId == reo.propertyId)) {
                        reo.setProperty(property);
                    }
                });

                lib.forEach(currentAddressProperties, property => {
                    var isRemoved = this.getPropertyMap().remove(property);
                    return isRemoved;
                });
            }
        }
        shouldLoanNumberBeVisible = (): boolean => {
            return (!common.string.isNullOrWhiteSpace(this.loanNumber) && this.loanNumber.toLowerCase()!='pending');
        }
       
        getActiveDisclosureDetailsViewModel = (): srv.cls.DisclosuresDetailsViewModel => {
            var activeDisclosureModel: srv.cls.DisclosuresDetailsViewModel = new srv.cls.DisclosuresDetailsViewModel();
            if (this.closingCost && this.closingCost.disclosuresDetailsViewModel) {
                lib.forEach(this.closingCost.disclosuresDetailsViewModel,(disclosureDetail: srv.cls.DisclosuresDetailsViewModel) => {
                    if (disclosureDetail.active) {
                        activeDisclosureModel = disclosureDetail;
                    }
                });   
            }
            return activeDisclosureModel;
        }

        cashFlowBorrower = (): number => {
            return Math.abs(this.getCashFlowForNetRentalIncomes(this.primary.getBorrower(), true));
        }

        cashFlowCoBorrower = (): number => {
            return Math.abs(this.getCashFlowForNetRentalIncomes(this.primary.getCoBorrower(), true));
        }

      
        totalIncomeForBorrower = (): number => {
            return this.getTotalBorrowerIncome(this.primary.getBorrower());
        }

        totalIncomeForCoBorrower = (): number => {
            return !this.primary.isSpouseOnTheLoan ? 0 : this.getTotalCoBorrowerIncome(this.primary.getCoBorrower()); 
        }

        private getTotalBorrowerIncome = (borrower: srv.IBorrowerViewModel): number => {
            return borrower.baseIncomeTotal + this.getOtherIncomeSumForBorrowerWithMiscExpenses(borrower) + this.getCashFlowForNetRentalIncomes(borrower, false);
        }

        private getTotalCoBorrowerIncome = (borrower: srv.IBorrowerViewModel): number => {
            return borrower.baseIncomeTotal + this.getOtherIncomeSumForBorrowerWithMiscExpenses(borrower) + this.getCashFlowForNetRentalIncomes(borrower, false);
        }

        private populateLockingInformation = (): void => {
            var lockStatus: any = this.getLockStatus();
            this.lockingInformation.isLocked = lockStatus.isLocked;
            this.lockingInformation.isLockExpired = lockStatus.isLockExpired;
            this.lockingInformation.lockExpirationDate = moment(this.lockingInformation.lockExpirationDate).isValid() ? moment(this.lockingInformation.lockExpirationDate).toDate() : null;
            this.lockingInformation.lockExpirationNumber = Math.abs(this.calculateLockExpirationNumber()).toString();
        }

        public isNewProspectSaved: boolean;

        updateGovermentEligibility = (calculatorType: srv.MortgageTypeEnum, isEligible: boolean) => {
            if (this.financialInfo.mortgageType == calculatorType) {
                switch (calculatorType) {
                    case srv.MortgageTypeEnum.FHA:
                        if (isEligible) {
                            this.govermentEligibility = srv.GovermentEligibilityEnum.FHAEligible;
                        }
                        else {
                            this.govermentEligibility = srv.GovermentEligibilityEnum.FHANotEligible;
                        }
                        break;
                    case srv.MortgageTypeEnum.VA:
                        if (isEligible) {
                            this.govermentEligibility = srv.GovermentEligibilityEnum.VAEligible;
                        }
                        else {
                            this.govermentEligibility = srv.GovermentEligibilityEnum.VANotEligible;
                        }
                        break;
                    case srv.MortgageTypeEnum.USDA:
                        if (isEligible) {
                            this.govermentEligibility = srv.GovermentEligibilityEnum.USDAEligible;
                        }
                        else {
                            this.govermentEligibility = srv.GovermentEligibilityEnum.USDANotEligible;
                        }
                        break;
                }
            }
        }

    }

    export interface ITransactionInfoCallback {
        (): cls.TransactionInfo;
    }

    export interface ILoanCallback {
        (): cls.LoanViewModel;
    }

    export interface IBorrowerCallback {
        (): srv.IBorrowerViewModel;
    }
}