(function () {
    'use strict';

    angular.module('contextualBar').controller('ShareComparisonCtrl', ShareComparisonCtrl);

    ShareComparisonCtrl.$inject = ['$scope', '$state', '$controller', '$modal', '$modalStack', 'pricingResultsSvc', 'NavigationSvc', 'BroadcastSvc', 'commonModalWindowFactory', 'modalWindowType', 'wrappedLoan', 'applicationData', 'userSelectedProductCategoriesVM'];

    function ShareComparisonCtrl($scope, $state, $controller, $modal, $modalStack, pricingResultsSvc, NavigationSvc, BroadcastSvc, commonModalWindowFactory, modalWindowType, wrappedLoan, applicationData, userSelectedProductCategoriesVM) {

        var vm = this;

        vm.closeModal = closeModal;
        
        vm.shareComparisonModalHeight = shareComparisonModalHeight;
        vm.saveLoanAndSendUserSelectedProductCategories = saveLoanAndSendUserSelectedProductCategories;
        vm.addRecipient = addRecipient;
        vm.comparisonNumberOfAdditionalRecipients = 0;
        vm.additionalRecipients = [];
        //vm.additionalRecipients.push({ email: "", isEmailValid: false });
        vm.wrappedLoan = wrappedLoan;
        vm.userSelectedProductCategoriesVM = userSelectedProductCategoriesVM;

        vm.isEmailValid = wrappedLoan.ref.active.validateEmail(vm.userSelectedProductCategoriesVM.email);


        function closeModal() {
            $modalStack.dismissAll('close');
        }

        function shareComparisonModalHeight(numberOfAdditionalRecipients) {
            if (numberOfAdditionalRecipients >= 5) {
                return '405px';
            }
            else {
                return (285 + 30 * numberOfAdditionalRecipients) + 'px';
            }
        };


        function saveLoanAndSendUserSelectedProductCategories(sendEmail) {
            //if (!vm.isEmailValid)
            //    return;

            //if (sendEmail)
            //    vm.userSelectedProductCategoriesVM.sendEmail = sendEmail;

            wrappedLoan.ref.active.getBorrower().firstName = vm.userSelectedProductCategoriesVM.firstName;
            wrappedLoan.ref.active.getBorrower().lastName = vm.userSelectedProductCategoriesVM.lastName;
            if (vm.userSelectedProductCategoriesVM.email)
                wrappedLoan.ref.active.getBorrower().userAccount.username = vm.userSelectedProductCategoriesVM.email;

            vm.userSelectedProductCategoriesVM.additionalRecipients = vm.additionalRecipients.map(function (item) {
                return item['email'];
            })

            NavigationSvc.SaveAndUpdateWrappedLoan(applicationData.currentUserId, wrappedLoan, function () { saveAndSendUserSelectedProductCategories(vm.userSelectedProductCategoriesVM) });
        }

        function saveAndSendUserSelectedProductCategories(viewModel) {
            viewModel.loanId = vm.wrappedLoan.ref.loanId;
            commonModalWindowFactory.open({ type: modalWindowType.loader, message: 'Saving Comparison PDF ...' });
            pricingResultsSvc.SaveAndSendUserSelectedProductCategories(viewModel).then(
                function (result) {
                    if (result.data)
                        commonModalWindowFactory.close('close');
                    closeModal();
                },
                function (error) {
                    commonModalWindowFactory.open({ type: modalWindowType.error, message: 'An error occured during saving and sending Comparison PDF.' });
                    console.log("Error:" + JSON.stringify(error));
                });

            BroadcastSvc.broadcastRepopulatePricingResults();
        }


        function isValid() {
            if (!vm.isEmailValid || _.some(vm.additionalRecipients, function (recipient) {
                    return !recipient.isEmailValid;
            }))
                return false;
            else
                return true;
        }

        function addRecipient() {
            vm.comparisonNumberOfAdditionalRecipients += 1;
            vm.additionalRecipients.push({ email: "", isEmailValid: false });
        }

    }
})();