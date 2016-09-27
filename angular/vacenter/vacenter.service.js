/// <reference path="../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../scripts/typings/ui-router/angular-ui-router.d.ts" />
var va;
(function (va) {
    var service;
    (function (service) {
        'use strict';
        var VACenterService = (function () {
            function VACenterService($resource, apiRoot, $state, costDetailsSvc, costDetailsHelpers, commonModalWindowFactory, modalWindowType, $modalStack) {
                var _this = this;
                this.$resource = $resource;
                this.apiRoot = apiRoot;
                this.$state = $state;
                this.costDetailsSvc = costDetailsSvc;
                this.costDetailsHelpers = costDetailsHelpers;
                this.commonModalWindowFactory = commonModalWindowFactory;
                this.modalWindowType = modalWindowType;
                this.$modalStack = $modalStack;
                /*
                * @desc: Call REST service for VA calculations
               */
                this.calculateVA = function (existingVABalance, eehi, veteranCashPayment, discountPoints, vaFundingFee) {
                    var VACalculatorRequestViewModel = new cls.VACalculatorRequestViewModel(existingVABalance, eehi, veteranCashPayment, discountPoints, 0, _this.getVAFundingFee(), _this.getTotalClosingCosts());
                    return _this.$resource(_this.apiRoot + '/CalculateVAFields').save(VACalculatorRequestViewModel);
                };
                /*
                 * @desc: get VA funding fee
                */
                this.getVAFundingFee = function () {
                    var costs = _this.costDetailsSvc.wrappedLoan.ref.closingCost.costs;
                    var vaFundingFeeCost = _.find(costs, function (cost) {
                        return cost.name == "VA Funding Fee";
                    });
                    if (!vaFundingFeeCost)
                        return 0;
                    return vaFundingFeeCost.amount;
                };
                /*
                * @desc: get Borrower Total closing costs
               */
                this.getTotalClosingCosts = function () {
                    return _this.costDetailsSvc.wrappedLoan.ref.closingCost.totals.closingCosts.borrowerTotal - _this.costDetailsHelpers.calculateSectionTotal(5 /* Prepaids */) - _this.costDetailsHelpers.calculateSectionTotal(6 /* InitialEscowPaymentAtClosing */) + _this.costDetailsHelpers.getCostsTotalByHUDLineNumber(901);
                };
                this.isVAFeeLimitExceeded = function (closingCostViewModel, totalLoanAmount) {
                    return _this.$resource(_this.apiRoot + '/IsVAFeeLimitExceeded', { totalLoanAmount: totalLoanAmount }).save(closingCostViewModel);
                };
                this.openVaFeeExceededAlertModal = function (vaFeeLimitExceededResults) {
                    if (vaFeeLimitExceededResults.length) {
                        var buttonTitle = _this.$state.is('loanCenter.loan.cost.details') ? 'OK' : 'Cost Details';
                        var buttonCallBack = _this.$state.is('loanCenter.loan.cost.details') ? 'VAAlertOKButton' : 'redirectToCostDetails';
                        var message = "Fees paid by the veteran exceeds the 1% limit or <br/>unallowable fees are charged to the Veteran. <br/>Please adjust the fees as Lender/Seller paid.<br/><br/>";
                        lib.forEach(vaFeeLimitExceededResults, function (result) {
                            if (result.reason == 1 /* UnAllowableFeeCharged */) {
                                message += "<b>Unallowable Fees:</b>";
                            }
                            else if (result.reason == 2 /* FeesExceedsOnePercentLimit */) {
                                message += "<b>Fees that exceed 1% Limit:</b>";
                            }
                            message += "<ul>";
                            lib.forEach(result.fees, function (fee) {
                                message += "<li>" + fee.name + "</li>";
                            });
                            message += "</ul><br/>";
                        });
                        _this.commonModalWindowFactory.open({
                            type: _this.modalWindowType.confirmation,
                            ctrl: _this,
                            header: 'VA Fee Limits Exceeded',
                            headerClass: 'confirmation-modal-header',
                            message: message,
                            messageClass: 'confirmation-modal-message',
                            btnCloseText: 'Cancel',
                            ctrlButtons: [{
                                title: buttonTitle,
                                styleClass: 'imp-button-div-hs-ws-prim',
                                width: '140px',
                                height: '30px',
                                callback: buttonCallBack
                            }]
                        });
                    }
                };
                this.VAAlertOKButton = function () {
                    _this.$modalStack.dismissAll('OK');
                };
                this.redirectToCostDetails = function () {
                    _this.$state.go("loanCenter.loan.cost.details", { redirectedFromLoanDetailsVaAlertModal: true });
                    _this.$modalStack.dismissAll('Close');
                };
                /*
                 * @desc: Colors the text based on model value
                */
                this.colorTheText = function (value) {
                    if (value)
                        return '#1fb25a';
                    else
                        return '#ef1126';
                };
                /**
                * @desc: Gets correct text as a result of calculation
                */
                this.getText = function (value) {
                    if (value)
                        return 'This Loan Meets the Safe Harbor Requirements';
                    return 'This Loan Does Not Meet the Safe Harbor Requirements';
                };
                this.apiRoot = apiRoot + 'VaCalculator';
            }
            VACenterService.$inject = ['$resource', 'apiRoot', '$state', 'costDetailsSvc', 'costDetailsHelpers', 'commonModalWindowFactory', 'modalWindowType', '$modalStack'];
            VACenterService.className = 'vaCenterService';
            return VACenterService;
        })();
        service.VACenterService = VACenterService;
        angular.module('vaCenter').service('vaCenterService', VACenterService);
    })(service = va.service || (va.service = {}));
})(va || (va = {}));
//# sourceMappingURL=vacenter.service.js.map