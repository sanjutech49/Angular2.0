var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var cls;
(function (cls) {
    var PropertyViewModelBase = (function (_super) {
        __extends(PropertyViewModelBase, _super);
        function PropertyViewModelBase() {
            var _this = this;
            _super.call(this);
            this.initializePropertyExpenses = function () {
                if (!_this.propertyExpenses || _this.propertyExpenses.length == 0) {
                    _this.propertyExpenses = [];
                    lib.forEach(PropertyViewModel.propertyExpenseDefaults, function (pe) {
                        _this.propertyExpenses.push(new cls.PropertyExpenseViewModel(pe.type, pe.preferredPayPeriod, pe.monthlyAmount, pe.impounded));
                    });
                }
                else if (_this.propertyExpenses.length < 5) {
                    lib.forEach(PropertyViewModel.propertyExpenseDefaults, function (pe) {
                        var index = lib.findIndex(_this.propertyExpenses, function (existingPE) { return pe.type == existingPE.type; }, -1);
                        if (index == -1) {
                            _this.propertyExpenses.push(new cls.PropertyExpenseViewModel(pe.type, pe.preferredPayPeriod, pe.monthlyAmount, pe.impounded));
                        }
                        else {
                            var inputPE = _this.propertyExpenses[index];
                            if (!inputPE.monthlyAmount || inputPE.monthlyAmount == 0) {
                                lib.replace(_this.propertyExpenses, new cls.PropertyExpenseViewModel(pe.type, pe.preferredPayPeriod, pe.monthlyAmount, pe.impounded), function (pe) { return pe.type == inputPE.type; });
                            }
                            else if (!(inputPE instanceof (cls.PropertyExpenseViewModel))) {
                                lib.replace(_this.propertyExpenses, new cls.PropertyExpenseViewModel(inputPE.type, inputPE.preferredPayPeriod, inputPE.monthlyAmount, inputPE.impounded), function (pe) { return pe.type == inputPE.type; });
                            }
                        }
                    });
                }
            };
            // Set default for properties created on client side (multi-1003).
            this.occupancyType = 1 /* PrimaryResidence */;
        }
        Object.defineProperty(PropertyViewModelBase.prototype, "fullAddressString", {
            get: function () {
                var fullAddress = '';
                if (this.isSubjectProperty) {
                    fullAddress = fullAddress.concat("*");
                }
                fullAddress = fullAddress.concat(this.streetName ? this.streetName : "").concat(", ");
                if (this && this.unitNumber) {
                    fullAddress += "#" + this.unitNumber + ", ";
                }
                fullAddress = fullAddress.concat(this.cityName ? this.cityName : "").concat(", ").concat(this.stateName ? this.stateName : "").concat(" ").concat(this.zipCode ? this.zipCode : '');
                return fullAddress;
            },
            enumerable: true,
            configurable: true
        });
        PropertyViewModelBase.prototype.formatAddress = function () {
            var fullAddress = '';
            fullAddress = fullAddress.concat(this.streetName ? this.streetName : "").concat(", ").concat(this.cityName ? this.cityName : "");
            return fullAddress;
        };
        PropertyViewModelBase.propertyExpenseDefaults = [
            { type: (1 /* propertyTax */).toString(), preferredPayPeriod: (2 /* Annual */).toString(), monthlyAmount: 0, impounded: true },
            { type: (2 /* homeOwnerInsurance */).toString(), preferredPayPeriod: (2 /* Annual */).toString(), monthlyAmount: 0, impounded: true },
            { type: (3 /* mortgageInsurance */).toString(), preferredPayPeriod: (1 /* Monthly */).toString(), monthlyAmount: 0, impounded: true },
            { type: (4 /* hOADues */).toString(), preferredPayPeriod: (1 /* Monthly */).toString(), monthlyAmount: 0, impounded: false },
            { type: (5 /* floodInsurance */).toString(), preferredPayPeriod: (1 /* Monthly */).toString(), monthlyAmount: 0, impounded: true },
        ];
        /**
        * @desc Shared method for finding active loan application from TransactionInfo.
        * Needed to be static, instead of base class method, because of incorrect TransactionInfo management.
        */
        PropertyViewModelBase.findActiveLoanApplication = function (ti) {
            var active = ti.getLoan().active;
            if (!!active) {
                var loanApplicationId = active.loanApplicationId;
                var currentActive = lib.findSingle(ti.loanApplications, function (la) { return la.loanApplicationId == loanApplicationId; });
            }
            return currentActive;
        };
        /**
        * @desc Setter for ownership percentage.
        * Needed to be static, instead of base property, because of incorrect TransactionInfo management.
        */
        PropertyViewModelBase.setOwnershipPercentage = function (ownershipPercentage, isSubjectProperty, getTi) {
            if (isSubjectProperty && !!getTi) {
                var ownershipPercentageTemp = ownershipPercentage;
                if (ownershipPercentage > getTi().getLoan().remainingOwnershipCalculation() || ownershipPercentage > 100) {
                    ownershipPercentageTemp = getTi().getLoan().remainingOwnershipCalculation();
                }
                var active = PropertyViewModelBase.findActiveLoanApplication(getTi());
                if (!!active) {
                    active.ownershipPercentage = ownershipPercentageTemp;
                }
            }
            return ownershipPercentage;
        };
        /**
        * @desc Getter for ownership percentage.
        * Needed to be static, instead of base property, because of incorrect TransactionInfo management.
        */
        PropertyViewModelBase.getOwnershipPercentage = function (defaultOwnershipPercentage, isSubjectProperty, getTi) {
            if (isSubjectProperty && getTi) {
                var active = PropertyViewModelBase.findActiveLoanApplication(getTi());
                if (!!active) {
                    return active.ownershipPercentage;
                }
            }
            else {
                return defaultOwnershipPercentage;
            }
        };
        return PropertyViewModelBase;
    })(srv.cls.PropertyViewModel);
    // LiablitySnapshot is used to save the state of a PropertyViewModel without external references
    var PropertySnapshot = (function (_super) {
        __extends(PropertySnapshot, _super);
        function PropertySnapshot(property, ti) {
            var _this = this;
            _super.call(this);
            this.hasTransactionInfo = function () {
                return (!!_this.ticb && !!_this.ticb());
            };
            this.getTransactionInfo = function () {
                if (_this.hasTransactionInfo())
                    return _this.ticb();
                else {
                    throw new Error("TransactionInfo not available");
                }
            };
            this.setTransactionInfo = function (ti) {
                _this.ticb = function () { return ti; };
            };
            if (property) {
                lib.copyState(property, this);
                this.propertyExpenses = angular.copy(property.propertyExpenses);
                this.occupancyType = property.occupancyType;
                this.OccupancyType = property.OccupancyType;
            }
            else {
                this.propertyId = util.IdentityGenerator.nextGuid();
                this.initializePropertyExpenses();
            }
            if (!!ti) {
                this.setTransactionInfo(ti);
                if (property) {
                    ti.property.map(property);
                }
            }
        }
        Object.defineProperty(PropertySnapshot.prototype, "OccupancyType", {
            get: function () {
                return this.occupancyType;
            },
            set: function (occupancyType) {
                this.occupancyType = occupancyType;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PropertySnapshot.prototype, "OwnershipPercentage", {
            get: function () {
                return PropertyViewModelBase.getOwnershipPercentage(this.ownershipPercentage, this.isSubjectProperty, this.getTransactionInfo);
            },
            set: function (ownershipPercentage) {
                this.ownershipPercentage = PropertyViewModelBase.setOwnershipPercentage(ownershipPercentage, this.isSubjectProperty, this.getTransactionInfo);
            },
            enumerable: true,
            configurable: true
        });
        return PropertySnapshot;
    })(PropertyViewModelBase);
    cls.PropertySnapshot = PropertySnapshot;
    var PropertyViewModel = (function (_super) {
        __extends(PropertyViewModel, _super);
        function PropertyViewModel(ti, property, homeBuyingType) {
            var _this = this;
            _super.call(this);
            this.hasTransactionInfo = function () {
                return (!!_this.ticb && !!_this.ticb());
            };
            this.getTransactionInfo = function () {
                if (_this.hasTransactionInfo())
                    return _this.ticb();
                else {
                    throw new Error("TransactionInfo not available");
                }
            };
            this.setTransactionInfo = function (ti) {
                _this.ticb = function () { return ti; };
            };
            //
            this.getHasTransactionalInfoIncome = function () {
                if (_this.hasTransactionInfo() && !!_this.getTransactionInfo().incomeInfo) {
                    return true;
                }
                else {
                    return false;
                }
            };
            this.getTransactionInfoIncome = function () {
                if (_this.getHasTransactionalInfoIncome()) {
                    return _this.getTransactionInfo().incomeInfo;
                }
                return new cls.Map();
            };
            this.getIncome = function () {
                if (_this.getHasTransactionalInfoIncome()) {
                    var item = lib.findFirst(_this.getTransactionInfoIncome().getValues(), function (o) { return o.propertyId == _this.propertyId; });
                    return item;
                }
                return null;
            };
            this.setIncome = function (income) {
                if (_this.getHasTransactionalInfoIncome()) {
                    income.propertyId = _this.propertyId;
                    _this.getTransactionInfoIncome().map(income);
                }
            };
            //
            this.getHasTransactionalInfoLiability = function () {
                if (_this.hasTransactionInfo() && !!_this.getTransactionInfo().liability) {
                    return true;
                }
                else {
                    return false;
                }
            };
            this.getTransactionInfoLiability = function () {
                if (_this.getHasTransactionalInfoLiability()) {
                    return _this.getTransactionInfo().liability;
                }
                return new cls.Map();
            };
            this.getLiability = function () {
                if (_this.getHasTransactionalInfoLiability()) {
                    return lib.filter(_this.getTransactionInfoLiability().getValues(), function (o) { return o.propertyId == _this.propertyId; });
                }
                return [];
            };
            this.setLiability = function (liability) {
                if (!!liability && _this.getHasTransactionalInfoLiability()) {
                    _this.getTransactionInfoLiability().mapAll(liability);
                }
            };
            this.getfullAddress = function () {
                return _this.fullAddress;
            };
            this.isAddressEqual = function (property) {
                if (!property)
                    return false;
                if (property.propertyId == _this.propertyId)
                    return true;
                // to support 2.0 only compare these fields (unit and county are only saved for subject property in 2.0)
                return _this.cityName == property.cityName && _this.stateName == property.stateName && _this.streetName == property.streetName && _this.zipCode == property.zipCode;
            };
            this.isOwnedPrimaryResidence = function () {
                return _this.OccupancyType == 1 /* PrimaryResidence */ && _this.isPropertyOwned;
            };
            // @todo-cl::PROPERTY-ADDRESS
            this.isEmpty = function () { return false; };
            // @todo-cl::PROPERTY-ADDRESS
            this.clearAddress = function (b) {
                _this.streetName = "";
                _this.cityName = "";
                _this.stateId = null;
                _this.stateName = "";
                _this.countyName = "";
                _this.unitNumber = "";
                _this.zipCode = "";
                _this.timeAtAddressMonths = null;
                _this.timeAtAddressYears = null;
                return true;
            };
            // non-subject property - address on the Credit tab is without county
            this.isValid = function (validateCounty) {
                if (validateCounty === void 0) { validateCounty = true; }
                var isValid = true;
                if (validateCounty) {
                    isValid = !common.string.isNullOrWhiteSpace(_this.countyName);
                }
                if (isValid && !common.string.isNullOrWhiteSpace(_this.cityName) && !common.string.isNullOrWhiteSpace(_this.stateName) && !common.string.isNullOrWhiteSpace(_this.streetName) && !common.string.isNullOrWhiteSpace(_this.zipCode)) {
                    return true;
                }
                return false;
            };
            // PROPERTY-EXPENSES
            this.areExpensesValid = function () {
                return (_this.propertyTaxExpense.monthlyAmount && _this.propertyTaxExpense.monthlyAmount != 0 && (_this.homeOwnerExpense.monthlyAmount || _this.homeOwnerExpense.monthlyAmount == 0) && ((_this.propertyType == String(2 /* Condominium */) || _this.propertyType == String(3 /* PUD */)) && _this.monthlyHOAdues != 0 || _this.propertyType != String(2 /* Condominium */) && _this.propertyType != String(3 /* PUD */)));
            };
            this.isOwnershipValid = function () {
                if ((!common.string.isNullOrWhiteSpace(String(_this.ownership)) && !(_this.timeAtAddressMonths > 0 || _this.timeAtAddressYears > 0)))
                    return false;
                if (_this.ownership == 1 /* Rent */)
                    return _this.monthlyRent > 0;
                return true;
            };
            this.initialize = function (property, homeBuyingType) {
                //set address street name to TBD when home buying type is GetPreapproved
                if (homeBuyingType && homeBuyingType == 3 /* GetPreApproved */ && _this.isSubjectProperty && _this && _this.streetName == "") {
                    _this.streetName = "TBD";
                }
                if (_this.isSubjectProperty) {
                    //Initialize default values for SubjectProperty
                    if (!_this.grossRentalIncome)
                        _this.grossRentalIncome = 0;
                    if (!_this.vacancyPercentage)
                        _this.vacancyPercentage = 75;
                    if (!_this.downPaymentSource)
                        _this.downPaymentSource = 19;
                }
                if (!_this.propertyId || _this.propertyId == lib.getEmptyGuid())
                    _this.propertyId = util.IdentityGenerator.nextGuid();
                if (!angular.isDefined(_this.isSubjectProperty))
                    _this.isSubjectProperty = false;
                _this.initializePropertyExpenses();
            };
            this.getHOADisplayAmount = function () { return _this.getPropertyExpenseDisplayAmount(_this.hoaDuesExpense); };
            this.getPropertyTaxDisplayAmount = function () { return _this.getPropertyExpenseDisplayAmount(_this.propertyTaxExpense); };
            this.getHomeOwnerDisplayAmount = function () { return _this.getPropertyExpenseDisplayAmount(_this.homeOwnerExpense); };
            this.getMortgageInsuranceDisplayAmount = function () { return _this.getPropertyExpenseDisplayAmount(_this.mortgageInsuranceExpense); };
            this.getFloodInsuranceDisplayAmount = function () { return _this.getPropertyExpenseDisplayAmount(_this.floodInsuranceExpense); };
            this.getPropertyExpenseDisplayAmount = function (propertyExpense) {
                return +propertyExpense.preferredPayPeriod == 1 /* Monthly */ ? propertyExpense.monthlyAmount : propertyExpense.monthlyAmount * 12;
            };
            this.getDownPaymentSourceText = function (downPaymentSourceValue, downPaymentSourceList) {
                for (var i = 0; i < downPaymentSourceList.length; i++) {
                    if (downPaymentSourceList[i].value == downPaymentSourceValue.toString())
                        return downPaymentSourceList[i].text;
                }
            };
            //}
            //export class PropertyViewModel extends PropertyViewModelBase {
            //constructor(protected loanCallBack: cls.ILoanCallback, property?: srv.IPropertyViewModel, homeBuyingType?: number) {
            //    super(property, homeBuyingType, loanCallBack);
            //}
            ///**
            //* @desc Retrieves the net rental of the active loan application tied to the property.
            //*/
            this.getNetRentalIncome = function () {
                if (!_this.hasTransactionInfo())
                    return null;
                if (_this.OccupancyType != 2 /* InvestmentProperty */)
                    return null;
                if (_this.getHasTransactionalInfoIncome()) {
                    var nri = _this.getNetRentalIncomeExisting(_this.getActiveBorrower().borrowerId);
                    if (nri == null) {
                        nri = _this.createNetRentalIncome();
                    }
                    return nri;
                }
                else {
                    return null;
                }
            };
            //Sum Property Expenses
            this.sumPropertyExpenses = function () {
                var total = 0;
                if (_this.propertyExpenses) {
                    for (var k = 0; k < _this.propertyExpenses.length; k++) {
                        total += _this.roundToFourDecimalPlaces(_this.propertyExpenses[k].monthlyAmount);
                    }
                }
                return total;
            };
            //Round to Four Decimal Places
            this.roundToFourDecimalPlaces = function (value) {
                return value ? Math.round(value * 10000) / 10000 : 0;
            };
            /**
            * @desc Gets the currently active loan application instance.
            */
            this.getActiveLoanApplication = function () {
                return _this.getTransactionInfo().getLoan().active;
            };
            /**
            * @desc Gets the currently active borrower instance.
            */
            this.getActiveBorrower = function () {
                return _this.getTransactionInfo().getLoan().active.getBorrower();
            };
            /**
            * @desc Gets the existing net rental income instance for the specified borrower.
            */
            this.getNetRentalIncomeExisting = function (borrowerId) {
                if (!_this.hasTransactionInfo())
                    return null;
                var nri = lib.findSingle(_this.getTransactionInfoIncome().getValues(), function (o) { return o.propertyId == _this.propertyId && o.borrowerId == borrowerId; });
                return nri;
            };
            this.createNetRentalIncome = function () {
                if (!_this.getHasTransactionalInfoIncome()) {
                    return null;
                }
                //
                // @todo-cl: Eventually all create everywhere will be done server-side ...
                //
                // Create
                var nri = new cls.IncomeInfoViewModel(_this.getTransactionInfo());
                // IncomeViewModel defaults
                _this.assignIncomeViewModelDefaultsForNewlyCreatedNetRentalIncome(nri);
                // PropertyViewModel defaults
                _this.assignPropertyViewModelDefaultsForNewlyCreatedNetRentalIncome();
                return nri;
            };
            this.assignIncomeViewModelDefaultsForNewlyCreatedNetRentalIncome = function (nri) {
                // Find the right borrower
                var borrowerPredId;
                if (_this.isSubjectProperty)
                    borrowerPredId = function (b) { return !b.isCoBorrower && b.loanApplicationId == _this.getActiveLoanApplication().loanApplicationId; };
                else
                    borrowerPredId = function (b) { return b.borrowerId == _this.getActiveBorrower().borrowerId; };
                var borrowerPred = function (b) { return borrowerPredId(b); };
                var borrowerLoanApp = lib.findSingle(_this.getTransactionInfo().borrower.getValues(), function (o) { return borrowerPred(o); });
                // assignments
                nri.isNetRental = true;
                nri.incomeTypeId = 5 /* netRentalIncome */;
                nri.manualChange = false;
                nri.isNegativeIncome = false;
                nri.propertyId = _this.propertyId;
                nri.isSubjectProperty = _this.isSubjectProperty;
                nri.isRemoved = false;
                nri.Amount = 0.00; // Will get overritten soon enough , but let's start off in a good state
                if (!!borrowerLoanApp) {
                    nri.borrowerId = borrowerLoanApp.borrowerId;
                }
            };
            this.assignPropertyViewModelDefaultsForNewlyCreatedNetRentalIncome = function () {
                //
                // @todo-cl: Eventually all defaults everywhere will be done server-side ...
                //
                if (angular.isUndefined(_this.grossRentalIncome)) {
                    _this.grossRentalIncome = 0.00;
                }
                if (angular.isUndefined(_this.OwnershipPercentage)) {
                    _this.OwnershipPercentage = 100;
                }
                if (angular.isUndefined(_this.vacancyPercentage)) {
                    _this.vacancyPercentage = 75;
                }
            };
            this.manageNetRentalIncome = function () {
                if (_this.OccupancyType == 2 /* InvestmentProperty */) {
                    // accessing will create if not exists (lazy)
                    var nri = _this.getNetRentalIncome();
                    // re-instate in case was deleted in same session
                    nri.isRemoved = false;
                }
                else {
                    var nri = _this.getNetRentalIncomeExisting(_this.getActiveBorrower().borrowerId);
                    if (!!nri) {
                        //
                        // In case it is re-instated later , let's put things back to newly created state
                        //
                        // IncomeViewModel defaults
                        _this.assignIncomeViewModelDefaultsForNewlyCreatedNetRentalIncome(nri);
                        // PropertyViewModel defaults
                        _this.assignPropertyViewModelDefaultsForNewlyCreatedNetRentalIncome();
                        // Remove it
                        var nriCls = nri;
                        nriCls.remove();
                    }
                }
            };
            if (!!property)
                lib.copyState(property, this);
            if (!this.propertyId || this.propertyId == lib.getEmptyGuid()) {
                this.propertyId = util.IdentityGenerator.nextGuid();
            }
            if (!!ti) {
                this.setTransactionInfo(ti);
                ti.property.map(this);
            }
            this.initialize(property, homeBuyingType);
        }
        Object.defineProperty(PropertyViewModel.prototype, "fullAddress", {
            get: function () {
                var fullAddress = (this.streetName ? this.streetName.trim() : '') + (this.cityName ? (' ' + this.cityName.trim()) : '') + " " + (this.stateName ? this.stateName.trim() : '') + " " + (this.zipCode ? this.zipCode.trim() : '');
                return fullAddress.trim();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PropertyViewModel.prototype, "isPropertyOwned", {
            get: function () {
                return this.ownership == 0 /* Own */;
            },
            set: function (isPropertyOwned) {
                /*Read Only*/
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PropertyViewModel.prototype, "PropertyType", {
            get: function () {
                return this.propertyType;
            },
            set: function (pType) {
                if (pType == '1') {
                    this.numberOfStories = 1;
                }
                else if (pType == '0' || pType == '6' || pType == '14') {
                    this.numberOfUnits = 1;
                }
                this.propertyType = pType;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PropertyViewModel.prototype, "NeedPreApproval", {
            get: function () {
                return this.needPreApproval;
            },
            set: function (needPreApproval) {
                this.needPreApproval = needPreApproval;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PropertyViewModel.prototype, "monthlyHOAdues", {
            get: function () {
                return this.hoaDuesExpense.monthlyAmount;
            },
            set: function (value) {
                this.hoaDuesExpense.monthlyAmount = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PropertyViewModel.prototype, "propertyTaxExpense", {
            get: function () {
                return lib.findFirst(this.propertyExpenses, function (pe) { return +pe.type == 1 /* Tax */; });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PropertyViewModel.prototype, "hoaDuesExpense", {
            get: function () {
                return lib.findFirst(this.propertyExpenses, function (pe) { return +pe.type == 4 /* HOA */; });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PropertyViewModel.prototype, "homeOwnerExpense", {
            get: function () {
                return lib.findFirst(this.propertyExpenses, function (pe) { return +pe.type == 2 /* HOI */; });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PropertyViewModel.prototype, "mortgageInsuranceExpense", {
            get: function () {
                return lib.findFirst(this.propertyExpenses, function (pe) { return +pe.type == 3 /* PMI */; });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PropertyViewModel.prototype, "floodInsuranceExpense", {
            get: function () {
                return lib.findFirst(this.propertyExpenses, function (pe) { return +pe.type == 5 /* FloodInsurance */; });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PropertyViewModel.prototype, "OccupancyType", {
            // the occupancy type is at the loan application level, even if the subjectProperty is at the loan level 
            get: function () {
                return this.isSubjectProperty ? this.getTransactionInfo().getLoan().active.occupancyType : this.occupancyType;
            },
            set: function (occupancyType) {
                if (this.isSubjectProperty) {
                    // during initializtion this may not be setup yet , but during that phase we can skip this anyhow
                    var active = this.getTransactionInfo().getLoan().active;
                    if (!!active) {
                        active.OccupancyType = occupancyType;
                    }
                }
                else {
                    this.occupancyType = occupancyType;
                }
                if (this.isSubjectProperty) {
                    if (occupancyType == 2 /* InvestmentProperty */ && !this.ownershipPercentage)
                        this.OwnershipPercentage = 100;
                    else if (occupancyType != 2 /* InvestmentProperty */) {
                        this.OwnershipPercentage = 0;
                    }
                }
                this.manageNetRentalIncome();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PropertyViewModel.prototype, "OwnershipPercentage", {
            get: function () {
                return PropertyViewModelBase.getOwnershipPercentage(this.ownershipPercentage, this.isSubjectProperty, this.getTransactionInfo);
            },
            set: function (ownershipPercentage) {
                this.ownershipPercentage = PropertyViewModelBase.setOwnershipPercentage(ownershipPercentage, this.isSubjectProperty, this.getTransactionInfo);
            },
            enumerable: true,
            configurable: true
        });
        return PropertyViewModel;
    })(PropertyViewModelBase);
    cls.PropertyViewModel = PropertyViewModel;
    var PropertyExpenseViewModel = (function (_super) {
        __extends(PropertyExpenseViewModel, _super);
        function PropertyExpenseViewModel(typeExpense, preferredPayPeriod, monthlyAmount, impound) {
            if (impound === void 0) { impound = false; }
            _super.call(this);
            this.type = typeExpense;
            this.preferredPayPeriod = preferredPayPeriod;
            this.monthlyAmount = monthlyAmount;
            this.impounded = impound;
        }
        return PropertyExpenseViewModel;
    })(srv.cls.PropertyExpenseViewModel);
    cls.PropertyExpenseViewModel = PropertyExpenseViewModel;
})(cls || (cls = {}));
//# sourceMappingURL=property.extendedviewmodel.js.map