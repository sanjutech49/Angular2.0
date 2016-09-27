/// <reference path="../fhacenter.service.ts" />
module fha.controller {
    class CashOutController {
        static $inject = ['wrappedLoan', 'fhaCenterService', 'commonModalWindowFactory', 'modalWindowType'];

        constructor(private wrappedLoan: lib.referenceWrapper<srv.ILoanViewModel>, private fhaCenterService: fha.service.IFHACenterService, private commonModalWindowFactory, private modalWindowType) {
            this.calculateFHAFields();
        }

        /*
         * @desc: Perform calculation of FHA fields
        */
        calculateFHAFields = (): void => {
            var self = this;

            this.fhaCenterService.calculateFHA(this.wrappedLoan.ref.fhaScenarioViewModel, this.wrappedLoan.ref.fhaCountyLoanLimit, this.wrappedLoan.ref.loanAmount).$promise.then((data) => {
                self.wrappedLoan.ref.fhaScenarioViewModel.fhaCalculatorResults = data.response;
                self.wrappedLoan.ref.updateGovermentEligibility(srv.MortgageTypeEnum.FHA, data.response.isEligible);
            },
                (error) => {
                    self.commonModalWindowFactory.open({ type: self.modalWindowType.error, message: "We couldn't calculate FHA fields at the moment. Please try again" });

                });
        }

        isAppraisedValueDisabled = (): boolean => {
            return this.fhaCenterService.isAppraisedValueValid(this.wrappedLoan.ref.getSubjectProperty().appraisedValue);
        }
    }
    angular.module('fhaCenter').controller('cashOutController', CashOutController);
} 