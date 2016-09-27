/// <reference path="../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../ts/generated/viewModels.ts" />
var security;
(function (security) {
    var PermissionsServices = (function () {
        function PermissionsServices(apiRoot, $http) {
            this.apiRoot = apiRoot;
            this.$http = $http;
        }
        PermissionsServices.className = 'PermissionsServices';
        PermissionsServices.$inject = ['apiRoot', '$http'];
        return PermissionsServices;
    })();
})(security || (security = {}));
//# sourceMappingURL=PermissionsService.js.map