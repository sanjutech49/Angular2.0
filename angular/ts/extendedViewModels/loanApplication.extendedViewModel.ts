/// <reference path="../../ts/generated/viewModels.ts" />
/// <reference path="../../ts/generated/enums.ts" />
/// <reference path="../../ts/extendedViewModels/borrower.extendedViewModel.ts" />
/// <reference path="../../ts/extendedViewModels/enums.extendedViewModel.ts" />
/// <reference path="../../ts/extendedViewModels/extendedViewModels.ts" />

module srv {

    export interface ILoanApplicationViewModel {
        assets?: cls.AssetViewModel[];
        getCombinedOtherIncome? (): srv.IIncomeInfoViewModel[];
        miscDebts?: srv.IMiscellaneousDebtViewModel[];
        isUserEntry?: boolean;
        isPersonalPieceAcquired? (): boolean;
        isIncomePieceAcquired? (): boolean;
        prepareForSubmit? (): void;
        getTotalAssetsAmount? (): number;
        handleJointWithCoBorrowerLiability? (originalItem: srv.ILiabilityViewModel): void;
        Borrowers? (includeJointAccount: boolean, useBorrowerId?: boolean, useFullNamesForJointAccount?: boolean): srv.ILookupItem[];
        LiabilitiesFor? (): srv.ILookupItem[];
        groupedLiabilities?: any;
        getCombinedAssetsLifeInsurence? (): srv.IAssetViewModel[];
        getCombinedAssetsAutomobiles? (): srv.IAssetViewModel[];
        getCombinedAssetsFinancials? (): srv.IAssetViewModel[];
        addProperty? (isBorrower: boolean): void;
        getCombinedReoPropertyList? (): srv.IList<srv.IPropertyViewModel>;
        getCombinedPledgedAssets? (): srv.IList<srv.ILiabilityViewModel>;
        originalCurrentAddress?: srv.IPropertyViewModel;
        isValidForSave? (): boolean;
        isFirstAndLastNameEnteredForBorrowers?: boolean;
        isAssetsCompleted? (): boolean;
        updateOccupancyTypeForSubjectPropertyPledgeAssets? (): void;
        combinedOtherIncomeTotal?: number;
        combinedNonSubjectPropertyIncomeTotal?: number;
        getAllLiabilitiesCombined? (): srv.IList<srv.ILiabilityViewModel>;
        alertPanelVisible?: boolean;
        getUniqueProperties? (getSubjectPropertiesForPurchase?: boolean): srv.IPropertyViewModel[];
        publicRecords?: srv.IList<srv.IPublicRecordViewModel>;
        reos?: srv.ILiabilityViewModel[];
        borrowerLiabilities?: srv.IBorrowerLiabilities[];
        collections?: srv.ILiabilityViewModel[];
        initializeCredit?: () => void;
        OccupancyType?: srv.PropertyUsageTypeEnum;
        OwnershipPercentage?: number;
        //processSubjectPropertyAndCurrentAddressRules? (isSameAsSubjectProperty?: boolean);
        areSixPiecesOfLoanApplicationCompleted?: () => boolean;
        loanApplicationCompleted?: boolean;
        isLoanApplicationCompleted? (subjectProperty: srv.IPropertyViewModel, loanType: number, loanAmount: number, coBorrowerAddressDifferent: boolean, downPaymentTypeCode: number, isSixPieceCompletedForCurrentApp: boolean): boolean;
        borrowerLookupList?: ILookupItem[];
        getBorrower? (): IBorrowerViewModel;
        setBorrower? (borrower: IBorrowerViewModel): void;
        getCoBorrower? (): IBorrowerViewModel;
        setCoBorrower? (coBorrower: IBorrowerViewModel): void;
        isSnoozed?: boolean;
        incrementSnoozeOrder? (): void;
    }

    export interface IMiscellaneousDebtViewModel {
        isDefaultValue?: boolean;
    }
}

module cls {

    export enum CollectionType {
        BORROWERS_COLLECTION = 0,
        COBORROWERS_COLLECTION = 1,
        JOINTACCOUNT_COLLECTION = 2,
    }
    export class LoanApplicationViewModel extends srv.cls.LoanApplicationViewModel {
        // @todo-cl: fwk/lib-ize
        private ticb: ITransactionInfoCallback;
        public isSnoozed: boolean;

        private hasTransactionInfo = (): boolean => {
            return (!!this.ticb && !!this.ticb());
        }
        public getTransactionInfo = (): cls.TransactionInfo => {
            if (this.hasTransactionInfo())
                return this.ticb();
            else
                return null;
        }
        public setTransactionInfo = (ti: cls.TransactionInfo): void => {
            this.ticb = () => ti;
        }

        /**
        * @desc Increments the snooze order.
        */
        public incrementSnoozeOrder = (): void => {
            this.snoozeOrder += 1;
            this.isSnoozed = true;
        }

        //
        private hasTransactionalInfoBorrower = (): boolean => {
            return this.hasTransactionInfo() && !!this.getTransactionInfo().borrower;
        }
        private getTransactionInfoBorrower = (): Map<srv.IBorrowerViewModel> => {
            if (this.hasTransactionalInfoBorrower()) {
                return this.getTransactionInfo().borrower;
            }
            return new Map<srv.IBorrowerViewModel>();
        }

        // 
        private getBorrowerOrCoBorrower = (isCoBorrower: boolean): cls.BorrowerViewModel => {
            if (this.hasTransactionalInfoBorrower()) {
                var itemBorrower = lib.findFirst(this.getTransactionInfoBorrower().getValues(),
                    o => o.loanApplicationId == this.loanApplicationId && o.isCoBorrower == isCoBorrower);
                return <cls.BorrowerViewModel>itemBorrower;
            }
            return null;
        }

        private setBorrowerOrCoBorrower = (borrower: cls.BorrowerViewModel): void => {
            // @todo-cl:
            //      Deal with lazy instantiate , for example ; this should not need be done here , every loan app should have 2 borrowers:
            //          return <cls.BorrowerViewModel>(this.borrower ? this.borrower : (this.Borrower = new cls.BorrowerViewModel(this.loanCallBack, null)));

            if (!!borrower && this.hasTransactionalInfoBorrower()) {
                var be = this.getBorrowerOrCoBorrower(borrower.isCoBorrower);
                if (!!be) {
                    this.getTransactionInfoBorrower().remove(be);
                }

                borrower.loanApplicationId = this.loanApplicationId;
                this.getTransactionInfoBorrower().map(borrower);
            }
        }

        getBorrower = (): cls.BorrowerViewModel => {
            return this.getBorrowerOrCoBorrower(false);
        }

        setBorrower = (borrower: cls.BorrowerViewModel) => {
            borrower.isCoBorrower = false;
            this.setBorrowerOrCoBorrower(borrower);
        }

        public bindBorrower = (b: cls.BorrowerViewModel): cls.BorrowerViewModel => {
            if (angular.isDefined(b)) {
                this.setBorrower(b);
            }
            return this.getBorrower();
        }

        getCoBorrower = (): cls.BorrowerViewModel => {
            return this.getBorrowerOrCoBorrower(true);            
        }

        setCoBorrower = (coBorrower: cls.BorrowerViewModel) => {
            coBorrower.isCoBorrower = true;
            this.setBorrowerOrCoBorrower(coBorrower);
        }

        public bindCoBorrower = (b: cls.BorrowerViewModel): cls.BorrowerViewModel => {
            if (angular.isDefined(b)) {
                this.setCoBorrower(b);
            }
            return this.getCoBorrower();
        }

        loanPurposeType: number;
        subjectProperty: srv.IPropertyViewModel;
        originalCurrentAddress: srv.IPropertyViewModel;
        getPrimaryAppOccupancyType = () => srv.PropertyUsageTypeEnum.None;

        excludeProperties = ['isLicensedStates', 'propertyId', 'counties', 'states', 'isAddressEqual', 'isEmpty', 'initialize', 'addressTypeId', 'countyName'];
        ///        isCreditRunning: boolean = false;
        occupancyType: srv.PropertyUsageTypeEnum;

        publicRecords: srv.IList<srv.IPublicRecordViewModel>;
        reos: srv.ILiabilityViewModel[];
        borrowerLiabilities: srv.IBorrowerLiabilities[];

        constructor(ti?: TransactionInfo, loanApplication?: srv.ILoanApplicationViewModel) {
            super();

            if (!!loanApplication)
                lib.copyState(loanApplication, this);

            if (!this.loanApplicationId || this.loanApplicationId == lib.getEmptyGuid()) {
                this.loanApplicationId = util.IdentityGenerator.nextGuid();
            }
            
            if (!!ti) {
                this.setTransactionInfo(ti);
                ti.loanApplication.map(this);
            }

            this.initialize(loanApplication);
        }

        set OccupancyType(value: srv.PropertyUsageTypeEnum) {
            this.occupancyType = value;

            // Set FHA flag if not investment property.
            if (this.isPrimary) {
                var loan = this.getTransactionInfo().getLoan();
                if (loan && loan.fhaScenarioViewModel && value != srv.PropertyUsageTypeEnum.InvestmentProperty) {
                    loan.fhaScenarioViewModel.isPropertyAdjacent = false;
                }
            }

            // @todo-cl::PROPERTY-ADDRESS
            //this.processSubjectPropertyAndCurrentAddressRules();
        }
        get OccupancyType(): srv.PropertyUsageTypeEnum {            
            return this.occupancyType;
        }    

        getTotalAssetsAmount = (): number => {
            var total = 0;
            var assets = this.getBorrower().assets.concat(this.getCoBorrower().assets);

            for (var i = 0; i < assets.length; i++) {
                if (!assets[i].isRemoved && !assets[i].isDownPayment && assets[i].monthlyAmount) {
                    total += parseFloat(String(assets[i].monthlyAmount));
                }
            }

            return total;
        }

        //region -  LoanApplication flags
        private _groupedLiabilities: any;
        get groupedLiabilities() {
            if (!this._groupedLiabilities) {
                this._groupedLiabilities = this.getGroupedLiabilities();
        }
            return this._groupedLiabilities;
        }
        set groupedLiabilities(groupedLiabilities: any) {
            this._groupedLiabilities = groupedLiabilities;
        }

