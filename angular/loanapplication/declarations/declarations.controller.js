(function () {
    'use strict';
    angular.module('loanApplication').controller('declarationsController', function ($scope, $compile, $http, $log, BroadcastSvc, simpleModalWindowFactory, wrappedLoan, applicationData, enums) {

        var vm = this;
        vm.wrappedLoan = wrappedLoan;
        vm.showErrorMessage = false;
        vm.disableFields = false;
        vm.showDeclarationsTab = true;
        vm.miscDebts = {};
        vm.applicationData = applicationData;

        //Controller methods
        vm.getDeclarationsData = getDeclarationsData();
        vm.payeeChange = payeeChange;
        vm.monthsLeftChange = monthsLeftChange;
        vm.addRow = addRow;
        vm.removeRow = removeRow;
        vm.addLiability = addChildAlimony;
        vm.removeLiability = removeChildAlimony;
        vm.isInterviewFaceToFace = isInterviewFaceToFace;
        vm.isIdentificationOther = isIdentificationOther;
        vm.isAfterIssued = isAfterIssued;

        function isInterviewFaceToFace() {
            return vm.wrappedLoan.ref.active.declarations.loanOriginatorSource == enums.loanOriginatorSource.faceToFaceInterview;
        }

        function isIdentificationOther(borrower) {
            return borrower.declarationsInfo.certificationId == enums.certificationId.other;
        }

        function isBorrowerCheckedYesChildAlimony() {
            return vm.wrappedLoan.ref.active.getBorrower().declarationsInfo.alimonyChildSupportObligation == 1 || vm.wrappedLoan.ref.active.getBorrower().declarationsInfo.alimonyChildSupportObligation == null ? false : true;
        }

        function isCoBorrowerCheckedYesChildAlimony() {
            return vm.wrappedLoan.ref.active.getCoBorrower().declarationsInfo.alimonyChildSupportObligation == 1 || vm.wrappedLoan.ref.active.getCoBorrower().declarationsInfo.alimonyChildSupportObligation == null || !vm.wrappedLoan.ref.active.isSpouseOnTheLoan ? false : true;
        }

        function getDeclarationsData() {
            if (!wrappedLoan.ref.active.borrowerHasChildAlimony() && wrappedLoan.ref.active.getBorrower().declarationsInfo.alimonyChildSupportObligation != null) {
                vm.wrappedLoan.ref.active.getBorrower().declarationsInfo.alimonyChildSupportObligation = 1;
            }
            else if(wrappedLoan.ref.active.borrowerHasChildAlimony()){
                vm.wrappedLoan.ref.active.getBorrower().declarationsInfo.alimonyChildSupportObligation = 0;
            }
            if (wrappedLoan.ref.active.isSpouseOnTheLoan) {
                if (!wrappedLoan.ref.active.coBorrowerHasChildAlimony() && wrappedLoan.ref.active.getCoBorrower().declarationsInfo.alimonyChildSupportObligation != null) {
                    vm.wrappedLoan.ref.active.getCoBorrower().declarationsInfo.alimonyChildSupportObligation = 1;
                }
                else if (wrappedLoan.ref.active.coBorrowerHasChildAlimony()) {
                    vm.wrappedLoan.ref.active.getCoBorrower().declarationsInfo.alimonyChildSupportObligation = 0;
                }
            }
            vm.miscDebts = wrappedLoan.ref.separateMiscDebts(isBorrowerCheckedYesChildAlimony(), isCoBorrowerCheckedYesChildAlimony());
        };

        function payeeChange(value, index) {
                vm.miscDebts[index][1].payee = value;
                vm.miscDebts = wrappedLoan.ref.separateMiscDebts(isBorrowerCheckedYesChildAlimony(), isCoBorrowerCheckedYesChildAlimony());
        };

        function monthsLeftChange(value, index) {
                vm.miscDebts[index][1].monthsLeft = value;
        };

        function addRow() {
            if (wrappedLoan.ref.getDefaultRowChildAlimony() != undefined) {
                if (wrappedLoan.ref.getDefaultRowChildAlimony()[""] != undefined) {
                    wrappedLoan.ref.updateDefaultStatus();
                }
                else {
                    wrappedLoan.ref.updateDefaultStatus();
                    addNewMiscDebt();
                }
            }
            else if (!vm.miscDebts || !vm.miscDebts[""]) {
                addNewMiscDebt();
            }
            vm.miscDebts = wrappedLoan.ref.separateMiscDebts(isBorrowerCheckedYesChildAlimony(), isCoBorrowerCheckedYesChildAlimony());
        };

        function addNewMiscDebt() {
            var newDebt = new cls.MiscellaneousDebtViewModel();
            newDebt.typeId = srv.MiscellaneousDebtTypes.ChildCareExpensesForVALoansOnly;
            newDebt.amount = 0;
            newDebt.monthsLeft = 0;
            newDebt.payee = "";
            newDebt.isUserEntry = true;
            newDebt.isCoBorrower = !isBorrowerCheckedYesChildAlimony();
            if (isBorrowerCheckedYesChildAlimony())
                wrappedLoan.ref.active.getBorrower().addMiscDebts(newDebt);
            else if (isCoBorrowerCheckedYesChildAlimony())
                wrappedLoan.ref.active.getCoBorrower().addMiscDebts(newDebt);
        }

        function removeRow(key) {
            wrappedLoan.ref.active.getBorrower().removeMiscDebts(vm.miscDebts[key][0]);
            wrappedLoan.ref.active.getBorrower().removeMiscDebts(vm.miscDebts[key][1]);
            wrappedLoan.ref.active.getCoBorrower().removeMiscDebts(vm.miscDebts[key][0]);
            wrappedLoan.ref.active.getCoBorrower().removeMiscDebts(vm.miscDebts[key][1]);
            wrappedLoan.ref.active.addDefaultChildAlimonyIfLastRemoved();
            delete vm.miscDebts[key];
        };

        function removeChildAlimony(isCoBorrower) {
            for (var key in vm.miscDebts) {
                if (vm.miscDebts[key][0].isCoBorrower == isCoBorrower) {
                    wrappedLoan.ref.active.getBorrower().removeMiscDebts(vm.miscDebts[key][0]);
                    wrappedLoan.ref.active.getCoBorrower().removeMiscDebts(vm.miscDebts[key][0]);
                }
                else {
                    wrappedLoan.ref.active.getBorrower().removeMiscDebts(vm.miscDebts[key][1]);
                    wrappedLoan.ref.active.getCoBorrower().removeMiscDebts(vm.miscDebts[key][1]);
                }
            }
            wrappedLoan.ref.active.addDefaultChildAlimonyIfLastRemoved();
            vm.miscDebts = wrappedLoan.ref.separateMiscDebts(isBorrowerCheckedYesChildAlimony(), isCoBorrowerCheckedYesChildAlimony());
        };

        function addChildAlimony(isCoBorrower) {
            vm.miscDebts = wrappedLoan.ref.separateMiscDebts(isBorrowerCheckedYesChildAlimony(), isCoBorrowerCheckedYesChildAlimony());
        };

        function isAfterIssued(isCoBorrower) {

            if (!isCoBorrower)
                return new cls.DeclarationInfoViewModel(wrappedLoan.ref.active.getBorrower().declarationsInfo).expiredAfterIssued();
            else
                return new cls.DeclarationInfoViewModel(wrappedLoan.ref.active.getCoBorrower().declarationsInfo).expiredAfterIssued();
        };

    });
})();