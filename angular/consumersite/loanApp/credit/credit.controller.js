/// <reference path="../../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../../Scripts/typings/underscore/underscore.d.ts" />
var consumersite;
(function (consumersite) {
    var CreditController = (function () {
        function CreditController(loan, loanAppPageContext) {
            var _this = this;
            this.loan = loan;
            this.loanAppPageContext = loanAppPageContext;
            this.controllerAsName = "creditCntrl";
            this.printMe = function () {
                console.log(_this._borrower.dateOfBirth);
            };
            this.hasCoBorrower = function () {
                return _this.loan.loanApp.hasCoBorrower;
            };
            this._isBorrower = !this.loanAppPageContext.isCoBorrowerState;
            this._borrower = this.loan.loanApp.borrower;
            this._coBorrower = this.loan.loanApp.coBorrower;
            //Scroll so just the loanAppNavbarIsVisible
            //loanAppPageContext.scrollToTop();
        }
        Object.defineProperty(CreditController.prototype, "BorrowerFullName", {
            get: function () {
                return this._borrower.fullName;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CreditController.prototype, "BorrowerSSN", {
            get: function () {
                return this._borrower.ssn;
            },
            set: function (value) {
                this._borrower.ssn = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CreditController.prototype, "SSNValidation", {
            get: function () {
                if (this._borrower.ssn !== this._coBorrower.ssn)
                    return 'invalid mismatch';
                else
                    return '';
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CreditController.prototype, "BorrowerDOB", {
            get: function () {
                return this._borrower.dateOfBirth;
            },
            set: function (value) {
                this._borrower.dateOfBirth = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CreditController.prototype, "Borrower", {
            get: function () {
                return this._borrower;
            },
            set: function (value) {
                this._borrower = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CreditController.prototype, "CoBorrowerFullName", {
            get: function () {
                return this._coBorrower.fullName;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CreditController.prototype, "CoBorrowerSSN", {
            get: function () {
                return this._coBorrower.ssn;
            },
            set: function (value) {
                this._coBorrower.ssn = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CreditController.prototype, "CoBorrowerDOB", {
            get: function () {
                return this._coBorrower.dateOfBirth;
            },
            set: function (value) {
                this._coBorrower.dateOfBirth = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CreditController.prototype, "CoBorrower", {
            get: function () {
                return this._coBorrower;
            },
            set: function (value) {
                this._coBorrower = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CreditController.prototype, "AuthorizeCreditReport", {
            get: function () {
                return this._authorizeCreditReport;
            },
            set: function (value) {
                this._authorizeCreditReport = value;
            },
            enumerable: true,
            configurable: true
        });
        CreditController.className = "creditController";
        CreditController.$inject = ['loan', 'loanAppPageContext'];
        return CreditController;
    })();
    consumersite.CreditController = CreditController;
    moduleRegistration.registerController(consumersite.moduleName, CreditController);
})(consumersite || (consumersite = {}));
//# sourceMappingURL=credit.controller.js.map