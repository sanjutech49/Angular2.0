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
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var cls;
(function (cls) {
    var LoanViewModel = (function (_super) {
        __extends(LoanViewModel, _super);
        function LoanViewModel(loan, $filter, isWholeSale) {
            var _this = this;
            if (isWholeSale === void 0) { isWholeSale = false; }
            _super.call(this);
            this.loan = loan;
            this.$filter = $filter;
            this.isWholeSale = isWholeSale;
            this.recoupmentPeriodCalculated = new srv.cls.RecoupmentPeriodResponse();
            this.prepareSave = function () {
                var foo = _this.getTransactionInfo;
                foo().prepareSave();
            };
            this.getPropertyMap = function () {
                // @todo-cc: Use Lib
                var ti = _this.getTransactionInfo();
                if (ti && ti.property) {
                    return ti.property;
                }
                throw new Error("LoanExtendedViewModel: getPropertyMap is not available");
            };
            this.hasTransactionInfo = function () {
                return (!!_this.getTransactionInfo && !!_this.getTransactionInfo());
            };
            this.getTransactionInfoRef = function () {
                if (_this.hasTransactionInfo()) {
                    return _this.getTransactionInfo();
                }
                else {
                    return null;
                }
            };
            this.hasTransactionInfoLoanApplication = function () {
                return (_this.hasTransactionInfo() && !!_this.getTransactionInfoRef().loanApplication);
            };
            this.getTransactionInfoLoanApplication = function () {
                if (_this.hasTransactionInfoLoanApplication()) {
                    return _this.getTransactionInfoRef().loanApplication;
                }
                return new cls.Map();
            };
            this.getLoanApplications = function (excludeActive) {
                if (excludeActive === void 0) { excludeActive = false; }
                var loanApplications = [];
                if (_this.hasTransactionInfoLoanApplication()) {
                    loanApplications = _this.getTransactionInfoLoanApplication().getValues();
                }
                if (excludeActive) {
                    if (!!loanApplications && loanApplications.length > 0) {
                        loanApplications = lib.filter(loanApplications, function (la) { return la.loanApplicationId != _this.active.loanApplicationId; });
                    }
                }
                return loanApplications;
            };
            this.vaTabEnabled = function () {
                return _this.financialInfo && _this.financialInfo.mortgageType == 4 /* VA */;
            };
            this.setLoanApplications = function (loanApplicationList) {
                if (!loanApplicationList || !_this.hasTransactionInfoLoanApplication())
                    return;
                _this.getTransactionInfoLoanApplication().mapAll(loanApplicationList);
            };
            this.getActiveApplication = function () {
                return _this.active;
            };
            this.doesYourAgentAlsoRepresentsSeller = false;
            /**
            * @desc Gets remaining ownership percentage available for investment properties.
            */
            this.remainingOwnershipCalculation = function (excludeActiveLoanApplication) {
                if (excludeActiveLoanApplication === void 0) { excludeActiveLoanApplication = true; }
                var loanApplications = _this.getLoanApplications(excludeActiveLoanApplication);
                var investmentPropertyLoanApplications = lib.filter(loanApplications, function (la) { return la.OccupancyType == 2 /* InvestmentProperty */; });
                var totalOwnership = 0;
                lib.forEach(investmentPropertyLoanApplications, function (la) { return totalOwnership += la.OwnershipPercentage; });
                var remainingOwnership = 0;
                remainingOwnership = 100 - totalOwnership;
                if (remainingOwnership < 0) {
                    return 0;
                }
                else {
                    return remainingOwnership;
                }
            };
            this.ownershipLastThreeYears = function () {
                //purchase
                if (_this.active && _this.active.occupancyType == 1 /* PrimaryResidence */ && _this.loanPurposeType == 1 /* Purchase */) {
                    return 1; //No is selected
                }
                //refinance
                if (_this.active && _this.active.occupancyType == 1 /* PrimaryResidence */ && _this.loanPurposeType == 2 /* Refinance */) {
                    return 0; //Yes is selected
                }
                return null;
            };
            this.getCombinedPledgedAssetsForAll1003s = function () {
                var loanApplications = _this.getLoanApplications(false);
                var combinedPledgedAssetsForAll1003s = [];
                angular.forEach(loanApplications, function (loanApp) {
                    if (loanApp) {
                        combinedPledgedAssetsForAll1003s = combinedPledgedAssetsForAll1003s.concat(loanApp.getCombinedPledgedAssets());
                    }
                });
                return combinedPledgedAssetsForAll1003s;
            };
            this.areSixPiecesAcquiredForCurrentLoanApplication = function () {
                return _this.allPiecesAcquiredForCurrentLoanApplication() && _this.homeBuyingType != 3 /* GetPreApproved */;
            };
            this.allPiecesAcquiredForCurrentLoanApplication = function () {
                return _this.active.areSixPiecesOfLoanApplicationCompleted() && _this.isPropertyPieceAcquired();
            };
            /**
            * @desc Validates if 6 pieces are acquired for all loan applications
            */
            this.isLoanApplicationCompleted = function (loanApplication) {
                return loanApplication.isLoanApplicationCompleted(_this.getSubjectProperty(), _this.loanPurposeType, _this.loanAmount, !_this.active.getCoBorrower().getCurrentAddress().isSameAsPrimaryBorrowerCurrentAddress, _this.financialInfo.downPaymentTypeCode, _this.areSixPiecesAcquiredForCurrentLoanApplication());
            };
            this.disableRunCreditButton = function () {
                if (!angular.isDefined(_this.subjectProperty)) {
                    return true;
                }
                if (_this.subjectProperty.stateId != 46 /* Washington */) {
                    return false;
                }
                if (_this.allPiecesAcquiredForCurrentLoanApplication() && _this.subjectProperty.stateId == 46 /* Washington */) {
                    return false;
                }
                return true;
            };
            this.allLoanAppsCompleted = function () {
                var allLoanAppsCompleted = true;
                for (var i = 0; i < _this.getLoanApplications().length; i++) {
                    var loanApplication = _this.getLoanApplications()[i];
                    var loanAppCompleted = _this.isLoanApplicationCompleted(loanApplication);
                    allLoanAppsCompleted = allLoanAppsCompleted && loanAppCompleted;
                }
                return allLoanAppsCompleted;
            };
            this.areSixPiecesAcquiredForAllLoanApplications = function () {
                _this.sixPiecesAcquiredForAllLoanApplications = true;
                var milestoneStatus = new cls.MilestoneStatus();
                // There are no loan applications or street address is 'TBD', six pieces are not acquired.
                if (!_this.getLoanApplications() || _this.getLoanApplications().length == 0 || _this.homeBuyingType == 3 /* GetPreApproved */) {
                    _this.sixPiecesAcquiredForAllLoanApplications = false;
                }
                else {
                    // This piece is the same for all loan applications. Retrieve it only once.
                    var isPropertyPieceAcquired = _this.isPropertyPieceAcquired();
                    //refactor to use allLoanAppsCompleted() function
                    var allLoanAppsCompleted = true;
                    for (var i = 0; i < _this.getLoanApplications().length; i++) {
                        var loanApplication = _this.getLoanApplications()[i];
                        var loanAppCompleted = _this.isLoanApplicationCompleted(loanApplication);
                        allLoanAppsCompleted = allLoanAppsCompleted && loanAppCompleted;
                        if (!(isPropertyPieceAcquired && loanApplication.isPersonalPieceAcquired() && loanApplication.isIncomePieceAcquired())) {
                            // If any of the 6 pieces is not acquired, break.
                            _this.sixPiecesAcquiredForAllLoanApplications = false;
                        }
                    }
                }
                // 6 pieces for all loan applications are acquired.
                _this.checkDisclosureStatusRules();
                if (!_this.isMilestoneStatusManual && _this.currentMilestone != 3 /* processing */ && _this.currentMilestone != 9 /* cancelled */ && _this.currentMilestone != 14 /* adverse */)
                    _this.currentMilestone = milestoneStatus.setStatus(_this.isWholeSale, allLoanAppsCompleted, _this.sixPiecesAcquiredForAllLoanApplications, _this.homeBuyingType);
                return _this.sixPiecesAcquiredForAllLoanApplications;
            };
            this.areLoanAntiSteeringOptionsCompleted = function (model) {
                return model.firstInterestRate && (model.firstTotalPoints || model.firstTotalPoints == 0) && model.secondInterestRate && (model.secondTotalPoints || model.secondTotalPoints == 0) && model.thirdInterestRate && (model.thirdTotalPoints || model.thirdTotalPoints == 0);
            };
            this.checkDisclosureStatusRules = function () {
                var loanNumberNotSet = !_this.loanNumber || _this.loanNumber == "Pending";
                if (loanNumberNotSet && (!_this.applicationDate || moment('0001-01-01').diff(moment(_this.applicationDate)) == 0)) {
                    var sixPiecesAcquired = _this.sixPiecesAcquiredForAllLoanApplications;
                    var action = function (loanApp) { return _this.updateDisclosureStatus(loanApp, sixPiecesAcquired); };
                    lib.forEach(_this.getLoanApplications(), action);
                }
            };
            this.updateDisclosureStatusForAllLoanApplications = function (disclosureStatus) {
                var loanApps = _this.getLoanApplications();
                for (var i = 0; i < loanApps.length; i++) {
                    loanApps[i].disclosureStatusDetails.disclosureStatus = disclosureStatus;
                }
            };
            this.updateComplianceCheckStatusForAllLoanApplications = function (complianceCheckStatus) {
                var loanApps = _this.getLoanApplications();
                for (var i = 0; i < loanApps.length; i++) {
                    loanApps[i].complianceCheckStatus = complianceCheckStatus;
                }
            };
            this.updateComplianceCheckStatusForLoanApplication = function (complianceCheckStatus, loanApplicationId) {
                var loanApps = _this.getLoanApplications();
                for (var i = 0; i < loanApps.length; i++) {
                    if (loanApps[i].loanApplicationId == loanApplicationId) {
                        loanApps[i].complianceCheckStatus = complianceCheckStatus;
                    }
                }
            };
            this.updateDisclosureStatus = function (loanApp, sixPiecesAcquired) {
                if (!loanApp.disclosureStatusDetails)
                    loanApp.disclosureStatusDetails = {};
                if (sixPiecesAcquired) {
                    loanApp.disclosureStatusDetails.disclosureStatus = 2 /* InitialDisclosureRequired */;
                    loanApp.disclosureStatusDetails.disclosureStatusText = "Initial Disclosure Required";
                    loanApp.disclosureStatusDetails.disclosureStatusReasons = ['The Loan Application Date will be set for ' + moment().format('MM/DD/YY')];
                    loanApp.alertPanelVisible = true;
                }
                else {
                    loanApp.disclosureStatusDetails.disclosureStatus = 1 /* NotNeeded */;
                    loanApp.disclosureStatusDetails.disclosureStatusText = "";
                    loanApp.disclosureStatusDetails.disclosureStatusReasons = [];
                    loanApp.alertPanelVisible = false;
                }
            };
            this.isValidForSave = function () {
                var retVal = true;
                for (var i = 0; i < _this.getLoanApplications().length; i++) {
                    if (!_this.getLoanApplications()[i].isValidForSave()) {
                        retVal = false;
                        _this.getLoanApplications()[i].isFirstAndLastNameEnteredForBorrowers = false;
                    }
                    else
                        _this.getLoanApplications()[i].isFirstAndLastNameEnteredForBorrowers = true;
                }
                return retVal;
            };
            this.stateExist = function (states) {
                for (var i = 0; i < states.length; i++) {
                    if (_this.getSubjectProperty().stateId != null && states[i].value == (_this.getSubjectProperty().stateId).toString())
                        return true;
                }
                return false;
            };
            this.getLicencedStates = function (appData) {
                if (!_this.conciergeId)
                    return appData.lookup.statesForSkyline;
                if (_this.conciergeId == appData.currentUserId) {
                    if (_this.getSubjectProperty().stateId != null && !_this.stateExist(appData.lookup.statesForCurrentUser))
                        _this.getSubjectProperty().clearAddress(true);
                    return appData.lookup.statesForCurrentUser;
                }
                var licesesForLO = [];
                for (var i = 0; i < appData.licenses.length; i++) {
                    if (appData.licenses[i].userAccountId == _this.conciergeId) {
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
                if (!_this.stateExist(licensedStatesForLO)) {
                    _this.getSubjectProperty().clearAddress(true);
                }
                return licensedStatesForLO;
            };
            this.getLoanApplication = function (loanApplicationId) {
                if (_this.getLoanApplications()) {
                    for (var i = 0; i < _this.getLoanApplications().length; i++) {
                        _this.setPrimaryLoanApplication(_this.getLoanApplications()[i]);
                        if (_this.getLoanApplications()[i].loanApplicationId == loanApplicationId)
                            return _this.getLoanApplications()[i];
                    }
                }
                return null;
            };
            this.updateLoanApplication = function (loanApplication) {
                if (loanApplication && _this.hasTransactionInfoLoanApplication()) {
                    var loanApplicationExisting = _this.getTransactionInfoLoanApplication().replace(loanApplication);
                    return !!loanApplicationExisting;
                }
                return false;
            };
            this.downPaymentAmount = function (amount) {
                if (_this.loan.loanPurposeType == 1 /* Purchase */) {
                    if (!angular.isDefined(amount))
                        return _this.primary.getBorrower().filterDownPaymentAsset(_this.getSubjectProperty().purchasePrice - _this.loanAmount)[0].monthlyAmount;
                    else
                        _this.primary.getBorrower().filterDownPaymentAsset()[0].monthlyAmount = amount;
                }
            };
            this.downPaymentPercentage = function () {
                var retVal;
                if (_this.loan.loanPurposeType == 1 /* Purchase */) {
                    var downPayment = _this.primary.getBorrower().filterDownPaymentAsset(_this.getSubjectProperty().purchasePrice - _this.loanAmount)[0].monthlyAmount;
                    if (_this.getSubjectProperty().purchasePrice && downPayment)
                        retVal = (downPayment / _this.getSubjectProperty().purchasePrice) * 100;
                }
                return retVal;
            };
            /*
            * @desc Gets company name that is First Morgage Holder
            */
            this.getFirstMortgageHolder = function () {
                var firstMortgageHolder = "";
                if (_this.primary.getBorrower().getLiabilities() && _this.primary.getBorrower().getLiabilities().length > 0) {
                    var asset = _this.primary.getBorrower().getLiabilities().filter(function (liability) {
                        return liability.getProperty() && liability.lienPosition && liability.lienPosition == 1 && liability.getProperty().isSubjectProperty;
                    });
                    if (asset && asset.length > 0 && asset[0].companyData.companyName) {
                        firstMortgageHolder = asset[0].companyData.companyName;
                    }
                }
                return firstMortgageHolder;
            };
            this.getLoanLienPositions = function () {
                var loanLienPositions = "1st";
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
            };
            this.getFinancialsTotal = function (loanApplication, typeOfTotal) {
                return _this.getAssetsTotals(loanApplication.getBorrower().getFinancials(), loanApplication.getCoBorrower().getFinancials(), loanApplication.getCombinedAssetsFinancials(), typeOfTotal);
            };
            this.getAssetsTotals = function (borrowerAssets, coBorrowerAssets, combinedAssets, typeOfTotal) {
                var total = 0;
                switch (typeOfTotal) {
                    case 'borrower':
                        total = _this.calculateAssetsTotal(borrowerAssets);
                        break;
                    case 'coborrower':
                        total = _this.calculateAssetsTotal(coBorrowerAssets);
                        break;
                    case 'bothForBorrowerAndCoborrower':
                        total = _this.calculateAssetsTotal(combinedAssets);
                }
                return total;
            };
            this.calculateAssetsTotal = function (assets) {
                var total = 0;
                for (var i = 0; i < assets.length; i++) {
                    if (!assets[i].isRemoved && assets[i].monthlyAmount) {
                        total += parseFloat(assets[i].monthlyAmount.toString());
                    }
                }
                return total;
            };
            /**
              * @desc Misc Expanses total calculation
              * @params loanApplication [object], borrower [boolean]
              * @param borrower - if data should be get from borrower or joint borrower & coBorrower from loanApp
              * @param loanApplication - loanApplication object, if not sent it will take the active loan
              */
            this.getMiscExpensesTotal = function (loanApplication, borrower) {
                var total = 0, msicExpanses;
                if (!loanApplication) {
                    loanApplication = _this.active;
                }
                // total or seperate data
                msicExpanses = borrower ? borrower.getMiscDebts() : loanApplication.getCombinedMiscDebts();
                if (!msicExpanses)
                    return total;
                for (var i = 0; i < msicExpanses.length; i++) {
                    if (!msicExpanses[i].isRemoved && msicExpanses[i].amount) {
                        total += parseFloat(msicExpanses[i].amount);
                    }
                }
                return total;
            };
            this.isIntentToProceedDateSet = function () {
                if (!_this.primary)
                    return false;
                if (_this.primary.getBorrower().eApprovalConfirmation && _this.primary.getBorrower().eApprovalConfirmation.confirmationCodeConfirmed) {
                    if (_this.primary.isSpouseOnTheLoan) {
                        if (_this.primary.getCoBorrower().eApprovalConfirmation && _this.primary.getCoBorrower().eApprovalConfirmation.confirmationCodeConfirmed)
                            return true;
                        return false;
                    }
                    return true;
                }
                return false;
            };
            this.getAutomobilesTotal = function (loanApplication, typeOfTotal) {
                return _this.getAssetsTotals(loanApplication.getBorrower().getAutomobiles(), loanApplication.getCoBorrower().getAutomobiles(), loanApplication.getCombinedAssetsAutomobiles(), typeOfTotal);
            };
            this.separateMiscDebts = function (borrowerCheckedYes, coBorrowerCheckedYes) {
                var miscDebtCopy;
                var newMiscDebt;
                var groupedMiscDebts = (_.groupByMulti(_this.getActiveApplication().getCombinedMiscDebts().filter(function (item) {
                    return !item.isRemoved && (!item.isDefaultValue || item.isDefaultValue === undefined || item.payee != "");
                }), ['typeId', 'payee']))[1 /* ChildCareExpensesForVALoansOnly */];
                for (var key in groupedMiscDebts) {
                    if (groupedMiscDebts[key].length == 1) {
                        miscDebtCopy = angular.copy(groupedMiscDebts[key][0]);
                        newMiscDebt = new cls.MiscellaneousDebtViewModel();
                        newMiscDebt.isCoBorrower = !miscDebtCopy.isCoBorrower;
                        newMiscDebt.typeId = 1 /* ChildCareExpensesForVALoansOnly */;
                        newMiscDebt.amount = 0;
                        newMiscDebt.payee = miscDebtCopy.payee;
                        newMiscDebt.isUserEntry = true;
                        newMiscDebt.monthsLeft = miscDebtCopy.monthsLeft;
                        newMiscDebt.isRemoved = true;
                        if (newMiscDebt.isCoBorrower == false && borrowerCheckedYes)
                            _this.getActiveApplication().getBorrower().addMiscDebts(newMiscDebt);
                        else if (newMiscDebt.isCoBorrower == true && coBorrowerCheckedYes)
                            _this.getActiveApplication().getCoBorrower().addMiscDebts(newMiscDebt);
                        groupedMiscDebts[key].push(newMiscDebt);
                    }
                }
                return groupedMiscDebts;
            };
            this.getDefaultRowChildAlimony = function () {
                return (_.groupByMulti(_this.getActiveApplication().getCombinedMiscDebts().filter(function (item) {
                    return item.isDefaultValue;
                }), ['typeId', 'payee']))[1 /* ChildCareExpensesForVALoansOnly */];
            };
            this.updateDefaultStatus = function () {
                var grouped = (_.groupByMulti(_this.getActiveApplication().getCombinedMiscDebts().filter(function (item) {
                    return item.isDefaultValue;
                }), ['typeId', 'payee']))[1 /* ChildCareExpensesForVALoansOnly */];
                for (var key in grouped) {
                    grouped[key][0].isDefaultValue = false;
                    if (grouped[key][1] != undefined)
                        grouped[key][1].isDefaultValue = false;
                }
            };
            this.getLifeInsuranceTotal = function (loanApplication, typeOfTotal) {
                return _this.getAssetsTotals(loanApplication.getBorrower().getLifeInsurance(), loanApplication.getCoBorrower().getLifeInsurance(), loanApplication.getCombinedAssetsLifeInsurence(), typeOfTotal);
            };
            // todo: figure out why the signature of of getLifeInsuranceTotal, getFinancialsTotal, and getAutomobilesTotal
            this.getTotalLiquidAssets = function () {
                return _this.getLifeInsuranceTotal(_this.active, 'bothForBorrowerAndCoborrower') + _this.getFinancialsTotal(_this.active, 'bothForBorrowerAndCoborrower');
            };
            this.getTotalAssetsWithoutDownPayment = function () {
                //
                // @todo-cc: Review for API
                //
                var flg = 'bothForBorrowerAndCoborrower';
                var total = 0.00;
                total += _this.getLifeInsuranceTotal(_this.active, flg);
                total += _this.getFinancialsTotal(_this.active, flg);
                total += _this.getAutomobilesTotal(_this.active, flg);
                var properties = _this.getPropertyMap().getValues();
                for (var i = 0; i < properties.length; i++) {
                    // @todo-cc: filter
                    // @todo-cc: enums/constants (Refinance)
                    if (!!properties[i] && !!properties[i].currentEstimatedValue && properties[i].currentEstimatedValue > 0 && (_this.loanPurposeType == 2 || !properties[i].isSubjectProperty) && properties[i].loanApplicationId === _this.active.loanApplicationId) {
                        total += properties[i].currentEstimatedValue;
                    }
                }
                return total;
            };
            //public changeBorrowerForSection = (borrower, item) => {
            //    assetsUtil.changeBorrowerForSection(borrower, item, this.active)
            //}
            /*Property Expenses*/
            this.getHoaPropertyExpense = function () {
                return _this.$filter('filter')(_this.getSubjectProperty().propertyExpenses, { type: '4' }, true)[0];
            };
            /*Costs*/
            this.getTotalEstimatedReserves = function (cost) {
                return (cost.noOfMonthlyReserves * Math.round(_this.getMonthlyAmount(cost) * 10000) / 10000) * (cost.impounded ? 1 : 0);
            };
            this.getMonthlyAmount = function (cost) {
                if (cost.amount == '')
                    cost.amount = 0;
                if (cost.factor > 0 && _this.loanPurposeType === 1) {
                    if (cost.hudLineNumber == 1002) {
                        cost.amount = Math.round(cost.factor * _this.loanAmount / 12) * 0.12;
                    }
                    else if (cost.hudLineNumber == 1004) {
                        cost.amount = Math.round(cost.factor * _this.getSubjectProperty().purchasePrice / 12) * 0.12;
                    }
                }
                cost.monthlyAmount = cost.paymentType == 'Annual' ? cost.amount / 12 : cost.amount;
                return cost.monthlyAmount;
            };
            this.getHomeBuyingTypeText = function () {
                var retVal;
                switch (_this.homeBuyingType) {
                    case 1:
                        retVal = "Offer Accepted";
                        break;
                    case 2:
                        retVal = "Offer Pending Found A House";
                        break;
                    case 3:
                        retVal = "Get PreApproved";
                        break;
                    case 4:
                        retVal = "What Can I Afford";
                        break;
                    default:
                        retVal = "";
                        break;
                }
                return retVal;
            };
            /**
            * @desc Gets the loan purpose type string representation.
            */
            this.getLoanPurposeTypeText = function () {
                var retVal = 'None';
                switch (_this.loanPurposeType) {
                    case 1:
                        retVal = 'Purchase';
                        break;
                    case 2:
                        retVal = 'Refinance';
                        break;
                }
                return retVal;
            };
            this.switchActiveLoanApplication = function (loanApp) {
                _this.active = loanApp;
            };
            /**
            * @desc Validates if 3rd, 4th and 5th piece of 6 pieces is acquired.
            */
            this.isPropertyPieceAcquired = function () {
                var retVal = false;
                retVal = (_this.getSubjectProperty() && _this.getSubjectProperty() && _this.getSubjectProperty().isValid() && (!!_this.getSubjectProperty().currentEstimatedValue || !!_this.getSubjectProperty().purchasePrice)) && !!_this.loanAmount; // 4th piece - loan amount.
                return retVal;
            };
            this.checkAgentsDifferences = function () {
                return _this.doesYourAgentAlsoRepresentsSeller = _this.doesAgentRepresentsSeller(_this.buyersAgentContact, _this.sellersAgentContact);
            };
            /**
            * @desc Adds new 1003 application
            */
            this.addLoanApplication = function (loanApplication) {
                if (_this.getLoanApplications().length < _this.maxNumberOfLoanApplications || _this.maxNumberOfLoanApplications === 0 && _this.hasTransactionInfoLoanApplication()) {
                    loanApplication.isUserEntry = true;
                    _this.getTransactionInfoLoanApplication().map(loanApplication);
                    _this.active = loanApplication;
                    // @todo-cc: Review , new one always becomes primary ???
                    _this.setPrimaryLoanApplication(loanApplication);
                }
            };
            /**
            *@desc Sets the 1003 primary status ; @todo-cc: REMOVE
            */
            this.setPrimaryLoanApplication = function (loanApplication) {
                if (loanApplication.loanApplicationId == _this.loanId) {
                    loanApplication.isPrimary == true;
                }
                else {
                    loanApplication.isPrimary == false;
                }
            };
            /**
            * @desc Removes all 1003 applications that are added prior saving
            */
            this.removeLoanApplications = function () {
                //
                // @todo-cl: Review ; why/how Loan Applications should be removed and/or deleted
                //
                //var itemsToRemove = this.filterUserAddedLoanApplications();
                //for (var key in itemsToRemove) {
                //    common.deleteItem(common.indexOfItem(itemsToRemove[key], this.getLoanApplications()), this.getLoanApplications());
                //}
            };
            /*--------------------------------------
           * Product model logic
           *---------------------------------------*/
            /**
             * @desc Populate and format product class
             */
            this.populateAndFormatProductClass = function () {
                _this.product.conforming = _this.financialInfo.conforming;
                _this.product.name = _this.formatProgramName();
            };
            /**
             * @desc Calculate Lock Expiration Number from Lock Expiration Date
             */
            this.calculateLockExpirationNumber = function () {
                var lockExpirationDate, dateNow;
                if (!moment(_this.lockingInformation.lockExpirationDate).isValid())
                    return null;
                if (!_this.lockingInformation.lockExpirationDate)
                    return null;
                dateNow = moment().startOf('day');
                var duration = moment(_this.lockingInformation.lockExpirationDate).diff(dateNow, 'days');
                return duration;
            };
            /**
             * @desc Fromat program name for title row
             */
            this.formatProgramName = function () {
                var name = '';
                var amortizationType = _this.financialInfo.amortizationType, mortageType = _this.financialInfo.mortgageType, loanAmortizationTerm = _this.financialInfo.term, IsBaloonPayment = _this.financialInfo.isBaloonPayment != null ? _this.financialInfo.isBaloonPayment : false, isHarp = _this.loan.loanIsHarp, loanAmortizationFixedTerm = _this.financialInfo.fixedRateTerm;
                if (amortizationType === 2 /* ARM */ && loanAmortizationTerm !== loanAmortizationFixedTerm) {
                    if (loanAmortizationFixedTerm != null) {
                        name += loanAmortizationFixedTerm;
                    }
                    name += (IsBaloonPayment ? ' Year Adjustable due in ' + 0 + ' years ' : (isHarp ? ' Year Fixed HARP ' : ' Year Fixed '));
                    if (amortizationType != null) {
                        name += _this.getObjectKeyFromValue(srv.AmortizationType, amortizationType);
                    }
                    if (mortageType === 1 /* FHA */ || mortageType === 4 /* VA */) {
                        name += ' ' + _this.getObjectKeyFromValue(srv.MortageType, mortageType) + ' ';
                    }
                }
                else {
                    if (loanAmortizationTerm != null) {
                        name += loanAmortizationTerm;
                    }
                    name += (IsBaloonPayment ? ' Year Fixed due in ' + 0 + ' years ' : (isHarp ? ' Year HARP ' : ' Year '));
                    if (amortizationType != null) {
                        name += _this.getObjectKeyFromValue(srv.AmortizationType, amortizationType);
                    }
                    //add mortgage type if AmortizationType is not ARM
                    if (amortizationType !== 2 /* ARM */) {
                        name += ' ' + _this.getObjectKeyFromValue(srv.MortageType, mortageType) + ' ';
                    }
                }
                return name;
            };
            /**
             * @desc Build lock experation text via lock experation number
             */
            this.getLockExpirationText = function () {
                var lockExpirationNumber = _this.calculateLockExpirationNumber(), absLockExpirationNumber, name = '';
                if (!lockExpirationNumber)
                    return '';
                absLockExpirationNumber = Math.abs(lockExpirationNumber);
                name += 'Expire';
                if (lockExpirationNumber >= 0) {
                    name += 's ';
                    name += (lockExpirationNumber === 0) ? 'Today' : 'in ' + absLockExpirationNumber + ' Days';
                }
                else {
                    name += 'd ' + absLockExpirationNumber + ' Days Ago';
                }
                return name;
            };
            /**
             * @desc Get lock color via lock experation number for title row on loan details
             */
            this.getLockColor = function () {
                return (_this.calculateLockExpirationNumber() >= 0) ? '#1fb25a' : '#E73302';
            };
            /**
             * @desc Get lock expired and is locked
             */
            this.getLockStatus = function () {
                return {
                    isLockExpired: _this.calculateLockExpirationNumber() < 0,
                    isLocked: _this.lockingInformation.lockStatus === 4 /* Locked */
                };
            };
            /**
             * @desc Convert date to UTC format, so we can include day light saving time and diffrence of timezones
             */
            this.treatDateAsUTC = function (date) {
                var d = new Date(date);
                return d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
            };
            /**
            * @desc Get object key from value
            */
            this.getObjectKeyFromValue = function (obj, value) {
                return Object.keys(obj).filter(function (key) {
                    return obj[key] === value;
                })[0];
            };
            this.doesAgentRepresentsSeller = function (buyersAgent, sellersAgent) {
                if (buyersAgent != null && sellersAgent != null) {
                    if (buyersAgent.firstname == sellersAgent.firstname && buyersAgent.lastname == sellersAgent.lastname && buyersAgent.company == sellersAgent.company && buyersAgent.preferedPhone == sellersAgent.preferedPhone && buyersAgent.preferedPhoneType == sellersAgent.preferedPhoneType && buyersAgent.alternatePhoneType == sellersAgent.alternatePhoneType && buyersAgent.alternatePhone == sellersAgent.alternatePhone && buyersAgent.email == buyersAgent.email) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                else {
                    return false;
                }
            };
            this.filterUserAddedLoanApplications = function () {
                return _this.getLoanApplications().filter(function (loanApplication) {
                    return loanApplication.isUserEntry;
                });
            };
            this.prepareForSubmit = function () {
                // @todo-cl::PROPERTY-ADDRESS
                // this.getLoanApplications().map(a => a.prepareForSubmit());
            };
            this.getTotalMonthlyPropertyObligations = function () {
                if (!_this.housingExpenses)
                    return 0;
                return _this.housingExpenses.newTotalHousingExpenses;
            };
            this.returnLoanPurposeType = function () {
                return _this.loanPurposeType;
            };
            this.getPrimaryAppOccupancyType = function () {
                return angular.isDefined(_this.primary) ? _this.primary.occupancyType : 1 /* PrimaryResidence */;
            };
            this.hasTransactionalInfoOtherIncomes = function () {
                if (_this.hasTransactionInfo() && !!_this.getTransactionInfoRef().incomeInfo) {
                    return true;
                }
                else {
                    return false;
                }
            };
            this.getTransactionInfoOtherIncome = function () {
                if (_this.hasTransactionalInfoOtherIncomes()) {
                    return _this.getTransactionInfoRef().incomeInfo;
                }
                return new cls.Map();
            };
            this.getOtherIncomes = function () {
                if (_this.hasTransactionalInfoOtherIncomes) {
                    return _this.getTransactionInfoOtherIncome().getValues();
                }
                return [];
            };
            this.setOtherIncomes = function (incomes) {
                if (!!incomes && _this.hasTransactionalInfoOtherIncomes) {
                    _this.getTransactionInfoOtherIncome().mapAll(incomes);
                }
            };
            this.getReoItemByLienPosition = function (postion) {
                var result = lib.filter(_this.primary.getBorrower().getLiabilities(), function (item) {
                    return item.isPledged && item.lienPosition == postion && item.property.isSubjectProperty;
                });
                if (result && result.length > 0) {
                    var reo = result[0];
                    if (!!reo.reoInfo && !(reo.reoInfo instanceof cls.REOInfoViewModel)) {
                        reo.reoInfo = new cls.REOInfoViewModel(reo.reoInfo);
                    }
                    return reo;
                }
                else
                    return null;
            };
            this.hasTransactionalInfoLiabilities = function () {
                if (_this.hasTransactionInfo() && !!_this.getTransactionInfoRef().liability) {
                    return true;
                }
                else {
                    return false;
                }
            };
            this.getTransactionInfoLiabilities = function () {
                if (_this.hasTransactionalInfoLiabilities) {
                    return _this.getTransactionInfoRef().liability;
                }
                return new cls.Map();
            };
            this.getCurrentLoanOriginationDate = function () {
                if (_this.hasTransactionalInfoLiabilities) {
                    var liabilities = _this.getTransactionInfoLiabilities().getValues();
                    for (var i = 0; i < liabilities.length; i++) {
                        if (liabilities[i].getProperty() && liabilities[i].getProperty().isSubjectProperty && liabilities[i].lienPosition == 1 /* First */) {
                            return liabilities[i].loanOriginationDate;
                        }
                    }
                }
                return null;
            };
            this.setCurrentLoanOriginationDate = function (originationDate) {
                if (!!originationDate && _this.hasTransactionalInfoLiabilities) {
                    var liabilities = _this.getTransactionInfoLiabilities().getValues();
                    for (var i = 0; i < liabilities.length; i++) {
                        if (liabilities[i].getProperty() && liabilities[i].getProperty().isSubjectProperty && liabilities[i].lienPosition == 1 /* First */) {
                            liabilities[i].loanOriginationDate = originationDate;
                            break;
                        }
                    }
                }
            };
            this.incomeTotalForBorrower = function (borrower) {
                var total = 0;
                //add base income.
                total += borrower.baseIncomeTotal;
                // Add other income.
                total += _this.getOtherIncomeSumForBorrower(borrower.borrowerId);
                return total;
            };
            this.getCurrentAccountOpenDate = function () {
                if (_this.hasTransactionalInfoLiabilities) {
                    var liabilities = _this.getTransactionInfoLiabilities().getValues();
                    for (var i = 0; i < liabilities.length; i++) {
                        if (liabilities[i].getProperty() && liabilities[i].getProperty().isSubjectProperty && liabilities[i].lienPosition == 1 /* First */) {
                            return liabilities[i].accountOpenDate;
                        }
                    }
                }
                return null;
            };
            this.setCurrentAccountOpenDate = function (accountOpenDate) {
                if (!!accountOpenDate && _this.hasTransactionalInfoLiabilities) {
                    var liabilities = _this.getTransactionInfoLiabilities().getValues();
                    for (var i = 0; i < liabilities.length; i++) {
                        if (liabilities[i].getProperty() && liabilities[i].getProperty().isSubjectProperty && liabilities[i].lienPosition == 1 /* First */) {
                            liabilities[i].accountOpenDate = accountOpenDate;
                            break;
                        }
                    }
                }
            };
            /**
            * @desc: Retrieves absolute value of cashFromToBorrower
            */
            this.getCashFromToBorrower = function () {
                if (_this.detailsOfTransaction.cashFromToBorrower < 0)
                    return Math.abs(_this.detailsOfTransaction.cashFromToBorrower);
                return 0;
            };
            this.incomeTotalForBorrowerWithMiscExpenses = function (borrower, skipMiscExpenses) {
                if (skipMiscExpenses === void 0) { skipMiscExpenses = false; }
                var total = 0;
                //add base income.
                total += borrower.baseIncomeTotal;
                // Add other income.
                if (skipMiscExpenses) {
                    total += _this.getOtherIncomeSumForBorrower(borrower.borrowerId);
                }
                else {
                    total += _this.getOtherIncomeSumForBorrowerWithMiscExpenses(borrower);
                }
                return total;
            };
            this.incomeTotalForCoBorrower = function (borrower) {
                var total = 0;
                //add base income.
                total += borrower.baseIncomeTotal;
                // Add other income.
                total += _this.getOtherIncomeSumForBorrower(borrower.borrowerId);
                return total;
            };
            this.getOtherIncomeSumForBorrower = function (borrowerId) {
                // @todo-cl: Needs to be clean-up and consolodated with all the other summations , =/12 , etc. from all over the place
                var total = 0;
                var otherIncomes = _this.OtherIncomes.filter(function (i) {
                    return (i.borrowerId == borrowerId && (!i.employmentInfoId || i.employmentInfoId == lib.getEmptyGuid()));
                });
                if (otherIncomes) {
                    angular.forEach(otherIncomes, function (income) {
                        if (income && !income.isRemoved && income.manualAmount && income.incomeTypeId != 5 /* netRentalIncome */) {
                            var amount = Number(income.manualAmount);
                            if (income.preferredPaymentPeriodId == 2 /* Annual */) {
                                amount /= 12;
                            }
                            total += amount;
                        }
                    });
                }
                return total;
            };
            this.getOtherIncomeSumForBorrowerWithMiscExpenses = function (borrower) {
                var total = _this.getOtherIncomeSumForBorrower(borrower.borrowerId);
                var miscDebts = borrower.getMiscDebts().filter(function (i) {
                    return (i.typeId == 2 /* Expenses2106FromTaxReturns */);
                });
                return total += _this.calculateMiscExpenses(miscDebts);
            };
            this.calculateMiscExpenses = function (miscDebts) {
                var total = 0;
                var amount = 0;
                angular.forEach(miscDebts, function (debt) {
                    if (debt && !debt.isRemoved && debt.amount) {
                        amount = Number(debt.amount);
                        total -= amount;
                    }
                });
                return total;
            };
            this.getOtherIncomeTotalForBorrower = function (borrower) {
                return _this.getOtherIncomeSumForBorrowerWithMiscExpenses(borrower) + _this.getCashFlowForNetRentalIncomes(borrower, false);
            };
            this.getOtherIncomeTotal = function (borrower) {
                return _this.getOtherIncomeSumForBorrower(borrower.borrowerId) + _this.getCashFlowForNetRentalIncomes(borrower, false);
            };
            this.getCombinedOtherIncomeTotal = function () {
                if (_this.active.isSpouseOnTheLoan)
                    return _this.getOtherIncomeTotal(_this.active.getBorrower()) + _this.getOtherIncomeTotal(_this.active.getCoBorrower());
                else
                    return _this.getOtherIncomeTotal(_this.active.getBorrower());
            };
            //addOtherIncome = (otherIncome: srv.IIncomeInfoViewModel): void => {
            //    otherIncome.borrowerId = this.active.getBorrower().borrowerId;
            //    otherIncome.isCurrentlyAdded = true;
            //    if (!this.otherIncomes)
            //        this.otherIncomes = [];
            //    this.otherIncomes.push(otherIncome);
            //}
            this.deleteOtherIncome = function (otherIncome) {
                common.deleteItem(common.indexOfItem(otherIncome, _this.otherIncomes), _this.otherIncomes);
            };
            this.removeOtherIncome = function (otherIncome) {
                otherIncome.isRemoved = true;
            };
            this.getCombinedNonSubjectPropertyIncomeTotal = function () {
                var retVal = Number(_this.getNonSubjectPropertiesNetRentalIncome(_this.active.getBorrower()));
                if (_this.active.isSpouseOnTheLoan)
                    retVal += Number(_this.getNonSubjectPropertiesNetRentalIncome(_this.active.getCoBorrower()));
                return retVal;
            };
            this.getNonSubjectPropertiesNetRentalIncome = function (borrower) {
                return _this.netRentalIncomeSum(borrower, false);
            };
            this.getSubjectPropertiesNetRentalIncome = function (borrower) {
                return _this.netRentalIncomeSum(borrower, true);
            };
            this.getCashFlowForNetRentalIncomes = function (borrower, isNegative) {
                var total = 0;
                var subjectPropertyNetRental = _this.getSubjectPropertiesNetRentalIncome(borrower);
                var nonSubjectPropertiesNetRental = _this.getNonSubjectPropertiesNetRentalIncome(borrower);
                return _this.getNetRentalAmount(isNegative, subjectPropertyNetRental) + _this.getNetRentalAmount(isNegative, nonSubjectPropertiesNetRental);
            };
            this.getNetRentalAmount = function (isNegative, amount) {
                if (isNegative) {
                    if (amount < 0)
                        return amount;
                    else
                        return 0;
                }
                else {
                    if (amount > 0)
                        return amount;
                    else
                        return 0;
                }
            };
            this.netRentalIncomeSum = function (borrower, isSubjectProperty) {
                var total = 0;
                var otherIncome = _this.OtherIncomes.filter(function (i) {
                    return (i.borrowerId == borrower.borrowerId && i.isNetRental && i.isSubjectProperty == isSubjectProperty);
                });
                if (otherIncome) {
                    angular.forEach(otherIncome, function (income) {
                        if (!income.isRemoved) {
                            var amount = Number(income.manualAmount);
                            if (income.preferredPaymentPeriodId == 2 /* Annual */) {
                                amount /= 12;
                            }
                            total += amount;
                        }
                    });
                }
                return total;
            };
            this.processPropertyRules = function () {
                if (_this.loanPurposeType == 2 /* Refinance */)
                    lib.forEach(_this.getLoanApplications(), function (la) {
                        {
                            if (la.OccupancyType == 1 /* PrimaryResidence */)
                                la.getBorrower().getCurrentAddress().isSameAsPropertyAddress = true;
                        }
                    });
            };
            this.initialize = function (loan) {
                var ti = new cls.TransactionInfo();
                _this.getTransactionInfo = function () { return ti; };
                if (loan) {
                    ti.populate(function () { return _this; }, loan.transactionInfo);
                    // todo: not clear why something static is dependent on the loan instance
                    if (!LoanViewModel._lookupInfo)
                        LoanViewModel._lookupInfo = loan.lookup;
                    // assign active first
                    //      @todo-cc: Loan should always have loanId  , remove this conditional and else{}
                    if (loan.loanId) {
                        if (!loan.selectedAppIndex) {
                            _this.active = _this.getActiveLoanApplication(_this);
                        }
                        else {
                            //Set selected LoanApplication before save
                            _this.active = _this.getActiveLoanApplicationByIndex(_this);
                            if (_this.active === undefined)
                                _this.active = _this.getActiveLoanApplication(_this);
                        }
                        // Get the primary loan.
                        _this.primary = _this.getPrimaryLoan(_this);
                    }
                    else {
                        var loanApplicationDefault = (loan.getLoanApplications().length > 0) ? _this.getLoanApplications()[0] : new cls.LoanApplicationViewModel(_this.getTransactionInfoRef(), null);
                        _this.setLoanApplicationsDefaults(loanApplicationDefault);
                    }
                    //initialize streetName if not exists for GetPreapproved home buying type
                    if (_this.homeBuyingType == 3 /* GetPreApproved */ && !_this.getSubjectProperty().streetName)
                        _this.getSubjectProperty().streetName = 'TBD';
                    //initialize other Incomes for collection
                    lib.forEach(loan.otherIncomes, function (p) { return (p.isNetRental) ? _this.otherIncomes.push(new cls.NetRentalIncomeInfoViewModel(p)) : _this.otherIncomes.push(new cls.OtherIncomeInfoViewModel(_this.getTransactionInfoRef(), p)); });
                    if (_this.loanPurposeType == 1) {
                        // accessing will create if not exists (lazy)
                        _this.getSubjectProperty().getNetRentalIncome();
                    }
                    //placeholder for loading otherIncomes              
                    if (_this.pricingAdjustments && _this.pricingAdjustments.adjustments && _this.pricingAdjustments.adjustments.length > 0) {
                        var adjs = _this.pricingAdjustments.adjustments;
                        var newadj = [];
                        for (var i = 0; i < adjs.length; i++) {
                            newadj.push(new cls.AdjustmentsViewModel(adjs[i]));
                        }
                        _this.pricingAdjustments.adjustments = newadj;
                    }
                    // @todo-cl: Review , this should come loaded as-is and be a predicate of of Transaction Info (not a property)
                    if (!_this.primary) {
                        _this.setLoanApplicationsDefaults(ti.loanApplication.getValues()[0]);
                    }
                    //Initialize product
                    _this.populateAndFormatProductClass();
                    //initialize locking information
                    _this.populateLockingInformation();
                    //processPropertyRules
                    _this.processPropertyRules();
                    //this.housingExpenses = new cls.HousingExpensesViewModel(loan.housingExpenses, this.primary.getCombinedReoPropertyList, this.getCosts, this.loanPurposeType, this.getCombinedPledgedAssetsForAll1003s, this.getSubjectProperty());
                    // force create borrower lookup lists
                    _this.getLoanApplications().forEach(function (app) {
                        app.Borrowers(false, true, false);
                    });
                }
                else {
                    // @todo-cc: Need to sort out creation services and TS
                    if (!_this.transactionInfo) {
                        _this.transactionInfo = new srv.cls.TransactionInfo();
                    }
                    ti.populate(function () { return _this; }, null);
                    _this.financialInfo = new srv.cls.LoanFinancialInfoViewModel();
                    _this.setLoanApplicationsDefaults(new cls.LoanApplicationViewModel(_this.getTransactionInfoRef(), null));
                }
                _this.areSixPiecesAcquiredForAllLoanApplications();
                _this.isNewProspectSaved = true;
            };
            this.getCosts = function () {
                if (!_this.closingCost || !_this.closingCost.costs)
                    return new Array();
                return _this.closingCost.costs;
            };
            // todo, $filter should not be dependency for this cls.LoanViewModel
            this.getActiveLoanApplication = function (loan) { return _this.$filter('filter')(loan.getLoanApplications(), { loanApplicationId: loan.active.loanApplicationId }, true)[0]; };
            this.getPrimaryLoan = function (loan) { return _this.$filter('filter')(loan.getLoanApplications(), { isPrimary: true }, true)[0]; };
            this.getActiveLoanApplicationByIndex = function (loan) { return loan.getLoanApplications()[loan.selectedAppIndex]; };
            this.updateLoanDateHistory = function (dateValue, currentUserName, dateOfChange, impoundSchedules, title) {
                var loanDateHistory = new cls.LoanDateHistoryViewModel();
                loanDateHistory.dateValue = dateValue;
                loanDateHistory.dateOfChange = dateOfChange;
                loanDateHistory.userName = currentUserName;
                loanDateHistory.isActive = true;
                loanDateHistory.userCurrentlyEditing = true;
                if (title == "Closing Date") {
                    if (!_this.closingDate.dateHistory) {
                        _this.closingDate.dateHistory = new Array();
                    }
                    else {
                        var userCurrentlyEditnigDateHistories = lib.filter(_this.closingDate.dateHistory, function (dateHistory) { return new cls.LoanDateHistoryViewModel(dateHistory).userCurrentlyEditing; });
                        if (userCurrentlyEditnigDateHistories.length > 0) {
                            _this.closingDate.dateHistory.pop();
                        }
                    }
                    _this.closingDate.dateHistory.push(loanDateHistory);
                }
                else if (title == "Appraisal Due Date") {
                    if (!_this.appraisalContingencyDate.dateHistory) {
                        _this.appraisalContingencyDate.dateHistory = new Array();
                    }
                    else {
                        var userCurrentlyEditnigDateHistories = lib.filter(_this.appraisalContingencyDate.dateHistory, function (dateHistory) { return new cls.LoanDateHistoryViewModel(dateHistory).userCurrentlyEditing; });
                        if (userCurrentlyEditnigDateHistories.length > 0) {
                            _this.appraisalContingencyDate.dateHistory.pop();
                        }
                        else if (_this.appraisalContingencyDate.dateHistory.length > 0) {
                            lib.filter(_this.appraisalContingencyDate.dateHistory, function (dateHistory) { return dateHistory.isActive; })[0].isActive = false;
                        }
                    }
                    if (loanDateHistory.dateValue) {
                        _this.appraisalContingencyDate.dateHistory.push(loanDateHistory);
                    }
                }
                if (title == "Approval Due Date") {
                    if (!_this.approvalContingencyDate.dateHistory) {
                        _this.approvalContingencyDate.dateHistory = new Array();
                    }
                    else {
                        var userCurrentlyEditnigDateHistories = lib.filter(_this.approvalContingencyDate.dateHistory, function (dateHistory) { return new cls.LoanDateHistoryViewModel(dateHistory).userCurrentlyEditing; });
                        if (userCurrentlyEditnigDateHistories.length > 0) {
                            _this.approvalContingencyDate.dateHistory.pop();
                        }
                        else if (_this.approvalContingencyDate.dateHistory.length > 0) {
                            lib.filter(_this.approvalContingencyDate.dateHistory, function (dateHistory) { return dateHistory.isActive; })[0].isActive = false;
                        }
                    }
                    if (loanDateHistory.dateValue) {
                        _this.approvalContingencyDate.dateHistory.push(loanDateHistory);
                    }
                }
            };
            this.getReoItemsForSubjectPropertyOnAllLoanApplications = function () {
                _this.reoItemsForSubjectPropertyWithLienSecondOrMore = new Array();
                _this.getLoanApplications().forEach(function (la, idx) {
                    _this.reoItemsForSubjectPropertyWithLienSecondOrMore = _this.reoItemsForSubjectPropertyWithLienSecondOrMore.concat(la.getAllLiabilitiesCombined().filter(function (item) {
                        return item.isPledged && item.getProperty() && item.getProperty().isSubjectProperty && item.lienPosition >= 2;
                    }));
                });
            };
            this.calculateSubordinate = function () {
                if (_this.loanPurposeType == 2 /* Refinance */) {
                    _this.getReoItemsForSubjectPropertyOnAllLoanApplications();
                    //if no Reo Items Subordinate will be empty string
                    if (!_this.reoItemsForSubjectPropertyWithLienSecondOrMore.length)
                        return "";
                    //if for all reo items on all loanapplication DebtComments are PayoffAtClose or PayoffAtClosingAndCloseAccount subordinate will be N\A
                    if (_this.reoItemsForSubjectPropertyWithLienSecondOrMore.filter(function (item) {
                        return item.borrowerDebtCommentId == 2 /* PayoffAtClose */ || item.borrowerDebtCommentId == 4 /* PayoffAtClosingAndCloseAccount */;
                    }).length == _this.reoItemsForSubjectPropertyWithLienSecondOrMore.length)
                        return "N/A";
                    //if comment are PayoffAtClosingAndDontCloseAccount
                    if (_this.reoItemsForSubjectPropertyWithLienSecondOrMore.filter(function (item) {
                        return item.borrowerDebtCommentId == 3 /* PayoffAtClosingAndDontCloseAccount */;
                    }).length == _this.reoItemsForSubjectPropertyWithLienSecondOrMore.length)
                        return 0;
                    //in other cases will be sum of all reo items with other comments
                    return _this.sumBalanceForAllLoanAplication();
                }
                return "";
            };
            this.isDataValidForAggregateAdjustmentCalculation = function () {
                var costs = lib.filter(_this.getCosts(), function (c) { return c.hudLineNumber == 1002 || c.hudLineNumber == 1004 || c.hudLineNumber == 1006 || (c.isRemoved != true && (c.hudLineNumber == 1010 || c.hudLineNumber == 1007 || c.hudLineNumber == 1012 || c.originalHUDLineNumber == 1010 || c.originalHUDLineNumber == 1007 || c.originalHUDLineNumber == 1012)); });
                for (var i = 0; i < costs.length; i++) {
                    if (costs[i].amountMethod != 1 /* Itemized */) {
                        if (!costs[i].impounded || !costs[i].amountPerMonth) {
                            continue;
                        }
                        // If period type != monthly and due dates aren't initialized, don't trigger aggregate adjustment calculation
                        if (costs[i].preferredPaymentPeriod != 1 /* Monthly */ && costs[i].periodPaymentMonths.length == 0) {
                            _this.totalAggregateAdjustment = 0;
                            return false;
                        }
                        for (var j = 0; j < costs[i].periodPaymentMonths.length; j++) {
                            if (!costs[i].periodPaymentMonths[j].isRemoved && !costs[i].periodPaymentMonths[j].month) {
                                _this.totalAggregateAdjustment = 0;
                                return false;
                            }
                        }
                    }
                    else {
                        for (var k = 0; k < costs[i].itemizedPropertyTaxes.length; k++) {
                            if (costs[i].itemizedPropertyTaxes[k].amount && !costs[i].itemizedPropertyTaxes[k].month) {
                                _this.totalAggregateAdjustment = 0;
                                return false;
                            }
                        }
                    }
                }
                return true;
            };
            this.resetEscrowsMonthsToBePaid = function () {
                var costs = lib.filter(_this.getCosts(), function (c) { return c.hudLineNumber == 1002 || c.hudLineNumber == 1004 || c.hudLineNumber == 1006 || (c.isRemoved != true && (c.hudLineNumber == 1010 || c.hudLineNumber == 1007 || c.hudLineNumber == 1012 || c.originalHUDLineNumber == 1010 || c.originalHUDLineNumber == 1007 || c.originalHUDLineNumber == 1012)); });
                for (var i = 0; i < costs.length; i++) {
                    if (costs[i].originalMonthsToBePaid != null && costs[i].originalMonthsToBePaid > 0) {
                        costs[i].monthsToBePaid = costs[i].originalMonthsToBePaid;
                    }
                }
            };
            this.sumBalanceForAllLoanAplication = function () {
                var retVal = 0;
                for (var key in _this.reoItemsForSubjectPropertyWithLienSecondOrMore) {
                    if (_this.reoItemsForSubjectPropertyWithLienSecondOrMore[key].borrowerDebtCommentId != 2 /* PayoffAtClose */ && _this.reoItemsForSubjectPropertyWithLienSecondOrMore[key].borrowerDebtCommentId != 4 /* PayoffAtClosingAndCloseAccount */ && _this.reoItemsForSubjectPropertyWithLienSecondOrMore[key].borrowerDebtCommentId != 3 /* PayoffAtClosingAndDontCloseAccount */)
                        retVal += _this.reoItemsForSubjectPropertyWithLienSecondOrMore[key].unpaidBalance;
                }
                return retVal;
            };
            this.getSubjectProperty = function () {
                var subjectProperty = lib.findFirst(_this.getPropertyMap().getValues(), function (p) { return p.isSubjectProperty; });
                if (!subjectProperty) {
                    console.warn("SUBJECT PROPERTY NOT FOUND");
                }
                return subjectProperty;
            };
            this.setSubjectProperty = function (subjProp) {
                var subjPropExisting = _this.getSubjectProperty();
                if (!!subjPropExisting) {
                    _this.getPropertyMap().remove(subjPropExisting);
                }
                _this.getPropertyMap().map(subjProp);
            };
            this.bindSubjectProperty = function (subjProp) {
                if (angular.isDefined(subjProp)) {
                    _this.setSubjectProperty(subjProp);
                }
                var retVal = _this.getSubjectProperty();
                return retVal;
            };
            this.getProperty = function (propertyId) {
                var property = _this.getPropertyMap().lookup(propertyId);
                return property;
            };
            this.getPropertiesByAddressId = function (propertyId) {
                var properties = lib.filter(_this.getPropertyMap().getValues(), function (p) { return p.propertyId == propertyId; });
                return properties;
            };
            this.addOrUpdateProperty = function (property) {
                if (!property || !property.propertyId || property.propertyId == lib.getEmptyGuid())
                    throw "loanVM::addOrUpdateProperty => input property is null or without id";
                property.loanId = _this.loanId;
                _this.getPropertyMap().map(property);
            };
            this.removePropertiesByAddressId = function (property, propertyId) {
                var currentAddressProperties = _this.getPropertiesByAddressId(propertyId);
                if (currentAddressProperties) {
                    lib.forEach(_this.active.getCombinedPledgedAssets(), function (reo) {
                        if (lib.contains(currentAddressProperties, function (p) { return p.propertyId == reo.propertyId; })) {
                            reo.setProperty(property);
                        }
                    });
                    lib.forEach(currentAddressProperties, function (property) {
                        var isRemoved = _this.getPropertyMap().remove(property);
                        return isRemoved;
                    });
                }
            };
            this.shouldLoanNumberBeVisible = function () {
                return (!common.string.isNullOrWhiteSpace(_this.loanNumber) && _this.loanNumber.toLowerCase() != 'pending');
            };
            this.getActiveDisclosureDetailsViewModel = function () {
                var activeDisclosureModel = new srv.cls.DisclosuresDetailsViewModel();
                if (_this.closingCost && _this.closingCost.disclosuresDetailsViewModel) {
                    lib.forEach(_this.closingCost.disclosuresDetailsViewModel, function (disclosureDetail) {
                        if (disclosureDetail.active) {
                            activeDisclosureModel = disclosureDetail;
                        }
                    });
                }
                return activeDisclosureModel;
            };
            this.cashFlowBorrower = function () {
                return Math.abs(_this.getCashFlowForNetRentalIncomes(_this.primary.getBorrower(), true));
            };
            this.cashFlowCoBorrower = function () {
                return Math.abs(_this.getCashFlowForNetRentalIncomes(_this.primary.getCoBorrower(), true));
            };
            this.totalIncomeForBorrower = function () {
                return _this.getTotalBorrowerIncome(_this.primary.getBorrower());
            };
            this.totalIncomeForCoBorrower = function () {
                return !_this.primary.isSpouseOnTheLoan ? 0 : _this.getTotalCoBorrowerIncome(_this.primary.getCoBorrower());
            };
            this.getTotalBorrowerIncome = function (borrower) {
                return borrower.baseIncomeTotal + _this.getOtherIncomeSumForBorrowerWithMiscExpenses(borrower) + _this.getCashFlowForNetRentalIncomes(borrower, false);
            };
            this.getTotalCoBorrowerIncome = function (borrower) {
                return borrower.baseIncomeTotal + _this.getOtherIncomeSumForBorrowerWithMiscExpenses(borrower) + _this.getCashFlowForNetRentalIncomes(borrower, false);
            };
            this.populateLockingInformation = function () {
                var lockStatus = _this.getLockStatus();
                _this.lockingInformation.isLocked = lockStatus.isLocked;
                _this.lockingInformation.isLockExpired = lockStatus.isLockExpired;
                _this.lockingInformation.lockExpirationDate = moment(_this.lockingInformation.lockExpirationDate).isValid() ? moment(_this.lockingInformation.lockExpirationDate).toDate() : null;
                _this.lockingInformation.lockExpirationNumber = Math.abs(_this.calculateLockExpirationNumber()).toString();
            };
            this.updateGovermentEligibility = function (calculatorType, isEligible) {
                if (_this.financialInfo.mortgageType == calculatorType) {
                    switch (calculatorType) {
                        case 1 /* FHA */:
                            if (isEligible) {
                                _this.govermentEligibility = 1 /* FHAEligible */;
                            }
                            else {
                                _this.govermentEligibility = 2 /* FHANotEligible */;
                            }
                            break;
                        case 4 /* VA */:
                            if (isEligible) {
                                _this.govermentEligibility = 3 /* VAEligible */;
                            }
                            else {
                                _this.govermentEligibility = 4 /* VANotEligible */;
                            }
                            break;
                        case 5 /* USDA */:
                            if (isEligible) {
                                _this.govermentEligibility = 5 /* USDAEligible */;
                            }
                            else {
                                _this.govermentEligibility = 6 /* USDANotEligible */;
                            }
                            break;
                    }
                }
            };
            if (loan) {
                lib.copyState(loan, this);
                var loanCls = loan;
                if (!this.$filter && !!loanCls.$filter) {
                    this.$filter = loanCls.$filter;
                }
            }
            this.isWholeSale = isWholeSale;
            this.initialize(loan);
        }
        Object.defineProperty(LoanViewModel.prototype, "NegativeAmortization", {
            get: function () {
                return common.objects.boolToString(this.negativeAmortization);
            },
            set: function (value) {
                this.negativeAmortization = common.string.toBool(value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LoanViewModel.prototype, "PrePaymentPenalty", {
            get: function () {
                return common.objects.boolToString(this.prePaymentPenalty);
            },
            set: function (value) {
                this.prePaymentPenalty = common.string.toBool(value);
            },
            enumerable: true,
            configurable: true
        });
        LoanViewModel.getLookups = function () {
            return LoanViewModel._lookupInfo;
        };
        LoanViewModel.prototype.isSubordinateFinancing = function () {
            var _this = this;
            var items = lib.filter(this.primary.getCombinedPledgedAssets(), function (item) {
                return _this.loanPurposeType == 2 /* Refinance */ && (item.lienPosition > 1 && item.getProperty().isSubjectProperty && (item.borrowerDebtCommentId == 2 /* PayoffAtClose */ || item.borrowerDebtCommentId == 4 /* PayoffAtClosingAndCloseAccount */ || item.borrowerDebtCommentId == 3 /* PayoffAtClosingAndDontCloseAccount */));
            });
            return items.length > 0 || this.otherInterviewData.secondMortgageRefinanceComment != String(1 /* DoNotPayoff */);
        };
        Object.defineProperty(LoanViewModel.prototype, "active", {
            get: function () {
                return this._active ? this._active : (this._active = this.getLoanApplications()[0]);
            },
            set: function (active) {
                this.selectedAppIndex = this.getLoanApplications().indexOf(active);
                this._active = active;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LoanViewModel.prototype, "otherIncomes", {
            get: function () {
                return this.getOtherIncomes();
            },
            set: function (incomes) {
                this.setOtherIncomes(incomes);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LoanViewModel.prototype, "OtherIncomes", {
            get: function () {
                return this.getOtherIncomes();
            },
            set: function (incomes) {
                this.setOtherIncomes(incomes);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LoanViewModel.prototype, "CurrentLoanOriginationDate", {
            get: function () {
                return this.getCurrentLoanOriginationDate();
            },
            set: function (originationDate) {
                this.setCurrentLoanOriginationDate(originationDate);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LoanViewModel.prototype, "FirstLienReoItem", {
            get: function () {
                return this.getReoItemByLienPosition(1);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LoanViewModel.prototype, "JuniorLienReoItem", {
            get: function () {
                return this.getReoItemByLienPosition(2);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LoanViewModel.prototype, "CurrentAccountOpenDate", {
            get: function () {
                return this.getCurrentAccountOpenDate();
            },
            set: function (accountOpenDate) {
                this.setCurrentAccountOpenDate(accountOpenDate);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LoanViewModel.prototype, "CashFromToBorrower", {
            get: function () {
                return this.getCashFromToBorrower();
            },
            enumerable: true,
            configurable: true
        });
        LoanViewModel.prototype.setLoanApplicationsDefaults = function (loanApplication) {
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
        };
        Object.defineProperty(LoanViewModel.prototype, "subjectProperty", {
            get: function () {
                return this.getSubjectProperty();
            },
            set: function (subjProp) {
                /*Read-Only*/
                console.warn("LoanViewModel::<set subjectProperty> should not be called ; use setSubjectProperty() instead.");
            },
            enumerable: true,
            configurable: true
        });
        return LoanViewModel;
    })(srv.cls.LoanViewModel);
    cls.LoanViewModel = LoanViewModel;
})(cls || (cls = {}));
//# sourceMappingURL=loan.extendedViewModel.js.map