/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/ui-router/angular-ui-router.d.ts" />
/// <reference path="../vacenter.service.ts" />
var va;
(function (va) {
    var controller;
    (function (controller) {
        var GeneralInformationController = (function () {
            function GeneralInformationController(wrappedLoan, loanScenarioService, applicationData) {
                var _this = this;
                this.wrappedLoan = wrappedLoan;
                this.loanScenarioService = loanScenarioService;
                this.applicationData = applicationData;
                /*
                 * @desc: Event handler for Subject Property Checkbox change
                */
                this.onCurrentLoanOnSubjectPropertyChange = function () {
                    _this.loanScenarioService.currentLoanOnSubjectPropertyChange(_this.wrappedLoan.ref.vaInformation);
                };
                /*
                 * @desc: Event handler for VA used in the past Checkbox change
                */
                this.onIsVaUsedInPastChange = function () {
                    _this.loanScenarioService.isVaUsedInPastChange(_this.wrappedLoan.ref.vaInformation);
                };
                /*
                 * @desc: Gets list of borrowers to be used in drop down
                */
                this.getListOfBorrowers = function () {
                    _this.listOfBorrowers = [];
                    lib.forEach(_this.wrappedLoan.ref.getLoanApplications(), function (item) {
                        _this.listOfBorrowers.push(item.getBorrower());
                        if (item.isSpouseOnTheLoan)
                            _this.listOfBorrowers.push(item.getCoBorrower());
                    });
                };
                this.getListOfBorrowers();
                if (!this.wrappedLoan.ref.vaInformation.veteranInformationForId)
                    this.wrappedLoan.ref.vaInformation.veteranInformationForId = wrappedLoan.ref.primary.getBorrower().borrowerId;
            }
            Object.defineProperty(GeneralInformationController.prototype, "isPurchase", {
                /*
                 *@desc Checks if current loan is purchase loan
                */
                get: function () {
                    return this.wrappedLoan.ref.loanPurposeType == 1 /* Purchase */;
                },
                enumerable: true,
                configurable: true
            });
            GeneralInformationController.$inject = ['wrappedLoan', 'loanScenarioSvc', 'applicationData'];
            return GeneralInformationController;
        })();
        angular.module('vaCenter').controller('generalInformationController', GeneralInformationController);
    })(controller = va.controller || (va.controller = {}));
})(va || (va = {}));
//# sourceMappingURL=generalinformation.controller.js.map