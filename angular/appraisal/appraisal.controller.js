var loanCenter;
(function (loanCenter) {
    var AppraisalController = (function () {
        function AppraisalController($rootScope, NavigationSvc, enums) {
            this.$rootScope = $rootScope;
            this.NavigationSvc = NavigationSvc;
            this.enums = enums;
            this.$rootScope.navigation = 'Appraisal';
            NavigationSvc.contextualType = enums.ContextualTypes.Appraisal;
        }
        AppraisalController.className = 'AppraisalController';
        AppraisalController.$inject = ['$rootScope', 'NavigationSvc', 'enums'];
        return AppraisalController;
    })();
    loanCenter.AppraisalController = AppraisalController;
    moduleRegistration.registerController('loanCenter', AppraisalController);
})(loanCenter || (loanCenter = {}));
//# sourceMappingURL=appraisal.controller.js.map