/// <reference path="../../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../../Scripts/typings/underscore/underscore.d.ts" />
var consumersite;
(function (consumersite) {
    var DeclarationsController = (function () {
        function DeclarationsController(loan, loanAppPageContext, applicationData) {
            this.loan = loan;
            this.loanAppPageContext = loanAppPageContext;
            this.applicationData = applicationData;
            //Scroll so just the loanAppNavbarIsVisible
            loanAppPageContext.scrollToTop();
        }
        DeclarationsController.className = "declarationsController";
        DeclarationsController.$inject = ['loan', 'loanAppPageContext', 'applicationData'];
        return DeclarationsController;
    })();
    consumersite.DeclarationsController = DeclarationsController;
    moduleRegistration.registerController(consumersite.moduleName, DeclarationsController);
})(consumersite || (consumersite = {}));
//# sourceMappingURL=declarations.controller.js.map