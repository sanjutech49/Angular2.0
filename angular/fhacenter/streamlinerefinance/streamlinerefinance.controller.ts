/// <reference path="../fhacenter.service.ts" />
module fha.controller {
    class StreamlineRefinanceController {
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

        /*
         * @desc: Rule function for impDatePicker directive
        */
        ruleFunctionEndorsementDate = (input: any) => {
            return false;
        }

        /*
         * @desc: Check occupancy type needed for UnpaidBalance field tooltip
        */
        isPrimaryResidence = () => {
            return this.wrappedLoan.ref.primary.occupancyType == srv.PropertyUsageTypeEnum.PrimaryResidence;
        }
    }
    angular.module('fhaCenter').controller('streamlineRefinanceController', StreamlineRefinanceController);
}