        loanApplicationCompleted: boolean;

        //Personal tab flags
        howDidYouHearAboutUsEnabled: boolean;
        isSpouseOnTheLoanSelected: boolean;
        isSwitchBorrowerCoBorrowerShown: boolean;
        isBorrowerSectionShown: boolean;
        isCoBorrowerSectionShown: boolean;
        isTitleSectionShown: boolean;
        showNamesAndManner: boolean;
        switchCoBorrowerToBorrower: boolean;
        isFirstAndLastNameEnteredForBorrowers: boolean;
        miscDebts: srv.IMiscellaneousDebtViewModel[];

        /**
        * @desc Get Reo items totals
        */
        get getReoEstimatedValueTotal(): number {
            var total = 0;

            angular.forEach(this.getCombinedPledgedAssets(), function (reoItem) {
                if (!reoItem.notMyLoan && reoItem.borrowerDebtCommentId != srv.pledgedAssetCommentType.Duplicate && !reoItem.isRemoved && reoItem.getProperty() && reoItem.getProperty().currentEstimatedValue &&
                    (!reoItem.lienPosition || reoItem.lienPosition == -1 || reoItem.lienPosition == 1)) {
                    var amount = parseFloat(reoItem.getProperty().currentEstimatedValue.toString());
                    if (!amount || isNaN(amount))
                        amount = 0;
                    total += parseFloat(String(amount));
                }
            });

            return total;
        }

        // @todo-cl::PROPERTY-ADDRESS
        //processSubjectPropertyAndCurrentAddressRules = (isSameAsSubjectProperty?: boolean): void => {
        //    // For purchase - When Occupancy type = "Primary Residence", "Investment" or "Second/Vacation Home", the "Same as Subject Property" checkbox will be UNCHECKED
        //    // For refinance -  When Occupancy type = "Primary Residence", the "Same as Subject Property" checkbox will be CHECKED.
        //    var refinancingPrimaryResidence = this.loanCallBack().loanPurposeType == srv.LoanPurposeTypeEnum.Refinance && this.occupancyType == srv.PropertyUsageTypeEnum.PrimaryResidence;
        //    var subjectProperty = this.loanCallBack().getSubjectProperty();

        //    if (isSameAsSubjectProperty == null || isSameAsSubjectProperty == undefined)
        //        isSameAsSubjectProperty = refinancingPrimaryResidence;
        //}        

        private filterPropertiesByAddressTypeId = (borrower: srv.IBorrowerViewModel): srv.IPropertyViewModel[]=> {
            return borrower.reoPropertyList.filter(function (item) { return item.addressTypeId == borrower.getCurrentAddress().addressTypeId; });
        }
        private filterPropertiesByAddressId = (borrower: srv.IBorrowerViewModel): srv.IPropertyViewModel[]=> {
            return borrower.reoPropertyList.filter(function (item) { return item.propertyId == borrower.getCurrentAddress().propertyId; });
        }

        /**
       * @desc Get Liabilites totals
       */
        getLiabilitesBalanceTotal = (borrower?: srv.IBorrowerViewModel): number => {

            var list: srv.ILiabilityViewModel[];

            if (!borrower)
                list = this.getCombinedLiability();
            else
                list = this.getLiabilitiesForBorrower(borrower);

            var total = 0;

            angular.forEach(list, function (liability) {
                if (liability.includeInLiabilitiesTotal && !liability.isRemoved && liability.unpaidBalance) {
                    var amount = parseFloat(liability.unpaidBalance.toString());
                    if (!amount || isNaN(amount))
                        amount = 0;
                    total += parseFloat(String(amount));
                }
            });

            return total;
        }


        getLiabilitesPaymentTotal(borrower?: srv.IBorrowerViewModel): number {

            var list: srv.ILiabilityViewModel[];

            if (!borrower)
                list = this.getCombinedLiability();
            else
                list = this.getLiabilitiesForBorrower(borrower);

            var total = 0;

            angular.forEach(list, function (liability) {
                if (liability.includeInDTI && !liability.isRemoved && liability.minPayment) {
                    var amount = parseFloat(String(liability.minPayment));
                    if (!amount || isNaN(amount))
                        amount = 0;
                    total += parseFloat(String(amount));
                }
            });

            return total;
        }

        /**
       * @desc Get Collections totals
       */
        getCollectionsTotalUnpaidBalance() {

            var total = 0;

            angular.forEach(this.getCombinedCollections(), function (collection) {
                if (collection.includeInLiabilitiesTotal && !collection.isRemoved && collection.unpaidBalance) {
                    var amount = parseFloat(collection.unpaidBalance.toString());
                    if (!amount || isNaN(amount))
                        amount = 0;
                    total += parseFloat(String(amount));
                }
            });

            return total;
        }

        getCollectionsTotalPayment() {

            var total = 0;

            angular.forEach(this.getCombinedCollections(), function (collection) {
                if (collection.includeInLiabilitiesTotal && !collection.isRemoved && collection.minPayment) {
                    var amount = parseFloat(collection.minPayment.toString());
                    if (!amount || isNaN(amount))
                        amount = 0;
                    total += parseFloat(String(amount));
                }
            });

            return total;
        }

        /**
        * @desc Get Public Records totals
        */
        getPublicRecordsTotalAmount = (): number => {

            var total = 0;

            angular.forEach(this.getCombinedPublicRecords(), function (publicRecord) {

                var amount = parseFloat(String(publicRecord.amount));
                // 4 Payoff at close comment
                if (!amount || isNaN(amount) || publicRecord.publicRecordComment == '4')
                    amount = 0;
                total += parseFloat(String(amount));
            });

            return total;
        }

        /** 
        * @desc Combines borrower and coborrower property list into one. Watch out for duplicates!
        */
        getCombinedReoPropertyList = () => {
            return this.getBorrower().reoPropertyList.concat(this.getCoBorrower().reoPropertyList);
        }

        private isResidenceValidForReoList = (borrower: srv.IBorrowerViewModel): boolean => {
            if (!borrower)
                return false;

            var addr = borrower.getCurrentAddress();
            if (!addr)
                return false;

            if (addr.ownership != srv.OwnershipStatusTypeEnum.Own)
                return false;
            if (addr.isSameAsPropertyAddress)
                return false;
            if (borrower.isCoBorrower && addr.isSameAsPrimaryBorrowerCurrentAddress)
                return false;

            return true;
        }

        getUniqueProperties = (getSubjectPropertiesForPurchase?: boolean) => {
            var loan = this.getTransactionInfo().getLoan();
            var reoPropertyList = [];

            // subject property
            if (loan.loanPurposeType == srv.LoanPurposeTypeEnum.Refinance || getSubjectPropertiesForPurchase) {
                reoPropertyList.push(loan.getSubjectProperty());
            }

            // residences
            // @todo-cc: User linqjs ...
            var residences: srv.IPropertyViewModel[] = [];
            if (this.isResidenceValidForReoList(this.getBorrower()))
                residences.push(this.getBorrower().getCurrentAddress());
            if (this.isResidenceValidForReoList(this.getCoBorrower()))
                residences.push(this.getCoBorrower().getCurrentAddress());
            reoPropertyList = reoPropertyList.concat(residences);

            // REO's
            // @todo-cl: Review for use of Property Usage Type @RealEstate
            var allReoProperties = lib.filter(loan.getPropertyMap().getValues(),
                p => !p.isSubjectProperty && p.addressTypeId == srv.AddressType.RealEstate && p.loanApplicationId == this.loanApplicationId );
            allReoProperties = lib.filter(allReoProperties, o => !lib.findFirst(reoPropertyList, p => o.isAddressEqual(p)));
            reoPropertyList = reoPropertyList.concat(allReoProperties);

            //
            reoPropertyList = lib.filter(reoPropertyList, o => (!!o.streetName && !!o.cityName && !!o.stateName));
            return reoPropertyList;
        }

        getAllProperties = (): srv.IPropertyViewModel[] => {
            var loan = this.getTransactionInfo().getLoan();
            var subjProp = <PropertyViewModel>loan.getSubjectProperty();

            return lib.filter(this.getTransactionInfo().property.getValues(), p => p.loanApplicationId == this.loanApplicationId).concat([subjProp]);
        }

        /** 
        * @desc Misc Expanses total calculation
        */
        getMiscExpensesTotal = (): number => {

            var total = 0,
                miscExpanses = this.getCombinedMiscDebts();

            for (var i = 0; i < miscExpanses.length; i++) {
                if (!miscExpanses[i].isRemoved && miscExpanses[i].amount) {
                    total += parseFloat(String(miscExpanses[i].amount));
                }
            }

            return total;
        }

        //end region -LoanApplication flags

        //get TitleInfo(): srv.cls.TitleInformationViewModel {
        //    return (this.titleInfo ? this.titleInfo : (this.titleInfo = new srv.cls.TitleInformationViewModel()));
        //}
        //set TitleInfo(newTitleInfo: srv.cls.TitleInformationViewModel) {
        //    this.titleInfo = newTitleInfo;
        //}

        //get MiscDebts(): cls.LiabilityViewModel[] {
        //    return <cls.LiabilityViewModel[]>(this.miscDebts ? this.miscDebts : (this.miscDebts = []));
        //}
        //set MiscDebts(newMiscDebt: cls.LiabilityViewModel[]) {
        //    this.miscDebts = newMiscDebt;
        //}

        collections: srv.ILiabilityViewModel[];
        //get Collections(): srv.ILiabilityViewModel[]{
        //    return (this.collections ? this.collections : (this.collections = []));
        //}
        //set Collections(newCollections: srv.ILiabilityViewModel[]) {
        //    this.collections = newCollections;
        //}

        //get RealEstate(): srv.cls.RealEstateViewModel {
        //    return (this.realEstate ? this.realEstate : (this.realEstate = new srv.cls.RealEstateViewModel()));
        //}
        //set RealEstate(newRealEstate: srv.cls.RealEstateViewModel) {
        //    this.realEstate = newRealEstate;
        //}

