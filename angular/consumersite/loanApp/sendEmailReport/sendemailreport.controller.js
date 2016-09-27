/// <reference path="../../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../../Scripts/typings/underscore/underscore.d.ts" />
var consumersite;
(function (consumersite) {
    var SendEmailReportController = (function () {
        function SendEmailReportController($scope) {
            this.$scope = $scope;
            this.controllerAsName = "sendEmailReportCntrl";
            this.clickCancelSendReportClick = function () { alert('Cancel Logic'); };
            this.firstName = this._sendEmailReport.firstName;
            this.lastName = this._sendEmailReport.lastName;
            this.emailAddress = this._sendEmailReport.emailAddress;
            this.emailAddressRecipients = this._sendEmailReport.emailAddressRecipients;
        }
        SendEmailReportController.className = "sendEmailReportController";
        SendEmailReportController.$inject = ["$scope"];
        return SendEmailReportController;
    })();
    consumersite.SendEmailReportController = SendEmailReportController;
    moduleRegistration.registerController(consumersite.moduleName, SendEmailReportController);
})(consumersite || (consumersite = {}));
//# sourceMappingURL=sendemailreport.controller.js.map