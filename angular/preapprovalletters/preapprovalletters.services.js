var preapprovalletters;
(function (preapprovalletters) {
    'use strict';
    var preapprovallettersService = (function () {
        function preapprovallettersService(apiRoot, $resource, $q, $http) {
            var _this = this;
            this.apiRoot = apiRoot;
            this.$resource = $resource;
            this.$q = $q;
            this.$http = $http;
            this.send = function (viewModel) {
                var config = {
                    params: {
                        viewModel: viewModel
                    }
                };
                return _this.$http.post(_this.postApiPath, viewModel, { params: {} });
                //return this.preapprovalSend.save(viewModel);
            };
            this.postApiPath = this.apiRoot + 'PreApprovalLetters/Post';
            var postAction = {
                method: 'POST',
                isArray: false
            };
            this.preapprovalSend = this.$resource(this.postApiPath, { viewModel: '@viewModel' }, { create: postAction });
        }
        preapprovallettersService.$inject = ['apiRoot', '$resource', '$q', '$http'];
        return preapprovallettersService;
    })();
    preapprovalletters.preapprovallettersService = preapprovallettersService;
    angular.module('preapprovalletters').service('preapprovallettersService', preapprovallettersService);
})(preapprovalletters || (preapprovalletters = {}));
//moduleRegistration.registerService(moduleNames.loanCenter, loanCenter.manageAccountService); 
//# sourceMappingURL=preapprovalletters.services.js.map