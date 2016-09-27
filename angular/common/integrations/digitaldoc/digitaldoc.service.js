(function () {
    'use strict';

    angular.module('digitaldocModule')

    .factory('digitaldocSvc', digitaldocSvc);

    digitaldocSvc.$inject = ['$http', 'apiRoot', '$resource', 'NavigationSvc', 'commonModalWindowFactory', 'modalWindowType', '$state', 'costDetailsSvc', 'BroadcastSvc', '$modal', 'docVaultSvc'];

    function digitaldocSvc($http, ApiRoot, $resource, NavigationSvc, commonModalWindowFactory, modalWindowType, $state, costDetailsSvc, BroadcastSvc, $modal, docVaultSvc) {
        var digitaldocApiPath = ApiRoot + 'DigitalDoc/';

        var DigitalDocService = $resource(digitaldocApiPath + 'RequestDisclosurePackages', {}, {
            RequestDisclosurePackages: {
                method: 'POST',
                params: { loanProductId: 'loanProductId', requestComplianceCheck: 'requestComplianceCheck' }
            }
        });

        var RetrieveActiveDisclosureDetail = $resource(digitaldocApiPath + 'RetrieveActiveDisclosureDetail', { loanId: '@loanId' });

        var RetrieveComplianceCheckStatus = $resource(digitaldocApiPath + 'RetrieveComplianceCheckStatus', { loanId: '@loanId' });

        var digitalDocService = {
            DigitalDocService: DigitalDocService,
            RetrieveActiveDisclosureDetail: RetrieveActiveDisclosureDetail,
            requestDisclosurePackages: requestDisclosurePackages,
            checkLoanDisclosureStatus: checkLoanDisclosureStatus,
            cancelTimer: cancelTimer,
            requestComplianceCheck: requestComplianceCheck,
            RetrieveComplianceCheckStatus: RetrieveComplianceCheckStatus,
            checkComplianceCheckStatus: checkComplianceCheckStatus
        };


        return digitalDocService;

        function requestDisclosurePackages(showConfirmation, loanProductId, wrappedLoan) {
            if (showConfirmation) {
                commonModalWindowFactory.open({
                    type: modalWindowType.success, message: 'Disclosures Requested', messageDetails: 'The disclosures will arrive into the DocVault shortly'
                });
            }

            DigitalDocService.RequestDisclosurePackages({ loanProductId: loanProductId, requestComplianceCheck: false }, wrappedLoan.ref).$promise.then(
            function (data) {
                NavigationSvc.exportToDigitalInProgress = true;
                wrappedLoan.ref.updateDisclosureStatusForAllLoanApplications(srv.DisclosureStatusEnum.RequestInProgress);

                if (!wrappedLoan.ref.loanNumber || wrappedLoan.ref.loanNumber == 'Pending') {
                    return;
                }

                checkLoanDisclosureStatus(wrappedLoan, wrappedLoan.ref.loanId);
            },
            function (error) {
                console.log("Error:" + JSON.stringify(error));
            });
        }


        function requestComplianceCheck(showConfirmation, loanProductId, wrappedLoan, requestDisclosuresCallback, complianceCheckErrors, checkSaveDiscloseActionsCallback) {
            if (showConfirmation) {
                commonModalWindowFactory.open({
                    type: modalWindowType.success, message: 'Compliance Check Requested', messageDetails: 'The report will be available in the DocVault shortly.'
                });
            }

            DigitalDocService.RequestDisclosurePackages({ loanProductId: loanProductId, requestComplianceCheck: true }, wrappedLoan.ref).$promise.then(
            function (data) {
                NavigationSvc.exportToDigitalInProgress = true;
                wrappedLoan.ref.updateComplianceCheckStatusForAllLoanApplications(srv.ComplianceCheckStatusEnum.InProgress);

                checkComplianceCheckStatus(wrappedLoan, wrappedLoan.ref.loanId, requestDisclosuresCallback, complianceCheckErrors, checkSaveDiscloseActionsCallback);
            },
            function (error) {
                console.log("Error:" + JSON.stringify(error));
            });
        }

        function checkLoanDisclosureStatus(wrappedLoan, selectedLoanId) {
            cancelTimer();  // Cancel any previously started timers
            NavigationSvc.exportToDigitalInProgress = true;

            NavigationSvc.checkLoanDisclosureStatusTimer = impInterval(function () {
                if ($state.current.name == "loanCenter.queue") {
                    cancelTimer();
                    return;
                }

                RetrieveActiveDisclosureDetail.get({ loanId: selectedLoanId }).$promise.then(
                    function (data) {
                        if ($state.current.name == "loanCenter.queue") {
                            cancelTimer();
                            return;
                        }

                        var eConsented = wrappedLoan.ref.active.docDelivery == srv.docDeliveryTypeEnum.Electronic && wrappedLoan.ref.active.getBorrower().eConsent.consentStatus != srv.ConsentStatusEnum.None;
                        if (data.disclosureStatus != srv.DisclosureStatusEnum.RequestInProgress && !(data.disclosureStatus == srv.DisclosureStatusEnum.DisclosuresCreated && eConsented)) {
                            cancelTimer();
                            updateDisclosureDetails(wrappedLoan, data.disclosuresDetails, data.disclosureStatus);
                            commonModalWindowFactory.open({
                                type: modalWindowType.success, message: 'Disclosures Received', messageDetails: 'Go to the DocVault to view your Disclosures.'
                            });
                        }
                    },
                    function (error) {
                        disclosuresFailed();
                        console.log("Error:" + JSON.stringify(error));
                    });
            }, 20000, 30);

            // Schedule automatic stop of timer after 11 minutes
            NavigationSvc.checkLoanDisclosureStatusTimeoutTimer = impInterval(function () {
                disclosuresFailed();
            }, 660000, 1);
        }

        function checkComplianceCheckStatus(wrappedLoan, selectedLoanId, requestDisclosuresCallback, complianceCheckErrors, checkSaveDiscloseActionsCallback) {
            cancelTimer();  // Cancel any previously started timers
            NavigationSvc.exportToDigitalInProgress = true;

            NavigationSvc.checkComplianceCheckStatusTimer = impInterval(function () {
                if ($state.current.name == "loanCenter.queue") {
                    cancelTimer();
                    return;
                }

                RetrieveComplianceCheckStatus.get({ loanId: selectedLoanId }).$promise.then(
                    function (data) {
                        if ($state.current.name == "loanCenter.queue") {
                            cancelTimer();
                            return;
                        }

                        if (data.complianceStatus != srv.ComplianceCheckStatusEnum.InProgress) {
                            cancelTimer();
                            wrappedLoan.ref.updateComplianceCheckStatusForLoanApplication(data.complianceStatus, selectedLoanId);
                            if (data.complianceStatus == srv.ComplianceCheckStatusEnum.Passed) {
                                var modalInstance = $modal.open({
                                    templateUrl: 'angular/loandetails/compliancecheckpopup/compliancecheckpassedpopup.html',
                                    backdrop: 'static',
                                    windowClass: 'imp-center-modal compliance-check-modal',
                                    controller: 'complianceCheckPassedPopupController',
                                    controllerAs: 'complianceCheckPassedPopupCtrl',
                                    resolve: {
                                        model: function () {
                                            return {
                                            };
                                        },
                                        callBackSaveAndRequestDisclosure: function () {
                                            return requestDisclosuresCallback;
                                        },
                                        checkSaveDiscloseActionsCallback: function () {
                                            return checkSaveDiscloseActionsCallback;
                                        }
                                    }
                                });                                                           
                            }
                            else if (data.complianceStatus == srv.ComplianceCheckStatusEnum.Failed) {
                                var modalInstance = $modal.open({
                                    templateUrl: 'angular/loandetails/compliancecheckpopup/compliancecheckfailedpopup.html',
                                    backdrop: 'static',
                                    windowClass: 'imp-center-modal compliance-check-modal-failed',
                                    controller: 'complianceCheckFailedPopupController',
                                    controllerAs: 'complianceCheckFailedPopupCtrl',
                                    resolve: {
                                        model: function () {
                                            return {
                                                errorList: data.errorList,
                                                complaianceCheckErrors: complianceCheckErrors,
                                                documentRepositoryId: data.documentRepositoryId
                                            };
                                        },
                                        callbackOpenDocument: function () {
                                            return docVaultSvc.openDocument;
                                        },
                                        checkSaveDiscloseActionsCallback: function () {
                                            return checkSaveDiscloseActionsCallback;
                                        }
                                    }
                                });
                            }
                        }
                    },
                    function (error) {
                        complianceCheckFailed();
                        console.log("Error:" + JSON.stringify(error));
                    });
            }, 20000, 30);
        }

        function disclosuresFailed() {
            if (NavigationSvc.exportToDigitalInProgress && $state.current.name != "loanCenter.queue") {
                commonModalWindowFactory.open({
                    type: modalWindowType.unsuccess, message: 'An error occured while requesting Compliance check report during the export to Digital Docs. Please try again or call support.'
                });
            }

            cancelTimer();
        }

        function complianceCheckFailed() {
            if (NavigationSvc.exportToDigitalInProgress && $state.current.name != "loanCenter.queue") {
                commonModalWindowFactory.open({
                    type: modalWindowType.unsuccess, message: 'An error occured while requesting Disclosures during the export to Digital Docs. Please try again or call support.'
                });
            }

            cancelTimer();
        }

        function cancelTimer() {
            if (typeof (NavigationSvc.checkLoanDisclosureStatusTimer.cancel) == "function") {
                NavigationSvc.checkLoanDisclosureStatusTimer.cancel();
            }
            if (typeof (NavigationSvc.checkLoanDisclosureStatusTimeoutTimer.cancel) == "function") {
                NavigationSvc.checkLoanDisclosureStatusTimeoutTimer.cancel();
            }
            if (typeof (NavigationSvc.checkComplianceCheckStatusTimer.cancel) == "function") {
                NavigationSvc.checkComplianceCheckStatusTimer.cancel();
            }

            NavigationSvc.exportToDigitalInProgress = false;
        }

        function updateDisclosureDetails(wrappedLoan, data, disclosureStatus) {
            angular.forEach(wrappedLoan.ref.closingCost.disclosuresDetailsViewModel, function (group) {
                group.active = false;
            });

            wrappedLoan.ref.closingCost.disclosuresDetailsViewModel.unshift(data);

            if (wrappedLoan.ref.loanPurposeType == srv.LoanPurposeTypeEnum.Refinance) {
                wrappedLoan.ref.closingCost.calculatedCashToClose.loanEstimates.loanAmount = data.loanAmount;
                wrappedLoan.ref.closingCost.calculatedCashToClose.loanEstimates.totalClosingCosts = data.totalClosingCosts;
                wrappedLoan.ref.closingCost.calculatedCashToClose.loanEstimates.closingCostsPaidBeforeClosing = data.closingCostsPaidBeforeClosing;
                wrappedLoan.ref.closingCost.calculatedCashToClose.loanEstimates.totalPayoffsAndPayments = data.totalPayoffs;
            }

            wrappedLoan.ref.updateDisclosureStatusForAllLoanApplications(disclosureStatus);

            costDetailsSvc.getActiveToleranceGroup().then(function (data) {
                BroadcastSvc.broadcastCostDetailsTotals(wrappedLoan.ref.closingCost.totals);
            });

            if ($state.current.name == 'loanCenter.loan.documents.docvault') {
                wrappedLoan.ref.documents.documentsLoaded = false;
                $state.go('loanCenter.loan.refresh', {
                    page: 'loanCenter.loan.documents.docvault'
                });
            }
        }
    };
})();


