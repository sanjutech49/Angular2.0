(function () {
    'use strict';

    angular.module('uploadFiles')

    .factory('uploadFilesSvc', uploadFilesSvc);

    uploadFilesSvc.$inject = ['$http', 'apiRoot'];

    function uploadFilesSvc($http, ApiRoot) {
        var uploadFilesApiPath = ApiRoot + 'Document/';

        function uploadFiles(loanId, userAccountId, borrowerId, documentCategoryId, files) {
            var fd = new FormData()

            if (loanId)
                fd.append("loanId", loanId);

            if (userAccountId)
                fd.append("userAccountId", userAccountId);

            if (borrowerId)
                fd.append("borrowerId", borrowerId);

            if (documentCategoryId)
                fd.append("documentCategoryId", documentCategoryId);

            for (var i in files) {
                fd.append("file", files[i]);
            }

            return $http.post(uploadFilesApiPath, fd, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            })
            .success(function (data) {
            })
            .error(function () {
            });
        }

        var uploadFilesService =  {
            uploadFiles: uploadFiles
        };


        return uploadFilesService;
    };
})();


