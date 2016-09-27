(function () {
    'use strict';

    angular.module('uploadFiles')

    .factory('importFnmSvc', importFnmSvc);

    importFnmSvc.$inject = ['$http', 'apiRoot', '$state', '$modal'];

    function importFnmSvc($http, ApiRoot, $state, $modal) {
        var importFnmApiPath = ApiRoot + 'FNMImport/';

        function uploadFnm(loanId, companyProfileId, userAccountId, files) {
            var fd = new FormData()

            if (loanId)
                fd.append("loanId", loanId);

            if (companyProfileId)
                fd.append("companyProfileId", companyProfileId);

            if (userAccountId)
                fd.append("userAccountId", userAccountId);

            if (files.length) {
                for (var i in files) {
                    fd.append("file", files[i]);
                }
            }
            else
                fd.append("file", files);
            

            return $http.post(importFnmApiPath, fd, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            })
            .success(function (data) {

            })
            .error(function () {

            });
        }

        function openImportLoanModal(applicationData, loanExists, emptyLoanOnCancel, loanPurposeType) {
            var importFnmParams;

            if (loanExists)
                importFnmParams = { title: "Add FNM 3.2 Files to Loan", preSelectPrimaryFnm: false };
            else
                importFnmParams = { title: "Create New Loan", preSelectPrimaryFnm: true };

            var importLoanModal = $modal.open({
                templateUrl: 'angular/common/uploadfiles/importfnmfiles.html',
                backdrop: 'static',
                windowClass: 'imp-reference-modal upload-files-modal',
                controller: 'importFnmController',
                controllerAs: 'importFnmCtrl',
                resolve: {
                    importFnmParams: function () {
                        return importFnmParams;
                    },
                    applicationData: function () {
                        return applicationData;
                    },
                }
            });

            importLoanModal.result.then(
                function () {
                    
                },
                function () {
                    if (emptyLoanOnCancel)
                        $state.go('loanCenter.loan.loanApplication.personal', { loanId: null, loanPurposeType: loanPurposeType }, { reload: true });
            });
        }

        var importFnmService = {
            uploadFnm: uploadFnm,
            openImportLoanModal: openImportLoanModal
        };


        return importFnmService;
    };
})();


