/// <reference path="../../../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path='../../../../../Scripts/typings/ui-router/angular-ui-router.d.ts'/>
/// <reference path="../../../consumer.service.ts" />
var docusign;
(function (docusign) {
    var EInstructionController = (function () {
        function EInstructionController($state, $timeout, docusignSVC, $controller, $modal, blockUI, authenticationContext, loanViewModel) {
            //console.log('here');
            //console.log(authenticationContext);
            //console.log(loanViewModel);
            //var authentication = docusignSVC.authenticationContext;
            var _this = this;
            this.$state = $state;
            this.$timeout = $timeout;
            this.docusignSVC = docusignSVC;
            this.$controller = $controller;
            this.$modal = $modal;
            this.blockUI = blockUI;
            this.authenticationContext = authenticationContext;
            this.loanViewModel = loanViewModel;
            this.continueButtonText = 'Preparing...';
            this.isSigningRoomReady = false;
            this.signingRoomErrorMessage = null;
            this.openEConsentPopUp = function () {
                _this.eConsentModal = _this.$modal.open({
                    templateUrl: '/angular/consumer/docusign/econsent/econsent.html',
                    backdrop: 'static',
                    controller: function () {
                        return new ModalEConsentController2(_this.eConsentModal, _this.$state, _this.docusignSVC, _this.authenticationContext, _this.loanViewModel);
                    },
                    controllerAs: 'ModalEConsentCtrl'
                });
                _this.eConsentModal.result.then(
                //success
                function () {
                    if (!_this.docusignSVC.haveAllAuthenticatedBorrowersEConsented(_this.authenticationContext, _this.loanViewModel)) {
                        _this.openEConsentPopUp();
                    }
                    else {
                        _this.getDocusignUrl();
                    }
                }, 
                //cancel
                function () {
                    _this.docusignSVC.log("User cancelled out of eConsent.");
                });
            };
            this.getDocusignUrl = function () {
                _this.docusignSVC.log('getDocusignUrl() called');
                //this.$state.go('docusign.esign.signing');
                var authenticationViewModel = _this.authenticationContext;
                var isContinueWithoutLogin = authenticationViewModel.isContinueWithoutLogin;
                var isBorrowerContinueWithout = authenticationViewModel.isBorrowerContinueWithout;
                //this.docusignSVC.post('securelink/GetSigningRoom?isContinueWithoutLogin=' + isContinueWithoutLogin + '&isBorrowerContinueWithout=' + isBorrowerContinueWithout, authenticationViewModel).then((response: any) => {
                _this.docusignSVC.post('securelink/GetSigningRoom', authenticationViewModel).then(function (response) {
                    var newData = response.Response;
                    if (newData != null) {
                        if (newData.ErrorCode > 0) {
                            switch (newData.ErrorCode) {
                                case 1:
                                    _this.continueButtonText = 'Error';
                                    _this.isSigningRoomReady = false;
                                    _this.docusignSVC.docusignSigningRoom = null;
                                    _this.signingRoomErrorMessage = 'The document has been declined by one of the signers.  Please contact your loan officer to continue.';
                                    alert(_this.signingRoomErrorMessage);
                            }
                        }
                        else {
                            _this.continueButtonText = 'Continue';
                            _this.isSigningRoomReady = true;
                            _this.docusignSVC.docusignSigningRoom = newData;
                        }
                    }
                    else {
                        _this.continueButtonText = 'Error';
                        _this.isSigningRoomReady = false;
                        _this.docusignSVC.docusignSigningRoom = null;
                    }
                });
                _this.unblockUI();
            };
            this.unblockUI = function () {
                _this.$timeout(function () {
                    // Stop the block after some async operation.
                    this.blockUI.reset();
                }.bind(_this), 0);
            };
            this.continueButtonClick = function () {
                if (_this.isSigningRoomReady) {
                    var data = _this.docusignSVC.authenticationContext;
                    var envelopeId = _this.docusignSVC.docusignSigningRoom.EnvelopeId;
                    _this.docusignSVC.post('securelink/HandleSigningRoomSent?EnvelopeId=' + envelopeId, data).then(function (response) {
                        var newData = response.Response;
                        if (newData != null) {
                            _this.$state.go('docusign.esign.signing');
                        }
                        else {
                            alert('Problem initiating signing room.');
                        }
                    });
                }
                else {
                    if (_this.signingRoomErrorMessage != null) {
                        alert(_this.signingRoomErrorMessage);
                    }
                    else {
                        alert('Please wait until the signing room is ready');
                    }
                }
            };
            this.continue = function () {
                _this.getDocusignUrl();
                //this.$state.go('docusign.esign.signing');
            };
            if (!docusignSVC.haveAllAuthenticatedBorrowersEConsented(this.authenticationContext, this.loanViewModel)) {
                this.openEConsentPopUp();
            }
            else {
                var isESigningComplete = docusignSVC.isESigningComplete(this.authenticationContext, this.loanViewModel);
                if (isESigningComplete) {
                    docusignSVC.log('Already signed, going to appraisal screen.');
                    //Go to the appraisal screen if the eSigning is complete
                    this.$state.go('docusign.appraisal');
                }
                else {
                    docusignSVC.log('NOT already signed, getting docusign envelope.');
                    this.getDocusignUrl();
                }
            }
        }
        //eConsentController;
        EInstructionController.className = 'EInstructionController';
        EInstructionController.$inject = [
            '$state',
            '$timeout',
            'docusignSVC',
            '$controller',
            '$modal',
            'blockUI',
            'authenticationContext',
            'loanViewModel'
        ];
        return EInstructionController;
    })();
    docusign.EInstructionController = EInstructionController;
    ///////////////////////////////////////////////
    //
    //  EConsent - ModalEConsentController2
    //
    ///////////////////////////////////////////////
    var ModalEConsentController2 = (function () {
        function ModalEConsentController2(eConsent, $state, docusignSVC, authenticationContext, loanViewModel) {
            var _this = this;
            this.eConsent = eConsent;
            this.$state = $state;
            this.docusignSVC = docusignSVC;
            this.authenticationContext = authenticationContext;
            this.loanViewModel = loanViewModel;
            //Fields for UI control
            this.isMultiBorrower = false;
            this.selectedBorrower = null;
            this.enableCheckboxes = false;
            this.agreeChecked = false;
            this.disagreeChecked = false;
            this.borrowers = [];
            //Code for maintainting state of controls
            this.configureControls = function () {
                _this.borrowers = _this.docusignSVC.getAuthenticatedButUnconsentedBorrowers(_this.authenticationContext, _this.loanViewModel);
                //if it has a coBorrower and both the borrower and coborrower have not eConsented
                if (_this.borrowers.length > 1) {
                    _this.docusignSVC.log("Multi-Borrower");
                    _this.isMultiBorrower = true;
                    _this.enableCheckboxes = false;
                }
                else {
                    _this.docusignSVC.log("Single Borrower");
                    _this.selectedBorrower = _this.borrowers[0];
                    _this.isMultiBorrower = false;
                    _this.enableCheckboxes = true;
                }
            };
            this.selectedBorrowerChanged = function () {
                //Make the new user recheck the appropriate option
                _this.agreeChecked = false;
                _this.disagreeChecked = false;
                //enable the checkboxes if a valid borrower is selected
                if (_this.selectedBorrower != null) {
                    _this.enableCheckboxes = true;
                }
                else {
                    _this.enableCheckboxes = false;
                }
            };
            this.agreeChanged = function () {
                if (_this.agreeChecked) {
                    _this.disagreeChecked = false;
                }
            };
            this.disagreeChanged = function () {
                if (_this.disagreeChecked) {
                    _this.agreeChecked = false;
                }
            };
            //Buttons
            this.continue = function () {
                var borrowerId = _this.selectedBorrower.borrowerId;
                var authContext = _this.docusignSVC.authenticationContext;
                if (_this.agreeChecked === true) {
                    var consentStatus = 1 /* Accept */;
                    var url = 'SecureLink/SaveEConsentStatus?borrowerId=' + borrowerId + '&consentStatus=' + consentStatus;
                    _this.docusignSVC.post(url, authContext).then(function () {
                        //Update the model
                        _this.selectedBorrower.eConsent.consentStatus = 1 /* Accept */;
                        _this.selectedBorrower.eConsent.statusAt = new Date();
                        _this.eConsent.close();
                    });
                }
                else {
                    if (confirm('Are you sure you want to decline eConsent?')) {
                        var consentStatus = 2 /* Decline */;
                        var url = 'SecureLink/SaveEConsentStatus?borrowerId=' + borrowerId + '&consentStatus=' + consentStatus;
                        _this.docusignSVC.post(url, authContext).then(function () {
                            //Update the model
                            var borrowers = _this.docusignSVC.getBorrowers(_this.authenticationContext, _this.loanViewModel);
                            for (var i = 0; i < borrowers.length; i++) {
                                borrowers[i].eConsent.consentStatus = 2 /* Decline */;
                                borrowers[i].eConsent.statusAt = new Date();
                            }
                            _this.signOut();
                        });
                    }
                }
            };
            //private saveEConsent = () => {
            //};
            this.cancel = function () {
                if (confirm('Are you sure you want to cancel?  Cancelling will sign you out of the system.')) {
                    _this.signOut();
                }
            };
            this.signOut = function () {
                if (_this.docusignSVC.removeAuthenticationContext()) {
                    _this.eConsent.dismiss('cancel');
                    _this.$state.go("authenticate");
                }
                else {
                    _this.docusignSVC.log("ERROR REMOVING AUTHENTICATION");
                }
            };
            this.configureControls();
        }
        return ModalEConsentController2;
    })();
    docusign.ModalEConsentController2 = ModalEConsentController2;
    angular.module('docusign').controller('EInstructionController', EInstructionController);
})(docusign || (docusign = {}));
//# sourceMappingURL=esigningInstructions.controller.js.map