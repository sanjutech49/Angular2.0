   (function () {
    'use strict';
    angular.module('loanScenario')
        .provider('loanScenarioResolver', loanScenarioResolver);

    /**
    * Resolves a client side model containing flags and properties specific to the client side only.
    */
    function loanScenarioResolver() {

        this.$get = function () {
            return resolver;
        };

        function resolver(loanService, wrappedLoan, applicationData, $stateParams) {

            var service = {
                payOff2ndMortgageList: null,
                isWholesale: false,
                minCompensation: 0,
                maxCompensation: 0,
                brokerCompensationAmount: 0,
                brokerCompensationPercent: 0,
                repricing: false,
                pricingFicoScore: 0,
                firstMortgage: false,
                secondMortgage: false,
                forceDisableFirst: false,
                forceDisableSecond: false
            };

            // Repricing
            service.repricing = $stateParams["repricing"] ? true : false;

            service.pricingFicoScore = (function (primary) {
                if (!primary.isSpouseOnTheLoan)
                    return primary.getBorrower().ficoScore.decisionScore;
                else
                    return Math.min(primary.getBorrower().ficoScore.decisionScore, primary.getCoBorrower().ficoScore.decisionScore);
            })(wrappedLoan.ref.primary);
            if (service.repricing) {
                var result = runCreditMappingRulesForRepricing(wrappedLoan);
                service.firstMortgage = result.firstMortgage;
                service.secondMortgage = result.secondMortgage;
                service.forceDisableFirst = result.forceDisableFirst;
                service.forceDisableSecond = result.forceDisableSecond;
            }

            // Lookups
            if (service.repricing && service.secondMortgage)
                service.payOff2ndMortgageList = applicationData.lookup.secondMortgageInsurancePayOffTypes;
            else
                service.payOff2ndMortgageList = transformList(wrappedLoan, applicationData);

            // TPO
            var channelId = Boolean(wrappedLoan.ref.channelId) ? wrappedLoan.ref.channelId : applicationData.currentUser.channelId;
            var divisionId = Boolean(wrappedLoan.ref.divisionId) ? wrappedLoan.ref.divisionId : applicationData.currentUser.divisionId;
            var branchId = Boolean(wrappedLoan.ref.branchId) ? wrappedLoan.ref.branchId : applicationData.currentUser.branchId;
            try {
                var channel = firstOrDefault(_.where(applicationData.companyProfile.channels, { channelId: channelId }), { isWholesale: false });
                service.isWholesale = Boolean(channel.isWholesale);
                if (service.isWholesale) {
                    var division = firstOrDefault(_.where(channel.divisions, { divisionId: divisionId }), null);

                    if (Boolean(division)) {
                        var branch = firstOrDefault(_.where(division.branches, { branchId: branchId }), { minCompensation: 0.00, maxCompensation: 0.00, defaultBrokerCompensationAmount : 0.00, defaultBrokerCompensationPercent : 0.00 });
                        service.minCompensation = branch.minCompensation;
                        service.maxCompensation = branch.maxCompensation;
                        service.brokerCompensationAmount = branch.defaultBrokerCompensationAmount;
                        service.brokerCompensationPercent = branch.defaultBrokerCompensationPercent;
                    } else {
                        service.minCompensation = 0.00;
                        service.maxCompensation = 0.00;
                        service.brokerCompensationAmount = 0.00;
                        service.brokerCompensationPercent = 0.00;
                    }
                   

                    
                }
            } catch (ex) {

            }

            return service;
        };

        /*
        *   @todo-cc: Generalize/Utility
        **/
        function firstOrDefault(coll, dflt) {
            if (coll && coll.length > 0) {
                return coll[0]
            }
            else {
                return dflt;
            }
        }

        function transformList(wrappedLoan, applicationData) {

            var secondMortgageType = wrappedLoan.ref.otherInterviewData.existingSecondMortgage;
            var payOff2ndMortgageList = applicationData.lookup.secondMortgageInsurancePayOffTypes.slice();

            if (secondMortgageType == "0" || secondMortgageType == "1") {
                angular.forEach(payOff2ndMortgageList, function (val, key) {
                    //Remove "Payoff and don''t close account" item from list
                    //Remove "Payoff and close account" item from list
                    if (val.value == "3") {
                        payOff2ndMortgageList.splice(key, 2);
                    }

                })
            }
            else if (secondMortgageType == "2") {
                payOff2ndMortgageList = applicationData.lookup.secondMortgageInsurancePayOffTypes.slice();
                angular.forEach(payOff2ndMortgageList, function (val, key) {
                    //Remove "Payoff at closing" item from list
                    if (val.value == "2") {
                        payOff2ndMortgageList.splice(key, 1);
                    }

                })
            }

            if (wrappedLoan.ref.loanAmount == 0)
                wrappedLoan.ref.otherInterviewData.secondMortgageRefinanceComment = "1";

            return payOff2ndMortgageList;
        };

        function runCreditMappingRulesForRepricing(wrappedLoan) {
            if (wrappedLoan.ref.primary.credit.creditDataAvailable)
                wrappedLoan.ref.otherInterviewData.selectedDecisionScoreRange = -1;
            
            // pull the data for current loan information
            var borrowerLiabilities = wrappedLoan.ref.primary.getBorrower().getLiabilities();
            var coBorrowerLiabilities = wrappedLoan.ref.primary.isSpouseOnTheLoan ? wrappedLoan.ref.primary.getCoBorrower().getLiabilities() : [];

            var liabilities = [].concat(borrowerLiabilities ? borrowerLiabilities : []).concat(coBorrowerLiabilities ? coBorrowerLiabilities : []);

            var firstMortgage = liabilities.filter(function (l) { return l.property && l.property.isSubjectProperty && l.isPledged && l.lienPosition == 1 })[0];
            var secondMortgage = liabilities.filter(function (l) { return l.property && l.property.isSubjectProperty && l.isPledged && l.lienPosition == 2 })[0];

            var disableFirst = false;
            var disableSecond = false;

            // map the REO data to Interview data
            if (firstMortgage) {
                if (firstMortgage.borrowerDebtCommentId == 6 || firstMortgage.borrowerDebtCommentId == 8) {
                    firstMortgage = null;
                }
                else {
                    if (firstMortgage.borrowerDebtCommentId == 1 || firstMortgage.borrowerDebtCommentId == 5 || firstMortgage.borrowerDebtCommentId == 7)
                        disableFirst = true;
                    wrappedLoan.ref.otherInterviewData.firstMortgage = firstMortgage.unpaidBalance;
                    wrappedLoan.ref.otherInterviewData.firstPayment = firstMortgage.minPayment;
                }
            }

            if (secondMortgage) {
                if (secondMortgage.borrowerDebtCommentId == 6 || secondMortgage.borrowerDebtCommentId == 8) {
                    secondMortgage = null;
                }
                else {
                    if (secondMortgage.borrowerDebtCommentId == 1 || secondMortgage.borrowerDebtCommentId == 5 || secondMortgage.borrowerDebtCommentId == 7) {
                        disableSecond = true;
                        secondMortgage = null;
                        wrappedLoan.ref.otherInterviewData.existingSecondMortgage = 0;
                    }
                    else {
                        wrappedLoan.ref.otherInterviewData.existingSecondMortgage = secondMortgage.pledgedAssetLoanType;
                        wrappedLoan.ref.otherInterviewData.outstandingBalance = secondMortgage.unpaidBalance;
                        wrappedLoan.ref.otherInterviewData.secondPayment = secondMortgage.minPayment;


                        if (secondMortgage.pledgedAssetLoanType == 2) {
                            wrappedLoan.ref.otherInterviewData.maximumCreditLine = secondMortgage.maximumCreditLine
                        }

                        if (secondMortgage.borrowerDebtCommentId == 0)
                            wrappedLoan.ref.otherInterviewData.secondMortgageRefinanceComment = "1";
                        else if (secondMortgage.borrowerDebtCommentId == 2)
                            wrappedLoan.ref.otherInterviewData.secondMortgageRefinanceComment = "2";
                        else if (secondMortgage.borrowerDebtCommentId == 3)
                            wrappedLoan.ref.otherInterviewData.secondMortgageRefinanceComment = "3";
                        else if (secondMortgage.borrowerDebtCommentId == 4)
                            wrappedLoan.ref.otherInterviewData.secondMortgageRefinanceComment = "4";
                        else
                            wrappedLoan.ref.otherInterviewData.secondMortgageRefinanceComment = "1";
                    }
                }

            }

            var result = { firstMortgage: Boolean(firstMortgage), secondMortgage: Boolean(secondMortgage), forceDisableFirst: disableFirst, forceDisableSecond : disableSecond };

            return result;
            
        };
    }
})(); 