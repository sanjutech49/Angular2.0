/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
var security;
(function (security) {
    var AuthenticationService = (function () {
        function AuthenticationService(SercurityService) {
            var _this = this;
            this.SercurityService = SercurityService;
            this.isAuthenticated = false;
            this.getLoanContext = function (token) {
                _this.validateAuthentication();
                if (_this.loanContext)
                    return _this.loanContext;
                return _this.SercurityService.GetLoanContext(token).then(function (result) {
                    return _this.loanContext = result;
                });
            };
            this.authenticateUser = function (userName, password) {
                _this.isAuthenticated = true;
                return true;
            };
            this.validateAuthentication = function () {
                if (!_this.isAuthenticated)
                    throw security.authentication_exception;
            };
        }
        AuthenticationService.className = 'authenticationService';
        AuthenticationService.$inject = ['SecurityService'];
        return AuthenticationService;
    })();
    security.AuthenticationService = AuthenticationService;
    moduleRegistration.registerService(security.moduleName, AuthenticationService);
})(security || (security = {}));
//# sourceMappingURL=authentication.service.js.map