        //get Credit(): srv.cls.CreditViewModel {
        //    return <srv.cls.CreditViewModel>(this.credit ? this.credit : (this.credit = new srv.cls.CreditViewModel()));
        //}
        //set Credit(newCredit: srv.cls.CreditViewModel) {
        //    this.credit = newCredit;
        //}

        //get Declarations(): srv.cls.DeclarationViewModel {
        //    return (this.declarations ? this.declarations : (this.declarations = new srv.cls.DeclarationViewModel()));
        //}
        //set Declarations(newDeclaration: srv.cls.DeclarationViewModel) {
        //    this.declarations = newDeclaration;
        //}

        //get AppraisedValueHistories(): srv.IAppraisedValueHistoryItemViewModel[] {
        //    return (this.appraisedValueHistories ? this.appraisedValueHistories : (this.appraisedValueHistories = []));
        //}
        //set AppraisedValueHistories(newAppraisedValueHistories: srv.IAppraisedValueHistoryItemViewModel[]) {
        //    this.appraisedValueHistories = newAppraisedValueHistories;
        //}

        /*
        * @desc Handles joint liablities with co-borrower
        */
        handleJointWithCoBorrowerLiability = (originalItem: srv.ILiabilityViewModel): void => {
            var childItem = this.getChildItemFromLiabilityLists(originalItem);

            if (!childItem)
                return;

            childItem.companyData = originalItem.companyData;
            childItem.debtType = originalItem.debtType;
            childItem.accountNumber = originalItem.accountNumber;
            childItem.monthsLeft = originalItem.monthsLeft;
            childItem.unpaidBalance = originalItem.unpaidBalance;
            childItem.minPayment = originalItem.minPayment;
            childItem.debtCommentId = originalItem.debtCommentId;
        }

        /*
        * @desc Physically deletes parent liability from list
        */
        deleteLiability = (liability: srv.ILiabilityViewModel): void => {

            throw new Error("loanApplication::deleteLiability() is OBSOLETE");

            //this.deleteFromCollection(liability, this.getBorrower().Liabilities, this.getCoBorrower().Liabilities);

            //var childItem = this.getChildItemFromLiabilityLists(liability);

            //if (!childItem)
            //    return;
            //this.removeFromCollection(childItem, this.getBorrower().getLiabilities(), this.getCoBorrower().getLiabilities());
        }

        /*
        * @desc Sets isRemoved flag to true for item(s) from liabilites
        */
        removeLiablity = (liability: srv.ILiabilityViewModel): void => {

            throw new Error("loanApplication::removeLiablity() is OBSOLETE");

            //this.removeFromCollection(liability, this.getBorrower().getLiabilities(), this.getCoBorrower().getLiabilities());

            //var childItem = this.getChildItemFromLiabilityLists(liability);

            //if (!childItem)
            //    return;
            //this.removeFromCollection(childItem, this.getBorrower().getLiabilities(), this.getCoBorrower().getLiabilities());
        }

        private getChildItemFromLiabilityLists = (originalItem: srv.ILiabilityViewModel): srv.ILiabilityViewModel => {
            for (var i = 0; i < this.getBorrower().getLiabilities().length; i++) {
                if (this.getBorrower().getLiabilities()[i].originalClientId === originalItem.clientId)
                    return this.getBorrower().getLiabilities()[i];
            }
            for (var i = 0; i < this.getCoBorrower().getLiabilities().length; i++) {
                if (this.getCoBorrower().getLiabilities()[i].originalClientId === originalItem.clientId)
                    return this.getCoBorrower().getLiabilities()[i];
            }
            return null;
        }

        areSixPiecesOfLoanApplicationCompleted = (): boolean => {
            return this.isPersonalPieceAcquired() && this.isIncomePieceAcquired();            
        }

        /**
        * @desc Validates whether Loan Applications requeired fields are completed
        */
        isLoanApplicationCompleted = (subjectProperty: srv.IPropertyViewModel, loanType: number, loanAmount: number, coBorrowerAddressDifferent: boolean, downPaymentTypeCode: number, isSixPieceCompletedForCurrentApp: boolean): boolean => {
            this.isCompleted = this.isPersonalCompleted() && this.isPropertyCompleted(subjectProperty, loanType, loanAmount, coBorrowerAddressDifferent, downPaymentTypeCode) && this.isAssetsCompleted() && this.isCreditTabCompleted(isSixPieceCompletedForCurrentApp) && this.isDeclarationsCompleted() && this.isIncomeCompleted();
            return this.isCompleted;
        }

        /**
        * @desc Validates Personal tab for active Loan Application
        */
        isPersonalCompleted = (): boolean => {

            if (!this.validatePersonalCompletedForBorrower(this.getBorrower()) ||
                (this.titleInfo.titleHeldIn == 0 && (common.string.isNullOrWhiteSpace(this.titleInfo.namesOnTitle) ||
                    !(this.titleInfo.mannerTitleHeld && this.titleInfo.mannerTitleHeld != '-1'))) ||
                common.string.isNullOrWhiteSpace(this.howDidYouHearAboutUs) ||
                (this.getCoBorrower() && this.isSpouseOnTheLoan && !this.validatePersonalCompletedForBorrower(this.getCoBorrower())) ||
                (!this.isSpouseOnTheLoan && this.getBorrower().maritalStatus.toString() == '0' && common.string.isNullOrWhiteSpace(this.titleInfo.nameOfPartner)))
                return false;

            return true;
        }
        /**
        * @desc Validates if 1st and 2nd piece of 6 pieces is acquired.
        */
        isPersonalPieceAcquired = (): boolean => {
            var retVal: boolean = false;

            retVal = this.validatePersonalPieceForBorrower(this.getBorrower());

            if (this.getCoBorrower() && this.isSpouseOnTheLoan)
                retVal = retVal && this.validatePersonalPieceForBorrower(this.getCoBorrower());

            return retVal;
        }

        private validatePersonalPieceForBorrower = (borrower: srv.IBorrowerViewModel): boolean => {
            return (this.isBorrowerFirstAndLastNameEntered(borrower) && !!borrower.ssn);
        }

        private isBorrowerFirstAndLastNameEntered = (borrower: srv.IBorrowerViewModel): boolean => {
            return !common.string.isNullOrWhiteSpace(borrower.firstName) && !common.string.isNullOrWhiteSpace(borrower.lastName);
        }


        isValidForSave = (): boolean => {

            if (this.isSpouseOnTheLoan)
                return this.isBorrowerFirstAndLastNameEntered(this.getBorrower()) && this.isBorrowerFirstAndLastNameEntered(this.getCoBorrower());

            return this.isBorrowerFirstAndLastNameEntered(this.getBorrower());
        }

        private validatePersonalCompletedForBorrower = (borrower: srv.IBorrowerViewModel): boolean => {

            var emailProvided = (borrower.userAccount.isOnlineUser && !common.string.isNullOrWhiteSpace(borrower.userAccount.username)) || !borrower.userAccount.isOnlineUser;

            var usCitizenIndicatorProvided = borrower.usCitizen || borrower.permanentAlien;

            var yearsAgo = moment().diff(moment(borrower.dateOfBirth), 'years');

            return (this.validatePersonalPieceForBorrower(borrower) && emailProvided && usCitizenIndicatorProvided &&
                !common.string.isNullOrWhiteSpace(borrower.preferredPhone.number) && borrower.yearsOfSchool && borrower.yearsOfSchool != 0 &&
                borrower.dateOfBirth && yearsAgo >= 18 && (borrower.maritalStatus || borrower.maritalStatus == 0) && borrower.maritalStatus.toString() != '-1');
        }

        /**
        * @desc Returns correct color for chekc
        */
        getCheckColor = (tabCompleted: boolean, sixPiecesCompleted: boolean): string => {
            if (tabCompleted)
                return "#49E88A"; //green
            else if (sixPiecesCompleted)
                return "#ef1126 "; //red            
        }

        isCheckAvailable = (tabCompleted: boolean, sixPiecesCompleted: boolean): boolean => {
            return !(!tabCompleted && !sixPiecesCompleted);
        }

        /**
        * @desc Validates Property tab for active Loan Application
        */
        isPropertyCompleted = (subjectProperty: srv.IPropertyViewModel, loanType: number, loanAmount: number, coBorrowerAddressDifferent: boolean, downPaymentTypeCode?: number): boolean => {
            var result: boolean;

            result = this.isSubjectPropertySectionCompleted(subjectProperty, loanType, loanAmount, downPaymentTypeCode) && this.isBorrowerCoBorrowerAddressSectionsCompleted(this.getBorrower());
            if (coBorrowerAddressDifferent && this.isSpouseOnTheLoan) {
                result = result && this.isBorrowerCoBorrowerAddressSectionsCompleted(this.getCoBorrower());
            }

            return result;
        }

        updateOccupancyTypeForSubjectPropertyPledgeAssets = (): void => {
            var subjectPropertyPledgeAssets = this.getCombinedPledgedAssets().filter(e => { return e.getProperty().isSubjectProperty });
            for (var i = 0; i < subjectPropertyPledgeAssets.length; i++) {
                subjectPropertyPledgeAssets[i].getProperty().occupancyType = this.occupancyType;
            }
        }

        /**
        * @desc Validates Assets tab for active Loan Application
        */
        isAssetsCompleted = (): boolean => {
            var financilas = this.getCombinedAssetsFinancials();

            if (financilas.length != 0) {
                for (var i = 0; i < financilas.length; i++) {
                    if ((!common.string.isNullOrWhiteSpace(financilas[i].accountNumber) && !common.string.isNullOrWhiteSpace(financilas[i].institiutionContactInfo.companyName)
                        && financilas[i].monthlyAmount && financilas[i].monthlyAmount != 0) || financilas[i].assetType == srv.AssetTypeEnum.NotRequired) {
                        return true;
                    }
                }
            }

            return false;
        }

