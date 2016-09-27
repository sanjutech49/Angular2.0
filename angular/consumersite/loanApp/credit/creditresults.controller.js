/// <reference path="../../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../../Scripts/typings/underscore/underscore.d.ts" />
var consumersite;
(function (consumersite) {
    var CreditResultsController = (function () {
        function CreditResultsController(loan, loanAppPageContext, applicationData) {
            var _this = this;
            this.loan = loan;
            this.loanAppPageContext = loanAppPageContext;
            this.applicationData = applicationData;
            this.controllerAsName = "creditResultsCntrl";
            this.checkLienPosition = function (liability) {
                if (!liability.lienPosition || liability.lienPosition == 0)
                    return;
                angular.forEach(_this.borrowerLiens, function (value, key) {
                    if (value.liabilityInfoId !== liability.liabilityInfoId && value.lienPosition === liability.lienPosition)
                        liability.lienPosition = 0;
                });
            };
            this._borrower = this.loan.loanApp.borrower;
            this._isPropertyFreeAndClear = false;
            //this.subjectProperty.propertyTaxExpense.monthlyAmount
            //Scroll so just the loanAppNavbarIsVisible
            loanAppPageContext.scrollToTop();
        }
        Object.defineProperty(CreditResultsController.prototype, "isCreditDataAvailable", {
            get: function () {
                return (!!this.loan.loanApp.borrower.ficoScore && (this.loan.loanApp.borrower.ficoScore.equifax > 0 || this.loan.loanApp.borrower.ficoScore.experian > 0 || this.loan.loanApp.borrower.ficoScore.transunion > 0));
            },
            set: function (isCreditDataAvailable) {
                /*Read-Only*/
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CreditResultsController.prototype, "subjectProperty", {
            get: function () {
                return this.loan.getLoan().getSubjectProperty();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CreditResultsController.prototype, "sortOrder", {
            get: function () {
                return "-amount";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CreditResultsController.prototype, "borrowerLiens", {
            get: function () {
                //
                //Mock data
                //if (!this._pledgedLiabilities || this._pledgedLiabilities.length == 0) {
                //    this._pledgedLiabilities = this.getMockLiabilityViewModels();
                //}
                return this.loan.loanApp.borrower.reos;
            },
            set: function (borrowerLiens) {
                /*Read Only*/
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CreditResultsController.prototype, "isPropertyFreeAndClear", {
            get: function () {
                if (!this.loan.isCreditInitiated)
                    return false;
                else if (this.loan.isCreditSuccessful)
                    return !(lib.findFirst(this.borrowerLiens, function (b) { return b.isAllocatedSubjProp; }));
                else if (this.isCreditDataAvailable) {
                    if (this.borrowerLiens.length == 0) {
                        return true;
                    }
                }
                else
                    return false;
            },
            set: function (value) {
                if (value && !!this.isCreditDataAvailable) {
                    angular.forEach(this.borrowerLiens, function (value, key) {
                        if (!!value.propertyId) {
                            value.lienPosition = null;
                            value.propertyId = null;
                        }
                    });
                }
            },
            enumerable: true,
            configurable: true
        });
        CreditResultsController.prototype.getMockLiabilityViewModels = function () {
            var liabilityViewModels = new Array();
            var newLiabilityViewModel = new srv.cls.LiabilityViewModel();
            newLiabilityViewModel.identityKey = "1";
            newLiabilityViewModel.liabilityInfoId = "1";
            newLiabilityViewModel.amount = 10000;
            newLiabilityViewModel.calculatedMonthlyAmount = 100;
            newLiabilityViewModel.accountNumber = 'ABC123';
            newLiabilityViewModel.payoffLender = 'Big Bank';
            newLiabilityViewModel.propertyId = null;
            newLiabilityViewModel["subjectPropertyId"] = 'Property1';
            liabilityViewModels.push(newLiabilityViewModel);
            newLiabilityViewModel = new srv.cls.LiabilityViewModel();
            newLiabilityViewModel.identityKey = "2";
            newLiabilityViewModel.liabilityInfoId = "2";
            newLiabilityViewModel.amount = 20000;
            newLiabilityViewModel.calculatedMonthlyAmount = 200;
            newLiabilityViewModel.accountNumber = 'DEF456';
            newLiabilityViewModel.payoffLender = 'Really Big Bank';
            newLiabilityViewModel.propertyId = null;
            newLiabilityViewModel["subjectPropertyId"] = 'Property1';
            liabilityViewModels.push(newLiabilityViewModel);
            newLiabilityViewModel = new srv.cls.LiabilityViewModel();
            newLiabilityViewModel.identityKey = "3";
            newLiabilityViewModel.liabilityInfoId = "3";
            newLiabilityViewModel.amount = 30000;
            newLiabilityViewModel.calculatedMonthlyAmount = 300;
            newLiabilityViewModel.accountNumber = 'GHI789';
            newLiabilityViewModel.payoffLender = 'Super Big Bank';
            newLiabilityViewModel.propertyId = null;
            newLiabilityViewModel["subjectPropertyId"] = 'Property1';
            liabilityViewModels.push(newLiabilityViewModel);
            return liabilityViewModels;
        };
        CreditResultsController.className = "creditResultsController";
        CreditResultsController.$inject = ['loan', 'loanAppPageContext', 'applicationData'];
        return CreditResultsController;
    })();
    consumersite.CreditResultsController = CreditResultsController;
    moduleRegistration.registerController(consumersite.moduleName, CreditResultsController);
})(consumersite || (consumersite = {}));
//# sourceMappingURL=creditresults.controller.js.map