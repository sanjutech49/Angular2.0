/// <reference path="../consumer.testdata.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path='../../../Scripts/typings/ui-router/angular-ui-router.d.ts'/>
/// <reference path="../consumer.settings.ts" />
/// <reference path="../consumer.service.ts" />
var docusign;
(function (docusign) {
    var AuthenticationController = (function () {
        function AuthenticationController($http, $state, $stateParams, docusignSVC, blockUI) {
            var _this = this;
            this.$http = $http;
            this.$state = $state;
            this.$stateParams = $stateParams;
            this.docusignSVC = docusignSVC;
            this.blockUI = blockUI;
            this.hasCoBorrower = false;
            this.isContinueButtonEnabled = false;
            this.authenticateUser = function () {
                //Don't even make the call unless one of the PINs is a valid length
                if (_this.arePINsLongEnough()) {
                    //this is still needed until we work out another authentication scheme
                    //this.docusignSVC.authenticateUser('Joe', 'Dirt', '1234'); //this is needed to create an authentication token.
                    var authenticationViewModel = _this.authenticationViewModel;
                    var borrower = authenticationViewModel.borrower;
                    var coBorrower = authenticationViewModel.coBorrower;
                    //this.blockUI.start("Loading...");
                    _this.docusignSVC.post('securelink/validatepins', authenticationViewModel).then(function (response) {
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
                    }.bind(_this));
                }
            };
            this.updateAuthenticationViewModel = function () {
                var authenticationViewModel = _this.authenticationViewModel;
                var borrower = authenticationViewModel.borrower;
                var coBorrower = authenticationViewModel.coBorrower;
                var hasCoBorrower = _this.hasCoBorrower;
                //continue without links
                if (hasCoBorrower) {
                    if (borrower.isAuthenticated === true && coBorrower.isAuthenticated === false) {
                        borrower.continueWithoutText = "Continue without " + coBorrower.fullName;
                        borrower.showContinueWithoutLink = true;
                    }
                    else {
                        borrower.showContinueWithoutLink = false;
                    }
                    if (coBorrower.isAuthenticated === true && borrower.isAuthenticated === false) {
                        coBorrower.continueWithoutText = "Continue without " + borrower.fullName;
                        coBorrower.showContinueWithoutLink = true;
                    }
                    else {
                        coBorrower.showContinueWithoutLink = false;
                    }
                }
            };
            this.continue = function () {
                _this.docusignSVC.authenticationContext = _this.authenticationViewModel;
                _this.$state.go('docusign.esign.instructions');
                /*
                //Previous State Logic, disabled
                if (this.$stateParams['previousState'].url) {
                    this.$state.go(this.$stateParams['previousState']);
                }
                else {
                    this.$state.go('docusign.esign.instructions');
                }
                */
            };
            this.continueWithoutClick = function () {
                _this.authenticationViewModel.isContinueWithoutLogin = true;
                if (_this.authenticationViewModel.borrower.isAuthenticated === true) {
                    _this.authenticationViewModel.isBorrowerContinueWithout = true;
                }
                else {
                    _this.authenticationViewModel.isBorrowerContinueWithout = false;
                }
                _this.continue();
            };
            //PIN Changed Events
            //inputPINChanged is called whenever the borrower or coBorrower input changes and if either are 4 characters it enables the Continue button.
            this.inputPINChanged = function () {
                if (_this.arePINsLongEnough()) {
                    _this.isContinueButtonEnabled = true;
                }
                else {
                    _this.isContinueButtonEnabled = false;
                }
            };
            this.arePINsLongEnough = function () {
                var borrowerPIN = _this.borrower.inputPIN;
                var coBorrowerPIN = _this.coBorrower.inputPIN;
                if ((borrowerPIN && borrowerPIN.length >= 4) || (coBorrowerPIN && coBorrowerPIN.length >= 4)) {
                    return true;
                }
                else {
                    return false;
                }
            };
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
                }
                else {
                    this.authenticationViewModel.hasCoBorrower = true;
                    this.hasCoBorrower = true;
                }
            }
            else {
                this.hasAuthenticationContext = false;
            }
        }
        AuthenticationController.className = 'AuthenticationController';
        AuthenticationController.$inject = ["$http", "$state", "$stateParams", "docusignSVC", "blockUI"];
        return AuthenticationController;
    })();
    docusign.AuthenticationController = AuthenticationController;
    angular.module('docusign').controller('AuthenticationController', AuthenticationController);
})(docusign || (docusign = {}));
//# sourceMappingURL=authentication.controller.js.map