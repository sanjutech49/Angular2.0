/// <reference path="../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../scripts/typings/ui-router/angular-ui-router.d.ts" />
/// <reference path="../complianceease/complianceease.service.ts" />


module ntb.controller {
    'use strict';

    class NTBCenterController {

        static $inject = ['wrappedLoan', '$state', 'NavigationSvc', 'applicationData', 'enums', 'complianceEaseService', 'loanDetailsSvc', 'loanEvent', 'ntbCenterService', '$log'];
        constructor(private wrappedLoan: lib.referenceWrapper<srv.ILoanViewModel>, private $state: angular.ui.IStateService,
            private navigationService: any, public applicationData: any, private enums: any, private complianceEaseService: complianceEase.service.IComplianceEaseService,
            private loanDetailsSvc: any, private loanEvent: any, private ntbCenterService, private $log) {

            navigationService.contextualType = enums.ContextualTypes.NetTangibleBenefit;
            this.callNtbCalculator();
        }

        /**
        * @desc Gets the recoupment period string. Returns "N/A" if recoupment period is invalid.
        */
        getRecoupmentPeriod = (): string => {
            if (this.isRecoupmentPeriodValid()) {
                return String(this.wrappedLoan.ref.recoupmentPeriodCalculated.recoupmentPeriod) + ' months';
            }
            else {
                return "N/A";
            }
        }

        /**
        * @desc Gets the flag indicating whether recoupment period is valid.
        */
        isRecoupmentPeriodValid = (): boolean => {
            return (!common.objects.isNullOrUndefined(this.wrappedLoan.ref.recoupmentPeriodCalculated.recoupmentPeriod)
                && this.wrappedLoan.ref.recoupmentPeriodCalculated.recoupmentPeriod > 0);
        }

        formatDate = (value: string): string => {
            return this.complianceEaseService.formatDate(value, null);
        }

        calculatePaymentAndMI = (payment: number, isNewLoan: boolean): number => {
            return this.loanDetailsSvc.calculatePaymentAndMI(payment, this.getMIAmount(isNewLoan));
        }

        calculateCurrentMonthlyObligations = (): number => {
            return this.ntbCenterService.calculateCurrentMonthlyObligations(this.wrappedLoan); 
        }

        /*
         * @desc: Calls Mega save
        */
        saveChanges = (): void => {
            this.navigationService.SaveAndUpdateWrappedLoan(this.applicationData.currentUserId, this.wrappedLoan);
        }

        /*
         * @desc: Reloads current state
        */
        cancelChanges = (): void => {
            this.navigationService.cancelChanges(this.wrappedLoan.ref.loanId);
        }

        getDataNtbConfiguration = (ntbBenefitEnumId: number, state: string, itemName: string): any => {
            var ntbBenefitConfiguration: any = lib.findFirst(this.applicationData.ntbBenefitConfigurations,(x: any) => x.ntbBenefitEnumId == ntbBenefitEnumId && x.state.indexOf(state) != -1);

            if (ntbBenefitConfiguration != null) {
                return ntbBenefitConfiguration[itemName];
            }

            return null;
        }

        // order by nefit by order property from ntbBenefitConfiguration class
        orderBenefit = (benefit: srv.INtbActivationViewModel): number => {
            var ntbBenefitConfiguration: any = lib.findFirst(this.applicationData.ntbBenefitConfigurations,(x: any) => x.ntbBenefitEnumId == benefit.ntbBenefitEnumId);

            if (ntbBenefitConfiguration != null)
                return ntbBenefitConfiguration.order;

            return 0;
        }

        /*
        * @desc Trigger loan calculator
        */
        triggerLoanCalculator = (): void => {
            this.loanEvent.broadcastPropertyChangedEvent(events.LoanFieldIdentifier.todo);
        }

        private getNtbActivation = (ntbBenefitEnumId: number): srv.INtbActivationViewModel => {
            return lib.findFirst(this.wrappedLoan.ref.ntbBenefitActivations, x => x.ntbBenefitEnumId === ntbBenefitEnumId);
        }

        updateBonaFideCheckbox = (bonaFideId: number) => {
            var bonaFideActivation = this.getNtbActivation(srv.NtbBenefitEnum.CashoutReasonableBonaFiedPersonalNeed);

            if (bonaFideActivation != null) {
                bonaFideActivation.active = bonaFideId == null ? false : true;
                bonaFideActivation.isManual = true;
            }
        }

        /*
        * Trigger NTB Calculator
        */
        callNtbCalculator = () => {
            var self = this;
            this.ntbCenterService.calculateNTB(this.wrappedLoan).$promise.then(
                function (result) {
                    if (result && result.response && result.response.ntbBenefitActivations)
                        self.ntbCenterService.updateLoanNTB(self.wrappedLoan, result.response);
                },
                function (error) {
                    self.$log.error(error);
                });
        }


        /*
        * PRIVATE FUNCTIONS
        */
        private getMIAmount = (isNewLoan: boolean): number => {
            return this.loanDetailsSvc.getMIAmount(isNewLoan, this.getCostsCb, this.wrappedLoan.ref.loanPurposeType,
                this.wrappedLoan.ref.getSubjectProperty().occupancyType, this.wrappedLoan.ref.getSubjectProperty, this.wrappedLoan.ref.primary.getBorrower().getCurrentAddress,
                this.enums.housingExpenses.mortgageInsuranceExpense);
        }

        /*
        * CALLBACKS
        */
        private getCostsCb = (): srv.IList<srv.ICostViewModel> => {
            return this.wrappedLoan.ref.closingCost.costs;
        }

        
    }
    angular.module('ntbCenter').controller('ntbCenterController', NTBCenterController);
}  