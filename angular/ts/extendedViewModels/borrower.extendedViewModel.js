/// <reference path="../../ts/generated/viewModels.ts" />
/// <reference path="../../ts/generated/viewModelClasses.ts" />
/// <reference path="../../ts/extendedViewModels/employmentinfo.extendedViewModel.ts" />
/// <reference path="../../ts/extendedViewModels/asset.extendedViewModel.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var cls;
(function (cls) {
    (function (LiablitityTypeEnum) {
        LiablitityTypeEnum[LiablitityTypeEnum["REO"] = 1] = "REO";
        LiablitityTypeEnum[LiablitityTypeEnum["Liability"] = 2] = "Liability";
        LiablitityTypeEnum[LiablitityTypeEnum["Collection"] = 3] = "Collection";
        LiablitityTypeEnum[LiablitityTypeEnum["PublicRecord"] = 4] = "PublicRecord";
        LiablitityTypeEnum[LiablitityTypeEnum["MiscExpense"] = 5] = "MiscExpense";
    })(cls.LiablitityTypeEnum || (cls.LiablitityTypeEnum = {}));
    var LiablitityTypeEnum = cls.LiablitityTypeEnum;
    var BorrowerViewModel = (function (_super) {
        __extends(BorrowerViewModel, _super);
        function BorrowerViewModel(ti, borrower) {
            var _this = this;
            _super.call(this);
            this.defaultName = 'New Application';
            this.hasTransactionalInfo = function () {
                return (!!_this.ticb && !!_this.ticb());
            };
            this.getTransactionalInfo = function () {
                if (_this.hasTransactionalInfo())
                    return _this.ticb();
                else
                    return null;
            };
            this.setTransactionalInfo = function (ti) {
                _this.ticb = function () { return ti; };
            };
            //
            this.hasTransactionalInfoLiability = function () {
                if (_this.hasTransactionalInfo() && !!_this.getTransactionalInfo().liability) {
                    return true;
                }
                else {
                    return false;
                }
            };
            this.getTransactionInfoLiability = function () {
                if (_this.hasTransactionalInfoLiability()) {
                    return _this.getTransactionalInfo().liability;
                }
                return new cls.Map();
            };
            this.getLiabilities = function () {
                if (_this.hasTransactionalInfoLiability()) {
                    return lib.filter(_this.getTransactionInfoLiability().getValues(), function (o) { return !o.isRemoved && o.borrowerId == _this.borrowerId; });
                }
                return [];
            };
            this.addLiability = function (liability) {
                if (!!liability && _this.hasTransactionalInfoLiability()) {
                    liability.borrowerId = _this.borrowerId;
                    _this.getLiabilities().push(liability);
                }
            };
            //
            this.hasTransactionalInfoOtherIncomes = function () {
                if (_this.hasTransactionalInfo() && !!_this.getTransactionalInfo().incomeInfo) {
                    return true;
                }
                else {
                    return false;
                }
            };
            this.getTransactionInfoOtherIncome = function () {
                if (_this.hasTransactionalInfoOtherIncomes()) {
                    return _this.getTransactionalInfo().incomeInfo;
                }
                return new cls.Map([], function (o) { return o.incomeInfoId; });
            };
            this.getTransactionInfoAddress = function () {
                return new cls.Map([], function (o) { return o.borrowerId; });
            };
            this.getOtherIncomes = function () {
                if (_this.hasTransactionalInfoOtherIncomes()) {
                    var incomes = lib.filter(_this.getTransactionInfoOtherIncome().getValues(), function (o) { return o.borrowerId == _this.borrowerId && !o.isRemoved && (!o.employmentInfoId || o.employmentInfoId == lib.getEmptyGuid()); });
                    return incomes;
                }
                return [];
            };
            this.setOtherIncomes = function (incomes) {
                if (!!incomes && _this.hasTransactionalInfoOtherIncomes()) {
                    incomes.forEach(function (o) {
                        o.borrowerId = _this.borrowerId;
                        o.employmentInfoId = null;
                    });
                    _this.getTransactionInfoOtherIncome().mapAll(incomes);
                }
            };
            this.addOtherIncome = function () {
                var otherIncomeNew = new cls.IncomeInfoViewModel(_this.getTransactionalInfo());
                otherIncomeNew.isCurrentlyAdded = true;
                _this.setOtherIncomes([otherIncomeNew]);
                return otherIncomeNew;
            };
            this.removeIncomeInfoViewModel = function (incomeInfoViewModelVm) {
                return incomeInfoViewModelVm.isRemoved = true;
            };
            this.deleteIncomeInfoViewModel = function (incomeInfoViewModelVm) {
                var incomeInfoExisting = _this.getTransactionInfoOtherIncome().remove(incomeInfoViewModelVm);
                return (!!incomeInfoExisting);
            };
            this.removeOrDeleteIncomeInfoViewModel = function (incomeInfoViewModelVm) {
                if (!incomeInfoViewModelVm || incomeInfoViewModelVm.isNetRental)
                    return false;
                else if (incomeInfoViewModelVm.isCurrentlyAdded)
                    return _this.deleteIncomeInfoViewModel(incomeInfoViewModelVm);
                else
                    return _this.removeIncomeInfoViewModel(incomeInfoViewModelVm);
            };
            this.addNewAddress = function () {
                var otherIncomeNew = new cls.IncomeInfoViewModel(_this.getTransactionalInfo());
                otherIncomeNew.isCurrentlyAdded = true;
                _this.setOtherIncomes([otherIncomeNew]);
                return otherIncomeNew;
            };
            //
            this.hasTransactionalInfoEmployment = function () {
                if (_this.hasTransactionalInfo() && !!_this.getTransactionalInfo().employmentInfo) {
                    return true;
                }
                else {
                    return false;
                }
            };
            this.getTransactionInfoEmployment = function () {
                if (_this.hasTransactionalInfoEmployment()) {
                    return _this.getTransactionalInfo().employmentInfo;
                }
                return new cls.Map();
            };
            this.getEmploymentInfoes = function () {
                if (_this.hasTransactionalInfoEmployment()) {
                    if (!_this._employmentInfoes || !_this._employmentInfoes.length) {
                        _this._employmentInfoes = lib.filter(_this.getTransactionInfoEmployment().getValues(), function (o) { return !o.isRemoved && o.borrowerId == _this.borrowerId; });
                    }
                    return _this._employmentInfoes;
                }
                return [];
            };
            this.setEmploymentInfoes = function (employmentInfoes) {
                if (!!employmentInfoes && _this.hasTransactionalInfoEmployment()) {
                    employmentInfoes.forEach(function (o) {
                        o.borrowerId = _this.borrowerId;
                        if (!o.employmentInfoId || o.employmentInfoId == lib.getEmptyGuid()) {
                            o.employmentInfoId = util.IdentityGenerator.nextGuid();
                        }
                    });
                    _this.getTransactionInfoEmployment().mapAll(employmentInfoes);
                    _this.invalidateEmployeeInfoes();
                }
            };
            this.removeEmploymentInfo = function (employmentInfoVm) {
                employmentInfoVm.isRemoved = true;
                _this.invalidateEmployeeInfoes();
                return true;
            };
            this.deleteEmploymentInfo = function (employmentInfoVm) {
                var employmentInfoExisting = _this.getTransactionInfoEmployment().remove(employmentInfoVm);
                _this.invalidateEmployeeInfoes();
                return (!!employmentInfoExisting);
            };
            this.removeOrDeleteEmploymentInfo = function (employmentInfoVm) {
                if (!employmentInfoVm)
                    return false;
                else if (employmentInfoVm.isAdded)
                    return _this.deleteEmploymentInfo(employmentInfoVm);
                else
                    return _this.removeEmploymentInfo(employmentInfoVm);
            };
            this.invalidateEmployeeInfoes = function () {
                _this._employmentInfoes = null;
                _this.getEmploymentInfoes();
            };
            //currentEmploymentInfo: IEmploymentInfoViewModel;
            this.getCurrentEmploymentInfo = function () {
                var cei = lib.findFirst(_this.getEmploymentInfoes(), function (o) { return !o.isAdditional; });
                return cei;
            };
            this.setCurrentEmploymentInfo = function (employmentInfo) {
                if (!employmentInfo || !_this.hasTransactionalInfoEmployment())
                    return;
                var employmentInfoOrig = _this.getCurrentEmploymentInfo();
                if (!!employmentInfoOrig) {
                    _this.deleteEmploymentInfo(employmentInfoOrig);
                }
                employmentInfo.isAdditional = false;
                employmentInfo.isPresent = true;
                _this.setEmploymentInfoes([employmentInfo]);
            };
            //additionalEmploymentInfo: ICollection<IEmploymentInfoViewModel>;
            this.getAdditionalEmploymentInfo = function () {
                return _this.getEmploymentInfoes().filter(function (o) { return o.isAdditional; });
            };
            this.setAdditionalEmploymentInfo = function (employmentInfoes) {
                if (!employmentInfoes || !_this.hasTransactionalInfoEmployment())
                    return;
                employmentInfoes.forEach(function (o) { return o.isAdditional = true; });
                _this.setEmploymentInfoes(employmentInfoes);
            };
            // @todo-cl: Generalize => Lib
            this.replaceAdditionalEmploymentInfo = function (employmentInfoes) {
                if (!employmentInfoes || !_this.hasTransactionalInfoEmployment())
                    return;
                // remove existing
                var existing = _this.getAdditionalEmploymentInfo();
                existing.forEach(function (o) { return _this.getTransactionInfoEmployment().remove(o); });
                // map new
                _this.setAdditionalEmploymentInfo(employmentInfoes);
            };
            this.addAdditionalEmploymentInfo = function (isPrevious) {
                var employmentInfo = new cls.AdditionalEmploymentInfoViewModel(_this.getTransactionalInfo(), null, isPrevious);
                employmentInfo.isAdded = true;
                _this.setEmploymentInfoes([employmentInfo]);
                return employmentInfo;
            };
            //
            this.hasTransactionalInfoProperty = function () {
                if (_this.hasTransactionalInfo() && !!_this.getTransactionalInfo().property) {
                    return true;
                }
                else {
                    return false;
                }
            };
            this.getTransactionInfoProperty = function () {
                if (_this.hasTransactionalInfoProperty()) {
                    return _this.getTransactionalInfo().property;
                }
                return new cls.Map();
            };
            this.getProperty = function (propertyId, bindAction) {
                if (_this.hasTransactionalInfoProperty()) {
                    var property = _this.getTransactionInfoProperty().lookup(propertyId);
                    if (!property) {
                        // create new one , will have new ID
                        property = new cls.PropertyViewModel(_this.getTransactionalInfo());
                        // belongs to me
                        property.borrowerId = _this.borrowerId;
                        // if creating on the fly , must not be subject property
                        property.isSubjectProperty = false;
                        property.isSameAsPropertyAddress = false;
                        if (!property.loanId || property.loanId == lib.getEmptyGuid()) {
                            property.loanId = _this.loanApplicationId;
                        }
                        bindAction(property);
                        _this.getTransactionInfoProperty().map(property);
                    }
                    return property;
                }
                return null;
            };
            this.getCurrentAddress = function () {
                return _this.getProperty(_this.currentAddressId, function (p) {
                    p.addressTypeId = 1 /* Present */;
                    _this.currentAddressId = p.propertyId;
                    p.isSameAsPrimaryBorrowerCurrentAddress = angular.isDefined(p.isSameAsPrimaryBorrowerCurrentAddress) && p.isSameAsPrimaryBorrowerCurrentAddress != null ? p.isSameAsPrimaryBorrowerCurrentAddress : true;
                });
            };
            this.setCurrentAddress = function (currentAddress) {
                if (!currentAddress) {
                    _this.getTransactionInfoAddress().map(currentAddress);
                }
            };
            this.saveCurrentAddress = function () {
                var caNew = new cls.PropertyViewModel(_this.getTransactionalInfo());
                _this.setCurrentAddress(caNew);
                return caNew;
            };
            this.getMailingAddress = function () {
                return _this.getProperty(_this.mailingAddressId, function (p) {
                    p.addressTypeId = 3 /* Mailing */;
                    _this.mailingAddressId = p.propertyId;
                });
            };
            this.getPreviousAddress = function () {
                return _this.getProperty(_this.previousAddressId, function (p) {
                    p.addressTypeId = 2 /* Former */;
                    _this.previousAddressId = p.propertyId;
                });
            };
            this.emailFieldDisabled = false;
            this.getFullName = function () {
                return _this.fullName;
            };
            this.getCombinedCurrentAndAdditionalEmployments = function () {
                var combinedIncomes = [];
                var employmentCurrent = _this.getCurrentEmploymentInfo();
                if (!!employmentCurrent) {
                    combinedIncomes.push(employmentCurrent);
                }
                combinedIncomes = combinedIncomes.concat(_this.getAdditionalEmploymentInfo());
                return combinedIncomes;
            };
            //private initializeIncome = (iborrower?: srv.IBorrowerViewModel) => {
            //    // @todo-cl: Should these be same value?
            //    //if (iborrower)
            //    //    this.getCurrentEmploymentInfo().EmploymentTypeId = iborrower.employmentStatusId;
            //    var borrower = <cls.BorrowerViewModel>iborrower;
            //    //if (!borrower || (borrower && (common.string.isEmptyGuid(borrower.borrowerId) || common.string.isNullOrWhiteSpace(borrower.borrowerId)))) {
            //    //    this.isEmployedTwoYears = true;
            //    //    this.getCurrentEmploymentInfo().EmploymentTypeId = this.employmentStatusId = 1;
            //    //}
            //}
            this.initialize = function (borrower) {
                //this.initializeIncome(borrower);
                if (borrower) {
                    var publicRecords = [];
                    if (borrower.publicRecords && borrower.publicRecords.length > 0) {
                        for (var i = 0, j = (borrower.publicRecords ? borrower.publicRecords.length : 0); i < j; i++) {
                            var publicRecord = new cls.PublicRecordViewModel(borrower.publicRecords[i], _this.getFullName);
                            publicRecords.push(publicRecord);
                        }
                        _this.publicRecords = publicRecords;
                    }
                    var miscellaneousDebts = [];
                    if (borrower.miscellaneousDebt && borrower.miscellaneousDebt.length > 0) {
                        for (var i = 0, j = (borrower.miscellaneousDebt ? borrower.miscellaneousDebt.length : 0); i < j; i++) {
                            var miscDebt = new cls.MiscellaneousDebtViewModel(borrower.miscellaneousDebt[i], null, null, _this.getFullName());
                            miscellaneousDebts.push(miscDebt);
                        }
                        _this.miscellaneousDebt = miscellaneousDebts;
                    }
                    //this.initializeAllLiabilities();
                    // filter out liabilitites, type liability with unpaid balance more than zero
                    // @todo: update when enum is created
                    //this.liabilities = this.liabilities.filter(function (liability) {
                    //    return (liability.typeId == 2) ? !liability.isRemoved && !liability.isPledged && parseFloat(String(liability.unpaidBalance)) > 0 : !liability.isRemoved;
                    //});
                    var assets = [];
                    if (borrower.assets && borrower.assets.length > 0) {
                        for (var i = 0; i < borrower.assets.length; i++) {
                            var asset = new cls.AssetViewModel(borrower.assets[i]);
                            assets.push(asset);
                        }
                        _this.assets = assets;
                    }
                    _this.getCurrentAddress().addressTypeId = 1; //Present
                    _this.getMailingAddress().addressTypeId = 3; //Mailing
                    _this.getPreviousAddress().addressTypeId = 2; //Previous
                }
                // Moved up inside for sure to get address Id's
                //this.getCurrentAddress().addressTypeId = 1; //Present
                //this.getMailingAddress().addressTypeId = 3; //Mailing
                //this.getPreviousAddress().addressTypeId = 2; //Previous
                if (!_this.userAccount)
                    _this.userAccount = new cls.UserAccountViewModel();
                else
                    _this.userAccount = new cls.UserAccountViewModel(_this.userAccount);
                if (!_this.assets)
                    _this.assets = [];
                if (!_this.publicRecords)
                    _this.publicRecords = [];
                if (!_this.miscellaneousDebt)
                    _this.miscellaneousDebt = [];
                if (!_this.reoPropertyList)
                    _this.reoPropertyList = [];
                if (!_this.ficoScore)
                    _this.ficoScore = new srv.cls.FicoScoreViewModel();
                if (!_this.preferredPhone) {
                    _this.preferredPhone = new cls.PhoneViewModel("preferred");
                }
                else if (!_this.preferredPhone.type) {
                    _this.preferredPhone.type = "1";
                    _this.preferredPhone.isPrefrred = true;
                }
                if (!_this.alternatePhone) {
                    _this.alternatePhone = new cls.PhoneViewModel("alternate");
                }
                else if (!_this.alternatePhone.type) {
                    _this.alternatePhone.type = "2";
                    _this.alternatePhone.isPrefrred = false;
                }
                if (!_this.declarationsInfo)
                    _this.declarationsInfo = new srv.cls.DeclarationInfoViewModel();
                if (_this.maritalStatus == null || _this.maritalStatus == undefined)
                    _this.maritalStatus = -1;
                if (_this.usCitizen == null || _this.usCitizen == undefined) {
                    if (_this.permanentAlien == null || _this.permanentAlien == undefined) {
                        _this.usCitizen = true;
                        _this.permanentAlien = false;
                    }
                    else {
                        if (_this.permanentAlien == true)
                            _this.usCitizen = false;
                        if (_this.permanentAlien == false)
                            _this.usCitizen = true;
                    }
                }
                else if (_this.usCitizen != null && _this.usCitizen != undefined && (_this.permanentAlien == null || _this.permanentAlien == undefined)) {
                    if (_this.usCitizen == true)
                        _this.permanentAlien = false;
                    if (_this.usCitizen == false)
                        _this.permanentAlien = true;
                }
                //if (this.uSCitizen == null || this.uSCitizen == undefined) {
                //    if (this.permanentAlien == null || this.permanentAlien == undefined) {
                //        this.uSCitizen = true;
                //        this.permanentAlien = false;
                //    }
                //    else {
                //        if (this.permanentAlien == true)
                //            this.uSCitizen = false;
                //        if (this.permanentAlien == false)
                //            this.uSCitizen = true;
                //    }
                //}
                //else if (this.uSCitizen != null && this.uSCitizen != undefined && (this.permanentAlien == null || this.permanentAlien == undefined)) {
                //    if (this.uSCitizen == true)
                //        this.permanentAlien = false;
                //    if (this.uSCitizen == false)
                //        this.permanentAlien = true;
                //}
            };
            /**
            * @desc Filters Down payment asset and if not exists adds one using provided downPayment amount.
            */
            this.filterDownPaymentAsset = function (downPayment) {
                var downPaymentAssets = _this.getAssetsWithDownPayment();
                //If there are no Down payment assets, add new down payment asset.
                if (downPaymentAssets.length === 0) {
                    var downPaymentAsset = new cls.DownPaymentAssetViewModel();
                    downPaymentAsset.monthlyAmount = downPayment;
                    _this.addAssets(downPaymentAsset);
                    downPaymentAssets = _this.getAssetsWithDownPayment();
                }
                return downPaymentAssets;
            };
            this.getAssetsWithDownPayment = function () {
                return lib.filter(_this.getAssets(), function (a) { return a.isDownPayment; });
            };
            /**
            * @desc Maps self employed income amount to base employment income amount, if self employed income exists.
            */
            this.handleSelfEmployedIncome = function (incomes) {
                var selfEmployedIncomes = _this.filterIncomeByType(incomes, 16); // SelfEmployedIncome = 16
                if (selfEmployedIncomes && selfEmployedIncomes.length > 0) {
                    var selfEmployedIncome = selfEmployedIncomes[0];
                    var index = common.indexOfItem(selfEmployedIncome, incomes);
                    var baseEmploymentIncomes = _this.filterIncomeByType(incomes, 0); // BaseEmploymentIncome = 0
                    if (baseEmploymentIncomes && baseEmploymentIncomes.length > 0) {
                        var baseEmploymentIncome = baseEmploymentIncomes[0];
                        baseEmploymentIncome.amount = selfEmployedIncome.amount;
                        baseEmploymentIncome.calculatedMonthlyAmount = selfEmployedIncome.calculatedMonthlyAmount;
                        baseEmploymentIncome.canProvideDocumentation = true;
                        baseEmploymentIncome.preferredPaymentPeriodId = selfEmployedIncome.preferredPaymentPeriodId;
                        common.deleteItem(index, incomes);
                    }
                    return incomes;
                }
            };
            /**
            * @desc Calculates the total for the provided income info.
            */
            this.calculateIncomeTotal = function (incomeInformationVm, performCalculation) {
                var total = 0;
                if (incomeInformationVm)
                    for (var i = 0; i < incomeInformationVm.length; i++) {
                        var income = incomeInformationVm[i];
                        if (!income.isRemoved && performCalculation) {
                            var amount = income.amount;
                            if (income.preferredPaymentPeriodId == 2)
                                amount /= 12;
                            total += parseFloat(String(amount));
                        }
                    }
                return total;
            };
            /**
            * @desc Calculates the total for the current income info.
            */
            this.calculateCurrentIncomeTotal = function () {
                var total = 0;
                if (_this.getCurrentEmploymentInfo())
                    total += _this.calculateIncomeTotal(_this.getCurrentEmploymentInfo().getIncomeInformation(), _this.getCurrentEmploymentInfo().EmploymentStatusId != 2);
                return total;
            };
            /**
            * @desc Calculates the total for additional income info.
            */
            this.calculateAdditionalIncomeTotal = function () {
                var total = 0;
                if (_this.getAdditionalEmploymentInfo()) {
                    for (var i = 0; i < _this.getAdditionalEmploymentInfo().length; i++) {
                        var employmentInfo = _this.getAdditionalEmploymentInfo()[i];
                        if (!employmentInfo.isRemoved)
                            total += _this.calculateIncomeTotal(employmentInfo.getIncomeInformation(), employmentInfo.EmploymentStatusId != 2);
                    }
                }
                return total;
            };
            /**
            * @desc Add assets row.
            */
            this.addAssets = function (asset) {
                asset.borrowerFullName = _this.fullName;
                // @todo: review
                if (asset.accountNumber == null || asset.accountNumber.trim().length === 0) {
                    asset.accountNumber = "";
                }
                _this.assets.push(asset);
            };
            /**
            * @desc Delete assets row.
            */
            this.deleteAssets = function (obj) {
                var itemPosition = common.indexOfItem(obj, _this.assets);
                common.deleteItem(itemPosition, _this.assets);
            };
            ///**
            //* @desc Adds liability into collection
            //*/
            //addLiability = (liability: srv.ILiabilityViewModel): void => {
            //    liability.borrowerFullName = this.fullName;
            //    this.Liabilities.push(liability);
            //}
            this.addMiscDebts = function (miscDebt) {
                _this.miscellaneousDebt.push(miscDebt);
            };
            this.removeMiscDebts = function (miscDept) {
                var itemPostion = _this.miscellaneousDebt.indexOf(miscDept);
                if (itemPostion >= 0)
                    _this.miscellaneousDebt[itemPostion].isRemoved = true;
            };
            /**
            * @desc Gets assets collection.
            */
            this.getAssets = function () {
                _this.populateBorrowerId(_this.assets);
                return _this.assets;
            };
            this.getTotalEmploymentYears = function (employmentStart) {
                var totalYears = 0;
                if (_this.areEmploymentDatesValid(employmentStart))
                    totalYears = moment.duration({ from: employmentStart.employmentStartDate, to: _this.getCurrentEmploymentInfo().employmentEndDate }).asYears();
                return totalYears;
            };
            this.areEmploymentDatesValid = function (employmentInfo) {
                if (!employmentInfo || employmentInfo.employmentStartDate == null || employmentInfo.employmentEndDate == null)
                    return false;
                var empInfoStartDate = moment(employmentInfo.employmentStartDate);
                var empInfoEndDate = moment(employmentInfo.employmentEndDate);
                var currentEmpInfoEndDate = moment(_this.getCurrentEmploymentInfo().employmentEndDate);
                if (!empInfoStartDate.isValid() || !empInfoEndDate.isValid() || !currentEmpInfoEndDate.isValid())
                    return false;
                var currentTime = moment();
                var isStartDateAfterCurrent = empInfoStartDate.isAfter(currentTime);
                var isStartDateAfterEndDate = empInfoStartDate.isAfter(empInfoEndDate);
                var isEndDateAfterCurrent = empInfoEndDate.isAfter(currentTime);
                if (isStartDateAfterCurrent || isEndDateAfterCurrent || isStartDateAfterEndDate)
                    return false;
                return true;
            };
            ///**
            //* @desc Extends Collection class with liabilities from borrower
            //*/
            //getLiabilites = (): srv.ICollection<srv.ILiabilityViewModel> => {
            //    return this.Liabilities;
            //}
            //miscellaneousDebt.TypeId = 1;
            //liabilityInfo.TypeId = 2;
            //collection.TypeId = 3;
            /**
            * @desc Gets misc debts from liabilities
            */
            this.getMiscDebts = function () {
                return _this.miscellaneousDebt;
            };
            /**
            * @desc Gets collections from liabilities
            */
            this.getCollections = function () {
                return _this.filterByLiabilityType(3); //TODO: Change it with enum(s)
            };
            /**
            * @desc Gets liabilities
            */
            this.getLiability = function () {
                return _this.filterByLiabilityType(2); //TODO: Change it with enum(s)
            };
            //refreshLiabilities = (liabilities: srv.ILiabilityViewModel[]): srv.ILiabilityViewModel[]=> {
            //    var liabilitiesWithProperty = [];
            //    if (liabilities)
            //        for (var i = 0, j = (liabilities ? liabilities.length : 0); i < j; i++) {
            //            var liability = this.initializeLiability(liabilities[i], this.fullName);
            //            if (liability.isPledged) {
            //                if (liability.property && liability.property.isSubjectProperty) {
            //                    angular.forEach(this.reoPropertyList, function (property) {
            //                        if (property.isSubjectProperty) {
            //                            if (!(property instanceof cls.PropertyViewModel))
            //                                property = new cls.PropertyViewModel(property);
            //                            cls.AdjustedNetRentalIncomeInfoViewModel.initializeProperty(property);
            //                            liability.property = property;
            //                        }
            //                    })
            //                }
            //            }
            //            liabilitiesWithProperty.push(liability);
            //        }
            //    return liabilitiesWithProperty;
            //}
            /**
            * @desc Gets pledged assets from liabilitis
            */
            this.getPledgedAssets = function () {
                return _this.getLiabilities().filter(function (liability) {
                    return liability.isPledged;
                });
            };
            /**
            * @desc Gets military incomes.
            */
            this.getMilitaryIncome = function () {
                return _this.filterIncomeByType(_this.getOtherIncomes(), 1);
            };
            /**
            * @desc Gets public records
            */
            this.getPublicRecords = function () {
                return _this.publicRecords;
            };
            /**
            * @desc Gets regular incomes.
            */
            this.getRegularIncome = function () {
                return _this.filterIncomeByType(_this.getOtherIncomes(), 2);
            };
            /**
            * @desc Gets other incomes.
            */
            this.getOtherIncome = function () {
                return _this.getOtherIncomes().filter(function (income) {
                    return (income.canProvideDocumentation == null || income.canProvideDocumentation == true) && (common.string.isNullOrWhiteSpace(income.employmentInfoId) || common.string.isEmptyGuid(income.employmentInfoId));
                });
            };
            //getPropertyInfoForNetRentalIncome = (): srv.IPropertyViewModel[]=> {
            //    var properties: Array<srv.IPropertyViewModel> = [];
            //    if (this.Liabilities)
            //        for (var i = 0; i < this.Liabilities.length; i++) {
            //            var liability = this.Liabilities[i];
            //            if (liability.property) {
            //                if (properties.filter(p => p.propertyId == liability.property.propertyId).length == 0)
            //                    properties.push(liability.property);
            //            }
            //        }
            //    return this.filterPropertiesByType(properties, srv.PropertyUsageTypeEnum.InvestmentProperty);
            //}
            /**
            * @desc Gets automobiles from assets.
            */
            this.getAutomobiles = function () {
                return _this.filterByAssetsType([15], false);
            };
            /**
            * @desc Gets financials from assets.
            */
            this.getFinancials = function () {
                return _this.filterByAssetsType([13, 15], true);
            };
            /**
            * @desc Gets life insurance from assets.
            */
            this.getLifeInsurance = function () {
                return _this.filterByAssetsType([13], false);
            };
            /**
            * @desc Adds borrower id to any provided collection
            */
            this.populateBorrowerId = function (collection) {
                for (var i in collection) {
                    collection[i].borrowerId = _this.borrowerId;
                    collection[i].isCoBorrower = _this.isCoBorrower;
                }
                return collection;
            };
            this.buildNetRentalIncome = function (property, isSubjectProperty) {
                if (isSubjectProperty === void 0) { isSubjectProperty = false; }
                var netRentalIncome;
                netRentalIncome.isSubjectProperty = isSubjectProperty;
                return netRentalIncome;
            };
            this.filterByLiabilityType = function (liabilityType) {
                return _this.getLiabilities().filter(function (liability) {
                    liability.companyData.companyName = (liability.typeId == 3 || liability.typeId == 2) && (liability.companyData.companyName == "" || !liability.companyData.companyName) && !liability.isNewRow ? "Not specified" : liability.companyData.companyName;
                    return liability.typeId == liabilityType && !liability.isRemoved && !liability.isPledged;
                });
            };
            this.filterIncomeByType = function (incomeCollection, incomeType) {
                if (incomeCollection && incomeCollection.length > 0)
                    return incomeCollection.filter(function (income) {
                        // TODO: Implement business logic to find all enum values that are in the same enum category. 
                        // ref: MML.Contracts.IncomeTypeCategory,  MML.Web.LoanCenter.Services.Helpers.DataHelper.GetDefaultIncomeInfoList
                        return income.incomeTypeId == incomeType;
                    });
                return [];
            };
            this.filterPropertiesByType = function (propertyCollection, propertyType) {
                if (propertyCollection && propertyCollection.length > 0)
                    return propertyCollection.filter(function (property) {
                        return property.occupancyType == propertyType;
                    });
                return [];
            };
            this.filterByAssetsType = function (assetsType, financials) {
                if (_this.assets.length === 0)
                    return _this.assets;
                return _this.assets.filter(function (asset) {
                    if (!asset.borrowerFullName)
                        asset.borrowerFullName = asset.jointAccount ? 'JointAccount' : _this.fullName;
                    // asset.assetType !== undefined to make sure that assetTyoe 0 will be added
                    if (financials) {
                        return (asset.assetType !== undefined && assetsType[0] !== asset.assetType && assetsType[1] !== asset.assetType && asset.assetType !== -1 && !asset.isDownPayment && !asset.isRemoved);
                    }
                    return (asset.assetType !== undefined && assetsType[0] === asset.assetType && !asset.isDownPayment && !asset.isRemoved);
                });
            };
            /**
            * @desc Prepares the borrower for the save.
            */
            this.prepareSave = function () {
                _this.getCurrentAddress();
                _this.getMailingAddress();
                _this.getPreviousAddress();
            };
            this.prepareForSubmit = function () {
                _this.getCurrentEmploymentInfo().prepareForSubmit();
            };
            this.getLiabilitesPayment = function () {
                var total = 0;
                angular.forEach(_this.getLiability(), function (liability) {
                    if (liability.includeInDTI && !liability.isRemoved && liability.minPayment) {
                        var amount = parseFloat(String(liability.minPayment));
                        if (!amount || isNaN(amount))
                            amount = 0;
                        total += amount;
                    }
                });
                angular.forEach(_this.getPledgedAssets(), function (pledgedAsset) {
                    if ((pledgedAsset.getProperty() && pledgedAsset.getProperty().occupancyType == 3 /* SecondVacationHome */) && !pledgedAsset.isRemoved && pledgedAsset.totalPaymentDisplayValue) {
                        var amount = parseFloat(String(pledgedAsset.totalPaymentDisplayValue));
                        if (!amount || isNaN(amount))
                            amount = 0;
                        total += amount;
                    }
                });
                return total;
            };
            if (!!borrower) {
                lib.copyState(borrower, this);
                this.addressReferenced = false;
                this.confirmSsn = this.ssn || null;
                this.ssn = this.ssn || null;
            }
            if (!this.borrowerId || this.borrowerId == lib.getEmptyGuid())
                this.borrowerId = util.IdentityGenerator.nextGuid();
            if (!!ti) {
                this.setTransactionalInfo(ti);
                ti.borrower.map(this);
            }
            this.initialize(borrower);
        }
        Object.defineProperty(BorrowerViewModel.prototype, "AdditionalEmploymentInfoCollection", {
            /**
            * @desc Additional employment collection.
            */
            get: function () {
                return this.getAdditionalEmploymentInfo();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BorrowerViewModel.prototype, "currentAddrBind", {
            get: function () {
                return this.getCurrentAddress();
            },
            set: function (addr) {
                /*Do Nothing*/
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BorrowerViewModel.prototype, "mailingAddrBind", {
            get: function () {
                return this.getMailingAddress();
            },
            set: function (addr) {
                /*Do Nothing*/
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BorrowerViewModel.prototype, "previousAddrBind", {
            get: function () {
                return this.getPreviousAddress();
            },
            set: function (addr) {
                /*Do Nothing*/
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BorrowerViewModel.prototype, "DependentsError", {
            get: function () {
                if ((!this.numberOfDependents && !this.agesOfDependents) || (this.numberOfDependents == 0 && !this.agesOfDependents)) {
                    this.dependentsError = false;
                }
                else if ((this.numberOfDependents != 0 && !this.agesOfDependents) || (this.agesOfDependents != '' && !this.numberOfDependents)) {
                    this.dependentsError = true;
                }
                else if (this.numberOfDependents && this.numberOfDependents != 0 && this.agesOfDependents && this.agesOfDependents != '') {
                    var ages = this.agesOfDependents.split(",").length;
                    this.dependentsError = this.numberOfDependents != ages ? true : false;
                }
                return this.dependentsError;
            },
            set: function (newDependentsError) {
                this.dependentsError = newDependentsError;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BorrowerViewModel.prototype, "wrongSsn", {
            // todo - why does this get called some many times on the personal page?
            get: function () {
                return this.ssn != this.confirmSsn && !(!this.ssn && !this.confirmSsn);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BorrowerViewModel.prototype, "fullName", {
            get: function () {
                var fullName = (this.firstName ? this.firstName.trim() : '') + (this.middleName ? (' ' + this.middleName.trim()) : '') + " " + (this.lastName ? this.lastName.trim() : '');
                return fullName.trim() ? fullName : this.defaultName;
            },
            enumerable: true,
            configurable: true
        });
        BorrowerViewModel.prototype.hasValidName = function () {
            return this.fullName != this.defaultName;
        };
        Object.defineProperty(BorrowerViewModel.prototype, "incomeTypes", {
            get: function () {
                // @todo: Rename to 'other'
                return cls.LoanViewModel.getLookups().incomeTypesOther.filter(function (i) { return i.value != "16"; });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BorrowerViewModel.prototype, "baseIncomeTotal", {
            get: function () {
                var total = 0;
                if (this.getCurrentEmploymentInfo() && angular.isDefined(this.getCurrentEmploymentInfo().EmploymentTypeId)) {
                    // Calculate current income if type is not Retired or Other/Unemployed.
                    if (!(this.getCurrentEmploymentInfo().EmploymentTypeId == 3 || this.getCurrentEmploymentInfo().EmploymentTypeId == 4))
                        total += this.calculateCurrentIncomeTotal();
                    // Add additional income.
                    total += this.calculateAdditionalIncomeTotal();
                }
                return total;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BorrowerViewModel.prototype, "isTotalEmploymentTwoYears", {
            get: function () {
                var years = 0;
                if (!this.getCurrentEmploymentInfo())
                    return (this.isEmployedTwoYears = false);
                else if (this.getCurrentEmploymentInfo().employmentStartDate == null)
                    return;
                // Check if current employment is more than or equal to two years.
                years = this.getTotalEmploymentYears(this.getCurrentEmploymentInfo());
                this.getCurrentEmploymentInfo().yearsOnThisJob = parseInt(String(years));
                if (years >= 2)
                    return (this.isEmployedTwoYears = true);
                // Check if any additional employment's start date sums up to two years up to the current employment's end date.
                if (this.getAdditionalEmploymentInfo() && this.getAdditionalEmploymentInfo().length > 0)
                    for (var i = 0; i < this.getAdditionalEmploymentInfo().length; i++) {
                        var additionalEmploymentInfo = this.getAdditionalEmploymentInfo()[i];
                        if (!additionalEmploymentInfo.isRemoved) {
                            years = this.getTotalEmploymentYears(additionalEmploymentInfo);
                            additionalEmploymentInfo.yearsOnThisJob = parseInt(String(years));
                            if (years >= 2)
                                return (this.isEmployedTwoYears = true);
                        }
                    }
                // Not employed for more than or equal to two years.
                return (this.isEmployedTwoYears = false);
            },
            enumerable: true,
            configurable: true
        });
        return BorrowerViewModel;
    })(srv.cls.BorrowerViewModel);
    cls.BorrowerViewModel = BorrowerViewModel;
})(cls || (cls = {}));
//# sourceMappingURL=borrower.extendedViewModel.js.map