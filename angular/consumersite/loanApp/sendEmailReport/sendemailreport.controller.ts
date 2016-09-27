/// <reference path="../../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../../Scripts/typings/underscore/underscore.d.ts" />

module consumersite {

    export class SendEmailReportController {

        public controllerAsName: string = "sendEmailReportCntrl";

        static className = "sendEmailReportController";

        public static $inject = ["$scope"];

        public _sendEmailReport: vm.SendEmailReport;

        public firstName: string;
        public lastName: string;
        public emailAddress: string;
        public emailAddressRecipients: srv.ICollection<string>;

        public clickSendReport;
       
        constructor(public $scope: SendEmailReportController ) {

            this.firstName = this._sendEmailReport.firstName;
            this.lastName = this._sendEmailReport.lastName;
            this.emailAddress = this._sendEmailReport.emailAddress;
            this.emailAddressRecipients = this._sendEmailReport.emailAddressRecipients;

        }
        clickCancelSendReportClick = () => { alert('Cancel Logic'); };
       

    }
    
   
    moduleRegistration.registerController(consumersite.moduleName, SendEmailReportController);
   
} 
  