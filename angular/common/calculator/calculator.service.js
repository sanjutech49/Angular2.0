(function () {
    'use strict';

    angular.module('CalculatorModule')

    .factory('commonCalculatorSvc', commonCalculatorSvc);

    commonCalculatorSvc.$inject = ['$resource', 'apiRoot'];

    function commonCalculatorSvc($resource, ApiRoot) {

        var hcltvCalculatorApiPath = ApiRoot + 'HcltvCalculator/';
        var cltvCalculatorApiPath = ApiRoot + 'CltvCalculator/';
        var cashOutCalculatorApiPath = ApiRoot + 'CashoutCalculator/CalculateCashoutRules';
        var CalculateCashoutAmountChangedApiPath = ApiRoot + 'CashoutCalculator/CalculateCashoutAmountChanged';


        var CalculateCltv = $resource(cltvCalculatorApiPath, {},
        {
            CalculateCltv: { method: 'POST', params: { } }
        });

        var CalculateHcltv = $resource(hcltvCalculatorApiPath , {},
        {
            CalculateHcltv: { method: 'POST' }
        });

        var CalculateCashOut = $resource(cashOutCalculatorApiPath, {},
        {
            CalculateCashOut: { method: 'POST' }
        });
        
        var CalculateCashOutChange = $resource(CalculateCashoutAmountChangedApiPath, {},
        {
            CalculateCashOutChange: { method: 'POST' }
        });

        
        function RoundToTwoDecimalPlaces(number) {
            return (Math.round(number * 100)) / 100;
        };

        function CalculateDownPaymentPercentage(downPayment, purchasePrice)
        {
            return RoundToTwoDecimalPlaces((downPayment / purchasePrice) * 100);
        }
            


        function CalculateDti(totalDebts, totalBorrowerIncome, borrowerIncomePeriod, totalCoBorrowerIncome, coBorrowerIncomePeriod) {

            var dtiCalculated = 0;

            if (totalDebts == null || totalDebts == undefined) {
                return {
                    dti: dtiCalculated
                };
            }

            if (totalBorrowerIncome == null || totalBorrowerIncome == undefined) {
                totalBorrowerIncome = 0;
            }
                

            if (totalCoBorrowerIncome == null || totalCoBorrowerIncome == undefined) {
                totalCoBorrowerIncome = 0;
            }
                
            

            totalDebts = parseFloat(totalDebts);
            totalBorrowerIncome = parseFloat(totalBorrowerIncome);
            totalCoBorrowerIncome = parseFloat(totalCoBorrowerIncome);

            if (borrowerIncomePeriod == "2") {
                totalBorrowerIncome = totalBorrowerIncome / 12;
            }

            if (coBorrowerIncomePeriod == "2") {
                totalCoBorrowerIncome = totalCoBorrowerIncome / 12;
            }

            var totalIncome = totalBorrowerIncome + totalCoBorrowerIncome;

            if (totalIncome == 0) {
                dtiCalculated = 0;
            } else {
                dtiCalculated = (totalDebts / totalIncome)*100;
            }

            return {
                dti: dtiCalculated
            };
        };

        function numToPercentage(num) {
            var numToString = new String(Math.round(num * 1000) / 1000);

            var dec = numToString.split(".");

            if (dec == null || dec.length == 0)
                return "0.000 %";

            if (dec.length == 1)
                return dec[0] + ".000 %";

            for (var i = 0; i < 3 - dec[1].length; i++) {
                numToString += "0";
            }

            if (numToString == "000") numToString = "0.000";

            return numToString + " %";
        }

        function CalculateLtv(loanAmount, propertyValue) {
            if (propertyValue == 0)
                return 0;

            var ltv = (loanAmount / propertyValue) * 100;
            ltv = Math.round(ltv * 1000) / 1000; //round to 3 decimals
            return ltv;
        }

        function RecalculateDownPayment(purchasePrice, loanAmount, downPayment, downPaymentPercentage, concurrent2ndMortgage, base) {
            var result = { purchasePrice: 0, loanAmount: 0, downPayment: 0, downPaymentPercentage: 0, concurrent2ndMortgage: 0};

            switch(base)
            {
                case "PurchasePrice":
                    (function () {
                        if (loanAmount > purchasePrice) {
                            result.loanAmount = loanAmount;
                            result.concurrent2ndMortgage = concurrent2ndMortgage;
                            result.purchasePrice = loanAmount + downPayment + concurrent2ndMortgage;
                            result.downPayment = downPayment;
                            result.downPaymentPercentage = CalculateDownPaymentPercentage(result.downPayment, result.purchasePrice);
                        }
                        else {
                            result.purchasePrice = purchasePrice;
                            if (loanAmount == 0)
                                result.loanAmount = purchasePrice;
                            else
                                result.loanAmount = loanAmount;
                            result.concurrent2ndMortgage = concurrent2ndMortgage;
                            result.downPayment = purchasePrice - result.loanAmount - result.concurrent2ndMortgage;
                            result.downPaymentPercentage = CalculateDownPaymentPercentage(result.downPayment, result.purchasePrice);
                        }
                    })();
                    break;
                case "LoanAmount":
                    (function () {
                        if (loanAmount > purchasePrice)
                        {
                            result.loanAmount = loanAmount;
                            result.concurrent2ndMortgage = concurrent2ndMortgage;
                            result.purchasePrice = loanAmount + downPayment + concurrent2ndMortgage;
                            result.downPayment = downPayment;
                            result.downPaymentPercentage = CalculateDownPaymentPercentage(result.downPayment, result.purchasePrice);
                        }
                        else
                        {
                            result.purchasePrice = purchasePrice;
                            result.concurrent2ndMortgage = concurrent2ndMortgage;
                            result.loanAmount = loanAmount;
                            result.downPayment = purchasePrice - loanAmount - concurrent2ndMortgage;
                            result.downPaymentPercentage = CalculateDownPaymentPercentage(result.downPayment, result.purchasePrice);
                        }
                    })();
                    break;
                case "DownPayment":
                    (function () {
                        result.purchasePrice = purchasePrice;                    
                       result.downPayment = Number.isNaN(parseFloat(downPayment)) ? 0: downPayment;
                        if (!result.purchasePrice < 1 || !result.downPayment < 0)
                           result.loanAmount = (1 - (result.downPayment / result.purchasePrice)) * result.purchasePrice;
                        else
                        result.loanAmount = loanAmount;
                        result.downPaymentPercentage = CalculateDownPaymentPercentage(result.downPayment, result.purchasePrice);                          
                    })();
                    break;
                case "DownPaymentPercentage":
                    (function () {
                        result.purchasePrice = purchasePrice;
                        result.downPaymentPercentage = RoundToTwoDecimalPlaces(downPaymentPercentage);
                        //do not calculate if value of downPaymentPercentage is not changed
                        if (CalculateDownPaymentPercentage(downPayment, purchasePrice) == downPaymentPercentage)
                        {
                         result.downPayment = downPayment;
                         result.loanAmount = loanAmount;
                        }
                        else
                        {
                            result.downPayment = (result.downPaymentPercentage / 100) * result.purchasePrice;
                            result.loanAmount = (1 - (result.downPaymentPercentage / 100)) * result.purchasePrice;
                       }
                    })();
                    break;
            }

            return result;
        }

        function GetLowestMiddleFicoScore(wLoan, applicationData) {
            var midFicoScore = Number.MAX_VALUE;

            if (wLoan.ref.financialInfo.ficoScore)
                return wLoan.ref.financialInfo.ficoScore;

            if (midFicoScore == Number.MAX_VALUE && wLoan.ref.otherInterviewData.selectedDecisionScoreRange != -1) {
                var ficoText = applicationData.lookup.ficoScore[wLoan.ref.otherInterviewData.selectedDecisionScoreRange - (-1)].text;
                return ficoText.length > 3 ? ficoText.substring(ficoText.indexOf('(') + 1, ficoText.indexOf(')')) : ficoText;
            }

            return midFicoScore == Number.MAX_VALUE ? '' : midFicoScore;
        }

        function GetFicoScore(wLoan, applicationData) {

            var midFicoScore = -1;

            lib.forEach(wLoan.ref.transactionInfo.borrowers, function (borrower) {
                if (borrower.ficoScore.midFicoScore < midFicoScore && borrower.ficoScore.midFicoScore > 0)
                    midFicoScore = borrower.ficoScore.midFicoScore;
            })


            if (midFicoScore == -1 && wLoan.ref.otherInterviewData.selectedDecisionScoreRange != '-1') {
                var a = lib.filter(applicationData.lookup.ficoScore, function (item) {
                    return item.value == wLoan.ref.otherInterviewData.selectedDecisionScoreRange;
                });

                return a[0].stringValue;
            }
            else if (midFicoScore == -1)
                return wLoan.ref.active.getBorrower().ficoScore.decisionScore;


            return midFicoScore;
        }

        var calculatorService =
           {
               calculateDti: CalculateDti,
               calculateLtv: CalculateLtv,
               calculateCltv: CalculateCltv,
               calculateHcltv: CalculateHcltv,
               recalculateDownPayment: RecalculateDownPayment,
               calculateCashOut: CalculateCashOut,
               calculateCashOutChange: CalculateCashOutChange,
               GetLowestMiddleFicoScore: GetLowestMiddleFicoScore,
               GetFicoScore: GetFicoScore
           }

        return calculatorService;

    };

})();