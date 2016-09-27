module consumersite {

    export interface IBorrowerContext {
        borrower: any;
        isPrimaryBorrower: boolean;
    }

    export class EConsentModalService {

        static className = 'eConsentModalService';

        static $inject = ['$modal'];

        constructor(private $modal: ng.ui.bootstrap.IModalService) { }

        openEConsentModal = (loan: vm.Loan, successCallback: () => void, errorCallback?: () => void) => {

            var borrowers: consumersite.IBorrowerContext[] = this.getNonEConsentBorrowers(loan);
            var eConsentModalInstance: angular.ui.bootstrap.IModalServiceInstance;

            //if we have non-eConsented values, open.
            if (borrowers.length > 0) {

                eConsentModalInstance = this.$modal.open({
                    templateUrl: '/angular/consumersite/myNextStep/eConsent/eConsent.html',
                    backdrop: 'static',
                    controller: () => {
                        return new ModalEConsentController(borrowers, eConsentModalInstance);
                    },
                    controllerAs: 'modalEConsentCntrl',
                });

                eConsentModalInstance.result.then(
                    //success
                    (results) => {
                        if (results) {
                            //if we have a borrower that has not eConsented
                            if (this.getNonEConsentBorrowers(loan).length > 0) {
                                this.openEConsentModal(loan, successCallback);
                            }
                            //call success method, if there is one.
                            else {
                                successCallback();
                            }
                        }
                        else {
                            //TODO: UPDATE BORROWERS IF EITHER SELECT DECLINE
                            this.declineForAllBorrowers(loan);
                            console.log("Borrower(s) Declined eConsent");
                        }
                    },
                    //cancel
                    (reason) => {
                        console.log("eConsent Modal Cancelled");
                        console.log(reason);
                    });
            }
            else {
                successCallback();
            }

        };
        

        //If one borrower declines, all borrowers must decline.
        private declineForAllBorrowers = (loan: vm.Loan) => {
            loan.loanApp.borrower.eConsent.consentStatus = srv.ConsentStatusEnum.Decline;

            if (loan.loanApp.hasCoBorrower)
                loan.loanApp.coBorrower.eConsent.consentStatus = srv.ConsentStatusEnum.Decline;
        }

        private getNonEConsentBorrowers = (loan: vm.Loan): consumersite.IBorrowerContext[] => {
            var borrowers: consumersite.IBorrowerContext[] = [];

            //if borrower hasn't eConsent add to list
            if (loan.loanApp.borrower.eConsent.consentStatus != srv.ConsentStatusEnum.Accept) {
                borrowers.push({ borrower: loan.loanApp.borrower, isPrimaryBorrower: true });
            }
            //if coBorrower exists and hasn't eConsent add to list
            if (loan.loanApp.hasCoBorrower && loan.loanApp.coBorrower.eConsent.consentStatus != srv.ConsentStatusEnum.Accept) {
                borrowers.push({ borrower: loan.loanApp.coBorrower, isPrimaryBorrower: false });
            }

            return borrowers;
        }
    }

    moduleRegistration.registerService(consumersite.moduleName, EConsentModalService);
}