/// <reference path="../../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../../Scripts/typings/underscore/underscore.d.ts" />
var consumersite;
(function (consumersite) {
    var DocusignInstructionsController = (function () {
        function DocusignInstructionsController(loan, loanAppPageContext, applicationData, eConsentModalService, $timeout, $state, eSigningService) {
            var _this = this;
            this.loan = loan;
            this.loanAppPageContext = loanAppPageContext;
            this.applicationData = applicationData;
            this.eConsentModalService = eConsentModalService;
            this.$timeout = $timeout;
            this.$state = $state;
            this.eSigningService = eSigningService;
            this.continueButtonText = 'Preparing...';
            this.isSigningRoomReady = false;
            this.signingRoomErrorMessage = null;
            this.openEConsent = function () {
                console.log(_this.loan);
                _this.eConsentModalService.openEConsentModal(_this.loan, function () {
                    _this.getDocusignUrl(_this.loan);
                });
            };
            //called by the return statement from the modal
            this.getDocusignUrl = function (loan) {
                var returnVal = null;
                _this.authViewModel = _this.eSigningService.getMockAuthViewModel(loan);
                _this.eSigningService.post('securelink/GetSigningRoom', _this.authViewModel).then(function (response) {
                    var newData = response.Response;
                    if ((newData != null) && (newData.ErrorCode > 0)) {
                        if (newData.ErrorCode == 1) {
                            loan.docusignSigningRoom = null;
                            _this.continueButtonText = 'Error';
                            _this.isSigningRoomReady = false;
                            _this.signingRoomErrorMessage = 'The document has been declined by one of the signers.  Please contact your loan officer to continue.';
                        }
                    }
                    else {
                        loan.docusignSigningRoom = newData;
                        _this.continueButtonText = 'Continue';
                        _this.isSigningRoomReady = true;
                        _this.signingRoomErrorMessage = 'The document has been declined by one of the signers.  Please contact your loan officer to continue.';
                    }
                }, function (reason) {
                    loan.docusignSigningRoom = null;
                    _this.continueButtonText = 'Error';
                    _this.isSigningRoomReady = false;
                    _this.signingRoomErrorMessage = reason;
                });
                _this.unblockUI;
            };
            //called by continue button
            this.continue = function () {
                if (_this.isSigningRoomReady) {
                    _this.eSigningService.post('securelink/HandleSigningRoomSent?EnvelopeId=' + _this.loan.docusignSigningRoom.EnvelopeId, _this.authViewModel).then(function (response) {
                        var newData = response.Response;
                        if (newData != null) {
                            _this.$state.go('consumerSite.myNextStep.docusign.esigning');
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
            this.unblockUI = function () {
                _this.$timeout(function () {
                    // Stop the block after some async operation.
                    this.blockUI.reset();
                }.bind(_this), 0);
            };
            this.openEConsent();
            //Scroll so just the loanAppNavbarIsVisible
            loanAppPageContext.scrollToTop();
        }
        DocusignInstructionsController.className = "docusignInstructionsController";
        DocusignInstructionsController.$inject = ['loan', 'loanAppPageContext', 'applicationData', 'eConsentModalService', '$timeout', '$state', 'eSigningService'];
        return DocusignInstructionsController;
    })();
    consumersite.DocusignInstructionsController = DocusignInstructionsController;
    moduleRegistration.registerController(consumersite.moduleName, DocusignInstructionsController);
})(consumersite || (consumersite = {}));
//# sourceMappingURL=docusign.instructions.controller.js.map