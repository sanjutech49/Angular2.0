var impoundCalculator;
(function (impoundCalculator) {
    'use-strict';
    var ImpoundCalculatorHelpersSvc = (function () {
        function ImpoundCalculatorHelpersSvc() {
            this.findImpoundScheduleByStateAndClosingMonth = function (impoundSchedules, state, closingMonth) {
                return lib.findFirst(impoundSchedules, function (item) { return item.state == state && item.month == closingMonth; }, null);
            };
            this.createMiRequestModel = function (loanVm) {
                var refinancePurposeType = 1;
                if (loanVm.financialInfo.cashOut == "0") {
                    refinancePurposeType = 2;
                }
                var subjectProperty = loanVm.getSubjectProperty();
                var miRequest = new srv.cls.MICalculatorRequest();
                miRequest.amortizationType = loanVm.financialInfo.amortizationType;
                miRequest.loanAmount = loanVm.loanAmount;
                miRequest.mortgageType = loanVm.financialInfo.mortgageType;
                miRequest.term = loanVm.financialInfo.term;
                miRequest.rate = loanVm.financialInfo.baseInterestRate;
                ;
                miRequest.fixedRateTerm = loanVm.financialInfo.fixedRateTerm;
                miRequest.mortgageInsuranceType = loanVm.financialInfo.mortgageInsuranceType;
                miRequest.fico = loanVm.financialInfo.ficoScore;
                miRequest.state = subjectProperty.stateName, miRequest.currentEstimatedValue = subjectProperty.currentEstimatedValue;
                miRequest.purchasePrice = subjectProperty.purchasePrice;
                miRequest.loanPurposeType = loanVm.loanPurposeType;
                miRequest.refinancePurposeType = refinancePurposeType;
                miRequest.occupancyType = subjectProperty.occupancyType;
                return miRequest;
            };
        }
        ImpoundCalculatorHelpersSvc.$inject = [];
        ImpoundCalculatorHelpersSvc.className = 'ImpoundCalculatorHelpersSvc';
        return ImpoundCalculatorHelpersSvc;
    })();
    impoundCalculator.ImpoundCalculatorHelpersSvc = ImpoundCalculatorHelpersSvc;
    angular.module('impoundCalculator').service(ImpoundCalculatorHelpersSvc.className, ImpoundCalculatorHelpersSvc);
})(impoundCalculator || (impoundCalculator = {}));
//# sourceMappingURL=impoundcalculator.helpers.service.js.map