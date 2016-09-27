var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var cls;
(function (cls) {
    var HousingExpensesViewModel = (function (_super) {
        __extends(HousingExpensesViewModel, _super);
        function HousingExpensesViewModel(housingExpenses, getPropertyList, getCosts, loanType, getPledgedAssets, subjectProperty) {
            var _this = this;
            _super.call(this);
            this.getPropertyList = getPropertyList;
            this.getCosts = getCosts;
            this.loanType = loanType;
            this.getPledgedAssets = getPledgedAssets;
            this.subjectProperty = subjectProperty;
            this.getPropertyExpenses = function () {
                if (!_this.getPropertyList)
                    return;
                var properties = _this.getPropertyList();
                var property;
                if (properties && properties.length > 0) {
                    var primaryResidences = properties.filter(function (p) { return (p.occupancyType == 1 /* PrimaryResidence */ || p.addressTypeId == 1); });
                    if (_this.loanType == 1 /* Purchase */) {
                        property = primaryResidences.filter(function (p) { return !p.isSubjectProperty; })[0];
                        if (property)
                            return property.propertyExpenses;
                        property = primaryResidences.filter(function (p) { return p.addressTypeId == 1; })[0];
                        if (property)
                            return property.propertyExpenses;
                    }
                }
                return _this.subjectProperty.propertyExpenses;
            };
            this.getPropertyExpensesForProperty = function (properties) {
                if (properties && properties.length > 0) {
                    var property;
                    var primaryResidences = properties.filter(function (p) { return (p.occupancyType == String(1 /* PrimaryResidence */) || p.addressTypeId == 1); });
                    if (_this.loanType == 1 /* Purchase */) {
                        property = primaryResidences.filter(function (p) { return !p.isSubjectProperty; })[0];
                        if (property)
                            return property.propertyExpenses;
                        property = primaryResidences.filter(function (p) { return p.addressTypeId == 1; })[0];
                        if (property)
                            return property.propertyExpenses;
                    }
                    return properties[0].propertyExpenses;
                }
                else {
                    return null;
                }
            };
            this.getCost = function (hudLineNumber) {
                if (_this.getCosts) {
                    var costs = _this.getCosts();
                    var cost;
                    if (costs.length > 0) {
                        var filteredCosts = costs.filter(function (c) { return c["hudLineNumber"] == hudLineNumber; });
                        if (filteredCosts && filteredCosts.length > 0)
                            cost = filteredCosts[0];
                    }
                }
                return cost ? cost : new srv.cls.CostViewModel();
            };
            this.getTax = function () {
                return _this.getCost(1004);
            };
            this.getHoi = function () {
                return _this.getCost(1002);
            };
            this.getMi = function () {
                return _this.getCost(1003);
            };
            this.getFlood = function () {
                return _this.getCost(1006);
            };
            this.isExpenseImpounded = function (expenses, propertyExpenseType) {
                if (!expenses)
                    return false;
                var filteredExpenses = expenses.filter(function (i) { return i.type == String(propertyExpenseType); });
                if (filteredExpenses && filteredExpenses.length > 0) {
                    var expense = filteredExpenses[0];
                    return expense.impounded && expense.monthlyAmount > 0;
                }
                return false;
            };
            if (housingExpenses)
                common.objects.automap(this, housingExpenses);
        }
        Object.defineProperty(HousingExpensesViewModel.prototype, "newTotalHousingExpenses", {
            get: function () {
                return this.newMonthlyPayment;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HousingExpensesViewModel.prototype, "currentMonthlyPayment", {
            get: function () {
                return Number(this.floodInsurance) + Number(this.taxes) + Number(this.firstMtgPi) + Number(this.rent) + Number(this.mtgInsurance) + Number(this.hoa) + Number(this.hazardInsurance) + Number(this.secondMtgPi);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HousingExpensesViewModel.prototype, "newMonthlyPayment", {
            get: function () {
                return Number(this.newFloodInsurance) + Number(this.newTaxes) + Number(this.newFirstMtgPi) + Number(this.newMtgInsurance) + Number(this.newHoa) + Number(this.newHazardInsurance) + Number(this.newSecondMtgPi);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HousingExpensesViewModel.prototype, "totalHousingExpenses", {
            get: function () {
                return this.currentMonthlyPayment;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HousingExpensesViewModel.prototype, "floodInsuranceImpounded", {
            get: function () {
                return this.isPropertyExpenseImpounded(5 /* FloodInsurance */);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HousingExpensesViewModel.prototype, "newFloodInsuranceImpounded", {
            get: function () {
                return this.getFlood().impounded;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HousingExpensesViewModel.prototype, "newHazardInsuranceImpounded", {
            get: function () {
                return this.getHoi().impounded;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HousingExpensesViewModel.prototype, "hazardInsuranceImpounded", {
            get: function () {
                return this.isPropertyExpenseImpounded(2 /* HOI */);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HousingExpensesViewModel.prototype, "hoaImpounded", {
            get: function () {
                return this.isPropertyExpenseImpounded(4 /* HOA */);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HousingExpensesViewModel.prototype, "newHoaImpounded", {
            get: function () {
                return false;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HousingExpensesViewModel.prototype, "mtgInsuranceImpounded", {
            get: function () {
                return this.isPropertyExpenseImpounded(3 /* PMI */);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HousingExpensesViewModel.prototype, "newMtgInsuranceImpounded", {
            get: function () {
                return this.getMi().impounded;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HousingExpensesViewModel.prototype, "taxesImpounded", {
            get: function () {
                return this.isPropertyExpenseImpounded(1 /* Tax */);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HousingExpensesViewModel.prototype, "newTaxesImpounded", {
            get: function () {
                return this.getTax().impounded;
            },
            enumerable: true,
            configurable: true
        });
        HousingExpensesViewModel.prototype.isPropertyExpenseImpounded = function (propertyExpenseType) {
            return this.isExpenseImpounded(this.getPropertyExpenses(), propertyExpenseType);
        };
        Object.defineProperty(HousingExpensesViewModel.prototype, "totalImpounds", {
            get: function () {
                return (this.getHoi().impounded ? Number(this.newHazardInsurance) : 0) + (this.getTax().impounded ? Number(this.newTaxes) : 0) + (this.getMi().impounded ? Number(this.newMtgInsurance) : 0) + (this.getFlood().impounded ? Number(this.newFloodInsurance) : 0);
            },
            enumerable: true,
            configurable: true
        });
        return HousingExpensesViewModel;
    })(srv.cls.HousingExpensesViewModel);
    cls.HousingExpensesViewModel = HousingExpensesViewModel;
})(cls || (cls = {}));
//# sourceMappingURL=housingExpenses.extendedViewModel.js.map