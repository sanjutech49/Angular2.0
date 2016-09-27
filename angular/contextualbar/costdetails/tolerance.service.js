//(function () {
//    'use strict';

//    angular.module('loanCenter').factory('toleranceSvc', toleranceSvc);

//    toleranceSvc.$inject = ['$resource', 'apiRoot', 'costDetailsSvc', '$q'];

//    function toleranceSvc($resource, apiRoot, costDetailsSvc, $q) {

//        var toleranceGroupsData = {};
//        var toleranceLineItemsData = {};
//        var activeToleranceData = {};
//        var activeToleranceGroupId;
//        var selectedToleranceGroupId;

//        var service = {};
//        service.activeToleranceData = activeToleranceData;
//        initializeSelectedToleranceItems();
       
//        service.getToleranceGroups = function () {
//            var def = $q.defer();

//            toleranceGroupsData = costDetailsSvc.costDetailsData.disclosuresDetailsViewModel;

//            angular.forEach(toleranceGroupsData, function (group) {
//                group.costs = groupCostsByTolerance(group.costs);
//            });

//            calculateAggregates(toleranceGroupsData);

//            def.resolve(toleranceGroupsData);

//            return def.promise;
//        };

//        service.getToleranceLineItems = function (toleranceGroupId) {
//            var def = $q.defer();
//            selectedToleranceGroupId = toleranceGroupId;

//            angular.forEach(toleranceGroupsData, function (group) {
//                if (group.disclosureDetailsId == selectedToleranceGroupId) {
//                    toleranceLineItemsData = group;
//                }
//            });

//            setSelectedToleranceCosts(toleranceLineItemsData);
//            def.resolve(toleranceLineItemsData);

//            return def.promise;
//        };

//        service.getActiveToleranceGroup = function () {
//            var def = $q.defer();
//            var activeToleranceData = {};
//            var activeGroupExists = false;
//            this.getToleranceGroups().then(function (data) {
//                toleranceGroupsData = data;
//                angular.forEach(toleranceGroupsData, function (group) {
//                    if (group.active) {
//                        activeGroupExists = true;
//                        activeToleranceGroupId = group.disclosureDetailsId;
//                        service.activeToleranceData = activeToleranceData = group;
//                    }
//                });

//                if (activeGroupExists) {
//                    setSelectedToleranceCosts(activeToleranceData);
//                }
//                else {
//                    initializeSelectedToleranceItems();
//                    service.activeToleranceData = activeToleranceData = {};
//                    activeToleranceGroupId = -1;
//                }

//                def.resolve(activeToleranceData);
//            },
//            function (errorMsg) {
//                def.reject(errorMsg);
//            });

//            return def.promise;
//        }

//        service.updateActiveToleranceTotals = function () {
//            var def = $q.defer();

//            if (service.activeToleranceData == undefined || service.activeToleranceData.costs == undefined)
//                return def.promise;

//            service.activeToleranceData.costs = groupCostsByTolerance(service.activeToleranceData.costs);
//            calculateAggregates([service.activeToleranceData]);

//            def.resolve(service.activeToleranceData);
//            return def.promise;
//        }

//        return service;

//        function initializeSelectedToleranceItems() {
//            service.selectedToleranceItems = {
//                zeroTolerance: {
//                    costs: [], disclosedTotal: 0, currentTotal: 0, changeDollar: 0, changePercent: 0, amountToCure: 0
//                },
//                tenPercentTolerance: {
//                    costs: [], disclosedTotal: 0, currentTotal: 0, changeDollar: 0, changePercent: 0, amountToCure: 0
//                },
//                unlimitedTolerance: {
//                    costs: [], disclosedTotal: 0, currentTotal: 0, changeDollar: 0, changePercent: 0, amountToCure: 0
//                }
//            };
//        }

//        function groupCostsByTolerance(toleranceCosts) {
//            if (toleranceCosts == undefined)
//                return;

//            var allCurrentCosts = costDetailsSvc.costDetailsData.costs;

//            angular.forEach(allCurrentCosts, function (cost) {
//                if (cost.isRemoved || cost.hudLineNumber == 204 || cost.hudLineNumber == 8020 || (cost.hudLineNumber == 802 && cost.amount < 0))
//                    return true;

//                var costExistsInToleranceCostsList = false;
//                var costCopy = angular.copy(cost);
//                costCopy.totalAmountForTolerance = parseFloat(cost.borrowerPaid.atClosing) + parseFloat(cost.borrowerPaid.beforeClosing) + parseFloat(cost.otherPaid.atClosing) + parseFloat(cost.otherPaid.beforeClosing);
//                costCopy.disclosedTotalAmountForTolerance = 0;

//                // Update DisclosedTotalAmountForTolerance
//                angular.forEach(toleranceCosts, function (toleranceCost) {
//                    var subHUDLineNumberEmpty = ((toleranceCost.subHUDLineNumber == null && cost.subHUDLineNumber == null) || (toleranceCost.subHUDLineNumber == '' && cost.subHUDLineNumber == ''));
//                    if ((toleranceCost.hudLineNumber == cost.hudLineNumber) && (subHUDLineNumberEmpty || (toleranceCost.subHUDLineNumber == cost.subHUDLineNumber))) {
//                        costExistsInToleranceCostsList = true;
//                        toleranceCost.disclosedTotalAmountForTolerance = toleranceCost.amount;
//                        toleranceCost.totalAmountForTolerance = costCopy.totalAmountForTolerance;
//                        toleranceCost.toleranceLevel = cost.toleranceLevel;
//                    }
//                });

