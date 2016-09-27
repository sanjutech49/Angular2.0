/// <reference path="../fhacenter.service.ts" />
var fha;
(function (fha) {
    var controller;
    (function (controller) {
        var RateAndTermRefinanceController = (function () {
            function RateAndTermRefinanceController(wrappedLoan, fhaCenterService, commonModalWindowFactory, modalWindowType) {
                var _this = this;
                this.wrappedLoan = wrappedLoan;
                this.fhaCenterService = fhaCenterService;
                this.commonModalWindowFactory = commonModalWindowFactory;
                this.modalWindowType = modalWindowType;
                /*
                 * @desc: Returns correct text to be displayed based on rules.
                */
                this.getLabelText = function () {
                    return _this.fhaCenterService.getLabelText(String(_this.wrappedLoan.ref.fhaScenarioViewModel.propertyOwnedLessThanOneYear), _this.wrappedLoan.ref.fhaScenarioViewModel.propertyOccupiedFor, 'false');
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
                this.isAppraisedValueDisabled = function () {
                    return _this.fhaCenterService.isAppraisedValueValid(_this.wrappedLoan.ref.getSubjectProperty().appraisedValue);
                };
                this.calculateFHAFields();
            }
            RateAndTermRefinanceController.$inject = ['wrappedLoan', 'fhaCenterService', 'commonModalWindowFactory', 'modalWindowType'];
            return RateAndTermRefinanceController;
        })();
        angular.module('fhaCenter').controller('rateAndTermRefinanceController', RateAndTermRefinanceController);
    })(controller = fha.controller || (fha.controller = {}));
})(fha || (fha = {}));
//# sourceMappingURL=rateandtermrefinance.controller.js.map