/// <reference path="../../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../../Scripts/typings/underscore/underscore.d.ts" />
var srv;
(function (srv) {
    var ActivationCode = (function () {
        function ActivationCode(key, value) {
            this.key = key;
            this.value = value;
        }
        return ActivationCode;
    })();
    srv.ActivationCode = ActivationCode;
})(srv || (srv = {}));
var consumersite;
(function (consumersite) {
    var ActivationCodeController = (function () {
        // dependencies are injected via AngularJS $injector
        // controller's name is registered in Application.ts and specified from ng-controller attribute in index.html
        function ActivationCodeController(loan, loanAppPageContext, codes) {
            this.loan = loan;
            this.loanAppPageContext = loanAppPageContext;
            this.codes = codes;
            this.controllerAsName = "activationCodedCntrl";
            this.codes = codes;
            if (this.codes == null)
                this.codes = [];
            this.codea = new srv.ActivationCode("(555) 555-5555", "VALUE");
            this.codes.push(this.codea);
            this.codea = new srv.ActivationCode("(555) 555-6666", "VALUE3");
            this.codes.push(this.codea);
            this.codea = new srv.ActivationCode("(555) 555-7777", "VALUE3");
            this.codes.push(this.codea);
            //Scroll so just the loanAppNavbarIsVisible
            loanAppPageContext.scrollToTop();
        }
        Object.defineProperty(ActivationCodeController.prototype, "Codes", {
            get: function () {
                return this.codes;
            },
            set: function (value) {
                this.codes = value;
            },
            enumerable: true,
            configurable: true
        });
        ActivationCodeController.className = "activationCodeController";
        ActivationCodeController.$inject = ['loan', 'loanAppPageContext'];
        return ActivationCodeController;
    })();
    consumersite.ActivationCodeController = ActivationCodeController;
    moduleRegistration.registerController(consumersite.moduleName, ActivationCodeController);
})(consumersite || (consumersite = {}));
//# sourceMappingURL=activationcode.controller.js.map