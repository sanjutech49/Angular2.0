/// <reference path="../consumer.testdata.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path='../../../Scripts/typings/ui-router/angular-ui-router.d.ts'/>
/// <reference path="../consumer.settings.ts" />
/// <reference path="../consumer.service.ts" />


module docusign {

    export class AuthenticationController {

        static className = 'AuthenticationController';

        static $inject = ["$http", "$state", "$stateParams", "docusignSVC", "blockUI"];

        private hasAuthenticationContext: boolean;
        private authenticationViewModel: cls.SecureLinkAuthenticationViewModel;
        private borrower: srv.ISecureLinkBorrowerViewModel;
        private coBorrower: srv.ISecureLinkBorrowerViewModel;
        private hasCoBorrower: boolean = false;
        private isContinueButtonEnabled: boolean = false;

        constructor(private $http: ng.IHttpService, private $state: ng.ui.IStateService, private $stateParams: ng.ui.IStateParamsService, private docusignSVC: IDocusignService, private blockUI) {
            var isTokenValid = docusign.settings.isTokenValid;
            if (isTokenValid === true) {
                this.hasAuthenticationContext = true;
                var authenticationViewModel = JSON.parse(JSON.stringify(docusign.settings.authenticationViewModel)); //always get a fresh copy
                this.authenticationViewModel = authenticationViewModel;
                this.borrower = this.authenticationViewModel.borrower;
                this.coBorrower = this.authenticationViewModel.coBorrower;
                if (this.authenticationViewModel.coBorrower == null || this.authenticationViewModel.coBorrower.borrowerId == docusignSVC.EMPTY_GUID) {
                    this.authenticationViewModel.hasCoBorrower = false;
                    this.hasCoBorrower = false;
                } else {
                    this.authenticationViewModel.hasCoBorrower = true;
                    this.hasCoBorrower = true;
                }
            } else {
                this.hasAuthenticationContext = false;
            }
        }

        public authenticateUser = () => {
            //Don't even make the call unless one of the PINs is a valid length
            if (this.arePINsLongEnough()) {
                //this is still needed until we work out another authentication scheme
                //this.docusignSVC.authenticateUser('Joe', 'Dirt', '1234'); //this is needed to create an authentication token.

                var authenticationViewModel = this.authenticationViewModel;
                var borrower = authenticationViewModel.borrower;
                var coBorrower = authenticationViewModel.coBorrower;

                //this.blockUI.start("Loading...");

                this.docusignSVC.post<cls.SecureLinkAuthenticationViewModel>('securelink/validatepins', authenticationViewModel).then(function (response) {
                    var newData = response.Response;
                    borrower.isAuthenticated = newData.Borrower.IsAuthenticated;
                    coBorrower.isAuthenticated = newData.CoBorrower.IsAuthenticated;
                    authenticationViewModel.token = newData.Token;
                    this.updateAuthenticationViewModel();

                    //Go on to the next screen if both are valid
                    if (borrower.isAuthenticated && (!this.authenticationViewModel.hasCoBorrower || coBorrower.isAuthenticated)) {
                        authenticationViewModel.isContinueWithoutLogin = false;
                        this.authenticationViewModel.isBorrowerContinueWithout = false;
                        //this.authenticationViewModel.isCoBorrowerContinueWithout = false;
                        this.continue();
                    }
                }.bind(this));
                //    .finally(function () {
                //    this.blockUI.stop();
                //}.bind(this));

                //var url = 'http://localhost:1932/PublicServices/api/securelink/validatepins';
                //this.docusignSVC.log(url);
                //var $http = this.$http;
                //$http.post(url, data).success(function (response: any) {
                //    if (response.Response != null) {
                //        var newData = response.Response;
                //        this.docusignSVC.log(newData);
                //        borrower.isAuthenticated = newData.Borrower.IsAuthenticated;
                //        coBorrower.isAuthenticated = newData.CoBorrower.IsAuthenticated;
                //        //Go on to the next screen if both are valid
                //        if (borrower.isAuthenticated && (!this.hasCoBorrower || coBorrower.isAuthenticated)) {
                //            this.continue();
                //        }
                //    } else {
                //        this.docusignSVC.log(response, 'error');
                //    }
                //}.bind(this)).error(function (newData) {
                //    this.docusignSVC.log(newData, 'error');
                //});
            }
        }

        private updateAuthenticationViewModel = () => {
            var authenticationViewModel = this.authenticationViewModel;
            var borrower = authenticationViewModel.borrower;
            var coBorrower = authenticationViewModel.coBorrower;
            var hasCoBorrower = this.hasCoBorrower;

            //continue without links
            if (hasCoBorrower) {
                if (borrower.isAuthenticated === true && coBorrower.isAuthenticated === false) {
                    borrower.continueWithoutText = "Continue without " + coBorrower.fullName;
                    borrower.showContinueWithoutLink = true;
                } else {
                    borrower.showContinueWithoutLink = false;
                }

                if (coBorrower.isAuthenticated === true && borrower.isAuthenticated === false) {
                    coBorrower.continueWithoutText = "Continue without " + borrower.fullName;
                    coBorrower.showContinueWithoutLink = true;
                } else {
                    coBorrower.showContinueWithoutLink = false;
                }
            }
        }

        private continue = () => {
            this.docusignSVC.authenticationContext = this.authenticationViewModel;
            this.$state.go('docusign.esign.instructions');
            /*
            //Previous State Logic, disabled
            if (this.$stateParams['previousState'].url) {
                this.$state.go(this.$stateParams['previousState']);
            }
            else {
                this.$state.go('docusign.esign.instructions');
            }
            */
        }

        private continueWithoutClick = () => {
            this.authenticationViewModel.isContinueWithoutLogin = true;
            if (this.authenticationViewModel.borrower.isAuthenticated === true) {
                this.authenticationViewModel.isBorrowerContinueWithout = true;
                //this.authenticationViewModel.isCoBorrowerContinueWithout = false;
            }
            else {
                this.authenticationViewModel.isBorrowerContinueWithout = false;
                //this.authenticationViewModel.isCoBorrowerContinueWithout = true;
            }
            this.continue();
        }

        //PIN Changed Events

        //inputPINChanged is called whenever the borrower or coBorrower input changes and if either are 4 characters it enables the Continue button.
        public inputPINChanged = () => {
            if (this.arePINsLongEnough()) {
                this.isContinueButtonEnabled = true;
            } else {
                this.isContinueButtonEnabled = false;
            }
        }

        private arePINsLongEnough = () => {
            var borrowerPIN = this.borrower.inputPIN;
            var coBorrowerPIN = this.coBorrower.inputPIN;
            if ((borrowerPIN && borrowerPIN.length >= 4) || (coBorrowerPIN && coBorrowerPIN.length >= 4)) {
                return true;
            } else {
                return false;
            }
        }

    }

    angular.module('docusign').controller('AuthenticationController', AuthenticationController);
}