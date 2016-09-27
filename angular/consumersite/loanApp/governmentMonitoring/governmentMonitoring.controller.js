/// <reference path = "../../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path = "../../../../Scripts/typings/underscore/underscore.d.ts" />
var consumersite;
(function (consumersite) {
    var GovernmentMonitoringController = (function () {
        function GovernmentMonitoringController(loan, loanAppPageContext, applicationData) {
            this.loan = loan;
            this.loanAppPageContext = loanAppPageContext;
            this.applicationData = applicationData;
            this.isBorrower = !this.loanAppPageContext.isCoBorrowerState;
            this.borrower = !this.isBorrower ? this.loan.loanApp.coBorrower : this.loan.loanApp.borrower;
            //Scroll so just the loanAppNavbarIsVisible
            loanAppPageContext.scrollToTop();
        }
        GovernmentMonitoringController.className = "governmentMonitoringController";
        GovernmentMonitoringController.$inject = ['loan', 'loanAppPageContext', 'applicationData'];
        return GovernmentMonitoringController;
    })();
    consumersite.GovernmentMonitoringController = GovernmentMonitoringController;
    moduleRegistration.registerController(consumersite.moduleName, GovernmentMonitoringController);
})(consumersite || (consumersite = {}));
//# sourceMappingURL=governmentMonitoring.controller.js.map