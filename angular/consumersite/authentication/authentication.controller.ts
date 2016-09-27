/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />

module security {

    export class AuthenticateController {

        private userName: string;
        private password: string;

        static className = 'authenticateController';

        static $inject = ['authenticationService', '$log', '$state', 'loanAppPageContext'];

        constructor(
            private authenticationService: AuthenticationService,
            private $log: ng.ILogService,
            private $state: ng.ui.IStateService,
            private loanAppPageContext: consumersite.LoanAppPageContext) {

            this.userName = "";
            this.password = "";

            //Scroll so just the loanAppNavbarIsVisible
            loanAppPageContext.scrollToTop();
        }

        authenticate = () => {
            if (this.authenticationService.authenticateUser(this.userName, this.password)) {
                this.$state.go(this.$state.params['nextState'], { token: this.$state.params['token'] });
            }
                //.then(
                //(data) => {
                //    if (data)
                //        this.$state.go("");

                //}).catch(
                //(err) => {
                //    this.$log.error('Error Authenticating User');
                //});






                
        }
    }
    
    moduleRegistration.registerController(moduleName, AuthenticateController);
}