//                // Add missing costs from current cost list to tolerance costs
//                if (!costExistsInToleranceCostsList)
//                    toleranceCosts.push(costCopy);
//            });

//            // Hide zero costs from UI
//            var filteredList = toleranceCosts.filter(function (toleranceCost) {
//                return (!isCostAmountEmpty(toleranceCost) && (toleranceCost.hudLineNumber != 204) && (toleranceCost.hudLineNumber != 8020) && ((toleranceCost.hudLineNumber == 802 && toleranceCost.amount > 0) || (toleranceCost.hudLineNumber != 802)));
//            });

//            return filteredList;
//        }

//        function isCostAmountEmpty(cost) {
//            return ((cost.disclosedTotalAmountForTolerance == null && cost.totalAmountForTolerance == null) || (cost.disclosedTotalAmountForTolerance == 0 && cost.totalAmountForTolerance == 0));
//        }

//        function setSelectedToleranceCosts(toleranceGroup) {
//            if (toleranceGroup == undefined || toleranceGroup.costs == undefined)
//            {
//                initializeSelectedToleranceItems();
//                return;
//            }

//            service.selectedToleranceItems = toleranceGroup;
//            if (service.selectedToleranceItems.zeroTolerance != undefined)
//                service.selectedToleranceItems.zeroTolerance.costs = getToleranceLevelCosts(toleranceGroup.costs, 0);
//            if (service.selectedToleranceItems.tenPercentTolerance != undefined)
//                service.selectedToleranceItems.tenPercentTolerance.costs = getToleranceLevelCosts(toleranceGroup.costs, 10);
//            if (service.selectedToleranceItems.unlimitedTolerance != undefined)
//                service.selectedToleranceItems.unlimitedTolerance.costs = getToleranceLevelCosts(toleranceGroup.costs, null);
//        }

//        function getToleranceLevelCosts(costs, toleranceLevel) {
//            var filteredCosts = [];
//            angular.forEach(costs, function (cost) {
//                if (!cost.isRemoved && cost.toleranceLevel == toleranceLevel) {
//                    filteredCosts.push(cost);
//                }
//            });

//            return filteredCosts;
//        }

//        function calculateAggregates(toleranceGroups) {
//            angular.forEach(toleranceGroups, function (toleranceObj) {
//                var groupedCostsByTolerance = _.groupBy(toleranceObj.costs, 'toleranceLevel');

//                toleranceObj.zeroTolerance = { disclosedTotal: 0, currentTotal: 0, changeDollar: 0, changePercent: 0, amountToCure: 0 };
//                toleranceObj.tenPercentTolerance = { disclosedTotal: 0, currentTotal: 0, changeDollar: 0, changePercent: 0, amountToCure: 0 };
//                toleranceObj.unlimitedTolerance = { disclosedTotal: 0, currentTotal: 0, changeDollar: 0, changePercent: 0, amountToCure: 0 };

//                angular.forEach(groupedCostsByTolerance, function (costs, toleranceLevel) {
//                    angular.forEach(costs, function (cost) {
//                        if (toleranceLevel == 0) {
//                            toleranceObj.zeroTolerance.disclosedTotal += parseFloat(cost.disclosedTotalAmountForTolerance);
//                            toleranceObj.zeroTolerance.currentTotal += parseFloat(cost.totalAmountForTolerance);
//                        }
//                        if (toleranceLevel == 10) {
//                            toleranceObj.tenPercentTolerance.disclosedTotal += parseFloat(cost.disclosedTotalAmountForTolerance);
//                            toleranceObj.tenPercentTolerance.currentTotal += parseFloat(cost.totalAmountForTolerance);
//                        }
//                        else {
//                            toleranceObj.unlimitedTolerance.disclosedTotal += parseFloat(cost.disclosedTotalAmountForTolerance);
//                            toleranceObj.unlimitedTolerance.currentTotal += parseFloat(cost.totalAmountForTolerance);
//                        }
//                    });
//                });

//                calculateTotals(toleranceObj.zeroTolerance);
//                calculateTotals(toleranceObj.tenPercentTolerance);

//                toleranceObj.zeroTolerance.amountToCure = (toleranceObj.zeroTolerance.changeDollar < 0) ? 0 : toleranceObj.zeroTolerance.changeDollar;
//                toleranceObj.tenPercentTolerance.amountToCure = (toleranceObj.tenPercentTolerance.changePercent < 10 || toleranceObj.tenPercentTolerance.changePercent == 10 || toleranceObj.tenPercentTolerance.changePercent < 0) ? 0 : toleranceObj.tenPercentTolerance.changeDollar - (toleranceObj.tenPercentTolerance.disclosedTotal * 0.1);
//                toleranceObj.unlimitedTolerance.amountToCure = toleranceObj.zeroTolerance.amountToCure + toleranceObj.tenPercentTolerance.amountToCure;
//            });
//        }

//        function calculateTotals(section) {
//            section.changeDollar = section.currentTotal - section.disclosedTotal;
//            section.changePercent = (section.disclosedTotal > 0) ? Math.round(((section.changeDollar / section.disclosedTotal) * 100) * 100) / 100 : 0;
//        }
//    }
//})()