var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var cls;
(function (cls) {
    var IncomeInfoViewModel = (function (_super) {
        __extends(IncomeInfoViewModel, _super);
        function IncomeInfoViewModel(ti, incomeInfo) {
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
            this.getProperty = function () {
                if (_this.getHasTransactionalInfoProperty()) {
                    var item = _this.getTransactionInfoProperty().lookup(_this.propertyId);
                    return item;
                }
                return null;
            };
            this.setProperty = function (property) {
                if (_this.getHasTransactionalInfoProperty()) {
                    _this.getTransactionInfoProperty().map(property);
                }
            };
            // @todo-cc: Generalize => lib/fwk
            this.remove = function () {
                _this.isRemoved = true;
                if (_this.isCurrentlyAdded && _this.hasTransactionInfo()) {
                    _this.getTransactionInfo().incomeInfo.remove(_this);
                }
            };
            this.isNegativeIncome = false;
            this.isNetRental = false;
            this.getNetRentalDisplayName = function (loanPurposeType, isAdjusted, properties, propertyId) {
                var properties = properties.filter(function (property) {
                    return property.propertyId == propertyId;
                });
                var property;
                if (properties.length > 0)
                    property = properties[0];
                isAdjusted = isAdjusted || (property && (property.OwnershipPercentage != 100 || property.vacancyPercentage != 75));
                if (isAdjusted) {
                    if (String(loanPurposeType) == "1" && _this.isSubjectProperty)
                        return "Adjusted Anticipated Net Rental Income";
                    // Todo: Retrieve from lookup?
                    return "Adjusted Net Rental Income ";
                }
                if (String(loanPurposeType) == "1" && _this.isSubjectProperty)
                    return "Anticipated Net Rental Income";
                // Todo: Retrieve from lookup?
                return "Net Rental Income ";
            };
            /**
            * @desc Sets default property values for new item.
            */
            this.setDefaults = function () {
                // Default to monthly payment period.
                _this.PreferredPaymentPeriodId = 1;
            };
            this.initialize = function (incomeInfo) {
                if (!!_this.getProperty()) {
                    _this.setProperty(new cls.PropertyViewModel(_this.getTransactionInfo(), null));
                }
                if (_this.incomeTypeId == 5 /* netRentalIncome */) {
                    // convenience properties
                    _this.isNetRental = true;
                    _this.canProvideDocumentation = null;
                    _this.isNegativeIncome = _this.amount < 0;
                }
            };
            this.setDefaults();
            if (!!incomeInfo)
                lib.copyState(incomeInfo, this);
            if (!this.incomeInfoId || this.incomeInfoId == lib.getEmptyGuid()) {
                this.incomeInfoId = util.IdentityGenerator.nextGuid();
                this.isCurrentlyAdded = true;
            }
            if (!!ti) {
                this.setTransactionInfo(ti);
                ti.incomeInfo.map(this);
            }
            this.initialize(incomeInfo);
        }
        Object.defineProperty(IncomeInfoViewModel.prototype, "amount", {
            get: function () {
                return this._amount;
            },
            set: function (amount) {
                if (!angular.isDefined(amount))
                    amount = 0;
                this._amount = amount;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(IncomeInfoViewModel.prototype, "manualAmount", {
            get: function () {
                return this._amount;
            },
            set: function (manualAmount) {
                this.amount = manualAmount;
                if (this.isNetRental) {
                    this.manualChange = true;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(IncomeInfoViewModel.prototype, "calculatedAmount", {
            get: function () {
                return this.amount;
            },
            set: function (calculatedAmount) {
                if (!this.manualChange) {
                    this.amount = calculatedAmount;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(IncomeInfoViewModel.prototype, "Amount", {
            // @todo-cl: Remove
            get: function () {
                return this.amount;
            },
            // @todo-cl: Remove
            set: function (value) {
                this.amount = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(IncomeInfoViewModel.prototype, "PreferredPaymentPeriodId", {
            get: function () {
                return this.preferredPaymentPeriodId;
            },
            set: function (value) {
                this.preferredPaymentPeriodId = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(IncomeInfoViewModel.prototype, "calculatedMonthlyAmount", {
            get: function () {
                var amount = 0;
                if (!this.isRemoved)
                    amount = this.PreferredPaymentPeriodId == 2 /* Annual */ ? parseFloat((this.Amount / 12).toFixed(4)) : this.Amount;
                return amount;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(IncomeInfoViewModel.prototype, "fullAddressString", {
            get: function () {
                if (this.getProperty()) {
                    return this.getProperty().fullAddressString;
                }
                else {
                    return "";
                }
            },
            enumerable: true,
            configurable: true
        });
        IncomeInfoViewModel.newIncomeInfo = function (ti, typeid) {
            var incomeInfo = new cls.IncomeInfoViewModel(ti);
            incomeInfo.amount = 0;
            incomeInfo.incomeTypeId = typeid;
            return incomeInfo;
        };
        return IncomeInfoViewModel;
    })(srv.cls.IncomeInfoViewModel);
    cls.IncomeInfoViewModel = IncomeInfoViewModel;
    var OtherIncomeInfoViewModel = (function (_super) {
        __extends(OtherIncomeInfoViewModel, _super);
        function OtherIncomeInfoViewModel(ti, otherIncome) {
            _super.call(this, ti);
            if (otherIncome)
                common.objects.automap(this, otherIncome);
            else {
                this.amount = 0;
                this.preferredPaymentPeriodId = 1;
            }
            this.canProvideDocumentation = true;
        }
        return OtherIncomeInfoViewModel;
    })(IncomeInfoViewModel);
    cls.OtherIncomeInfoViewModel = OtherIncomeInfoViewModel;
    var NetRentalIncomeInfoViewModel = (function (_super) {
        __extends(NetRentalIncomeInfoViewModel, _super);
        function NetRentalIncomeInfoViewModel(netRentalIncome) {
            _super.call(this);
            if (netRentalIncome)
                common.objects.automap(this, netRentalIncome);
            else {
                this.amount = 0;
                this.preferredPaymentPeriodId = 1;
                this.isRemoved = false;
            }
            this.isNetRental = true;
            this.incomeTypeId = 5 /* netRentalIncome */;
            this.canProvideDocumentation = null;
        }
        return NetRentalIncomeInfoViewModel;
    })(IncomeInfoViewModel);
    cls.NetRentalIncomeInfoViewModel = NetRentalIncomeInfoViewModel;
})(cls || (cls = {}));
//# sourceMappingURL=incomeInfo.extendedViewModel.js.map