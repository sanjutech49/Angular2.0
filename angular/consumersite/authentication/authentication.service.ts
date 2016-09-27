/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />

module security {

    export class AuthenticationService {

        static className = 'authenticationService';
        static $inject = ['SecurityService'];

        private loanContext: srv.ISecureLinkAuthenticationViewModel;
        private isAuthenticated = false;

        constructor(private SercurityService: srv.SecurityService) {
        }

        getLoanContext = (token: string): ng.IPromise<srv.ISecureLinkAuthenticationViewModel> | srv.ISecureLinkAuthenticationViewModel => {

            this.validateAuthentication();

            if (this.loanContext)
                return this.loanContext;

            return this.SercurityService.GetLoanContext(token).then < srv.ISecureLinkAuthenticationViewModel>(result => {
                return this.loanContext = result;
            });
        }

        authenticateUser = (userName: string, password: string): ng.IPromise<boolean> | boolean => {
            this.isAuthenticated = true;
            return true;
        }

        private validateAuthentication = () => {
            if (!this.isAuthenticated)
                throw authentication_exception;
        }
    }

    moduleRegistration.registerService(moduleName, AuthenticationService);
}