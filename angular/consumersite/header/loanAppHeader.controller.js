/// <reference path="../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../Scripts/typings/underscore/underscore.d.ts" />
var consumersite;
(function (consumersite) {
    var LoanAppHeaderController = (function () {
        function LoanAppHeaderController(navigationService, loan) {
            this.navigationService = navigationService;
            this.loan = loan;
            //properties
            this.isMobileMenuOpen = false;
        }
        LoanAppHeaderController.prototype.getProgress = function () {
            var percent = this.navigationService.getProgressPercent();
            return percent;
        };
        LoanAppHeaderController.prototype.getProgressRounded = function () {
            var percent = Math.round(this.navigationService.getProgressPercent() * 100);
            return percent;
        };
        Object.defineProperty(LoanAppHeaderController.prototype, "loanAmount", {
            get: function () {
                if (this.loan.loanAmount != null)
                    return this.loan.loanAmount;
                else
                    return 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LoanAppHeaderController.prototype, "loanRate", {
            get: function () {
                if (this.loan.pricingProduct != null)
                    return this.loan.pricingProduct.Rate;
                else
                    return "0";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LoanAppHeaderController.prototype, "monthlyPayment", {
            get: function () {
                if (this.loan.pricingProduct != null)
                    return this.loan.pricingProduct.MonthlyPayment;
                else
                    return "0";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LoanAppHeaderController.prototype, "cashOutAmount", {
            get: function () {
                return this.loan.cashOutAmount;
            },
            enumerable: true,
            configurable: true
        });
        //Click Events
        LoanAppHeaderController.prototype.toggleMobileMenu = function () {
            this.isMobileMenuOpen = !this.isMobileMenuOpen;
        };
        LoanAppHeaderController.className = "loanAppHeaderController";
        LoanAppHeaderController.$inject = ['navigationService', 'loan'];
        return LoanAppHeaderController;
    })();
    consumersite.LoanAppHeaderController = LoanAppHeaderController;
    moduleRegistration.registerController(consumersite.moduleName, LoanAppHeaderController);
})(consumersite || (consumersite = {}));
//# sourceMappingURL=loanAppHeader.controller.js.map