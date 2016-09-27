(function () {
    'use strict';
    angular.module('impoundCalculator')
        .controller('impoundCalculatorController', impoundCalculatorController);

    impoundCalculatorController.$inject = ['costDetailsHelpers', 'enums', 'impoundCalculatorSvc']

    function impoundCalculatorController(costDetailsHelpers, enums, impoundCalculatorSvc) {
        var vm = this;
        vm.recalculateCost = recalculateCost;
        vm.isPeriodDisabled = isPeriodDisabled;
        vm.costDetailsHelpers = costDetailsHelpers;
        vm.enums = enums;
         
        vm.model = {};

        vm.init = init;

        vm.setTotalEstimatedReserves = setTotalEstimatedReserves;
        vm.getTotalMonthlyImpounds = getTotalMonthlyImpounds;
        vm.getTotalEstReserves = getTotalEstReserves;
        vm.setHoaMontlyAmount = setHoaMontlyAmount;
        vm.getTotalMonthlyAmountIncludingHOA = getTotalMonthlyAmountIncludingHOA;
        vm.showAmountMethod = showAmountMethod;
        vm.isAmountMethodDisabled = isAmountMethodDisabled;
        vm.getAmountMethods = getAmountMethods;
        vm.isAmountDisabled = isAmountDisabled;
        vm.isFactorDisabled = isFactorDisabled;
        vm.onAmountMethodChange = onAmountMethodChange;
        vm.getNumberOfMonthsBasedOnPreferredPaymentPeriod = getNumberOfMonthsBasedOnPreferredPaymentPeriod;
        vm.clearItemizedPropertyTaxes = clearItemizedPropertyTaxes;
        vm.initializePeriodPaymentMonths = initializePeriodPaymentMonths;
        vm.removeAllPeriodPaymentMonths = removeAllPeriodPaymentMonths;
        vm.preferredPaymentPeriodChanged = preferredPaymentPeriodChanged;
        vm.isSingleMI = isSingleMI;
        vm.isMonthOfReservesEditable = isMonthOfReservesEditable;
        vm.onMonthsOfReservesBlur = onMonthsOfReservesBlur;
        vm.isPeriodPaymentMonthsDisabled = isPeriodPaymentMonthsDisabled;

        function init(model) {
            vm.model = model;

            model.costs = model.costs.filter(function (c) {
                if (c.hudLineNumber == 1002 || c.hudLineNumber == 1003 || c.hudLineNumber == 1004 || c.hudLineNumber == 1006
                    || (c.isRemoved != true && vm.costDetailsHelpers.isOtherInsurance(c)))
                    return c;
            });

            for (var i = 0; i < model.costs.length; i++) {
                var cost = model.costs[i];

                if (cost.hudLineNumber == 1004) {
                    cost.sortName = "01_PropertyTax";
                    cost.displayName = "Property Tax";

                    if (!cost.preferredPaymentPeriod)
                        cost.preferredPaymentPeriod = srv.PeriodTypeEnum.Annually;

                    if (cost.amountMethod == undefined)
                        cost.amountMethod = vm.model.isRefinance ? srv.AmountMethodEnum.Manual : srv.AmountMethodEnum.Calculated;

                    cost.monthsToBePaid = cost.monthsToBePaid > 0 ? cost.monthsToBePaid : 3;

                    costCalculation(cost);
                }
                else if (cost.hudLineNumber == 1002) {
                    cost.sortName = "02_HomeOwnerInsurance";
                    cost.displayName = "Homeowner Ins.";

                    if (!cost.preferredPaymentPeriod)
                        cost.preferredPaymentPeriod = srv.PeriodTypeEnum.Annually;

                    if (cost.amountMethod == undefined)
                        cost.amountMethod = vm.model.isRefinance ? srv.AmountMethodEnum.Manual : srv.AmountMethodEnum.Calculated;

                    cost.monthsToBePaid = cost.monthsToBePaid > 0 ? cost.monthsToBePaid : 2;

                    costCalculation(cost);
                }
                else if (cost.hudLineNumber == 1006) {
                    cost.sortName = "03_FloodInsurance";
                    cost.displayName = "Flood Insurance";

                    if (!cost.preferredPaymentPeriod)
                        cost.preferredPaymentPeriod = srv.PeriodTypeEnum.Monthly;

                    cost.monthsToBePaid = cost.monthsToBePaid > 0 ? cost.monthsToBePaid : 3;

                    costCalculation(cost);
                }
                else if (cost.hudLineNumber == 1010 || cost.originalHUDLineNumber == 1010) {
                    cost.sortName = "04_EarthquakeInsurance";
                    cost.displayName = "Earthquake Ins.";

                    if (!cost.preferredPaymentPeriod)
                        cost.preferredPaymentPeriod = srv.PeriodTypeEnum.Monthly;

                    costCalculation(cost);
                }
                else if (cost.hudLineNumber == 1007 || cost.originalHUDLineNumber == 1007) {
                    cost.sortName = "05_Hurricane Insurance";
                    cost.displayName = "Hurricane Ins.";

                    if (!cost.preferredPaymentPeriod)
                        cost.preferredPaymentPeriod = srv.PeriodTypeEnum.Monthly;

                    costCalculation(cost);
                }
                else if (cost.hudLineNumber == 1012 || cost.originalHUDLineNumber == 1012) {
                    cost.sortName = "06_USDAInsurance";
                    cost.displayName = cost.name;

                    if (!cost.preferredPaymentPeriod)
                        cost.preferredPaymentPeriod = srv.PeriodTypeEnum.Monthly;

                    costCalculation(cost);
                }
                else if (cost.hudLineNumber == 1003) {
                    cost.sortName = "07_MortgageInsurance";
                    cost.displayName = "Mortgage Ins.";

                    if (cost.amountMethod == null || cost.amountMethod == undefined)
                        cost.amountMethod = srv.AmountMethodEnum.MonthlyMI;

                    cost.preferredPaymentPeriod = srv.PeriodTypeEnum.Monthly;
                    if (cost.amountPerMonth > 0 && cost.amountMethod == srv.AmountMethodEnum.MonthlyMI)
                        cost.impounded = true;

                    if (!cost.monthsToBePaid)
                        cost.monthsToBePaid = 0;

                    costCalculation(cost);
                }

                vm.initializePeriodPaymentMonths(cost);
            }
        }

        function getNumberOfMonthsBasedOnPreferredPaymentPeriod(preferredPaymentPeriod) {
            if (preferredPaymentPeriod == srv.PeriodTypeEnum.Annually)
                return 12;

            if (preferredPaymentPeriod == srv.PeriodTypeEnum.SemiAnnually)
                return 6;

            if (preferredPaymentPeriod == srv.PeriodTypeEnum.Quarterly)
                return 3;

            return 1;
        }

        function recalculateCost(cost) {

            if (cost.percent > 0 && !vm.model.isRefinance && cost.amountMethod == srv.AmountMethodEnum.Calculated) {
                if (cost.hudLineNumber == 1002) {
                    cost.amountForYear = (roundToFourDecimalPlaces((cost.percent * vm.model.loanAmount / 1200) * 12));
                }
                else if (cost.hudLineNumber == 1004) {
                    cost.amountForYear = (roundToFourDecimalPlaces((cost.percent * vm.model.purchasePrice / 1200) * 12));
                }
            }

            var periodMonths = vm.getNumberOfMonthsBasedOnPreferredPaymentPeriod(cost.preferredPaymentPeriod);
            cost.amountPerMonth = cost.amountForYear / periodMonths;

            if (cost.hudLineNumber == 1003 && cost.amountPerMonth > 0 && cost.amountMethod == srv.AmountMethodEnum.MonthlyMI)
                cost.impounded = true;

            vm.setTotalEstimatedReserves(cost);
        }

        function setTotalEstimatedReserves(cost) {
            cost.amount = (cost.monthsToBePaid * Math.round(cost.amountPerMonth * 100) / 100) * (cost.impounded ? 1 : 0);
        };

        function getTotalMonthlyImpounds() {

            if (vm.model && vm.model.costs) {
                var i;
                var sum = 0;
                for (i = 0; i < vm.model.costs.length; i++) {
                    var cost = vm.model.costs[i];
                    if (isSingleMI(cost))
                        continue;

                    if (cost.amountPerMonth) {
                        sum = sum + parseFloat(cost.amountPerMonth);
                    }
                };

                return sum;
            }
        };

        function getTotalEstReserves(hoaAmount) {
            var sum = hoaAmount;
            if (vm.model && vm.model.costs) {
                var i;
                var sum = 0;
                for (i = 0; i < vm.model.costs.length; i++) {
                    if (vm.model.costs[i].amount) {
                        sum = sum + parseFloat(vm.model.costs[i].amount);
                    }
                };
            }

            return sum;
        }

        function setHoaMontlyAmount() {
            if (vm.model && vm.model.HOAExpens) {
                var periodMonths = vm.getNumberOfMonthsBasedOnPreferredPaymentPeriod(vm.model.HOAExpens.preferredPayPeriod);
                vm.model.HOAExpens.amountPerMonth = (Math.round((vm.model.HOAExpens.amount / periodMonths) * 100) / 100);
            }
        }

        function getTotalMonthlyAmountIncludingHOA(hoaAmountPerMonth) {
            return getTotalMonthlyImpounds() + hoaAmountPerMonth;
        }

        function costCalculation(cost, purchasePrice, loanAmount, type) {
            var amountForYear;
            var periodMonths = vm.getNumberOfMonthsBasedOnPreferredPaymentPeriod(cost.preferredPaymentPeriod);
            var monthlyAmount = cost.amountPerMonth ? cost.amountPerMonth : cost.amount / cost.monthsToBePaid;

            if (cost.hudLineNumber == 1002) //HOI
                amountForYear = (cost.percent == 0 || cost.amountMethod != srv.AmountMethodEnum.Calculated) ? (monthlyAmount * periodMonths) : (roundToFourDecimalPlaces((cost.percent * vm.model.loanAmount / 1200) * 12));
            else if (cost.hudLineNumber == 1004) //Tax
                amountForYear = (cost.percent == 0 || cost.amountMethod != srv.AmountMethodEnum.Calculated) ? (monthlyAmount * periodMonths) : (roundToFourDecimalPlaces((cost.percent * vm.model.purchasePrice / 1200) * 12));
            else
                amountForYear = monthlyAmount * periodMonths;

            cost.amountPerMonth = roundToFourDecimalPlaces(amountForYear / periodMonths);
            cost.amountForYear = roundToFourDecimalPlaces(amountForYear);
            vm.setTotalEstimatedReserves(cost);
        }

        function roundToFourDecimalPlaces(number) {
            return (Math.round(number * 10000)) / 10000;
        };

        function showAmountMethod(cost, isRefinance, applicationData) {
            // For refi, show only for property tax (1004) and MI (1003)
            if (isRefinance && cost.hudLineNumber != 1004 && cost.hudLineNumber != 1003)
                return false;

            // For purchase, show only for property tax (1004) and Homeowner's Insurance (1002) 
            if (cost.hudLineNumber != 1004 && cost.hudLineNumber != 1002 && cost.hudLineNumber != 1003)
                return false;

            return true;
        }

        function isAmountMethodDisabled(isExtended, cost, mortageType) {
            if (!isExtended && cost.hudLineNumber != 1003)
                return true;

            // When a loan is FHA, VA, or USDA then the drop down fields will be disabled and unable to be selected. 
            var isGovtLoan = mortageType === srv.MortageType.FHA || mortageType === srv.MortageType.VA || mortageType === srv.MortageType.USDA;
            if (cost.hudLineNumber == 1003 && isGovtLoan)
                return true;

            return false;
        }

        function getAmountMethods(cost, isRefinance, applicationData) {
            if (isRefinance && cost.hudLineNumber == 1004)
                return applicationData.lookup.costAmountMethodsRefiTax;

            if (cost.hudLineNumber == 1004)
                return applicationData.lookup.costAmountMethodsPurchaseTax;

            if (cost.hudLineNumber == 1002)
                return applicationData.lookup.costAmountMethodsPurchaseHoi;

            if (cost.hudLineNumber == 1003)
                return applicationData.lookup.costAmountMethodsMI;
        }

        function isAmountDisabled(cost, isRefinance) {
            // Disable Property Tax amount if amount method == Itemized
            if (cost.hudLineNumber == 1004 && cost.amountMethod == srv.AmountMethodEnum.Itemized)
                return true;

            // For purchase, disable Property Tax and HOI is amount method undefined or calculated
            if (!isRefinance && (cost.amountMethod == undefined || cost.amountMethod == srv.AmountMethodEnum.Calculated))
                return cost.percent != 0 && (cost.hudLineNumber == 1004 || cost.hudLineNumber == 1002)

            return false;
        }

        function isFactorDisabled(cost) {
            // Only enable factor for Property Tax and HOI if amount method == Calculated
            if ((cost.amountMethod == srv.AmountMethodEnum.Calculated) && (cost.hudLineNumber == 1004 || cost.hudLineNumber == 1002))
                return false;

            if (cost.amountMethod == undefined)
                return false;

            return true;
        }

        function isPeriodDisabled(cost) {
            // If Purchase transaction and Description = Property Tax or Homeowner Ins. and Amount Method = Calculated
            var isPurchasePropertyTaxHOIAndCalculated = !vm.model.isRefinance && cost.amountMethod && cost.amountMethod == srv.AmountMethodEnum.Calculated && (cost.hudLineNumber == 1004 || cost.hudLineNumber == 1002);
            // If Description = Property Tax and Amount Method = Itemized
            var isPropertyTaxAndItemized = cost.amountMethod == srv.AmountMethodEnum.Itemized && cost.hudLineNumber == 1004;
            // If Description = Mortgage Insurance
            var isMortgageInsurance = cost.hudLineNumber == 1003;
            //for CostDetails
            var isPropertyTaxAndHasNotUserRight = vm.model.isExtended && cost.hudLineNumber == 1004 && !vm.model.applicationData.currentUser.hasPrivilege(vm.enums.privileges.CanEditEscrowsPeriodPayments);
            //for LoanDetails
            var isPropertyTaxAndIsNotEditable = !vm.model.isExtended && cost.hudLineNumber == 1004 && (!vm.model.impoundSchedule || (vm.model.impoundSchedule && !vm.model.impoundSchedule.editable));

            return isPurchasePropertyTaxHOIAndCalculated || isPropertyTaxAndItemized || isMortgageInsurance || isPropertyTaxAndHasNotUserRight || isPropertyTaxAndIsNotEditable;
        }

        function onAmountMethodChange(cost) {
            // If Purchase transaction and Description = Property Tax or Homeowner Ins. and Amount Method = Calculated, set to annual
            if (!vm.model.isRefinance && cost.amountMethod && cost.amountMethod == srv.AmountMethodEnum.Calculated && (cost.hudLineNumber == 1004 || cost.hudLineNumber == 1002)) {
                cost.preferredPaymentPeriod = srv.PeriodTypeEnum.Annually;
                vm.recalculateCost(cost);
            }
            // If Description = Property Tax and Amount Method = Itemized
            else if (cost.amountMethod && cost.amountMethod == srv.AmountMethodEnum.Itemized && cost.hudLineNumber == 1004) {
                cost.preferredPaymentPeriod = srv.PeriodTypeEnum.Annually;
                cost.amountPerMonth = 0;
                cost.amountForYear = 0;
                vm.recalculateCost(cost);
            }
            // If Description = MI
            else if (cost.hudLineNumber == 1003) {
                cost.editMode = false;
                cost.isLocked = false;
                if (cost.amountMethod == srv.AmountMethodEnum.MonthlyMI) {
                    cost.impounded = true;
                    cost.upfrontPreferredPaymentPeriod = null;
                }
                else {
                    cost.impounded = false;

                    if (!cost.upfrontPreferredPaymentPeriod) {
                        cost.upfrontPreferredPaymentPeriod = srv.UpfrontPreferredPaymentPeriodEnum.Financed;
                    }
                }

                vm.model.MICalculatorRequest.amountMethod = cost.amountMethod;
                vm.model.MICalculatorRequest.percent = cost.percent;
                vm.model.MICalculatorRequest.TotalLoanAmount = vm.model.loanAmount;
                impoundCalculatorSvc.calculateMiAmount.save(vm.model.MICalculatorRequest).$promise.then(
                                function (data) {
                                    cost.amountPerMonth = data.response.amount;
                                    cost.amountForYear = data.response.amount;
                                    cost.percent = data.response.percent;
                                },
                                function (err) {
                                    console.log("Error: ", err);
                                });
            }

            if (cost.amountMethod && cost.amountMethod != srv.AmountMethodEnum.Itemized && cost.hudLineNumber == 1004) {
                vm.clearItemizedPropertyTaxes(cost.itemizedPropertyTaxes);
            }
           

            vm.initializePeriodPaymentMonths(cost);
        }

        function clearItemizedPropertyTaxes(itemizedPropertyTaxes) {
            for (var i = 0; i < itemizedPropertyTaxes.length; i++) {
                itemizedPropertyTaxes[i].month = 0;
                itemizedPropertyTaxes[i].amount = 0;
            }
        }

        function initializePeriodPaymentMonths(cost) {
            if (!!cost.amountPerMonth && cost.impounded && cost.amountMethod != srv.AmountMethodEnum.Itemized && cost.preferredPaymentPeriod != srv.PeriodTypeEnum.Monthly && cost.hudLineNumber != 1003) {
                var numberOfPayments = 1;   // Annual by default
                if (cost.preferredPaymentPeriod == srv.PeriodTypeEnum.SemiAnnually)
                    numberOfPayments = 2;
                if (cost.preferredPaymentPeriod == srv.PeriodTypeEnum.Quarterly)
                    numberOfPayments = 4;

                if (_.where(cost.periodPaymentMonths, { isRemoved: false }).length == numberOfPayments)
                    return;

                var month = 1;  // Start at January and then increase by 3 months
                for (var i = 0; i < numberOfPayments; i++) {
                    var matchingCost = _.where(cost.periodPaymentMonths, { order: i });
                    if (matchingCost.length == 0) {
                        var periodPaymentMonth = { periodPaymentMonthId: null, costId: matchingCost.costId, order: i, month: null, isRemoved: false };
                        cost.periodPaymentMonths.push(periodPaymentMonth);
                    }
                    else {
                        matchingCost[0].isRemoved = false;
                        matchingCost[0].month = null;
                    }

                    month += 3;
                }

                for (var i = 0; i < cost.periodPaymentMonths.length; i++) {
                    if (cost.periodPaymentMonths[i].order + 1 > numberOfPayments)
                        cost.periodPaymentMonths[i].isRemoved = true;
                }
            }
            else {
                vm.removeAllPeriodPaymentMonths(cost);
            }
        }

        function removeAllPeriodPaymentMonths(cost) {
            for (var i = 0; i < cost.periodPaymentMonths.length; i++) {
                cost.periodPaymentMonths[i].isRemoved = true;
            }
        }

        function preferredPaymentPeriodChanged(cost) {
            vm.initializePeriodPaymentMonths(cost);
            vm.recalculateCost(cost);
        }

        function isSingleMI(cost) {
            if (cost.hudLineNumber != 1003)
                return false;

            // The Monthly dropdown will change to "Financed" or "In Cash" and we'll hide monthly amount for single MI
            return (cost.amountMethod == srv.AmountMethodEnum.SinglePremiumNonRefundable || cost.amountMethod == srv.AmountMethodEnum.SinglePremiumRefundable);
        }

        function isMonthOfReservesEditable(cost) {
            return cost.hudLineNumber != 1004 ? false : vm.model.impoundSchedule && vm.model.impoundSchedule.editable && cost.impounded;
        }

        function onMonthsOfReservesBlur(cost) {
            cost.isLocked = true;
        }

        function isPeriodPaymentMonthsDisabled(cost) {
            //for CostDetails
            var isPropertyTaxAndHasNotUserRight = vm.model.isExtended && cost.hudLineNumber == 1004 && !vm.model.applicationData.currentUser.hasPrivilege(vm.enums.privileges.CanEditEscrowsPeriodPayments);
            //for LoanDetails
            var isPropertyTaxAndIsNotEditable = !vm.model.isExtended && cost.hudLineNumber == 1004 && (!vm.model.impoundSchedule || (vm.model.impoundSchedule && !vm.model.impoundSchedule.editable));

            return isPropertyTaxAndIsNotEditable || isPropertyTaxAndHasNotUserRight;
        }
    }
})();

