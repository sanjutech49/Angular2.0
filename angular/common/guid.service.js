var common;
(function (common) {
    'use strict';
    var Guid = (function () {
        function Guid() {
            this.isResolved = false;
        }
        return Guid;
    })();
    common.Guid = Guid;
    var GuidService = (function () {
        function GuidService($http, apiRoot) {
            var _this = this;
            this.$http = $http;
            this.apiRoot = apiRoot;
            /**
            * @desc Retrieves Guid.NewGuid
            * Usage: vm.guid = guidService.newGuid();
            */
            this.newGuid = function () {
                var guid = new Guid();
                var newGuidUrl = _this.url + '/NewGuid';
                var promise = _this.$http.get(newGuidUrl).then(function (response) {
                    if (response && response.status == 200 && response.data != null) {
                        guid.value = String(response.data);
                        guid.isResolved = true;
                    }
                });
                return guid;
            };
            this.url = apiRoot + 'Common';
        }
        GuidService.prototype.getNewGuid = function () {
            var newGuidUrl = this.url + '/NewGuid';
            return this.$http.get(newGuidUrl, { cache: false });
        };
        return GuidService;
    })();
    guidService.$inject = [
        '$http',
        'apiRoot'
    ];
    /**
    * Service used to interact with REST services for Guid manipulation.
    */
    function guidService($http, apiRoot) {
        return new GuidService($http, apiRoot);
    }
    angular.module('common').service('guidService', guidService);
})(common || (common = {}));
//# sourceMappingURL=guid.service.js.map