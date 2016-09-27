// This file (LoanCalculatorService.ts - ver 1.0) has been has been automatically generated, do not modify! 
/// <reference path="../../global/global.ts" />	
/// <reference path="../../lib/httpUtil.ts" />	
/// <reference path="../enums.ts" />	
/// <reference path="../viewModels.ts" />	
var srv;
(function (srv) {
    var LoanCalculatorService = (function () {
        function LoanCalculatorService(httpUtil) {
            var _this = this;
            this.httpUtil = httpUtil;
            this.UpdateCalculatedValuesGeneric = function (request, successHandler, serviceEventOrMessage, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'LoanCalculatorService/UpdateCalculatedValues'; }
                return _this.httpUtil.post(methodPath, { request: request }, serviceEventOrMessage, errorHandler, config, successHandler);
            };
            this.UpdateCalculatedValues = function (request, serviceEventOrMessage, successHandler, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'LoanCalculatorService/UpdateCalculatedValues'; }
                return _this.UpdateCalculatedValuesGeneric(request, successHandler || _this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
            };
            this.CalculateProposedImpoundDataGeneric = function (costVMs, propertyExpenses, labilitiesViewModels, subordinateFinancing, loanPurposeType, successHandler, serviceEventOrMessage, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'LoanCalculatorService/CalculateProposedImpoundData'; }
                return _this.httpUtil.post(methodPath, { costVMs: costVMs, propertyExpenses: propertyExpenses, labilitiesViewModels: labilitiesViewModels, subordinateFinancing: subordinateFinancing, loanPurposeType: loanPurposeType }, serviceEventOrMessage, errorHandler, config, successHandler);
            };
            this.CalculateProposedImpoundData = function (costVMs, propertyExpenses, labilitiesViewModels, subordinateFinancing, loanPurposeType, serviceEventOrMessage, successHandler, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'LoanCalculatorService/CalculateProposedImpoundData'; }
                return _this.CalculateProposedImpoundDataGeneric(costVMs, propertyExpenses, labilitiesViewModels, subordinateFinancing, loanPurposeType, successHandler || _this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
            };
            this.CalculateCashOutResultGeneric = function (secondMortgageInfo, withdrawnFromHelocInLast12Months, payingOffSecondMortgage, secondMortgageAmortizationType, newLoanAmount, existingMortgagesAmount, propertyValue, outstandingBalance, comment, loanLimit, propertyPurchasedWithinYear, firstMortgage, maxCreditLine, successHandler, serviceEventOrMessage, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'LoanCalculatorService/CalculateCashOutResult'; }
                return _this.httpUtil.get(methodPath, { secondMortgageInfo: secondMortgageInfo, withdrawnFromHelocInLast12Months: withdrawnFromHelocInLast12Months, payingOffSecondMortgage: payingOffSecondMortgage, secondMortgageAmortizationType: secondMortgageAmortizationType, newLoanAmount: newLoanAmount, existingMortgagesAmount: existingMortgagesAmount, propertyValue: propertyValue, outstandingBalance: outstandingBalance, comment: comment, loanLimit: loanLimit, propertyPurchasedWithinYear: propertyPurchasedWithinYear, firstMortgage: firstMortgage, maxCreditLine: maxCreditLine }, serviceEventOrMessage, errorHandler, config, successHandler);
            };
            this.CalculateCashOutResult = function (secondMortgageInfo, withdrawnFromHelocInLast12Months, payingOffSecondMortgage, secondMortgageAmortizationType, newLoanAmount, existingMortgagesAmount, propertyValue, outstandingBalance, comment, loanLimit, propertyPurchasedWithinYear, firstMortgage, maxCreditLine, serviceEventOrMessage, successHandler, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'LoanCalculatorService/CalculateCashOutResult'; }
                return _this.CalculateCashOutResultGeneric(secondMortgageInfo, withdrawnFromHelocInLast12Months, payingOffSecondMortgage, secondMortgageAmortizationType, newLoanAmount, existingMortgagesAmount, propertyValue, outstandingBalance, comment, loanLimit, propertyPurchasedWithinYear, firstMortgage, maxCreditLine, successHandler || _this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
            };
            this.CalculateCostsToAdjustPtcGeneric = function (productCosts, allCosts, successHandler, serviceEventOrMessage, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'LoanCalculatorService/CalculateCostsToAdjustPtc'; }
                return _this.httpUtil.post(methodPath, { productCosts: productCosts, allCosts: allCosts }, serviceEventOrMessage, errorHandler, config, successHandler);
            };
            this.CalculateCostsToAdjustPtc = function (productCosts, allCosts, serviceEventOrMessage, successHandler, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'LoanCalculatorService/CalculateCostsToAdjustPtc'; }
                return _this.CalculateCostsToAdjustPtcGeneric(productCosts, allCosts, successHandler || _this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
            };
            this.CalculatePurchaseCostGeneric = function (factor, purchasePrice, loanAmount, type, period, months, total, successHandler, serviceEventOrMessage, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'LoanCalculatorService/CalculatePurchaseCost'; }
                return _this.httpUtil.get(methodPath, { factor: factor, purchasePrice: purchasePrice, loanAmount: loanAmount, type: type, period: period, months: months, total: total }, serviceEventOrMessage, errorHandler, config, successHandler);
            };
            this.CalculatePurchaseCost = function (factor, purchasePrice, loanAmount, type, period, months, total, serviceEventOrMessage, successHandler, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'LoanCalculatorService/CalculatePurchaseCost'; }
                return _this.CalculatePurchaseCostGeneric(factor, purchasePrice, loanAmount, type, period, months, total, successHandler || _this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
            };
            this.CalculateValuesForTrackingToleranceGeneric = function (disclosuresDetails, currentCosts, defaultCosts, successHandler, serviceEventOrMessage, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'LoanCalculatorService/CalculateValuesForTrackingTolerance'; }
                return _this.httpUtil.post(methodPath, { disclosuresDetails: disclosuresDetails, currentCosts: currentCosts, defaultCosts: defaultCosts }, serviceEventOrMessage, errorHandler, config, successHandler);
            };
            this.CalculateValuesForTrackingTolerance = function (disclosuresDetails, currentCosts, defaultCosts, serviceEventOrMessage, successHandler, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'LoanCalculatorService/CalculateValuesForTrackingTolerance'; }
                return _this.CalculateValuesForTrackingToleranceGeneric(disclosuresDetails, currentCosts, defaultCosts, successHandler || _this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
            };
            this.CalculateCominedDTIandCombineHousingRatioGeneric = function (loanVM, successHandler, serviceEventOrMessage, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'LoanCalculatorService/CalculateCominedDTIandCombineHousingRatio'; }
                return _this.httpUtil.post(methodPath, { loanVM: loanVM }, serviceEventOrMessage, errorHandler, config, successHandler);
            };
            this.CalculateCominedDTIandCombineHousingRatio = function (loanVM, serviceEventOrMessage, successHandler, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'LoanCalculatorService/CalculateCominedDTIandCombineHousingRatio'; }
                return _this.CalculateCominedDTIandCombineHousingRatioGeneric(loanVM, successHandler || _this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
            };
            this.CalculateDetailsOfTransactionGeneric = function (loanVM, successHandler, serviceEventOrMessage, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'LoanCalculatorService/CalculateDetailsOfTransaction'; }
                return _this.httpUtil.post(methodPath, { loanVM: loanVM }, serviceEventOrMessage, errorHandler, config, successHandler);
            };
            this.CalculateDetailsOfTransaction = function (loanVM, serviceEventOrMessage, successHandler, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'LoanCalculatorService/CalculateDetailsOfTransaction'; }
                return _this.CalculateDetailsOfTransactionGeneric(loanVM, successHandler || _this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
            };
            this.CalculateQualifyingRateGeneric = function (loanVM, successHandler, serviceEventOrMessage, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'LoanCalculatorService/CalculateQualifyingRate'; }
                return _this.httpUtil.post(methodPath, { loanVM: loanVM }, serviceEventOrMessage, errorHandler, config, successHandler);
            };
            this.CalculateQualifyingRate = function (loanVM, serviceEventOrMessage, successHandler, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'LoanCalculatorService/CalculateQualifyingRate'; }
                return _this.CalculateQualifyingRateGeneric(loanVM, successHandler || _this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
            };
            this.CalculateFHAGeneric = function (request, successHandler, serviceEventOrMessage, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'LoanCalculatorService/CalculateFHA'; }
                return _this.httpUtil.post(methodPath, { request: request }, serviceEventOrMessage, errorHandler, config, successHandler);
            };
            this.CalculateFHA = function (request, serviceEventOrMessage, successHandler, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'LoanCalculatorService/CalculateFHA'; }
                return _this.CalculateFHAGeneric(request, successHandler || _this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
            };
            this.CalculateVAGeneric = function (request, successHandler, serviceEventOrMessage, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'LoanCalculatorService/CalculateVA'; }
                return _this.httpUtil.post(methodPath, { request: request }, serviceEventOrMessage, errorHandler, config, successHandler);
            };
            this.CalculateVA = function (request, serviceEventOrMessage, successHandler, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'LoanCalculatorService/CalculateVA'; }
                return _this.CalculateVAGeneric(request, successHandler || _this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
            };
            this.CalculateMIGeneric = function (request, successHandler, serviceEventOrMessage, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'LoanCalculatorService/CalculateMI'; }
                return _this.httpUtil.post(methodPath, { request: request }, serviceEventOrMessage, errorHandler, config, successHandler);
            };
            this.CalculateMI = function (request, serviceEventOrMessage, successHandler, errorHandler, methodPath, config) {
                if (methodPath === void 0) { methodPath = 'LoanCalculatorService/CalculateMI'; }
                return _this.CalculateMIGeneric(request, successHandler || _this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
            };
        }
        LoanCalculatorService.className = 'LoanCalculatorService';
        LoanCalculatorService.$inject = ['httpUtil'];
        return LoanCalculatorService;
    })();
    srv.LoanCalculatorService = LoanCalculatorService;
})(srv || (srv = {}));
moduleRegistration.registerService(moduleNames.services, srv.LoanCalculatorService);
//# sourceMappingURL=LoanCalculatorService.js.map