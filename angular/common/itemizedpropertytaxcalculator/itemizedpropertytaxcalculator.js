var loanCenter;
(function (loanCenter) {
    'use strict';
    var itemizedPropertyTaxCalculatorController = (function () {
        function itemizedPropertyTaxCalculatorController(paymentPeriodMonths, costDetailsSvc) {
            var _this = this;
            this.paymentPeriodMonths = paymentPeriodMonths;
            this.costDetailsSvc = costDetailsSvc;
            this.basePred = function (itemizedPropertyTax) { return itemizedPropertyTax.amount != null; };
            this.recalculateAmount = function (model) {
                model.amountForYear = lib.summate(model.itemizedPropertyTaxes, function (l) { return _this.basePred(l); }, function (l) { return l.amount; });
                model.amountPerMonth = model.amountForYear / 12;
            };
            this.paymentPeriodMonths = paymentPeriodMonths;
            this.costDetailsSvc = costDetailsSvc;
        }
        itemizedPropertyTaxCalculatorController.prototype.initialize = function (model) {
            if (model.itemizedPropertyTaxes.length == 0) {
                this.costDetailsSvc.initializeItemizedPropertyTaxes.query({ costId: model.costId }).$promise.then(function (data) {
                    model.itemizedPropertyTaxes = angular.copy(data);
                }, function (error) {
                    console.log(error);
                });
            }
            this.recalculateAmount(model);
        };
        itemizedPropertyTaxCalculatorController.className = 'itemizedPropertyTaxCalculatorController';
        itemizedPropertyTaxCalculatorController.$inject = ['paymentPeriodMonths', 'costDetailsSvc'];
        return itemizedPropertyTaxCalculatorController;
    })();
    loanCenter.itemizedPropertyTaxCalculatorController = itemizedPropertyTaxCalculatorController;
    angular.module('loanCenter').controller('itemizedPropertyTaxCalculatorController', itemizedPropertyTaxCalculatorController);
})(loanCenter || (loanCenter = {}));
//# sourceMappingURL=itemizedpropertytaxcalculator.js.map