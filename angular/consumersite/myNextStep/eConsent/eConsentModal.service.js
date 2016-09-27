var consumersite;
(function (consumersite) {
    var EConsentModalService = (function () {
        function EConsentModalService($modal) {
            var _this = this;
            this.$modal = $modal;
            this.openEConsentModal = function (loan, successCallback, errorCallback) {
                var borrowers = _this.getNonEConsentBorrowers(loan);
                var eConsentModalInstance;
                //if we have non-eConsented values, open.
                if (borrowers.length > 0) {
                    eConsentModalInstance = _this.$modal.open({
                        templateUrl: '/angular/consumersite/myNextStep/eConsent/eConsent.html',
                        backdrop: 'static',
                        controller: function () {
                            return new consumersite.ModalEConsentController(borrowers, eConsentModalInstance);
                        },
                        controllerAs: 'modalEConsentCntrl',
                    });
                    eConsentModalInstance.result.then(
                    //success
                    function (results) {
                        if (results) {
                            //if we have a borrower that has not eConsented
                            if (_this.getNonEConsentBorrowers(loan).length > 0) {
                                _this.openEConsentModal(loan, successCallback);
                            }
                            else {
                                successCallback();
                            }
                        }
                        else {
                            //TODO: UPDATE BORROWERS IF EITHER SELECT DECLINE
                            _this.declineForAllBorrowers(loan);
                            console.log("Borrower(s) Declined eConsent");
                        }
                    }, 
                    //cancel
                    function (reason) {
                        console.log("eConsent Modal Cancelled");
                        console.log(reason);
                    });
                }
                else {
                    successCallback();
                }
            };
            //If one borrower declines, all borrowers must decline.
            this.declineForAllBorrowers = function (loan) {
                loan.loanApp.borrower.eConsent.consentStatus = 2 /* Decline */;
                if (loan.loanApp.hasCoBorrower)
                    loan.loanApp.coBorrower.eConsent.consentStatus = 2 /* Decline */;
            };
            this.getNonEConsentBorrowers = function (loan) {
                var borrowers = [];
                //if borrower hasn't eConsent add to list
                if (loan.loanApp.borrower.eConsent.consentStatus != 1 /* Accept */) {
                    borrowers.push({ borrower: loan.loanApp.borrower, isPrimaryBorrower: true });
                }
                //if coBorrower exists and hasn't eConsent add to list
                if (loan.loanApp.hasCoBorrower && loan.loanApp.coBorrower.eConsent.consentStatus != 1 /* Accept */) {
                    borrowers.push({ borrower: loan.loanApp.coBorrower, isPrimaryBorrower: false });
                }
                return borrowers;
            };
        }
        EConsentModalService.className = 'eConsentModalService';
        EConsentModalService.$inject = ['$modal'];
        return EConsentModalService;
    })();
    consumersite.EConsentModalService = EConsentModalService;
    moduleRegistration.registerService(consumersite.moduleName, EConsentModalService);
})(consumersite || (consumersite = {}));
//# sourceMappingURL=eConsentModal.service.js.map