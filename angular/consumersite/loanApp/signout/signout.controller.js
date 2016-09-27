/// <reference path="../../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../../Scripts/typings/underscore/underscore.d.ts" />
var consumersite;
(function (consumersite) {
    var SignoutController = (function () {
        // dependencies are injected via AngularJS $injector
        // controller's name is registered in Application.ts and specified from ng-controller attribute in index.html
        function SignoutController(loan, loanAppPageContext) {
            this.loan = loan;
            this.loanAppPageContext = loanAppPageContext;
            this.controllerAsName = "signoutCntrl";
            this.phone = "(800)-555-1212";
            //Scroll so just the loanAppNavbarIsVisible
            loanAppPageContext.scrollToTop();
        }
        SignoutController.className = "signoutController";
        SignoutController.$inject = ['loan', 'loanAppPageContext'];
        return SignoutController;
    })();
    consumersite.SignoutController = SignoutController;
    moduleRegistration.registerController(consumersite.moduleName, SignoutController);
})(consumersite || (consumersite = {}));
//# sourceMappingURL=signout.controller.js.map