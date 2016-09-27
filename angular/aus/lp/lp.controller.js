(function () {
    'use strict';
    angular.module('aus')
        .controller('lpController', lpController);

    lpController.$inject = ['$log', '$scope', '$state', '$controller', 'ausSvc', 'wrappedLoan', 'lp', 'enums', 'applicationData', 'NavigationSvc', '$filter', 'simpleModalWindowFactory', 'blockUI', 'commonintegrationsSvc', '$interval', 'commonModalWindowFactory', 'modalWindowType'];

    function lpController($log, $scope, $state, $controller, ausSvc, wrappedLoan, lp, enums, applicationData, NavigationSvc, $filter, simpleModalWindowFactory, blockUI, commonintegrationsSvc, $interval, commonModalWindowFactory, modalWindowType) {
        var vm = this;
        vm.wrappedLoan = wrappedLoan;
        vm.lp = lp;
        vm.applicationData = applicationData;

        //extend controller
        angular.extend(this, $controller('DocumentCtrl', { $scope: vm }));

        vm.validate = validate;
        vm.submit = submit;
        vm.cancel = cancel;
        vm.caseIdChange = caseIdChange;
        vm.getVendorLoanId = getVendorLoanId;
        vm.isProcessing = isProcessing;
        vm.statusColor = statusColor;
        vm.refresh = refresh;
        vm.offeringIdentifier = -1;

        vm.guidEmpty = '00000000-0000-0000-0000-000000000000';
        vm.vendorLoanId = "";
        vm.processing = false;
        getVendorLoanId();

        function caseIdChange() {
            vm.vendorLoanId = "";
            vm.caseIdManualEntry = false;

            if (vm.lp.selectedCaseId == null) {
                vm.caseIdManualEntry = true;
            }
            else {
                getVendorLoanId();
            }
        }

        function getImageClass(cse) {

            if (cse.CaseResults.length == 0)
                return '';
            else if (cse.IsExpanded)
                return 'imp-collapsed down';
            else
                return 'imp-collapsed right';
        }

        function caseClicked(cse) {

            cse.IsExpanded = !cse.IsExpanded;
            // Perform other logic if needed
        }


        function validate() {

        }

        function showErrorMessage(message) {
            commonModalWindowFactory.open({ type: modalWindowType.error, message: message });
        }

        function submit() {
            vm.showErrorContainer = false;
            vm.processing = true;

            var selectedCaseId = "";
            if (vm.lp.selectedCaseId != null)
                selectedCaseId = vm.lp.selectedCaseId;

            var selectedOfferingIdentifier = "";
            if (vm.lp.offeringIdentifier)
                selectedOfferingIdentifier = vm.lp.offeringIdentifier

            commonModalWindowFactory.open({ type: modalWindowType.loader, message: 'Submitting to LP' });

            NavigationSvc.SaveAndUpdateWrappedLoan(applicationData.currentUserId, wrappedLoan, function (wrappedLoan) {

                // blockUI.start('Submitting to LP..');

                ausSvc.services.post({ caseId: selectedCaseId, identifier: selectedOfferingIdentifier, ausType: enums.AusType.LP, userAccountId: $scope.userAccountId }, wrappedLoan.ref).$promise.then(
                      function (result) {
                          if (result.loanServiceId) {
                              var timer = $interval(function () {
                                  commonintegrationsSvc.services.getLoanServiceStatus({ loanServiceId: result.loanServiceId }).$promise.then(
                                    function (result) {
                                        refresh();
                                        commonModalWindowFactory.close('close');
                                        var status = result.status;
                                       
                                        //vm.lp.results[selectedCaseId][0].status = status.replace(/^\s+|\s+$/g, "").split(/\s*-\s*/)[1];
                                        if (status == '400 - Error' || status == '140 - Order Not Accepted By Provider' || status == '270 - Service Completed') {
                                            $interval.cancel(timer);
                                        }
                                    },
                                    function (error) {
                                        commonModalWindowFactory.close('close');
                                        showErrorMessage('Error while submitting to LP!');
                                        $interval.cancel(timer);
                                        $log.error('Failure while getting loan service status', error);
                                    });
                              }, 10000);
                          }
                      },
                      function (error) {
                          commonModalWindowFactory.close('close');
                          showErrorMessage('Error while submitting to LP!');
                          $log.error('Failure submitting Freddie Mac Lp data', error);
                          // blockUI.stop();
                          // simpleModalWindowFactory.trigger('ERROR_INTEGRATION_MODAL');
                          vm.processing = false;
                      });
            },
            function (error) {
                commonModalWindowFactory.close('close');
                showErrorMessage('Error while submitting to DU!');
                $log.error(error);
                // simpleModalWindowFactory.trigger('ERROR_SAVE_MODAL');
                vm.processing = false;
            }, null, false);

            //NavigationSvc.SaveLoanData.save(wrappedLoan.ref).$promise.then(
            //    function (savedLoan) {
            //        // update the wrappedLoan.ref reference so that all other screens 
            //        wrappedLoan.ref = new cls.LoanViewModel(savedLoan, $filter);

            //        ausSvc.aus.post({ caseId: selectedCaseId, identifier: selectedOfferingIdentifier, ausType: enums.AusType.LP, userAccountId: $scope.userAccountId }, wrappedLoan.ref).$promise.then(
            //            function (success) {
            //                setTimeout(refresh(), 4000);
            //                vm.showLoader = false;
            //            },
            //            function (error) {
            //                $log.error('Failure submitting Freddie Mac Lp data', error);
            //                simpleModalWindowFactory.trigger('ERROR_INTEGRATION_MODAL');
            //                vm.showLoader = false;
            //            });
            //    },
            //    function (error) {
            //        $log.error(error);
            //        simpleModalWindowFactory.trigger('ERROR_SAVE_MODAL');
            //        vm.showLoader = false;
            //    }
            //);

        }

        function cancel() {
            vm.caseIdManualEntry = false;
            vm.lp.selectedCaseId = vm.caseIds[0];
            getVendorLoanId();
        }

        function getVendorLoanId() {
            vm.vendorLoanId = "";

            if (vm.lp.selectedCaseId)
                vm.vendorLoanId = _.find(vm.lp.results[vm.lp.selectedCaseId], function (e) { return e.vendorLoanId != ""; }).vendorLoanId;
        }

        function isProcessing() {
            vm.processing = false;

            vm.processing = _.some(vm.lp.results, function (tracking) {
                return tracking.status == "Pending";
            });
        }

        function refresh() {
            if ($state.current.name == 'loanCenter.loan.aus.lp' && !NavigationSvc.stateChangeStarted.value) {
                blockUI.stop();
                $state.go('loanCenter.loan.refresh', { page: 'loanCenter.loan.aus', tab: 'lp' });
                //$state.reload('loanCenter.aus');
            }
        }

        function statusColor(status) {
            switch (status) {
                case 'Pending':
                    return '';
                case 'Approve/Eligible':
                case 'Accept/Eligible':
                case 'Accept/A-Offering':
                    return '#1FB25A';
                default:
                    return '#FD3701';
            }
        }

    };
})();