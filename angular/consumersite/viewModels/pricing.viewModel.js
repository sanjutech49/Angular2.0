var consumersite;
(function (consumersite) {
    var vm;
    (function (vm) {
        var PricingRowViewModel = (function () {
            function PricingRowViewModel() {
                this.productId = "";
                this.LoanAmortizationTerm = "";
                this.AmortizationType = "";
                this.AdjustmentPeriod = "";
                this.TitleYears = "";
                this.Rate = "";
                this.APR = "";
                this.MonthlyPayment = "";
                this.TotalCost = "";
                this.LoanOptionType = "";
                this.compare = false; //ui
            }
            Object.defineProperty(PricingRowViewModel.prototype, "isLowCost", {
                get: function () {
                    return this.LoanOptionType == "3" || this.LoanOptionType == "13" || this.LoanOptionType == "14";
                    //LowUpfrontCost = 3,
                    //LowUpfrontCostTopPick = 13,
                    //LowUpfrontCostAlternativeTopPick = 14,
                },
                set: function (value) {
                    //readonly
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PricingRowViewModel.prototype, "isTopPick", {
                get: function () {
                    return this.LoanOptionType == "10" || this.LoanOptionType == "11" || this.LoanOptionType == "13" || this.LoanOptionType == "14" || this.LoanOptionType == "14" || this.LoanOptionType == "9" || this.LoanOptionType == "15" || this.LoanOptionType == "19";
                    //LowRateArmsTopPick = 10,
                    //LowFixedRateTopPick = 11,
                    //LowUpfrontCostTopPick = 13
                    //LowUpfrontCostAlternativeTopPick = 14
                    //   PayoffHomeQuicklyTopPick = 9,
                    //  PayoffHomeQuicklyLowerCostTopPick = 15,
                    //   PayoffHomeQuicklyNoCostTopPick = 16,
                },
                set: function (value) {
                    //readonly
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PricingRowViewModel.prototype, "isLowRateARM", {
                get: function () {
                    return (this.LoanOptionType == "6" || this.LoanOptionType == "10");
                    //LowRateArms = 6,
                    //LowRateArmsTopPick = 10,
                },
                set: function (value) {
                    //readonly
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PricingRowViewModel.prototype, "isPayoffQuickly", {
                get: function () {
                    return (this.LoanOptionType == "5" || this.LoanOptionType == "9" || this.LoanOptionType == "15" || this.LoanOptionType == "16");
                    //PayoffHomeQuickly = 5,
                    //   PayoffHomeQuicklyTopPick = 9,
                    //  PayoffHomeQuicklyLowerCostTopPick = 15,
                    //   PayoffHomeQuicklyNoCostTopPick = 16,
                },
                set: function (value) {
                    //readonly
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PricingRowViewModel.prototype, "isLowFixed", {
                get: function () {
                    return (this.LoanOptionType == "1" || this.LoanOptionType == "11");
                    //LowFixedRates = 1,
                    //LowFixedRateTopPick = 11,
                },
                set: function (value) {
                    //readonly
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PricingRowViewModel.prototype, "isNoCost", {
                get: function () {
                    return (this.LoanOptionType == "2" || this.LoanOptionType == "8");
                    //NoCost = 2,
                    //NoCostTopPick = 8,
                },
                set: function (value) {
                    //readonly
                },
                enumerable: true,
                configurable: true
            });
            return PricingRowViewModel;
        })();
        vm.PricingRowViewModel = PricingRowViewModel;
        var PricingFilterViewModel = (function () {
            function PricingFilterViewModel() {
            }
            return PricingFilterViewModel;
        })();
        vm.PricingFilterViewModel = PricingFilterViewModel;
    })(vm = consumersite.vm || (consumersite.vm = {}));
})(consumersite || (consumersite = {}));
//# sourceMappingURL=pricing.viewModel.js.map