/// <reference path="../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../scripts/typings/ui-router/angular-ui-router.d.ts" />
/// <reference path="../complianceease/complianceease.service.ts" />
var ntb;
(function (ntb) {
    var controller;
    (function (controller) {
        'use strict';
        var NTBCenterController = (function () {
            function NTBCenterController(wrappedLoan, $state, navigationService, applicationData, enums, complianceEaseService, loanDetailsSvc, loanEvent, ntbCenterService, $log) {
                var _this = this;
                this.wrappedLoan = wrappedLoan;
                this.$state = $state;
                this.navigationService = navigationService;
                this.applicationData = applicationData;
                this.enums = enums;
                this.complianceEaseService = complianceEaseService;
                this.loanDetailsSvc = loanDetailsSvc;
                this.loanEvent = loanEvent;
                this.ntbCenterService = ntbCenterService;
                this.$log = $log;
                /**
                * @desc Gets the recoupment period string. Returns "N/A" if recoupment period is invalid.
                */
                this.getRecoupmentPeriod = function () {
                    if (_this.isRecoupmentPeriodValid()) {
                        return String(_this.wrappedLoan.ref.recoupmentPeriodCalculated.recoupmentPeriod) + ' months';
                    }
                    else {
                        return "N/A";
                    }
                };
                /**
                * @desc Gets the flag indicating whether recoupment period is valid.
                */
                this.isRecoupmentPeriodValid = function () {
                    return (!common.objects.isNullOrUndefined(_this.wrappedLoan.ref.recoupmentPeriodCalculated.recoupmentPeriod) && _this.wrappedLoan.ref.recoupmentPeriodCalculated.recoupmentPeriod > 0);
                };
                this.formatDate = function (value) {
                    return _this.complianceEaseService.formatDate(value, null);
                };
                this.calculatePaymentAndMI = function (payment, isNewLoan) {
                    return _this.loanDetailsSvc.calculatePaymentAndMI(payment, _this.getMIAmount(isNewLoan));
                };
                this.calculateCurrentMonthlyObligations = function () {
                    return _this.ntbCenterService.calculateCurrentMonthlyObligations(_this.wrappedLoan);
                };
                /*
                 * @desc: Calls Mega save
                */
                this.saveChanges = function () {
                    _this.navigationService.SaveAndUpdateWrappedLoan(_this.applicationData.currentUserId, _this.wrappedLoan);
                };
                /*
                 * @desc: Reloads current state
                */
                this.cancelChanges = function () {
                    _this.navigationService.cancelChanges(_this.wrappedLoan.ref.loanId);
                };
                this.getDataNtbConfiguration = function (ntbBenefitEnumId, state, itemName) {
                    var ntbBenefitConfiguration = lib.findFirst(_this.applicationData.ntbBenefitConfigurations, function (x) { return x.ntbBenefitEnumId == ntbBenefitEnumId && x.state.indexOf(state) != -1; });
                    if (ntbBenefitConfiguration != null) {
                        return ntbBenefitConfiguration[itemName];
                    }
                    return null;
                };
                // order by nefit by order property from ntbBenefitConfiguration class
                this.orderBenefit = function (benefit) {
                    var ntbBenefitConfiguration = lib.findFirst(_this.applicationData.ntbBenefitConfigurations, function (x) { return x.ntbBenefitEnumId == benefit.ntbBenefitEnumId; });
                    if (ntbBenefitConfiguration != null)
                        return ntbBenefitConfiguration.order;
                    return 0;
                };
                /*
                * @desc Trigger loan calculator
                */
                this.triggerLoanCalculator = function () {
                    _this.loanEvent.broadcastPropertyChangedEvent(30 /* todo */);
                };
                this.getNtbActivation = function (ntbBenefitEnumId) {
                    return lib.findFirst(_this.wrappedLoan.ref.ntbBenefitActivations, function (x) { return x.ntbBenefitEnumId === ntbBenefitEnumId; });
                };
                this.updateBonaFideCheckbox = function (bonaFideId) {
                    var bonaFideActivation = _this.getNtbActivation(12 /* CashoutReasonableBonaFiedPersonalNeed */);
                    if (bonaFideActivation != null) {
                        bonaFideActivation.active = bonaFideId == null ? false : true;
                        bonaFideActivation.isManual = true;
                    }
                };
                /*
                * Trigger NTB Calculator
                */
                this.callNtbCalculator = function () {
                    var self = _this;
                    _this.ntbCenterService.calculateNTB(_this.wrappedLoan).$promise.then(function (result) {
                        if (result && result.response && result.response.ntbBenefitActivations)
                            self.ntbCenterService.updateLoanNTB(self.wrappedLoan, result.response);
                    }, function (error) {
                        self.$log.error(error);
                    });
                };
                /*
                * PRIVATE FUNCTIONS
                */
                this.getMIAmount = function (isNewLoan) {
                    return _this.loanDetailsSvc.getMIAmount(isNewLoan, _this.getCostsCb, _this.wrappedLoan.ref.loanPurposeType, _this.wrappedLoan.ref.getSubjectProperty().occupancyType, _this.wrappedLoan.ref.getSubjectProperty, _this.wrappedLoan.ref.primary.getBorrower().getCurrentAddress, _this.enums.housingExpenses.mortgageInsuranceExpense);
                };
                /*
                * CALLBACKS
                */
                this.getCostsCb = function () {
                    return _this.wrappedLoan.ref.closingCost.costs;
                };
                navigationService.contextualType = enums.ContextualTypes.NetTangibleBenefit;
                this.callNtbCalculator();
            }
            NTBCenterController.$inject = ['wrappedLoan', '$state', 'NavigationSvc', 'applicationData', 'enums', 'complianceEaseService', 'loanDetailsSvc', 'loanEvent', 'ntbCenterService', '$log'];
            return NTBCenterController;
        })();
        angular.module('ntbCenter').controller('ntbCenterController', NTBCenterController);
    })(controller = ntb.controller || (ntb.controller = {}));
})(ntb || (ntb = {}));
//# sourceMappingURL=ntbcenter.controller.js.map