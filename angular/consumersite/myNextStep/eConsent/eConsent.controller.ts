/// <reference path="../../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../../Scripts/typings/underscore/underscore.d.ts" />

module consumersite {

    export class ModalEConsentController {

        private activeBorrower: IBorrowerContext;

        constructor(public borrowers: IBorrowerContext[], private $modalInstance: ng.ui.bootstrap.IModalServiceInstance) {
            console.log(borrowers);
            
            //@TODO temporary for Demo
            //this.borrowers[0].borrower.firstName = "Kerry";
            //this.borrowers[0].borrower.lastName = "Bayens";

            //set active to empty since it is single, primary borrower.
            this.activeBorrower = {
                borrower: {
                    fullName: "Select One",
                    eConsent: {
                        consentStatus: srv.ConsentStatusEnum.None,
                        statusAt: new Date(),
                    }
                },
                isPrimaryBorrower: true,
            }
        }

        get consentStatusAccept(): number {
            return srv.ConsentStatusEnum.Accept;
        }

        get consentStatusDecline(): number {
            return srv.ConsentStatusEnum.Decline;
        }

        get fullName(): string {
            return this.activeBorrower.borrower.fullName;
        }

        get isPrimaryBorrower() {
            return this.activeBorrower.isPrimaryBorrower;
        }

        get isMultiBorrower(): boolean {
            return (this.borrowers.length > 1);
        }

        get eConsentStatus(): number {
            return this.activeBorrower.borrower.eConsent.consentStatus;
        }
        set eConsentStatus(val: number) {
            this.activeBorrower.borrower.eConsent.consentStatus = val;
        }

        setEConsentStatus = (val: number) => {
            if (val != srv.ConsentStatusEnum.Accept && val != srv.ConsentStatusEnum.Decline)
                this.eConsentStatus = srv.ConsentStatusEnum.None;
            else
                this.eConsentStatus = val;
        }

        get eConsentDate(): Date {
            return this.activeBorrower.borrower.eConsent.statusAt;
        }
        set eConsentDate(date: Date) {
            this.activeBorrower.borrower.eConsent.statusAt = date;
        }

        close = () => {
            this.eConsentDate = new Date();
            console.log(this.activeBorrower.borrower.eConsent.consentStatus);
            this.$modalInstance.close((this.eConsentStatus == srv.ConsentStatusEnum.Accept));
        }

        dismiss = () => {
            this.$modalInstance.dismiss("User Canceled eConsent");
        }
    }
    //moduleRegistration.registerController(consumersite.moduleName, ModalEConsentController);
} 