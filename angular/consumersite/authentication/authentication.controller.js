/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
var security;
(function (security) {
    var AuthenticateController = (function () {
        function AuthenticateController(authenticationService, $log, $state, loanAppPageContext) {
            var _this = this;
            this.authenticationService = authenticationService;
            this.$log = $log;
            this.$state = $state;
            this.loanAppPageContext = loanAppPageContext;
            this.authenticate = function () {
                if (_this.authenticationService.authenticateUser(_this.userName, _this.password)) {
                    _this.$state.go(_this.$state.params['nextState'], { token: _this.$state.params['token'] });
                }
                //.then(
                //(data) => {
                //    if (data)
                //        this.$state.go("");
                //}).catch(
                //(err) => {
                //    this.$log.error('Error Authenticating User');
                //});
            };
            this.userName = "";
            this.password = "";
            //Scroll so just the loanAppNavbarIsVisible
            loanAppPageContext.scrollToTop();
        }
        AuthenticateController.className = 'authenticateController';
        AuthenticateController.$inject = ['authenticationService', '$log', '$state', 'loanAppPageContext'];
        return AuthenticateController;
    })();
    security.AuthenticateController = AuthenticateController;
    moduleRegistration.registerController(security.moduleName, AuthenticateController);
})(security || (security = {}));
//# sourceMappingURL=authentication.controller.js.map