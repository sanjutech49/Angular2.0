/// <reference path='../../../angular/ts/extendedViewModels/property.extendedViewModel.ts' />

module consumersite.vm {

    export class Appraisal {

        private getAppraisal: () => any;

        constructor(appraisal: any) {
            this.getAppraisal = () => appraisal;
        }

        get appraisalProducts(): any[] {
            return this.getAppraisal().appraisalProducts;
        }


        //appraisal payment info section
        get billingAddress(): any {
            return this.getAppraisal().creditCardInfo.billingAddress;
        }
        set billingAddress(val: any) {
            this.getAppraisal().creditCardInfo.billingAddress = val;
        }

        get ccvNumber(): string {
            return this.getAppraisal().creditCardInfo.ccvNumber;
        }
        set ccvNumber(val: string) {
            this.getAppraisal().creditCardInfo.ccvNumber = val;
        }

        get creditCardExpirationMonth(): string {
            return this.getAppraisal().creditCardInfo.creditCardExpirationMonth;
        }
        set creditCardExpirationMonth(val: string) {
            this.getAppraisal().creditCardInfo.creditCardExpirationMonth = val;
        }

        get creditCardExpirationYear(): string {
            return this.getAppraisal().creditCardInfo.creditCardExpirationYear;
        }
        set creditCardExpirationYear(val: string) {
            this.getAppraisal().creditCardInfo.creditCardExpirationYear = val;
        }

        get creditCardNumber(): string {
            return this.getAppraisal().creditCardInfo.creditCardNumber;
        }
        set creditCardNumber(val: string) {
            this.getAppraisal().creditCardInfo.creditCardNumber = val;
        }

        get creditCardType(): string {
            return this.getAppraisal().creditCardInfo.creditCardType;
        }
        set creditCardType(val: string) {
            this.getAppraisal().creditCardInfo.creditCardType = val;
        }

        get nameOnCreditCard(): string {
            return this.getAppraisal().creditCardInfo.nameOnCreditCard;
        }
        set nameOnCreditCard(val: string) {
            this.getAppraisal().creditCardInfo.nameOnCreditCard = val;
        }

        //appraisal contact section
        get contactRelation(): string {
            return this.getAppraisal().appraisalContact.contactRelation;
        }
        set contactRelation(val: string) {
            this.getAppraisal().appraisalContact.contactRelation = val;
        }

        get email(): string {
            return this.getAppraisal().appraisalContact.email;
        }
        set email(val: string) {
            this.getAppraisal().appraisalContact.email = val;
        }

        get firstName(): string {
            return this.getAppraisal().appraisalContact.firstName;
        }
        set firstName(val: string) {
            this.getAppraisal().appraisalContact.firstName = val;
        }

        get lastName(): string {
            return this.getAppraisal().appraisalContact.lastName;
        }
        set lastName(val: string) {
            this.getAppraisal().appraisalContact.lastName = val;
        }

        get phone(): string {
            return this.getAppraisal().appraisalContact.phone;
        }
        set phone(val: string) {
            this.getAppraisal().appraisalContact.phone = val;
        }

        get phoneType(): string {
            return this.getAppraisal().appraisalContact.phoneType;
        }
        set phoneType(val: string) {
            this.getAppraisal().appraisalContact.phoneType = val;
        }

        get specialInstructions(): string {
            return this.getAppraisal().appraisalContact.specialInstructions;
        }
        set specialInstructions(val: string) {
            this.getAppraisal().appraisalContact.specialInstructions = val;
        }
    }
}