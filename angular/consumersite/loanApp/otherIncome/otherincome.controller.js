/// <reference path="../../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../../Scripts/typings/underscore/underscore.d.ts" />
var consumersite;
(function (consumersite) {
    var OtherIncomeController = (function () {
        function OtherIncomeController(loan, loanAppPageContext, applicationData) {
            var _this = this;
            this.loan = loan;
            this.loanAppPageContext = loanAppPageContext;
            this.applicationData = applicationData;
            this.addOtherIncome = function () {
                _this.otherIncomeActive = _this.loan.loanApp.addOtherIncome();
            };
            this.populateOwnerTypeLookup = function () {
                _this.ownerTypeLookup = [];
                _this.ownerTypeLookup.push({ value: 1 /* Borrower */, text: _this.loan.loanApp.borrower.fullName });
                if (_this.loan.loanApp.hasCoBorrower) {
                    _this.ownerTypeLookup.push({ value: 2 /* CoBorrower */, text: _this.loan.loanApp.coBorrower.fullName });
                }
                _this.ownerTypeLookup.push({ value: 3 /* Joint */, text: "Joint" });
            };
            this.getOwnerTypeLookups = function () {
                return _this.ownerTypeLookup;
            };
            this.populateOwnerTypeLookup();
            //Other Income array is empty, add one for the user to begin the page.
            if (this.loan.loanApp.otherIncomes.length == 0) {
                this.addOtherIncome();
            }
            else {
                this.otherIncomeActive = this.loan.loanApp.otherIncomes[this.loan.loanApp.otherIncomes.length - 1];
            }
            //Scroll so just the loanAppNavbarIsVisible
            loanAppPageContext.scrollToTop();
        }
        OtherIncomeController.className = "otherIncomeController";
        OtherIncomeController.$inject = ['loan', 'loanAppPageContext', 'applicationData'];
        return OtherIncomeController;
    })();
    consumersite.OtherIncomeController = OtherIncomeController;
    moduleRegistration.registerController(consumersite.moduleName, OtherIncomeController);
})(consumersite || (consumersite = {}));
//# sourceMappingURL=otherincome.controller.js.map