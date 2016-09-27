module va.controller {
    class IRRLMaxController {
        static $inject = ['wrappedLoan', 'vaCenterService', 'commonModalWindowFactory', 'modalWindowType']

        constructor(public wrappedLoan: lib.referenceWrapper<srv.ILoanViewModel>, private vaCenterService: va.service.IVACenterService, private commonModalWindowFactory, private modalWindowType) {
            this.calculateVAFields();
        }

        calculateVAFields = (): void => {
            var self = this;

            this.vaCenterService.calculateVA(this.wrappedLoan.ref.getSubjectProperty().firstMortgageAmount, this.wrappedLoan.ref.vaInformation.costOfImprovements,
                this.wrappedLoan.ref.vaInformation.cashPaymentFromVeteran, this.wrappedLoan.ref.financialInfo.discountPoints,
                this.vaCenterService.getVAFundingFee()).$promise.then((data) => {
                self.vaCenterService.calculatorResponse = data.response;
            },
                (error) => {
                    self.commonModalWindowFactory.open({ type: self.modalWindowType.error, message: "We couldn't calculate IRRL VA fields at the moment. Please try again" });

                });
        }

        showDicountPoints = (): number => {
            return this.wrappedLoan.ref.financialInfo.discountPoints <= 0 ? 0 : this.wrappedLoan.ref.financialInfo.discountPoints;
        }

    }
    angular.module('vaCenter').controller('irrlMaxController', IRRLMaxController);
}