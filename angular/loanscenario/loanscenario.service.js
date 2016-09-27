(function () {
    'use strict';

    angular.module('loanScenario')

    .factory('loanScenarioSvc', loanScenarioSvc);

    loanScenarioSvc.$inject = ['$resource', 'apiRoot', 'commonCalculatorSvc'];

    function loanScenarioSvc($resource, apiRoot, commonCalculatorSvc) {

        var pricingResultsApiPath = apiRoot + 'PricingResults/';

        var loanScenario = $resource(pricingResultsApiPath + 'GetPricingResults', {}, {
            shopForRates: {
                method: 'POST',
                url: pricingResultsApiPath + 'GetPricingResults',
                params: {currentUserId: 'currentUserId'}
            }
        });

        var loanScenarioService =
        {
            loanScenario: loanScenario,
            ruleEngine: {
                runCashoutRules: runCashoutRules,
                runDownPaymentRules: runDownPaymentRules
            },
            currentLoanOnSubjectPropertyChange: currentLoanOnSubjectPropertyChange,
            isVaUsedInPastChange: isVaUsedInPastChange
        };

        function runCashoutRules(wrappedLoan) {
            //  Refactor: TODO
        }

        function currentLoanOnSubjectPropertyChange(vaInformation) {
            vaInformation.isVaUsedInPast = Boolean(vaInformation.isCurrentLoanVA);
            vaInformation.vaLoanPaidOff = false;
        }

        function isVaUsedInPastChange(vaInformation) {
            if (!vaInformation.isVaUsedInPast)
                vaInformation.vaLoanPaidOff = false;

            vaInformation.includeVAFee = !vaInformation.disabilityBenefits;
        }

        function runDownPaymentRules(wrappedLoan, downPaymentPercent, contextIdentifier) {

            // parse
            var purchasePrice = Number.isNaN(parseFloat(wrappedLoan.ref.getSubjectProperty().purchasePrice)) ? 0 : parseFloat(wrappedLoan.ref.getSubjectProperty().purchasePrice);
            var loanAmount = Number.isNaN(parseFloat(wrappedLoan.ref.loanAmount)) ? 0 : parseFloat(wrappedLoan.ref.loanAmount);
            var concurrent2ndMortgage = Number.isNaN(parseFloat(wrappedLoan.ref.subordinateFinancingDetails.loanAmount)) ? 0 : parseFloat(wrappedLoan.ref.subordinateFinancingDetails.loanAmount);
            var downPayment = Number.isNaN(parseFloat(wrappedLoan.ref.downPayment)) ? 0 : parseFloat(wrappedLoan.ref.downPayment);
            var downPaymentPercentage = Number.isNaN(parseFloat(downPaymentPercent)) ? 0 : parseFloat(downPaymentPercent);

            // calculate
            var result = commonCalculatorSvc.recalculateDownPayment(purchasePrice, loanAmount, downPayment, downPaymentPercentage, concurrent2ndMortgage, contextIdentifier);

            // assign
            wrappedLoan.ref.getSubjectProperty().purchasePrice = result.purchasePrice;
            wrappedLoan.ref.loanAmount = result.loanAmount;
            wrappedLoan.ref.downPayment = result.downPayment;

            // return
            return result.downPaymentPercentage;
        }

        return loanScenarioService;
    };

})();