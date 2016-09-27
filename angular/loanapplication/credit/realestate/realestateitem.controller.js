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
var credit;
(function (credit) {
    var RealEstateItemController = (function () {
        function RealEstateItemController($modalInstance, $interval, CreditSvc, CreditHelpers, enums, isNew, originalPledgedAssetModel, disableFields, wrappedLoan, debtAccountOwnershipTypes, lookup, generalSettings, loanEvent, commonModalWindowFactory, modalWindowType, CreditStateService, guidService, modalPopoverFactory) {
            var _this = this;
            this.$modalInstance = $modalInstance;
            this.$interval = $interval;
            this.CreditSvc = CreditSvc;
            this.CreditHelpers = CreditHelpers;
            this.enums = enums;
            this.isNew = isNew;
            this.originalPledgedAssetModel = originalPledgedAssetModel;
            this.disableFields = disableFields;
            this.wrappedLoan = wrappedLoan;
            this.debtAccountOwnershipTypes = debtAccountOwnershipTypes;
            this.lookup = lookup;
            this.generalSettings = generalSettings;
            this.loanEvent = loanEvent;
            this.commonModalWindowFactory = commonModalWindowFactory;
            this.modalWindowType = modalWindowType;
            this.CreditStateService = CreditStateService;
            this.guidService = guidService;
            this.modalPopoverFactory = modalPopoverFactory;
            this.submitted = false;
            this.isReoValidationRequired = false;
            this.reoPropertyList = [];
            this.propertyExpenseDefaults = [
                { type: 1 /* propertyTax */, preferredPayPeriod: String(2 /* Annually */), impounded: true },
                { type: 4 /* hOADues */, preferredPayPeriod: String(1 /* Monthly */), impounded: false },
                { type: 3 /* mortgageInsurance */, preferredPayPeriod: String(1 /* Monthly */), impounded: true },
                { type: 2 /* homeOwnerInsurance */, preferredPayPeriod: String(2 /* Annually */), impounded: true },
                { type: 5 /* floodInsurance */, preferredPayPeriod: String(1 /* Monthly */), impounded: true },
            ];
            this.shouldResetLienPosition = false;
            this._lienPositionLookups = null;
            this.buildLienPositionLookupList = function () {
                if (!_this.hasProperty)
                    return [];
                // calculate taken lien positions for current property
                var property = _this.pledgedAssetModel.getProperty();
                var activeBorrower = _this.activeLoanApplication.getBorrower().borrowerId;
                var activeCoBorrower = _this.activeLoanApplication.getCoBorrower().borrowerId;
                var takenLienPositions = lib.filterWithProjection(_this.tiCopy.liability.getValues(), function (o) { return o.propertyId == property.propertyId && o.liabilityInfoId != _this.pledgedAssetModel.liabilityInfoId && (o.borrowerId == activeBorrower || o.borrowerId == activeCoBorrower) && !o.isRemoved; }, function (o) { return o.lienPosition; });
                // generate new list of lookup items
                var lienPositionLookups = RealEstateItemController.buildLienPositionLookupListDflt(_this.lookup.lienPosition);
                lienPositionLookups.forEach(function (lu) {
                    var exists = (0 < lib.findFirst(takenLienPositions, function (o) { return o == parseInt(lu.value); }));
                    lu.disabled = exists;
                });
                return lienPositionLookups;
            };
            this.getPropertyTypes = function () {
                if (_this.pledgedAssetModel.getProperty().isSubjectProperty)
                    return _this.lookup.subjectPropertyTypes;
                return _this.lookup.nonSubjectPropertyTypes;
            };
            this.initializePropertyExpenses = function () {
                if (_this.pledgedAssetModel.getProperty()) {
                    _this.propertyTaxExpense = _this.getPropertyExpense(1 /* propertyTax */);
                    _this.homeOwnerExpense = _this.getPropertyExpense(2 /* homeOwnerInsurance */);
                    _this.floodInsuranceExpense = _this.getPropertyExpense(5 /* floodInsurance */);
                    _this.mortgageInsuranceExpense = _this.getPropertyExpense(3 /* mortgageInsurance */);
                    _this.hoaDuesExpense = _this.getPropertyExpense(4 /* hOADues */);
                    _this._propertyTax = _this.formatAmount(_this.propertyTaxExpense);
                    _this._homeOwner = _this.formatAmount(_this.homeOwnerExpense);
                    _this._floodInsurance = _this.formatAmount(_this.floodInsuranceExpense);
                    _this._hoaDues = _this.formatAmount(_this.hoaDuesExpense);
                    _this._mortgageInsurance = _this.formatAmount(_this.mortgageInsuranceExpense);
                }
            };
            this.updateExpense = function (propertyExpense, amount) {
                if (propertyExpense.preferredPayPeriod == String(2 /* Annually */))
                    amount /= 12;
                else if (propertyExpense.preferredPayPeriod == String(6 /* SemiAnnually */))
                    amount /= 6;
                else if (propertyExpense.preferredPayPeriod == String(5 /* Quarterly */))
                    amount /= 3;
                propertyExpense.monthlyAmount = amount;
            };
            this.propertyTax = function (amount) {
                if (!angular.isDefined(amount))
                    return _this._propertyTax;
                else {
                    _this._propertyTax = amount;
                }
            };
            this.propertyTaxPayPeriodChanged = function () {
                _this.updateExpense(_this.propertyTaxExpense, _this._propertyTax);
            };
            this.hoaDues = function (amount) {
                if (!angular.isDefined(amount))
                    return _this._hoaDues;
                else {
                    _this._hoaDues = amount;
                }
            };
            this.hoaDuesPayPeriodChanged = function () {
                _this.updateExpense(_this.hoaDuesExpense, _this._hoaDues);
            };
            this.mortgageInsurance = function (amount) {
                if (!angular.isDefined(amount))
                    return _this._mortgageInsurance;
                else {
                    _this._mortgageInsurance = amount;
                }
            };
            this.triggerOwnership = function () {
                if (!_this.pledgedAssetModel.getProperty().OwnershipPercentage) {
                    _this.pledgedAssetModel.getProperty().OwnershipPercentage = 0;
                }
            };
            this.mortgageInsurancePayPeriodChanged = function () {
                _this.updateExpense(_this.mortgageInsuranceExpense, _this._mortgageInsurance);
            };
            this.homeOwner = function (amount) {
                if (!angular.isDefined(amount))
                    return _this._homeOwner;
                else {
                    _this._homeOwner = amount;
                }
            };
            this.homeOwnerPayPeriodChanged = function () {
                _this.updateExpense(_this.homeOwnerExpense, _this._homeOwner);
            };
            this.floodInsurance = function (amount) {
                if (!angular.isDefined(amount))
                    return _this._floodInsurance;
                else {
                    _this._floodInsurance = amount;
                }
            };
            this.floodInsurancePayPeriodChanged = function () {
                _this.updateExpense(_this.floodInsuranceExpense, _this._floodInsurance);
            };
            this.formatAmount = function (propertyExpense) {
                if (propertyExpense.preferredPayPeriod == String(2 /* Annually */))
                    return Math.round(propertyExpense.monthlyAmount * 12 * 10000) / 10000;
                else if (propertyExpense.preferredPayPeriod == String(6 /* SemiAnnually */))
                    return Math.round(propertyExpense.monthlyAmount * 6 * 10000) / 10000;
                else if (propertyExpense.preferredPayPeriod == String(5 /* Quarterly */))
                    return Math.round(propertyExpense.monthlyAmount * 3 * 10000) / 10000;
                else
                    return propertyExpense.monthlyAmount;
            };
            this.getPropertyExpense = function (expenseType) {
                var propertyExpense = lib.findFirst(_this.pledgedAssetModel.getProperty().propertyExpenses, function (pe) { return pe.type == expenseType.toString(); });
                if (!propertyExpense) {
                    var expenseDefault = lib.findFirst(_this.propertyExpenseDefaults, function (ped) { return ped.type == expenseType; });
                    propertyExpense = {
                        type: expenseType.toString(),
                        preferredPayPeriod: expenseDefault.preferredPayPeriod,
                        monthlyAmount: 0,
                        impounded: expenseDefault.impounded
                    };
                    _this.pledgedAssetModel.getProperty().propertyExpenses.push(propertyExpense);
                }
                return propertyExpense;
            };
            this.setPropertyExpenseImpounds = function () {
                _this.hoaDuesExpense.impounded = false;
                _this.mortgageInsuranceExpense.impounded = true;
                _this.propertyTaxExpense.impounded = false;
                _this.homeOwnerExpense.impounded = false;
                _this.floodInsuranceExpense.impounded = false;
                var selectedImpound = _this.pledgedAssetModel.selectedImpound;
                if (selectedImpound == 0 /* taxesAndInsurance */ || selectedImpound == 1 /* taxesOnly */) {
                    _this.propertyTaxExpense.impounded = true;
                }
                if (selectedImpound == 0 /* taxesAndInsurance */ || selectedImpound == 2 /* insuranceOnly */) {
                    _this.homeOwnerExpense.impounded = true;
                    _this.floodInsuranceExpense.impounded = true;
                }
            };
            // set the selected impound based on the state of the expenses
            this.setSelectedImpound = function () {
                if (_this.pledgedAssetModel.getProperty()) {
                    if (_this.propertyTaxExpense.impounded && _this.homeOwnerExpense.impounded && _this.floodInsuranceExpense.impounded)
                        _this.pledgedAssetModel.selectedImpound = 0 /* taxesAndInsurance */;
                    else if (_this.propertyTaxExpense.impounded)
                        _this.pledgedAssetModel.selectedImpound = 1 /* taxesOnly */;
                    else if (_this.homeOwnerExpense.impounded && _this.floodInsuranceExpense.impounded)
                        _this.pledgedAssetModel.selectedImpound = 2 /* insuranceOnly */;
                    else
                        _this.pledgedAssetModel.selectedImpound = 3 /* noImpound */;
                }
            };
            this.setValuesFromGeneralSettings = function () {
                angular.forEach(_this.generalSettings, function (setting) {
                    if (setting.settingName == "Show Investment Property") {
                        _this.realEstateViewModel.showInvestmentProperty = setting ? setting.status : true;
                    }
                    if (setting.settingName == "Show Investment Property") {
                        _this.realEstateViewModel.showSecondVacationHome = setting ? setting.status : true;
                    }
                });
            };
            this.buildAddressesList = function () {
                _this.realEstateViewModel.addressForDropDown = [];
                var uniqueProperties = _this.activeLoanApplication.getUniqueProperties();
                uniqueProperties.forEach(function (p) { return _this.reoPropertyList.push(new cls.PropertySnapshot(p, _this.tiCopy)); });
                var reosWithProperties = lib.filter(_this.activeLoanApplication.getAllLiabilitiesCombined(), function (l) { return l.isPledged && !!l.propertyId; });
                _this.reoPropertyList.forEach(function (propertyItem) {
                    _this.realEstateViewModel.addressForDropDown.push(new cls.LookupItem(propertyItem.fullAddressString, propertyItem.propertyId));
                    var reosWithLienPositions = lib.filter(reosWithProperties, function (reo) { return reo.propertyId == propertyItem.propertyId && reo.lienPosition > 0; });
                });
                var newProperty = _this.createNewDefaultProperty();
                _this.newPropertyId = newProperty.propertyId;
                _this.realEstateViewModel.addressForDropDown.push(new cls.LookupItem('Not listed - add a property', newProperty.propertyId));
                _this.reoPropertyList.push(newProperty);
            };
            this.createNewDefaultProperty = function () {
                var defaultProperty = new cls.PropertySnapshot();
                defaultProperty.addressTypeId = 6 /* RealEstate */;
                defaultProperty.occupancyType = 0 /* None */;
                defaultProperty.OwnershipPercentage = 100;
                defaultProperty.vacancyPercentage = 75;
                defaultProperty.isSubjectProperty = false;
                return defaultProperty;
            };
            this.onREOAddressChange = function () {
                // set Default Ownership
                if (_this.pledgedAssetModel.getProperty() && _this.pledgedAssetModel.getProperty().isSubjectProperty) {
                    _this.pledgedAssetModel.getProperty().OwnershipPercentage = _this.activeLoanApplication.ownershipPercentage;
                }
                // Pre-select comment based on address type for refinance
                if (_this.loanType == _this.enums.LoanTransactionTypes.Refinance) {
                    if (_this.pledgedAssetModel.getProperty() && _this.pledgedAssetModel.getProperty().isSubjectProperty) {
                        _this.borrowerDebtCommentId = _this.enums.PledgedAssetComment.PayoffAtClose;
                    }
                    else {
                        _this.borrowerDebtCommentId = _this.enums.PledgedAssetComment.DoNotPayoff;
                    }
                }
            };
            this.validateReo = function () {
                if (_this.areSixPiecesAcquiredForAllLoanApplications) {
                    // **(this.pledgedAssetModel.borrowerDebtCommentId !== 0 || this.pledgedAssetModel.borrowerDebtCommentId) - rule to validate zero and check if value is falsy
                    if (_this.pledgedAssetModel && (_this.pledgedAssetModel.borrowerDebtCommentId !== 0 || _this.pledgedAssetModel.borrowerDebtCommentId) && _this.pledgedAssetModel.borrowerDebtCommentId == 6)
                        _this.isReoValidationRequired = false;
                    else
                        _this.isReoValidationRequired = true;
                }
            };
            this.helocHighLimitValidation = function () {
                // *Rules are separated for better readability
                // -- case six pieces completed & reo validation required
                if (!_this.areReoValidationAndSixPiecesRequired())
                    return false;
                // -- case field disabled
                if (_this.pledgedAssetModel.liabilityDisabled || _this.pledgedAssetModel.pledgedAssetLoanType != _this.enums.PledgedAssetLoanType.Heloc)
                    return false;
                // -- case model validation
                return !_this.pledgedAssetModel.maximumCreditLine;
            };
            this.isLienPositionFirstValidation = function () {
                return _this.areReoValidationAndSixPiecesRequired() && !_this.pledgedAssetModel.liabilityDisabled && _this.pledgedAssetModel.lienPosition == 1; // lienPosition == 1 -> First position
            };
            this.areReoValidationAndSixPiecesRequired = function () {
                return (_this.areSixPiecesAcquiredForAllLoanApplications && _this.isReoValidationRequired);
            };
            this.harpMortgageInsuranceChanged = function (value) {
                _this.pledgedAssetModel.getProperty().doYouPayMortgageInsurance = value;
                _this.disableMortgageInsurance = !_this.pledgedAssetModel.getProperty().doYouPayMortgageInsurance;
                _this.mortgageInsuranceExpense.preferredPayPeriod = '1';
            };
            this.reoCommentChanged = function () {
                var unmodifiedBalance = _this.pledgedAssetModel.unpaidBalance;
                var unmodifiedPayment = _this.pledgedAssetModel.minPayment;
                _this.validateReo();
                _this.processRulesForREOComment(_this.pledgedAssetModel);
                if (!unmodifiedBalance)
                    _this.pledgedAssetModel.unpaidBalance = 0;
                if (!unmodifiedPayment)
                    _this.pledgedAssetModel.minPayment = 0;
                if (!_this.pledgedAssetModel.companyData) {
                    _this.pledgedAssetModel.companyData = new cls.CompanyDataViewModel();
                }
                _this.updateOccupancyTypeAttributes();
            };
            this.processRulesForREOComment = function (pledgedAssetModel) {
                var pledgedAssetComment = parseInt(pledgedAssetModel.borrowerDebtCommentId);
                pledgedAssetModel.liabilityDisabled = _this.isReoDisabled(pledgedAssetComment);
                pledgedAssetModel.notMyLoan = pledgedAssetModel.borrowerDebtCommentId == _this.enums.PledgedAssetComment.NotMyLoan;
                // cannot impound anything when a property is free and clear
                if (pledgedAssetModel.borrowerDebtCommentId == _this.enums.PledgedAssetComment.PaidOffFreeAndClear) {
                    lib.conditionalForEach(_this.pledgedAssetModel.getProperty().propertyExpenses, function (pe) { return +pe.type != 3 /* PMI */; }, function (pe) { return pe.impounded = false; });
                    _this.pledgedAssetModel.selectedImpound = 3 /* noImpound */;
                    _this.pledgedAssetModel.unpaidBalance = 0;
                }
            };
            this._isDisabledComment = false;
            this.isReoDisabled = function (pledgedAssetComment) {
                switch (pledgedAssetComment) {
                    case _this.enums.PledgedAssetComment.DoNotPayoff:
                    case _this.enums.PledgedAssetComment.PayoffAtClose:
                    case _this.enums.PledgedAssetComment.PayoffAtClosingAndCloseAccount:
                    case _this.enums.PledgedAssetComment.PayoffAtClosingAndDontCloseAccount:
                    case _this.enums.PledgedAssetComment.PendingSale:
                    case _this.enums.PledgedAssetComment.Sold:
                        return false;
                    case _this.enums.PledgedAssetComment.NotAMortgage:
                    case _this.enums.PledgedAssetComment.NotMyLoan:
                        return true;
                }
                return false;
            };
            this.resetLienPositionsAsynchIdx = -1;
            this.resetLienPositionsAsynchCtx = null;
            this.resetLienPositionsAsynch = function () {
                _this.resetLienPositionsAsynchIdx = 1;
                _this.resetLienPositionsAsynchCtx = _this.$interval(_this.resetLienPositionsCb, 128);
            };
            this.resetLienPositionsCb = function () {
                _this.resetLienPositionsSynch();
                if (0 > --_this.resetLienPositionsAsynchIdx) {
                    _this.$interval.cancel(_this.resetLienPositionsAsynchCtx);
                }
            };
            this.resetLienPositionsSynch = function () {
                try {
                    var luDflt = RealEstateItemController.buildLienPositionLookupListDflt(_this.lookup.lienPosition);
                    var luTx = _this.buildLienPositionLookupList();
                    _this._lienPositionLookups = luDflt;
                    _this._lienPositionLookups = luTx;
                    if (_this.shouldResetLienPosition) {
                        _this.lienPosition = null;
                    }
                    _this.resetLienPositionsJQuery();
                }
                catch (e) {
                    console.error(e.toString());
                }
            };
            this.resetLienPositionsJQuery = function () {
                //
                // @see optionsDisabled directive in ./MML.Web.LoanCenter/angular/common/common.directives.js
                //
                // Due to deficiencies in [optionsDisabled] directive , we must use JQuery here
                //      and we must be reliant upon HTML <select/> name attritbute
                //      <select name="lienPosition" ... >...</select>
                var bry = lib.filterWithProjection(_this._lienPositionLookups, function (o) { return true; }, function (o) { return o.disabled; });
                var theSelectElement = $("select[name=lienPosition]");
                $("option[value!=''][value!='?']", theSelectElement).each(function (i, e) {
                    $(this).attr("disabled", (bry[i] ? "" : null));
                });
            };
            this.loanTypeChanged = function (asset) {
                // If loan type is not heloc, reset MaximumCreditLine
                if (asset.pledgedAssetLoanType != _this.enums.PledgedAssetLoanType.Heloc)
                    asset.maximumCreditLine = "";
            };
            this.updateOccupancyTypeAttributes = function () {
                var listOccupancyType = [];
                var isDisabledOccupancyType = false;
                if (_this.hasProperty) {
                    listOccupancyType = _this.copyListOccupancyType();
                    var pvm = _this.pledgedAssetModel.getProperty();
                    var omtx = _this.locateOccupancyMtx(pvm);
                    if (!!omtx) {
                        for (var i = 0; i < listOccupancyType.length; i++) {
                            var enabled = !!lib.findFirst(omtx.occupancyTypeList, function (o) { return o.text == listOccupancyType[i].text; });
                            listOccupancyType[i].disabled = !enabled;
                        }
                        // select disabled?
                        isDisabledOccupancyType = omtx.isDisabled;
                        // valid comments?
                        _this._isValidComments = omtx.isValidComments;
                        //handle specific cases for purchase loans
                        if (_this.wrappedLoan.ref.loanPurposeType == 1 /* Purchase */) {
                            // Is currently selected occupancy type on property valid? If not, set to None
                            if (pvm.OccupancyType != 0 /* None */ && !isDisabledOccupancyType) {
                                var currentOccupancyLookupItem = lib.findSingle(listOccupancyType, function (o) { return o.value == String(pvm.OccupancyType); });
                                if (!!currentOccupancyLookupItem && currentOccupancyLookupItem.disabled && String(pvm.OccupancyType) == currentOccupancyLookupItem.value) {
                                    pvm.OccupancyType = 0 /* None */;
                                }
                            }
                            //for purchase loan, if occupancy type is disabled, it is set to primary
                            if (isDisabledOccupancyType && _this._isValidComments) {
                                pvm.OccupancyType = 1 /* PrimaryResidence */;
                            }
                        }
                    }
                }
                _this._listOccupancyType = listOccupancyType;
                _this._isDisabledOccupancyType = isDisabledOccupancyType;
            };
            this.copyListOccupancyType = function () {
                var listOccupancyType = [];
                for (var i = 0; i < _this.lookup.occupancyTypeList.length; i++) {
                    var li = cls.LookupItem.fromLookupItem(_this.lookup.occupancyTypeList[i]);
                    li.selected = false;
                    li.disabled = false;
                    listOccupancyType.push(li);
                }
                return listOccupancyType;
            };
            this._listOccupancyType = [];
            this._isDisabledOccupancyType = false;
            this._isValidComments = true;
            this.locateOccupancyMtx = function (pvm) {
                var omtxInp = _this.buildOccupancyMtx(pvm);
                var omtxOut = omtxInp.locate(_this.lookup);
                return omtxOut;
            };
            this.buildOccupancyMtx = function (pvm) {
                var loanPurpCd = _this.loanType;
                var subjOccupancy = _this.subjPropOccupancy;
                var residenceSubjCd = _this.isCurentResidenceSameAsSubject;
                var residenceOwnership = _this.currentResidenceOwnership;
                var reoCtgCd = _this.calculateReoCategorization(pvm);
                var comments = _this.lookup.pledgetAssetCommentsFlgFromValues([_this.pledgedAssetModel.borrowerDebtCommentId.toString()]);
                var omtx = new credit.OccupancyMtx(loanPurpCd, subjOccupancy, residenceSubjCd, residenceOwnership, reoCtgCd, comments);
                return omtx;
            };
            this.calculateReoCategorization = function (pvm) {
                var reoctgcd = new credit.ReoCategorizationFlg(0);
                // Subject Property is Subject Property
                var isSubjectProperty = _this.isSubjectProperty(pvm);
                // Add the flag
                if (isSubjectProperty)
                    reoctgcd = reoctgcd.add(credit.ReoCategorizationEnum.SubjectProperty);
                else
                    reoctgcd = reoctgcd.add(credit.ReoCategorizationEnum.NonSubjectProperty);
                // Current Residence could be Current Residence or Subject Property
                var isCurrentResidence;
                if (pvm.propertyId == _this.wrappedLoan.ref.active.getBorrower().getCurrentAddress().propertyId) {
                    isCurrentResidence = true;
                }
                else if (isSubjectProperty && _this.wrappedLoan.ref.active.getBorrower().getCurrentAddress().isSameAsPropertyAddress) {
                    isCurrentResidence = true;
                }
                else
                    isCurrentResidence = false;
                // Add the flag
                if (isCurrentResidence)
                    reoctgcd = reoctgcd.add(credit.ReoCategorizationEnum.CurrentResidence);
                else
                    reoctgcd = reoctgcd.add(credit.ReoCategorizationEnum.NonCurrentResidence);
                // Niether means ad-hoc
                if (!isSubjectProperty && !isCurrentResidence)
                    reoctgcd = reoctgcd.add(credit.ReoCategorizationEnum.AdHoc);
                else
                    reoctgcd = reoctgcd.add(credit.ReoCategorizationEnum.NonAdHoc);
                // done.
                return reoctgcd;
            };
            this.isSubjectProperty = function (propertyVm) {
                return !!propertyVm && propertyVm.isSubjectProperty;
            };
            this.isCurrentResidence = function (propertyVm) {
                if (!propertyVm || !propertyVm.propertyId)
                    return false;
                if (!_this.wrappedLoan || !_this.wrappedLoan.ref || !_this.wrappedLoan.ref.active || !_this.wrappedLoan.ref.active.getBorrower() || !_this.wrappedLoan.ref.active.getBorrower().getCurrentAddress() || !_this.wrappedLoan.ref.active.getBorrower().getCurrentAddress() || !_this.wrappedLoan.ref.active.getBorrower().getCurrentAddress().propertyId)
                    return false;
                // Is same Id as borrower current residence address ?
                return propertyVm.propertyId == _this.wrappedLoan.ref.active.getBorrower().getCurrentAddress().propertyId;
            };
            this.selectedImpound = function (impound) {
                if (!angular.isDefined(impound))
                    return _this.pledgedAssetModel.selectedImpound;
                else {
                    _this.pledgedAssetModel.selectedImpound = impound;
                    _this.setPropertyExpenseImpounds();
                }
            };
            this.displayImpoundList = function () {
                // hide Impound dll if lien position is not first
                return _this.pledgedAssetModel.lienPosition == 1;
            };
            this.cancel = function () {
                _this.$modalInstance.dismiss('cancel');
                _this.updateDTI(false);
            };
            // @todo-cl: Is this really necessary?
            this._updateDTI = false;
            this.updateDTI = function (shouldUpdate) {
                _this._updateDTI = shouldUpdate;
            };
            this.done = function (form) {
                // @todo-cl: Remove if not required
                // var ti = <cls.TransactionInfo>this.wrappedLoan.ref.getTransactionInfo();
                // @todo-cl: Review , what's the deal with DebtsAccountOwnershipType
                // var ownershipType: number = parseInt(this.pledgedAssetModel.DebtsAccountOwnershipType);
                var ownershipType = parseInt(_this.pledgedAssetModel.debtsAccountOwnershipType);
                var isCoBorrowerOwner = _this.activeLoanApplication.isSpouseOnTheLoan && (ownershipType == 1 /* CoBorrower */ || ownershipType == 4 /* CoBorrowerWithOther */);
                _this.pledgedAssetModel.borrowerId = isCoBorrowerOwner ? _this.activeLoanApplication.getCoBorrower().borrowerId : _this.activeLoanApplication.getBorrower().borrowerId;
                _this.pledgedAssetModel.isJoint = ownershipType == 2 /* Joint */;
                _this.pledgedAssetModel.isJointWithSingleBorrowerID = ownershipType == 4 /* CoBorrowerWithOther */ || ownershipType == 3 /* BorrowerWithOther */;
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
                var propertyPndg = _this.pledgedAssetModel.getProperty();
                var propertyFinl;
                if (!!propertyPndg) {
                    // property
                    propertyFinl = new cls.PropertyViewModel(_this.wrappedLoan.ref.getTransactionInfoRef(), propertyPndg, _this.wrappedLoan.ref.homeBuyingType);
                    propertyFinl.borrowerId = _this.pledgedAssetModel.borrowerId;
                    if (!propertyFinl.loanId) {
                        // apply loanApplicationId if not exists
                        // @todo-cc: review
                        propertyFinl.loanId = _this.wrappedLoan.ref.loanId;
                    }
                    if (!propertyFinl.loanApplicationId) {
                        // apply loanApplicationId if not exists
                        // @todo-cc: review
                        propertyFinl.loanApplicationId = _this.wrappedLoan.ref.active.loanApplicationId;
                    }
                    // net rental income
                    // @todo-cl: resolve nonsensical indirection and nonsense here mostly resulting from Property Snapshot inheritence
                    propertyFinl.OccupancyType = propertyPndg.OccupancyType;
                    if (propertyFinl.OccupancyType == 2 /* InvestmentProperty */) {
                        propertyFinl.grossRentalIncome = propertyPndg.grossRentalIncome;
                        propertyFinl.OwnershipPercentage = propertyPndg.OwnershipPercentage;
                        propertyFinl.vacancyPercentage = propertyPndg.vacancyPercentage;
                    }
                    _this.updateExpense(_this.propertyTaxExpense, _this._propertyTax);
                    _this.updateExpense(_this.hoaDuesExpense, _this._hoaDues);
                    _this.updateExpense(_this.mortgageInsuranceExpense, _this._mortgageInsurance);
                    _this.updateExpense(_this.homeOwnerExpense, _this._homeOwner);
                    _this.updateExpense(_this.floodInsuranceExpense, _this._floodInsurance);
                }
                else {
                    propertyFinl = null;
                }
                var reo = new cls.LiabilityViewModel(_this.wrappedLoan.ref.getTransactionInfoRef(), _this.pledgedAssetModel, _this.pledgedAssetModel.borrowerFullName);
                reo.isPledged = true;
                reo.setProperty(propertyFinl);
                //
                _this.CreditStateService.updateREO(reo);
                _this.CreditStateService.updateCredit(_this.wrappedLoan);
                _this.$modalInstance.close();
                _this.loanEvent.broadcastPropertyChangedEvent(30 /* todo */);
            };
            this.getPledgedAssets = function () {
                return _this.wrappedLoan.ref.active.reos;
            };
            this.addressNotSelected = function () {
                return !_this.pledgedAssetModel.getProperty() || !_this.pledgedAssetModel.getProperty().propertyId;
            };
            // Checks the validity of the REO form
            this.isValid = function (form) {
                _this.validateInputFields(form);
                if (form.propertyTax.$invalid || form.currentEstimatedValue.$invalid || form.subjectPropertyTypes.$invalid || form.occupancyTypeList.$invalid || form.mortgageInsurance.$invalid)
                    return false;
                // Validate Investment Property rules
                if (_this.isInvestmentProperty && (form.ownershipPercentage.$invalid || form.vacancyPercentage.$invalid))
                    return false;
                // Validate property address fields
                if (form.realEstateItemStreetName.$invalid || form.realEstateItemCityName.$invalid || form.realEstateItemStateName.$invalid || form.realEstateItemZipCode.$invalid)
                    return false;
                return true;
            };
            // Validates currency and percentage input fields for zero/empty values
            this.validateInputFields = function (form) {
                // Validate current estimated value for property
                if (_this.pledgedAssetModel.getProperty().currentEstimatedValue == undefined || _this.pledgedAssetModel.getProperty().currentEstimatedValue == 0)
                    _this.CreditHelpers.setInvalidValidationFlag(form.currentEstimatedValue);
                else
                    _this.CreditHelpers.resetInvalidValidationFlag(form.currentEstimatedValue);
                // Validate property tax
                if (_this.pledgedAssetModel.getProperty().propertyTaxExpense.monthlyAmount == 0)
                    _this.CreditHelpers.setInvalidValidationFlag(form.propertyTax);
                else
                    _this.CreditHelpers.resetInvalidValidationFlag(form.propertyTax);
                // Validate high limit (MaximumCreditLine) for HELOC loan type
                if (form.highLimit != undefined && _this.pledgedAssetModel.pledgedAssetLoanType == _this.enums.PledgedAssetLoanType.Heloc) {
                    var highLimitValue = _this.pledgedAssetModel.maximumCreditLine;
                    if (!highLimitValue)
                        _this.CreditHelpers.setInvalidValidationFlag(form.highLimit);
                    else
                        _this.CreditHelpers.resetTouchedValidationFlag(form.highLimit);
                }
                // Validate MortgageInsurance for HARP
                if (_this.isLoanHarp && _this.pledgedAssetModel.getProperty().doYouPayMortgageInsurance) {
                    if (!_this.pledgedAssetModel.getProperty().mortgageInsuranceExpense.monthlyAmount)
                        _this.CreditHelpers.setInvalidValidationFlag(form.mortgageInsurance);
                    else
                        _this.CreditHelpers.resetTouchedValidationFlag(form.mortgageInsurance);
                }
                // Validate Investment Property rules
                if (_this.isInvestmentProperty) {
                    if (!_this.isValidPercentage(_this.pledgedAssetModel.getProperty().OwnershipPercentage))
                        _this.CreditHelpers.setInvalidValidationFlag(form.ownershipPercentage);
                    else
                        _this.CreditHelpers.resetTouchedValidationFlag(form.ownershipPercentage);
                    if (!_this.isValidPercentage(_this.pledgedAssetModel.getProperty().vacancyPercentage))
                        _this.CreditHelpers.setInvalidValidationFlag(form.vacancyPercentage);
                    else
                        _this.CreditHelpers.resetTouchedValidationFlag(form.vacancyPercentage);
                }
                // Validate comment rules
                if (_this.submitted && _this.pledgedAssetModel.isLenderSectionVisible) {
                    _this.CreditHelpers.setTouchedValidationFlag(form.debtsAccountOwnershipType);
                    _this.CreditHelpers.setTouchedValidationFlag(form.companyName);
                    _this.CreditHelpers.setTouchedValidationFlag(form.lienPosition);
                    _this.CreditHelpers.setTouchedValidationFlag(form.unpaidBalance);
                    _this.CreditHelpers.setTouchedValidationFlag(form.minPayment);
                }
                // Validate property address fields 
                if (_this.submitted) {
                    _this.CreditHelpers.setTouchedValidationFlag(form.realEstateItemStreetName);
                    _this.CreditHelpers.setTouchedValidationFlag(form.realEstateItemCityName);
                    _this.CreditHelpers.setTouchedValidationFlag(form.realEstateItemStateName);
                    _this.CreditHelpers.setTouchedValidationFlag(form.realEstateItemZipCode);
                }
            };
            this.isValidPercentage = function (value) {
                return value != null && value != undefined && value != "" && !isNaN(value);
            };
            this.getMortgageInsurancePreferredPayPeriodStyle = function (form) {
                return (_this.pledgedAssetModel.liabilityDisabled || _this.disableMortgageInsurance || _this.addressNotSelected()) ? 'disabled' : ((_this.isLoanHarp && _this.pledgedAssetModel.getProperty().doYouPayMortgageInsurance) && (_this.submitted || form.mortgageInsurance.$touched) && (form.mortgageInsurance.$invalid || _this._mortgageInsurance == 0)) ? 'ng-invalid ng-dirty' : '';
            };
            //TODO: Refactor rest of the items to use this method
            this.isPropertyInvestment = function () {
                _this.isInvestmentProperty = _this.pledgedAssetModel.getProperty() && _this.pledgedAssetModel.getProperty().OccupancyType == _this.enums.OccupancyTypes.InvestmentProperty;
                return _this.isInvestmentProperty;
            };
            this.showPriorAdverseRatingHistory = function ($event, priorAdverseRatings) {
                var ctrl = {
                    lookups: _this.lookup
                };
                _this.modalPopoverFactory.openModalPopover('angular/loanapplication/credit/realestate/priorAdverseRating.html', ctrl, priorAdverseRatings, event);
            };
            this.isValidInvalidComment = function () {
                return _this.borrowerDebtCommentId != _this.enums.PledgedAssetComment.NotMyLoan || _this.borrowerDebtCommentId != _this.enums.PledgedAssetComment.Duplicate;
            };
            this.isAddressInvalid = function () {
                return !_this.pledgedAssetModel.getProperty() && _this.borrowerDebtCommentId != _this.enums.PledgedAssetComment.NotMyLoan && _this.borrowerDebtCommentId != _this.enums.PledgedAssetComment.NotAMortgage && !!_this.wrappedLoan.ref.areSixPiecesAcquiredForAllLoanApplications == true;
            };
            this.isOccupancyValid = function () {
                return _this.isReoValidationRequired && !_this.pledgedAssetModel.getProperty().OccupancyType && !!_this.pledgedAssetModel.getProperty().propertyId;
            };
            this.pledgetAssetCommentsFiltered = function () {
                if (_this.wrappedLoan.ref.loanPurposeType == 1 /* Purchase */) {
                    return lib.filter(_this.lookup.pledgetAssetComments, function (p) { return +p.value != 9 /* Duplicate */; });
                }
                return _this.lookup.pledgetAssetComments;
            };
            // shallow copy of LoanViewModel , deep copy of TransactionalInfo
            var tiOrig = wrappedLoan.ref.getTransactionInfo();
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
        Object.defineProperty(RealEstateItemController.prototype, "tiCopy", {
            get: function () {
                return this._tiCopy;
            },
            set: function (tiCopy) {
                this._tiCopy = tiCopy;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RealEstateItemController.prototype, "lienPosition", {
            get: function () {
                return this.pledgedAssetModel.lienPosition;
            },
            set: function (lienPosition) {
                this.pledgedAssetModel.lienPosition = lienPosition;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RealEstateItemController.prototype, "lienPositionLookups", {
            get: function () {
                if (this._lienPositionLookups == null) {
                    this._lienPositionLookups = this.buildLienPositionLookupList();
                }
                return this._lienPositionLookups;
            },
            set: function (readOnly) {
                /*Read-Only*/
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RealEstateItemController.prototype, "borrowerDebtCommentId", {
            get: function () {
                return this.pledgedAssetModel.borrowerDebtCommentId;
            },
            set: function (borrowerDebtCommentId) {
                this.pledgedAssetModel.borrowerDebtCommentId = borrowerDebtCommentId;
                this.reoCommentChanged();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RealEstateItemController.prototype, "disableComment", {
            get: function () {
                return this.disableFields || this._isDisabledComment;
            },
            set: function (disableComment) {
                this._isDisabledComment = disableComment;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RealEstateItemController.prototype, "hasProperty", {
            get: function () {
                return !!this.pledgedAssetModel && !!this.pledgedAssetModel.getProperty() && !!this.pledgedAssetModel.getProperty().propertyId && this.pledgedAssetModel.getProperty().propertyId != lib.getEmptyGuid();
            },
            set: function (hasProperty) {
                /* Read-Only */
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RealEstateItemController.prototype, "propertyId", {
            get: function () {
                return this.pledgedAssetModel.getProperty() ? this.pledgedAssetModel.getProperty().propertyId : lib.getEmptyGuid();
            },
            set: function (propertyId) {
                this.shouldResetLienPosition = propertyId != (this.pledgedAssetModel.hasProperty() && this.pledgedAssetModel.getProperty().propertyId);
                this.pledgedAssetModel.setProperty(lib.findFirst(this.reoPropertyList, function (l) { return l.propertyId == propertyId; }));
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
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RealEstateItemController.prototype, "isInvestmentProperty", {
            get: function () {
                return this.hasProperty && this.pledgedAssetModel.getProperty().OccupancyType == this.enums.OccupancyTypes.InvestmentProperty;
            },
            set: function (readOnly) {
                /*Read-Only*/
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RealEstateItemController.prototype, "listOccupancyType", {
            get: function () {
                return this._listOccupancyType;
            },
            set: function (readOnly) {
                /*Read-Only*/
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RealEstateItemController.prototype, "isDisabledOccupancyType", {
            get: function () {
                return this._isDisabledOccupancyType;
            },
            set: function (readOnly) {
                /*Read-Only*/
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RealEstateItemController.prototype, "isValidComments", {
            get: function () {
                return this._isValidComments;
            },
            set: function (readOnly) {
                /*Read-Only*/
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RealEstateItemController.prototype, "subjPropOccupancy", {
            get: function () {
                return this.wrappedLoan.ref.getSubjectProperty().OccupancyType;
            },
            set: function (occupancy) {
                /*Read-Only*/
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RealEstateItemController.prototype, "isCurentResidenceSameAsSubject", {
            get: function () {
                if (this.wrappedLoan.ref.active.getBorrower().getCurrentAddress().isSameAsPropertyAddress)
                    return 1 /* IsSame */;
                else
                    return 2 /* IsDiff */;
            },
            set: function (isSame) {
                /*Read-Only*/
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RealEstateItemController.prototype, "currentResidenceOwnership", {
            get: function () {
                return this.wrappedLoan.ref.active.getBorrower().getCurrentAddress().ownership;
            },
            set: function (ownership) {
                /*Read-Only*/
            },
            enumerable: true,
            configurable: true
        });
        RealEstateItemController.$inject = ['$modalInstance', '$interval', 'CreditSvc', 'CreditHelpers', 'enums', 'isNew', 'originalPledgedAssetModel', 'disableFields', 'wrappedLoan', 'debtAccountOwnershipTypes', 'lookup', 'generalSettings', 'loanEvent', 'commonModalWindowFactory', 'modalWindowType', 'CreditStateService', 'guidService', 'modalPopoverFactory'];
        RealEstateItemController.buildLienPositionLookupListDflt = function (lookups) {
            var lienPositionLookups = [];
            lookups.forEach(function (lu) { return lienPositionLookups.push(cls.LookupItem.fromLookupItem(lu)); });
            return lienPositionLookups;
        };
        return RealEstateItemController;
    })();
    angular.module('loanApplication').controller('realEstateItemController', RealEstateItemController);
})(credit || (credit = {}));
//# sourceMappingURL=realestateitem.controller.js.map