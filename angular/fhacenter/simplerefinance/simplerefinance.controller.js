/// <reference path="../fhacenter.service.ts" />
var fha;
(function (fha) {
    var controller;
    (function (controller) {
        var SimpleRefinanceController = (function () {
            function SimpleRefinanceController(wrappedLoan, fhaCenterService, commonModalWindowFactory, modalWindowType) {
                var _this = this;
                this.wrappedLoan = wrappedLoan;
                this.fhaCenterService = fhaCenterService;
                this.commonModalWindowFactory = commonModalWindowFactory;
                this.modalWindowType = modalWindowType;
                /*
                 * @desc: Returns correct text to be displayed based on rules.
                */
                this.getLabelText = function () {
                    return _this.fhaCenterService.getLabelText('false', 0, String(_this.wrappedLoan.ref.fhaScenarioViewModel.propertyPurchasedInLast12Months));
                };
                /*
                 * @desc: Perform calculation of FHA fields
                */
                this.calculateFHAFields = function () {
                    var self = _this;
                    _this.fhaCenterService.calculateFHA(_this.wrappedLoan.ref.fhaScenarioViewModel, _this.wrappedLoan.ref.fhaCountyLoanLimit, _this.wrappedLoan.ref.loanAmount).$promise.then(function (data) {
                        self.wrappedLoan.ref.fhaScenarioViewModel.fhaCalculatorResults = data.response;
                        self.wrappedLoan.ref.updateGovermentEligibility(1 /* FHA */, data.response.isEligible);
                    }, function (error) {
                        self.commonModalWindowFactory.open({ type: self.modalWindowType.error, message: "We couldn't calculate FHA fields at the moment. Please try again" });
                    });
                };
                /*
                 * @desc: Rule function for impDatePicker directive
                */
                this.ruleFunctionEndorsementDate = function (input) {
                    return false;
                };
                this.isAppraisedValueDisabled = function () {
                    return _this.fhaCenterService.isAppraisedValueValid(_this.wrappedLoan.ref.getSubjectProperty().appraisedValue);
                };
                this.calculateFHAFields();
            }
            SimpleRefinanceController.$inject = ['wrappedLoan', 'fhaCenterService', 'commonModalWindowFactory', 'modalWindowType'];
            return SimpleRefinanceController;
        })();
        angular.module('fhaCenter').controller('simpleRefinanceController', SimpleRefinanceController);
    })(controller = fha.controller || (fha.controller = {}));
})(fha || (fha = {}));
//# sourceMappingURL=simplerefinance.controller.js.map