        /**
        * @desc Validates Credit tab for active Loan Application
        */
        isCreditTabCompleted = (areSixPiecesCompleted: boolean): boolean => {

            if (!this.credit || !this.credit.isCreditReportValid())
                return false;

            var realEstates = this.getCombinedPledgedAssets();

            // if there ARE realEstates
            if (realEstates.length) {
                for (var i = 0; i < realEstates.length; i++) {
                    if (!realEstates[i].isValid())
                        return false;
                }
                return true;
            }

            return true; //if credit report is valid, and no REO items are retrieved
        }


        /**
        * @desc Validates Declarations tab for active Loan Application
        */
        isDeclarationsCompleted = (): boolean => {
            var result = this.isBorrowerDecalarationsCompleted(this.getBorrower());

            if (this.isSpouseOnTheLoan)
                result = result && this.isBorrowerDecalarationsCompleted(this.getCoBorrower());

            return result;
        }

        /**
        * @desc Validates Income tab for active Loan Application
        */
        isIncomeCompleted = (): boolean => {
            var retVal = this.isBorrowerIncomeCompleted(this.getBorrower());
            if (this.isSpouseOnTheLoan)
                retVal = retVal && this.isBorrowerIncomeCompleted(this.getCoBorrower());
            return retVal;
        }

        isBorrowerIncomeCompleted = (borrower: srv.IBorrowerViewModel): boolean => {
            var combinedIncomes = borrower.getCombinedCurrentAndAdditionalEmployments();
            if (!combinedIncomes || !combinedIncomes.length) {
                return false;
            }
            var retVal = true;
            var otherIncomes = this.getTransactionInfo().incomeInfo.getValues().filter(function (i) {
                return (i.borrowerId == borrower.borrowerId)
            });
            for (var i in combinedIncomes) {
                retVal = retVal && combinedIncomes[i].isCompleted();
            }
            if (borrower.getCurrentEmploymentInfo().EmploymentTypeId == srv.EmploymentType.Retired || borrower.getCurrentEmploymentInfo().EmploymentTypeId == srv.EmploymentType.OtherUnemployed)
                retVal = retVal && this.validateRetiredAndUnemployedEmploymentTypes(borrower, otherIncomes);
          

            return retVal;
        }

        validateRetiredAndUnemployedEmploymentTypes = (borrower: srv.IBorrowerViewModel, otherIncomes: srv.IIncomeInfoViewModel[]): boolean => {
            if (borrower.getCurrentEmploymentInfo().EmploymentTypeId == srv.EmploymentType.Retired)
                return (otherIncomes.filter((income) => { return !income.isRemoved && (income.amount != 0); }).length > 0) ? true : false;
            return true;
        }

        /**
        * @desc Validates if 6th piece of 6 pieces is acquired.
        */
        isIncomePieceAcquired = (): boolean => {
            var retVal: boolean = false;

            retVal = this.validateIncomePieceForBorrower(this.getBorrower());

            if (this.getCoBorrower() && this.isSpouseOnTheLoan)
                retVal = retVal && this.validateIncomePieceForBorrower(this.getCoBorrower());

            return retVal;
        }

        private validateCreditTabForBorrower = (borrower: srv.IBorrowerViewModel): boolean => {
            //todo: fix - add realestate items list, remove reoproperty list
            if (borrower.reoPropertyList && borrower.reoPropertyList.length > 0) {
                for (var key in borrower.reoPropertyList) {
                    if (!this.validateRealEstateItem(borrower.reoPropertyList[key]))
                        return false;
                }
            }
            return true;
        }

        private validateRealEstateItem = (reoPropertyItem: srv.IPropertyViewModel): boolean => {
            return true;
        }

        private validateIncomePieceForBorrower = (borrower: srv.IBorrowerViewModel): boolean => {
            var hasOtherIncomes = this.getTransactionInfo().incomeInfo.getValues().filter(function (i) {
                return (i.borrowerId == borrower.borrowerId && !i.isRemoved && !!i.amount)}).length > 0;

            if (!borrower.getCurrentEmploymentInfo())
                return false;

            return borrower
                && borrower.getCurrentEmploymentInfo()
                && borrower.getCurrentEmploymentInfo().getIncomeInformation()
                && borrower.getCurrentEmploymentInfo().getIncomeInformation().length > 0

                &&
                (borrower.getCurrentEmploymentInfo().EmploymentTypeId == srv.EmploymentType.ActiveMilitaryDuty
                && borrower.getCurrentEmploymentInfo().incomeInfoByTypeId(11)
                && borrower.getCurrentEmploymentInfo().incomeInfoByTypeId(11).amount != 0)

                || (borrower.getCurrentEmploymentInfo().EmploymentTypeId == srv.EmploymentType.SelfEmployed
                && (borrower.getCurrentEmploymentInfo().incomeInfoByTypeId(16)
                && borrower.getCurrentEmploymentInfo().incomeInfoByTypeId(16).amount != 0
                || borrower.getCurrentEmploymentInfo().incomeInfoByTypeId(13)
                    && borrower.getCurrentEmploymentInfo().incomeInfoByTypeId(13).amount != 0))

                || (borrower.getCurrentEmploymentInfo().EmploymentTypeId == srv.EmploymentType.SalariedEmployee
                && (borrower.getCurrentEmploymentInfo().incomeInfoByTypeId(0)
                && borrower.getCurrentEmploymentInfo().incomeInfoByTypeId(0).amount != 0
                || borrower.getCurrentEmploymentInfo().incomeInfoByTypeId(13)
                    && borrower.getCurrentEmploymentInfo().incomeInfoByTypeId(13).amount != 0))

                || ((borrower.getCurrentEmploymentInfo().EmploymentTypeId == srv.EmploymentType.Retired) && hasOtherIncomes)

                || (borrower.getCurrentEmploymentInfo().EmploymentTypeId == srv.EmploymentType.OtherUnemployed);

        }


        private areFieldsEntered = (borrower: srv.IBorrowerViewModel): boolean => {
            return common.string.isNullOrWhiteSpace(borrower.firstName) || common.string.isNullOrWhiteSpace(borrower.lastName);
        }
        /**
        * @desc Returns flag whether tabs, other than Personal, are disabled
        */
        areTabsDisabled = (): boolean => {
            return (this.isSpouseOnTheLoan ? (this.areFieldsEntered(this.getBorrower()) || this.areFieldsEntered(this.getCoBorrower())) : this.areFieldsEntered(this.getBorrower()));
        }

        /**
        * @desc Gets misc debts combined into one array, for the borrower and coBorrower.
        */
        getCombinedMiscDebts = (): srv.IMiscellaneousDebtViewModel[]=> {
            //
            //if (this.isSpouseOnTheLoan)
            //    return this.getMiscDebtsForBorrower(this.getBorrower()).concat(this.getMiscDebtsForBorrower(this.getCoBorrower()));
            //else
            //    return this.getMiscDebtsForBorrower(this.getBorrower());

            //
            var rslt: srv.IMiscellaneousDebtViewModel[] = [];
            var b: BorrowerViewModel;

            if (!!(b = this.getBorrower()))
                rslt = rslt.concat(this.getMiscDebtsForBorrower(b));

            if (this.isSpouseOnTheLoan && !!(b = this.getCoBorrower()))
                rslt = rslt.concat(this.getMiscDebtsForBorrower(b));

            return rslt;
        }

        /**
        * @desc Gets collections combined into one array, for the borrower and coBorrower.
        */
        getCombinedCollections = (): srv.ILiabilityViewModel[]=> {
            if (this.isSpouseOnTheLoan)
                return this.getCollectionsForBorrower(this.getBorrower()).concat(this.getCollectionsForBorrower(this.getCoBorrower()));
            else
                return this.getCollectionsForBorrower(this.getBorrower());
        }

        getAllLiabilitiesCombined = (): srv.IList<srv.ILiabilityViewModel> => {
            var liabilities = this.getBorrower().getLiabilities();
            if (this.isSpouseOnTheLoan)
                liabilities = liabilities.concat(this.getCoBorrower().getLiabilities());

            return liabilities;
        }


        /**
        * @desc Gets liabilities combined into one array, for the borrower and coBorrower.
        */
        getCombinedLiability = (): srv.ILiabilityViewModel[]=> {
            if (this.isSpouseOnTheLoan)
                return this.getLiabilitiesForBorrower(this.getBorrower()).concat(this.getLiabilitiesForBorrower(this.getCoBorrower()));
            else
                return this.getLiabilitiesForBorrower(this.getBorrower());
        } 

        /**
        * @desc Gets liabilities combined into one object, for the borrower and coBorrower.
        */
        getGroupedLiabilities = (): any => {
            return {
                'Borrower': this.getLiabilitiesForBorrower(this.getBorrower()),
                'Co-Borrower': this.isSpouseOnTheLoan ? this.getLiabilitiesForBorrower(this.getCoBorrower()) : null
            };
        }

        refreshLiabilityLists = (): void => {
            //var borrowerList = this.getBorrower().getLiabilities().filter((item) => { return item.borrowerId == this.getBorrower().borrowerId });
            //var coBorrowerListInBorrower = this.getBorrower().getLiabilities().filter((item) => { return item.borrowerId == this.getCoBorrower().borrowerId });
            //var coBorrowerList = this.getCoBorrower().getLiabilities().filter((item) => { return item.borrowerId == this.getCoBorrower().borrowerId });
            //var borrowerListInCoBorrower = this.getCoBorrower().getLiabilities().filter((item) => { return item.borrowerId == this.getBorrower().borrowerId });

            //refresh lists
            //this.getBorrower().Liabilities = borrowerList.concat(borrowerListInCoBorrower);
            //this.getCoBorrower().Liabilities = coBorrowerList.concat(coBorrowerListInBorrower);
        }

        /**
        * @desc Gets pledged assets combined into one array, for the borrower and coBorrower (if it is active on loan).
        */

        getCombinedPledgedAssets = (): srv.ILiabilityViewModel[]=> {

            var pred = l => !l.isRemoved && l.isPledged && !l.isSecondaryPartyRecord;

            var reos = lib.filter(this.getBorrower().getLiabilities(), pred);
            if (this.isSpouseOnTheLoan)
                reos = reos.concat(lib.filter(this.getCoBorrower().getLiabilities(), pred));

            return reos;
        }

        private combinedPublicRecordList: srv.IPublicRecordViewModel[];

