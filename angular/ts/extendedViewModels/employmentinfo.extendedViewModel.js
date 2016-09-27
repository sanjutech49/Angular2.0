/// <reference path="../generated/viewModels.ts" />
/// <reference path="../generated/viewModelClasses.ts" />
/// <reference path="genericTypes.ts" />
/// <reference path="../../ts/extendedViewModels/incomeInfo.extendedViewModel.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var cls;
(function (cls) {
    var EmploymentInfoViewModelFactory = (function () {
        function EmploymentInfoViewModelFactory() {
        }
        EmploymentInfoViewModelFactory.create = function (dst, p) {
            if (!p.isAdditional)
                return new CurrentEmploymentInfoViewModel(dst, p);
            return new AdditionalEmploymentInfoViewModel(dst, p);
        };
        return EmploymentInfoViewModelFactory;
    })();
    cls.EmploymentInfoViewModelFactory = EmploymentInfoViewModelFactory;
    var EmploymentInfoViewModel = (function (_super) {
        __extends(EmploymentInfoViewModel, _super);
        function EmploymentInfoViewModel(ti, employmentInfo) {
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
            this.hasTransactionalInfoIncomes = function () {
                if (_this.hasTransactionInfo() && !!_this.getTransactionInfo().incomeInfo) {
                    return true;
                }
                else {
                    return false;
                }
            };
            this.getTransactionInfoIncomes = function () {
                if (_this.hasTransactionalInfoIncomes()) {
                    return _this.getTransactionInfo().incomeInfo;
                }
                return new cls.Map();
            };
            this.getIncomeInformation = function () {
                if (_this.hasTransactionalInfoIncomes()) {
                    //
                    //return lib.filter(this.getTransactionInfoIncomes().getValues(), o => o.employmentInfoId == this.employmentInfoId);
                    //
                    if (!_this._incomeMatrix) {
                        var incomeMatrix = lib.filter(_this.getTransactionInfoIncomes().getValues(), function (o) { return o.employmentInfoId == _this.employmentInfoId; });
                        incomeMatrix = _this.buildIncomeInformation(incomeMatrix);
                        for (var i = 0; i < incomeMatrix.length; i++) {
                            incomeMatrix[i] = new cls.IncomeInfoViewModel(_this.getTransactionInfo(), incomeMatrix[i]);
                        }
                        _this.setIncomeInformation(incomeMatrix);
                        _this._incomeMatrix = incomeMatrix;
                    }
                    return _this._incomeMatrix;
                }
                return [];
            };
            this.setIncomeInformation = function (incomes) {
                if (!!incomes && _this.hasTransactionalInfoIncomes()) {
                    incomes.forEach(function (o) { return o.employmentInfoId = _this.employmentInfoId; });
                    _this.getTransactionInfoIncomes().mapAll(incomes);
                    _this._incomeMatrix = null;
                }
            };
            this.incomeInfoByTypeId = function (typeId) {
                var incomeInfos = _this.incomeInformationCollection.filter(function (i) { return i.incomeTypeId == typeId; });
                return incomeInfos.length > 0 ? incomeInfos[0] : null;
            };
            //completion rules
            this.isCompleted = function () {
                switch (String(_this.employmentTypeId)) {
                    case String(3 /* Retired */):
                        return _this.validateRetired();
                    case String(0 /* ActiveMilitaryDuty */):
                        return _this.validateActiveMilitaryDuty();
                    case String(1 /* SalariedEmployee */):
                        return _this.validateSelfOrSalariedEmployee();
                    case String(2 /* SelfEmployed */):
                        return _this.validateSelfOrSalariedEmployee();
                    case String(4 /* OtherUnemployed */):
                        return true;
                }
            };
            this.validateRetired = function () {
                return !common.objects.isNullOrUndefined(_this.employmentStartDate);
            };
            this.validateActiveMilitaryDuty = function () {
                //11- military base pay
                //13 - part time
                var basePay = _this.incomeInfoByTypeId(11);
                return _this.validateJointRules() && basePay && basePay.amount && _this.branchOfService != "-1";
            };
            this.validateSelfOrSalariedEmployee = function () {
                //0 - base pay for salaried employed
                //16 - base pay for self employed
                //13 - part time
                var basePay = _this.EmploymentTypeId == 2 /* SelfEmployed */ ? _this.incomeInfoByTypeId(16) : _this.incomeInfoByTypeId(0);
                var partTime = _this.incomeInfoByTypeId(13);
                var retVal = _this.validateJointRules() && (basePay && basePay.amount || partTime && partTime.amount) && !common.string.isNullOrWhiteSpace(_this.name) && !common.string.isNullOrWhiteSpace(_this.typeOfBusiness);
                //employment status previous
                return _this.EmploymentStatusId == 2 ? retVal && !common.objects.isNullOrUndefined(_this.employmentEndDate) : retVal;
            };
            this.validateJointRules = function () {
                return !common.string.isNullOrWhiteSpace(_this.positionDescription) && !common.objects.isNullOrUndefined(_this.employmentStartDate) && !common.string.isNullOrWhiteSpace(_this.businessPhone) && !common.string.isNullOrWhiteSpace(_this.address.cityName) && !common.string.isNullOrWhiteSpace(_this.address.stateName) && !common.string.isNullOrWhiteSpace(_this.address.streetName) && !common.string.isNullOrWhiteSpace(_this.address.zipCode) && !!_this.yearsInThisProfession;
            };
            this.buildIncomeInformation = function (incomeInformationVm) {
                var dict = [];
                for (var i = 0; i < incomeInformationVm.length; i++) {
                    dict[incomeInformationVm[i].incomeTypeId.toString()] = incomeInformationVm[i];
                }
                var list = [];
                var incomeTypes = EmploymentInfoViewModel.getIncomeTypes();
                for (var i = 0; i < incomeTypes.length; i++) {
                    var k = incomeTypes[i].value;
                    var incomeInfo = dict[k] ? dict[k] : cls.IncomeInfoViewModel.newIncomeInfo(_this.getTransactionInfo(), parseInt(k));
                    incomeInfo.incomeType = incomeTypes[i].text;
                    var baseIncomes = incomeTypes.filter(function (i) { return i.value == "0"; });
                    if (baseIncomes && baseIncomes.length > 0) {
                        var baseIncome = baseIncomes[0];
                        if (incomeInfo.incomeTypeId == 16)
                            incomeInfo.incomeType = baseIncome.text;
                    }
                    list.push(incomeInfo);
                }
                return list;
            };
            this.convertIncomeZeroToRemovedForSubmit = function () {
                if (!_this.getIncomeInformation())
                    return;
                _this.getIncomeInformation().filter(function (i) { return i.amount === 0; }).map(function (i) {
                    i.isRemoved = true;
                });
            };
            this.filterIncomeInfoForSubmit = function () {
                if (_this.EmploymentTypeId == 3 /* Retired */) {
                    _this.resetIncomeAmounts(_this.getIncomeInformation());
                }
                else {
                    var diff = lib.diff(_this.getIncomeInformation(), _this.incomeInformationCollection, function (i, j) { return i.incomeTypeId == j.incomeTypeId; });
                    _this.resetIncomeAmounts(diff);
                }
                // @todo-cl: Elevate to Transaction Info
                //this.incomeInformation = this.incomeInformationCollection.filter(i => {
                //    return i.amount > 0 && !common.string.isNullOrWhiteSpace(i.incomeInfoId) && !common.string.isEmptyGuid(i.incomeInfoId);
                //});
            };
            this.resetIncomeAmounts = function (incomeCollection) {
                if (!!incomeCollection) {
                    lib.forEach(incomeCollection, function (i) { return i.Amount = 0; });
                }
            };
            this.cleanUpRetirementData = function () {
                if (_this.EmploymentTypeId == 3 /* Retired */) {
                    _this.businessPhone = null;
                    _this.positionDescription = null;
                    _this.name = null;
                    _this.typeOfBusiness = null;
                    _this.yearsInThisProfession = null;
                    _this.initializeAddress();
                }
            };
            this.prepareForSubmit = function () {
                _this.convertIncomeZeroToRemovedForSubmit();
                _this.filterIncomeInfoForSubmit();
                _this.cleanUpRetirementData();
            };
            this.initialize = function (employmentInfo) {
                _this.initializeAddress(employmentInfo);
            };
            this.initializeAddress = function (employmentInfo) {
                var address;
                if (!!employmentInfo)
                    address = employmentInfo.address;
                else
                    address = null;
                _this.address = new cls.PropertyViewModel(_this.getTransactionInfo(), address);
            };
            if (!!employmentInfo) {
                lib.copyState(employmentInfo, this);
            }
            if (!this.employmentInfoId || this.employmentInfoId == lib.getEmptyGuid()) {
                this.employmentInfoId = util.IdentityGenerator.nextGuid();
            }
            if (!!ti) {
                this.setTransactionInfo(ti);
                ti.employmentInfo.map(this);
            }
            this.initialize(employmentInfo);
        }
        Object.defineProperty(EmploymentInfoViewModel.prototype, "EmploymentStatusId", {
            get: function () {
                return this.employmentStatusId;
            },
            set: function (value) {
                this.employmentStatusId = value;
                this.isPresent = (this.employmentStatusId == 1);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EmploymentInfoViewModel.prototype, "totalMonthlyAmount", {
            get: function () {
                var total = 0;
                if (this.getIncomeInformation())
                    for (var i = 0; i < this.getIncomeInformation().length; i++) {
                        var income = this.getIncomeInformation()[i];
                        if (!income.isRemoved)
                            total += parseFloat(String(income.calculatedMonthlyAmount));
                    }
                return total;
            },
            enumerable: true,
            configurable: true
        });
        EmploymentInfoViewModel.getIncomeTypes = function () {
            var lookups = cls.LoanViewModel.getLookups();
            var incomeTypes = lookups.incomeTypesRegular.concat(lookups.incomeTypesMilitary);
            var selfEmployedIncome = cls.LoanViewModel.getLookups().incomeTypesOther.filter(function (i) { return i.value == "16"; });
            if (selfEmployedIncome && selfEmployedIncome.length > 0)
                incomeTypes = incomeTypes.concat(selfEmployedIncome);
            return incomeTypes;
        };
        Object.defineProperty(EmploymentInfoViewModel.prototype, "EmploymentTypeId", {
            get: function () {
                return this.employmentTypeId;
            },
            set: function (value) {
                this.employmentTypeId = value;
                this.isMilitary = this.employmentTypeId == 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EmploymentInfoViewModel.prototype, "incomeInformationCollection", {
            //
            // @todo-cc: Review for copy , 2-way databind , etc.
            //
            get: function () {
                if (!this.getIncomeInformation())
                    return [];
                var incomeTypes;
                if (this.isMilitary) {
                    incomeTypes = cls.LoanViewModel.getLookups().incomeTypesMilitary;
                }
                else {
                    incomeTypes = cls.LoanViewModel.getLookups().incomeTypesRegular;
                }
                if (this.EmploymentTypeId == 2) {
                    var selfEmployedIncome = cls.LoanViewModel.getLookups().incomeTypesOther.filter(function (i) { return i.value == "16"; });
                    if (selfEmployedIncome && selfEmployedIncome.length > 0)
                        incomeTypes = incomeTypes.concat(selfEmployedIncome);
                }
                var dict = [];
                if (incomeTypes && incomeTypes.length > 0) {
                    var filteredIncomes = incomeTypes.filter(function (i) { return i.value == "16"; });
                    var filteredBaseIncome = incomeTypes.filter(function (i) { return i.value == "0"; });
                    if (filteredIncomes && filteredIncomes.length > 0)
                        var selfEmployed = filteredIncomes[0];
                    if (filteredBaseIncome && filteredBaseIncome.length > 0)
                        var baseIncome = filteredBaseIncome[0];
                }
                for (var i = 0; i < incomeTypes.length; i++) {
                    var income = incomeTypes[i];
                    if (income.value == "0" && this.EmploymentTypeId == 2) {
                        income = selfEmployed;
                    }
                    dict[incomeTypes[i].value] = income;
                }
                for (var i = 0; i < this.getIncomeInformation().length; i++)
                    this.getIncomeInformation()[i].isRemoved = true;
                var list = this.getIncomeInformation().filter(function (i) {
                    if (dict[i.incomeTypeId.toString()] && i.incomeTypeId == dict[i.incomeTypeId.toString()].value) {
                        i.isRemoved = false;
                        return true;
                    }
                    else {
                        return false;
                    }
                });
                list.sort(function (a, b) {
                    if ((a.incomeTypeId == 16) != (b.incomeTypeId == 16))
                        return a.incomeTypeId == 16 ? -1 : 1;
                });
                return list;
            },
            enumerable: true,
            configurable: true
        });
        return EmploymentInfoViewModel;
    })(srv.cls.EmploymentInfoViewModel);
    cls.EmploymentInfoViewModel = EmploymentInfoViewModel;
    var CurrentEmploymentInfoViewModel = (function (_super) {
        __extends(CurrentEmploymentInfoViewModel, _super);
        function CurrentEmploymentInfoViewModel(ti, employmentInfo) {
            _super.call(this, ti, employmentInfo);
            this.EmploymentStatusId = 1;
            if (!employmentInfo)
                this.EmploymentTypeId = 1;
            this.isAdditional = false;
        }
        Object.defineProperty(CurrentEmploymentInfoViewModel.prototype, "isRetiredOrUnemployed", {
            get: function () {
                return this.EmploymentTypeId == 3 || this.EmploymentTypeId == 4;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CurrentEmploymentInfoViewModel.prototype, "isSalariedEmployeeOrSelfEmployed", {
            get: function () {
                //1 - salariedEmployment, 2 - selfEmployed
                return this.EmploymentTypeId == 1 || this.EmploymentTypeId == 2;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CurrentEmploymentInfoViewModel.prototype, "isRetired", {
            get: function () {
                return this.EmploymentTypeId == 3 /* Retired */;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CurrentEmploymentInfoViewModel.prototype, "isOtherOrUnemployed", {
            get: function () {
                return this.EmploymentTypeId == 4 /* OtherUnemployed */;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CurrentEmploymentInfoViewModel.prototype, "isActiveMilitaryDuty", {
            get: function () {
                return this.EmploymentTypeId == 0 /* ActiveMilitaryDuty */;
            },
            enumerable: true,
            configurable: true
        });
        return CurrentEmploymentInfoViewModel;
    })(EmploymentInfoViewModel);
    cls.CurrentEmploymentInfoViewModel = CurrentEmploymentInfoViewModel;
    var AdditionalEmploymentInfoViewModel = (function (_super) {
        __extends(AdditionalEmploymentInfoViewModel, _super);
        function AdditionalEmploymentInfoViewModel(ti, additionalEmploymentInfo, isPrevious) {
            _super.call(this, ti, additionalEmploymentInfo);
            if (!additionalEmploymentInfo) {
                this.EmploymentTypeId = 1;
                this.isAdditional = true;
            }
            if (isPrevious)
                this.EmploymentStatusId = 2;
        }
        Object.defineProperty(AdditionalEmploymentInfoViewModel.prototype, "EmploymentStatusId", {
            // Override the base getter and setter.
            // this.isAdditional = true; is required for LC 2.0 and LC 3.0 to play together nicely.
            get: function () {
                return this.employmentStatusId;
            },
            set: function (value) {
                this.employmentStatusId = value;
                this.isPresent = (this.employmentStatusId == 1);
                this.isAdditional = true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AdditionalEmploymentInfoViewModel.prototype, "isSalariedEmployeeOrSelfEmployed", {
            get: function () {
                //1 - salariedEmployment, 2 - selfEmployed
                return this.EmploymentTypeId == 1 || this.EmploymentTypeId == 2;
            },
            enumerable: true,
            configurable: true
        });
        return AdditionalEmploymentInfoViewModel;
    })(EmploymentInfoViewModel);
    cls.AdditionalEmploymentInfoViewModel = AdditionalEmploymentInfoViewModel;
})(cls || (cls = {}));
//# sourceMappingURL=employmentinfo.extendedViewModel.js.map