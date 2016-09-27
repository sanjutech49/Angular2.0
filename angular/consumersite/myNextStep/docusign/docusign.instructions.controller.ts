/// <reference path="../../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../../Scripts/typings/underscore/underscore.d.ts" />

module consumersite {

    export class DocusignInstructionsController {

        private continueButtonText: string = 'Preparing...';
        private isSigningRoomReady: boolean = false;
        private signingRoomErrorMessage: string = null;
        private authViewModel: cls.SecureLinkAuthenticationViewModel;

        static className = "docusignInstructionsController";

        static $inject = ['loan', 'loanAppPageContext', 'applicationData', 'eConsentModalService', '$timeout', '$state', 'eSigningService'];

        constructor(public loan: vm.Loan,
            private loanAppPageContext: LoanAppPageContext,
            private applicationData: any,
            private eConsentModalService: consumersite.EConsentModalService,
            private $timeout: ng.ITimeoutService,
            private $state: ng.ui.IStateService,
            private eSigningService: consumersite.ESigningService) {

            this.openEConsent();

            //Scroll so just the loanAppNavbarIsVisible
            loanAppPageContext.scrollToTop();
        }

        openEConsent = () => {
            console.log(this.loan);
            
            this.eConsentModalService.openEConsentModal(this.loan, () => {
                this.getDocusignUrl(this.loan)
            });
        }

        //called by the return statement from the modal
        public getDocusignUrl = (loan: vm.Loan): void => {
            var returnVal: IESigningPreparation = null;
            this.authViewModel = this.eSigningService.getMockAuthViewModel(loan);
            this.eSigningService.post('securelink/GetSigningRoom', this.authViewModel).then((response: any) => {
                var newData = response.Response;

                if ((newData != null) && (newData.ErrorCode > 0)) {
                    if (newData.ErrorCode == 1) {
                        loan.docusignSigningRoom = null;
                        this.continueButtonText = 'Error';
                        this.isSigningRoomReady = false;
                        this.signingRoomErrorMessage = 'The document has been declined by one of the signers.  Please contact your loan officer to continue.';
                    }
                }
                else {
                    loan.docusignSigningRoom = newData;
                    this.continueButtonText = 'Continue';
                    this.isSigningRoomReady = true;
                    this.signingRoomErrorMessage = 'The document has been declined by one of the signers.  Please contact your loan officer to continue.';
                }
            }, (reason) => {
                loan.docusignSigningRoom = null;
                this.continueButtonText = 'Error';
                this.isSigningRoomReady = false;
                this.signingRoomErrorMessage = reason;
            });

            this.unblockUI;
        }
        

        //called by continue button
        public continue = () => {
            if (this.isSigningRoomReady) {
                this.eSigningService.post('securelink/HandleSigningRoomSent?EnvelopeId=' + this.loan.docusignSigningRoom.EnvelopeId, this.authViewModel).then((response: any) => {
                    var newData = response.Response;
                    if (newData != null) {
                        this.$state.go('consumerSite.myNextStep.docusign.esigning');
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


        private unblockUI = () => {
            this.$timeout(function () {
                // Stop the block after some async operation.
                this.blockUI.reset();
            }.bind(this), 0);
        }




    }
    moduleRegistration.registerController(consumersite.moduleName, DocusignInstructionsController);
} 