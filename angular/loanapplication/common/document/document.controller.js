(function () {
    'use strict';
    angular.module('loanCenter').controller('DocumentCtrl', function ($scope) {
    var vm = $scope;

    vm.DownloadDocument = DownloadDocument;
    vm.OpenDocument = OpenDocument;

    function DownloadDocument(repositoryId) {
        var downloadLink = getDocumentUrl(repositoryId);
        if (downloadLink != '') {
            window.open(downloadLink, '_blank', '');
        }
        
    }

    function OpenDocument(repositoryId, inBrowser, inTab) {
        var downloadLink = getDocumentUrl(repositoryId, inBrowser);
        if (!common.string.isNullOrWhiteSpace(downloadLink) && !common.string.isEmptyGuid(downloadLink)) {
            if (inTab)
                window.open(downloadLink, '_blank', '');
            else
                window.open(downloadLink, '_blank', 'location=0');
        }
    }

    function getDocumentUrl(repositoryId, inBrowser) {
        if (repositoryId == null || repositoryId == '') {
            return '';
        }

        var encodedRepositoryId = encodeURIComponent(repositoryId);
        var url = '/Downloader.axd?documentType=repositoryItem&repositoryItemId=' + encodedRepositoryId;

        if (inBrowser != 'undefined' && inBrowser)
            url = url + '&browser=true';
        return url;
    };
})
})();