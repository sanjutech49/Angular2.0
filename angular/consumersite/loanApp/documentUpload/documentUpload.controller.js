/// <reference path="../../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../../Scripts/typings/underscore/underscore.d.ts" />
var consumersite;
(function (consumersite) {
    var DocumentUploadController = (function () {
        function DocumentUploadController(loan, loanAppPageContext, applicationData) {
            this.loan = loan;
            this.loanAppPageContext = loanAppPageContext;
            this.applicationData = applicationData;
            this.controllerAsName = "documentUploadCntrl";
            //Scroll so just the loanAppNavbarIsVisible
            loanAppPageContext.scrollToTop();
        }
        DocumentUploadController.className = "documentUploadController";
        DocumentUploadController.$inject = ['loan', 'loanAppPageContext', 'applicationData'];
        return DocumentUploadController;
    })();
    consumersite.DocumentUploadController = DocumentUploadController;
    moduleRegistration.registerController(consumersite.moduleName, DocumentUploadController);
})(consumersite || (consumersite = {}));
//# sourceMappingURL=documentUpload.controller.js.map