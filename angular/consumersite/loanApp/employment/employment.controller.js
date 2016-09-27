/// <reference path="../../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../../Scripts/typings/underscore/underscore.d.ts" />
var consumersite;
(function (consumersite) {
    var EmploymentController = (function () {
        function EmploymentController(loan, loanAppPageContext, applicationData, navigationService) {
            var _this = this;
            this.loan = loan;
            this.loanAppPageContext = loanAppPageContext;
            this.applicationData = applicationData;
            this.navigationService = navigationService;
            this.isPreviousEmploymentRequired = function (startDate) {
                if (_this.isCurrentEmployer && _this.borrower.employments.length == 1) {
                    var today = moment(new Date());
                    var yearsEmployed = today.diff(moment(startDate), 'years');
                    return yearsEmployed < 2;
                }
                return false;
            };
            this.addEmployment = function () {
                _this.addEmploymentImpl(!_this.isCurrentEmployer, true);
            };
            this.addEmploymentImpl = function (isPrevious, isAdditional) {
                var edx = _this.borrower.addEmployment(isPrevious, isAdditional);
                _this.employmentActive = _this.borrower.employments[edx - 1];
            };
            this.isSalaryOrSelfEmployed = function () {
                return true;
                //return (this.employmentType == srv.EmploymentTypeEnum.SalariedEmployee) || (this.employmentType == srv.EmploymentTypeEnum.SelfEmployed);
            };
            this.isActiveMilitaryDuty = function () {
                return _this.employmentType == 0 /* ActiveMilitaryDuty */;
            };
            this.isRetired = function () {
                return _this.employmentType == 3 /* Retired */;
            };
            this.isOtherOrUnemployed = function () {
                return _this.employmentType == 4 /* OtherOrUnemployed */;
            };
            this.isBorrower = !this.loanAppPageContext.isCoBorrowerState;
            this.borrower = !this.isBorrower ? this.loan.loanApp.coBorrower : this.loan.loanApp.borrower;
            this.isCurrentEmployer = loanAppPageContext.loanAppNavigationState == 6 /* borrowerEmployment */ || loanAppPageContext.loanAppNavigationState == 8 /* coBorrowerEmployment */;
            if (this.borrower.employments.length == 0 || !this.isCurrentEmployer) {
                this.addEmploymentImpl(!this.isCurrentEmployer, false);
            }
            else {
                this.employmentActive = this.borrower.employments[this.borrower.employments.length - 1];
            }
            if (!this.employmentType) {
                this.employmentType = 1 /* SalariedEmployee */;
            }
            //Scroll so just the loanAppNavbarIsVisible
            loanAppPageContext.scrollToTop();
        }
        Object.defineProperty(EmploymentController.prototype, "employmentType", {
            get: function () {
                return this.employmentActive.employmentType;
            },
            set: function (employmentType) {
                this.employmentActive.employmentType = employmentType;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EmploymentController.prototype, "currentStartingDate", {
            get: function () {
                return this.employmentActive.startingDate;
            },
            set: function (startDate) {
                this.borrower.needPreviousEmployment = this.isPreviousEmploymentRequired(startDate);
                this.employmentActive.startingDate = startDate;
            },
            enumerable: true,
            configurable: true
        });
        EmploymentController.className = "employmentController";
        EmploymentController.$inject = ['loan', 'loanAppPageContext', 'applicationData', 'navigationService'];
        return EmploymentController;
    })();
    consumersite.EmploymentController = EmploymentController;
    moduleRegistration.registerController(consumersite.moduleName, EmploymentController);
})(consumersite || (consumersite = {}));
//# sourceMappingURL=employment.controller.js.map