var mailroom;
(function (mailroom) {
    'use strict';
    var mailroomService = (function () {
        function mailroomService(apiRoot, $resource, $q, $http, $window, $timeout, $sce, $filter, docVaultSvc) {
            var _this = this;
            this.apiRoot = apiRoot;
            this.$resource = $resource;
            this.$q = $q;
            this.$http = $http;
            this.$window = $window;
            this.$timeout = $timeout;
            this.$sce = $sce;
            this.$filter = $filter;
            this.docVaultSvc = docVaultSvc;
            this.getPDFFile = function (fileItemId, userAccountId) {
                var request = _this.$http({
                    method: "get",
                    headers: {
                        'Content-type': 'application/pdf'
                    },
                    url: _this.postApiPath,
                    params: { fileStoreItemId: fileItemId, userAccountId: userAccountId },
                    responseType: 'arraybuffer',
                });
                return request;
            };
            this.postApiPath = this.apiRoot + 'MailRoom/GetPDFFileInfo';
        }
        mailroomService.$inject = ['apiRoot', '$resource', '$q', '$http', '$window', '$timeout', '$sce', '$filter', 'docVaultSvc'];
        return mailroomService;
    })();
    mailroom.mailroomService = mailroomService;
    angular.module('mailroom').service('mailroomService', mailroomService);
})(mailroom || (mailroom = {}));
//# sourceMappingURL=mailroom.service.js.map