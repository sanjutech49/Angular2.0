(function () {
    'use strict';
    angular.module('loanDetails').controller('housingExpensesController', housingExpensesController);

    housingExpensesController.$inject = ['$scope', '$controller', 'BroadcastSvc', 'wrappedLoan', 'modalPopoverFactory', 'calculatorSvc', 'applicationData', 'loanDetailsSvc', 'loanEvent', 'costDetailsHelpers', 'enums', 'LoanCalculator', 'ImpoundCalculatorHelpersSvc'];

    function housingExpensesController($scope, $controller, BroadcastSvc, wrappedLoan, modalPopoverFactory, calculatorSvc, applicationData, loanDetailsSvc, loanEvent, costDetailsHelpers, enums, LoanCalculator, ImpoundCalculatorHelpersSvc) {
        var vm = this;
        vm.wrappedLoan = wrappedLoan;
        
        vm.triggerLoanCalc = triggerLoanCalc;
        vm.totalImpounds = totalImpounds;

        vm.currentHOAExpense = currentHOAExpense;
        vm.currentFloodInsuranceExpense = currentFloodInsuranceExpense;
        vm.currentPropertyTaxExpense = currentPropertyTaxExpense;
        vm.currentMortgageInsuranceExpense = currentMortgageInsuranceExpense;
        vm.currentHomeOwnerExpense = currentHomeOwnerExpense;
        vm.usdaAnnualCost = usdaAnnualCost;

        vm.floodInsuranceCost = floodInsuranceCost;
        vm.propertyTaxCost = propertyTaxCost;
        vm.mortgageInsuranceCost = mortgageInsuranceCost;
        vm.homeOwnerCost = homeOwnerCost;
        vm.totalCurrentExpenses = totalCurrentExpenses;
        vm.getTotalOtherInsuranceCosts = getTotalOtherInsuranceCosts;
        vm.getAdditionalMortgages = getAdditionalMortgages;
        vm.isMoreThan2Mortgages = isMoreThan2Mortgages;
        vm.showConventionalMortgageInsuranceModal = showConventionalMortgageInsuranceModal;

        function isMoreThan2Mortgages() {
            
            return loanDetailsSvc.isMoreThan2Mortgages(vm.wrappedLoan.ref.getCombinedPledgedAssetsForAll1003s());
        }

        function currentHOAExpense() {
            return loanDetailsSvc.getCurrentExpenseByType(vm.wrappedLoan.ref.loanPurposeType, vm.wrappedLoan.ref.getSubjectProperty().OccupancyType, vm.wrappedLoan.ref.getSubjectProperty, vm.wrappedLoan.ref.primary.getBorrower().getCurrentAddress, enums.housingExpenses.HOAExpense);
            }

        function currentFloodInsuranceExpense() {
            return loanDetailsSvc.getCurrentExpenseByType(vm.wrappedLoan.ref.loanPurposeType, vm.wrappedLoan.ref.getSubjectProperty().OccupancyType, vm.wrappedLoan.ref.getSubjectProperty, vm.wrappedLoan.ref.primary.getBorrower().getCurrentAddress, enums.housingExpenses.floodInsuranceExpense);
        }

        function currentPropertyTaxExpense() {
            return loanDetailsSvc.getCurrentExpenseByType(vm.wrappedLoan.ref.loanPurposeType, vm.wrappedLoan.ref.getSubjectProperty().OccupancyType, vm.wrappedLoan.ref.getSubjectProperty, vm.wrappedLoan.ref.primary.getBorrower().getCurrentAddress, enums.housingExpenses.propertyTaxExpense);
            }

        function currentMortgageInsuranceExpense() {
            return loanDetailsSvc.getCurrentExpenseByType(vm.wrappedLoan.ref.loanPurposeType, vm.wrappedLoan.ref.getSubjectProperty().OccupancyType, vm.wrappedLoan.ref.getSubjectProperty, vm.wrappedLoan.ref.primary.getBorrower().getCurrentAddress, enums.housingExpenses.mortgageInsuranceExpense);
            }

        function currentHomeOwnerExpense() {
            return loanDetailsSvc.getCurrentExpenseByType(vm.wrappedLoan.ref.loanPurposeType, vm.wrappedLoan.ref.getSubjectProperty().OccupancyType, vm.wrappedLoan.ref.getSubjectProperty, vm.wrappedLoan.ref.primary.getBorrower().getCurrentAddress, enums.housingExpenses.homeOwnerExpense);
        }

        function floodInsuranceCost(floodInsuranceCostItem) {
            return getCosts(1006);
        }

        function propertyTaxCost(propertyTaxCostItem) {
            return getCosts(1004);
        }

        function mortgageInsuranceCost(mortgageInsuranceCostItem) {
            return getCosts(1003);
        }

        function usdaAnnualCost() { 
            return getCosts(1012);
        }

        function getTotalOtherInsuranceCosts() {
            var amount = 0;
            for (var i = 0; i < wrappedLoan.ref.closingCost.costs.length; i++) {
                var costItem = wrappedLoan.ref.closingCost.costs[i];

                if (costItem.isRemoved != true && costItem.impounded && costItem.hudLineNumber != 1002 &&
                    costItem.hudLineNumber != 1003 && costItem.hudLineNumber != 1004 && costItem.hudLineNumber != 1006
                    && costItem.hudLineNumber != 1012) {
                    amount += costItem.amountPerMonth;
                }
            }

            return amount;
        }

        function homeOwnerCost(homeOwnerCostItem) {
            return getCosts(1002);
        }
        

        function getCurrentPropertyExpenseValue(propertyExpense) {
            return loanDetailsSvc.getCurrentPropertyExpenseValue(propertyExpense);
            }

        function getCosts(hudLineNumber) {
            return loanDetailsSvc.getCosts(hudLineNumber, getCostsCb);
        }

        function getCurrentPropertyEx() {

        }

        function getCurrentProperty() {
            //
            // Currently for REFI the subject property is used as the Borrower Current Residence for property expense purposes when it's the Primary Residence
            //
            return loanDetailsSvc.getCurrentProperty(vm.wrappedLoan.ref.loanPurposeType, vm.wrappedLoan.ref.getSubjectProperty().OccupancyType, vm.wrappedLoan.ref.getSubjectProperty, vm.wrappedLoan.ref.primary.getBorrower().getCurrentAddress);
        }

        function triggerLoanCalc() {
            loanEvent.broadcastPropertyChangedEvent(events.LoanFieldIdentifier.todo)
        }

        function getAdditionalMortgages() {
            var addlMortgages = loanDetailsSvc.getAdditionalMortgages(wrappedLoan.ref.getLoanApplications(),
                vm.wrappedLoan.ref.loanPurposeType,
                vm.wrappedLoan.ref.getSubjectProperty().OccupancyType,
                vm.wrappedLoan.ref.getSubjectProperty,
                vm.wrappedLoan.ref.primary.getBorrower().getCurrentAddress,
                getPrimaryLoanAppCb);

            return addlMortgages;
        }
     
        function totalCurrentExpenses(includeAdditionalMortgagees) {
            return LoanCalculator.getCurrentPaymentAndMi(includeAdditionalMortgagees);
        }
     
        function roundToFourDecimalPlaces(value) {
            return value ? Math.round(value * 10000) / 10000 : 0;
        }
        
       vm.triggerLoanCalc();

        //properties
        vm.applicationData = applicationData;

        //functions
        vm.showImpoundCalculator = showImpoundCalculator;


        function showImpoundCalculator(event) {

            var totalLoanAmount = vm.wrappedLoan.ref.loanAmount;
            var closingMonth = moment(vm.wrappedLoan.ref.closingDate.dateValue).month() + 1;

            if (!!vm.wrappedLoan.ref.detailsOfTransaction.totalLoanAmount)
                totalLoanAmount = vm.wrappedLoan.ref.detailsOfTransaction.totalLoanAmount;
            var subjectProperty = vm.wrappedLoan.ref.getSubjectProperty();

            var impoundCalculator = modalPopoverFactory.openModalPopover(
                'angular/common/impoundcalculator/impoundcalculator.html',
                $controller("impoundCalculatorController", { $scope: $scope.$new() }),
                {
                    isRefinance: wrappedLoan.ref.loanPurposeType != '1',
                    mortageType: wrappedLoan.ref.financialInfo.mortgageType,
                    isExtended: false,
                    loanAmount: totalLoanAmount,
                    applicationData: applicationData,
                    purchasePrice: subjectProperty.purchasePrice,
                    costs: wrappedLoan.ref.closingCost.costs,
                    HOAExpens: { preferredPayPeriod: srv.PeriodTypeEnum.Monthly, amountPerMonth: vm.wrappedLoan.ref.housingExpenses.newHoa, amount: vm.wrappedLoan.ref.housingExpenses.newHoa },
                    stateImpundLimit: wrappedLoan.ref.stateLtvLimit,
                    impoundSchedule: ImpoundCalculatorHelpersSvc.findImpoundScheduleByStateAndClosingMonth(vm.applicationData.impoundSchedules, subjectProperty.stateName, closingMonth),
                    MICalculatorRequest: ImpoundCalculatorHelpersSvc.createMiRequestModel(vm.wrappedLoan.ref)
                },
                event,
                { className: 'tooltip-arrow-right-cost-details', verticalPopupPositionPerHeight: 0, horisontalPopupPositionPerWidth: 0.695 }
            );

            impoundCalculator.result.then(function (data) {              
                costDetailsHelpers.updateImpounds(data, vm.wrappedLoan);
                triggerLoanCalc();
            }, function () {                
            });
        }

        function totalImpounds() {
            var hoa = vm.homeOwnerCost();
            var property = vm.propertyTaxCost();
            var mi = vm.mortgageInsuranceCost();
            var flood = vm.floodInsuranceCost();
            var usda = vm.usdaAnnualCost();

            return (!angular.isUndefined(hoa) && hoa.impounded ? parseFloat(hoa.amountPerMonth) : 0)
                 + (!angular.isUndefined(property) && property.impounded ? parseFloat(property.amountPerMonth) : 0)
                 + (!angular.isUndefined(mi) && mi.impounded ? parseFloat(mi.amountPerMonth) : 0)
                 + (!angular.isUndefined(flood) && flood.impounded ? parseFloat(flood.amountPerMonth) : 0)
                 + (!angular.isUndefined(usda) && usda.impounded ? parseFloat(usda.amountPerMonth) : 0);
        }

        // show Conventional Mortgage Insurance modal popover
        function showConventionalMortgageInsuranceModal(event, model) {
            var conventionalMortgageInsuranceModal = modalPopoverFactory.openModalPopover('angular/loandetails/sections/housingexpenses/conventionalMortgageInsurance.html', this, vm.wrappedLoan.ref, event, {
                arrowRight: true, className: 'tooltip-arrow-right', verticalPopupPositionPerHeight: 0, horisontalPopupPositionPerWidth: 0.8333, refExtModelAndCtrl: true
            });
        }

        /*
        * CALLBACKS
        */
        function getPrimaryLoanAppCb() {
            return vm.wrappedLoan.ref.primary;
        }

        function getCostsCb() {
            return wrappedLoan.ref.closingCost.costs;
        }
    }
})();