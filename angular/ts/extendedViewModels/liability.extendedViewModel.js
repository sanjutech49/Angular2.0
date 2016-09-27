/// <reference path="../../ts/generated/viewModels.ts" />
/// <reference path="../../ts/extendedViewModels/property.extendedviewmodel.ts" />
/// <reference path="../../ts/generated/viewModelClasses.ts" />
/// <reference path="../../common/common.objects.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var cls;
(function (cls) {
    var LiabilityViewModel = (function (_super) {
        __extends(LiabilityViewModel, _super);
        function LiabilityViewModel(ti, liability, borrowerFullName) {
            var _this = this;
            _super.call(this);
            this.borrowerFullName = borrowerFullName;
            this.assignSubjectPropertyId = function () {
                if (!_this.ticb || !_this.ticb()) {
                    return;
                }
                var loanVm = _this.ticb().getLoan();
                if (!loanVm) {
                    return;
                }
                var subjectProperty = loanVm.getSubjectProperty();
                if (!subjectProperty) {
                    return;
                }
                _this.subjectPropertyId = subjectProperty.propertyId;
            };
            this.isRemoved = false;
            this.getTotalPayments = function () {
                var propertyExpensesExist = (_this.getProperty() && _this.getProperty().propertyExpenses);
                var isFirstLienPosition = _this.lienPosition == 1;
                var isPledgedAssetPaidOff = _this.borrowerDebtCommentId == 1 /* PaidOffFreeAndClear */ || _this.borrowerDebtCommentId == 6 /* NotMyLoan */;
                if (isPledgedAssetPaidOff || !propertyExpensesExist || !isFirstLienPosition)
                    return _this.minPayment;
                if (_this.getProperty().propertyExpenses.length > 0) {
                    var filteredPropertyExpenses = _this.getProperty().propertyExpenses.filter(function (e) { return !e.impounded && e.monthlyAmount != 0; });
                    if (filteredPropertyExpenses && filteredPropertyExpenses.length > 0)
                        for (var i = 0; i < filteredPropertyExpenses.length; i++)
                            _this.minPayment += parseFloat(String(filteredPropertyExpenses[i].monthlyAmount));
                }
                return _this.minPayment;
            };
            /*
            * @desc Hnadles comment change on liablity item
            */
            this.handleCommentChange = function () {
                if (_this.debtCommentId == 9 /* NonBorrowingSpouse */) {
                    _this.companyData.attn = 'Non-Borrowing Spouse Liability';
                }
                else {
                    _this.companyData.attn = '';
                }
                if (_this.isSecondaryPartyRecord) {
                    _this.setDTIAndTotalLiabilityFlags(false, false);
                    return;
                }
                if (_this.debtCommentId == 4 /* PayoffAtClose */) {
                    _this.setDTIAndTotalLiabilityFlags(false, true);
                    return;
                }
                if (_this.debtCommentId == 5 /* AcctNotMine */ || _this.debtCommentId == 6 /* Duplicate */ || _this.debtCommentId == 7 /* NotMyLoan */ || _this.debtCommentId == 3 /* PaidOff */ || _this.debtCommentId == 8 /* SomeoneElsePays */) {
                    _this.setDTIAndTotalLiabilityFlags(false, false);
                }
                else {
                    _this.setDTIAndTotalLiabilityFlags(true, true);
                }
            };
            this.setDTIAndTotalLiabilityFlags = function (includeInDTI, includeInTotalLiabilites) {
                _this.includeInDTI = includeInDTI;
                _this.includeInLiabilitiesTotal = includeInTotalLiabilites;
                _this.liabilityDisabled = !_this.includeInLiabilitiesTotal || _this.isSecondaryPartyRecord;
            };
            /**
            *@desc loanAppItem level validation
            */
            this.isValid = function () {
                if (_this.borrowerDebtCommentId != 6 /* NotMyLoan */) {
                    if (!_this.getProperty() || !_this.getProperty().propertyId || !_this.getProperty().isValid(false) || !_this.getProperty().propertyType || !_this.getProperty().currentEstimatedValue || !_this.getProperty().occupancyType || (_this.getProperty().occupancyType == 2 /* InvestmentProperty */ && (!_this.getProperty().OwnershipPercentage || !_this.getProperty().grossRentalIncome)))
                        return false;
                    if (_this.borrowerDebtCommentId != 1 /* PaidOffFreeAndClear */) {
                        if (!_this.lienPosition || !_this.companyData.companyName || !_this.unpaidBalance || !_this.minPayment || (_this.pledgedAssetLoanType == 2 /* Heloc */ && !_this.maximumCreditLine) || (_this.lienPosition == 1 /* First */ && !_this.getProperty().areExpensesValid()))
                            return false;
                    }
                }
                return true;
            };
            this.hidden = false;
            /**
            * @desc Includes collection into sum of total amount
            */
            this.includeCollectionInLiabilitesTotalAmount = function (collection) {
                if (collection.debtCommentId === 1) {
                    collection.includeInLiabilitiesTotal = true;
                }
                else if (collection.debtCommentId === 4) {
                    collection.includeInLiabilitiesTotal = false;
                }
            };
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
            //
            this.getHasTransactionalInfoProperty = function () {
                if (_this.hasTransactionInfo() && !!_this.getTransactionInfo().property) {
                    return true;
                }
                else {
                    return false;
                }
            };
            this.getTransactionInfoProperty = function () {
                if (_this.getHasTransactionalInfoProperty()) {
                    return _this.getTransactionInfo().property;
                }
                return new cls.Map();
            };
            this.hasProperty = function () {
                return !!_this.getProperty();
            };
            // property
            this.getProperty = function () {
                if (!!_this.propertyId && _this.getHasTransactionalInfoProperty()) {
                    var item = _this.getTransactionInfoProperty().lookup(_this.propertyId);
                    return item;
                }
                return null;
            };
            this.setProperty = function (property) {
                if (!!property && _this.getHasTransactionalInfoProperty()) {
                    _this.propertyId = property.propertyId;
                    _this.getTransactionInfoProperty().map(property);
                }
                else {
                    _this.propertyId = null;
                }
            };
            this.bindProperty = function (propertyVm) {
                if (angular.isDefined(propertyVm)) {
                    _this.setProperty(propertyVm);
                }
                return _this.getProperty();
            };
            if (!!liability) {
                lib.copyState(liability, this);
                if (this.companyData || angular.isUndefined(this.companyData.hasChanges)) {
                    this.companyData.hasChanges = false;
                }
            }
            else {
                this.debtCommentId = 0;
                this.companyData = new cls.CompanyDataViewModel();
                this.reoInfo = new cls.REOInfoViewModel();
            }
            if (!this.liabilityInfoId || this.liabilityInfoId == lib.getEmptyGuid()) {
                this.liabilityInfoId = util.IdentityGenerator.nextGuid();
            }
            if (!!ti) {
                this.setTransactionInfo(ti);
                ti.liability.map(this);
            }
            if (!!borrowerFullName) {
                this.borrowerFullName = borrowerFullName;
            }
            this.setAccountsOwnershipType();
            try {
                this.assignSubjectPropertyId();
            }
            catch (e) {
            }
        }
        Object.defineProperty(LiabilityViewModel.prototype, "isAllocatedSubjProp", {
            // @todo-cc: Review to see about pushing up to [consumersite.vm]
            get: function () {
                if (!this.propertyId) {
                    return false;
                }
                else if (!this.subjectPropertyId) {
                    return false;
                }
                else {
                    return this.propertyId == this.subjectPropertyId;
                }
            },
            set: function (isAllocatedSubjProp) {
                if (isAllocatedSubjProp) {
                    if (!!this.subjectPropertyId) {
                        this.propertyId = this.subjectPropertyId;
                    }
                }
                else {
                    this.propertyId = null;
                    // @todo-cc: Beware this side effect
                    this.lienPosition = null;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LiabilityViewModel.prototype, "isLenderSectionVisible", {
            get: function () {
                return this.borrowerDebtCommentId != 1 /* PaidOffFreeAndClear */;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LiabilityViewModel.prototype, "collectionColumnsDisabled", {
            get: function () {
                return this.debtCommentId == 5 /* Duplicate */ || this.debtCommentId == 3 /* PaidOff */ || this.debtCommentId == 4 /* PayoffAtClose */;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LiabilityViewModel.prototype, "creditor", {
            get: function () {
                if (this.payoffLender != undefined && this.payoffLender != null)
                    return this.payoffLender;
                else
                    return this.companyData.companyName;
            },
            /**
            * @desc srv.IPayOffSectionItemViewModel members
            */
            set: function (value) {
                if (value != this.companyData.companyName) {
                    this.payoffLender = value;
                }
                else {
                    this.payoffLender = null;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LiabilityViewModel.prototype, "balance", {
            get: function () {
                return this.unpaidBalance;
            },
            set: function (value) {
                this.unpaidBalance = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LiabilityViewModel.prototype, "payoffCommentId", {
            get: function () {
                return this.isPledged ? String(this.borrowerDebtCommentId) : String(this.debtCommentId);
            },
            set: function (value) {
                if (this.isPledged)
                    this.borrowerDebtCommentId = parseInt(value);
                else
                    this.debtCommentId = parseInt(value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LiabilityViewModel.prototype, "isUserAdded", {
            get: function () {
                return this.isUserEntry;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LiabilityViewModel.prototype, "isPublicRecord", {
            get: function () {
                return false;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LiabilityViewModel.prototype, "isLiability", {
            get: function () {
                return !this.isPledged;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LiabilityViewModel.prototype, "canEdit", {
            get: function () {
                return true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LiabilityViewModel.prototype, "isPayoffItem", {
            get: function () {
                return false;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LiabilityViewModel.prototype, "lienPositionDisplayValue", {
            get: function () {
                if (this.borrowerDebtCommentId && this.borrowerDebtCommentId == 9 /* Duplicate */) {
                    return "Duplicate";
                }
                if (this.lienPosition && this.lienPosition != -1 && this.lienPosition != 0) {
                    switch (this.lienPosition) {
                        case 1:
                            return "First";
                        case 2:
                            return "Second";
                        case 3:
                            return "Third";
                        case 4:
                            return "Fourth";
                        case 5:
                            return "Fifth";
                    }
                    ;
                    return "";
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LiabilityViewModel.prototype, "estimatedValueDisplayValue", {
            get: function () {
                if (this.getProperty() && this.getProperty().currentEstimatedValue && (!this.lienPosition || this.lienPosition == -1 || this.lienPosition == 1)) {
                    return this.getProperty().currentEstimatedValue.toString();
                }
                return "";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LiabilityViewModel.prototype, "payoffDisplayValue", {
            get: function () {
                return this.borrowerDebtCommentId == 2 /* PayoffAtClose */ || this.borrowerDebtCommentId == 4 /* PayoffAtClosingAndCloseAccount */ || this.borrowerDebtCommentId == 3 /* PayoffAtClosingAndDontCloseAccount */;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LiabilityViewModel.prototype, "excludeDisplayValue", {
            get: function () {
                return this.borrowerDebtCommentId == 9 /* Duplicate */;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LiabilityViewModel.prototype, "propertyAddressDisplayValue", {
            get: function () {
                var propertyAddress = "";
                if (this.getProperty()) {
                    if (this.borrowerDebtCommentId != 6)
                        propertyAddress = this.getProperty().fullAddressString;
                    else
                        propertyAddress = "Not my loan";
                }
                else {
                    propertyAddress = "Not specified";
                }
                return propertyAddress;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LiabilityViewModel.prototype, "isNotMyLoan", {
            get: function () {
                return this.borrowerDebtCommentId == 6;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LiabilityViewModel.prototype, "includeInTotalPayment", {
            get: function () {
                return this.borrowerDebtCommentId != 2 /* PayoffAtClose */ && this.borrowerDebtCommentId != 4 /* PayoffAtClosingAndCloseAccount */ && this.borrowerDebtCommentId != 3 /* PayoffAtClosingAndDontCloseAccount */ && this.borrowerDebtCommentId != 6 /* NotMyLoan */ && this.borrowerDebtCommentId != 9 /* Duplicate */;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LiabilityViewModel.prototype, "debtsAccountOwnershipType", {
            get: function () {
                return this._debtsAccountOwnershipType;
            },
            set: function (debtsAccountOwnershipType) {
                this._debtsAccountOwnershipType = debtsAccountOwnershipType;
                this.setAccountsOwnershipType();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LiabilityViewModel.prototype, "DebtsAccountOwnershipType", {
            /**
            *@desc Used to keep other properties in sync
            *       @todo-cl: Remove
            */
            get: function () {
                return this.debtsAccountOwnershipType;
            },
            set: function (newVal) {
                this.debtsAccountOwnershipType = newVal;
            },
            enumerable: true,
            configurable: true
        });
        LiabilityViewModel.prototype.setAccountsOwnershipType = function () {
            switch (this.liabilitiesAccountOwnershipType) {
                case String(0 /* AuthorizedUser */):
                    this.accountOwnershipTypeToolTipText = "Authorized User";
                    this.accountOwnershipTypeIndicator = "a";
                    break;
                case String(2 /* Individual */):
                    if (this.isSecondaryPartyRecord) {
                        this.accountOwnershipTypeToolTipText = "Authorized User";
                        this.accountOwnershipTypeIndicator = "a";
                    }
                    else {
                        this.accountOwnershipTypeToolTipText = "";
                        this.accountOwnershipTypeIndicator = "";
                    }
                    break;
                case String(3 /* JointContractualLiability */):
                case String(4 /* JointParticipating */):
                    this.accountOwnershipTypeToolTipText = this.isJointWithSingleBorrowerID ? "Joint Account w/ Someone Else" : "Joint Account w/ Co-Borrower";
                    this.accountOwnershipTypeIndicator = this.isJointWithSingleBorrowerID ? "j-other" : "j";
                    break;
                case String(-1 /* None */):
                default:
                    this.accountOwnershipTypeToolTipText = "";
                    this.accountOwnershipTypeIndicator = "";
                    break;
            }
        };
        Object.defineProperty(LiabilityViewModel.prototype, "property", {
            // @todo-cl: Remove ; backwards compbadiblity
            get: function () {
                return this.getProperty();
            },
            set: function (propertyVm) {
                /*Read-Only*/
                console.warn("LiabilityViewModel::<set property> should not be called ; use setProperty() instead.");
            },
            enumerable: true,
            configurable: true
        });
        return LiabilityViewModel;
    })(srv.cls.LiabilityViewModel);
    cls.LiabilityViewModel = LiabilityViewModel;
})(cls || (cls = {}));
//# sourceMappingURL=liability.extendedViewModel.js.map