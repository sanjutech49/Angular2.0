/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />

module common {

    export class DocumentController {

        static $inject = ['$scope'];

        constructor(protected $scope: ng.IScope) {
        }

        DownloadDocument = (repositoryId: number) => {
            console.log(repositoryId);
            var downloadLink = this.getDocumentUrl(repositoryId);
            if (downloadLink != '') {
                window.open(downloadLink, '_blank', '');
            }
        }

        private getDocumentUrl = (repositoryId) => {
            if (repositoryId == null || repositoryId == '') {
                return '';
            }
            var encodedRepositoryId = encodeURIComponent(repositoryId);
            var url = '/Downloader.axd?documentType=repositoryItem&repositoryItemId=' + encodedRepositoryId;
            return url;
        };
    }
}