        /**
        * @desc Gets public records combined into one array, for the borrower and coBorrower.
        */
        getCombinedPublicRecords = (): srv.IPublicRecordViewModel[]=> {

            if (this.combinedPublicRecordList == null) {
                if (this.isSpouseOnTheLoan)
                    this.combinedPublicRecordList = this.getPublicRecordsForBorrower(this.getBorrower()).concat(this.getPublicRecordsForBorrower(this.getCoBorrower()));
                else
                    this.combinedPublicRecordList = this.getPublicRecordsForBorrower(this.getBorrower());
            }
            return this.combinedPublicRecordList;
        }

        /**
        * @desc Moves the item under the borrower or coBorrower.
        */
        toggleBorrowerForItem = <T extends srv.IRemovable>(item: T, collectionOnBorrower: srv.ICollection<T>, collectionOnCoBorrower: srv.ICollection<T>, isJointAccount?: boolean, deleteFromList?: boolean): void => {
            var result = this.getProperCollection<T>(item, collectionOnBorrower, collectionOnCoBorrower);

            if (result) {
                if (result.collection === cls.CollectionType.BORROWERS_COLLECTION) {
                    if (!isJointAccount) {
                        common.moveItemTo(result.index, collectionOnBorrower, collectionOnCoBorrower);
                        this.handleToggleBorrowerForItem(collectionOnBorrower, result.index, deleteFromList);
                    }
                }
                else if (result.collection === cls.CollectionType.COBORROWERS_COLLECTION) {
                    common.moveItemTo(result.index, collectionOnCoBorrower, collectionOnBorrower);
                    this.handleToggleBorrowerForItem(collectionOnCoBorrower, result.index, deleteFromList);
                }
            }
        }

        private handleToggleBorrowerForItem = <T extends srv.IRemovable>(collection: srv.ICollection<T>, index: number, deleteFromList: boolean): void => {
            if (deleteFromList)
                common.deleteItem(index, collection);
            else
                collection[index].isRemoved = true;
        }

        switchBorrowerForMiscItem = (item: srv.IMiscellaneousDebtViewModel, collectionOnBorrower: srv.ICollection<srv.IMiscellaneousDebtViewModel>, collectionOnCoBorrower: srv.ICollection<srv.IMiscellaneousDebtViewModel>, isJointAccount?: boolean): void => {
            var newMisc = angular.copy(item);
            newMisc.miscellaneousDebtId = null;
            var index: number = common.indexOfItem(item, collectionOnBorrower);
            if (index != -1) {
                var borrowerMisc = collectionOnBorrower[index];
                borrowerMisc.isRemoved = true;
                collectionOnCoBorrower.push(newMisc)
            }

            var coIndex: number = common.indexOfItem(item, collectionOnCoBorrower);
            if (coIndex != -1) {
                var coBorrowerMisc = collectionOnCoBorrower[coIndex];
                coBorrowerMisc.isRemoved = true;
                collectionOnBorrower.push(newMisc)
            }

        }

        toggleLiabilitiesByDebtsAccountOwnershipType = (item: srv.ILiabilityViewModel, borrowerCol: srv.ICollection<srv.ILiabilityViewModel>, coBorrowerCol: srv.ICollection<srv.ILiabilityViewModel>, accountType: string): void  => {

            var itemInCollection = this.getProperCollection<srv.ILiabilityViewModel>(item, borrowerCol, coBorrowerCol);

            if (accountType) {

                if (itemInCollection.collection == cls.CollectionType.BORROWERS_COLLECTION)
                    common.deleteItem(common.indexOfItem(item, borrowerCol), borrowerCol);

                if (itemInCollection.collection == cls.CollectionType.COBORROWERS_COLLECTION)
                    common.deleteItem(common.indexOfItem(item, coBorrowerCol), coBorrowerCol);

                switch (parseInt(accountType)) {
                    case srv.DebtsAccountOwnershipType.Joint:
                        borrowerCol.push(item);
                        break;
                    case srv.DebtsAccountOwnershipType.Borrower:
                    case srv.DebtsAccountOwnershipType.BorrowerWithOther:
                        borrowerCol.push(item);
                        break;
                    case srv.DebtsAccountOwnershipType.CoBorrower:
                    case srv.DebtsAccountOwnershipType.CoBorrowerWithOther:
                        coBorrowerCol.push(item);
                        break;
                    default:
                        borrowerCol.push(item);
                        break;
                }
            }
        }

        /**
        * @desc Physically deletes provided item from any provided list
        */
        deleteFromCollection = <T>(item: T, borrowersCollection: srv.ICollection<T>, coBorrowersCollection: srv.ICollection<T>): void => {
            var result = this.getProperCollection<T>(item, borrowersCollection, coBorrowersCollection);
            if (result) {
                if (result.collection === cls.CollectionType.BORROWERS_COLLECTION) {
                    common.deleteItem(result.index, borrowersCollection);
                }
                else if (result.collection === cls.CollectionType.COBORROWERS_COLLECTION) {
                    common.deleteItem(result.index, coBorrowersCollection);
                }
            }
        }

        /**
        * @desc Sets isRemoved flag on item to true  for any provided collection
        */
        removeFromCollection = <T extends srv.IRemovable>(item: T, borrowersCollection: srv.ICollection<T>, coBorrowersCollection: srv.ICollection<T>): void => {
            var result = this.getProperCollection<T>(item, borrowersCollection, coBorrowersCollection);
            if (result) {
                if (result.collection === cls.CollectionType.BORROWERS_COLLECTION) {
                    borrowersCollection[result.index].isRemoved = true;
                }
                else if (result.collection === cls.CollectionType.COBORROWERS_COLLECTION) {
                    coBorrowersCollection[result.index].isRemoved = true;
                }
            }
        }

        /**
        * @desc Gets the assets combined into one array, for the borrower and coBorrower.
        */
        getCombinedAssetsCollection = (): srv.IAssetViewModel[]=> {
            return this.getCombinedAssets(this.getBorrower(), this.getCoBorrower());
        }

        /**
        * @desc Gets the assets automobiles combined into one array, for the borrower and coBorrower.
        */
        getCombinedAssetsAutomobiles = (): srv.IAssetViewModel[]=> {
            var automobilesFunction = this.getCombinedAutomobilesByBorrower;
            if (this.isSpouseOnTheLoan == true)
                return automobilesFunction(this.getBorrower()).concat(automobilesFunction(this.getCoBorrower()));
            return automobilesFunction(this.getBorrower());
        }

        /**
        * @desc Gets the assets financials combined into one array, for the borrower and coBorrower.
        */
        getCombinedAssetsFinancials = (): srv.IAssetViewModel[]=> {
            var financialsFunction = this.getCombinedFinancialsByBorrower;
            if (this.isSpouseOnTheLoan == true)
                return financialsFunction(this.getBorrower()).concat(financialsFunction(this.getCoBorrower()));
            return financialsFunction(this.getBorrower());
        }

        /**
        * @desc Gets the assets life insurenc combined into one array, for the borrower and coBorrower.
        */
        getCombinedAssetsLifeInsurence = (): srv.IAssetViewModel[]=> {
            var lifeInsurenceFunction = this.getCombinedLifeInsurenceByBorrower;
            if (this.isSpouseOnTheLoan == true)
                return lifeInsurenceFunction(this.getBorrower()).concat(lifeInsurenceFunction(this.getCoBorrower()));
            return lifeInsurenceFunction(this.getBorrower());
        }

        collapseExpand = (sectionName) => {

            switch (sectionName) {
                case 'BorrowerSection':
                    this.isBorrowerSectionShown = !this.isBorrowerSectionShown;
                    break;
                case 'CoBorrowerSection':
                    this.isCoBorrowerSectionShown = !this.isCoBorrowerSectionShown;
                    break;
                case 'TitleSection':
                    this.isTitleSectionShown = !this.isTitleSectionShown;
                    break;
            }

            //check if switch checkbox needs to be shown
            this.isSwitchBorrowerCoBorrowerShown = this.isCoBorrowerSectionShown && this.isSpouseOnTheLoan;
        }       

        //trigger marital status rules
        triggerMaritalStatusRules = () => {

            var sectionName = '';

            if (!this.getBorrower())
                return;

            switch (this.getBorrower().maritalStatus.toString()) {
                case '0': //Married
                    this.isSpouseOnTheLoan = true;
                    this.isSwitchBorrowerCoBorrowerShown = true;
                    this.isSpouseOnTheTitle = false;

                    if (!this.isCoBorrowerSectionShown) {
                        sectionName = 'CoBorrowerSection';
                    }
                    break;
                case '1': //Separated           
                    this.isSpouseOnTheLoan = false;
                    this.isSwitchBorrowerCoBorrowerShown = false;
                    if (!this.isCoBorrowerSectionShown) {
                        sectionName = 'CoBorrowerSection';
                    }
                    break;
                case '2': //Unmarried          
                    this.isSwitchBorrowerCoBorrowerShown = false;  
                    this.isSpouseOnTheLoan = false;
                    if (this.isCoBorrowerSectionShown) {
                        sectionName = 'CoBorrowerSection';
                    }
                    break;
                case '-1': //Select one
                    if (this.isCoBorrowerSectionShown) {
                        sectionName = 'CoBorrowerSection';
                    }
                    break;
                default:
                    if (this.isCoBorrowerSectionShown && !this.isSpouseOnTheLoan && !this.isSpouseOnTheTitle) {
                        sectionName = 'CoBorrowerSection';
                        this.isSwitchBorrowerCoBorrowerShown = true;
                    }
                    break;
            }

            this.collapseExpand(sectionName);
        }

