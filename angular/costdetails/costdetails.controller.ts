/// <reference path="../../scripts/typings/moment/moment.d.ts" />
/// <reference path="../loanevents/loanevents.service.ts" />
/// <reference path="../loanevents/eventhandler.ts" />
/// <reference path="../../scripts/typings/underscore/underscore.d.ts" />
/// <reference path="../ts/lib/identitygenerator.ts" />
/// <reference path="../ts/lib/common.util.ts" />
/// <reference path="../ts/generated/enums.ts" />
/// <reference path="../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../ts/generated/viewModels.ts" />
/// <reference path="../ts/generated/viewModelClasses.ts" />
/// <reference path="../ts/extendedViewModels/extendedViewModels.ts" />

(function () {
    'use strict';

    angular.module('loanCenter').controller('CostDetailsCtrl', costDetailsController);

    costDetailsController.$inject = ['$q', '$state', '$filter', '$rootScope', 'pricingResultsSvc', 'BroadcastSvc', 'commonService', 'costDetailsHelpers', 'costDetailsSvc', 'enums',
        'NavigationSvc', 'wrappedLoan', 'simpleModalWindowFactory', 'applicationData', '$window', 'modalPopoverFactory', '$controller', '$scope',
        'commonintegrationsSvc', '$http', 'blockUI', 'signalrFactory', 'loanEvent', 'vaCenterService', '$stateParams', 'ImpoundCalculatorHelpersSvc'];

    function costDetailsController($q, $state, $filter, $rootScope, pricingResultsSvc, BroadcastSvc, commonService, costDetailsHelpers, costDetailsSvc, enums,
        NavigationSvc, wrappedLoan: lib.referenceWrapper<srv.ILoanViewModel>, simpleModalWindowFactory, applicationData, $window, modalPopoverFactory, $controller, $scope,
        commonintegrationsSvc, $http, blockUI, signalrFactory, loanEvent, vaCenterService, $stateParams, ImpoundCalculatorHelpersSvc) {

        var vm = this;

        initializeController();
        getCostDetailsData();

        vm.hoverIn = hoverIn;
        vm.hoverOut = hoverOut;
        vm.hoverInSection = hoverInSection;
        vm.hoverOutSection = hoverOutSection;
        vm.rowClick = rowClick;
        vm.payOffItemRowClick = payOffItemRowClick;
        vm.addCost = addCost;
        vm.addPayoffItem = addPayoffItem;
        vm.deleteCost = deleteCost;
        vm.deletePayoffItem = deletePayoffItem;
        vm.costTypeChanged = costTypeChanged;
        vm.cancelChanges = cancelChanges;
        vm.getSectionCostTypes = getSectionCostTypes;
        vm.getPayOffComments = getPayOffComments;
        vm.getPayOffCommentText = getPayOffCommentText;
        vm.payoffCommentChanged = payoffCommentChanged;
        vm.isOptionDisabled = isOptionDisabled;
        vm.calculateTotals = calculateTotals;
        vm.calculateLoanCostsTotals = calculateLoanCostsTotals;
        vm.calculateOtherCostsTotals = calculateOtherCostsTotals;
        vm.calculatePayOffTotals = calculatePayOffTotals;
        vm.calculateTaxesAndRecordingsTotals = calculateTaxesAndRecordingsTotals;
        vm.includeInTotalChanged = includeInTotalChanged;
        vm.amountPerMonthChanged = amountPerMonthChanged;
        vm.borrowerPaidAmountChanged = borrowerPaidAmountChanged;
        vm.amountClosingDataChange = amountClosingDataChange;
        vm.payOffFilter = payOffFilter;
        vm.removedItemsFilter = removedItemsFilter;
        vm.zeroItemsFilter = zeroItemsFilter;
        vm.removedLenderItemsFilter = removedLenderItemsFilter;
        vm.lenderCreditRowClick = lenderCreditRowClick;
        vm.addLenderCreditItem = addLenderCreditItem;
        vm.lenderAmountChange = lenderAmountChange;
        vm.deleteLenderCreditItem = deleteLenderCreditItem;     
        vm.getCashToCloseTotalsText = getCashToCloseTotalsText;
        vm.saveAll = saveAll;
        vm.hideRemainigRebate = hideRemainigRebate;
        vm.isCostFullyPaidByRebate = isCostFullyPaidByRebate;
        vm.isCostPartiallyPaidByRebate = isCostPartiallyPaidByRebate;
        vm.isLoanCostRowDisabled = isLoanCostRowDisabled;
        vm.disableRightSection = disableRightSection;
        vm.disableBorrowerPaid = disableBorrowerPaid;
        vm.showLoanEstimateFeePopup = showLoanEstimateFeePopup;
        vm.isCostImpounded = isCostImpounded;
        vm.isInitialEscrowPaymentSection = isInitialEscrowPaymentSection;
        vm.checkVaRules = checkVaRules;

        vm.isTaxOrInsuranceCost = isTaxOrInsuranceCost;
        vm.onRightSectionAmountBlur = onRightSectionAmountBlur;
        vm.openImpoundCalculator = openImpoundCalculator;
        vm.openItemizedPropertyTaxCalculator = openItemizedPropertyTaxCalculator;
        vm.isItemizeCalculatorVisible = isItemizeCalculatorVisible;
        vm.recalculateAggregateAdjustment = recalculateAggregateAdjustment;
        vm.calculateAggregateAdjustmentIndex = calculateAggregateAdjustmentIndex;
        vm.isAggregateAdjustmentIndexOdd = isAggregateAdjustmentIndexOdd;

        vm.refreshSmartGFE = refreshSmartGFE;
        vm.createSmartGFE = createSmartGFE;

        vm.showSmartGfeRefreshButton;

        vm.isAddItemToPayoffsEnabled = false;

        var smartGfeSignalRCostUpdate = smartGfeSignalrFunction;
        NavigationSvc.contextualType = enums.ContextualTypes.CostDetails;

        getTransactionsData();

        $scope.$on('CostsRecalculated', function (event, totals) {
            getCostDetailsData(true);
        });

        function calculateTotals(){
            costDetailsHelpers.calculateCostTotals();
        }

        function initializeController() {
            vm.wrappedLoan = wrappedLoan;
            vm.applicationData = applicationData;
            vm.enums = enums;
            vm.closingCostsRW = applicationData.currentUser.hasPrivilege(enums.privileges.ClosingCostsRW);

            vm.isRefinance = (wrappedLoan.ref.loanPurposeType === enums.LoanTransactionTypes.Refinance);
            vm.creditPayoffItemsCount = 0;
            vm.aggregateAdjustmentIndex = 1;

            vm.borrowerDataK = {};
            vm.borrowerDataL = {};
            vm.sellerDataM = {};
            vm.sellerDataN = {};
        }

        function getCostDetailsData(costsRecalculated: boolean = false) {            
            if (!costsRecalculated || !costDetailsSvc.costDetailsData || !costDetailsSvc.costDetailsData.loanCosts) {
                costDetailsHelpers.getCostDetailsData();
                    }

            vm.closingCostViewModel = costDetailsSvc.wrappedLoan.ref.closingCost; 
            vm.costDetailsData = costDetailsSvc.costDetailsData;

            BroadcastSvc.broadcastCostDetailsLoaded();
                }

        function checkVaRules() {
            if (vm.wrappedLoan.ref.vaInformation && vm.wrappedLoan.ref.vaInformation.isvaLoan && !$stateParams.redirectedFromLoanDetailsVaAlertModal) {
                vaCenterService.isVAFeeLimitExceeded(vm.wrappedLoan.ref.closingCost, vm.wrappedLoan.ref.detailsOfTransaction.totalLoanAmount).$promise.then(function (data) {
                    vaCenterService.openVaFeeExceededAlertModal(data.vaFeeLimitExceededResults);
                    vm.wrappedLoan.ref.updateGovermentEligibility(srv.MortgageTypeEnum.VA, !data.vaFeeLimitExceededResults.length);
                }, function(error){
                    console.log(error);
                });
            }
        }

        function hoverIn(loanCost, mainModel) {
            if (loanCost.canEdit == true) {
                loanCost.hoverEdit = true;
                mainModel.hoverEdit = true;
            }
        };

        function hoverOut(loanCost, mainModel) {
            if (loanCost.editMode != true) {
                loanCost.hoverEdit = false;
            }
            mainModel.hoverEdit = false;
        };


        function hoverInSection(loanCost) {
            //if (loanCost.CanBeAdd == true) {
            loanCost.hoverEdit = true;
            //}
        };

        function hoverOutSection(loanCost) {
            loanCost.hoverEdit = false;
        };

        function rowClick(cost, useLoanCostsList) {
            if (!vm.closingCostsRW) {
                return;
            }
            cost.editMode = true;
            cost.hoverEdit = true;

            if (!vm.isLoanCostRowDisabled(cost))
                return;

            // Fix cost type dropdown text if it doesn't match system cost's value
            var costTypes = getSectionCostTypes(useLoanCostsList, cost.sectionId);
            var alreadyAdded = false;
            angular.forEach(costTypes, function (costType) {
                if (!alreadyAdded && costType.value == cost.uniqueCostTypeId) {
                    if (cost.name && cost.name != costType.text) {
                        addNewCostType(cost, costType, costTypes);
                    }

                    alreadyAdded = true;
                }
            });

            // If cost wasn't found in cost type list, then add it based on cost's values
            if (!alreadyAdded) {
                if (cost.uniqueCostTypeId == "0") {
                    cost.uniqueCostTypeId = getUniqueCostTypeId(cost);
                }

                addNewCostType(cost, cost, costTypes);
            }
        }

        function addNewCostType(cost, costType, costTypes) {
            // Add new cost type in dropdown list
            var newCostType = {
                text: cost.name,
                value: getUniqueCostTypeId(cost),
                costGroupId: costType.costGroupId,
                costTypeGroupCategory: costType.costTypeGroupCategory,
                hudLineNumber: cost.hudLineNumber,
                isAprCost: cost.isAprCost,
                mustBeUnique: true,
                orderNo: costType.orderNo,
                subHUDLineNumber: cost.subHUDLineNumber,
                templateId: costType.templateId,
                templateUrl: costType.templateUrl,
                toleranceLevel: costType.toleranceLevel,
                totalRow: costType.totalRow,
                vaAllowableType: costType.vaAllowableType,
            };

            if (cost.uniqueCostTypeId == newCostType.value && cost.name != costType.name)
                newCostType.value = newCostType.value + ".a";

            cost.uniqueCostTypeId = newCostType.value;
            cost.mustBeUnique = true;
            costTypes.push(newCostType);
            costDetailsSvc.costDetailsData.usedLoanCostTypes = [];
            costDetailsSvc.costDetailsData.usedOtherCostTypes = [];
            costDetailsHelpers.getAllUsedCostTypes(costDetailsSvc.costDetailsData.usedLoanCostTypes, costDetailsSvc.costDetailsData.usedOtherCostTypes, costDetailsSvc.costDetailsData.loanCosts, costDetailsSvc.costDetailsData.otherCosts);
        }

        function getUniqueCostTypeId(cost) {
            return !cost.subHUDLineNumber ? cost.hudLineNumber.toString() : cost.hudLineNumber + "." + cost.subHUDLineNumber;
        }

        function payOffItemRowClick(payOffItem) {
            if (vm.closingCostsRW) {
                payOffItem.editMode = true;
                payOffItem.hoverEdit = true;
            }
        }

        function isLoanCostRowDisabled(loanCost) {
            return vm.savingDataInProgress || vm.closingCostViewModel.disableFields || !loanCost.userAdded  || !vm.closingCostsRW;
        }

        function disableRightSection(cost) {
            return (cost.hudLineNumber == 801 && cost.subHUDLineNumber == "e" && cost.costId != lib.getEmptyGuid()) || (cost.borrowerPaid.atClosing < 0 && cost.templateId == 5);
        }

        function disableBorrowerPaid(cost) {
            return cost.templateId == 5 || cost.templateId == 4;
        }

        function onRightSectionAmountBlur(cost, model, rightSectionPaidType) {
            if (cost.templateId != 5 && cost.templateId != 4 && cost.hudLineNumber != 1003)
                return;

            if (cost.templateId == 5 || cost.templateId == 4) {
            var borrowerPaidAtClose = costDetailsHelpers.calculateBorrowerPTCAmount(cost, vm.wrappedLoan.ref.closingDate.dateValue);
            costDetailsHelpers.recalculateRightSectionAmounts(cost, model, rightSectionPaidType, borrowerPaidAtClose);
            }
            else {
                // Single Premium Mortgage Insurance Cost
                var borrowerPaidMax = $filter('impRound')(cost.amountPerMonth, 2);
                var atClose: boolean = cost.upfrontPreferredPaymentPeriod == srv.UpfrontPreferredPaymentPeriodEnum.Financed;
                costDetailsHelpers.recalculateRightSectionAmounts(cost, model, rightSectionPaidType, borrowerPaidMax, atClose);
            }

            calculateTotals();
        }
        
        function addCost(useLoanCostsList, section) {
            if (vm.savingDataInProgress || vm.closingCostViewModel.disableFields || !vm.closingCostsRW)
                return;

            // Get first item in section cost list - which is an empty pre-configured record
            var originalItem = section[0];
            var newItem = angular.copy(originalItem);
            newItem.isRemoved = false;
            newItem.canBeLocked = true;
            newItem.editMode = true;
            newItem.hoverEdit = true;
            newItem.costContainer = useLoanCostsList ? enums.CostContainer.LoanCosts : enums.CostContainer.OtherCosts;
            newItem.loanId = wrappedLoan.ref.loanId;
            newItem.LoanTransactionType = wrappedLoan.ref.loanPurposeType;
            newItem.serviceProvider = srv.ServiceProviderEnum.BorrowerSelected;
            newItem.isLocked = true;
            newItem.costId = util.IdentityGenerator.nextGuid();
            newItem.userAdded = true;

            // Add costType based on section (Third Party is default)
            if (originalItem.costSection == 'G') {
                newItem.impounded = true;
                newItem.costType = enums.CostTypeEnum.EstimatedReservesDepositedwithLender;
                vm.aggregateAdjustmentIndex++;
            }
            else if (originalItem.costSection == 'F')
                newItem.costType = enums.CostTypeEnum.Prepaids;
            else if (originalItem.costSection == 'A')
                newItem.costType = enums.CostTypeEnum.EstimatedLenderCosts;

            vm.closingCostViewModel.costs.push(newItem);

            costDetailsHelpers.groupCostsBySections();
        }

        function addPayoffItem() {
            if (vm.savingDataInProgress || vm.closingCostViewModel.disableFields)
                return;

            var originalItem = vm.closingCostViewModel.payOffSection.payOffItems[0];
            var newItem = angular.copy(originalItem);
            newItem.isRemoved = false;
            newItem.editMode = true;
            newItem.hoverEdit = true;
            newItem.loanId = wrappedLoan.ref.loanId;
            vm.closingCostViewModel.payOffSection.payOffItems.push(newItem);
        }

        function deleteCost(cost) {
            if (vm.savingDataInProgress || vm.closingCostViewModel.disableFields)
                return;

            cost.isRemoved = true;            
            if (cost.sectionId == 6) {
                vm.aggregateAdjustmentIndex--;
            }
            costDetailsHelpers.calculateCostTotals();
            costDetailsSvc.costDetailsData.usedLoanCostTypes = [];
            costDetailsSvc.costDetailsData.usedOtherCostTypes = [];
            costDetailsHelpers.getAllUsedCostTypes(costDetailsSvc.costDetailsData.usedLoanCostTypes, costDetailsSvc.costDetailsData.usedOtherCostTypes, costDetailsSvc.costDetailsData.loanCosts, costDetailsSvc.costDetailsData.otherCosts);
        }

        function deletePayoffItem(payoffItem) {
            if (vm.savingDataInProgress || vm.closingCostViewModel.disableFields)
                return;

            payoffItem.isRemoved = true;
            costDetailsHelpers.calculatePayOffTotals();
            costDetailsHelpers.setCreditPayoffItemsCount();
        }

        function calculatePayOffTotals() {
            costDetailsHelpers.calculatePayOffTotals();
        }

        function costTypeChanged(cost, useLoanCostsList) {
            var costTypes = getSectionCostTypes(useLoanCostsList, cost.sectionId);
            angular.forEach(costTypes, function (costType) {
                if (costType.value == cost.uniqueCostTypeId) {
                    cost.hudLineNumber = cost.originalHUDLineNumber = costType.hudLineNumber;
                    cost.subHUDLineNumber = cost.originalSubHUDLineNumber = costType.subHUDLineNumber;
                    cost.templateId = costType.templateId;
                    cost.templateUrl = costType.templateUrl;
                    cost.costTypeGroupCategory = costType.costTypeGroupCategory;
                    cost.mustBeUnique = costType.mustBeUnique;
                    cost.name = costType.text;
                    cost.isAprCost = costType.isAprCost;
                    cost.toleranceLevel = costType.toleranceLevel;
                    cost.costTypeId = costType.costGroupId;                    
                    cost.totalRow = costType.totalRow;
                    cost.vaAllowableType = costType.vaAllowableType;
                    cost.feeCategory = costType.feeCategory;
                }
            });

            costDetailsHelpers.calculateCostTotals();
            costDetailsSvc.costDetailsData.usedLoanCostTypes = [];
            costDetailsSvc.costDetailsData.usedOtherCostTypes = [];
            costDetailsHelpers.getAllUsedCostTypes(costDetailsSvc.costDetailsData.usedLoanCostTypes, costDetailsSvc.costDetailsData.usedOtherCostTypes, costDetailsSvc.costDetailsData.loanCosts, costDetailsSvc.costDetailsData.otherCosts);
        }

        function cancelChanges() {
            vm.showLoader = true;
            vm.showErrorContainer = false;
            NavigationSvc.cancelChanges(wrappedLoan.ref.loanId);
            getCostDetailsData();
        }

        function getSectionCostTypes(useLoanCostsList, sectionId) {
            if (useLoanCostsList)
                return vm.closingCostViewModel.loanCostTypes[sectionId];

            return vm.closingCostViewModel.otherCostTypes[sectionId];
        }

        function isOptionDisabled(useLoanCostsList, dropdownCostTypeValue, uniqueCostTypeId) {
            // Enable option if it is selected for this dropdown
            if (dropdownCostTypeValue == uniqueCostTypeId)
                return false;

            // For MI cost check both lists (loan costs and other costs) to make sure 1003 cost is unique
            if (dropdownCostTypeValue == 1003) {
                return (costDetailsSvc.costDetailsData.usedLoanCostTypes.indexOf(dropdownCostTypeValue) != -1) || (costDetailsSvc.costDetailsData.usedOtherCostTypes.indexOf(dropdownCostTypeValue) != -1);
            }

            // Disable option if cost type is already in use within other rows/sections
            if (useLoanCostsList) {
                if (costDetailsSvc.costDetailsData.usedLoanCostTypes.indexOf(dropdownCostTypeValue) != -1)
                    return true;
            }
            else if (costDetailsSvc.costDetailsData.usedOtherCostTypes.indexOf(dropdownCostTypeValue) != -1) {
                return true;
            }

            return false;
        }

        function amountPerMonthChanged(cost) {

            if (cost.hudLineNumber == 1002 || cost.hudLineNumber == 1003 || cost.hudLineNumber == 1004)
                cost.percent = 0;

            costDetailsHelpers.resetRightSectionAmounts(cost);

            cost.borrowerPaid.atClosing = costDetailsHelpers.calculateBorrowerPTCAmount(cost, vm.wrappedLoan.ref.closingDate.dateValue)
            costDetailsHelpers.calculateCostTotals();
        }

        function borrowerPaidAmountChanged(useLoanCostsList, cost) {
           
            if (useLoanCostsList)
                calculateLoanCostsTotals();
            else
                calculateOtherCostsTotals();
        }

        function resetRightSectionAmounts(cost) {
            cost.borrowerPaid.beforeClosing = 0;
            cost.sellerPaid.atClosing = 0;
            cost.sellerPaid.beforeClosing = 0;
            cost.otherPaid.atClosing = 0;
            cost.otherPaid.beforeClosing = 0;
        }

        function amountClosingDataChange(cost) {

            costDetailsHelpers.resetRightSectionAmounts(cost);
    
            cost.borrowerPaid.atClosing = costDetailsHelpers.calculateBorrowerPTCAmount(cost, vm.wrappedLoan.ref.closingDate.dateValue)
            costDetailsHelpers.calculateCostTotals();
        }

        function calculateLoanCostsTotals() {
            costDetailsHelpers.calculateLoanCostsTotals();
            calculateCashToCloseTotals();
            BroadcastSvc.broadcastCostDetailsTotals();
        }

        function calculateOtherCostsTotals() {
            costDetailsHelpers.calculateOtherCostsTotals();
            calculateCashToCloseTotals();
            BroadcastSvc.broadcastCostDetailsTotals();
        }

        function calculateLenderCreditsTotals() {
            costDetailsHelpers.calculateLenderCreditsTotals();
            calculateCashToCloseTotals();
            BroadcastSvc.broadcastCostDetailsTotals();
        }

        function calculateCashToCloseTotals() {
            costDetailsHelpers.calculateCashToCloseTotals();
            BroadcastSvc.broadcastCostDetailsTotals();
        }

        function calculateTaxesAndRecordingsTotals() {
            costDetailsHelpers.calculateTaxesAndRecordingsTotals();
        }

        function includeInTotalChanged(cost) {
            if (cost.includeInTotal == 1) {
                var costTypes = getSectionCostTypes(false, cost.sectionId);
                angular.forEach(costTypes, function (costType) {
                    if (costType.value == cost.uniqueCostTypeId) {
                        cost.totalRow = costType.totalRow;
                    }
                });
            }
            else {
                cost.totalRow = "";
            }

            vm.calculateTaxesAndRecordingsTotals();
        }

        function getPayOffComments(payOffItem) {
            if (payOffItem.isLiability) {
                if (payOffItem.typeId == 2)
                return vm.applicationData.lookup.liabilityDebtComments;

                return vm.applicationData.lookup.collectionComments;
            }
            if (payOffItem.isPublicRecord)
                return vm.applicationData.lookup.debtComments;

            return vm.applicationData.lookup.pledgetAssetComments;
        }

        function getPayOffCommentText(payOffItem) {
            var result = "Unknown"; //This should never happen!
            var lookups = vm.applicationData.lookup.pledgetAssetComments;
            if (payOffItem.isLiability) {
                if (payOffItem.typeId == 2)
                lookups = vm.applicationData.lookup.liabilityDebtComments;
                else
                  lookups = vm.applicationData.lookup.collectionComments
            }
            if (payOffItem.isPublicRecord)
                lookups = vm.applicationData.lookup.debtComments;
            
            angular.forEach(lookups, function (lookup) {
                if (lookup.value == payOffItem.payoffCommentId)
                    result = lookup.text;
            });
            return result
        }

        function payoffCommentChanged(payoffItem) {
            costDetailsHelpers.payoffCommentChanged(payoffItem);
        }

        function payOffFilter(payoffItem){
            return costDetailsHelpers.payOffFilter(payoffItem);
        }

        function removedItemsFilter(item) {
            return !item.isRemoved;
        }
        function zeroItemsFilter(item) {
            var flagReserves = item.amountPerMonth != 0 && (item.monthsToBePaid > 0 || item.hudLineNumber == 1003);
            return item.editMode == true || flagReserves ||
                  item.borrowerPaid.atClosing != 0 || item.borrowerPaid.beforeClosing != 0 ||
                  item.sellerPaid.atClosing != 0 || item.sellerPaid.beforeClosing != 0 ||
                  item.otherPaid.atClosing != 0 || item.otherPaid.beforeClosing != 0 ||
                  item.amountMethod == srv.AmountMethodEnum.Itemized;
            
        }

        function isCostImpounded(item) {
            return (item.impounded && item.sectionId == 6) || item.sectionId != 6;
        }

        function removedLenderItemsFilter(item) {
            if (item.hudLineNumber == '802') {
                item.isHidden = vm.closingCostViewModel.totals.remainigRebate <= 0;
            }
          
            return !item.isRemoved || item.isHidden == true && item.isRemoved == false;
        }

        function lenderCreditRowClick(lenderCredit) {
            if (lenderCredit.canEdit && vm.closingCostsRW) {
                lenderCredit.editMode = true;
                lenderCredit.hoverEdit = true;
            }
        }

        function addLenderCreditItem(section) {
            if (vm.savingDataInProgress || vm.closingCostViewModel.disableFields)
                return;

            // Get first item in section cost list - which is an empty pre-configured record
            var originalItem = section[0];
            var newItem = angular.copy(originalItem);
            newItem.isRemoved = false;
            newItem.editMode = true;
            newItem.hoverEdit = true;
            newItem.costContainer = enums.CostContainer.LenderCredits;
            newItem.loanId = wrappedLoan.ref.loanId;
            newItem.isLocked = true;

            vm.closingCostViewModel.costs.push(newItem);

            costDetailsHelpers.groupCostsBySections();
        }

        function deleteLenderCreditItem(item) {
            if (vm.savingDataInProgress || vm.closingCostViewModel.disableFields)
                return;

            item.isRemoved = true;
            calculateLenderCreditsTotals();
        }

        function lenderAmountChange() {
            calculateLenderCreditsTotals();
        }       

        function getCashToCloseTotalsText(amount) {
            return parseFloat(amount) < 0 ? 'From' : 'To';
        }

        function saveAll() {
            vm.savingDataInProgress = true;
            vm.closingCostViewModel.disableFields = true;

            NavigationSvc.SaveAndUpdateWrappedLoan(applicationData.currentUserId, wrappedLoan, function (wrappedLoan) {
                vm.savingDataInProgress = false;
                vm.closingCostViewModel.disableFields = false;
                getCostDetailsData();
            }, function (error) {
                vm.savingDataInProgress = false;
                vm.closingCostViewModel.disableFields = false;
            });
        }

        function hideRemainigRebate(lenderCredit) {
            if (!(lenderCredit.hudLineNumber == '802' && vm.closingCostViewModel.totals.remainigRebate <= 0)) {
                return true;
            }
            else {
                lenderCredit.isHidden = true;
                return false;
            }
        }

        function isCostFullyPaidByRebate(cost) {
            // If the APR is fully paid by the rebate, then use the red APR icon, if the APR fee is partially paid by the rebate then use the orange APR icon
            if (cost.otherPaid.beforeClosing == 0 && cost.otherPaid.atClosing == 0 && cost.sellerPaid.beforeClosing == 0 && cost.sellerPaid.atClosing == 0)
                return false;

            return cost.borrowerPaid.beforeClosing == 0 && cost.borrowerPaid.atClosing == 0;
        }

        function isCostPartiallyPaidByRebate(cost) {
            // If the APR is fully paid by the rebate, then use the red APR icon, if the APR fee is partially paid by the rebate then use the orange APR icon
            if (cost.otherPaid.beforeClosing == 0 && cost.otherPaid.atClosing == 0 && cost.sellerPaid.beforeClosing == 0 && cost.sellerPaid.atClosing == 0)
                return false;
            
            return cost.borrowerPaid.beforeClosing != 0 || cost.borrowerPaid.atClosing != 0;
        }

        function refreshSmartGFE() {
            pricingResultsSvc.RefreshSmartGFE.Refresh(vm.wrappedLoan.ref).$promise.then(
            function (data) {
                vm.wrappedLoan.ref.closingCost.costs = data.costs;
                getCostDetailsData();
            },
            function (error) {
                console.log("Error:" + JSON.stringify(error));
            });
        }

        function createSmartGFE() {

            var deferredCreateGFE = $q.defer();
            var deferredGetToken = $q.defer();

            var createGFEResult = pricingResultsSvc.CreateSmartGFE(vm.wrappedLoan.ref).then(
                function (data) {
                    //Create Listener For SignalR
                    signalrFactory.createListener('LoanActivityHub', smartGfeSignalRCostUpdate, wrappedLoan.ref.loanId);

                    vm.wrappedLoan.ref.closingCost.smartGFEId = data.data;
                    deferredCreateGFE.resolve(data.data);
                },
                function (error) {
                    console.log("Error:" + JSON.stringify(error));
                });

            var getToken = commonintegrationsSvc.services.getClosingCorpSSOToken({ path: 'GetClosingCorpSSOToken'
            }, {
            }, function () {
                blockUI.start('Loading...');
                deferredGetToken.resolve(getToken);
            });

            var token;
            var apiKey;
            var postPage;
            $q.all([
                deferredGetToken.promise,
                deferredCreateGFE.promise
            ]).then(function (data) {
                token = data[0].token;
                apiKey = data[0].apiKey;
                vm.showSmartGfeRefreshButton = data[0].showSmartGfeRefreshButton;
                postPage = data[0].postPage;
                blockUI.stop();
                $state.go("loanCenter.loan.cost.details.redirection", { token: token, apiKey: apiKey, smartGFEId: vm.wrappedLoan.ref.closingCost.smartGFEId, postUrl: postPage });
            });

            }

        function getTransactionsData() {
            vm.borrowerDataK = {
                dueItems: [
                    { name: "Sale Price of Property", cost: "180000"
                    },
                    { name: "Sale price of Any Personal Property Included in Sale", cost: "0"
                    },
                    { name: "Closing Costs Paid at Closing (J)", cost: "9682.30" },
                ],
                adjust: [
                { name: "Example Line Item", cost: "900.00" }],
                adjustPaid: [
                        { name: "City/Town Taxes", startDate: "04/15/2005", endDate: "09/15/2005", cost: "300"
                    },
                        { name: "County Taxes", startDate: "04/15/2007", endDate: "04/15/2008", cost: "600"
                    },
                        { name: "Assessments", startDate: "04/15/2012", endDate: "04/30/2013", cost: "40"
                    },
                    { name: "HOA Dues", startDate: "04/15/2015", endDate: "04/30/2017", cost: "80.00" }
                ]
            };

            vm.borrowerDataL = {
                credits: [
                    { name: "Deposit", cost: "10,000.00"
                    },
                    { name: "Loan Amount", cost: "162,000.00"
                    },
                    { name: "Existing Loan(s) Assumed or Taken Subject to", cost: ""
                    },
                { name: "Seller Credit", cost: "2,500.00" },
                ],
                otherCredits: [
                { name: "", cost: "" }],
                adjust: [
                { name: "", cost: "" }],
                adjustUnPaid: [
                        { name: "City/Town Taxes", startDate: "1/1/15", endDate: "4/14/15", cost: "365.04"
                    },
                        { name: "County Taxes", startDate: "", endDate: "", cost: ""
                    },
                    { name: "Assessments", startDate: "", endDate: "", cost: "" }
                ]
            };

            vm.sellerDataM = {
                dueItems: [
                    { name: "Sale Price of Property", cost: "180,000"
                    },
                { name: "Sale price of Any Personal Property Included in Sale", cost: "" },
                ],
                adjustPaid: [
                        { name: "City/Town Taxes", startDate: "", endDate: "", cost: ""
                    },
                        { name: "County Taxes", startDate: "", endDate: "", cost: ""
                    },
                        { name: "Assessments", startDate: "", endDate: "", cost: ""
                    },
                    { name: "HOA Dues", startDate: "4/15/15", endDate: "4/30/15", cost: "-80.00" }
                ]
            };

            vm.sellerDataN = {
                credits: [
                    { name: "Excess Deposit", cost: ""
                    },
                    { name: "Closing Costs Paid at Closing (J)", cost: "12,800.00"
                    },
                    { name: "Existing Loan(s) Assumed or Taken Subject to", cost: ""
                    },
                    { name: "Payoff of First Mortgage Loan", cost: "100,000.00"
                    },
                    { name: "Payoff of Second Mortgage Loan", cost: ""
                    },
                { name: "Seller Credit", cost: "2,500.00" },
                ],
                adjustUnpaid: [
                        { name: "City/Town Taxes", startDate: "1/1/15", endDate: "4/14/15", cost: "365.04"
                    },
                        { name: "County Taxes", startDate: "", endDate: "", cost: ""
                    },
                    { name: "Assessments", startDate: "", endDate: "", cost: "" }
                ]
            };
        }

        function showLoanEstimateFeePopup(model, event) {

            var initialModel = angular.copy(model);
            if (!initialModel.toleranceLevel && initialModel.toleranceLevel != 0)
                initialModel.toleranceLevel = 100;

            var ctrl = {
                itemModalTitle: "Loan Estimate Fees",
                serviceProviderChanged: serviceProviderChanged,
                loanEstimateFeeAmountChanged: loanEstimateFeeAmountChanged,
                disableTolerance: disableEstimateFeeTolerance,
                serviceProviderTypes: vm.applicationData.lookup.serviceProviderTypes
            };

            modalPopoverFactory.openModalPopover('angular/costdetails/loanestimatefees.html', ctrl, initialModel, event)
                .result.then(function (data) {
                    model.useLoanEstimateFee = data.useLoanEstimateFee || data.useLoanEstimateFee == 'true';
                    model.loanEstimateFeeAmount = data.loanEstimateFeeAmount;
                    model.serviceProvider = data.serviceProvider;
                    model.toleranceLevel = data.toleranceLevel;                    
                });
        }

        function serviceProviderChanged(model) {
            // When service provider is affiliate, tolerance level is set to zero and can't be changed, for SSP it is set to 10%
            if (model.serviceProvider == srv.ServiceProviderEnum.Affiliate)
                model.toleranceLevel = 0;
            else if (model.serviceProvider == srv.ServiceProviderEnum.SSP)
                model.toleranceLevel = 10;
        }

        function loanEstimateFeeAmountChanged(model) {
            var maxValue = 999999.99;
            // Don't allow fees above max value
            if (!isNaN(model.loanEstimateFeeAmount) && parseFloat(model.loanEstimateFeeAmount) > maxValue)
                model.loanEstimateFeeAmount = maxValue;
        }

        function disableEstimateFeeTolerance(model) {
            return model.serviceProvider == srv.ServiceProviderEnum.Affiliate;
        }

            function isInitialEscrowPaymentSection(costsInSection) {
                // Show calculator icon only on section G. INITIAL ESCOW PAYMENT AT CLOSING (6)
            if (!costsInSection || !costsInSection[0] || costsInSection[0].sectionId != 6)
                return false;

            return true;
        }

            function openImpoundCalculator(event) {

            var totalLoanAmount = vm.wrappedLoan.ref.loanAmount;
            var closingMonth = moment(vm.wrappedLoan.ref.closingDate.dateValue).month() + 1;
            if (!!vm.wrappedLoan.ref.detailsOfTransaction.totalLoanAmount)
                totalLoanAmount = vm.wrappedLoan.ref.detailsOfTransaction.totalLoanAmount;
            var subjectProperty = vm.wrappedLoan.ref.getSubjectProperty();  
                    
            var impoundCalculator = modalPopoverFactory.openModalPopover(
                'angular/common/impoundcalculator/impoundcalculator.html',
                $controller("impoundCalculatorController", { $scope: $scope.$new() }),
                {
                    isRefinance: vm.isRefinance,
                    mortageType: vm.wrappedLoan.ref.financialInfo.mortgageType,
                    isExtended: true,
                    loanAmount: totalLoanAmount,
                    applicationData: applicationData,
                    purchasePrice: subjectProperty.purchasePrice,
                    costs: vm.wrappedLoan.ref.closingCost.costs,
                    HOAExpens: { preferredPayPeriod: srv.PeriodTypeEnum.Monthly, amountPerMonth: vm.wrappedLoan.ref.housingExpenses.newHoa, amount: vm.wrappedLoan.ref.housingExpenses.newHoa },
                    paymentPeriodOptions: vm.applicationData.lookup.paymentPeriodOptions,
                    firstPaymentDate: moment(vm.wrappedLoan.ref.firstPaymentDate).format('MM/DD/YYYY'),
                    impoundSchedule: ImpoundCalculatorHelpersSvc.findImpoundScheduleByStateAndClosingMonth(vm.applicationData.impoundSchedules, subjectProperty.stateName, closingMonth),
                    MICalculatorRequest: ImpoundCalculatorHelpersSvc.createMiRequestModel(vm.wrappedLoan.ref)
                },
                event,
                { className: 'tooltip-arrow-right-cost-details', verticalPopupPositionPerHeight: 0, horisontalPopupPositionPerWidth: 0.695 }
                );

            impoundCalculator.result.then(function (data) {
                costDetailsHelpers.updateImpounds(data, vm.wrappedLoan);
                getCostDetailsData();
                calculateAggregateAdjustmentIndex(vm.wrappedLoan.ref.closingCost.costs);
                loanEvent.broadcastPropertyChangedEvent(events.LoanFieldIdentifier.AggregateAdjustment, wrappedLoan.ref.totalAggregateAdjustment);
            }, function () { 
            });
        }

            function openItemizedPropertyTaxCalculator(event, cost) {

            var itemizedPropertyTaxCalculator = modalPopoverFactory.openModalPopover(
                'angular/common/itemizedpropertytaxcalculator/itemizedpropertytaxcalculator.html',
                $controller("itemizedPropertyTaxCalculatorController",
                {
                        paymentPeriodMonths: vm.applicationData.lookup.periodPaymentMonths
            }),
                cost,
                event,
                { }
                );
            itemizedPropertyTaxCalculator.result.then(function (data) {
                var propertyTax: any = _.where(wrappedLoan.ref.closingCost.costs, { hudLineNumber: 1004 })[0];
                propertyTax.itemizedPropertyTaxes = data.itemizedPropertyTaxes;
                propertyTax.amountForYear = data.amountForYear;
                propertyTax.amountPerMonth = data.amountPerMonth;
                loanEvent.broadcastPropertyChangedEvent(events.LoanFieldIdentifier.AggregateAdjustment, wrappedLoan.ref.totalAggregateAdjustment);
            }, function () { 
            });
        }

            function isItemizeCalculatorVisible(loanCost) {
            return loanCost.hudLineNumber == 1004 && loanCost.amountMethod == srv.AmountMethodEnum.Itemized;
        }

            //Function used for SignalR
            function smartGfeSignalrFunction(loanId, parameter) {
            if (loanId == parameter) {
                refreshSmartGFE();
            }
        }

        function isTaxOrInsuranceCost(cost) {
            return cost.hudLineNumber == 1002 || (cost.hudLineNumber == 1003 && !cost.userAdded) || cost.hudLineNumber == 1004 || cost.hudLineNumber == 1006;
        }

            function recalculateAggregateAdjustment(loanCost) {
            if (loanCost.hudLineNumber == 1002 || loanCost.hudLineNumber == 1003 || loanCost.hudLineNumber == 1004 || loanCost.hudLineNumber == 1006
                    || (loanCost.isRemoved != true && costDetailsHelpers.isOtherInsurance(loanCost)))
            loanEvent.broadcastPropertyChangedEvent(events.LoanFieldIdentifier.AggregateAdjustment, wrappedLoan.ref.totalAggregateAdjustment);
        }

            function calculateAggregateAdjustmentIndex(costs) {
            vm.aggregateAdjustmentIndex = costs.filter(function (c) {
                if (vm.removedItemsFilter(c) && vm.zeroItemsFilter(c) && vm.isCostImpounded(c) && c.sectionId == 6) {
                    return c;
            }
            }).length +1;
        }

            function isAggregateAdjustmentIndexOdd() {
            return vm.aggregateAdjustmentIndex % 2 == 0;
        }

    }   
})();