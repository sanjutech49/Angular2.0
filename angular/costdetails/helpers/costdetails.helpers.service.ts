/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/ui-router/angular-ui-router.d.ts" />
/// <reference path="../costdetails.services.ts" />

(function () {
    'use strict';

    angular.module('loanCenter').factory('costDetailsHelpers', costDetailsHelpers);

    costDetailsHelpers.$inject = ['costDetailsSvc', 'enums', 'commonService', '$filter', 'BroadcastSvc', '$state'];

    function costDetailsHelpers(costDetailsSvc: loanCenter.costDetailsSvc, enums, commonService: common.services.ICommonService, $filter, BroadcastSvc, $state: ng.ui.IStateService) {

        var service = {
            getAllUsedCostTypes: getAllUsedCostTypes,
            calculateTotals: calculateTotals,
            calculateLoanCostsTotals: calculateLoanCostsTotals,
            calculateOtherCostsTotals: calculateOtherCostsTotals,
            calculateClosingCostsTotals: calculateClosingCostsTotals,
            calculateLenderCreditsTotals: calculateLenderCreditsTotals,
            calculateCashToCloseTotals: calculateCashToCloseTotals,
            initializeCostService: initializeCostService,
            resetLoanOtherCostsTotals: resetLoanOtherCostsTotals,
            resetTaxesAndRecordingsTotals: resetTaxesAndRecordingsTotals,
            resetAllTotals: resetAllTotals,
            calculatePayOffTotals: calculatePayOffTotals,
            calculateTaxesAndRecordingsTotals: calculateTaxesAndRecordingsTotals,
            recalculateRightSectionAmounts: recalculateRightSectionAmounts,
            calculateBorrowerPTCAmount: calculateBorrowerPTCAmount,
            sumOfRightSection: sumOfRightSection,
            calculateCostsOnCloseDateChanged: calculateCostsOnCloseDateChanged,
            resetRightSectionAmounts: resetRightSectionAmounts,
            groupCostsBySections: groupCostsBySections,
            initializeTotals: initializeTotals,
            calculateLoanOrOtherCostsTotals: calculateLoanOrOtherCostsTotals,
            updateImpounds: updateImpounds,
            isOtherInsurance: isOtherInsurance,
            calculateCostTotals: calculateCostTotals,
            payOffFilter: payOffFilter,
            getCostDetailsData: getCostDetailsData,
            calculateSectionTotal: calculateSectionTotal,
            calculateAllowableBorrowerPaidClosingCost: calculateAllowableBorrowerPaidClosingCost,
            payoffCommentChanged: payoffCommentChanged,
            getCostsTotalByHUDLineNumber: getCostsTotalByHUDLineNumber
        };

        return service;

        /*
        * Method definitions
        */

        function initializeCostService(wrappedLoan: lib.referenceWrapper<cls.LoanViewModel>, applicationData: any) {
            costDetailsSvc.wrappedLoan = wrappedLoan;
            if (!!applicationData)
                costDetailsSvc.applicationData = applicationData;

            initializeTotals();
        }

        function getCostDetailsData() {
            var closingCostViewModel = costDetailsSvc.wrappedLoan.ref.closingCost;
            closingCostViewModel.activeTab = ($state.current.name == "loanCenter.loan.cost.transactional") ? 'transactional-summary' : 'closing-costs';

            initializeTotals();
            groupCostsBySections();
            initializePayOffSectionItems();
            populatePledgedAssetComments(costDetailsSvc.applicationData.lookup.pledgetAssetComments);
            closingCostViewModel.totals.totalLenderRebate = closingCostViewModel.totalLenderRebate;
            getAllUsedCostTypes(costDetailsSvc.costDetailsData.usedLoanCostTypes, costDetailsSvc.costDetailsData.usedOtherCostTypes, costDetailsSvc.costDetailsData.loanCosts, costDetailsSvc.costDetailsData.otherCosts);
            calculateCostTotals();
            calculatePayOffTotals();

            roundAndRecalculatePTCAmountOnInit();
            closingCostViewModel.disableFields = !costDetailsSvc.applicationData.currentUser.hasPrivilege(enums.privileges.ClosingCostsRW);

            costDetailsSvc.getActiveToleranceGroup();
        }

        function initializePayOffSectionItems() {
            costDetailsSvc.costDetailsData.payOffSectionItems = [];
            angular.forEach(costDetailsSvc.wrappedLoan.ref.getLoanApplications(), function (loanApplication) {

                if (loanApplication.getBorrower()) {
                    angular.forEach(loanApplication.getBorrower().getLiabilities(), function (liability) {
                        initializePayOffSectionItem(liability);
                    });
                    angular.forEach(loanApplication.getBorrower().publicRecords, function (publicRecord) {
                        initializePayOffSectionItem(publicRecord);
                    });
                }

                if (loanApplication.getCoBorrower() && loanApplication.isSpouseOnTheLoan) {
                    angular.forEach(loanApplication.getCoBorrower().getLiabilities(), function (liability) {
                        initializePayOffSectionItem(liability);
                    });
                    angular.forEach(loanApplication.getCoBorrower().publicRecords, function (publicRecord) {
                        initializePayOffSectionItem(publicRecord);
                    });
                }
            });

            setCreditPayoffItemsCount();
        }

        function initializePayOffSectionItem(item) {
            if (item.isRemoved)
                return;

            //REO Items
            //Liabilities & Collections
            //Public Records
            item.hidden = false;
            payoffCommentChanged(item);

            costDetailsSvc.costDetailsData.payOffSectionItems.push(item);
        }

        function setCreditPayoffItemsCount() {
            costDetailsSvc.costDetailsData.creditPayoffItemsCount = 0;
            angular.forEach(costDetailsSvc.costDetailsData.payOffSectionItems, function (payoffItem) {
                if (payOffFilter(payoffItem)) {
                    costDetailsSvc.costDetailsData.creditPayoffItemsCount += 1;
                }
            });
        }

        function payoffCommentChanged(payoffItem) {
            var isLiabilityPayOff = payoffItem.isLiability && payoffItem.payoffCommentId != enums.LiabilitiesDebtComment.PayoffAtClose;
            var isPublicRecordPayOff = payoffItem.isPublicRecord && payoffItem.payoffCommentId != enums.DebtComment.PayoffAtClose;
            var isPledgedAssetPayOff = payoffItem.isPledged && (payoffItem.payoffCommentId != enums.PledgedAssetComment.PayoffAtClose &&
                payoffItem.payoffCommentId != enums.PledgedAssetComment.PayoffAtClosingAndDontCloseAccount &&
                payoffItem.payoffCommentId != enums.PledgedAssetComment.PayoffAtClosingAndCloseAccount)

            if (isLiabilityPayOff || isPublicRecordPayOff || isPledgedAssetPayOff) {
                payoffItem.hidden = true;
                calculatePayOffTotals();
                costDetailsSvc.costDetailsData.creditPayoffItemsCount -= 1;
            }
        }

        function payOffFilter(payoffItem) {
            return !payoffItem.isRemoved && !payoffItem.hidden && (payoffItem.balance > 0 || payoffItem.isPayoffItem);
        }

        function calculateCostTotals() {
            calculateTotals();
            BroadcastSvc.broadcastCostDetailsTotals(costDetailsSvc.wrappedLoan.ref.closingCost.totals);
        }

        function populatePledgedAssetComments(pledgetAssetComments) {
            if (!pledgetAssetComments || pledgetAssetComments.length === 0)
                return;

            var notMyLoanEnumText = 'Not My Loan / Exclude From Debt Ratio';
            var commentNotMyLoan = _.find(pledgetAssetComments, function (comment: any) { return comment.value === enums.PledgedAssetComment.NotMyLoan.toString(); });

            if (commentNotMyLoan) {
                commentNotMyLoan.text = notMyLoanEnumText;
            }
        }

        function roundAndRecalculatePTCAmountOnInit() {
            var allCosts = costDetailsSvc.wrappedLoan.ref.closingCost.costs;
            for (var key in allCosts) {
                if ((allCosts[key].templateId == 4 || allCosts[key].templateId == 5) && !allCosts[key].isRemoved) {
                    var expectedBorrowerPtcAmount = calculateBorrowerPTCAmount(allCosts[key], costDetailsSvc.wrappedLoan.ref.closingDate.dateValue);
                    if (expectedBorrowerPtcAmount != sumOfRightSection(allCosts[key])) {
                        resetRightSectionAmounts(allCosts[key]);
                        allCosts[key].borrowerPaid.atClosing = expectedBorrowerPtcAmount;
                    }
                }
            }
            calculateCostTotals();
        }

        // Get all cost types already used within loan costs and other costs
        function getAllUsedCostTypes(usedLoanCostTypes, usedOtherCostTypes, loanCosts, otherCosts) {
            angular.forEach(loanCosts, function (cost) {
                if (!cost.isRemoved && cost.mustBeUnique)
                    usedLoanCostTypes.push(cost.uniqueCostTypeId);
            });

            angular.forEach(otherCosts, function (cost) {
                if (!cost.isRemoved && cost.mustBeUnique)
                    usedOtherCostTypes.push(cost.uniqueCostTypeId);
            });
        }

        function resetLoanOtherCostsTotals(totals) {
            totals.borrowerPaidAtClosingTotal = 0;
            totals.borrowerPaidBeforeClosingTotal = 0;
            totals.sellerPaidAtClosingTotal = 0;
            totals.sellerPaidBeforeClosingTotal = 0;
            totals.otherPaidAtClosingTotal = 0;
            totals.otherPaidBeforeClosingTotal = 0;
            totals.totalLenderPaidFees = 0;
            totals.borrowerTotal = 0;
            totals.sellerTotal = 0;
            totals.otherTotal = 0;
            totals.total = 0;
        }

        function resetClosingCostsTotals(totals) {
            totals.borrowerPaidAtClosingTotal = 0;
            totals.borrowerPaidBeforeClosingTotal = 0;
            totals.sellerPaidAtClosingTotal = 0;
            totals.sellerPaidBeforeClosingTotal = 0;
            totals.otherPaidAtClosingTotal = 0;
            totals.otherPaidBeforeClosingTotal = 0;
            totals.paidBeforeClosingTotal = 0;
            totals.total = 0;
            totals.borrowerTotal = 0;
            totals.totalLenderPaidFees = 0;
        }

        function resetCashToCloseTotals(totals) {
            totals.loanEstimateTotal = 0;
            totals.finalTotal = 0;
        }

        function resetTaxesAndRecordingsTotals(totals) {
            totals.recordingFeesTotal = 0;
            totals.taxesTotal = 0;
        }

        function resetAllTotals(totals) {
            resetLoanOtherCostsTotals(totals.loanCosts);
            resetLoanOtherCostsTotals(totals.otherCosts);
            resetClosingCostsTotals(totals.closingCosts);
            resetCashToCloseTotals(totals.calculatedCashToClose);
            resetTaxesAndRecordingsTotals(totals);
        }

        function calculateTotals() {
            resetAllTotals(costDetailsSvc.wrappedLoan.ref.closingCost.totals);
            calculateLoanCostsTotals(true);
            calculateOtherCostsTotals(true);
            calculateLenderCreditsTotals(true);
            calculateClosingCostsTotals();          
            calculateCashToCloseTotals();
            calculateTaxesAndRecordingsTotals();
        }

        function calculateLoanCostsTotals(skipClosingCostTotalsCalculation) {
            calculateLoanOrOtherCostsTotals(costDetailsSvc.wrappedLoan.ref.closingCost.totals, costDetailsSvc.costDetailsData.loanCosts, costDetailsSvc.costDetailsData.lenderCreditsCosts, skipClosingCostTotalsCalculation, false);
        }

        function calculateOtherCostsTotals(skipClosingCostTotalsCalculation) {
            calculateLoanOrOtherCostsTotals(costDetailsSvc.wrappedLoan.ref.closingCost.totals, costDetailsSvc.costDetailsData.otherCosts, costDetailsSvc.costDetailsData.lenderCreditsCosts, skipClosingCostTotalsCalculation, true);
        }

        function calculateLoanOrOtherCostsTotals(allTotals, costs, lenderCreditsCosts, skipClosingCostTotalsCalculation, isOtherSection) {
            var totals = isOtherSection ? allTotals.otherCosts : allTotals.loanCosts;

            resetLoanOtherCostsTotals(totals);

            angular.forEach(costs, function (cost) {
                if (cost.isRemoved || (isOtherSection && !cost.impounded && cost.sectionId == srv.CostSectionTypeEnum.InitialEscowPaymentAtClosing)) {
                    return true;
                }

                if (isAmountValid(cost.borrowerPaid.atClosing))
                    totals.borrowerPaidAtClosingTotal += parseFloat(cost.borrowerPaid.atClosing);

                if (isAmountValid(cost.borrowerPaid.beforeClosing))
                    totals.borrowerPaidBeforeClosingTotal += parseFloat(cost.borrowerPaid.beforeClosing);

                if (isAmountValid(cost.sellerPaid.atClosing))
                    totals.sellerPaidAtClosingTotal += parseFloat(cost.sellerPaid.atClosing);

                if (isAmountValid(cost.sellerPaid.beforeClosing))
                    totals.sellerPaidBeforeClosingTotal += parseFloat(cost.sellerPaid.beforeClosing);

                if (isAmountValid(cost.otherPaid.atClosing)) {
                    totals.otherPaidAtClosingTotal += parseFloat(cost.otherPaid.atClosing);

                    if (cost.otherPaid.paidBy == enums.PaidBy.LenderRebate) {
                        totals.totalLenderPaidFees += parseFloat(cost.otherPaid.atClosing);
                    }
                }

                if (isAmountValid(cost.otherPaid.beforeClosing))
                    totals.otherPaidBeforeClosingTotal += parseFloat(cost.otherPaid.beforeClosing);
            });

            totals.borrowerTotal = totals.borrowerPaidAtClosingTotal + totals.borrowerPaidBeforeClosingTotal;
            totals.sellerTotal = totals.sellerPaidAtClosingTotal + totals.sellerPaidBeforeClosingTotal;
            totals.otherTotal = totals.otherPaidAtClosingTotal + totals.otherPaidBeforeClosingTotal;
            totals.total = totals.borrowerTotal + totals.sellerTotal + totals.otherTotal;

            if (skipClosingCostTotalsCalculation != true) {          
                calculateLenderCreditsTotals(true);
                calculateClosingCostsTotals();
                if (isOtherSection)
                    calculateTaxesAndRecordingsTotals();
            }
        }

        function calculateClosingCostsTotals() {
            var totals = costDetailsSvc.wrappedLoan.ref.closingCost.totals;

            resetClosingCostsTotals(totals.closingCosts);
            totals.closingCosts.borrowerPaidAtClosingTotal = totals.loanCosts.borrowerPaidAtClosingTotal + totals.otherCosts.borrowerPaidAtClosingTotal;
            totals.closingCosts.borrowerPaidBeforeClosingTotal = totals.loanCosts.borrowerPaidBeforeClosingTotal + totals.otherCosts.borrowerPaidBeforeClosingTotal;
            totals.closingCosts.sellerPaidAtClosingTotal = totals.loanCosts.sellerPaidAtClosingTotal + totals.otherCosts.sellerPaidAtClosingTotal;
            totals.closingCosts.sellerPaidBeforeClosingTotal = totals.loanCosts.sellerPaidBeforeClosingTotal + totals.otherCosts.sellerPaidBeforeClosingTotal;
            totals.closingCosts.otherPaidAtClosingTotal = totals.loanCosts.otherPaidAtClosingTotal + totals.otherCosts.otherPaidAtClosingTotal;
            totals.closingCosts.otherPaidBeforeClosingTotal = totals.loanCosts.otherPaidBeforeClosingTotal + totals.otherCosts.otherPaidBeforeClosingTotal;
            totals.closingCosts.paidBeforeClosingTotal = totals.closingCosts.borrowerPaidBeforeClosingTotal + totals.closingCosts.sellerPaidBeforeClosingTotal + totals.closingCosts.otherPaidBeforeClosingTotal;
            totals.closingCosts.total = totals.loanCosts.total + totals.otherCosts.total + totals.lenderCredits;
            totals.closingCosts.borrowerTotal = totals.closingCosts.borrowerPaidAtClosingTotal + totals.closingCosts.borrowerPaidBeforeClosingTotal + totals.lenderCredits;
            totals.totalLenderPaidFees = totals.loanCosts.totalLenderPaidFees + totals.otherCosts.totalLenderPaidFees;
            totals.remainigRebate = calculateRemainingRebate(totals.totalLenderRebate, totals.totalLenderPaidFees);          

        }

        function calculateLenderCreditsTotals(skipClosingCostTotalsCalculation) {
            var totals = costDetailsSvc.wrappedLoan.ref.closingCost.totals;
            var lenderCreditsCosts = costDetailsSvc.costDetailsData.lenderCreditsCosts;
            totals.lenderCredits = 0;
            totals.totalLenderPaidFees = totals.loanCosts.totalLenderPaidFees + totals.otherCosts.totalLenderPaidFees;
            totals.remainigRebate = calculateRemainingRebate(totals.totalLenderRebate, totals.totalLenderPaidFees);
            var remain = totals.totalLenderPaidFees + totals.totalLenderRebate;

            for (var i = 0; i < lenderCreditsCosts.length; i++) {
                var cost = lenderCreditsCosts[i];

                if (cost.isRemoved || (remain >= 0 && cost.hudLineNumber == 802))
                    continue;

                if (isAmountValid(cost.otherPaid.atClosing)) { 
                    if (cost.hudLineNumber == 802 && isAmountValid(totals.remainigRebate) && totals.remainigRebate>0) {
                        totals.lenderCredits -= totals.remainigRebate;
                    }
                    else if (cost.editMode == true && cost.otherPaid.atClosing > 0) {
                        totals.lenderCredits -= parseFloat(cost.otherPaid.atClosing);
                    }
                    else {
                        totals.lenderCredits += parseFloat(cost.otherPaid.atClosing);
                    }
                }               
            }

            if (skipClosingCostTotalsCalculation != true) {
                calculateClosingCostsTotals();
            }
        }

        function calculateRemainingRebate(totalLenderRebate, totalLenderPaidFees) {
            var remainingRebate = roundToTwoDecimalPlaces(totalLenderRebate * -1) - roundToTwoDecimalPlaces(totalLenderPaidFees);
            return remainingRebate;
        }

        function roundToTwoDecimalPlaces(value: number) {
            return Math.round(value * 100) / 100;
        };
         
        function calculatePayOffTotals() {
            var totalAmount = AddPayoffItems(costDetailsSvc.wrappedLoan.ref.closingCost.payOffSection.payOffItems);
            totalAmount += AddPayoffItems(costDetailsSvc.costDetailsData.payOffSectionItems);
            
            costDetailsSvc.wrappedLoan.ref.closingCost.totals.payOffSectionTotal = totalAmount;
            calculateCostTotals();
        }

        function AddPayoffItems(payoffs: srv.IList<srv.IPayOffItemViewModel>) {
            var totalAmount: number = 0;
            for (var i = 0; i < payoffs.length; i++) {
                var item: srv.IPayOffItemViewModel = payoffs[i];
            
                if (item.isRemoved || item.hidden) {
                    continue;
            }

                totalAmount += item.balance;
            }

            return totalAmount;
        }

        function calculateLoanEstimateTotal(loanEstimates) {
            return loanEstimates.loanAmount - loanEstimates.totalClosingCosts + loanEstimates.closingCostsPaidBeforeClosing - (Math.abs(loanEstimates.totalPayoffsAndPayments));
        }

        function calculateCashToCloseFinalTotal(totals, loanAmountFinal) {
            var payOffTotal = getFloatValue(totals.payOffSectionTotal);
            var totalClosingCosts = getFloatValue(totals.closingCosts.borrowerTotal);
            return loanAmountFinal - totalClosingCosts + totals.closingCosts.borrowerPaidBeforeClosingTotal - (Math.abs(payOffTotal));
        }

       
        function calculateFinancedClosingCosts(totals, loanAmountFinal) {           
            var closingCostsFinanced = loanAmountFinal + (-Math.abs(getFloatValue(totals.payOffSectionTotal)));
            var totalClosingCosts = getFloatValue(totals.closingCosts.borrowerTotal);

            var returnValue;

            if (closingCostsFinanced > 0 && totalClosingCosts > 0) {
                if (closingCostsFinanced > totalClosingCosts) {
                    returnValue = totalClosingCosts;
                }
                else {
                    returnValue = closingCostsFinanced;
                }
            }
            else {
                returnValue = 0;
            }

            return returnValue;
        }

        function calculateCashToCloseTotals() {
            var totals = costDetailsSvc.wrappedLoan.ref.closingCost.totals;
            var calculatedCashToCloseLoanEstimates = costDetailsSvc.wrappedLoan.ref.closingCost.calculatedCashToClose.loanEstimates;
            var loanAmount = costDetailsSvc.wrappedLoan.ref.detailsOfTransaction.totalLoanAmount;

            totals.calculatedCashToClose.loanEstimateTotal = calculateLoanEstimateTotal(calculatedCashToCloseLoanEstimates);
            totals.calculatedCashToClose.finalTotal = calculateCashToCloseFinalTotal(totals, loanAmount);
            totals.calculatedCashToClose.financedClosingCosts = calculateFinancedClosingCosts(totals, loanAmount);
        }

        function calculateTaxesAndRecordingsTotals() {
            var totals = costDetailsSvc.wrappedLoan.ref.closingCost.totals;
            var costs = costDetailsSvc.costDetailsData.otherCosts;

            resetTaxesAndRecordingsTotals(totals);

            for (var i = 0; i < costs.length; i++) {
                var cost = costs[i];
                if (cost.isRemoved) 
                    continue;
                
                if (cost.costTypeGroupCategory == 'Recordings') {
                    if (cost.includeInTotal == 1)
                        totals.recordingFeesTotal += getCostTotalAmount(cost);
                }
                else if (cost.costTypeGroupCategory == 'Taxes') {
                    totals.taxesTotal += getCostTotalAmount(cost);
                }
                }
        }

        function calculateSectionTotal(section: srv.CostSectionTypeEnum) {
            var sectionTotal = 0;
            angular.forEach(costDetailsSvc.wrappedLoan.ref.closingCost.costs, function (cost) {
                if (!cost.isRemoved && cost.sectionId == section)
                    sectionTotal += cost.borrowerPaid.atClosing + cost.borrowerPaid.beforeClosing;
            });
            return sectionTotal;
        }

        function getCostsTotalByHUDLineNumber(hudLineNumber: number, subHudLineNuumber?: string) {
            var total = 0;

            lib.forEach(costDetailsSvc.wrappedLoan.ref.closingCost.costs, (cost: srv.ICostViewModel) => {
                if (!cost.isRemoved && (cost.hudLineNumber == hudLineNumber || cost.originalHUDLineNumber == hudLineNumber)) {
                    if (subHudLineNuumber && (cost.subHUDLineNumber == subHudLineNuumber || cost.originalSubHUDLineNumber == subHudLineNuumber)) {
                        total += cost.borrowerPaid.atClosing + cost.borrowerPaid.beforeClosing;
                        return;
                    }
                    total += cost.borrowerPaid.atClosing + cost.borrowerPaid.beforeClosing;
                }
            });

            return total;
        }

        function getCostTotalAmount(cost: srv.ICostViewModel) {
            return cost.borrowerPaid.atClosing + cost.borrowerPaid.beforeClosing
                + cost.sellerPaid.atClosing + cost.sellerPaid.beforeClosing
                + cost.otherPaid.atClosing + cost.otherPaid.beforeClosing;
        }

        function isAmountValid(amount) {
            return amount != null && !isNaN(parseFloat(amount));
        }

        function getFloatValue(amount) {
            return isAmountValid(amount) ? parseFloat(amount) : 0;
        }

        function calculateCostsOnCloseDateChanged(costs, closingDate, impoundSchedules, stateName) {
            for (var i = 0; i < costs.length; i++) {
                if (costs[i].hudLineNumber == 901 || costs[i].originalHUDLineNumber == 901) {
                    var days = this.commonService.compareDatesCustom(closingDate, costs[i].closingDateEnd, enums.timeInterval.days);
                    var amount = costs[i].interestRate * days;

                    costs[i].amount = amount;
                    costs[i].borrowerPaid.atClosing = amount;
                    resetRightSectionAmounts(costs[i]);
                }

                if (costs[i].hudLineNumber == 1002 || costs[i].originalHUDLineNumber == 1002) {
                    var numberOfMonthsHoi = getEscrowNumberOfMonths(impoundSchedules, closingDate, costs[i].hudLineNumber, null);
                    var amount = calculateCostImpounds(costs[i].preferredPaymentPeriod, numberOfMonthsHoi, costs[i].amountPerMonth * 12);

                    costs[i].amount = amount;
                    costs[i].amountPerMonth = costs[i].amount / numberOfMonthsHoi;
                    costs[i].monthsToBePaid = costs[i].originalMonthsToBePaid = numberOfMonthsHoi;
                    costs[i].borrowerPaid.atClosing = amount;
                    resetRightSectionAmounts(costs[i]);
                }

                if (costs[i].hudLineNumber == 1004 || costs[i].originalHUDLineNumber == 1004) {
                    var numberOfMonths = getEscrowNumberOfMonths(impoundSchedules, closingDate, costs[i].hudLineNumber, stateName);
                    var amount = calculateCostImpounds(costs[i].preferredPaymentPeriod, numberOfMonths, costs[i].amountPerMonth * 12);

                    costs[i].amount = amount;
                    costs[i].amountPerMonth = costs[i].amount / numberOfMonths;
                    costs[i].monthsToBePaid = costs[i].originalMonthsToBePaid = numberOfMonths;
                    costs[i].borrowerPaid.atClosing = amount;
                    resetRightSectionAmounts(costs[i]);
                }
            }
        }

        function calculateCostImpounds (preferredPaymentPeriod, numberOfMonths, userEnteredAmount){

            var amount = 0;

            if (preferredPaymentPeriod == 1) {
                amount = (Math.round(userEnteredAmount * 10000) / 10000) * numberOfMonths;
            }
            else {
                amount = (Math.round(userEnteredAmount / 12 * 10000) / 10000) * numberOfMonths;
            }

            return amount;
        }

        function getEscrowNumberOfMonths (impoundSchedules, closingDate, hudlineNumber, stateName){

            var numberOfMonths = 0;
            var closingDateMonth = new Date(closingDate).getMonth() + 1; // in javascript's Date, months are counted 0-11

            if (hudlineNumber == 1004) {
                numberOfMonths = impoundSchedules.filter(function(e) {
                    return e.hudLine == 1004 && e.month == closingDateMonth && e.state == stateName;
                })[0].impoundsOpen;
                
            } else if (hudlineNumber == 1002) {
                numberOfMonths = impoundSchedules.filter(function (e){ 
                    return e.hudLine == 1002; 
                })[0].impoundsOpen;
            }

            return numberOfMonths;
        }

        function resetRightSectionAmounts(cost) {
            cost.borrowerPaid.beforeClosing = 0;
            cost.sellerPaid.atClosing = 0;
            cost.sellerPaid.beforeClosing = 0;
            cost.otherPaid.atClosing = 0;
            cost.otherPaid.beforeClosing = 0;
        }
       
        function recalculateRightSectionAmounts(cost, model, rightSectionPaidType, borrowerPaidMax, atClose: boolean = true) {

            var diffBetweenSumAndMax = diferenceBetweenSumAndMax(cost, borrowerPaidMax, atClose);
            var diffBetweenMaxAndSumOfAllCostsInRightSection = borrowerPaidMax - sumOfRightSection(cost);
            var borrowerPaidAmount = !atClose ? cost.borrowerPaid.beforeClosing : cost.borrowerPaid.atClosing;

            if (diffBetweenMaxAndSumOfAllCostsInRightSection > 0) {
                setBorrowerPaidAmount(cost.borrowerPaid, borrowerPaidAmount + diffBetweenMaxAndSumOfAllCostsInRightSection, atClose);
            }
            else if (diffBetweenSumAndMax > 0) {
                setBorrowerPaidAmount(cost.borrowerPaid, diffBetweenSumAndMax, atClose);
            }
            else {
                model[rightSectionPaidType] = borrowerPaidAmount + (borrowerPaidMax - sumAllExcept(cost, model, rightSectionPaidType));
                setBorrowerPaidAmount(cost.borrowerPaid, 0, atClose);
            }
        }

        function setBorrowerPaidAmount(borrowerPaid, amount, atClose: boolean) {
            if (!atClose)
                borrowerPaid.beforeClosing = amount;
            else
                borrowerPaid.atClosing = amount;
        }

        function sumAllExcept(cost, model, costPaidWhenTypes) {
            var sum = 0;
            for (var key in enums.costPaymentTypes) {
                if (cost[key] == model)
                    sum += costPaidWhenTypes != enums.costPaidWhenTypes.atClosing ? cost[key].atClosing : cost[key].beforeClosing;
                else 
                    sum += cost[key].atClosing + cost[key].beforeClosing;
            }
            return sum;
        }

        function sumOfRightSection(cost) {
            return cost.borrowerPaid.atClosing + cost.borrowerPaid.beforeClosing + cost.sellerPaid.atClosing + cost.sellerPaid.beforeClosing + cost.otherPaid.atClosing + cost.otherPaid.beforeClosing;
        }

        function diferenceBetweenSumAndMax(cost, borrowerPaidMax, atClose: boolean) {
            return borrowerPaidMax - sumAllExcept(cost, cost.borrowerPaid, atClose ? enums.costPaidWhenTypes.atClosing : enums.costPaidWhenTypes.beforeClosing);
        }

        function calculateBorrowerPTCAmount(cost, closingDate) {
            return cost.templateId == 4 ?
                cost.monthsToBePaid * $filter('impRound')(cost.amountPerMonth, 2) :
                commonService.compareDatesCustom(closingDate, cost.closingDateEnd, enums.timeInterval.days) * $filter('impRound')(cost.interestRate, 2);
        }

        function updateImpounds(data, wrappedLoan) {
            if (!data || !data.costs || !wrappedLoan)
                return;

            for (var i = 0; i < data.costs.length; i++) {
                var newCost = data.costs[i];
                if (!newCost.amountPerMonth)
                    newCost.amountPerMonth = 0;
                var matchingCosts = [];
                if (newCost.hudLineNumber == 1002 || newCost.hudLineNumber == 1003 || newCost.hudLineNumber == 1004 || newCost.hudLineNumber == 1006)
                    matchingCosts = _.where(wrappedLoan.ref.closingCost.costs, { hudLineNumber: newCost.hudLineNumber });
                else
                    matchingCosts = _.where(wrappedLoan.ref.closingCost.costs, { costId: newCost.costId });

                if (!matchingCosts.length) {
                    wrappedLoan.ref.closingCost.costs.push(matchingCosts[0]);
                }
                else {
                    var oldCost = matchingCosts[0];

                    oldCost.amountPerMonth = newCost.amountPerMonth;
                    oldCost.monthsToBePaid = newCost.monthsToBePaid;
                    if (!oldCost.originalMonthsToBePaid || oldCost.originalMonthsToBePaid < 0)
                        oldCost.originalMonthsToBePaid = newCost.monthsToBePaid;
                    oldCost.preferredPaymentPeriod = newCost.preferredPaymentPeriod;
                    oldCost.amount = newCost.amountPerMonth * newCost.monthsToBePaid;
                    if (newCost.hudLineNumber != 1003 || newCost.amountMethod == srv.AmountMethodEnum.MonthlyMI)
                        oldCost.borrowerPaid.atClosing = newCost.amountPerMonth * newCost.monthsToBePaid;
                    oldCost.amountMethod = newCost.amountMethod;
                    oldCost.percent = newCost.percent;
                    oldCost.impounded = newCost.impounded;
                    oldCost.itemizedPropertyTaxes = newCost.itemizedPropertyTaxes;
                    oldCost.periodPaymentMonths = newCost.periodPaymentMonths;
                    oldCost.upfrontPreferredPaymentPeriod = newCost.upfrontPreferredPaymentPeriod;
                    oldCost.editMode = newCost.editMode;
                    oldCost.isLocked = newCost.isLocked;

                    switch (oldCost.hudLineNumber) {
                        case 1004:
                            wrappedLoan.ref.housingExpenses.newTaxes = oldCost.amountPerMonth;
                            break;
                        case 1002:
                            wrappedLoan.ref.housingExpenses.newHazardInsurance = oldCost.amountPerMonth;
                            break;
                        case 1006:
                            wrappedLoan.ref.housingExpenses.newFloodInsurance = oldCost.amountPerMonth;
                            break;
                        case 1003:
                            if (newCost.amountMethod == srv.AmountMethodEnum.MonthlyMI)
                                wrappedLoan.ref.housingExpenses.newMtgInsurance = oldCost.amountPerMonth;
                            break;
                    }

                    if (newCost.hudLineNumber != 1003 || newCost.amountMethod == srv.AmountMethodEnum.MonthlyMI) {
                        resetRightSectionAmounts(oldCost);
                        oldCost.borrowerPaid.atClosing = calculateBorrowerPTCAmount(oldCost, wrappedLoan.ref.closingDate.dateValue);
                    }
                }
            }

            wrappedLoan.ref.housingExpenses.newHoa = data.HOAExpens.amountPerMonth;
        }

        

        // Group loan costs and other costs by sections (A,B,C...)
        function groupCostsBySections() {
            costDetailsSvc.costDetailsData.loanCosts = [];
            costDetailsSvc.costDetailsData.otherCosts = [];
            costDetailsSvc.costDetailsData.lenderCreditsCosts = [];
            angular.forEach(costDetailsSvc.wrappedLoan.ref.closingCost.costs, function (cost) {
                if (cost.costContainer == enums.CostContainer.LoanCosts)
                    costDetailsSvc.costDetailsData.loanCosts.push(cost);
                else if (cost.costContainer == enums.CostContainer.OtherCosts)
                    costDetailsSvc.costDetailsData.otherCosts.push(cost);
                else if (cost.costContainer == enums.CostContainer.LenderCredits) {
                    costDetailsSvc.costDetailsData.lenderCreditsCosts.push(cost);
                }
            });

            costDetailsSvc.costDetailsData.groupedLoanCosts = _.groupBy(costDetailsSvc.costDetailsData.loanCosts, 'sectionName');
            costDetailsSvc.costDetailsData.groupedOtherCosts = _.groupBy(costDetailsSvc.costDetailsData.otherCosts, 'sectionName');
        }

        function initializeTotals() {
            costDetailsSvc.wrappedLoan.ref.closingCost.totals = {};
            costDetailsSvc.wrappedLoan.ref.closingCost.totals.loanCosts = {};
            costDetailsSvc.wrappedLoan.ref.closingCost.totals.otherCosts = {};
            costDetailsSvc.wrappedLoan.ref.closingCost.totals.closingCosts = {};
            resetClosingCostsTotals(costDetailsSvc.wrappedLoan.ref.closingCost.totals.closingCosts);
            costDetailsSvc.wrappedLoan.ref.closingCost.totals.payOffSection = {};
            costDetailsSvc.wrappedLoan.ref.closingCost.totals.lenderCredits = 0;
            costDetailsSvc.wrappedLoan.ref.closingCost.totals.totalLenderRebate = 0;
            costDetailsSvc.wrappedLoan.ref.closingCost.totals.totalLenderPaidFees = 0;
            costDetailsSvc.wrappedLoan.ref.closingCost.totals.calculatedCashToClose = {};
            costDetailsSvc.wrappedLoan.ref.closingCost.totals.recordingFeesTotal = 0;
            costDetailsSvc.wrappedLoan.ref.closingCost.totals.taxesTotal = 0;
        }

        function isOtherInsurance(cost) {
            return (cost.hudLineNumber == 1010 || cost.hudLineNumber == 1007 || cost.hudLineNumber == 1012 || cost.originalHUDLineNumber == 1010 || cost.originalHUDLineNumber == 1007 || cost.originalHUDLineNumber == 1012);
        }

        /*
         * @desc:Calculate AllowableBorrowerPaidClosingCost
        */
        function calculateAllowableBorrowerPaidClosingCost() {
            return costDetailsSvc.wrappedLoan.ref.closingCost.totals.loanCosts.borrowerTotal +
                (costDetailsSvc.wrappedLoan.ref.closingCost.totals.otherCosts.borrowerTotal - calculateSectionTotal(srv.CostSectionTypeEnum.Prepaids));
        }
    }
})();
