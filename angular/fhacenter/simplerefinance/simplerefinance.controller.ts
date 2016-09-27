/// <reference path="../fhacenter.service.ts" />
module fha.controller {
    class SimpleRefinanceController {
        static $inject = ['wrappedLoan', 'fhaCenterService', 'commonModalWindowFactory', 'modalWindowType'];

        constructor(private wrappedLoan: lib.referenceWrapper<srv.ILoanViewModel>, private fhaCenterService: fha.service.IFHACenterService, private commonModalWindowFactory, private modalWindowType) {
            this.calculateFHAFields();
        }

        /*
         * @desc: Returns correct text to be displayed based on rules.
        */
        getLabelText = (): string => {
            return this.fhaCenterService.getLabelText('false', 0, String(this.wrappedLoan.ref.fhaScenarioViewModel.propertyPurchasedInLast12Months));
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

        isAppraisedValueDisabled = (): boolean => {
            return this.fhaCenterService.isAppraisedValueValid(this.wrappedLoan.ref.getSubjectProperty().appraisedValue);
        }

    }
    angular.module('fhaCenter').controller('simpleRefinanceController', SimpleRefinanceController);
} 