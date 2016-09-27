(function () {
    'use strict';

    angular.module('loanApplication').controller('miscellaneousExpensesController', miscellaneousExpensesController);

    miscellaneousExpensesController.$inject = ['wrappedLoan', 'CreditHelpers', 'controllerData', 'enums', 'applicationData', '$scope', 'loanEvent'];

    function miscellaneousExpensesController(wrappedLoan, CreditHelpers, controllerData, enums, applicationData, $scope, loanEvent) {
        var vm = this;
        vm.wrappedLoan = wrappedLoan;

        //properties
        vm.enums = enums;
        vm.isCollapsed = controllerData.isCollapsed;
        vm.applicationData = applicationData;
        vm.commonData = controllerData.common;

        //functions
        vm.addMiscExpensesRow = addMiscExpensesRow;
        vm.deleteMiscExpensesRow = deleteMiscExpensesRow;
        vm.moveDebtBetweenBorrowerAndCoBorrower = moveDebtBetweenBorrowerAndCoBorrower;
        vm.miscellaneousDebtMonthsChanged = miscellaneousDebtMonthsChanged;
        vm.onMiscellaneousAmountChanged = onMiscellaneousAmountChanged;

        function addMiscExpensesRow() {
            var miscExpenses = new cls.MiscellaneousDebtViewModel(null, srv.MiscellaneousDebtTypes.EmptyDebt, true, vm.wrappedLoan.ref.active.getBorrower().getFullName);
            miscExpenses.clientIdForOrder = wrappedLoan.ref.active.getCombinedMiscDebts().length;
            wrappedLoan.ref.active.getBorrower().addMiscDebts(miscExpenses);

            // update the result
            // REASON: diggest circle breaks sometimes when we have a hevy change over the debt types, so we are storing the result in a object, and let the digest watch over the object
            vm.combinedMiscDebts = wrappedLoan.ref.active.getCombinedMiscDebts();
        }

        function miscellaneousDebtMonthsChanged(miscDebt) {
            loanEvent.broadcastPropertyChangedEvent(events.LoanFieldIdentifier.MiscellaneousDebtMonthsChanged, miscDebt);
        }

        function onMiscellaneousAmountChanged(miscDebt) {
            loanEvent.broadcastPropertyChangedEvent(events.LoanFieldIdentifier.MiscellaneousDebtAmountChanged, miscDebt);
        }

        function deleteMiscExpensesRow(item) {
            //wrappedLoan.ref.active.removeFromCollection(item, wrappedLoan.ref.active.getBorrower().getMiscDebts(), wrappedLoan.ref.active.getCoBorrower().getMiscDebts());
            item.isRemoved = true;
            // update the result
            // REASON: diggest circle breaks sometimes when we have a heavy change over the debt types, so we are storing the result in a object, and let the digest watch over the object
            vm.combinedMiscDebts = wrappedLoan.ref.active.getCombinedMiscDebts();
        }

        function moveDebtBetweenBorrowerAndCoBorrower(item) {
         
            if (item.borrowerId) {
                wrappedLoan.ref.active.switchBorrowerForMiscItem(item, wrappedLoan.ref.active.getBorrower().getMiscDebts(), wrappedLoan.ref.active.getCoBorrower().getMiscDebts());
                vm.combinedMiscDebts = wrappedLoan.ref.active.getCombinedMiscDebts();
            }
        }
    }
})();