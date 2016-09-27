/// <reference path='../../../angular/ts/extendedViewModels/property.extendedViewModel.ts' />
module srv {

    export interface IEmailSendReportViewModel {
        firstName: string;
        lastName: string;
        emailAddress: string;
       // emailAddressRecipients: ICollection<string>;
    }
  export class SendEmailReportViewModel implements srv.IEmailSendReportViewModel {
        firstName: string;
        lastName: string;
        emailAddress: string;
      //  emailAddressRecipients: ICollection<string>;
    }
}

module consumersite.vm {

  
    export class SendEmailReport {

        private getProperty: () => srv.SendEmailReportViewModel;

        constructor(property: srv.SendEmailReportViewModel) {
            this.getProperty = () => property;
        }

        get firstName() {
            return this.getProperty().firstName;
        }
        set firstName(firstName: string) {
            this.getProperty().firstName = firstName;
        }
       

        get lastName() {
            return this.getProperty().lastName;
        }
        set lastName(lastName: string) {
            this.getProperty().lastName = lastName;
        }

        get emailAddress() {
            return this.getProperty().emailAddress;
        }
        set emailAddress(emailAddress: string) {
            this.getProperty().emailAddress = emailAddress;
        }
        
        get emailAddressRecipients() {
            return this.getProperty().emailAddressRecipients;
        }
        set emailAddressRecipients(emailAddressRecipients: srv.ICollection<string>) {
            this.getProperty().emailAddressRecipients = emailAddressRecipients;
        }
      

    }
}