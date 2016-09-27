/// <reference path="../../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path='../../../../Scripts/typings/ui-router/angular-ui-router.d.ts'/>

module docusign {

    export class AppraisalController {

        private isBillingSameAsProperty: boolean = true;
        private phoneTypeOptions: any;
        private successController: SuccessController;

        static className = 'AppraisalController';

        static $inject = [
            'docusignSVC',
            'authenticationContext',
            'loanViewModel',
            '$controller',
        ];

        constructor(
            private docusignSVC: IDocusignService,
            private authenticationContext: cls.SecureLinkAuthenticationViewModel,
            private loanViewModel: cls.LoanViewModel,
            private $controller: ng.IControllerService) {

            console.log(this.loanViewModel);
            //this.successController = this.$controller('SuccessController');
            this.init();
        }

        private init = () => {
            this.isBorrowerContact();

            this.phoneTypeOptions = [   //Used to populate the Preferred Phone Type select box based off of the PhoneNumberType Enums
                { id: srv.PhoneNumberType.Home, name: 'Home' },
                { id: srv.PhoneNumberType.Cell, name: 'Cell' },
                { id: srv.PhoneNumberType.Work, name: 'Work' },
                { id: srv.PhoneNumberType.Other, name: 'Other' }
            ];
        }

        private placeOrder = () => {

            this.docusignSVC.save().then(() => {
                this.openSuccessController();
            });

            this.docusignSVC.log(this.loanViewModel.appraisal);
        }

        //Calculates the total Appraisal Product amount based on the given array of values
        private totalProductAmount = () => {
            var total: number = 0;
            for (var i = 0; i < this.loanViewModel.appraisal.appraisalProducts.length; i++) {
                total += + this.loanViewModel.appraisal.appraisalProducts[i].amount;
            }
            return total;
        }

        //If the borrower/coborrower is the preferred contact, disabled the input fields as the user does not have the ability to modify them on this page.
        private isBorrowerContact = () => {
            if (this.loanViewModel.appraisal.appraisalContact.contactRelation === "borrower" || this.loanViewModel.appraisal.appraisalContact.contactRelation === "coborrower") {
                return true;
            }
            return false;
        }

        //Resets the Preferred Contact fields if the user changes back to the borrower or coborrower option
        private setPreferredContact = () => {
            var preferredContactType: string = this.loanViewModel.appraisal.appraisalContact.contactRelation;
            if (this.isBorrowerContact()) {
                var borrowers: srv.IBorrowerViewModel[] = this.docusignSVC.getBorrowers(this.authenticationContext, this.loanViewModel);
                var borrower: srv.IBorrowerViewModel = borrowers[0];
                var coBorrower: srv.IBorrowerViewModel = this.hasCoBorrower ? borrowers[1] : null;

                if (preferredContactType === "borrower") {
                    this.loanViewModel.appraisal.appraisalContact.email = borrower.email;
                    this.loanViewModel.appraisal.appraisalContact.firstName = borrower.firstName;
                    this.loanViewModel.appraisal.appraisalContact.lastName = borrower.lastName;
                    this.loanViewModel.appraisal.appraisalContact.phone = borrower.preferredPhone.number;
                    this.loanViewModel.appraisal.appraisalContact.phoneType = borrower.preferredPhone.type;
                }

                if (preferredContactType === "coborrower" && angular.isDefined(coBorrower)) {
                    this.loanViewModel.appraisal.appraisalContact.email = coBorrower.email;
                    this.loanViewModel.appraisal.appraisalContact.firstName = coBorrower.firstName;
                    this.loanViewModel.appraisal.appraisalContact.lastName = coBorrower.lastName;
                    this.loanViewModel.appraisal.appraisalContact.phone = coBorrower.preferredPhone.number;
                    this.loanViewModel.appraisal.appraisalContact.phoneType = coBorrower.preferredPhone.type;
                }
            }
            else {//otherwise, reset to blank
                this.loanViewModel.appraisal.appraisalContact = new srv.cls.AppraisalContactViewModel;
            }
        }

        private hasCoBorrower = () => {
            if (this.docusignSVC.getBorrowers(this.authenticationContext, this.loanViewModel).length > 1) {
                return true;
            }

            return false;
        }

        //Opens the Success Modal Popup with the Appraisal Thank You Message displayed.
        private openSuccessController = () => {
            var templateURL = '/angular/consumer/docusign/esigning/confirmation/success.appraisal.html';
            this.successController.openSuccessPopUp(templateURL);
        }
    }

    angular.module('docusign').controller('AppraisalController', AppraisalController);
}