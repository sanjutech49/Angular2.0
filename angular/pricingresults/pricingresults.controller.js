(function () {
    'use strict';
    angular.module('PricingResults')
        .controller('pricingResultsController', pricingResultsController);

    pricingResultsController.$inject = ['$window', '$scope', '$rootScope', '$state', '$controller', 'pricingResultsSvc', 'BroadcastSvc', 'modalPopoverFactory', 'wrappedLoan', 'controllerData', 'applicationData', 'enums', 'NavigationSvc', 'personalUtilities', '$filter', 'commonModalWindowFactory', 'modalWindowType','loanEvent', 'costDetailsHelpers'];

    function pricingResultsController($window, $scope, $rootScope, $state, $controller, pricingResultsSvc, BroadcastSvc, modalPopoverFactory, wrappedLoan, controllerData, applicationData, enums, NavigationSvc, personalUtilities, $filter, commonModalWindowFactory, modalWindowType, loanEvent, costDetailsHelpers) {
        var vm = this;
        vm.wrappedLoan = wrappedLoan;
        vm.applicationData = applicationData;
        vm.repricing = controllerData.repricing;        
        vm.sortedProductGoupsArray = controllerData.sortedProductGoupsArray,
        vm.sortedProductsArray = controllerData.sortedProductsArray,
        vm.sortedProductPricingArray = controllerData.sortedProductPricingArray,       
        vm.shoppingCartIds = controllerData.shoppingCartIds,
        vm.allProductsGrouped = controllerData.allProductsGrouped;
        vm.impoundCalculatorResults = null;

        vm.productListViewModel = wrappedLoan.ref.pricingResults.productListViewModel;
        vm.dti = wrappedLoan.ref.financialInfo.dti;

        $scope.$on('BroadcastRepopulatePricingResults', function (event, args) {
            wrappedLoan.ref.pricingResults.productListViewModel = vm.productListViewModel;
            wrappedLoan.ref.financialInfo.dti = vm.dti;
        });

        


        vm.pricingResultsViewModel = {};
        vm.test = 'controller' + Date.now();
        vm.init = init();            
        $rootScope.navigation = 'ProductAndPricing';
        vm.collapseExpand = collapseExpand;
        vm.selectedRow = null;
        vm.selectedEligibleRow = null;
        vm.selectRow = selectRow;
        vm.selectEligibleRow = selectEligibleRow;
        vm.costType = "1";
        vm.savingsDropdownOption = "1";

        vm.sortingProductGoup = { predicate: 'rate', reverse: false };
        vm.groupedProducts = {};

        vm.lockDaysNext = lockDaysNext;
        vm.lockDaysPrevious = lockDaysPrevious;
        vm.shoppingCartKeys = [];
        vm.utilities = { keys: Object.keys };

        vm.viewDetailedClosingCost = viewDetailedClosingCost;
        vm.openClosingCostMenu = openClosingCostMenu;
        vm.openLifeOfLoanMenu = openLifeOfLoanMenu;
        vm.openIntegrationXmlMenu = openIntegrationXmlMenu;
        vm.openPricePercentageOrPoints = openPricePercentageOrPoints;
        vm.priceDisplayType = 'points';
        
        vm.applyProduct = applyProduct;
        var productRowExpanded = false;

        NavigationSvc.contextualType = enums.ContextualTypes.PricingResults;

        vm.openSavingsCalculationsModal = openSavingsCalculationsModal;

        function applyProduct(product) {
            if (wrappedLoan.ref.active.getBorrower()) {
                wrappedLoan.ref.active.getBorrower().userAccount.currentUserAccountId = applicationData.currentUserId;
            }
            commonModalWindowFactory.open({ type: modalWindowType.loader, message: 'Adding Loan Product...' });
            pricingResultsSvc.ApplyLoan.Create({ productId: product.productId, currentUserId: vm.applicationData.currentUserId, repricing: vm.repricing }, wrappedLoan.ref).$promise.then(function (data) {
                if (vm.repricing) {
                    vm.wrappedLoan.ref = new cls.LoanViewModel(data, $filter);
                    costDetailsHelpers.initializeCostService(wrappedLoan);
                    costDetailsHelpers.getCostDetailsData();

                    if (angular.element(document.getElementById('divMainNavBar')).scope() != undefined)
                        angular.element(document.getElementById('divMainNavBar')).scope().updateValuesOnRowChangeNEW(vm.wrappedLoan.ref.loanId);

                    // Recalculate everything upon saving and re-loading loan:
                    loanEvent.broadcastPropertyChangedEvent(events.LoanFieldIdentifier.todo, {});
                    
                    $state.go("loanCenter.loan.loanDetails.sections", { 'repricing': true }, { reload: false });
                    }
                else
                {
                    if (angular.element(document.getElementById('divMainNavBar')).scope() != undefined)
                        angular.element(document.getElementById('divMainNavBar')).scope().updateValuesOnRowChangeNEW(data.loanId);
                    
                    $rootScope.SelectedLoan.LoanId = data.loanId;
                    NavigationSvc.setPersonalAsActiveAndRedirect(true, data.loanId);
                }
            });
            //pricing expiration on calling disclosures : capturing last pricing timestamp for evaluation of expired pricing on disclosures call
            NavigationSvc.lastRepricing.timestamp = new Date().getTime();
        };

        $scope.$on('$viewContentLoaded', function (event) {
            $window.scrollTo(0, 0);
        });

        vm.registerProduct = registerProduct;

        vm.lockDaysLimit = { min: 0, max: 2 };


  

        function init() {

            if (vm.sortedProductPricingArray && Object.keys(vm.sortedProductPricingArray).length > 0) {
                var group = vm.sortedProductPricingArray[Object.keys(vm.sortedProductPricingArray)[0]];
                var product = group[Object.keys(group)[0]];
                var pricing = product[0];

 
                if (wrappedLoan.ref.pricingResults.productListViewModel.feeProvider == 1 && wrappedLoan.ref.otherInterviewData.selectedETPCOption != "0"
                    && wrappedLoan.ref.otherInterviewData.selectedETPCOption != "1") {
                    var filteredThirdPartyCosts = pricing.costDetails.thirdPartyCosts.filter(function (c) { return c.hudLineNumber != 804; });
                    if(filteredThirdPartyCosts && filteredThirdPartyCosts.length == 0)
                        commonModalWindowFactory.open({ type: modalWindowType.error, message: 'We are unable to calculate your closing costs because we were unable to obtain current fees.' });
                }


                BroadcastSvc.broadcastSelectedProduct(pricing);

            }

        };       
       
        function registerProduct(product) {
           
            var array = vm.sortedProductPricingArray[product.productType][product.productName];
          

            if (product.register) {
                if (!array.map(function (e) { return e.productId == product.productId })[0]) {
                    if (!product.costDetails) {
                        product.originalPricingQuery = wrappedLoan.ref.pricingResults.productListViewModel.originalPricingQuery;
                        product.adjustments = vm.sortedProductPricingArray[product.productType][product.productName][0].adjustments;
                        pricingResultsSvc.PerformProductCalculations.PerformProductCalculations({}, { product: product, otherInterviewData: wrappedLoan.ref.otherInterviewData }).$promise.then(function (data) {
                            product.costDetails = data.costDetails;
                            product.paymentBreakdownModalVM = data.paymentBreakdownModalVM;
                            product.originalPricingQuery = null;
                            product.closingCosts = data.closingCosts;
                            updateCostsFromImpoundCalculator(product, vm.impoundCalculatorResults);
                            array.push(product);
                        });
                    } else {
                        array.push(product);
                    }
                }
            } else {
                if (array.length > 1) {
                    array = array.splice(array.map(function(p){ return p.productId }).indexOf(product.productId), 1);
                }                   
            }         
        };

        function collapseExpand(product) {
            product.productRowExpanded = !product.productRowExpanded;            
        };

        function selectEligibleRow(index, event, product) {

            if (event != undefined && event.target.attributes["class"].value.indexOf("imp-sa-grid-row-collaps") > -1)
                return;
            vm.selectedEligibleRow = index;

            // broadcast selected product to contextual bar
            BroadcastSvc.broadcastSelectedProduct(product);
        };

        function selectRow(index, event) {
            if (event != undefined && event.target.attributes["class"].value.indexOf("imp-sa-grid-row-collaps") > -1)
                return;
            vm.selectedRow = index;
        };

        $scope.$on("ImpoundsChanged", function (event, args) {
            vm.impoundCalculatorResults = args;

            vm.wrappedLoan.ref.housingExpenses.newHoa = args.HOAExpens.amountPerMonth;

            if (!vm.repricing) {
                vm.wrappedLoan.ref.closingCost.costs = args.costs;
                var j;
                for (j = 0; j < vm.wrappedLoan.ref.closingCost.costs.length; j++) {
                    vm.wrappedLoan.ref.closingCost.costs[j].amount = vm.wrappedLoan.ref.closingCost.costs[j].monthsToBePaid * vm.wrappedLoan.ref.closingCost.costs[j].amountPerMonth;
                }
            }
            else {

                var k;
                for (k = 0; k < args.costs.length; k++) {
                    var taxExists = _.where(vm.wrappedLoan.ref.closingCost.costs, { hudLineNumber: args.costs[k].hudLineNumber }).length > 0;

                    if (!taxExists)
                        vm.wrappedLoan.ref.closingCost.costs.push(_.where(args.costs, { hudLineNumber: args.costs[k].hudLineNumber })[0])
                    else {
                        var oldCost = _.where(vm.wrappedLoan.ref.closingCost.costs, { hudLineNumber: args.costs[k].hudLineNumber })[0];

                        oldCost.amountPerMonth = args.costs[k].amountPerMonth;
                        oldCost.monthsToBePaid = args.costs[k].monthsToBePaid;
                        oldCost.amount = args.costs[k].amountPerMonth * args.costs[k].monthsToBePaid;

                        oldCost.percent = args.costs[k].percent;
                        oldCost.impounded = args.costs[k].impounded;

                        resetCosts(oldCost);
                    }
                }
            }

            for (var group in vm.sortedProductPricingArray) {
                if (vm.sortedProductPricingArray.hasOwnProperty(group)) {
                    for (var product in vm.sortedProductPricingArray[group]) {
                        if (vm.sortedProductPricingArray[group].hasOwnProperty(product)) {
                            for (var pricing in vm.sortedProductPricingArray[group][product]) {
                                if (vm.sortedProductPricingArray[group][product].hasOwnProperty(pricing)) {
                                    if (vm.sortedProductPricingArray[group][product][pricing].productId) {
                                        updateCostsFromImpoundCalculator(vm.sortedProductPricingArray[group][product][pricing], args);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
        
        function resetCosts(cost) {
            costDetailsHelpers.resetRightSectionAmounts(cost);
            cost.borrowerPaid.atClosing = costDetailsHelpers.calculateBorrowerPTCAmount(cost, vm.wrappedLoan.ref.closingDate.dateValue)
        }

        function updateCostsFromImpoundCalculator(product, args) {

            if (!args)
                return;
            var costDetails = product.costDetails;
            var paymentBreakdown = product.paymentBreakdownModalVM;
            var sum = 0;
            var i;
            for (i = 0; i < costDetails.reservesCosts.length; i++) {
                var old = costDetails.reservesCosts[i];
                var calc = _.where(args.costs, { hudLineNumber: old.hudLineNumber })[0];

                old.amountPerMonth = calc.amountPerMonth;
                old.amount = calc.impounded ? calc.amountPerMonth * calc.monthsToBePaid : 0;
                old.percent = calc.percent;
                old.impounded = calc.impounded;
                old.upfrontPreferredPaymentPeriod = calc.upfrontPreferredPaymentPeriod;
                old.amountMethod = calc.amountMethod;
                resetCosts(old);
                if (old.hudLineNumber == 1004) {
                    paymentBreakdown.taxesMonthlyAmount = old.amountPerMonth;
                    paymentBreakdown.taxesMonthlyAmountPercent = old.percent;
                }
                if (old.hudLineNumber == 1002) {
                    paymentBreakdown.insuranceMonthlyAmount = old.amountPerMonth;
                    paymentBreakdown.insuranceMonthlyAmountPercent = old.percent;
                    var annualHoi = _.where(costDetails.prepaidCosts, { hudLineNumber: 903 })[0];
                    if (annualHoi) {
                        annualHoi.amount = old.amountPerMonth * 12;
                        annualHoi.percent = old.percent;
                    }
                }
                if (old.hudLineNumber == 1003) {
                    paymentBreakdown.mip = old.amountPerMonth;
                    paymentBreakdown.mipPercent = old.percent;
                }
                sum = sum + old.amount;
            }

            paymentBreakdown.totalMonthlyPayment = paymentBreakdown.principalAndInterest + paymentBreakdown.taxesMonthlyAmount + paymentBreakdown.insuranceMonthlyAmount + paymentBreakdown.mip;
            costDetails.totalReserves = sum;
            costDetails.reservesAndPrepaids = costDetails.totalPrepaids + costDetails.totalReserves;
            costDetails.thirdPartyPrepaidsAndReserves = (costDetails.totalEstimatedClosingCosts + costDetails.totalPrepaids + costDetails.totalReserves);
        }

        function lockDaysNext(length) {
            if (vm.lockDaysLimit.max < length - 1) {
                vm.lockDaysLimit.min = vm.lockDaysLimit.min + 1;
                vm.lockDaysLimit.max = vm.lockDaysLimit.max + 1;
            }
        };

        function lockDaysPrevious() {
            if (vm.lockDaysLimit.min > 0) {
                vm.lockDaysLimit.min = vm.lockDaysLimit.min - 1;
                vm.lockDaysLimit.max = vm.lockDaysLimit.max - 1;
            }
        };

        function openClosingCostMenu(event, product) {
            var menuPopup = modalPopoverFactory.openModalPopover('angular/pricingresults/sections/closingcostoptions.html', {}, {}, event, { className: 'tooltip-arrow-display-non', horisontalPopupPositionPerWidth: 0.2 });
            menuPopup.result.then(function (data) {
                vm.costType = data.model;
            });
        };

        function openLifeOfLoanMenu(event, product) {
            var menuPopup = modalPopoverFactory.openModalPopover('angular/pricingresults/sections/lifeofloanoptions.html', {}, this, event, { className: 'tooltip-arrow-display-non', horisontalPopupPositionPerWidth: 0.5 });
            menuPopup.result.then(function (data) {
                vm.savingsDropdownOption = data.model;

            });
        };

        function openPricePercentageOrPoints(event, product) {
            var menuPopup = modalPopoverFactory.openModalPopover('angular/pricingresults/sections/pricepercentagespoints.html', {}, {}, event, { className: 'tooltip-arrow-display-non', horisontalPopupPositionPerWidth: 0.2 });
            menuPopup.result.then(function (data) {
                vm.priceDisplayType = data.model;
            });
        };

        function openIntegrationXmlMenu(event, product) {
            var menuPopup = modalPopoverFactory.openModalPopover('angular/pricingresults/sections/integrationsxmloptions.html', {}, {}, event, { className: 'tooltip-arrow-display-non', horisontalPopupPositionPerWidth: 0.2 });
            menuPopup.result.then(function (data) {
               
            });
        };
        function viewDetailedClosingCost(event, costDetails) {
            vm.currentCell = event.currentTarget;
            vm.currentCell.className += " cost-cell-on-popup-open";

            costDetails.showPrepaidDescriptions = false;
            costDetails.showReservesDescriptions = false;

            var detailedClosingCostPopup = modalPopoverFactory.openModalPopover('angular/pricingresults/sections/detailedclosingcosts.html', {}, costDetails, event, { className: 'tooltip-arrow-right-cost-details', verticalPopupPositionPerHeight: 0, horisontalPopupPositionPerWidth: 0.695 });
            detailedClosingCostPopup.result.then(function (data) {
                console.log(vm.currentCell);
            }, function () {
                vm.currentCell.className = vm.currentCell.className.replace(" cost-cell-on-popup-open", "");
            });


        
        };

        vm.openIntegrationXmlMenu = openIntegrationXmlMenu;
        function openIntegrationXmlMenu(event, logListItem, logType) {
            var detailedClosingCostPopup = modalPopoverFactory.openModalPopover('angular/pricingresults/sections/integrationsxmloptions.html', { getIntegrationItem: vm.getIntegrationItem }, { logListItem: logListItem, logType: logType }, event, { className: 'tooltip-arrow-integration-logs', calculateVerticalPositionFromTopBorder: true, verticalPopupPositionPerHeight: 1, horisontalPopupPositionPerWidth: 0.5 });
            detailedClosingCostPopup.result.then(function (data) {
               
            }, function () {
         
            });
        };

        vm.getIntegrationItem = getIntegrationItem;
        function getIntegrationItem(itemId, logType) {
            var result = pricingResultsSvc.GetIntegrationLogItem(vm.wrappedLoan.ref.active.getBorrower().userAccount.userAccountId, itemId, logType);//85347, 72436, 'pricing');
   
        };

        function openSavingsCalculationsModal() {
            modalPopoverFactory.openModalPopover('angular/pricingresults/other/savingscalculationsmodal.html', {}, {}, event, { className: 'tooltip-arrow-right-savings-calculations', verticalPopupPositionPerHeight: -0.04, horisontalPopupPositionPerWidth: 0.542 });
        };

    };

})();