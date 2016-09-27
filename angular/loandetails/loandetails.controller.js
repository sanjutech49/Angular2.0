(function () {
    'use strict';
    angular.module('loanDetails')
        .controller('loanDetailsController', loanDetailsController);

    loanDetailsController.$inject = ['$log',
                                     '$scope',
                                     '$modal',
                                     '$modalStack',
                                     '$state',
                                     '$filter',
                                     'loanDetailsSvc',
                                     'modalPopoverFactory',
                                     'calculatorSvc',
                                     '$controller',
                                     '$interval',
                                     'wrappedLoan',
                                     'controllerData',
                                     'applicationData',
                                     'enums',
                                     'encompassSvc',
                                     'NavigationSvc',
                                     'digitaldocSvc',
                                     'loanEvent',
                                     'commonModalWindowFactory',
                                     'modalWindowType',
                                     'costDetailsHelpers',
                                     '$timeout',
                                     'BroadcastSvc',
                                     'costDetailsSvc',
                                     'discloseActions',
                                     'exportToEncompassActions',
                                     'userAccountId',
                                     'DocumentsService',
                                     'commonCalculatorSvc',
                                     'vaCenterService',
                                     'CreditStateService'];

    function loanDetailsController($log, $scope, $modal, $modalStack, $state, $filter, loanDetailsSvc, modalPopoverFactory, calculatorSvc, $controller, $interval, wrappedLoan,
                                    controllerData, applicationData, enums, encompassSvc, NavigationSvc, digitaldocSvc, loanEvent, commonModalWindowFactory, modalWindowType,
                                    costDetailsHelpers, $timeout, BroadcastSvc, costDetailsSvc, discloseActions, exportToEncompassActions, userAccountId, DocumentsService, commonCalculatorSvc, vaCenterService, CreditStateService)

    {
        var vm = this;
        vm.wrappedLoan = wrappedLoan;

        vm.canFlip = vm.wrappedLoan.ref.leadManagerId !== undefined &&
            vm.wrappedLoan.ref.leadManagerId.length > 0
            && (vm.wrappedLoan.ref.product.programName == "" ||
            vm.wrappedLoan.ref.product.programName == undefined ||
            vm.wrappedLoan.ref.product.programName == null);
        vm.flipPurpose = flipPurpose;
        CreditStateService.initializeLoan(wrappedLoan);

        vm.loanDetailsSvc = loanDetailsSvc;
        vm.controllerData = controllerData;
        vm.LoanDetailsViewModel = [];
        vm.CalculatorViewModel = [];
        vm.applicationData = applicationData;

        

        vm.borrowers = [{ name: 'Anakin Sykwalker', coname: 'Luke Skywalker', price: '$100.00' }, { name: 'Anakin Sykwalker', coname: 'Luke Skywalker', price: '$100.00' }, { name: 'Anakin Sykwalker', coname: 'Luke Skywalker', price: '$100.00' }, { name: 'Luke Skywalker', coname: 'Tim Skywalker', price: '$50.00' }, { name: 'Darth Vader', coname: 'Murga Skywalker', price: '$900.00' }];
        //Controller methods
        //init();
        vm.amortizationType = null;
        vm.showClosingDate = showClosingDate;
        vm.onDownPaymentChange = onDownPaymentChange;
        vm.onDownPaymentPercentChange = onDownPaymentPercentChange;
        vm.onPurchasePriceChange = onPurchasePriceChange;
        vm.onLoanAmountChange = onLoanAmountChange;
        vm.enums = enums;
        vm.grandTotal = getGrandTotal();
        vm.userAccountId = userAccountId;

        vm.getDownPaymentSourceText = getDownPaymentSourceText;
        vm.getDefaultPricingAction = getDefaultPricingAction;
        vm.checkExportToEncompassActions = checkExportToEncompassActions;

        vm.pricingActions = [{ name: 'Update pricing', value: 1 }, { name: 'Shop for Rates', value: 2 }];
        vm.saveDiscloseActions = discloseActions;
        vm.exportToEncompassActions = exportToEncompassActions;
        vm.complianceDate = "";
        initializeComplianceDate();
        checkSaveDiscloseActions();
        vm.pricingAction = getDefaultPricingAction();
        vm.saveDiscloseAction = getDefaultSaveDiscloseAction();
        vm.showPricingAction = showPricingAction;
        vm.callPricingAction = callPricingAction;

        vm.pricingInfo = pricingInfo;

        vm.showAppraisalContingencyDatePopup = showAppraisalContingencyDatePopup;
        vm.showApprovalContingencyDatePopup = showApprovalContingencyDatePopup

        vm.showSaveDiscloseAction = showSaveDiscloseAction;
        vm.callSaveDiscloseAction = callSaveDiscloseAction;
        vm.callExportToEncompassAction = callExportToEncompassAction;

        vm.disablePricingButton = disablePricingButton;
        vm.disableExportToEncompass = disableExportToEncompass;
        vm.exportToEncompass = exportToEncompass;

        //vm.wrappedLoan.ref.populateAndFormatProductClass();

        vm.disableDisclosuresCall = false;//!controllerData.repricing;
        vm.closeAllModals = closeAllModals()
        vm.repriceLoan = repriceLoan;
        vm.bottomButtonPricingAction = bottomButtonPricingAction;

        //Wholesale submit for Approval
        vm.submitForApproval = submitForApproval;
        vm.submitForApprovalAction = submitForApprovalAction;
        vm.isApprovalDisabled = isApprovalDisabled;
        vm.checkPricingTimespan = checkPricingTimespan;

        vm.lowerDecisionScore = getLowestMiddleFicoScore;

        vm.cancel = cancel;
        vm.bankStatementForIncome = getBankStatementsForIncome();
        vm.getBorrowerOtherPayment = getBorrowerOtherPayment;
        vm.getCoBorrowerOtherPayment = getCoBorrowerOtherPayment;
        vm.getAdditionalMortgages = getAdditionalMortgages;
        vm.additionalMortgageesIncome = getAdditionalMortgageesIncome();

        vm.getOtherIncomeBorrower = getOtherIncomeBorrower();
        vm.getOtherIncomeCoBorrower = getOtherIncomeCoBorrower();
        vm.otherIncomeTotalForBorrowerAndCoborrower = getOtherIncomeTotalForBorrowerAndCoborrower();

        function getOtherIncomeBorrower(){
            var result = wrappedLoan.ref.getOtherIncomeSumForBorrowerWithMiscExpenses(wrappedLoan.ref.primary.getBorrower());
            return result;
        }

        function getOtherIncomeCoBorrower(){
            var result = wrappedLoan.ref.getOtherIncomeSumForBorrowerWithMiscExpenses(wrappedLoan.ref.primary.getCoBorrower());
            return result;
        }



        function getOtherIncomeTotalForBorrowerAndCoborrower(){
            var result = getOtherIncomeBorrower() + getOtherIncomeCoBorrower();
                /*
                getAdditionalMortgageesIncome()
                       + wrappedLoan.ref.incomeTotalForBorrowerWithMiscExpenses(wrappedLoan.ref.primary.getBorrower())
                       + wrappedLoan.ref.getCashFlowForNetRentalIncomes(wrappedLoan.ref.primary.getBorrower(),false) 
                       + wrappedLoan.ref.incomeTotalForBorrowerWithMiscExpenses(wrappedLoan.ref.primary.getCoBorrower())
                       + wrappedLoan.ref.getCashFlowForNetRentalIncomes(wrappedLoan.ref.primary.getCoBorrower(),false);*/
			   
            return result
        }

        function getBorrowerOtherPayment() {
            return loanDetailsSvc.getOtherPayments(0, wrappedLoan.ref.loanPurposeType, true);
        }

        function getCoBorrowerOtherPayment() {
            return loanDetailsSvc.getOtherPayments(1, wrappedLoan.ref.loanPurposeType, true);
        }

        function getAdditionalMortgageesIncome() {
            var total = 0;
            var pred = function(miscDebt) { return miscDebt.typeId == srv.MiscellaneousDebtTypes.Expenses2106FromTaxReturns; } 
            var accessor = function (l) { return l.amount; }

            for (var i = 0; i < wrappedLoan.ref.getLoanApplications().length; i++) {
                if (!wrappedLoan.ref.getLoanApplications()[i].isPrimary) {

                    total += wrappedLoan.ref.getCashFlowForNetRentalIncomes(wrappedLoan.ref.getLoanApplications()[i].getBorrower(), false) + wrappedLoan.ref.incomeTotalForBorrowerWithMiscExpenses(wrappedLoan.ref.getLoanApplications()[i].getBorrower(), true);
                    total += wrappedLoan.ref.getCashFlowForNetRentalIncomes(wrappedLoan.ref.getLoanApplications()[i].getCoBorrower(), false) + wrappedLoan.ref.incomeTotalForBorrowerWithMiscExpenses(wrappedLoan.ref.getLoanApplications()[i].getCoBorrower(), true);

                    //add Expenses2106FromTaxReturns for borrower
                    if (wrappedLoan.ref.getLoanApplications()[i].getBorrower()
                        && wrappedLoan.ref.getLoanApplications()[i].getBorrower().getMiscDebts()) {
                        total -= lib.summate(wrappedLoan.ref.getLoanApplications()[i].getBorrower().getMiscDebts(), pred, accessor);
                    }

                    //add Expenses2106FromTaxReturns for coborrower
                    if (wrappedLoan.ref.getLoanApplications()[i].isSpouseOnTheLoan && wrappedLoan.ref.getLoanApplications()[i].getCoBorrower()
                        && wrappedLoan.ref.getLoanApplications()[i].getCoBorrower().getMiscDebts()) {
                        total -= lib.summate(wrappedLoan.ref.getLoanApplications()[i].getCoBorrower().getMiscDebts(), pred, accessor);
                    }
                        
                    
                }
            }

           
            return total;
        }
        NavigationSvc.contextualType = enums.ContextualTypes.LoanDetails;

        function pricingInfo() {
            return loanDetailsSvc.getPrice(wrappedLoan.ref);
        }

        function getLowestMiddleFicoScore() {
            var midFicoScore = commonCalculatorSvc.GetLowestMiddleFicoScore(vm.wrappedLoan, applicationData);

            return midFicoScore;
            }            

        function getBankStatementsForIncome() {
            var bankStatementIncome = '';
            if (wrappedLoan.ref.otherInterviewData.searchCriteria.bankStatementsIncome == "0")
                bankStatementIncome = "NA (Stated or Paystubs / W-2)";
            else if (wrappedLoan.ref.otherInterviewData.searchCriteria.bankStatementsIncome == "1")
                bankStatementIncome = "6 Months";
            else if (wrappedLoan.ref.otherInterviewData.searchCriteria.bankStatementsIncome == "2")
                bankStatementIncome = "12 Months";
            else if (wrappedLoan.ref.otherInterviewData.searchCriteria.bankStatementsIncome == "3")
                bankStatementIncome = "24 Months";
            return bankStatementIncome;
            }


        function repriceLoan(successAdditionalCallback) {
            commonModalWindowFactory.open({ type: modalWindowType.loader, message: 'Updating Pricing' });

            if (wrappedLoan.ref.getSubjectProperty().stateName == "") {
                try {
                    wrappedLoan.ref.getSubjectProperty().stateName = applicationData.lookup.states.filter(function (e) { return e.value == wrappedLoan.ref.getSubjectProperty().stateId.toString() })[0].text;
                }
                catch (e) {
                    return;
                };
            };

            loanDetailsSvc.RepriceEngine.reprice({ currentUserId : applicationData.currentUserId }, wrappedLoan.ref).$promise.then(function (data) {
                wrappedLoan.ref = new cls.LoanViewModel(data, $filter);
                costDetailsHelpers.initializeCostService(wrappedLoan);
                costDetailsHelpers.getCostDetailsData();
                loanEvent.broadcastPropertyChangedEvent(events.LoanFieldIdentifier.todo);
                BroadcastSvc.broadcastUpdateSectionSeven();
                closeAllModals();
                if (successAdditionalCallback) {
                    successAdditionalCallback();
                }
                else {
                    commonModalWindowFactory.open({ type: modalWindowType.success, message: 'Pricing Updated Successfully!' });
                }
            }, function () {
                closeAllModals();
                commonModalWindowFactory.open(
                {
                    type: modalWindowType.unsuccess, message: 'This loan product is no longer eligible, would you like to shop for rates?',
                    ctrl: vm,
                    ctrlButtons: [{
                        title: 'Shop for Rates', styleClass: 'imp-button-div-hs-ws-prim',
                        width: '140px', height: '30px', callback: 'bottomButtonPricingAction'
                    }]
                });
            });
        };

        function closeAllModals() {
            $modalStack.dismissAll('close');
        }

        //fix - amortization type showing number instead of value
        if (vm.wrappedLoan.ref.financialInfo.amortizationType) {
            switch (vm.wrappedLoan.ref.financialInfo.amortizationType) {
                case srv.AmortizationType.None:
                    vm.amortizationType = "None";
                    return;
                case srv.AmortizationType.Fixed:
                    vm.amortizationType = "Fixed";
                    return;
                case srv.AmortizationType.ARM:
                    vm.amortizationType = "ARM";
                    return;
                case srv.AmortizationType.GPM:
                    vm.amortizationType = "GPM";
                    return;
                case srv.AmortizationType.Other:
                    vm.amortizationType = "Other";
                    return;

            }

        };

        function getAdditionalMortgages(context) {
            var total = 0;
            total += loanDetailsSvc.getOtherPayments(context, wrappedLoan.ref.loanPurposeType, false);
            total += loanDetailsSvc.getCacheFlowAdditionalMorgages(true, context);//True - Use Negative

            return total;
        }

        function getAdditionalMortgageesAssets() {
            var total = 0;
            for (var i = 0; i < wrappedLoan.ref.getLoanApplications().length; i++) {
                if (!wrappedLoan.ref.getLoanApplications()[i].isPrimary) {
                    total += wrappedLoan.ref.getFinancialsTotal(wrappedLoan.ref.getLoanApplications()[i], 'borrower');
                    total += wrappedLoan.ref.getAutomobilesTotal(wrappedLoan.ref.getLoanApplications()[i], 'borrower');
                    total += wrappedLoan.ref.getLifeInsuranceTotal(wrappedLoan.ref.getLoanApplications()[i], 'borrower');
                    total += wrappedLoan.ref.getFinancialsTotal(wrappedLoan.ref.getLoanApplications()[i], 'coborrower');
                    total += wrappedLoan.ref.getAutomobilesTotal(wrappedLoan.ref.getLoanApplications()[i], 'coborrower');
                    total += wrappedLoan.ref.getLifeInsuranceTotal(wrappedLoan.ref.getLoanApplications()[i], 'coborrower');
                }
            }
            return total;
        }

        function getGrandTotal() {
            var total = 0;
            var isJoint;

            for (var i = 0; i < wrappedLoan.ref.getLoanApplications().length; i++) {
                isJoint = wrappedLoan.ref.getLoanApplications()[i].isSpouseOnTheLoan

                total += wrappedLoan.ref.getFinancialsTotal(wrappedLoan.ref.getLoanApplications()[i], 'borrower');
                total += !isJoint ? 0 : wrappedLoan.ref.getFinancialsTotal(wrappedLoan.ref.getLoanApplications()[i], 'coborrower');

                total += wrappedLoan.ref.getAutomobilesTotal(wrappedLoan.ref.getLoanApplications()[i], 'borrower');
                total += !isJoint ? 0 : wrappedLoan.ref.getAutomobilesTotal(wrappedLoan.ref.getLoanApplications()[i], 'coborrower');

                total += wrappedLoan.ref.getLifeInsuranceTotal(wrappedLoan.ref.getLoanApplications()[i], 'borrower');
                total += !isJoint ? 0 : wrappedLoan.ref.getLifeInsuranceTotal(wrappedLoan.ref.getLoanApplications()[i], 'coborrower');
            }

            return total;
        }

        //refresh the financial info data
        //getFinancialInfo();

        //Refresh details of transaction data.
        //TODO: Needs to be invoked from here! This is currently refreshed only when Loading full wrappedLoan.ref ( LoanViewModelBuilder.Build() )

        function init() {
            //loanDetailsSvc.GetLoanDetailsData.GetLoanDetailsData({ loanId: $scope.selectedLoanId }).$promise.then(
            //function (data) {

            //    vm.LoanDetailsViewModel = data;                

            //},
            //function (error) {
            //    $log.error('Failure loading wrappedLoan.ref Details data', error);
            //});

            calculatorSvc.GetImpounds.GetImpounds({
                loanId: $scope.selectedLoanId
            }).$promise.then(
                function (data) {
                    $log.debug("Retrieved data" + data);
                    vm.CalculatorViewModel = data;
                },
                function (error) {
                    $log.error('Failure loading Impound Calculator data', error);
                });

        };

                        
        function checkSaveDiscloseActions() {
            lib.forEach(vm.saveDiscloseActions, function (action) {
                if (action.name == srv.loanDetailsActions.RunComplianceCheck) {
                    if (!vm.wrappedLoan.ref.sixPiecesAcquiredForAllLoanApplications || disableExportToEncompass()) {
                        action.disabled = true;
                    }
                    else {
                        action.disabled = false;
                    }
                }
                if (action.name == srv.loanDetailsActions.CreateInitialDisclosures || action.name == srv.loanDetailsActions.CreateInitialLockDisclosures) {
                    if (isDisclosuresButtonDisabled()) {
                        action.disabled = true;
                    }
                    else {
                        action.disabled = false;
                    }
                }
            })
        };

        function initializeComplianceDate() {
                var appDate = vm.wrappedLoan.ref.applicationDate;
                if (!vm.wrappedLoan.ref.applicationDate || !common.date.isValidDate(vm.wrappedLoan.ref.applicationDate))
                    appDate = new Date();

                vm.loanDetailsSvc.getComplianceDate.getComplianceDate({ appDate: appDate, stateName: vm.wrappedLoan.ref.getSubjectProperty().stateName }).$promise.then(
                function (data) {
                    if (data && data.complianceDate) {
                        vm.complianceDate = (moment(data.complianceDate)).format('MM/DD/YY HH:mm');
                        checkExportToEncompassActions();
                    }
                },
                function (errorMsg) {
                    $log.error(errorMsg);
                });
        }

        function areDisclosuresSignedByAnyBorrower() {
            var signed = false;
            lib.forEach(vm.wrappedLoan.ref.getLoanApplications(), function (la) {
                var borrower = la.getBorrower();
                if (borrower.eApprovalConfirmation && borrower.eApprovalConfirmation.confirmationCodeConfirmed) {
                    signed = true;
                    return;
                }

                var coBorrower = la.getCoBorrower();
                if (coBorrower.eApprovalConfirmation && coBorrower.eApprovalConfirmation.confirmationCodeConfirmed) {
                    signed = true;
                    return;
                }
            })
            return signed;
        }

        function checkExportToEncompassActions(triggeredAsCallback) {
            lib.forEach(vm.exportToEncompassActions, function (action) {
                action.disabled = false;
            })
            vm.exportToEncompassAction = lib.findFirst(vm.exportToEncompassActions, function (x) { return x.value == enums.requestExportToEncompassAction.ExportToEncompass; })

            if (vm.wrappedLoan.ref.loanNumber && vm.wrappedLoan.ref.loanNumber != 'Pending') {
                toggleAction(vm.exportToEncompassActions, enums.requestExportToEncompassAction.ExportToEncompass, true);
                vm.exportToEncompassAction = lib.findFirst(vm.exportToEncompassActions, function (x) { return x.value == enums.requestExportToEncompassAction.UpdateEncompass; })

                if (areDisclosuresSignedByAnyBorrower() || moment(new Date()).diff(vm.complianceDate) > 0) {
                    toggleAction(vm.exportToEncompassActions, enums.requestExportToEncompassAction.UpdateEncompass, true);
                    vm.exportToEncompassAction = lib.findFirst(vm.exportToEncompassActions, function (x) { return x.value == enums.requestExportToEncompassAction.UpdateiMP; })
                        
                }

                if (triggeredAsCallback)
                    loanDetailsSvc.exportAdditionalFieldsToEncompassCb(wrappedLoan);
            }
            else {
                toggleAction(vm.exportToEncompassActions, enums.requestExportToEncompassAction.UpdateEncompass, true);
                toggleAction(vm.exportToEncompassActions, enums.requestExportToEncompassAction.UpdateiMP, true);
            }
        }

        function toggleAction(actions, actionName, value) {
            lib.forEach(actions, function (action) {
                if (action.value == actionName)
                    action.disabled = value;
            })
        }

        function getDefaultSaveDiscloseAction() {
            return vm.saveDiscloseActions[0];
        };

        function showSaveDiscloseAction(item, $event) {

            if (item.value == 2 && vm.disableDisclosuresCall) {
                $event.stopPropagation();
            }
            else {
                vm.saveDiscloseAction = item;
            }

        };

        function callSaveDiscloseAction(selectedItem) {

            var canCallDisclosures = checkPricingTimespan();
            var isTestMode = vm.applicationData.integrationSettings.testModeProductPopup;
            var isLock = selectedItem.value == enums.requestDisclosureAction.CreateGFELock || selectedItem.value == enums.requestDisclosureAction.CreateTRIDLock;
            var isComplianceCheck = enums.requestDisclosureAction.ComplianceCheck == selectedItem.value;

            if (selectedItem.value == enums.requestDisclosureAction.SaveLoanAplication) {
                saveAll();
            }
            else {
                if (vm.wrappedLoan.ref.vaInformation && vm.wrappedLoan.ref.vaInformation.isvaLoan) {
                    vaCenterService.isVAFeeLimitExceeded(vm.wrappedLoan.ref.closingCost, vm.wrappedLoan.ref.detailsOfTransaction.totalLoanAmount).$promise.then(function (data) {
                        callActionOnDisclose(data.vaFeeLimitExceededResults, canCallDisclosures, isTestMode, isLock, isComplianceCheck);
                        vm.wrappedLoan.ref.updateGovermentEligibility(srv.MortgageTypeEnum.VA, !data.vaFeeLimitExceededResults.length);
                    }, function (error) {
                        console.log(error);
                    });
                }
                else {
                    callActionOnDisclose(false, canCallDisclosures, isTestMode, isLock, isComplianceCheck);
                }
            }
        };

        function callActionOnDisclose(vaFeeLimitExceededResults, canDisclose, isTestMode, isLock, isComplianceCheck) {
            if (vaFeeLimitExceededResults.length) {
                return vaCenterService.openVaFeeExceededAlertModal(vaFeeLimitExceededResults);
            }
            if (!canDisclose) {
                return showDisclosuresTimespanAlertModal(isLock);
            }
            if (isComplianceCheck) {
                return callComplianceCheckAction();
            }
            if (isTestMode) {
                return showTestModePopupProduct(isLock);
            }

            var discloseAction = isLock ? showDisclosureLockModal : saveAndRequestDisclosure;
            return discloseAction();
        }

        function callComplianceCheckAction() {
            var cashFromToBorrower = wrappedLoan.ref.detailsOfTransaction.cashFromToBorrower;
            NavigationSvc.SaveAndUpdateWrappedLoan(applicationData.currentUserId, wrappedLoan, function () {
                requestComplianceCheck(cashFromToBorrower); BroadcastSvc.broadcastUpdateSectionSeven();
            });
        }


        function saveAndRequestDisclosure(lockLoan, lockDate, lockExpDate, loanProductId) {
            if (lockLoan) {
                wrappedLoan.ref.lockingInformation.isLocked = true;
                wrappedLoan.ref.lockingInformation.lockExpirationDate = lockExpDate.toDate();
                wrappedLoan.ref.lockingInformation.lockFullfilled = lockDate.toDate();
                wrappedLoan.ref.lockingInformation.lockStatus = 4;
            }
            closeAllModals();
            var cashFromToBorrower = wrappedLoan.ref.detailsOfTransaction.cashFromToBorrower;
            wrappedLoan.ref.createDocumentsBorrowerNeeds = !wrappedLoan.ref.getLoanApplications().some(function (loanApplication) { return DocumentsService.isThereActiveDocuments(loanApplication.documents, applicationData); });

            NavigationSvc.SaveAndUpdateWrappedLoan(applicationData.currentUserId, wrappedLoan, function () {
                requestDisclosures(loanProductId, cashFromToBorrower); BroadcastSvc.broadcastUpdateSectionSeven();
        });
        }

        function saveAndRequestComplianceCheck() {
            closeAllModals();
            NavigationSvc.SaveAndUpdateWrappedLoan(applicationData.currentUserId, wrappedLoan, function () {
                requestComplianceCheck(); BroadcastSvc.broadcastUpdateSectionSeven();
            });
        }

        function requestComplianceCheck(cashFromToBorrower) {
            digitaldocSvc.requestComplianceCheck(true, "", wrappedLoan, saveAndRequestDisclosure, applicationData.lookup.complianceCheckErrors, checkSaveDiscloseActions);
            checkExportToEncompassProgress();
        }

        function checkExportToEncompassProgress() {
            if (!wrappedLoan.ref.loanNumber || wrappedLoan.ref.loanNumber == 'Pending') {
                vm.wrappedLoan.ref.isImportToFNMInProgress = true;
                NavigationSvc.exportToEncompassInProgress = true;
                encompassSvc.requestDisclosurePackageLoanList.push(wrappedLoan.ref.loanId);
                encompassSvc.checkExportToEncompassProgress(wrappedLoan, vm.checkExportToEncompassActions, null, true, saveAndRequestDisclosure, applicationData.lookup.complianceCheckErrors, checkSaveDiscloseActions);
            }
            vm.saveDiscloseAction = getDefaultSaveDiscloseAction();
        }
        
        function showTestModePopupProduct(isLock) {
            var modalInstance = $modal.open({
                templateUrl: 'angular/loandetails/testmodeproductpopup/testmodeproductpopup.html',
                backdrop: 'static',
                windowClass: 'imp-center-modal imp-test-mode-product-popup-modal',
                controller: 'testModeProductPopupController',
                controllerAs: 'testModeProductPopupCtrl',
                resolve: {
                    model: function () {
                        return {
                            productId: vm.wrappedLoan.ref.product.ruCode,
                            isLock: isLock
                        };
                    },
                    callBackSaveAndRequestDisclosure: function () {
                        return saveAndRequestDisclosure;
                    },
                    callBackShowDisclosureLockModal: function () {
                        return showDisclosureLockModal;
                    }
                }
            });
        }

        function showDisclosureLockModal(productId) {
            if (wrappedLoan.ref.lockingInformation.lockExpirationDate && Date.parse(wrappedLoan.ref.closingDate.dateValue) >= Date.parse(wrappedLoan.ref.lockingInformation.lockExpirationDate)) {
                commonModalWindowFactory.open({
                        type: modalWindowType.success,
                        message: 'Please check your Closing Date to insure that it is prior to the Lock Expiration Date and try again.',
                        messageClass: 'imp-success-message'
        });
        }
        else {
            var modalInstance = $modal.open({
                    templateUrl: 'angular/loandetails/lockdiclosuresmodals/lockconfirmation.html',
                backdrop: 'static',
                    backdropClass: 'custom-modal-backdrop',
                dialogFade: false,
                keyboard: false,
                    windowClass: 'imp-center-modal confirmation-modal',
                    controller: 'lockConfirmationController',
                    controllerAs: 'lockConfirmationCtrl',
                        resolve: {
                            model: function () {
                            return {
                                    programName: wrappedLoan.ref.product.programName,
                                    noteRate: wrappedLoan.ref.financialInfo.noteRate,
                                    pricingEngine: vm.pricingInfo().pricingEngine,
                                    pricingAmount: vm.pricingInfo().amount,
                                    lockPeriod: wrappedLoan.ref.lockingInformation.lockPeriod,
                                    productId: productId
                        };
                    },
                            callbackYes: function () {
                            return saveAndRequestDisclosure;
                    }
            }
        });
        }
        }

        function saveAll() {
            NavigationSvc.SaveAndUpdateWrappedLoan(applicationData.currentUserId, wrappedLoan, function () {
                BroadcastSvc.broadcastUpdateSectionSeven();
        });
        }

        function mapImpoundFees() {

            var impounds = vm.wrappedLoan.ref.closingCost.costs.filter(function (c) {
                if (c.hudLineNumber == 1002 || c.hudLineNumber == 1003 || c.hudLineNumber == 1004 || c.hudLineNumber == 1006)
                    return c;
            });
            var taxesImpounded = false;
            var taxes = impounds.filter(function (t) {
                if (t.hudLineNumber == 1004)
                    return t;
            });
            if (taxes[0] && taxes[0].impounded == true)
                taxesImpounded = true;
            
            var insurances = impounds.filter(function (i) {
                if (i.hudLineNumber == 1002) {
                    return i;
                }
            });
            var insurancesImpounded = false;
         
            if (insurances[0] && insurances[0].impounded == true)
                insurancesImpounded = true;

            if (taxesImpounded && insurancesImpounded) {
                wrappedLoan.ref.otherInterviewData.selectedImpoundsOption = "0";
            }
            else if (taxesImpounded) {
                wrappedLoan.ref.otherInterviewData.selectedImpoundsOption = "1";
            }

            else if (insurancesImpounded) {
                wrappedLoan.ref.otherInterviewData.selectedImpoundsOption = "2";
            }

            else if (!taxesImpounded && !insurancesImpounded)
                wrappedLoan.ref.otherInterviewData.selectedImpoundsOption = "3";

        }
        function callPricingAction() {
            mapImpoundFees();
            if (vm.pricingAction.value == 2) {
                $state.go("loanCenter.loan.loanScenario.sections", {
                    'repricing': true, 'contextualBarTitle': true
        })
        }
        else {
                repriceLoan();
        }

        };

        function getDefaultPricingAction() {
            //if (vm.wrappedLoan.ref.product.ruCode != null)
            //    return vm.pricingActions[0];

            return vm.pricingActions[1];
        };

        function showPricingAction(item) {
            vm.pricingAction = item;
        };


        function disablePricingButton() {

            //var validLtv = vm.wrappedLoan.ref.loanPurposeType == 2 ? vm.wrappedLoan.ref.loanAmount > 0 && vm.wrappedLoan.ref.getSubjectProperty().currentEstimatedValue > 0 : vm.wrappedLoan.ref.getSubjectProperty().purchasePrice > 0;

            //if (vm.wrappedLoan.ref.primary.credit.creditDataAvailable && vm.wrappedLoan.ref.financialInfo.dtiDu != 0
            //        &&  validLtv && vm.wrappedLoan.ref.getSubjectProperty().address.zipCode.length == 5  &&  vm.wrappedLoan.ref.getSubjectProperty().occupancyType
            //            && vm.wrappedLoan.ref.getSubjectProperty().propertyType  &&  vm.wrappedLoan.ref.financialInfo.liquidAssetReserves != null)
            return false;

            //return true;
        }

        function bottomButtonPricingAction() {
            $state.go("loanCenter.loan.loanScenario.sections", {
                                'repricing': true
        })
        }

        function flipPurpose() {
            wrappedLoan.ref.loanPurposeType = wrappedLoan.ref.loanPurposeType == 2 ? 1 : 2;
            saveAll();
            //$state.go('loanCenter.loan.loanDetails.sections', { 'loanId': wrappedLoan.ref.loanId, 'loanPurposeType': wrappedLoan.ref.loanPurposeType==2?1:2 }, { reload: true });
        }


        function showClosingDate(event, model) {
            var closingDatePopup = modalPopoverFactory.openModalPopover('angular/common/loandatehistorypopup.html', this, wrappedLoan.ref.closingDate, event);

            closingDatePopup.result.then(function (data) {
                if ((new Date(data.dateValue) >= new Date(data.currentDate))) {

                    wrappedLoan.ref.closingDate.dateValue = data.dateValue.toISOString();
                    wrappedLoan.ref.updateLoanDateHistory(new Date(data.dateValue), vm.applicationData.currentUser.fullName, new Date().toISOString(), vm.applicationData.impoundSchedules, data.title);
                    costDetailsHelpers.calculateCostsOnCloseDateChanged(wrappedLoan.ref.closingCost.costs, wrappedLoan.ref.closingDate.dateValue, vm.applicationData.impoundSchedules, wrappedLoan.ref.getSubjectProperty().stateName);
                    loanEvent.broadcastPropertyChangedEvent(events.LoanFieldIdentifier.LoanAmount, wrappedLoan.ref.loanAmount);
                    vm.wrappedLoan = wrappedLoan;
        }
        });
        }

            function getDownPaymentSourceText() {
                return wrappedLoan.ref.getSubjectProperty().getDownPaymentSourceText(wrappedLoan.ref.getSubjectProperty().downPaymentSource, applicationData.lookup.downPaymentSourcesTypes);
        }

        function getFinancialInfo() {
            loanDetailsSvc.getFinancialInfo.getFinancialInfo({ loanId: $scope.selectedLoanId }).$promise.then(
            function (data) {
                //init();
                var dtiData = data;

                wrappedLoan.ref.financialInfo.dtiDu = dtiData.debtToIncomeRatioDU;
                wrappedLoan.ref.financialInfo.dtiLp = dtiData.debtToIncomeRatioLP;
                wrappedLoan.ref.financialInfo.qualifyingDtiDu = dtiData.qualifyingDebtToIncomeRatioDU;
                wrappedLoan.ref.financialInfo.qualifyingDtiLp = dtiData.qualifyingDebtToIncomeRatioLP;
                wrappedLoan.ref.financialInfo.housingRatioDu = dtiData.housingRatioDU;
                wrappedLoan.ref.financialInfo.housingRatioLp = dtiData.housingRatioLP;
            },
            function (error) {
                $log.error('Failure getting financial info data', error);
        });
        }

        function onPurchasePriceChange(model) {
            console.log("Purchase Price");

            loanEvent.broadcastPropertyChangedEvent(events.LoanFieldIdentifier.PurchasePrice, wrappedLoan.ref.loanAmount);

            // parse
            var purchasePrice = Number.isNaN(parseFloat(model.PurchasePrice)) ? 0 : parseFloat(model.PurchasePrice);
            var loanAmount = Number.isNaN(parseFloat(model.LoanAmount)) ? 0 : parseFloat(model.LoanAmount);
            var downPayment = Number.isNaN(parseFloat(model.DownPayment)) ? 0 : parseFloat(model.DownPayment);
            var downPaymentPercent = Number.isNaN(parseFloat(model.downPaymentPercent)) ? 0 : parseFloat(model.downPaymentPercent);

            // calculate
            var result = commonCalculatorSvc.recalculateDownPayment(purchasePrice, loanAmount, downPayment, downPaymentPercent, 0, 'PurchasePrice');

            // assign
            model.PurchasePrice = result.purchasePrice;
            model.LoanAmount = result.loanAmount;
            model.DownPayment = result.downPayment;
            model.downPaymentPercent = result.downPaymentPercentage;
        };

        function onLoanAmountChange(model) {
            console.log("LoanAmount");

            loanEvent.broadcastPropertyChangedEvent(events.LoanFieldIdentifier.LoanAmount, wrappedLoan.ref.loanAmount);

            // parse
            var purchasePrice = Number.isNaN(parseFloat(model.PurchasePrice)) ? 0 : parseFloat(model.PurchasePrice);
            var loanAmount = Number.isNaN(parseFloat(model.LoanAmount)) ? 0 : parseFloat(model.LoanAmount);
            var downPayment = Number.isNaN(parseFloat(model.DownPayment)) ? 0 : parseFloat(model.DownPayment);
            var downPaymentPercent = Number.isNaN(parseFloat(model.downPaymentPercent)) ? 0 : parseFloat(model.downPaymentPercent);

            // calculate
            var result = commonCalculatorSvc.recalculateDownPayment(purchasePrice, loanAmount, downPayment, downPaymentPercent, 0, 'LoanAmount');

            // assign
            model.PurchasePrice = result.purchasePrice;
            model.LoanAmount = result.loanAmount;
            model.DownPayment = result.downPayment;
            model.downPaymentPercent = result.downPaymentPercentage;

        };

        function onDownPaymentChange(model) {

            //parse
            var purchasePrice = Number.isNaN(parseFloat(model.PurchasePrice)) ? 0 : parseFloat(model.PurchasePrice);
            var loanAmount = Number.isNaN(parseFloat(model.LoanAmount)) ? 0 : parseFloat(model.LoanAmount);
            var downPayment = Number.isNaN(parseFloat(model.DownPayment)) ? 0 : parseFloat(model.DownPayment);
            var downPaymentPercent = Number.isNaN(parseFloat(model.downPaymentPercent)) ? 0 : parseFloat(model.downPaymentPercent);

            // calculate
            var result = commonCalculatorSvc.recalculateDownPayment(purchasePrice, loanAmount, downPayment, downPaymentPercent, 0, 'DownPayment');

            // assign
            model.PurchasePrice = result.purchasePrice;
            model.LoanAmount = result.loanAmount;
            model.DownPayment = result.downPayment;
            model.downPaymentPercent = result.downPaymentPercentage;
        };

        function onDownPaymentPercentChange(model) {

            // parse
            var purchasePrice = Number.isNaN(parseFloat(model.PurchasePrice)) ? 0 : parseFloat(model.PurchasePrice);
            var loanAmount = Number.isNaN(parseFloat(model.LoanAmount)) ? 0 : parseFloat(model.LoanAmount);
            var downPayment = Number.isNaN(parseFloat(model.DownPayment)) ? 0 : parseFloat(model.DownPayment);
            var downPaymentPercent = Number.isNaN(parseFloat(model.downPaymentPercent)) ? 0 : parseFloat(model.downPaymentPercent);

            // calculate
            var result = commonCalculatorSvc.recalculateDownPayment(purchasePrice, loanAmount, downPayment, downPaymentPercent, 0, 'DownPaymentPercentage');

            // assign
            model.PurchasePrice = result.purchasePrice;
            model.LoanAmount = result.loanAmount;
            model.DownPayment = result.downPayment;
            model.downPaymentPercent = result.downPaymentPercentage;
        };        

        function triggerEncompassExport(action) {
            NavigationSvc.exportToEncompassInProgress = true;
            vm.saveDiscloseAction = getDefaultSaveDiscloseAction();

            var message;
            var messageDetails;
            if (action.value == enums.requestExportToEncompassAction.ExportToEncompass) {
                message = 'Export to Encompass In Progress';
                messageDetails = 'You will be notified when the export to Encompass is complete.';
            }
            else if (action.value == enums.requestExportToEncompassAction.UpdateEncompass) {
                message = 'Update Encompass In Progress';
                messageDetails = 'You will be notified when the update Encompass is complete.';
            }
            commonModalWindowFactory.open({
                type: modalWindowType.success, message: message, messageDetails: messageDetails
            });

            encompassSvc.exportToEncompass(wrappedLoan, vm.checkExportToEncompassActions, action);
        }

        function disableExportToEncompass() {
            return !((vm.wrappedLoan.ref.active.getBorrower().firstName != null && vm.wrappedLoan.ref.active.getBorrower().firstName != '')
                && (vm.wrappedLoan.ref.active.getBorrower().lastName != null && vm.wrappedLoan.ref.active.getBorrower().lastName != '')
                && !NavigationSvc.exportToEncompassInProgress && !vm.wrappedLoan.ref.isImportToFNMInProgress);
        }

        function exportToEncompass(action) {
            commonModalWindowFactory.close('close');
            NavigationSvc.SaveAndUpdateWrappedLoan(applicationData.currentUserId, wrappedLoan, function () {
                triggerEncompassExport(action);
            });
        }

        function callExportToEncompassAction(action) {
            if (!disableExportToEncompass())
                exportToEncompass(action);
            //handle Update iMP

        }

        function requestDisclosures(loanProductId, cashFromToBorrower) {
        digitaldocSvc.requestDisclosurePackages(true, loanProductId, wrappedLoan);
            checkExportToEncompassProgress();
            }

        function submitForApproval() {
            wrappedLoan.ref.areLoanAntiSteeringOptionsCompleted(wrappedLoan.ref.antiSteeringOptions) ? vm.submitForApprovalAction():
            NavigationSvc.openAntiSteeringModal(vm.wrappedLoan.ref.financialInfo.amortizationType, vm.wrappedLoan.ref.antiSteeringOptions, vm.wrappedLoan.ref.areLoanAntiSteeringOptionsCompleted, vm.submitForApprovalAction);
        }

        function submitForApprovalAction() {
            commonModalWindowFactory.open({ type: modalWindowType.loader, message: 'Submitting for Approval'
        });

        wrappedLoan.ref.currentMilestone = srv.milestoneStatus.submitted;

        NavigationSvc.SaveAndUpdateWrappedLoan(applicationData.currentUserId, wrappedLoan,
            function () {
                commonModalWindowFactory.close('close');
                    commonModalWindowFactory.open({ type: modalWindowType.success, message: 'Loan Submission Complete'
            });
        },
            function () {
                commonModalWindowFactory.close('close');
        },

                null, false);

        }

        function isApprovalDisabled() {
            return wrappedLoan.ref.currentMilestone && wrappedLoan.ref.currentMilestone != srv.milestoneStatus.unsubmitted
                && wrappedLoan.ref.currentMilestone != srv.milestoneStatus.registered && wrappedLoan.ref.currentMilestone != srv.milestoneStatus.rejected

        }

        function cancel() {
            $state.reload();
        };

        function updatePricingInfo(newPrice) {
            vm.pricingInfo = newPrice;
        }

        //pricing expiration on calling disclosures 
            function checkPricingTimespan() {
                
            if (!NavigationSvc.lastRepricing.timestamp)//in case of the loan just loaded - repricing mandatory  !vm.wrappedLoan.ref.lastRepriced && 
                return false;
            else {

                var lastPricing = new Date(NavigationSvc.lastRepricing.timestamp);
                var timeNow = new Date().getTime();
                var time = new Date(timeNow);
                var timeDifference = Math.abs(time.getTime() - lastPricing.getTime());
                var minutes = Math.floor(timeDifference / 60000);

                return (minutes > 5) ? false : true;//hardcoded value in minutes(5), for now
                }
            }

            function showDisclosuresTimespanAlertModal(isLock) {
                var message = isLock ? 'To create Initial Lock Disclosures, Price & Fees \nmust be updated. Click Shop For Rates to update.' 
                                     : 'To create Initial Disclosures, Price & Fees must be \nupdated. Click Shop For Rates to update.';
                showDisclosuresTimeSpanAlert(message);
        }

            /// <summary>
            /// Create ModalWindow for showInitialDisclousres and showInitialLockDisclosures
            /// </summary>
            function showDisclosuresTimeSpanAlert(inputMessage) {
                
                //If no value provided set default
                if (typeof inputMessage === 'undefined') { inputMessage = ''; }

                commonModalWindowFactory.open(
                {
                    type: modalWindowType.confirmation,
                    ctrl: vm,
                    header: 'Update Price & Fees',
                    headerClass: 'confirmation-modal-header',
                    message: inputMessage,
                    messageClass: 'confirmation-modal-message',
                    btnCloseText: 'Cancel',
                    ctrlButtons: [{
                        title: 'Shop for Rates', styleClass: 'imp-button-div-hs-ws-prim',
                        width: '140px', height: '30px', callback: 'bottomButtonPricingAction'
                    }]
                });
            }

            function showAppraisalContingencyDatePopup(event) {
                var appraisalContingencyDatePopup = modalPopoverFactory.openModalPopover('angular/common/loandatehistorypopup.html', this, wrappedLoan.ref.appraisalContingencyDate, event);

                appraisalContingencyDatePopup.result.then(function (data) {
                    if ((new Date(data.dateValue) >= new Date(data.currentDate)) || data.dateValue == null) {

                        wrappedLoan.ref.appraisalContingencyDate.dateValue = data.dateValue == null ? data.dateValue : data.dateValue.toISOString();
                        var date = data.dateValue == null ? data.dateValue : new Date(data.dateValue);
                        wrappedLoan.ref.updateLoanDateHistory(date, vm.applicationData.currentUser.fullName, new Date().toISOString(), vm.applicationData.impoundSchedules, data.title);

                        // Rebind references.
                        vm.wrappedLoan = wrappedLoan;
        }
                });
        }

            function showApprovalContingencyDatePopup(event) {
                var approvalContingencyDatePopup = modalPopoverFactory.openModalPopover('angular/common/loandatehistorypopup.html', this, wrappedLoan.ref.approvalContingencyDate, event);

                approvalContingencyDatePopup.result.then(function (data) {
                    if ((new Date(data.dateValue) >= new Date(data.currentDate)) || data.dateValue == null) {

                        wrappedLoan.ref.approvalContingencyDate.dateValue = data.dateValue == null ? data.dateValue : data.dateValue.toISOString();
                        var date = data.dateValue == null ? data.dateValue : new Date(data.dateValue);
                        wrappedLoan.ref.updateLoanDateHistory(date, vm.applicationData.currentUser.fullName, new Date().toISOString(), vm.applicationData.impoundSchedules, data.title);

                        // Rebind references.
                        vm.wrappedLoan = wrappedLoan;
                    }
                });
            }

            function isDisclosuresButtonDisabled() {
                var complianceCheckRequired = _.find(applicationData.generalSettings, function (obj) { return obj.settingName == "Compliance Check Required to Create Initial Disclosures?" });
                var loanApplications = vm.wrappedLoan.ref.getLoanApplications();
                for (var i = 0; i < loanApplications.length; i++) {
                    if (loanApplications[i].complianceCheckStatus == null
                        || (loanApplications[i].complianceCheckStatus == srv.ComplianceCheckStatusEnum.Failed && complianceCheckRequired) 
                        || loanApplications[i].complianceCheckStatus == srv.ComplianceCheckStatusEnum.InProgress 
                        || loanApplications[i].complianceCheckStatus == srv.ComplianceCheckStatusEnum.NotRun) {
                        return true;
                    }                      
                }
                return !vm.wrappedLoan.ref.sixPiecesAcquiredForAllLoanApplications || disableExportToEncompass();
            }

    };

})();