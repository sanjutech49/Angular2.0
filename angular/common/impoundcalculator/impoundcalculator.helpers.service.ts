module impoundCalculator {
    'use-strict';

    export class ImpoundCalculatorHelpersSvc {

        static $inject = [];
        static className = 'ImpoundCalculatorHelpersSvc';

        constructor() { }

        public findImpoundScheduleByStateAndClosingMonth = (impoundSchedules: Array<srv.IImpoundScheduleViewModel>, state: string,  closingMonth: number): srv.IImpoundScheduleViewModel => {
            return lib.findFirst(impoundSchedules, item => item.state == state && item.month == closingMonth, null);
        }

        public createMiRequestModel = (loanVm: srv.ILoanViewModel): srv.IMICalculatorRequest => {
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
            miRequest.rate = loanVm.financialInfo.baseInterestRate;;
            miRequest.fixedRateTerm = loanVm.financialInfo.fixedRateTerm;
            miRequest.mortgageInsuranceType = loanVm.financialInfo.mortgageInsuranceType;
            miRequest.fico = loanVm.financialInfo.ficoScore;
            miRequest.state = subjectProperty.stateName,
            miRequest.currentEstimatedValue = subjectProperty.currentEstimatedValue;
            miRequest.purchasePrice = subjectProperty.purchasePrice;
            miRequest.loanPurposeType = loanVm.loanPurposeType;
            miRequest.refinancePurposeType = refinancePurposeType;
            miRequest.occupancyType = subjectProperty.occupancyType;
            
            return miRequest;
        }

    }

    angular.module('impoundCalculator').service(ImpoundCalculatorHelpersSvc.className, ImpoundCalculatorHelpersSvc);
} 