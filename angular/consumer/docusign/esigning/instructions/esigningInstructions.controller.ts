/// <reference path="../../../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path='../../../../../Scripts/typings/ui-router/angular-ui-router.d.ts'/>
/// <reference path="../../../consumer.service.ts" />

module docusign {

    export class EInstructionController {

        //eConsentController;

        static className = 'EInstructionController';

        public static $inject = [
            '$state',
            '$timeout',
            'docusignSVC',
            '$controller',
            '$modal',
            'blockUI',
            'authenticationContext',
            'loanViewModel'
        ];

        protected eConsentModal: angular.ui.bootstrap.IModalServiceInstance;
        private continueButtonText: string = 'Preparing...';
        private isSigningRoomReady: boolean = false;
        private signingRoomErrorMessage: string = null;

        constructor(
            private $state: ng.ui.IStateService,
            private $timeout: angular.ITimeoutService,
            private docusignSVC: IDocusignService,
            private $controller: any,
            private $modal: angular.ui.bootstrap.IModalService,
            private blockUI: any,
            private authenticationContext: cls.SecureLinkAuthenticationViewModel,
            private loanViewModel: cls.LoanViewModel
            )
        {
            //console.log('here');
            //console.log(authenticationContext);
            //console.log(loanViewModel);
            //var authentication = docusignSVC.authenticationContext;


            if (!docusignSVC.haveAllAuthenticatedBorrowersEConsented(this.authenticationContext, this.loanViewModel)) {
                this.openEConsentPopUp();
            } else {
                var isESigningComplete = docusignSVC.isESigningComplete(this.authenticationContext, this.loanViewModel);
                if (isESigningComplete) {
                    docusignSVC.log('Already signed, going to appraisal screen.');
                    //Go to the appraisal screen if the eSigning is complete
                    this.$state.go('docusign.appraisal');
                } else {
                    docusignSVC.log('NOT already signed, getting docusign envelope.');
                    this.getDocusignUrl();
                }
            }
        }

        openEConsentPopUp = () => {
            this.eConsentModal = this.$modal.open({
                templateUrl: '/angular/consumer/docusign/econsent/econsent.html',
                backdrop: 'static',
                controller: () => {
                    return new ModalEConsentController2(
                        this.eConsentModal,
                        this.$state,
                        this.docusignSVC,
                        this.authenticationContext,
                        this.loanViewModel);
                },
                controllerAs: 'ModalEConsentCtrl'
            });

            this.eConsentModal.result.then(
                //success
                () => {
                    if (!this.docusignSVC.haveAllAuthenticatedBorrowersEConsented(this.authenticationContext, this.loanViewModel)) {
                        this.openEConsentPopUp();
                    }
                    else {
                        this.getDocusignUrl();

                        //old code to save whole viewModel
                        //this.docusignSVC.log("Saving eConsent");
                        //this.docusignSVC.save().then(() => {
                        //    this.docusignSVC.log("eConsent saved!");
                        //    this.getDocusignUrl();
                        //});
                    }
                },
                //cancel
                () => {
                    this.docusignSVC.log("User cancelled out of eConsent.");
                });
        };

        private getDocusignUrl = () => {
            this.docusignSVC.log('getDocusignUrl() called');

            //this.$state.go('docusign.esign.signing');

            var authenticationViewModel = this.authenticationContext;
            var isContinueWithoutLogin = authenticationViewModel.isContinueWithoutLogin;
            var isBorrowerContinueWithout = authenticationViewModel.isBorrowerContinueWithout;
            //this.docusignSVC.post('securelink/GetSigningRoom?isContinueWithoutLogin=' + isContinueWithoutLogin + '&isBorrowerContinueWithout=' + isBorrowerContinueWithout, authenticationViewModel).then((response: any) => {
            this.docusignSVC.post('securelink/GetSigningRoom', authenticationViewModel).then((response: any) => {
                var newData = response.Response;
                if (newData != null) {
                    if (newData.ErrorCode > 0) {
                        switch (newData.ErrorCode) {
                            case 1:
                                this.continueButtonText = 'Error';
                                this.isSigningRoomReady = false;
                                this.docusignSVC.docusignSigningRoom = null;
                                this.signingRoomErrorMessage = 'The document has been declined by one of the signers.  Please contact your loan officer to continue.';
                                alert(this.signingRoomErrorMessage);
                        }
                    } else {
                        this.continueButtonText = 'Continue';
                        this.isSigningRoomReady = true;
                        this.docusignSVC.docusignSigningRoom = newData;
                    }
                } else {
                    this.continueButtonText = 'Error';
                    this.isSigningRoomReady = false;
                    this.docusignSVC.docusignSigningRoom = null;
                }
            });

            this.unblockUI();
        }

        private unblockUI = () => {
            this.$timeout(function () {
                // Stop the block after some async operation.
                this.blockUI.reset();
            }.bind(this), 0);
        }

