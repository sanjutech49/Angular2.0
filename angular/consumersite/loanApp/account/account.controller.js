/// <reference path="../../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../../Scripts/typings/underscore/underscore.d.ts" />
var consumersite;
(function (consumersite) {
    var AccountController = (function () {
        function AccountController(loan, loanAppPageContext, applicationData) {
            var _this = this;
            this.loan = loan;
            this.loanAppPageContext = loanAppPageContext;
            this.applicationData = applicationData;
            this.showPassword = function () {
                console.log("1 ::: " + _this.passwordOne);
                console.log("2 ::: " + _this.passwordTwo);
            };
            //Scroll so just the loanAppNavbarIsVisible
            loanAppPageContext.scrollToTop();
        }
        AccountController.className = "accountController";
        AccountController.$inject = ['loan', 'loanAppPageContext', 'applicationData'];
        return AccountController;
    })();
    consumersite.AccountController = AccountController;
    moduleRegistration.registerController(consumersite.moduleName, AccountController);
})(consumersite || (consumersite = {}));
//# sourceMappingURL=account.controller.js.map