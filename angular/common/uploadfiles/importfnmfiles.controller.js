(function () {
    'use strict';
    angular.module('uploadFiles')
        .controller('importFnmController', importFnmController);

    importFnmController.$inject = ['$log', '$scope', '$modal', '$state', 'applicationData', 'enums', 'importFnmSvc', 'uploadFilesSvc', 'blockUI', 'importFnmParams', '$modalInstance'];

    function importFnmController($log, $scope, $modal, $state, applicationData, enums, importFnmSvc, uploadFilesSvc, blockUI, importFnmParams, $modalInstance) {
        var vm = this;

        vm.files = [];
        vm.deleteFile = deleteFile;

        vm.selectPrimaryFNM = selectPrimaryFNM;
        vm.getFileExtension = getFileExtension;
        vm.markFirstAsPrimaryFNM = markFirstAsPrimaryFNM;
        vm.close = close;
        vm.importFnmParams = importFnmParams;
        vm.fnmUploadAndReview = fnmUploadAndReview;

        function deleteFile(index) {
            vm.files.splice(index, 1);

            markFirstAsPrimaryFNM();

            if (vm.uploadDocumentsError)
                validateFilesSizeAndExtension();
        };

        

        function fnmUploadAndReview() {
            vm.uploadDocumentsError = false;

            vm.fnmPrimary = _.findWhere(vm.files, function (item) { return (getFileExtension(item.name.toLowerCase()) === 'fnm' && item.isPrimary) });

            vm.fnmNonPrimary = _.filter(vm.files, function (item) { return (getFileExtension(item.name.toLowerCase()) === 'fnm' && !item.isPrimary) });

            vm.documents = _.filter(vm.files, function (item) { return getFileExtension(item.name.toLowerCase()) != 'fnm' });

            if (!vm.uploadDocumentsError) {
                $modalInstance.close();
                if (vm.fnmPrimary){
                    vm.importingLoanInProgress = true;
                    blockUI.start('Importing loan...');
                    importFnmSvc.uploadFnm(null, applicationData.companyProfile.companyProfileId, applicationData.currentUser.userAccountId, vm.fnmPrimary).then(
                        function (result) {
                            if (vm.documents.length > 0){
                                vm.savingDataInProgress = true;
                                uploadFilesSvc.uploadFiles(result.data, applicationData.currentUser.userAccountId, vm.documents).then(
                                    function (docResults) {
                                        vm.savingDataInProgress = false;
                                        blockUI.stop();
                                        $state.go('loanCenter.loan.loanApplication.personal', { 'loanId': result.data, 'loanPurposeType': null }, { reload: true });
                                    },
                                    function (error) {
                                        $log.error('Failure Uploading files', error);
                                        vm.savingDataInProgress = false;
                                        blockUI.stop();
                                    });
                                vm.importingLoanInProgress = false;
                            }
                            else {
                                blockUI.stop();
                                $state.go('loanCenter.loan.loanApplication.personal', { 'loanId': result.data, 'loanPurposeType': null }, { reload: true });
                            }
                        },
                        function (error) {
                            $log.error('Failure Importing Primary FNM', error);
                            vm.importingLoanInProgress = false;
                            blockUI.stop();
                        });
                }
                else if (vm.documents.length > 0) {
                    vm.savingDataInProgress = true;
                    blockUI.start('Uploading files...');
                    uploadFilesSvc.uploadFiles($scope.selectedLoanId, $scope.userAccountId, vm.documents).then(
                        function (result) {
                            vm.savingDataInProgress = false;
                            blockUI.stop();
                            $state.go($state.current, { 'loanId': $scope.selectedLoanId, 'loanPurposeType': null }, { reload: true });
                        },
                        function (error) {
                            $log.error('Failure Uploading files', error);
                            vm.savingDataInProgress = false;
                            blockUI.stop();
                        });    
                }
            }

        };

        function uploadDocuments(loanId, userAccountId, files) {
            vm.savingDataInProgress = true;
            blockUI.start('Uploading files...');
            uploadFilesSvc.uploadFiles(loanId, userAccountId, files).then(
                function (result) {
                },
                function (error) {
                    $log.error('Failure Uploading files', error);
                    vm.savingDataInProgress = false;
                    blockUI.stop();
                });
        }


        function getFileExtension(filename) {
            return filename.split('.').pop();
        };


        function selectPrimaryFNM(index) {
            for (var i = 0; i < vm.files.length; i++) {
                if (vm.files[i] != vm.files[index])
                    vm.files[i].isPrimary = false;
            }
            vm.files[index].isPrimary = true;
        };

        function markFirstAsPrimaryFNM() {
            for (var i = 0; i < vm.files.length; i++) {
                if (vm.files[i].isPrimary) {
                    return;
                }

            }
            for (var i = 0; i < vm.files.length; i++) {
                if (getFileExtension(vm.files[i].name.toLowerCase()) == 'fnm'){
                    vm.files[i].isPrimary = true;
                    break;
                }

            }
        };

        function close() {
            $modalInstance.dismiss('cancel');

        };
    };
})();