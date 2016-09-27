
/**
  * @namespace Controllers
  * @desc Liabilities Controller
  * @memberOf loanApplication module - credit section
 */

(function () {
    'use strict';
    angular.module('loanApplication').controller('liabilitiesController', liabilitiesController);

    liabilitiesController.$inject = ['$scope', 'wrappedLoan', 'CreditHelpers', 'modalPopoverFactory', 'CreditSvc', 'controllerData', 'applicationData', 'loanEvent', 'CreditStateService', 'guidService'];

    function liabilitiesController($scope, wrappedLoan, CreditHelpers, modalPopoverFactory, CreditSvc, controllerData, applicationData, loanEvent, CreditStateService, guidService) {
        var vm = this;
        vm.wrappedLoan = wrappedLoan;

        /**
          * Properties
         */
        vm.isCollapsed = controllerData.isCollapsed;
        vm.totalPayments = null;
        vm.totalLiabilities = null;
        vm.flags = controllerData.liabilities.flags;
        vm.applicationData = applicationData;
        vm.debtAccountOwnershipTypes = [];
        //vm.refreshLiablities = true;

        /**
          * Functions for VM
         */
        vm.showCompanyInfo = showCompanyInfo;
        vm.addLiabilitiesRow = addLiabilitiesRow;
        vm.moveLiabilityToREO = moveLiabilityToREO;
        vm.deleteLiabilitiesRow = deleteLiabilitiesRow;
        vm.processJointLiabilityRecords = processJointLiabilityRecords;
        vm.getAccountOwnershipTypeIndicator = getAccountOwnershipTypeIndicator;
        vm.onLiabilityTypeChanged = onLiabilityTypeChanged;
        vm.onLiabilityMonthsLeftChanged = onLiabilityMonthsLeftChanged;
        vm.onLiabilityUnpaidBalanceChanged = onLiabilityUnpaidBalanceChanged;
        vm.onLiabilityMinPaymentChanged = onLiabilityMinPaymentChanged;
        vm.onLiabilityCommentIDChanged = onLiabilityCommentIDChanged;
        vm.getBorrowerLiabilities = function () {
            return wrappedLoan.ref.active.borrowerLiabilities;
        };

        // @todo - use enum instead of hardcoded values in html
        vm.summateLiabiltyUnpaidBalance = CreditStateService.summateLiabiltyUnpaidBalance;

        vm.summateLiabiltyPayment = CreditStateService.summateLiabiltyPayment;
        /**
          * Function declerations
         */

        //loanEvent.registerForSystemEvent('liabilitiesController', this, function (systemEvent) {
        //    if (systemEvent.eventId == events.SystemEventIdentifier.creditCheckComplete)
        //        vm.refreshLiablities = true;
        //})

        vm.borrowerDebtAccountOwnershipTypes = CreditStateService.borrowerDebtAccountOwnershipTypes;
        vm.coBorrowerDebtAccountOwnershipTypes = CreditStateService.coBorrowerDebtAccountOwnershipTypes;
        vm.debtAccountOwnershipTypes = CreditStateService.debtAccountOwnershipTypes;

        function onLiabilityTypeChanged(liability) {
            if (liability.isSecondaryPartyRecord == true) return;
            loanEvent.broadcastPropertyChangedEvent(events.LoanFieldIdentifier.LiabilityType, liability);
        }

        function onLiabilityMonthsLeftChanged(liability) {
            if (liability.isSecondaryPartyRecord == true) return;
            loanEvent.broadcastPropertyChangedEvent(events.LoanFieldIdentifier.LiabilityMonthsLeft, liability);
        }

        function onLiabilityUnpaidBalanceChanged(liability) {
            if (liability.isSecondaryPartyRecord == true) return;
            loanEvent.broadcastPropertyChangedEvent(events.LoanFieldIdentifier.LiabilityUnpaidBalance, liability);
        }

        function onLiabilityMinPaymentChanged(liability) {
            if (liability.isSecondaryPartyRecord == true) return;
            loanEvent.broadcastPropertyChangedEvent(events.LoanFieldIdentifier.LiabilityMinPayment, liability);
        }

        function onLiabilityCommentIDChanged(liability) {
            if (liability.isSecondaryPartyRecord == false || angular.isUndefined(liability.isSecondaryPartyRecord)) {
                loanEvent.broadcastPropertyChangedEvent(events.LoanFieldIdentifier.LiabilityCommentID, liability);
            }

            this.wrappedLoan.ref.active.handleJointWithCoBorrowerLiability(liability);
            liability.handleCommentChange();
        }

        function addLiabilitiesRow(isMainBorrower, debtsAccountOwnershipType) {
            var coborrowerLiabilitiesCount = !wrappedLoan.ref.active.isSpouseOnTheLoan || !wrappedLoan.ref.active.getCoBorrower().getLiabilities() ? 0 : wrappedLoan.ref.active.getCoBorrower().getLiabilities().length;
            var liability = createNewLiability(wrappedLoan.ref.active.getBorrower().getLiabilities().length + coborrowerLiabilitiesCount + 1);

            guidService.getNewGuid().then(function (response) {
                liability.liabilityInfoId = String(response.data);

                switch (debtsAccountOwnershipType) {
                    case String(srv.DebtsAccountOwnershipType.Borrower):
                    case String(srv.DebtsAccountOwnershipType.CoBorrower):
                        setLiabilityAccountOwnershipType(liability, String(srv.LiabilitiesAccountOwnershipType.Individual), debtsAccountOwnershipType, false);
                        addLiabilityToList(liability, isMainBorrower);
                        break;
                    case String(srv.DebtsAccountOwnershipType.Joint):
                        {
                            setLiabilityAccountOwnershipType(liability, String(srv.LiabilitiesAccountOwnershipType.JointContractualLiability), debtsAccountOwnershipType, false);
                            liability.isJoint = true;
                            addLiabilityToList(liability, isMainBorrower);

                            if (!wrappedLoan.ref.active.isSpouseOnTheLoan)
                                break;

                            var coBorrowerLiability = createNewLiability(wrappedLoan.ref.active.getCoBorrower().getLiabilities().length + 1);
                            guidService.getNewGuid().then(function (response) {
                                coBorrowerLiability.liabilityInfoId = String(response.data);
                                coBorrowerLiability.isSecondaryPartyRecord = true;
                                coBorrowerLiability.originalLiabilityInfoId = liability.liabilityInfoId;
                                coBorrowerLiability.liabilityDisabled = true;
                                coBorrowerLiability.originalClientId = liability.clientId;
                                setLiabilityAccountOwnershipType(coBorrowerLiability, String(srv.LiabilitiesAccountOwnershipType.JointContractualLiability), debtsAccountOwnershipType, false);

                                addLiabilityToList(coBorrowerLiability, !isMainBorrower);
                            });
                            break;
                        }
                    case String(srv.DebtsAccountOwnershipType.BorrowerWithOther):
                    case String(srv.DebtsAccountOwnershipType.CoBorrowerWithOther):
                        {
                            setLiabilityAccountOwnershipType(liability, String(srv.LiabilitiesAccountOwnershipType.JointContractualLiability), debtsAccountOwnershipType, true);
                            liability.isJoint = true;

                            addLiabilityToList(liability, isMainBorrower);
                            break;
                        }
                }
            });
        };

        function addLiabilityToList(liability, isMainBorrower) {
            CreditStateService.addLiability(liability, !isMainBorrower);
        }

        function setLiabilityAccountOwnershipType(liability, type, debtsAccountOwnershipType, isJointWithSingleBorrowerID) {
            liability.liabilitiesAccountOwnershipType = type;
            liability.isJointWithSingleBorrowerID = isJointWithSingleBorrowerID;
            liability.DebtsAccountOwnershipType = debtsAccountOwnershipType;
        }

        function createNewLiability(clientId) {
            var liability = new cls.LiabilityViewModel(vm.wrappedLoan.ref.getTransactionInfoRef(),
                {
                    typeId: 2, isUserEntry: true, unpaidBalance: 0, clientId: clientId, includeInLiabilitiesTotal: true,
                    includeInDTI: true, currentratingType: null, isNewRow: true,
                    companyData: new cls.CompanyDataViewModel()
                });
            return liability;
        }

        function deleteLiabilitiesRow(item, isCoBorrower) {
            CreditStateService.deleteLiabilities(item, isCoBorrower);
        };

        function getAccountOwnershipTypeIndicator(liability) {
            if (liability.accountOwnershipTypeIndicator == "")
                return "display-none";

            return 'imp-icon-' + liability.accountOwnershipTypeIndicator;
        };

        function moveLiabilityToREO(liability, isCoborrower) {
            var moved = CreditStateService.moveLiabilityToREO(liability, isCoborrower);
        };

        //[OBSOLETE]
        // @todo-cl/@err: REMOVE , Throwing Exception
        // processes joint liability records by copying the values from original liability
        function processJointLiabilityRecords(liabilityInfoId) {
            CreditHelpers.processJointLiabilityRecords(wrappedLoan.ref.active.getLiabilities(), liabilityInfoId);
        };

        function showCompanyInfo(liability, event) { // , isSecondaryPartyRecord, debtAccountOwnershipTypes) {
            var initialModel = angular.copy(liability.companyData);
            var result = CreditHelpers.getCompanyInfoData(liability, false, wrappedLoan.ref.lookup.liabilityTypes, CreditStateService.getDebtAccountOwnershipTypes(), true, liability.isSecondaryPartyRecord, vm.flags.isDisableFields, wrappedLoan.ref.lookup.allStates);

            var confirmationPopup = modalPopoverFactory.openModalPopover('angular/loanapplication/credit/companycreditcontrol.html', result, liability.companyData, event);
            confirmationPopup.result.then(function (data) {
                liability.companyData.hasChanges = CreditHelpers.companyHasChanges(initialModel, liability, result);

                var shouldUpdateDTI = liability.debtsAccountOwnershipType != result.debtsAccountOwnershipType;
                liability.debtsAccountOwnershipType = result.debtsAccountOwnershipType;

                /*
               @todo: SecondaryBorrower:
                   DeleteSecondaryLiabilitiesRow(vm, liability.LiabilityInfoId);
                   var newDebtSecondaryBorrower = data[1];
                   vm.CreditTabViewModel.LiabilitiesViewModel.Liabilities.push(newDebtSecondaryBorrower);
               **/

                CreditHelpers.ProcessRulesForLiabilityOwnershipType(liability, vm);

                if (shouldUpdateDTI)
                    loanEvent.broadcastPropertyChangedEvent(events.LoanFieldIdentifier.LiabilityOwnershipType, liability);
            });
        };

    }
})();