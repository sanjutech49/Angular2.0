(function () {
    'use strict';

    angular.module('loanApplication').controller('incomeController', incomeController);

    incomeController.$inject = ['$rootScope', 'incomeService', 'incomeHelper', 'modalPopoverFactory', 'BroadcastSvc', 'simpleModalWindowFactory', 'wrappedLoan', 'controllerData', 'applicationData', 'loanEvent', '$timeout'];

    function incomeController($rootScope, incomeService, incomeHelper, modalPopoverFactory, BroadcastSvc, simpleModalWindowFactory, wrappedLoan, controllerData, applicationData, loanEvent, $timeout) {

        var vm = this;
        vm.wrappedLoan = wrappedLoan;
        vm.controllerData = controllerData;
        vm.applicationData = applicationData;

        vm.borrowers = wrappedLoan.ref.active.Borrowers(false, true);
        vm.coBorrowerExists = wrappedLoan.ref.active.getCoBorrower() && wrappedLoan.ref.active.isSpouseOnTheLoan;


        // Controller methods
        vm.combinedOtherIncome = combinedOtherIncome;
        vm.addEmploymentInfo = addEmploymentInfo;
        vm.addOtherIncome = addOtherIncome;
        vm.deleteOtherIncome = deleteOtherIncome;
        vm.onYearsOnThisJobChanged = onYearsOnThisJobChanged;
        vm.removeEmploymentInfo = removeEmploymentInfo;
        vm.showHistoryInfo = showHistoryInfo;
        vm.validateEmploymentDuration = validateEmploymentDuration;
        //vm.onOtherIncomeAmountChanged = onOtherIncomeAmountChanged;
        vm.onOtherIncomeAmountBlur = onOtherIncomeAmountBlur;
        vm.onOtherIncomeTypeChanged = onOtherIncomeTypeChanged;
        vm.onOtherIncomePaymentPeriodChanged = onOtherIncomePaymentPeriodChanged;     
        vm.refreshOtherIncomes = refreshOtherIncomes();
        vm.isminus = false;

        refreshOtherIncomes();

        function validateEmploymentDuration(borrower, employmentInfo) {
            if (!borrower)
                return;

            if (!employmentInfo) {
                employmentInfo = borrower.getCurrentEmploymentInfo();
                if ((!employmentInfo.employmentEndDate && !moment(employmentInfo.employmentEndDate).isValid()) || employmentInfo.EmploymentStatusId == 1)
                    employmentInfo.employmentEndDate = moment();
            }

            if (borrower.areEmploymentDatesValid(employmentInfo))
                if (!borrower.isTotalEmploymentTwoYears)
                    addEmploymentInfo(borrower, true);
        }

        //function onOtherIncomeAmountChanged(otherIncome, index) {
        //    if (otherIncome.isNetRental) {
        //        vm.isminus = false;
        //        if (otherIncome.amount == "-") {
        //            otherIncome.amount = 0;
        //            vm.isminus = true;
        //        }

        //        otherIncome.manualChange = true;

        //        vm.index = index;                
        //        vm.wrappedLoan.ref.areSixPiecesAcquiredForAllLoanApplications();
        //    }
        //}

        function onOtherIncomeAmountBlur(otherIncome) {
          
            loanEvent.broadcastPropertyChangedEvent(events.LoanFieldIdentifier.OtherIncomeAmount, otherIncome);
            vm.wrappedLoan.ref.areSixPiecesAcquiredForAllLoanApplications(); 
        }

        function onOtherIncomeTypeChanged(otherIncome) {
            loanEvent.broadcastPropertyChangedEvent(events.LoanFieldIdentifier.OtherIncomeType, otherIncome);
            vm.wrappedLoan.ref.areSixPiecesAcquiredForAllLoanApplications();         
        }

        function onOtherIncomePaymentPeriodChanged(otherIncome) {

            if (otherIncome.isNetRental)
                otherIncome.manualChange = true;

            loanEvent.broadcastPropertyChangedEvent(events.LoanFieldIdentifier.OtherIncomePaymentPeriod, otherIncome);
        }

        function addEmploymentInfo(borrower, isPrevious) {
            borrower.addAdditionalEmploymentInfo(isPrevious);
        }

        function removeEmploymentInfo(employmentInfoItem, borrower) {

            //
            //if (employmentInfoItem.isAdded)
            //    wrappedLoan.ref.active.deleteFromCollection(employmentInfoItem, wrappedLoan.ref.active.getBorrower().getAdditionalEmploymentInfo(),
            //        wrappedLoan.ref.active.getCoBorrower().getAdditionalEmploymentInfo());
            //else
            //    wrappedLoan.ref.active.removeFromCollection(employmentInfoItem, wrappedLoan.ref.active.getBorrower().getAdditionalEmploymentInfo(),
            //        wrappedLoan.ref.active.getCoBorrower().getAdditionalEmploymentInfo());

            //
            // remove or delete
            // @todo-cl: Elevate to LoanViewModel , Borrower/CoBorrower can be found by Id , etc.
            var borrowerParent = wrappedLoan.ref.getTransactionInfo().borrower.lookup(employmentInfoItem.borrowerId);
            borrowerParent.removeOrDeleteEmploymentInfo(employmentInfoItem);

            // re-calculate
            incomeService.orderEmpInfoListAndCalculateTotals(borrower.getCurrentEmploymentInfo, borrower.getAdditionalEmploymentInfo());

            //if user deletes one section and employment info history isn't 2 or more years anymore then we change the flag 'IsEmployedTwoYears'
            incomeHelper.checkEmploymentInfosHistory(borrower);
        }

        function showHistoryInfo(event, model) {

            var ctrl = {
                    title: 'Other Income Information History'
            }
            var confirmationPopup = modalPopoverFactory.openModalPopover('angular/common/historycontrol.html', ctrl, model.companyData, event);

            confirmationPopup.result.then(function (data) {
        });
        }

        //
        // @todo-cl: remove LoanViewModel::OtherIncomes
        //

        function refreshOtherIncomes() {

            var otherIncomeList = wrappedLoan.ref.active.getBorrower().getOtherIncomes();
            if (wrappedLoan.ref.active.isSpouseOnTheLoan) {
                otherIncomeList = otherIncomeList.concat(wrappedLoan.ref.active.getCoBorrower().getOtherIncomes());
            }
            vm._combinedOtherIncome = otherIncomeList;           
        }

        function combinedOtherIncome(coi) {
            if (arguments.length > 0) {
                /*Read-Only*/
            }         
            refreshOtherIncomes();  
            return vm._combinedOtherIncome;
        }

        function addOtherIncome() {
            //
            // wrappedLoan.ref.addOtherIncome(new cls.OtherIncomeInfoViewModel());

            //
            wrappedLoan.ref.active.getBorrower().addOtherIncome();
            
            refreshOtherIncomes();
        }       

        function deleteOtherIncome(incomeInfoItem) {               

            //
            //if (incomeInfoItem.isCurrentlyAdded && !incomeInfoItem.isNetRental)
            //    wrappedLoan.ref.deleteOtherIncome(incomeInfoItem);
            //else
            //    wrappedLoan.ref.removeOtherIncome(incomeInfoItem);

            //
            var borrowerParent = wrappedLoan.ref.getTransactionInfo().borrower.lookup(incomeInfoItem.borrowerId);
            borrowerParent.removeOrDeleteIncomeInfoViewModel(incomeInfoItem);
            refreshOtherIncomes();
            vm.wrappedLoan.ref.areSixPiecesAcquiredForAllLoanApplications();
            loanEvent.broadcastPropertyChangedEvent(events.LoanFieldIdentifier.OtherIncomeAmount, incomeInfoItem);
        }

        function onYearsOnThisJobChanged(borrower, empInfo) {
            incomeService.onYearsOnThisJobChanged(borrower, empInfo);          
        }        
    }
})();