        getUserAccountTooltipMessage = (userAccount: srv.IUserAccountViewModel, spouseUsername: string, isSpouseOnline: boolean, isSpouseActivated: boolean): string => {

            var tooltipMassage = "";

            if (userAccount.username && this.isSpouseOnTheLoan && userAccount.username == spouseUsername) {

                if (!userAccount.username)
                    return tooltipMassage += "Joint Offline - No eMail address";
                else if (!userAccount.isOnlineUser && !isSpouseOnline)
                    return tooltipMassage += "Joint  Offline - With eMail address";
                else if (!userAccount.isActivated && !isSpouseActivated)
                    return tooltipMassage += "Joint Online - Not Activated";
                else
                    return tooltipMassage += "Joint Online - Activated";
            } else {

                if (!userAccount.username)
                    return tooltipMassage += "Offline - No eMail address";
                else if (!userAccount.isOnlineUser)
                    return tooltipMassage += "Offline - With eMail address";
                else if (!userAccount.isActivated)
                    return tooltipMassage += "Online - Not Activated";
                else
                    return tooltipMassage += "Online - Activated";

            }
        } 

        //when spouse on the loan changes, update flags
        onIsSpouseOnTheLoanChange = (triggerTitleChange: boolean) => {

            if (this.isSpouseOnTheLoan) {
                this.isSwitchBorrowerCoBorrowerShown = true;
                this.isSpouseOnTheTitle = false;

                this.initializeCoBorrowerAddresses();
            }
            else {
                this.isSpouseOnTheTitle = false;
                this.isSwitchBorrowerCoBorrowerShown = false;
            }
        }      

        private initializeCoBorrowerAddresses = () => {
            //
            // @todo-cl::PROPERTY-ADDRESS
            //

            //if (this.getCoBorrower().getCurrentAddress().isEmpty() || this.getCoBorrower().getCurrentAddress().isAddressEqual(this.getBorrower().currentAddress))
            //    this.getCoBorrower().currentAddress = this.getBorrower().currentAddress;

            //if (this.getCoBorrower().mailingAddress.isEmpty() || this.getCoBorrower().mailingAddress.isAddressEqual(this.getCoBorrower().currentAddress)) {
            //    this.getCoBorrower().mailingAddress.isSameAsPropertyAddress = true;
            //    this.getCoBorrower().mailingAddress = this.getCoBorrower().currentAddress;
            //}
        }
        /**
        * @desc Private function that validates borrower address sections
        */
        private isBorrowerCoBorrowerAddressSectionsCompleted = (borrower: srv.IBorrowerViewModel): boolean => {
            var result: boolean;
            var currentAddress = borrower.getCurrentAddress();
            var mailingAddress = borrower.getMailingAddress();

            // Current Address
            if (currentAddress.isSameAsPropertyAddress)
                currentAddress = this.getTransactionInfo().getLoan().getSubjectProperty();

            //Mailing Address
            if (mailingAddress.isSameMailingAsBorrowerCurrentAddress)
                mailingAddress = currentAddress;

            result = currentAddress.isValid() && borrower.getCurrentAddress().isOwnershipValid() && mailingAddress.isValid();


            // Previuos Address
            if (borrower.getCurrentAddress().timeAtAddressYears < 2) {
                var previousAddress = borrower.getPreviousAddress();

                if (previousAddress.isSameAsPrimaryBorrowerCurrentAddress)
                    previousAddress = currentAddress;

                result = result && previousAddress.isValid() && previousAddress.isOwnershipValid();
            }

            return result;
        }

        /**
        * @desc Private function that validates borrower or coborrower declarations
        */
        private isBorrowerDecalarationsCompleted = (borrower: srv.IBorrowerViewModel) => {
            var result: boolean;

            result = (this.declarations.loanOriginatorSource != null && this.declarations.loanOriginatorSource.toString() != "") &&
            (borrower.declarationsInfo.additionalInformationCheckboxIndicator == false || borrower.declarationsInfo.additionalInformationCheckboxIndicator == true);

            if (borrower.declarationsInfo.additionalInformationCheckboxIndicator == false) {
                result = result && (borrower.declarationsInfo.ethnicityId != null && borrower.declarationsInfo.ethnicityId.toString() != "") &&
                (borrower.declarationsInfo.race != null && borrower.declarationsInfo.race.toString() != "") &&
                (borrower.declarationsInfo.sexId != null && borrower.declarationsInfo.sexId.toString() != "");
            }

            result = result && (borrower.declarationsInfo.outstandingJudgmentsIndicator == 0 || borrower.declarationsInfo.outstandingJudgmentsIndicator == 1) &&
            (borrower.declarationsInfo.bankrupcyIndicator == 0 || borrower.declarationsInfo.bankrupcyIndicator == 1) &&
            (borrower.declarationsInfo.propertyForeclosedIndicator == 0 || borrower.declarationsInfo.propertyForeclosedIndicator == 1) &&
            (borrower.declarationsInfo.partyToLawsuitIndicator == 0 || borrower.declarationsInfo.partyToLawsuitIndicator == 1) &&
            (borrower.declarationsInfo.obligatedLoanIndicator == 0 || borrower.declarationsInfo.obligatedLoanIndicator == 1) &&
            (borrower.declarationsInfo.presentlyDelinquentIndicator == 0 || borrower.declarationsInfo.presentlyDelinquentIndicator == 1) &&
            (borrower.declarationsInfo.alimonyChildSupportObligation == 0 || borrower.declarationsInfo.alimonyChildSupportObligation == 1) &&
            (borrower.declarationsInfo.downPaymentIndicator == 0 || borrower.declarationsInfo.downPaymentIndicator == 1) &&
            (borrower.declarationsInfo.noteEndorserIndicator == 0 || borrower.declarationsInfo.noteEndorserIndicator == 1) &&
            (borrower.usCitizen == true || borrower.usCitizen == false) &&
            (borrower.permanentAlien == true || borrower.permanentAlien == false) &&
            (borrower.declarationsInfo.propertyAsPrimaryResidence == 0 || borrower.declarationsInfo.propertyAsPrimaryResidence == 1) &&
            (borrower.declarationsInfo.ownershipInterestLastThreeYears == 0 || borrower.declarationsInfo.ownershipInterestLastThreeYears == 1);

            if (borrower.declarationsInfo.ownershipInterestLastThreeYears == 0) {
                result = result && (borrower.declarationsInfo.typeOfProperty != null && borrower.declarationsInfo.typeOfProperty.toString() != "") &&
                (borrower.declarationsInfo.priorPropertyTitleType != null && borrower.declarationsInfo.priorPropertyTitleType.toString() != "")
            }

            if (this.declarations.loanOriginatorSource == 0) {

                var dateBefore: string, dateAfter: string;

                if (borrower.declarationsInfo.dateIssued != null)
                    dateBefore = moment(borrower.declarationsInfo.dateIssued).format('MM/DD/YYYY');

                if (borrower.declarationsInfo.dateExpired != null)
                    dateAfter = moment(borrower.declarationsInfo.dateExpired).format('MM/DD/YYYY');

                result = result && borrower.declarationsInfo.certificationId != null &&
                result && borrower.declarationsInfo.certificationId != srv.CertificationIdEnum.Other &&
                borrower.declarationsInfo.numberId != null &&
                borrower.declarationsInfo.stateId != null &&
                new Date(dateBefore) < new Date(dateAfter) &&
                new Date(dateBefore).getFullYear() >= 1900 &&
                new Date(dateAfter).getFullYear() >= 1900
                ||
                borrower.declarationsInfo.certificationId == srv.CertificationIdEnum.Other &&
                borrower.declarationsInfo.otherInformation != ""
            }

            return result;
        }

        /**
        * @desc Private function that validates subject property section
        */
        private isSubjectPropertySectionCompleted = (subjectProperty: srv.IPropertyViewModel, loanType: number, loanAmount: number, downPaymentTypeCode?: number): boolean => {
            var result: boolean;

            //
            // @todo: How can be passed in null?
            //
            if (!subjectProperty)
                return false;

            result = (!common.string.isNullOrWhiteSpace(subjectProperty.cityName) &&
                !common.string.isNullOrWhiteSpace(subjectProperty.countyName) &&
                !common.string.isNullOrWhiteSpace(subjectProperty.stateName) &&
                !common.string.isNullOrWhiteSpace(subjectProperty.streetName) &&
                !common.string.isNullOrWhiteSpace(subjectProperty.zipCode) &&
                subjectProperty.purchasePrice > 0 &&
                subjectProperty.monthlyHOAdues >= 0 &&
                loanAmount > 0);

            if (+subjectProperty.propertyType == srv.PropertyTypeEnum.Condominium)
                result = result && subjectProperty.numberOfStories > 0;

            if (loanType === srv.LoanType.Purchase) {
                result = result && subjectProperty.downPayment >= 0 && !!downPaymentTypeCode;

                if (this.occupancyType == srv.PropertyUsageTypeEnum.InvestmentProperty)
                    result = result && subjectProperty.grossRentalIncome >= 0 && subjectProperty.OwnershipPercentage > 0 && subjectProperty.vacancyPercentage > 0;
            }
            else if (loanType == srv.LoanType.Refinance) {
                result = result && subjectProperty.purchaseDate && (subjectProperty.currentEstimatedValue > 0 && subjectProperty.purchaseDate != null);
            }

            return result;
        }

        get OwnershipPercentage() {
            if (!this.ownershipPercentage) {
                return 0;
            }
            else {
                return this.ownershipPercentage;
            }
        }
        set OwnershipPercentage(value) {
            if (!value) {
                this.ownershipPercentage = 0;
            }
            else {
                this.ownershipPercentage = value;
            }
        }

        private getBorrowerDebtAccountOwnershipTypes = (loanApplication: cls.LoanApplicationViewModel): srv.IList<srv.ILookupItem>  => {

            var debtAccountOwnershipTypes = new Array<srv.cls.LookupItem>();

            debtAccountOwnershipTypes.push(new cls.LookupItem(loanApplication.getBorrower().fullName, String(srv.DebtsAccountOwnershipType.Borrower)));

            if (loanApplication.isSpouseOnTheLoan) {
                debtAccountOwnershipTypes.push(new cls.LookupItem(loanApplication.getBorrower().fullName + ", " + loanApplication.getCoBorrower().fullName, String(srv.DebtsAccountOwnershipType.Joint)));
            }
            else
                debtAccountOwnershipTypes.push(new cls.LookupItem(loanApplication.getBorrower().fullName + " with Other", String(srv.DebtsAccountOwnershipType.BorrowerWithOther)));

            return debtAccountOwnershipTypes;
        }

