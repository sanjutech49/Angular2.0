var documents;
(function (documents) {
    var NeedsListService = (function () {
        function NeedsListService($http, apiRoot) {
            var _this = this;
            this.$http = $http;
            this.apiRoot = apiRoot;
            this.getCoverLetterId = function (loanId, documentClass, userAccountId) {
                var getDataApiUrl = _this.apiRoot + '/CreateCoverLetterAndGetId';
                var parameters = {
                    loanId: loanId,
                    coverLetter: documentClass,
                    userAccountId: userAccountId
                };
                var config = { params: parameters };
                return _this.triggerRequest(getDataApiUrl, config);
            };
            this.sendCoverLetter = function (loanId, fileStoreItemId, recipients) {
                var getDataApiUrl = _this.apiRoot + '/SendBorrowersNeedsListCoverLetter';
                var parameters = {
                    loanId: loanId,
                    fileStoreItemId: fileStoreItemId,
                    recipients: recipients
                };
                var config = { params: parameters };
                return _this.triggerRequest(getDataApiUrl, config);
            };
            this.triggerRequest = function (url, config) {
                return _this.$http.get(url, config).then(function (response) {
                    return response.data;
                });
            };
            this.apiRoot = apiRoot + 'Document';
        }
        NeedsListService.prototype.isEmailValid = function (email) {
            return email && email.indexOf('newprospect') == -1;
        };
        NeedsListService.$inject = ['$http', 'apiRoot'];
        NeedsListService.className = 'needsListService';
        return NeedsListService;
    })();
    documents.NeedsListService = NeedsListService;
    moduleRegistration.registerService('documents', NeedsListService);
})(documents || (documents = {}));
//# sourceMappingURL=needslist.service.js.map