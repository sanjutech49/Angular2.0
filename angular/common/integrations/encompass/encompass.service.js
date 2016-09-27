(function () {
    'use strict';

    angular.module('encompassModule')

    .factory('encompassSvc', encompassSvc);

    encompassSvc.$inject = ['$http', 'apiRoot', '$resource', '$state', 'NavigationSvc', 'digitaldocSvc', 'commonModalWindowFactory', 'modalWindowType', '$modalStack', 'enums'];

    function encompassSvc($http, ApiRoot, $resource, $state, NavigationSvc, digitaldocSvc, commonModalWindowFactory, modalWindowType, $modalStack, enums) {
        var encompassApiPath = ApiRoot + 'Encompass/';

        function encompassExportDocument(loanId, userAccountId, fileStoreItemId, uploadedFileId, docCategory, documentClass, documentName) {
           
            return $http.get(encompassApiPath + 'ExportDocumentToEncompass', {
                params: {
                    loanId: loanId, userAccountId: userAccountId, fileStoreItemId: fileStoreItemId,
                    uploadedFileId: uploadedFileId, docCategory: docCategory, documentClass: documentClass, documentName: documentName
                }
            })
            .success(function (data) {
            })
            .error(function () {

            });
        }

        function GetExportDocumentToEncompassRequestCompleted(restRequestId) {
            return $http.get(encompassApiPath + 'GetExportDocumentToEncompassRequestCompleted', { params: { restRequestId: restRequestId } })
            .success(function (data) {
            })
            .error(function () {

            });
        }
        
        var EncompassService = $resource(encompassApiPath + ':path', { path: '@path' }, {
            ExportToEncompass: {
                method: 'GET',
                params: { loanId: 'loanId', userAccountId: 'userAccountId', homeBuyingType: 'homeBuyingType' }
            },
            GetLoanNumberExportToEncompassRequestCompleted: {
                method: 'GET', params: { loanId: 'loanId' }
            }
        });
        
        var requestDisclosurePackageLoanList = [];

        var encompassService = {
            encompassExportDocument: encompassExportDocument,
            GetExportDocumentToEncompassRequestCompleted: GetExportDocumentToEncompassRequestCompleted,
            EncompassService: EncompassService,
            exportToEncompass: exportToEncompass,
            checkExportToEncompassProgress: checkExportToEncompassProgress,
            requestDisclosurePackageLoanList: requestDisclosurePackageLoanList,
            openExportUnsuccessful: openExportUnsuccessful,
            cancelTimer: cancelTimer
        };


        return encompassService;

        function exportToEncompass(wrappedLoan, callBack, action) {
            EncompassService.ExportToEncompass({ loanId: wrappedLoan.ref.loanId, userAccountId: wrappedLoan.ref.active.getBorrower().userAccount.userAccountId, homeBuyingType: wrappedLoan.ref.homeBuyingType }).$promise.then(
            function (result) {
                checkExportToEncompassProgress(wrappedLoan, callBack, action);
            },
            function (error) {
                openExportUnsuccessful(false);
            });
        }

        function checkExportToEncompassProgress(wrappedLoan, callBack, action, requestComplianceCheck, requestDisclosuresCallback, complianceCheckErrors, checkSaveDiscloseActionsCallback) {
            var requestDisclosurePackage = _.contains(requestDisclosurePackageLoanList, wrappedLoan.ref.loanId);
            var intervalTime = requestDisclosurePackage ? 20000 : 5000; // check in intervals of 20 or 5 seconds
            var numberOfAttempts = requestDisclosurePackage ? 240 : 60; // try for 5 minutes

            cancelTimer();  // Cancel any previously started timers
            NavigationSvc.exportToEncompassInProgress = true;

            NavigationSvc.checkExportToEncompassProgressTimer = impInterval(function (result) {
                if ($state.current.name == "loanCenter.queue") {
                    cancelTimer();
                    return;
                }

                EncompassService.GetLoanNumberExportToEncompassRequestCompleted({ loanId: wrappedLoan.ref.loanId }).$promise.then(
                function (data) {
                    if ($state.current.name == "loanCenter.queue") {
                        cancelTimer();
                        return;
                    }

                    if (data.exportCallCompleted) {
                        if (data.loanNumberStatus) {
                            cancelTimer();                            
                            $modalStack.dismissAll('close');
                            wrappedLoan.ref.loanNumber = data.loanNumber;
                            wrappedLoan.ref.isImportToFNMInProgress = false;
                            if (!requestDisclosurePackage) {
                                if (action) {
                                    if (action.value == enums.requestExportToEncompassAction.ExportToEncompass)
                                        commonModalWindowFactory.open({
                                            type: modalWindowType.success, message: 'Export to Encompass Successful!'
                                        });
                                    else if (action.value == enums.requestExportToEncompassAction.UpdateEncompass)
                                        commonModalWindowFactory.open({
                                            type: modalWindowType.success, message: 'Update Encompass Successful!'
                                        });
                                }                               
                            }
                            else {
                                if (requestComplianceCheck) {
                                    digitaldocSvc.checkComplianceCheckStatus(wrappedLoan, wrappedLoan.ref.loanId, requestDisclosuresCallback, complianceCheckErrors, checkSaveDiscloseActionsCallback);
                                }
                                else {
                                    digitaldocSvc.checkLoanDisclosureStatus(wrappedLoan, wrappedLoan.ref.loanId);
                                    requestDisclosurePackageLoanList.pop(wrappedLoan.ref.loanId);
                                }
                            }
                            if (callBack)
                                callBack(wrappedLoan);
                        }
                        else {
                            onExportError(wrappedLoan);
                        }
                    }
                },
                function (error) {
                    return onExportError(wrappedLoan);
                });
            }, intervalTime, numberOfAttempts);

            // Schedule automatic stop of timer after 11 minutes
            NavigationSvc.checkExportToEncompassProgressTimeoutTimer = impInterval(function () {
                onExportError(wrappedLoan);
            }, 660000, 1);
        }

        function cancelTimer() {
            if (typeof (NavigationSvc.checkExportToEncompassProgressTimer.cancel) == "function")
                NavigationSvc.checkExportToEncompassProgressTimer.cancel();

            if (typeof (NavigationSvc.checkExportToEncompassProgressTimeoutTimer.cancel) == "function")
                NavigationSvc.checkExportToEncompassProgressTimeoutTimer.cancel();

            NavigationSvc.exportToEncompassInProgress = false;
        }

        function onExportError(wrappedLoan) {
            wrappedLoan.ref.isImportToFNMInProgress = false;
            var requestDisclosurePackage = _.contains(requestDisclosurePackageLoanList, wrappedLoan.ref.loanId);
            requestDisclosurePackageLoanList.pop(wrappedLoan.ref.loanId);

            return openExportUnsuccessful(requestDisclosurePackage);
        }

        function openExportUnsuccessful(requestDisclosurePackage) {
            if (NavigationSvc.exportToEncompassInProgress && $state.current.name != "loanCenter.queue") {
                var errorMessage = requestDisclosurePackage ? 'An error occured while requesting Disclosures during the export to Encompass. Please try again or call support.' : 'An error occured while exporting this loan to Encompass. Please try again.';
                commonModalWindowFactory.open({ type: modalWindowType.unsuccess, message: errorMessage });
            }

            cancelTimer();
        }
    };
})();