        private borrowers: srv.ILookupItem[];
        public borrowerLookupList: srv.ILookupItem[];
        Borrowers = (includeJointAccount: boolean = true, useBorrowerId?: boolean, useFullNamesForJointAccount?: boolean): srv.ILookupItem[]=> { // srv.ILookupItem[] { - ILookupItem interface is missing from the solution!
            this.borrowers = [];
            this.borrowers.push(this.populateBorrowerLookup(this.getBorrower(), useBorrowerId));

            if (this.isSpouseOnTheLoan) {
                this.borrowers.push(this.populateBorrowerLookup(this.getCoBorrower(), useBorrowerId));
                if (includeJointAccount) {
                    var jointAccountText = 'Joint Account';
                    if (useFullNamesForJointAccount)
                        jointAccountText = this.getBorrower().fullName + ', ' + this.getCoBorrower().fullName;

                    this.borrowers.push({ value: 'JointAccount', text: jointAccountText, selected: false, disabled: false, stringValue: null, description: null  });
                }
            }

            this.borrowerLookupList = this.borrowers;

            return this.borrowers;
        }

        private liabilitiesFor: srv.ILookupItem[]; // srv.ILookupItem[]; - ILookupItem interface is missing from the solution!
        LiabilitiesFor = (): srv.ILookupItem[]=> { // srv.ILookupItem[] { - ILookupItem interface is missing from the solution!
            this.liabilitiesFor = [];
            this.liabilitiesFor.push({ value: 'Borrower', text: this.getBorrower().fullName, selected: true, disabled: false, stringValue: null, description: null   });

            if (this.isSpouseOnTheLoan) {
                this.liabilitiesFor.push({ value: 'CoBorrower', text: this.getCoBorrower().fullName, selected: false, disabled: false, stringValue: null, description: null   });

                var jointAccountText = this.getBorrower().fullName + ', ' + this.getCoBorrower().fullName;

                this.liabilitiesFor.push({ value: 'Joint', text: jointAccountText, selected: false, disabled: false, stringValue: null, description: null   });

            }
            return this.liabilitiesFor;
        }
                         
         
        private _borrowerList: srv.ILookupItem[];
        borrowerList = (useBorrowerId?: boolean): srv.ILookupItem[]=> {
            this._borrowerList = [];
            this._borrowerList.push(this.populateBorrowerLookup(this.getBorrower(), useBorrowerId));

            if (this.isSpouseOnTheLoan) {
                this._borrowerList.push(this.populateBorrowerLookup(this.getCoBorrower(), useBorrowerId));

            }
            return this._borrowerList;
        }

        private _borrowerJointList: srv.ILookupItem[];
        borrowerJointList = (): srv.ILookupItem[]=> {
            this._borrowerJointList = [];
            this._borrowerJointList.push({ value: this.getBorrower().fullName, text: this.getBorrower().fullName, selected: false, disabled: false, stringValue: null, description: null   });

            if (this.isSpouseOnTheLoan) {
                this._borrowerJointList.push({ value: this.getCoBorrower().fullName, text: this.getCoBorrower().fullName, selected: false, disabled: false, stringValue: null, description: null   });
                this._borrowerJointList.push({ value: this.getBorrower().fullName + ', ' + this.getCoBorrower().fullName, text: this.getBorrower().fullName + ', ' + this.getCoBorrower().fullName, selected: false, disabled: false, stringValue: null, description: null   });
            }
            return this._borrowerJointList;
        }

        /**
        * @desc Gets collection in which item exists
        */
        private getProperCollection = <T>(item: T, borrowersCollection: srv.ICollection<T>, coBorrowersCollection: srv.ICollection<T>): any => {
            var collectionType: number = cls.CollectionType.BORROWERS_COLLECTION;
            var index: number = common.indexOfItem(item, borrowersCollection);

            if (index === -1) {
                index = common.indexOfItem(item, coBorrowersCollection);
                collectionType = cls.CollectionType.COBORROWERS_COLLECTION;
            }

            // Nothing found in both collections.
            if (index === -1)
                return null;

            return { collection: collectionType, index: index };
        }

        private populateBorrowerLookup(borrower: srv.IBorrowerViewModel, useBorrowerId?: boolean): srv.ILookupItem { // srv.ILookupItem { - ILookupItem interface is missing from the solution!
            return { value: useBorrowerId ? borrower.borrowerId : borrower.firstName + ' ' + borrower.lastName, text: borrower.firstName + ' ' + borrower.lastName, selected: false, disabled: false, stringValue: null, description: null  }
        }

        private getOtherIncomeForBorrower = (borrower: srv.IBorrowerViewModel): srv.IIncomeInfoViewModel[]=> {
            return borrower.getOtherIncome();
        }

        private getCombinedAutomobilesByBorrower = (borrower: srv.IBorrowerViewModel): srv.IAssetViewModel[]=> {
            return borrower.getAutomobiles();
        }

        private getCombinedFinancialsByBorrower = (borrower: srv.IBorrowerViewModel): srv.IAssetViewModel[]=> {
            return borrower.getFinancials();
        }

        private getCombinedLifeInsurenceByBorrower = (borrower: srv.IBorrowerViewModel): srv.IAssetViewModel[]=> {
            return borrower.getLifeInsurance();
        }

        private getCombinedAssets = (borrower: srv.IBorrowerViewModel, coBorrower: srv.IBorrowerViewModel): srv.IAssetViewModel[]=> {

            var borrowerAssets: any = borrower.getAssets(),
                coBorrowerAssets: any = coBorrower.getAssets();

            return borrowerAssets.concat(coBorrowerAssets);
        }

        private getMiscDebtsForBorrower = (borrower: srv.IBorrowerViewModel): srv.IMiscellaneousDebtViewModel[]=> {
            return borrower.populateBorrowerId(borrower.getMiscDebts());
        }

        private getCollectionsForBorrower = (borrower: srv.IBorrowerViewModel): srv.ILiabilityViewModel[]=> {
            return borrower.populateBorrowerId(borrower.getCollections());
        }

        private getLiabilitiesForBorrower = (borrower: srv.IBorrowerViewModel): srv.ILiabilityViewModel[]=> {
            return borrower.populateBorrowerId(borrower.getLiability());
        }

        private getPublicRecordsForBorrower = (borrower: srv.IBorrowerViewModel): srv.IPublicRecordViewModel[]=> {
            return borrower.getPublicRecords();
        }

        /**
        * @desc Refreshes realEstate based on response from service
        */
        refreshRealEstate = (updatedLoanApplication?: srv.ILoanApplicationViewModel): void => {
            this.realEstate.addressForDropDown = updatedLoanApplication.realEstate.addressForDropDown;
        }

        public prepareForSubmit = (): void => {
            this.getBorrower().prepareForSubmit();
            this.getCoBorrower().prepareForSubmit();
        }

        private initialize = (loanApplication?: srv.ILoanApplicationViewModel) => {
            if (loanApplication) {

                // @todo-cl::BOROWER-ADDRESS
                //if (loanApplication.getCoBorrower()) {
                //    // Handle coborrower addresses
                //    if (this.isSpouseOnTheLoan) {
                //        this.initializeCoBorrowerAddresses();
                //    }
                //}

                if (loanApplication.documents) {
                    for (var i = 0; i < this.documents.length; i++) {
                        this.documents[i] = new cls.DocumentsViewModel(this.documents[i]);
                    }
                }

                this.titleInfo = new cls.TitleInformationViewModel(loanApplication.titleInfo);

                this.credit = new cls.CreditViewModel(this.credit);

                // Initialize disclosure status display text
                if (this.disclosureStatusDetails && this.disclosureStatusDetails.disclosureStatus) {
                    this.setDisclosureStatusTitle();
                    }
                else {
                    this.disclosureStatusDetails = <srv.IDisclosureStatusDetailsViewModel>{};
                }
            }
            else {                
                this.setBorrower(new cls.BorrowerViewModel(this.getTransactionInfo(), null));
                this.setCoBorrower(new cls.BorrowerViewModel(this.getTransactionInfo(), null));
               if (this.hasTransactionInfo()) {
                    this.getBorrower().setCurrentEmploymentInfo(new cls.CurrentEmploymentInfoViewModel(this.getTransactionInfo(), null));
                    this.getCoBorrower().setCurrentEmploymentInfo(new cls.CurrentEmploymentInfoViewModel(this.getTransactionInfo(), null));
                    this.getCoBorrower().isEmployedTwoYears = true;
                    this.getBorrower().isEmployedTwoYears = true;
                }                             
                this.isPrimary = false;
                this.isCoBorrowerSectionShown = false;
                
                this.triggerMaritalStatusRules();
                this.onIsSpouseOnTheLoanChange(false);
                this.credit = new cls.CreditViewModel();               
            }

            if (!this.titleInfo)
                this.titleInfo = new cls.TitleInformationViewModel();

            if (!this.miscDebts)
                this.miscDebts = [];

            if (!this.collections)
                this.collections = [];

            if (!this.realEstate)
                this.realEstate = new cls.RealEstateViewModel();

            if (!this.declarations)
                this.declarations = new cls.DeclarationViewModel();
            
            if (!this.appraisedValueHistories)
                this.appraisedValueHistories = [];

            var miscDebtsCombined = this.getCombinedMiscDebts();
            // add two misc empty items by default if liabilites - miscExpanses is empty
            if (miscDebtsCombined) {
                if (miscDebtsCombined.length === 0) {
                    var b = this.getBorrower();
                    if (!!b) {
                        var fullNameBorrower = b.getFullName();
                        var childAlimonyDefault: srv.IMiscellaneousDebtViewModel = new cls.MiscellaneousDebtViewModel(null, srv.MiscellaneousDebtTypes.ChildCareExpensesForVALoansOnly, false, fullNameBorrower);
                        var jobExpenseDefault: srv.IMiscellaneousDebtViewModel = new cls.MiscellaneousDebtViewModel(null, srv.MiscellaneousDebtTypes.Expenses2106FromTaxReturns, false, fullNameBorrower);
                    childAlimonyDefault.isDefaultValue = true;
                    jobExpenseDefault.isDefaultValue = true;
                    jobExpenseDefault.clientIdForOrder = -1;
                    childAlimonyDefault.clientIdForOrder = -2;
                        b.miscellaneousDebt.push(childAlimonyDefault, jobExpenseDefault);
                    }
                }
                else {
                    var childAlimony = miscDebtsCombined.filter(function (item) { return item.typeId === srv.MiscellaneousDebtTypes.ChildCareExpensesForVALoansOnly });
                    var jobRelatedExpense = miscDebtsCombined.filter(function (item) { return item.typeId === srv.MiscellaneousDebtTypes.Expenses2106FromTaxReturns });
         
                    // if childAlimony is empty add a default child item in misc     
                    if (childAlimony.length === 0) {
                        var childAlimonyDefault: srv.IMiscellaneousDebtViewModel = new cls.MiscellaneousDebtViewModel(null, srv.MiscellaneousDebtTypes.ChildCareExpensesForVALoansOnly, false, this.getBorrower().getFullName());
                        childAlimonyDefault.isDefaultValue = true;
                        childAlimonyDefault.clientIdForOrder = -2;
                        this.getBorrower().miscellaneousDebt.push(childAlimonyDefault);

                    }
                    // if jobRelatedExp is empty add a default job item in misc
                    if (jobRelatedExpense.length === 0) {
                        var jobExpenseDefault: srv.IMiscellaneousDebtViewModel = new cls.MiscellaneousDebtViewModel(null, srv.MiscellaneousDebtTypes.Expenses2106FromTaxReturns, false, this.getBorrower().getFullName());
                        jobExpenseDefault.isDefaultValue = true;
                        jobExpenseDefault.clientIdForOrder = -1;
                        this.getBorrower().miscellaneousDebt.push(jobExpenseDefault);
                    }
                }
            }
            
            //initialize flags   
            if (!this.occupancyType) {
                this.occupancyType = srv.PropertyUsageTypeEnum.PrimaryResidence;
            }            
            this.defaultCurrentAddress(this.getBorrower());
            this.defaultMailingAddress(this.getBorrower());            
            this.defaultCurrentAddress(this.getCoBorrower());
            this.defaultMailingAddress(this.getCoBorrower());
            
            this.isFirstAndLastNameEnteredForBorrowers = true;
            this.isBorrowerSectionShown = true;
            this.isCoBorrowerSectionShown = ((!!this.getBorrower() && (this.getBorrower().maritalStatus == 0 || this.getBorrower().maritalStatus == 1)) || this.isSpouseOnTheLoan || this.isSpouseOnTheTitle) ? true : false; // married or seperated
            this.isTitleSectionShown = true;
            this.isSwitchBorrowerCoBorrowerShown = this.isCoBorrowerSectionShown && this.isSpouseOnTheLoan;
            this.howDidYouHearAboutUsEnabled = this.howDidYouHearAboutUs == null;
            if (this.titleInfo && this.titleInfo.titleHeldIn == 0)
                this.showNamesAndManner = true;
            else
                this.showNamesAndManner = false;

            this.initializeCredit();
        }

