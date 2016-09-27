(function () {
    'use strict';
    angular.module('aus')
        .controller('duController', duController);

    duController.$inject = ['$log', '$scope', '$state', '$controller', 'ausSvc', 'wrappedLoan', 'du', 'enums', 'applicationData', 'NavigationSvc', '$filter', 'simpleModalWindowFactory', 'blockUI', 'commonintegrationsSvc', '$interval', 'commonModalWindowFactory', 'modalWindowType'];

    function duController($log, $scope, $state, $controller, ausSvc, wrappedLoan, du, enums, applicationData, NavigationSvc, $filter, simpleModalWindowFactory, blockUI, commonintegrationsSvc, $interval, commonModalWindowFactory, modalWindowType) {
        var vm = this;
        vm.wrappedLoan = wrappedLoan;
        vm.du = du;
        vm.applicationData = applicationData;

        //extend controller
        angular.extend(this, $controller('DocumentCtrl', { $scope: vm }));

        vm.validate = validate;
        vm.cancel = cancel;
        vm.caseIdChange = caseIdChange;
        vm.submit = submit;
        vm.refresh = refresh;
        vm.statusColor = statusColor;

        vm.armIdentifier = -1;
        vm.guidEmpty = '00000000-0000-0000-0000-000000000000';

        vm.du.selectedArmIdentifier = wrappedLoan.ref.product.armIdentifier;

        function caseIdChange() {
            if (vm.du.selectedCaseId == null)
                vm.caseIdManualEntry = true;
        }

        function validate() {
            //console.log("Validate");
        }

        function showErrorMessage(message) {
            commonModalWindowFactory.open({ type: modalWindowType.error, message: message });
        }

        function submit() {
            vm.showErrorContainer = false;
            vm.processing = true;

            var selectedCaseId = "";
            if (vm.du.selectedCaseId)
                selectedCaseId = vm.du.selectedCaseId;

            var selectedArmIdentifier = "";
            if (vm.du.selectedArmIdentifier)
                selectedArmIdentifier = vm.du.selectedArmIdentifier;

            commonModalWindowFactory.open({ type: modalWindowType.loader, message: 'Submitting to DU' });

            // SaveAndUpdateWrappedLoan does just this, save then updates the wrapped loan
            NavigationSvc.SaveAndUpdateWrappedLoan(applicationData.currentUserId, wrappedLoan, function (wrappedLoan) {

                // blockUI.start('Submitting to DU..');

                ausSvc.services.post({ caseId: selectedCaseId, identifier: selectedArmIdentifier, ausType: enums.AusType.DU, userAccountId: $scope.userAccountId }, wrappedLoan.ref).$promise.then(
                    function (result) {
                        if (result.loanServiceId) {
                            var timer = $interval(function () {
                                commonintegrationsSvc.services.getLoanServiceStatus({ loanServiceId: result.loanServiceId }).$promise.then(
                                  function (result) {
                                      refresh();
                                      commonModalWindowFactory.close('close');
                                      var status = result.status;

                                      //vm.du.results[selectedCaseId][0].status = status.replace(/^\s+|\s+$/g, "").split(/\s*-\s*/)[1];
                                      if (status == '400 - Error' || status == '140 - Order Not Accepted By Provider' || status == '270 - Service Completed') {
                                          $interval.cancel(timer);
                                      }
                                  },
                                    function (error) {
                                        $interval.cancel(timer);
                                        commonModalWindowFactory.close('close');
                                        showErrorMessage('Error while submitting to DU!');
                                        $log.error('Failure while getting loan service status', error);
                                    });
                            }, 10000);
                        }
                    },
                      function (error) {
                          commonModalWindowFactory.close('close');
                          $log.error('Failure submitting Fannie Mae DU data', error);
                          showErrorMessage('Error while submitting to DU!');
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

            //        ausSvc.aus.post({ caseId: selectedCaseId, identifier: selectedArmIdentifier, ausType: enums.AusType.DU, userAccountId: $scope.userAccountId }, wrappedLoan.ref).$promise.then(
            //            function (success) {
            //                setTimeout(refresh(), 4000);
            //                vm.showLoader = false;
            //            },
            //            function (error) {
            //                $log.error('Failure submitting Fannie Mae Du data', error);
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
            vm.du.selectedCaseId = vm.du.caseIds[0];
        }

        function isProcessing() {
            vm.processing = false;

            vm.processing = _.some(vm.du.results, function (tracking) {
                return tracking.status == "Pending";
            });
        }

        function refresh() {
            if ($state.current.name == 'loanCenter.loan.aus.du' && !NavigationSvc.stateChangeStarted.value) {
                blockUI.stop();
                $state.go('loanCenter.loan.refresh', { page: 'loanCenter.loan.aus', tab: 'du' });
                //$state.reload('loanCenter.aus');
            }
        }

        function statusColor(status) {
            switch (status) {
                case 'Pending':
                    return '';
                case 'Approve/Eligible':
                case 'Accept/Eligible':
                case 'Accept/A-Offering':
                    return '#1FB25A';
                default:
                    return '#FD3701';
            }
        }


    };
})();