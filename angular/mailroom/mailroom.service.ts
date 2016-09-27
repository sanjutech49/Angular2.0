module mailroom {
    'use strict';

    export class mailroomService {
        apiPath: string;
        postApiPath: string;


        static $inject = ['apiRoot', '$resource', '$q', '$http', '$window', '$timeout', '$sce', '$filter', 'docVaultSvc'];

        constructor(private apiRoot: string, private $resource: ng.resource.IResourceService, private $q: ng.IQService, private $http, private $window, private $timeout, private $sce,
            private $filter, private docVaultSvc) {
            this.postApiPath = this.apiRoot + 'MailRoom/GetPDFFileInfo';        

        }

        getPDFFile = (fileItemId: string, userAccountId: number): any => {
            var request = this.$http({
                method: "get",
                headers: {
                    'Content-type': 'application/pdf'
                },
                url: this.postApiPath,
                params: { fileStoreItemId: fileItemId, userAccountId: userAccountId },
                responseType: 'arraybuffer',
            });
            
            return request;
        }     
    }
    angular.module('mailroom').service('mailroomService', mailroomService);
}