        private defaultCurrentAddress = (borrower: srv.IBorrowerViewModel) => {
            if (borrower.isCoBorrower && (!angular.isDefined(borrower.getCurrentAddress().isSameAsPrimaryBorrowerCurrentAddress) || borrower.getCurrentAddress().isSameAsPrimaryBorrowerCurrentAddress == null)) {
                borrower.getCurrentAddress().isSameAsPrimaryBorrowerCurrentAddress = true;
            }
            if (borrower.isCoBorrower && borrower.getCurrentAddress().isSameAsPrimaryBorrowerCurrentAddress) {
                borrower.getCurrentAddress().timeAtAddressYears = null;
                borrower.getCurrentAddress().timeAtAddressMonths = null;
                borrower.getMailingAddress().isSameMailingAsBorrowerCurrentAddress = true
            }          
            if (!borrower.getCurrentAddress().ownership) {
                borrower.getCurrentAddress().ownership = srv.OwnershipStatusTypeEnum.Own;
            }
        }

        private defaultMailingAddress = (borrower: srv.IBorrowerViewModel) => {
            if (!angular.isDefined(borrower.getMailingAddress().isSameMailingAsBorrowerCurrentAddress) || borrower.getMailingAddress().isSameMailingAsBorrowerCurrentAddress == null) {
                borrower.getMailingAddress().isSameMailingAsBorrowerCurrentAddress = true;
            }
        }

        public setDisclosureStatusTitle = () => {
            switch (this.disclosureStatusDetails.disclosureStatus) {
                case srv.DisclosureStatusEnum.InitialDisclosureRequired:
                case srv.DisclosureStatusEnum.RequestInProgress:
                    this.disclosureStatusDetails.disclosureStatusText = "Initial Disclosure Required";
                    break;
                case srv.DisclosureStatusEnum.ReDisclosureRequired:
                    this.disclosureStatusDetails.disclosureStatusText = "Re-Disclosure Required";
                    break;
                case srv.DisclosureStatusEnum.DisclosuresCreated:
                    this.disclosureStatusDetails.disclosureStatusText = "Disclosures Created";
                    break;
                default:
                    this.disclosureStatusDetails.disclosureStatusText = "Not Needed";
                    break;
            }           
        }

        private setCompanyDataName = (source: srv.ILiabilityViewModel[]) => {

            var action = (liability: srv.ILiabilityViewModel) => liability.companyData.companyName = (liability.typeId == cls.LiablitityTypeEnum.Liability || liability.typeId == cls.LiablitityTypeEnum.Collection) && !liability.companyData.companyName && !liability.isNewRow ? "Not specified" : liability.companyData.companyName;
            lib.forEach(source, action);
        }

        private createBorrowersLiabilities = (borrower: srv.IBorrowerViewModel, coBorrower?: srv.IBorrowerViewModel): srv.IBorrowerLiabilities[]=> {

            var borrowersLiabilities: srv.IBorrowerLiabilities[] = [];

            // var pred = liability => !liability.isRemove && liability.typeId == cls.LiablitityTypeEnum.Liability && !liability.isPledged;

            if (borrower) {
                borrowersLiabilities.push({ borrowerFullName: borrower.fullName, isBorrower: true, liabilities: borrower.getLiabilities() });
            }

            if (coBorrower && this.isSpouseOnTheLoan) {
                borrowersLiabilities.push({ borrowerFullName: coBorrower.fullName, isBorrower: false, liabilities: coBorrower.getLiabilities() });
            }

            return borrowersLiabilities;
        }

        initializeCredit = () => {

            if (!this.getBorrower())
                return;

            var allLiabilities = this.getBorrower().getLiabilities();
            // @todo-cc: Why do we only set Company Data Name for the Borrower::Liablities and not the CoBorrower::Liabilities ?
            this.setCompanyDataName(allLiabilities);

            if (this.isSpouseOnTheLoan && this.getCoBorrower() && this.getCoBorrower().getLiabilities())
                allLiabilities = allLiabilities.concat(this.getCoBorrower().getLiabilities());

            var allPublicRecords = this.getBorrower().publicRecords;
            if (this.isSpouseOnTheLoan && this.getCoBorrower() && this.getCoBorrower().publicRecords)
                allPublicRecords = allPublicRecords.concat(this.getCoBorrower().publicRecords);

            this.publicRecords = allPublicRecords;
            this.collections = lib.filter(allLiabilities, liability => !liability.isRemoved && liability.typeId == cls.LiablitityTypeEnum.Collection && !liability.isPledged);
            this.reos = lib.filter(allLiabilities, liability => !liability.isRemoved && liability.isPledged);

            this.borrowerLiabilities = this.createBorrowersLiabilities(this.getBorrower(), this.getCoBorrower());
        }

        public borrowerHasChildAlimony = (): boolean => {
            return this.getMiscDebtsForBorrower(this.getBorrower()).filter(function (item) { return item.typeId == srv.MiscellaneousDebtTypes.ChildCareExpensesForVALoansOnly && (!item.isDefaultValue || item.isDefaultValue === undefined || item.payee != "") && !item.isRemoved; }).length > 0;
        }

        public coBorrowerHasChildAlimony = (): boolean => {
            return this.getMiscDebtsForBorrower(this.getCoBorrower()).filter(function (item) { return item.typeId == srv.MiscellaneousDebtTypes.ChildCareExpensesForVALoansOnly && (!item.isDefaultValue || item.isDefaultValue === undefined || item.payee != "") && !item.isRemoved; }).length > 0;
        }

        public addDefaultChildAlimonyIfLastRemoved = (): void => {
            if (this.getBorrower().miscellaneousDebt) {

                var childAlimonyBorrower: srv.IMiscellaneousDebtViewModel[] = this.getBorrower().miscellaneousDebt.filter(function (item) { return item.typeId == srv.MiscellaneousDebtTypes.ChildCareExpensesForVALoansOnly && !item.isRemoved; });
                var childAlimonyCoBorrower: srv.IMiscellaneousDebtViewModel[] = this.getCoBorrower().miscellaneousDebt.filter(function (item) { return item.typeId == srv.MiscellaneousDebtTypes.ChildCareExpensesForVALoansOnly && !item.isRemoved; });
         
                // if childAlimony is empty add a default child item in misc     
                if (childAlimonyBorrower.length === 0 && childAlimonyCoBorrower.length === 0) {
                    var childAlimonyDefault: srv.IMiscellaneousDebtViewModel = new cls.MiscellaneousDebtViewModel(null, srv.MiscellaneousDebtTypes.ChildCareExpensesForVALoansOnly, false, this.getBorrower().getFullName());
                    childAlimonyDefault.isDefaultValue = true;
                    childAlimonyDefault.clientIdForOrder = -2;
                    this.getBorrower().miscellaneousDebt.push(childAlimonyDefault);

                }
            }
        }

        // TODO: Remove this. Email validation should be used as a common helper function, or by using the impEmail directive. It is not part of the loanApplication state.
        public validateEmail = (email: string): boolean => {
            var reg = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            return reg.test(email) || email == null || email == undefined;
        }
    }
}