        public continueButtonClick = () => {
            if (this.isSigningRoomReady) {
                var data = this.docusignSVC.authenticationContext;
                var envelopeId = this.docusignSVC.docusignSigningRoom.EnvelopeId;
                this.docusignSVC.post('securelink/HandleSigningRoomSent?EnvelopeId=' + envelopeId, data).then((response: any) => {
                    var newData = response.Response;
                    if (newData != null) {
                        this.$state.go('docusign.esign.signing');
                    } else {
                        alert('Problem initiating signing room.');
                    }
                });
            } else {
                if (this.signingRoomErrorMessage != null) {
                    alert(this.signingRoomErrorMessage);
                } else {
                    alert('Please wait until the signing room is ready');
                }
            }
        }

        public continue = () => {
            this.getDocusignUrl();
            //this.$state.go('docusign.esign.signing');
        }
    }



    ///////////////////////////////////////////////
    //
    //  EConsent - ModalEConsentController2
    //
    ///////////////////////////////////////////////

    export class ModalEConsentController2 {
        
        //Fields for UI control
        private isMultiBorrower: boolean = false;
        private selectedBorrower: srv.IBorrowerViewModel = null;
        private enableCheckboxes: boolean = false;
        private agreeChecked: boolean = false;
        private disagreeChecked: boolean = false;
        private borrowers: srv.IBorrowerViewModel[] = [];

        constructor(
            public eConsent: angular.ui.bootstrap.IModalServiceInstance,
            private $state: ng.ui.IStateService,
            private docusignSVC: IDocusignService,
            private authenticationContext: cls.SecureLinkAuthenticationViewModel,
            private loanViewModel: cls.LoanViewModel
            ) {
            this.configureControls();
        }

        //Code for maintainting state of controls
        private configureControls = () => {
            this.borrowers = this.docusignSVC.getAuthenticatedButUnconsentedBorrowers(this.authenticationContext, this.loanViewModel);

            //if it has a coBorrower and both the borrower and coborrower have not eConsented
            if (this.borrowers.length > 1) {
                this.docusignSVC.log("Multi-Borrower");

                this.isMultiBorrower = true;
                this.enableCheckboxes = false;
            }
            else {
                this.docusignSVC.log("Single Borrower");

                this.selectedBorrower = this.borrowers[0];
                this.isMultiBorrower = false;
                this.enableCheckboxes = true;
            }
        };

        public selectedBorrowerChanged = () => {
            //Make the new user recheck the appropriate option
            this.agreeChecked = false;
            this.disagreeChecked = false;

            //enable the checkboxes if a valid borrower is selected
            if (this.selectedBorrower != null) {
                this.enableCheckboxes = true;
            }
            else {
                this.enableCheckboxes = false;
            }
        };

        public agreeChanged = () => {
            if (this.agreeChecked) {
                this.disagreeChecked = false;
            }
        }

        public disagreeChanged = () => {
            if (this.disagreeChecked) {
                this.agreeChecked = false;
            }
        }


        //Buttons
        public continue = () => {
            var borrowerId = this.selectedBorrower.borrowerId;
            var authContext = this.docusignSVC.authenticationContext;

            if (this.agreeChecked === true) {
                var consentStatus = srv.ConsentStatusEnum.Accept;
                var url = 'SecureLink/SaveEConsentStatus?borrowerId=' + borrowerId + '&consentStatus=' + consentStatus;
                this.docusignSVC.post(url, authContext).then(() => {
                    //Update the model
                    this.selectedBorrower.eConsent.consentStatus = srv.ConsentStatusEnum.Accept;
                    this.selectedBorrower.eConsent.statusAt = new Date();
                    this.eConsent.close();
                });
            }
            else {
                if (confirm('Are you sure you want to decline eConsent?')) {
                    var consentStatus = srv.ConsentStatusEnum.Decline;
                    var url = 'SecureLink/SaveEConsentStatus?borrowerId=' + borrowerId + '&consentStatus=' + consentStatus;
                    this.docusignSVC.post(url, authContext).then(() => {
                        //Update the model
                        var borrowers = this.docusignSVC.getBorrowers(this.authenticationContext, this.loanViewModel);
                        for (var i = 0; i < borrowers.length; i++) {
                            borrowers[i].eConsent.consentStatus = srv.ConsentStatusEnum.Decline;
                            borrowers[i].eConsent.statusAt = new Date();
                        }
                        this.signOut();
                    });

                    //Old code to save the whole view model
                    //this.docusignSVC.save().then(() => {
                    //    this.signOut();
                    //});
                }
            }

        }

        //private saveEConsent = () => {

        //};

        public cancel = () => {
            if (confirm('Are you sure you want to cancel?  Cancelling will sign you out of the system.')) {
                this.signOut();
            }
        }

        private signOut = () => {
            if (this.docusignSVC.removeAuthenticationContext()) {
                this.eConsent.dismiss('cancel');
                this.$state.go("authenticate");
            }
            else {
                this.docusignSVC.log("ERROR REMOVING AUTHENTICATION");
            }
        }
    }

    angular.module('docusign').controller('EInstructionController', EInstructionController);
}