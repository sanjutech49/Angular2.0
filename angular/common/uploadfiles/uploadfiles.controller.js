(function () {
    'use strict';
    angular.module('uploadFiles')
        .controller('uploadFilesController', uploadFilesController);

    uploadFilesController.$inject = ['$log', '$modal', 'enums', 'uploadFilesSvc', 'blockUI'];

    function uploadFilesController($log, $modal, enums, uploadFilesSvc, blockUI) {
        var vm = this;

        vm.files = [];
        vm.deleteFile = deleteFile;
        vm.uploadFiles = uploadFiles;

        function deleteFile(index) {
            vm.files.splice(index, 1);

            if (vm.uploadDocumentsError)
                validateFilesSizeAndExtension();
        };

        function uploadFiles(modalpopoverCtrl) {
            vm.uploadDocumentsError = false;
            validateFilesSizeAndExtension();
            if (!vm.uploadDocumentsError) {
                vm.savingDataInProgress = true;
                blockUI.start('Uploading files..');
                uploadFilesSvc.uploadFiles(modalpopoverCtrl.ctrl.loanId, modalpopoverCtrl.ctrl.userAccountId, modalpopoverCtrl.ctrl.borrowerId, modalpopoverCtrl.ctrl.documentCategoryId, vm.files).then(
                function (data) {
                    vm.savingDataInProgress = false;
                    blockUI.stop();
                    modalpopoverCtrl.done();
                },
                function (error) {
                    $log.error('Failure uploading files', error);
                    vm.savingDataInProgress = false;
                    blockUI.stop();
                });
            }

        };

        function validateFilesSizeAndExtension() {
            var supportedExtensions = _.values(enums.DocumentContentType);
            for (var i = 0; i < vm.files.length; i++) {
                if (vm.files[i].size > 48 * 1024 * 1024 || !_.contains(supportedExtensions, getFileExtension(vm.files[i].name.toLowerCase())))
                    vm.files[i].invalid = true;
            }
            if (_.some(vm.files, function (file) { return file.invalid == true; }))
                vm.uploadDocumentsError = true;
            else 
                vm.uploadDocumentsError = false;
        };

        function getFileExtension(filename) {
            return filename.split('.').pop();
        };
    };
})();