/// <reference path="../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../scripts/typings/ui-router/angular-ui-router.d.ts" />

module va.service {
    'use strict';

    export interface IVACenterService {
        calculatorResponse: srv.IVACalculatorResponse;
        calculateVA(existingVABalance: number, eehi: number, veteranCashPayment: number, discountPoints: number, vaFundingFee: number): ng.resource.IResource<any>;
        getVAFundingFee(): number;
        colorTheText(value: boolean): string;
        getText(value: boolean): string;
    }

    export class VACenterService implements IVACenterService {

        static $inject = ['$resource', 'apiRoot', '$state', 'costDetailsSvc', 'costDetailsHelpers', 'commonModalWindowFactory', 'modalWindowType', '$modalStack'];
        static className = 'vaCenterService';
        calculatorResponse: srv.IVACalculatorResponse;

        constructor(private $resource: angular.resource.IResourceService, private apiRoot: string, private $state: ng.ui.IStateService, private costDetailsSvc, private costDetailsHelpers, private commonModalWindowFactory, private modalWindowType, private $modalStack) {
            this.apiRoot = apiRoot + 'VaCalculator';
        }

        /*
        * @desc: Call REST service for VA calculations
       */
        calculateVA = (existingVABalance: number, eehi:number, veteranCashPayment: number, discountPoints:number, vaFundingFee: number): ng.resource.IResource<any> => {
            var VACalculatorRequestViewModel = new cls.VACalculatorRequestViewModel(
                existingVABalance,
                eehi,
                veteranCashPayment,
                discountPoints,
                0,
                this.getVAFundingFee(),
                this.getTotalClosingCosts()
                )

            return this.$resource(this.apiRoot + '/CalculateVAFields').save(VACalculatorRequestViewModel);
        }

        /*
         * @desc: get VA funding fee
        */
        getVAFundingFee = (): number => {
            var costs: srv.IList<srv.ICostViewModel> = this.costDetailsSvc.wrappedLoan.ref.closingCost.costs;
            var vaFundingFeeCost = _.find(costs,(cost: srv.ICostViewModel) => { return cost.name == "VA Funding Fee" });
            if (!vaFundingFeeCost)
                return 0;
            return vaFundingFeeCost.amount;
        }

        /*
        * @desc: get Borrower Total closing costs
       */
        getTotalClosingCosts = (): number => {
            return this.costDetailsSvc.wrappedLoan.ref.closingCost.totals.closingCosts.borrowerTotal - this.costDetailsHelpers.calculateSectionTotal(srv.CostSectionTypeEnum.Prepaids) - this.costDetailsHelpers.calculateSectionTotal(srv.CostSectionTypeEnum.InitialEscowPaymentAtClosing) + this.costDetailsHelpers.getCostsTotalByHUDLineNumber(901);
        }

        isVAFeeLimitExceeded = (closingCostViewModel: srv.IClosingCostViewModel, totalLoanAmount: number): ng.resource.IResource<any>  => {
            return this.$resource(this.apiRoot + '/IsVAFeeLimitExceeded', { totalLoanAmount: totalLoanAmount }).save(closingCostViewModel);
        }

        openVaFeeExceededAlertModal = (vaFeeLimitExceededResults: srv.IList<srv.IVaFeesLimitExceededResult>): void => {
            if (vaFeeLimitExceededResults.length) {
                var buttonTitle = this.$state.is('loanCenter.loan.cost.details') ? 'OK' : 'Cost Details';
                var buttonCallBack = this.$state.is('loanCenter.loan.cost.details') ? 'VAAlertOKButton' : 'redirectToCostDetails';
                var message = "Fees paid by the veteran exceeds the 1% limit or <br/>unallowable fees are charged to the Veteran. <br/>Please adjust the fees as Lender/Seller paid.<br/><br/>";
                lib.forEach(vaFeeLimitExceededResults, function (result) {
                    if (result.reason == srv.VAFeeLimitExceededReasonEnum.UnAllowableFeeCharged) {
                        message += "<b>Unallowable Fees:</b>"
                    }
                    else if (result.reason == srv.VAFeeLimitExceededReasonEnum.FeesExceedsOnePercentLimit) {
                        message += "<b>Fees that exceed 1% Limit:</b>"
                    }

                    message += "<ul>"

                    lib.forEach(result.fees, function (fee) {
                        message += "<li>" + fee.name + "</li>";
                    })

                    message += "</ul><br/>"

                })


                this.commonModalWindowFactory.open(
                    {
                        type: this.modalWindowType.confirmation,
                        ctrl: this,
                        header: 'VA Fee Limits Exceeded',
                        headerClass: 'confirmation-modal-header',
                        message: message,
                        messageClass: 'confirmation-modal-message',
                        btnCloseText: 'Cancel',
                        ctrlButtons: [{
                            title: buttonTitle, styleClass: 'imp-button-div-hs-ws-prim',
                            width: '140px', height: '30px', callback: buttonCallBack
                        }]
                    });
            }
        }

        VAAlertOKButton = (): void => {
            this.$modalStack.dismissAll('OK');
        }

        redirectToCostDetails = (): void => {
            this.$state.go("loanCenter.loan.cost.details", { redirectedFromLoanDetailsVaAlertModal: true });
            this.$modalStack.dismissAll('Close');
        }

        /*
         * @desc: Colors the text based on model value
        */
        colorTheText = (value: boolean): string => {
            if (value)
                return '#1fb25a';
            else
                return '#ef1126';
        }

        /**
        * @desc: Gets correct text as a result of calculation
        */
        getText = (value: boolean): string => {
            if (value)
                return 'This Loan Meets the Safe Harbor Requirements';
            return 'This Loan Does Not Meet the Safe Harbor Requirements';
        }
    }

    angular.module('vaCenter').service('vaCenterService', VACenterService);
} 