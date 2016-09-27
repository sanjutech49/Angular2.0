/// <reference path="../../ts/generated/viewModels.ts" />
/// <reference path="../../ts/generated/enums.ts" />
/// <reference path="../../ts/extendedViewModels/borrower.extendedViewModel.ts" />
/// <reference path="../../ts/extendedViewModels/enums.extendedViewModel.ts" />
/// <reference path="../../ts/extendedViewModels/extendedViewModels.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var cls;
(function (cls) {
    (function (CollectionType) {
        CollectionType[CollectionType["BORROWERS_COLLECTION"] = 0] = "BORROWERS_COLLECTION";
        CollectionType[CollectionType["COBORROWERS_COLLECTION"] = 1] = "COBORROWERS_COLLECTION";
        CollectionType[CollectionType["JOINTACCOUNT_COLLECTION"] = 2] = "JOINTACCOUNT_COLLECTION";
    })(cls.CollectionType || (cls.CollectionType = {}));
    var CollectionType = cls.CollectionType;
    var LoanApplicationViewModel = (function (_super) {
        __extends(LoanApplicationViewModel, _super);
        function LoanApplicationViewModel(ti, loanApplication) {
            var _this = this;
            _super.call(this);
            this.hasTransactionInfo = function () {
                return (!!_this.ticb && !!_this.ticb());
            };
            this.getTransactionInfo = function () {
                if (_this.hasTransactionInfo())
                    return _this.ticb();
                else
                    return null;
            };
            this.setTransactionInfo = function (ti) {
                _this.ticb = function () { return ti; };
            };
            /**
            * @desc Increments the snooze order.
            */
            this.incrementSnoozeOrder = function () {
                _this.snoozeOrder += 1;
                _this.isSnoozed = true;
            };
            //
            this.hasTransactionalInfoBorrower = function () {
                return _this.hasTransactionInfo() && !!_this.getTransactionInfo().borrower;
            };
            this.getTransactionInfoBorrower = function () {
                if (_this.hasTransactionalInfoBorrower()) {
                    return _this.getTransactionInfo().borrower;
                }
                return new cls.Map();
            };
            // 
            this.getBorrowerOrCoBorrower = function (isCoBorrower) {
                if (_this.hasTransactionalInfoBorrower()) {
                    var itemBorrower = lib.findFirst(_this.getTransactionInfoBorrower().getValues(), function (o) { return o.loanApplicationId == _this.loanApplicationId && o.isCoBorrower == isCoBorrower; });
                    return itemBorrower;
                }
                return null;
            };
            this.setBorrowerOrCoBorrower = function (borrower) {
                // @todo-cl:
                //      Deal with lazy instantiate , for example ; this should not need be done here , every loan app should have 2 borrowers:
                //          return <cls.BorrowerViewModel>(this.borrower ? this.borrower : (this.Borrower = new cls.BorrowerViewModel(this.loanCallBack, null)));
                if (!!borrower && _this.hasTransactionalInfoBorrower()) {
                    var be = _this.getBorrowerOrCoBorrower(borrower.isCoBorrower);
                    if (!!be) {
                        _this.getTransactionInfoBorrower().remove(be);
                    }
                    borrower.loanApplicationId = _this.loanApplicationId;
                    _this.getTransactionInfoBorrower().map(borrower);
                }
            };
            this.getBorrower = function () {
                return _this.getBorrowerOrCoBorrower(false);
            };
            this.setBorrower = function (borrower) {
                borrower.isCoBorrower = false;
                _this.setBorrowerOrCoBorrower(borrower);
            };
            this.bindBorrower = function (b) {
                if (angular.isDefined(b)) {
                    _this.setBorrower(b);
                }
                return _this.getBorrower();
            };
            this.getCoBorrower = function () {
                return _this.getBorrowerOrCoBorrower(true);
            };
            this.setCoBorrower = function (coBorrower) {
                coBorrower.isCoBorrower = true;
                _this.setBorrowerOrCoBorrower(coBorrower);
            };
            this.bindCoBorrower = function (b) {
                if (angular.isDefined(b)) {
                    _this.setCoBorrower(b);
                }
                return _this.getCoBorrower();
            };
            this.getPrimaryAppOccupancyType = function () { return 0 /* None */; };
            this.excludeProperties = ['isLicensedStates', 'propertyId', 'counties', 'states', 'isAddressEqual', 'isEmpty', 'initialize', 'addressTypeId', 'countyName'];
            this.getTotalAssetsAmount = function () {
                var total = 0;
                var assets = _this.getBorrower().assets.concat(_this.getCoBorrower().assets);
                for (var i = 0; i < assets.length; i++) {
                    if (!assets[i].isRemoved && !assets[i].isDownPayment && assets[i].monthlyAmount) {
                        total += parseFloat(String(assets[i].monthlyAmount));
                    }
                }
                return total;
            };
            // @todo-cl::PROPERTY-ADDRESS
            //processSubjectPropertyAndCurrentAddressRules = (isSameAsSubjectProperty?: boolean): void => {
            //    // For purchase - When Occupancy type = "Primary Residence", "Investment" or "Second/Vacation Home", the "Same as Subject Property" checkbox will be UNCHECKED
            //    // For refinance -  When Occupancy type = "Primary Residence", the "Same as Subject Property" checkbox will be CHECKED.
            //    var refinancingPrimaryResidence = this.loanCallBack().loanPurposeType == srv.LoanPurposeTypeEnum.Refinance && this.occupancyType == srv.PropertyUsageTypeEnum.PrimaryResidence;
            //    var subjectProperty = this.loanCallBack().getSubjectProperty();
            //    if (isSameAsSubjectProperty == null || isSameAsSubjectProperty == undefined)
            //        isSameAsSubjectProperty = refinancingPrimaryResidence;
            //}        
            this.filterPropertiesByAddressTypeId = function (borrower) {
                return borrower.reoPropertyList.filter(function (item) {
                    return item.addressTypeId == borrower.getCurrentAddress().addressTypeId;
                });
            };
            this.filterPropertiesByAddressId = function (borrower) {
                return borrower.reoPropertyList.filter(function (item) {
                    return item.propertyId == borrower.getCurrentAddress().propertyId;
                });
            };
            /**
           * @desc Get Liabilites totals
           */
            this.getLiabilitesBalanceTotal = function (borrower) {
                var list;
                if (!borrower)
                    list = _this.getCombinedLiability();
                else
                    list = _this.getLiabilitiesForBorrower(borrower);
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
            };
            /**
            * @desc Get Public Records totals
            */
            this.getPublicRecordsTotalAmount = function () {
                var total = 0;
                angular.forEach(_this.getCombinedPublicRecords(), function (publicRecord) {
                    var amount = parseFloat(String(publicRecord.amount));
                    // 4 Payoff at close comment
                    if (!amount || isNaN(amount) || publicRecord.publicRecordComment == '4')
                        amount = 0;
                    total += parseFloat(String(amount));
                });
                return total;
            };
            /**
            * @desc Combines borrower and coborrower property list into one. Watch out for duplicates!
            */
            this.getCombinedReoPropertyList = function () {
                return _this.getBorrower().reoPropertyList.concat(_this.getCoBorrower().reoPropertyList);
            };
            this.isResidenceValidForReoList = function (borrower) {
                if (!borrower)
                    return false;
                var addr = borrower.getCurrentAddress();
                if (!addr)
                    return false;
                if (addr.ownership != 0 /* Own */)
                    return false;
                if (addr.isSameAsPropertyAddress)
                    return false;
                if (borrower.isCoBorrower && addr.isSameAsPrimaryBorrowerCurrentAddress)
                    return false;
                return true;
            };
            this.getUniqueProperties = function (getSubjectPropertiesForPurchase) {
                var loan = _this.getTransactionInfo().getLoan();
                var reoPropertyList = [];
                // subject property
                if (loan.loanPurposeType == 2 /* Refinance */ || getSubjectPropertiesForPurchase) {
                    reoPropertyList.push(loan.getSubjectProperty());
                }
                // residences
                // @todo-cc: User linqjs ...
                var residences = [];
                if (_this.isResidenceValidForReoList(_this.getBorrower()))
                    residences.push(_this.getBorrower().getCurrentAddress());
                if (_this.isResidenceValidForReoList(_this.getCoBorrower()))
                    residences.push(_this.getCoBorrower().getCurrentAddress());
                reoPropertyList = reoPropertyList.concat(residences);
                // REO's
                // @todo-cl: Review for use of Property Usage Type @RealEstate
                var allReoProperties = lib.filter(loan.getPropertyMap().getValues(), function (p) { return !p.isSubjectProperty && p.addressTypeId == 6 /* RealEstate */ && p.loanApplicationId == _this.loanApplicationId; });
                allReoProperties = lib.filter(allReoProperties, function (o) { return !lib.findFirst(reoPropertyList, function (p) { return o.isAddressEqual(p); }); });
                reoPropertyList = reoPropertyList.concat(allReoProperties);
                //
                reoPropertyList = lib.filter(reoPropertyList, function (o) { return (!!o.streetName && !!o.cityName && !!o.stateName); });
                return reoPropertyList;
            };
            this.getAllProperties = function () {
                var loan = _this.getTransactionInfo().getLoan();
                var subjProp = loan.getSubjectProperty();
                return lib.filter(_this.getTransactionInfo().property.getValues(), function (p) { return p.loanApplicationId == _this.loanApplicationId; }).concat([subjProp]);
            };
            /**
            * @desc Misc Expanses total calculation
            */
            this.getMiscExpensesTotal = function () {
                var total = 0, miscExpanses = _this.getCombinedMiscDebts();
                for (var i = 0; i < miscExpanses.length; i++) {
                    if (!miscExpanses[i].isRemoved && miscExpanses[i].amount) {
                        total += parseFloat(String(miscExpanses[i].amount));
                    }
                }
                return total;
            };
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
            this.handleJointWithCoBorrowerLiability = function (originalItem) {
                var childItem = _this.getChildItemFromLiabilityLists(originalItem);
                if (!childItem)
                    return;
                childItem.companyData = originalItem.companyData;
                childItem.debtType = originalItem.debtType;
                childItem.accountNumber = originalItem.accountNumber;
                childItem.monthsLeft = originalItem.monthsLeft;
                childItem.unpaidBalance = originalItem.unpaidBalance;
                childItem.minPayment = originalItem.minPayment;
                childItem.debtCommentId = originalItem.debtCommentId;
            };
            /*
            * @desc Physically deletes parent liability from list
            */
            this.deleteLiability = function (liability) {
                throw new Error("loanApplication::deleteLiability() is OBSOLETE");
                //this.deleteFromCollection(liability, this.getBorrower().Liabilities, this.getCoBorrower().Liabilities);
                //var childItem = this.getChildItemFromLiabilityLists(liability);
                //if (!childItem)
                //    return;
                //this.removeFromCollection(childItem, this.getBorrower().getLiabilities(), this.getCoBorrower().getLiabilities());
            };
            /*
            * @desc Sets isRemoved flag to true for item(s) from liabilites
            */
            this.removeLiablity = function (liability) {
                throw new Error("loanApplication::removeLiablity() is OBSOLETE");
                //this.removeFromCollection(liability, this.getBorrower().getLiabilities(), this.getCoBorrower().getLiabilities());
                //var childItem = this.getChildItemFromLiabilityLists(liability);
                //if (!childItem)
                //    return;
                //this.removeFromCollection(childItem, this.getBorrower().getLiabilities(), this.getCoBorrower().getLiabilities());
            };
            this.getChildItemFromLiabilityLists = function (originalItem) {
                for (var i = 0; i < _this.getBorrower().getLiabilities().length; i++) {
                    if (_this.getBorrower().getLiabilities()[i].originalClientId === originalItem.clientId)
                        return _this.getBorrower().getLiabilities()[i];
                }
                for (var i = 0; i < _this.getCoBorrower().getLiabilities().length; i++) {
                    if (_this.getCoBorrower().getLiabilities()[i].originalClientId === originalItem.clientId)
                        return _this.getCoBorrower().getLiabilities()[i];
                }
                return null;
            };
            this.areSixPiecesOfLoanApplicationCompleted = function () {
                return _this.isPersonalPieceAcquired() && _this.isIncomePieceAcquired();
            };
            /**
            * @desc Validates whether Loan Applications requeired fields are completed
            */
            this.isLoanApplicationCompleted = function (subjectProperty, loanType, loanAmount, coBorrowerAddressDifferent, downPaymentTypeCode, isSixPieceCompletedForCurrentApp) {
                _this.isCompleted = _this.isPersonalCompleted() && _this.isPropertyCompleted(subjectProperty, loanType, loanAmount, coBorrowerAddressDifferent, downPaymentTypeCode) && _this.isAssetsCompleted() && _this.isCreditTabCompleted(isSixPieceCompletedForCurrentApp) && _this.isDeclarationsCompleted() && _this.isIncomeCompleted();
                return _this.isCompleted;
            };
            /**
            * @desc Validates Personal tab for active Loan Application
            */
            this.isPersonalCompleted = function () {
                if (!_this.validatePersonalCompletedForBorrower(_this.getBorrower()) || (_this.titleInfo.titleHeldIn == 0 && (common.string.isNullOrWhiteSpace(_this.titleInfo.namesOnTitle) || !(_this.titleInfo.mannerTitleHeld && _this.titleInfo.mannerTitleHeld != '-1'))) || common.string.isNullOrWhiteSpace(_this.howDidYouHearAboutUs) || (_this.getCoBorrower() && _this.isSpouseOnTheLoan && !_this.validatePersonalCompletedForBorrower(_this.getCoBorrower())) || (!_this.isSpouseOnTheLoan && _this.getBorrower().maritalStatus.toString() == '0' && common.string.isNullOrWhiteSpace(_this.titleInfo.nameOfPartner)))
                    return false;
                return true;
            };
            /**
            * @desc Validates if 1st and 2nd piece of 6 pieces is acquired.
            */
            this.isPersonalPieceAcquired = function () {
                var retVal = false;
                retVal = _this.validatePersonalPieceForBorrower(_this.getBorrower());
                if (_this.getCoBorrower() && _this.isSpouseOnTheLoan)
                    retVal = retVal && _this.validatePersonalPieceForBorrower(_this.getCoBorrower());
                return retVal;
            };
            this.validatePersonalPieceForBorrower = function (borrower) {
                return (_this.isBorrowerFirstAndLastNameEntered(borrower) && !!borrower.ssn);
            };
            this.isBorrowerFirstAndLastNameEntered = function (borrower) {
                return !common.string.isNullOrWhiteSpace(borrower.firstName) && !common.string.isNullOrWhiteSpace(borrower.lastName);
            };
            this.isValidForSave = function () {
                if (_this.isSpouseOnTheLoan)
                    return _this.isBorrowerFirstAndLastNameEntered(_this.getBorrower()) && _this.isBorrowerFirstAndLastNameEntered(_this.getCoBorrower());
                return _this.isBorrowerFirstAndLastNameEntered(_this.getBorrower());
            };
            this.validatePersonalCompletedForBorrower = function (borrower) {
                var emailProvided = (borrower.userAccount.isOnlineUser && !common.string.isNullOrWhiteSpace(borrower.userAccount.username)) || !borrower.userAccount.isOnlineUser;
                var usCitizenIndicatorProvided = borrower.usCitizen || borrower.permanentAlien;
                var yearsAgo = moment().diff(moment(borrower.dateOfBirth), 'years');
                return (_this.validatePersonalPieceForBorrower(borrower) && emailProvided && usCitizenIndicatorProvided && !common.string.isNullOrWhiteSpace(borrower.preferredPhone.number) && borrower.yearsOfSchool && borrower.yearsOfSchool != 0 && borrower.dateOfBirth && yearsAgo >= 18 && (borrower.maritalStatus || borrower.maritalStatus == 0) && borrower.maritalStatus.toString() != '-1');
            };
            /**
            * @desc Returns correct color for chekc
            */
            this.getCheckColor = function (tabCompleted, sixPiecesCompleted) {
                if (tabCompleted)
                    return "#49E88A"; //green
                else if (sixPiecesCompleted)
                    return "#ef1126 "; //red            
            };
            this.isCheckAvailable = function (tabCompleted, sixPiecesCompleted) {
                return !(!tabCompleted && !sixPiecesCompleted);
            };
            /**
            * @desc Validates Property tab for active Loan Application
            */
            this.isPropertyCompleted = function (subjectProperty, loanType, loanAmount, coBorrowerAddressDifferent, downPaymentTypeCode) {
                var result;
                result = _this.isSubjectPropertySectionCompleted(subjectProperty, loanType, loanAmount, downPaymentTypeCode) && _this.isBorrowerCoBorrowerAddressSectionsCompleted(_this.getBorrower());
                if (coBorrowerAddressDifferent && _this.isSpouseOnTheLoan) {
                    result = result && _this.isBorrowerCoBorrowerAddressSectionsCompleted(_this.getCoBorrower());
                }
                return result;
            };
            this.updateOccupancyTypeForSubjectPropertyPledgeAssets = function () {
                var subjectPropertyPledgeAssets = _this.getCombinedPledgedAssets().filter(function (e) {
                    return e.getProperty().isSubjectProperty;
                });
                for (var i = 0; i < subjectPropertyPledgeAssets.length; i++) {
                    subjectPropertyPledgeAssets[i].getProperty().occupancyType = _this.occupancyType;
                }
            };
            /**
            * @desc Validates Assets tab for active Loan Application
            */
            this.isAssetsCompleted = function () {
                var financilas = _this.getCombinedAssetsFinancials();
                if (financilas.length != 0) {
                    for (var i = 0; i < financilas.length; i++) {
                        if ((!common.string.isNullOrWhiteSpace(financilas[i].accountNumber) && !common.string.isNullOrWhiteSpace(financilas[i].institiutionContactInfo.companyName) && financilas[i].monthlyAmount && financilas[i].monthlyAmount != 0) || financilas[i].assetType == 99 /* NotRequired */) {
                            return true;
                        }
                    }
                }
                return false;
            };
            /**
            * @desc Validates Credit tab for active Loan Application
            */
            this.isCreditTabCompleted = function (areSixPiecesCompleted) {
                if (!_this.credit || !_this.credit.isCreditReportValid())
                    return false;
                var realEstates = _this.getCombinedPledgedAssets();
                // if there ARE realEstates
                if (realEstates.length) {
                    for (var i = 0; i < realEstates.length; i++) {
                        if (!realEstates[i].isValid())
                            return false;
                    }
                    return true;
                }
                return true; //if credit report is valid, and no REO items are retrieved
            };
            /**
            * @desc Validates Declarations tab for active Loan Application
            */
            this.isDeclarationsCompleted = function () {
                var result = _this.isBorrowerDecalarationsCompleted(_this.getBorrower());
                if (_this.isSpouseOnTheLoan)
                    result = result && _this.isBorrowerDecalarationsCompleted(_this.getCoBorrower());
                return result;
            };
            /**
            * @desc Validates Income tab for active Loan Application
            */
            this.isIncomeCompleted = function () {
                var retVal = _this.isBorrowerIncomeCompleted(_this.getBorrower());
                if (_this.isSpouseOnTheLoan)
                    retVal = retVal && _this.isBorrowerIncomeCompleted(_this.getCoBorrower());
                return retVal;
            };
            this.isBorrowerIncomeCompleted = function (borrower) {
                var combinedIncomes = borrower.getCombinedCurrentAndAdditionalEmployments();
                if (!combinedIncomes || !combinedIncomes.length) {
                    return false;
                }
                var retVal = true;
                var otherIncomes = _this.getTransactionInfo().incomeInfo.getValues().filter(function (i) {
                    return (i.borrowerId == borrower.borrowerId);
                });
                for (var i in combinedIncomes) {
                    retVal = retVal && combinedIncomes[i].isCompleted();
                }
                if (borrower.getCurrentEmploymentInfo().EmploymentTypeId == 3 /* Retired */ || borrower.getCurrentEmploymentInfo().EmploymentTypeId == 4 /* OtherUnemployed */)
                    retVal = retVal && _this.validateRetiredAndUnemployedEmploymentTypes(borrower, otherIncomes);
                return retVal;
            };
            this.validateRetiredAndUnemployedEmploymentTypes = function (borrower, otherIncomes) {
                if (borrower.getCurrentEmploymentInfo().EmploymentTypeId == 3 /* Retired */)
                    return (otherIncomes.filter(function (income) {
                        return !income.isRemoved && (income.amount != 0);
                    }).length > 0) ? true : false;
                return true;
            };
            /**
            * @desc Validates if 6th piece of 6 pieces is acquired.
            */
            this.isIncomePieceAcquired = function () {
                var retVal = false;
                retVal = _this.validateIncomePieceForBorrower(_this.getBorrower());
                if (_this.getCoBorrower() && _this.isSpouseOnTheLoan)
                    retVal = retVal && _this.validateIncomePieceForBorrower(_this.getCoBorrower());
                return retVal;
            };
            this.validateCreditTabForBorrower = function (borrower) {
                //todo: fix - add realestate items list, remove reoproperty list
                if (borrower.reoPropertyList && borrower.reoPropertyList.length > 0) {
                    for (var key in borrower.reoPropertyList) {
                        if (!_this.validateRealEstateItem(borrower.reoPropertyList[key]))
                            return false;
                    }
                }
                return true;
            };
            this.validateRealEstateItem = function (reoPropertyItem) {
                return true;
            };
            this.validateIncomePieceForBorrower = function (borrower) {
                var hasOtherIncomes = _this.getTransactionInfo().incomeInfo.getValues().filter(function (i) {
                    return (i.borrowerId == borrower.borrowerId && !i.isRemoved && !!i.amount);
                }).length > 0;
                if (!borrower.getCurrentEmploymentInfo())
                    return false;
                return borrower && borrower.getCurrentEmploymentInfo() && borrower.getCurrentEmploymentInfo().getIncomeInformation() && borrower.getCurrentEmploymentInfo().getIncomeInformation().length > 0 && (borrower.getCurrentEmploymentInfo().EmploymentTypeId == 0 /* ActiveMilitaryDuty */ && borrower.getCurrentEmploymentInfo().incomeInfoByTypeId(11) && borrower.getCurrentEmploymentInfo().incomeInfoByTypeId(11).amount != 0) || (borrower.getCurrentEmploymentInfo().EmploymentTypeId == 2 /* SelfEmployed */ && (borrower.getCurrentEmploymentInfo().incomeInfoByTypeId(16) && borrower.getCurrentEmploymentInfo().incomeInfoByTypeId(16).amount != 0 || borrower.getCurrentEmploymentInfo().incomeInfoByTypeId(13) && borrower.getCurrentEmploymentInfo().incomeInfoByTypeId(13).amount != 0)) || (borrower.getCurrentEmploymentInfo().EmploymentTypeId == 1 /* SalariedEmployee */ && (borrower.getCurrentEmploymentInfo().incomeInfoByTypeId(0) && borrower.getCurrentEmploymentInfo().incomeInfoByTypeId(0).amount != 0 || borrower.getCurrentEmploymentInfo().incomeInfoByTypeId(13) && borrower.getCurrentEmploymentInfo().incomeInfoByTypeId(13).amount != 0)) || ((borrower.getCurrentEmploymentInfo().EmploymentTypeId == 3 /* Retired */) && hasOtherIncomes) || (borrower.getCurrentEmploymentInfo().EmploymentTypeId == 4 /* OtherUnemployed */);
            };
            this.areFieldsEntered = function (borrower) {
                return common.string.isNullOrWhiteSpace(borrower.firstName) || common.string.isNullOrWhiteSpace(borrower.lastName);
            };
            /**
            * @desc Returns flag whether tabs, other than Personal, are disabled
            */
            this.areTabsDisabled = function () {
                return (_this.isSpouseOnTheLoan ? (_this.areFieldsEntered(_this.getBorrower()) || _this.areFieldsEntered(_this.getCoBorrower())) : _this.areFieldsEntered(_this.getBorrower()));
            };
            /**
            * @desc Gets misc debts combined into one array, for the borrower and coBorrower.
            */
            this.getCombinedMiscDebts = function () {
                //
                //if (this.isSpouseOnTheLoan)
                //    return this.getMiscDebtsForBorrower(this.getBorrower()).concat(this.getMiscDebtsForBorrower(this.getCoBorrower()));
                //else
                //    return this.getMiscDebtsForBorrower(this.getBorrower());
                //
                var rslt = [];
                var b;
                if (!!(b = _this.getBorrower()))
                    rslt = rslt.concat(_this.getMiscDebtsForBorrower(b));
                if (_this.isSpouseOnTheLoan && !!(b = _this.getCoBorrower()))
                    rslt = rslt.concat(_this.getMiscDebtsForBorrower(b));
                return rslt;
            };
            /**
            * @desc Gets collections combined into one array, for the borrower and coBorrower.
            */
            this.getCombinedCollections = function () {
                if (_this.isSpouseOnTheLoan)
                    return _this.getCollectionsForBorrower(_this.getBorrower()).concat(_this.getCollectionsForBorrower(_this.getCoBorrower()));
                else
                    return _this.getCollectionsForBorrower(_this.getBorrower());
            };
            this.getAllLiabilitiesCombined = function () {
                var liabilities = _this.getBorrower().getLiabilities();
                if (_this.isSpouseOnTheLoan)
                    liabilities = liabilities.concat(_this.getCoBorrower().getLiabilities());
                return liabilities;
            };
            /**
            * @desc Gets liabilities combined into one array, for the borrower and coBorrower.
            */
            this.getCombinedLiability = function () {
                if (_this.isSpouseOnTheLoan)
                    return _this.getLiabilitiesForBorrower(_this.getBorrower()).concat(_this.getLiabilitiesForBorrower(_this.getCoBorrower()));
                else
                    return _this.getLiabilitiesForBorrower(_this.getBorrower());
            };
            /**
            * @desc Gets liabilities combined into one object, for the borrower and coBorrower.
            */
            this.getGroupedLiabilities = function () {
                return {
                    'Borrower': _this.getLiabilitiesForBorrower(_this.getBorrower()),
                    'Co-Borrower': _this.isSpouseOnTheLoan ? _this.getLiabilitiesForBorrower(_this.getCoBorrower()) : null
                };
            };
            this.refreshLiabilityLists = function () {
                //var borrowerList = this.getBorrower().getLiabilities().filter((item) => { return item.borrowerId == this.getBorrower().borrowerId });
                //var coBorrowerListInBorrower = this.getBorrower().getLiabilities().filter((item) => { return item.borrowerId == this.getCoBorrower().borrowerId });
                //var coBorrowerList = this.getCoBorrower().getLiabilities().filter((item) => { return item.borrowerId == this.getCoBorrower().borrowerId });
                //var borrowerListInCoBorrower = this.getCoBorrower().getLiabilities().filter((item) => { return item.borrowerId == this.getBorrower().borrowerId });
                //refresh lists
                //this.getBorrower().Liabilities = borrowerList.concat(borrowerListInCoBorrower);
                //this.getCoBorrower().Liabilities = coBorrowerList.concat(coBorrowerListInBorrower);
            };
            /**
            * @desc Gets pledged assets combined into one array, for the borrower and coBorrower (if it is active on loan).
            */
            this.getCombinedPledgedAssets = function () {
                var pred = function (l) { return !l.isRemoved && l.isPledged && !l.isSecondaryPartyRecord; };
                var reos = lib.filter(_this.getBorrower().getLiabilities(), pred);
                if (_this.isSpouseOnTheLoan)
                    reos = reos.concat(lib.filter(_this.getCoBorrower().getLiabilities(), pred));
                return reos;
            };
            /**
            * @desc Gets public records combined into one array, for the borrower and coBorrower.
            */
            this.getCombinedPublicRecords = function () {
                if (_this.combinedPublicRecordList == null) {
                    if (_this.isSpouseOnTheLoan)
                        _this.combinedPublicRecordList = _this.getPublicRecordsForBorrower(_this.getBorrower()).concat(_this.getPublicRecordsForBorrower(_this.getCoBorrower()));
                    else
                        _this.combinedPublicRecordList = _this.getPublicRecordsForBorrower(_this.getBorrower());
                }
                return _this.combinedPublicRecordList;
            };
            /**
            * @desc Moves the item under the borrower or coBorrower.
            */
            this.toggleBorrowerForItem = function (item, collectionOnBorrower, collectionOnCoBorrower, isJointAccount, deleteFromList) {
                var result = _this.getProperCollection(item, collectionOnBorrower, collectionOnCoBorrower);
                if (result) {
                    if (result.collection === 0 /* BORROWERS_COLLECTION */) {
                        if (!isJointAccount) {
                            common.moveItemTo(result.index, collectionOnBorrower, collectionOnCoBorrower);
                            _this.handleToggleBorrowerForItem(collectionOnBorrower, result.index, deleteFromList);
                        }
                    }
                    else if (result.collection === 1 /* COBORROWERS_COLLECTION */) {
                        common.moveItemTo(result.index, collectionOnCoBorrower, collectionOnBorrower);
                        _this.handleToggleBorrowerForItem(collectionOnCoBorrower, result.index, deleteFromList);
                    }
                }
            };
            this.handleToggleBorrowerForItem = function (collection, index, deleteFromList) {
                if (deleteFromList)
                    common.deleteItem(index, collection);
                else
                    collection[index].isRemoved = true;
            };
            this.switchBorrowerForMiscItem = function (item, collectionOnBorrower, collectionOnCoBorrower, isJointAccount) {
                var newMisc = angular.copy(item);
                newMisc.miscellaneousDebtId = null;
                var index = common.indexOfItem(item, collectionOnBorrower);
                if (index != -1) {
                    var borrowerMisc = collectionOnBorrower[index];
                    borrowerMisc.isRemoved = true;
                    collectionOnCoBorrower.push(newMisc);
                }
                var coIndex = common.indexOfItem(item, collectionOnCoBorrower);
                if (coIndex != -1) {
                    var coBorrowerMisc = collectionOnCoBorrower[coIndex];
                    coBorrowerMisc.isRemoved = true;
                    collectionOnBorrower.push(newMisc);
                }
            };
            this.toggleLiabilitiesByDebtsAccountOwnershipType = function (item, borrowerCol, coBorrowerCol, accountType) {
                var itemInCollection = _this.getProperCollection(item, borrowerCol, coBorrowerCol);
                if (accountType) {
                    if (itemInCollection.collection == 0 /* BORROWERS_COLLECTION */)
                        common.deleteItem(common.indexOfItem(item, borrowerCol), borrowerCol);
                    if (itemInCollection.collection == 1 /* COBORROWERS_COLLECTION */)
                        common.deleteItem(common.indexOfItem(item, coBorrowerCol), coBorrowerCol);
                    switch (parseInt(accountType)) {
                        case 2 /* Joint */:
                            borrowerCol.push(item);
                            break;
                        case 0 /* Borrower */:
                        case 3 /* BorrowerWithOther */:
                            borrowerCol.push(item);
                            break;
                        case 1 /* CoBorrower */:
                        case 4 /* CoBorrowerWithOther */:
                            coBorrowerCol.push(item);
                            break;
                        default:
                            borrowerCol.push(item);
                            break;
                    }
                }
            };
            /**
            * @desc Physically deletes provided item from any provided list
            */
            this.deleteFromCollection = function (item, borrowersCollection, coBorrowersCollection) {
                var result = _this.getProperCollection(item, borrowersCollection, coBorrowersCollection);
                if (result) {
                    if (result.collection === 0 /* BORROWERS_COLLECTION */) {
                        common.deleteItem(result.index, borrowersCollection);
                    }
                    else if (result.collection === 1 /* COBORROWERS_COLLECTION */) {
                        common.deleteItem(result.index, coBorrowersCollection);
                    }
                }
            };
            /**
            * @desc Sets isRemoved flag on item to true  for any provided collection
            */
            this.removeFromCollection = function (item, borrowersCollection, coBorrowersCollection) {
                var result = _this.getProperCollection(item, borrowersCollection, coBorrowersCollection);
                if (result) {
                    if (result.collection === 0 /* BORROWERS_COLLECTION */) {
                        borrowersCollection[result.index].isRemoved = true;
                    }
                    else if (result.collection === 1 /* COBORROWERS_COLLECTION */) {
                        coBorrowersCollection[result.index].isRemoved = true;
                    }
                }
            };
            /**
            * @desc Gets the assets combined into one array, for the borrower and coBorrower.
            */
            this.getCombinedAssetsCollection = function () {
                return _this.getCombinedAssets(_this.getBorrower(), _this.getCoBorrower());
            };
            /**
            * @desc Gets the assets automobiles combined into one array, for the borrower and coBorrower.
            */
            this.getCombinedAssetsAutomobiles = function () {
                var automobilesFunction = _this.getCombinedAutomobilesByBorrower;
                if (_this.isSpouseOnTheLoan == true)
                    return automobilesFunction(_this.getBorrower()).concat(automobilesFunction(_this.getCoBorrower()));
                return automobilesFunction(_this.getBorrower());
            };
            /**
            * @desc Gets the assets financials combined into one array, for the borrower and coBorrower.
            */
            this.getCombinedAssetsFinancials = function () {
                var financialsFunction = _this.getCombinedFinancialsByBorrower;
                if (_this.isSpouseOnTheLoan == true)
                    return financialsFunction(_this.getBorrower()).concat(financialsFunction(_this.getCoBorrower()));
                return financialsFunction(_this.getBorrower());
            };
            /**
            * @desc Gets the assets life insurenc combined into one array, for the borrower and coBorrower.
            */
            this.getCombinedAssetsLifeInsurence = function () {
                var lifeInsurenceFunction = _this.getCombinedLifeInsurenceByBorrower;
                if (_this.isSpouseOnTheLoan == true)
                    return lifeInsurenceFunction(_this.getBorrower()).concat(lifeInsurenceFunction(_this.getCoBorrower()));
                return lifeInsurenceFunction(_this.getBorrower());
            };
            this.collapseExpand = function (sectionName) {
                switch (sectionName) {
                    case 'BorrowerSection':
                        _this.isBorrowerSectionShown = !_this.isBorrowerSectionShown;
                        break;
                    case 'CoBorrowerSection':
                        _this.isCoBorrowerSectionShown = !_this.isCoBorrowerSectionShown;
                        break;
                    case 'TitleSection':
                        _this.isTitleSectionShown = !_this.isTitleSectionShown;
                        break;
                }
                //check if switch checkbox needs to be shown
                _this.isSwitchBorrowerCoBorrowerShown = _this.isCoBorrowerSectionShown && _this.isSpouseOnTheLoan;
            };
            //trigger marital status rules
            this.triggerMaritalStatusRules = function () {
                var sectionName = '';
                if (!_this.getBorrower())
                    return;
                switch (_this.getBorrower().maritalStatus.toString()) {
                    case '0':
                        _this.isSpouseOnTheLoan = true;
                        _this.isSwitchBorrowerCoBorrowerShown = true;
                        _this.isSpouseOnTheTitle = false;
                        if (!_this.isCoBorrowerSectionShown) {
                            sectionName = 'CoBorrowerSection';
                        }
                        break;
                    case '1':
                        _this.isSpouseOnTheLoan = false;
                        _this.isSwitchBorrowerCoBorrowerShown = false;
                        if (!_this.isCoBorrowerSectionShown) {
                            sectionName = 'CoBorrowerSection';
                        }
                        break;
                    case '2':
                        _this.isSwitchBorrowerCoBorrowerShown = false;
                        _this.isSpouseOnTheLoan = false;
                        if (_this.isCoBorrowerSectionShown) {
                            sectionName = 'CoBorrowerSection';
                        }
                        break;
                    case '-1':
                        if (_this.isCoBorrowerSectionShown) {
                            sectionName = 'CoBorrowerSection';
                        }
                        break;
                    default:
                        if (_this.isCoBorrowerSectionShown && !_this.isSpouseOnTheLoan && !_this.isSpouseOnTheTitle) {
                            sectionName = 'CoBorrowerSection';
                            _this.isSwitchBorrowerCoBorrowerShown = true;
                        }
                        break;
                }
                _this.collapseExpand(sectionName);
            };
            this.getUserAccountTooltipMessage = function (userAccount, spouseUsername, isSpouseOnline, isSpouseActivated) {
                var tooltipMassage = "";
                if (userAccount.username && _this.isSpouseOnTheLoan && userAccount.username == spouseUsername) {
                    if (!userAccount.username)
                        return tooltipMassage += "Joint Offline - No eMail address";
                    else if (!userAccount.isOnlineUser && !isSpouseOnline)
                        return tooltipMassage += "Joint  Offline - With eMail address";
                    else if (!userAccount.isActivated && !isSpouseActivated)
                        return tooltipMassage += "Joint Online - Not Activated";
                    else
                        return tooltipMassage += "Joint Online - Activated";
                }
                else {
                    if (!userAccount.username)
                        return tooltipMassage += "Offline - No eMail address";
                    else if (!userAccount.isOnlineUser)
                        return tooltipMassage += "Offline - With eMail address";
                    else if (!userAccount.isActivated)
                        return tooltipMassage += "Online - Not Activated";
                    else
                        return tooltipMassage += "Online - Activated";
                }
            };
            //when spouse on the loan changes, update flags
            this.onIsSpouseOnTheLoanChange = function (triggerTitleChange) {
                if (_this.isSpouseOnTheLoan) {
                    _this.isSwitchBorrowerCoBorrowerShown = true;
                    _this.isSpouseOnTheTitle = false;
                    _this.initializeCoBorrowerAddresses();
                }
                else {
                    _this.isSpouseOnTheTitle = false;
                    _this.isSwitchBorrowerCoBorrowerShown = false;
                }
            };
            this.initializeCoBorrowerAddresses = function () {
                //
                // @todo-cl::PROPERTY-ADDRESS
                //
                //if (this.getCoBorrower().getCurrentAddress().isEmpty() || this.getCoBorrower().getCurrentAddress().isAddressEqual(this.getBorrower().currentAddress))
                //    this.getCoBorrower().currentAddress = this.getBorrower().currentAddress;
                //if (this.getCoBorrower().mailingAddress.isEmpty() || this.getCoBorrower().mailingAddress.isAddressEqual(this.getCoBorrower().currentAddress)) {
                //    this.getCoBorrower().mailingAddress.isSameAsPropertyAddress = true;
                //    this.getCoBorrower().mailingAddress = this.getCoBorrower().currentAddress;
                //}
            };
            /**
            * @desc Private function that validates borrower address sections
            */
            this.isBorrowerCoBorrowerAddressSectionsCompleted = function (borrower) {
                var result;
                var currentAddress = borrower.getCurrentAddress();
                var mailingAddress = borrower.getMailingAddress();
                // Current Address
                if (currentAddress.isSameAsPropertyAddress)
                    currentAddress = _this.getTransactionInfo().getLoan().getSubjectProperty();
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
            };
            /**
            * @desc Private function that validates borrower or coborrower declarations
            */
            this.isBorrowerDecalarationsCompleted = function (borrower) {
                var result;
                result = (_this.declarations.loanOriginatorSource != null && _this.declarations.loanOriginatorSource.toString() != "") && (borrower.declarationsInfo.additionalInformationCheckboxIndicator == false || borrower.declarationsInfo.additionalInformationCheckboxIndicator == true);
                if (borrower.declarationsInfo.additionalInformationCheckboxIndicator == false) {
                    result = result && (borrower.declarationsInfo.ethnicityId != null && borrower.declarationsInfo.ethnicityId.toString() != "") && (borrower.declarationsInfo.race != null && borrower.declarationsInfo.race.toString() != "") && (borrower.declarationsInfo.sexId != null && borrower.declarationsInfo.sexId.toString() != "");
                }
                result = result && (borrower.declarationsInfo.outstandingJudgmentsIndicator == 0 || borrower.declarationsInfo.outstandingJudgmentsIndicator == 1) && (borrower.declarationsInfo.bankrupcyIndicator == 0 || borrower.declarationsInfo.bankrupcyIndicator == 1) && (borrower.declarationsInfo.propertyForeclosedIndicator == 0 || borrower.declarationsInfo.propertyForeclosedIndicator == 1) && (borrower.declarationsInfo.partyToLawsuitIndicator == 0 || borrower.declarationsInfo.partyToLawsuitIndicator == 1) && (borrower.declarationsInfo.obligatedLoanIndicator == 0 || borrower.declarationsInfo.obligatedLoanIndicator == 1) && (borrower.declarationsInfo.presentlyDelinquentIndicator == 0 || borrower.declarationsInfo.presentlyDelinquentIndicator == 1) && (borrower.declarationsInfo.alimonyChildSupportObligation == 0 || borrower.declarationsInfo.alimonyChildSupportObligation == 1) && (borrower.declarationsInfo.downPaymentIndicator == 0 || borrower.declarationsInfo.downPaymentIndicator == 1) && (borrower.declarationsInfo.noteEndorserIndicator == 0 || borrower.declarationsInfo.noteEndorserIndicator == 1) && (borrower.usCitizen == true || borrower.usCitizen == false) && (borrower.permanentAlien == true || borrower.permanentAlien == false) && (borrower.declarationsInfo.propertyAsPrimaryResidence == 0 || borrower.declarationsInfo.propertyAsPrimaryResidence == 1) && (borrower.declarationsInfo.ownershipInterestLastThreeYears == 0 || borrower.declarationsInfo.ownershipInterestLastThreeYears == 1);
                if (borrower.declarationsInfo.ownershipInterestLastThreeYears == 0) {
                    result = result && (borrower.declarationsInfo.typeOfProperty != null && borrower.declarationsInfo.typeOfProperty.toString() != "") && (borrower.declarationsInfo.priorPropertyTitleType != null && borrower.declarationsInfo.priorPropertyTitleType.toString() != "");
                }
                if (_this.declarations.loanOriginatorSource == 0) {
                    var dateBefore, dateAfter;
                    if (borrower.declarationsInfo.dateIssued != null)
                        dateBefore = moment(borrower.declarationsInfo.dateIssued).format('MM/DD/YYYY');
                    if (borrower.declarationsInfo.dateExpired != null)
                        dateAfter = moment(borrower.declarationsInfo.dateExpired).format('MM/DD/YYYY');
                    result = result && borrower.declarationsInfo.certificationId != null && result && borrower.declarationsInfo.certificationId != 14 /* Other */ && borrower.declarationsInfo.numberId != null && borrower.declarationsInfo.stateId != null && new Date(dateBefore) < new Date(dateAfter) && new Date(dateBefore).getFullYear() >= 1900 && new Date(dateAfter).getFullYear() >= 1900 || borrower.declarationsInfo.certificationId == 14 /* Other */ && borrower.declarationsInfo.otherInformation != "";
                }
                return result;
            };
            /**
            * @desc Private function that validates subject property section
            */
            this.isSubjectPropertySectionCompleted = function (subjectProperty, loanType, loanAmount, downPaymentTypeCode) {
                var result;
                //
                // @todo: How can be passed in null?
                //
                if (!subjectProperty)
                    return false;
                result = (!common.string.isNullOrWhiteSpace(subjectProperty.cityName) && !common.string.isNullOrWhiteSpace(subjectProperty.countyName) && !common.string.isNullOrWhiteSpace(subjectProperty.stateName) && !common.string.isNullOrWhiteSpace(subjectProperty.streetName) && !common.string.isNullOrWhiteSpace(subjectProperty.zipCode) && subjectProperty.purchasePrice > 0 && subjectProperty.monthlyHOAdues >= 0 && loanAmount > 0);
                if (+subjectProperty.propertyType == 2 /* Condominium */)
                    result = result && subjectProperty.numberOfStories > 0;
                if (loanType === 1 /* Purchase */) {
                    result = result && subjectProperty.downPayment >= 0 && !!downPaymentTypeCode;
                    if (_this.occupancyType == 2 /* InvestmentProperty */)
                        result = result && subjectProperty.grossRentalIncome >= 0 && subjectProperty.OwnershipPercentage > 0 && subjectProperty.vacancyPercentage > 0;
                }
                else if (loanType == 2 /* Refinance */) {
                    result = result && subjectProperty.purchaseDate && (subjectProperty.currentEstimatedValue > 0 && subjectProperty.purchaseDate != null);
                }
                return result;
            };
            this.getBorrowerDebtAccountOwnershipTypes = function (loanApplication) {
                var debtAccountOwnershipTypes = new Array();
                debtAccountOwnershipTypes.push(new cls.LookupItem(loanApplication.getBorrower().fullName, String(0 /* Borrower */)));
                if (loanApplication.isSpouseOnTheLoan) {
                    debtAccountOwnershipTypes.push(new cls.LookupItem(loanApplication.getBorrower().fullName + ", " + loanApplication.getCoBorrower().fullName, String(2 /* Joint */)));
                }
                else
                    debtAccountOwnershipTypes.push(new cls.LookupItem(loanApplication.getBorrower().fullName + " with Other", String(3 /* BorrowerWithOther */)));
                return debtAccountOwnershipTypes;
            };
            this.Borrowers = function (includeJointAccount, useBorrowerId, useFullNamesForJointAccount) {
                if (includeJointAccount === void 0) { includeJointAccount = true; }
                _this.borrowers = [];
                _this.borrowers.push(_this.populateBorrowerLookup(_this.getBorrower(), useBorrowerId));
                if (_this.isSpouseOnTheLoan) {
                    _this.borrowers.push(_this.populateBorrowerLookup(_this.getCoBorrower(), useBorrowerId));
                    if (includeJointAccount) {
                        var jointAccountText = 'Joint Account';
                        if (useFullNamesForJointAccount)
                            jointAccountText = _this.getBorrower().fullName + ', ' + _this.getCoBorrower().fullName;
                        _this.borrowers.push({ value: 'JointAccount', text: jointAccountText, selected: false, disabled: false, stringValue: null, description: null });
                    }
                }
                _this.borrowerLookupList = _this.borrowers;
                return _this.borrowers;
            };
            this.LiabilitiesFor = function () {
                _this.liabilitiesFor = [];
                _this.liabilitiesFor.push({ value: 'Borrower', text: _this.getBorrower().fullName, selected: true, disabled: false, stringValue: null, description: null });
                if (_this.isSpouseOnTheLoan) {
                    _this.liabilitiesFor.push({ value: 'CoBorrower', text: _this.getCoBorrower().fullName, selected: false, disabled: false, stringValue: null, description: null });
                    var jointAccountText = _this.getBorrower().fullName + ', ' + _this.getCoBorrower().fullName;
                    _this.liabilitiesFor.push({ value: 'Joint', text: jointAccountText, selected: false, disabled: false, stringValue: null, description: null });
                }
                return _this.liabilitiesFor;
            };
            this.borrowerList = function (useBorrowerId) {
                _this._borrowerList = [];
                _this._borrowerList.push(_this.populateBorrowerLookup(_this.getBorrower(), useBorrowerId));
                if (_this.isSpouseOnTheLoan) {
                    _this._borrowerList.push(_this.populateBorrowerLookup(_this.getCoBorrower(), useBorrowerId));
                }
                return _this._borrowerList;
            };
            this.borrowerJointList = function () {
                _this._borrowerJointList = [];
                _this._borrowerJointList.push({ value: _this.getBorrower().fullName, text: _this.getBorrower().fullName, selected: false, disabled: false, stringValue: null, description: null });
                if (_this.isSpouseOnTheLoan) {
                    _this._borrowerJointList.push({ value: _this.getCoBorrower().fullName, text: _this.getCoBorrower().fullName, selected: false, disabled: false, stringValue: null, description: null });
                    _this._borrowerJointList.push({ value: _this.getBorrower().fullName + ', ' + _this.getCoBorrower().fullName, text: _this.getBorrower().fullName + ', ' + _this.getCoBorrower().fullName, selected: false, disabled: false, stringValue: null, description: null });
                }
                return _this._borrowerJointList;
            };
            /**
            * @desc Gets collection in which item exists
            */
            this.getProperCollection = function (item, borrowersCollection, coBorrowersCollection) {
                var collectionType = 0 /* BORROWERS_COLLECTION */;
                var index = common.indexOfItem(item, borrowersCollection);
                if (index === -1) {
                    index = common.indexOfItem(item, coBorrowersCollection);
                    collectionType = 1 /* COBORROWERS_COLLECTION */;
                }
                // Nothing found in both collections.
                if (index === -1)
                    return null;
                return { collection: collectionType, index: index };
            };
            this.getOtherIncomeForBorrower = function (borrower) {
                return borrower.getOtherIncome();
            };
            this.getCombinedAutomobilesByBorrower = function (borrower) {
                return borrower.getAutomobiles();
            };
            this.getCombinedFinancialsByBorrower = function (borrower) {
                return borrower.getFinancials();
            };
            this.getCombinedLifeInsurenceByBorrower = function (borrower) {
                return borrower.getLifeInsurance();
            };
            this.getCombinedAssets = function (borrower, coBorrower) {
                var borrowerAssets = borrower.getAssets(), coBorrowerAssets = coBorrower.getAssets();
                return borrowerAssets.concat(coBorrowerAssets);
            };
            this.getMiscDebtsForBorrower = function (borrower) {
                return borrower.populateBorrowerId(borrower.getMiscDebts());
            };
            this.getCollectionsForBorrower = function (borrower) {
                return borrower.populateBorrowerId(borrower.getCollections());
            };
            this.getLiabilitiesForBorrower = function (borrower) {
                return borrower.populateBorrowerId(borrower.getLiability());
            };
            this.getPublicRecordsForBorrower = function (borrower) {
                return borrower.getPublicRecords();
            };
            /**
            * @desc Refreshes realEstate based on response from service
            */
            this.refreshRealEstate = function (updatedLoanApplication) {
                _this.realEstate.addressForDropDown = updatedLoanApplication.realEstate.addressForDropDown;
            };
            this.prepareForSubmit = function () {
                _this.getBorrower().prepareForSubmit();
                _this.getCoBorrower().prepareForSubmit();
            };
            this.initialize = function (loanApplication) {
                if (loanApplication) {
                    // @todo-cl::BOROWER-ADDRESS
                    //if (loanApplication.getCoBorrower()) {
                    //    // Handle coborrower addresses
                    //    if (this.isSpouseOnTheLoan) {
                    //        this.initializeCoBorrowerAddresses();
                    //    }
                    //}
                    if (loanApplication.documents) {
                        for (var i = 0; i < _this.documents.length; i++) {
                            _this.documents[i] = new cls.DocumentsViewModel(_this.documents[i]);
                        }
                    }
                    _this.titleInfo = new cls.TitleInformationViewModel(loanApplication.titleInfo);
                    _this.credit = new cls.CreditViewModel(_this.credit);
                    // Initialize disclosure status display text
                    if (_this.disclosureStatusDetails && _this.disclosureStatusDetails.disclosureStatus) {
                        _this.setDisclosureStatusTitle();
                    }
                    else {
                        _this.disclosureStatusDetails = {};
                    }
                }
                else {
                    _this.setBorrower(new cls.BorrowerViewModel(_this.getTransactionInfo(), null));
                    _this.setCoBorrower(new cls.BorrowerViewModel(_this.getTransactionInfo(), null));
                    if (_this.hasTransactionInfo()) {
                        _this.getBorrower().setCurrentEmploymentInfo(new cls.CurrentEmploymentInfoViewModel(_this.getTransactionInfo(), null));
                        _this.getCoBorrower().setCurrentEmploymentInfo(new cls.CurrentEmploymentInfoViewModel(_this.getTransactionInfo(), null));
                        _this.getCoBorrower().isEmployedTwoYears = true;
                        _this.getBorrower().isEmployedTwoYears = true;
                    }
                    _this.isPrimary = false;
                    _this.isCoBorrowerSectionShown = false;
                    _this.triggerMaritalStatusRules();
                    _this.onIsSpouseOnTheLoanChange(false);
                    _this.credit = new cls.CreditViewModel();
                }
                if (!_this.titleInfo)
                    _this.titleInfo = new cls.TitleInformationViewModel();
                if (!_this.miscDebts)
                    _this.miscDebts = [];
                if (!_this.collections)
                    _this.collections = [];
                if (!_this.realEstate)
                    _this.realEstate = new cls.RealEstateViewModel();
                if (!_this.declarations)
                    _this.declarations = new cls.DeclarationViewModel();
                if (!_this.appraisedValueHistories)
                    _this.appraisedValueHistories = [];
                var miscDebtsCombined = _this.getCombinedMiscDebts();
                // add two misc empty items by default if liabilites - miscExpanses is empty
                if (miscDebtsCombined) {
                    if (miscDebtsCombined.length === 0) {
                        var b = _this.getBorrower();
                        if (!!b) {
                            var fullNameBorrower = b.getFullName();
                            var childAlimonyDefault = new cls.MiscellaneousDebtViewModel(null, 1 /* ChildCareExpensesForVALoansOnly */, false, fullNameBorrower);
                            var jobExpenseDefault = new cls.MiscellaneousDebtViewModel(null, 2 /* Expenses2106FromTaxReturns */, false, fullNameBorrower);
                            childAlimonyDefault.isDefaultValue = true;
                            jobExpenseDefault.isDefaultValue = true;
                            jobExpenseDefault.clientIdForOrder = -1;
                            childAlimonyDefault.clientIdForOrder = -2;
                            b.miscellaneousDebt.push(childAlimonyDefault, jobExpenseDefault);
                        }
                    }
                    else {
                        var childAlimony = miscDebtsCombined.filter(function (item) {
                            return item.typeId === 1 /* ChildCareExpensesForVALoansOnly */;
                        });
                        var jobRelatedExpense = miscDebtsCombined.filter(function (item) {
                            return item.typeId === 2 /* Expenses2106FromTaxReturns */;
                        });
                        // if childAlimony is empty add a default child item in misc     
                        if (childAlimony.length === 0) {
                            var childAlimonyDefault = new cls.MiscellaneousDebtViewModel(null, 1 /* ChildCareExpensesForVALoansOnly */, false, _this.getBorrower().getFullName());
                            childAlimonyDefault.isDefaultValue = true;
                            childAlimonyDefault.clientIdForOrder = -2;
                            _this.getBorrower().miscellaneousDebt.push(childAlimonyDefault);
                        }
                        // if jobRelatedExp is empty add a default job item in misc
                        if (jobRelatedExpense.length === 0) {
                            var jobExpenseDefault = new cls.MiscellaneousDebtViewModel(null, 2 /* Expenses2106FromTaxReturns */, false, _this.getBorrower().getFullName());
                            jobExpenseDefault.isDefaultValue = true;
                            jobExpenseDefault.clientIdForOrder = -1;
                            _this.getBorrower().miscellaneousDebt.push(jobExpenseDefault);
                        }
                    }
                }
                //initialize flags   
                if (!_this.occupancyType) {
                    _this.occupancyType = 1 /* PrimaryResidence */;
                }
                _this.defaultCurrentAddress(_this.getBorrower());
                _this.defaultMailingAddress(_this.getBorrower());
                _this.defaultCurrentAddress(_this.getCoBorrower());
                _this.defaultMailingAddress(_this.getCoBorrower());
                _this.isFirstAndLastNameEnteredForBorrowers = true;
                _this.isBorrowerSectionShown = true;
                _this.isCoBorrowerSectionShown = ((!!_this.getBorrower() && (_this.getBorrower().maritalStatus == 0 || _this.getBorrower().maritalStatus == 1)) || _this.isSpouseOnTheLoan || _this.isSpouseOnTheTitle) ? true : false; // married or seperated
                _this.isTitleSectionShown = true;
                _this.isSwitchBorrowerCoBorrowerShown = _this.isCoBorrowerSectionShown && _this.isSpouseOnTheLoan;
                _this.howDidYouHearAboutUsEnabled = _this.howDidYouHearAboutUs == null;
                if (_this.titleInfo && _this.titleInfo.titleHeldIn == 0)
                    _this.showNamesAndManner = true;
                else
                    _this.showNamesAndManner = false;
                _this.initializeCredit();
            };
            this.defaultCurrentAddress = function (borrower) {
                if (borrower.isCoBorrower && (!angular.isDefined(borrower.getCurrentAddress().isSameAsPrimaryBorrowerCurrentAddress) || borrower.getCurrentAddress().isSameAsPrimaryBorrowerCurrentAddress == null)) {
                    borrower.getCurrentAddress().isSameAsPrimaryBorrowerCurrentAddress = true;
                }
                if (borrower.isCoBorrower && borrower.getCurrentAddress().isSameAsPrimaryBorrowerCurrentAddress) {
                    borrower.getCurrentAddress().timeAtAddressYears = null;
                    borrower.getCurrentAddress().timeAtAddressMonths = null;
                    borrower.getMailingAddress().isSameMailingAsBorrowerCurrentAddress = true;
                }
                if (!borrower.getCurrentAddress().ownership) {
                    borrower.getCurrentAddress().ownership = 0 /* Own */;
                }
            };
            this.defaultMailingAddress = function (borrower) {
                if (!angular.isDefined(borrower.getMailingAddress().isSameMailingAsBorrowerCurrentAddress) || borrower.getMailingAddress().isSameMailingAsBorrowerCurrentAddress == null) {
                    borrower.getMailingAddress().isSameMailingAsBorrowerCurrentAddress = true;
                }
            };
            this.setDisclosureStatusTitle = function () {
                switch (_this.disclosureStatusDetails.disclosureStatus) {
                    case 2 /* InitialDisclosureRequired */:
                    case 4 /* RequestInProgress */:
                        _this.disclosureStatusDetails.disclosureStatusText = "Initial Disclosure Required";
                        break;
                    case 3 /* ReDisclosureRequired */:
                        _this.disclosureStatusDetails.disclosureStatusText = "Re-Disclosure Required";
                        break;
                    case 5 /* DisclosuresCreated */:
                        _this.disclosureStatusDetails.disclosureStatusText = "Disclosures Created";
                        break;
                    default:
                        _this.disclosureStatusDetails.disclosureStatusText = "Not Needed";
                        break;
                }
            };
            this.setCompanyDataName = function (source) {
                var action = function (liability) { return liability.companyData.companyName = (liability.typeId == 2 /* Liability */ || liability.typeId == 3 /* Collection */) && !liability.companyData.companyName && !liability.isNewRow ? "Not specified" : liability.companyData.companyName; };
                lib.forEach(source, action);
            };
            this.createBorrowersLiabilities = function (borrower, coBorrower) {
                var borrowersLiabilities = [];
                // var pred = liability => !liability.isRemove && liability.typeId == cls.LiablitityTypeEnum.Liability && !liability.isPledged;
                if (borrower) {
                    borrowersLiabilities.push({ borrowerFullName: borrower.fullName, isBorrower: true, liabilities: borrower.getLiabilities() });
                }
                if (coBorrower && _this.isSpouseOnTheLoan) {
                    borrowersLiabilities.push({ borrowerFullName: coBorrower.fullName, isBorrower: false, liabilities: coBorrower.getLiabilities() });
                }
                return borrowersLiabilities;
            };
            this.initializeCredit = function () {
                if (!_this.getBorrower())
                    return;
                var allLiabilities = _this.getBorrower().getLiabilities();
                // @todo-cc: Why do we only set Company Data Name for the Borrower::Liablities and not the CoBorrower::Liabilities ?
                _this.setCompanyDataName(allLiabilities);
                if (_this.isSpouseOnTheLoan && _this.getCoBorrower() && _this.getCoBorrower().getLiabilities())
                    allLiabilities = allLiabilities.concat(_this.getCoBorrower().getLiabilities());
                var allPublicRecords = _this.getBorrower().publicRecords;
                if (_this.isSpouseOnTheLoan && _this.getCoBorrower() && _this.getCoBorrower().publicRecords)
                    allPublicRecords = allPublicRecords.concat(_this.getCoBorrower().publicRecords);
                _this.publicRecords = allPublicRecords;
                _this.collections = lib.filter(allLiabilities, function (liability) { return !liability.isRemoved && liability.typeId == 3 /* Collection */ && !liability.isPledged; });
                _this.reos = lib.filter(allLiabilities, function (liability) { return !liability.isRemoved && liability.isPledged; });
                _this.borrowerLiabilities = _this.createBorrowersLiabilities(_this.getBorrower(), _this.getCoBorrower());
            };
            this.borrowerHasChildAlimony = function () {
                return _this.getMiscDebtsForBorrower(_this.getBorrower()).filter(function (item) {
                    return item.typeId == 1 /* ChildCareExpensesForVALoansOnly */ && (!item.isDefaultValue || item.isDefaultValue === undefined || item.payee != "") && !item.isRemoved;
                }).length > 0;
            };
            this.coBorrowerHasChildAlimony = function () {
                return _this.getMiscDebtsForBorrower(_this.getCoBorrower()).filter(function (item) {
                    return item.typeId == 1 /* ChildCareExpensesForVALoansOnly */ && (!item.isDefaultValue || item.isDefaultValue === undefined || item.payee != "") && !item.isRemoved;
                }).length > 0;
            };
            this.addDefaultChildAlimonyIfLastRemoved = function () {
                if (_this.getBorrower().miscellaneousDebt) {
                    var childAlimonyBorrower = _this.getBorrower().miscellaneousDebt.filter(function (item) {
                        return item.typeId == 1 /* ChildCareExpensesForVALoansOnly */ && !item.isRemoved;
                    });
                    var childAlimonyCoBorrower = _this.getCoBorrower().miscellaneousDebt.filter(function (item) {
                        return item.typeId == 1 /* ChildCareExpensesForVALoansOnly */ && !item.isRemoved;
                    });
                    // if childAlimony is empty add a default child item in misc     
                    if (childAlimonyBorrower.length === 0 && childAlimonyCoBorrower.length === 0) {
                        var childAlimonyDefault = new cls.MiscellaneousDebtViewModel(null, 1 /* ChildCareExpensesForVALoansOnly */, false, _this.getBorrower().getFullName());
                        childAlimonyDefault.isDefaultValue = true;
                        childAlimonyDefault.clientIdForOrder = -2;
                        _this.getBorrower().miscellaneousDebt.push(childAlimonyDefault);
                    }
                }
            };
            // TODO: Remove this. Email validation should be used as a common helper function, or by using the impEmail directive. It is not part of the loanApplication state.
            this.validateEmail = function (email) {
                var reg = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
                return reg.test(email) || email == null || email == undefined;
            };
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
        Object.defineProperty(LoanApplicationViewModel.prototype, "OccupancyType", {
            get: function () {
                return this.occupancyType;
            },
            set: function (value) {
                this.occupancyType = value;
                // Set FHA flag if not investment property.
                if (this.isPrimary) {
                    var loan = this.getTransactionInfo().getLoan();
                    if (loan && loan.fhaScenarioViewModel && value != 2 /* InvestmentProperty */) {
                        loan.fhaScenarioViewModel.isPropertyAdjacent = false;
                    }
                }
                // @todo-cl::PROPERTY-ADDRESS
                //this.processSubjectPropertyAndCurrentAddressRules();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LoanApplicationViewModel.prototype, "groupedLiabilities", {
            get: function () {
                if (!this._groupedLiabilities) {
                    this._groupedLiabilities = this.getGroupedLiabilities();
                }
                return this._groupedLiabilities;
            },
            set: function (groupedLiabilities) {
                this._groupedLiabilities = groupedLiabilities;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LoanApplicationViewModel.prototype, "getReoEstimatedValueTotal", {
            /**
            * @desc Get Reo items totals
            */
            get: function () {
                var total = 0;
                angular.forEach(this.getCombinedPledgedAssets(), function (reoItem) {
                    if (!reoItem.notMyLoan && reoItem.borrowerDebtCommentId != 9 /* Duplicate */ && !reoItem.isRemoved && reoItem.getProperty() && reoItem.getProperty().currentEstimatedValue && (!reoItem.lienPosition || reoItem.lienPosition == -1 || reoItem.lienPosition == 1)) {
                        var amount = parseFloat(reoItem.getProperty().currentEstimatedValue.toString());
                        if (!amount || isNaN(amount))
                            amount = 0;
                        total += parseFloat(String(amount));
                    }
                });
                return total;
            },
            enumerable: true,
            configurable: true
        });
        LoanApplicationViewModel.prototype.getLiabilitesPaymentTotal = function (borrower) {
            var list;
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
        };
        /**
       * @desc Get Collections totals
       */
        LoanApplicationViewModel.prototype.getCollectionsTotalUnpaidBalance = function () {
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
        };
        LoanApplicationViewModel.prototype.getCollectionsTotalPayment = function () {
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
        };
        Object.defineProperty(LoanApplicationViewModel.prototype, "OwnershipPercentage", {
            get: function () {
                if (!this.ownershipPercentage) {
                    return 0;
                }
                else {
                    return this.ownershipPercentage;
                }
            },
            set: function (value) {
                if (!value) {
                    this.ownershipPercentage = 0;
                }
                else {
                    this.ownershipPercentage = value;
                }
            },
            enumerable: true,
            configurable: true
        });
        LoanApplicationViewModel.prototype.populateBorrowerLookup = function (borrower, useBorrowerId) {
            return { value: useBorrowerId ? borrower.borrowerId : borrower.firstName + ' ' + borrower.lastName, text: borrower.firstName + ' ' + borrower.lastName, selected: false, disabled: false, stringValue: null, description: null };
        };
        return LoanApplicationViewModel;
    })(srv.cls.LoanApplicationViewModel);
    cls.LoanApplicationViewModel = LoanApplicationViewModel;
})(cls || (cls = {}));
//# sourceMappingURL=loanApplication.extendedViewModel.js.map