var contextualBar;
(function (contextualBar) {
    var AppraisalContextualBarController = (function () {
        function AppraisalContextualBarController(wrappedLoan, applicationData) {
            this.wrappedLoan = wrappedLoan;
            this.applicationData = applicationData;
        }
        AppraisalContextualBarController.className = 'AppraisalContextualBarController';
        AppraisalContextualBarController.$inject = ['wrappedLoan', 'applicationData'];
        return AppraisalContextualBarController;
    })();
    contextualBar.AppraisalContextualBarController = AppraisalContextualBarController;
    moduleRegistration.registerController('contextualBar', AppraisalContextualBarController);
})(contextualBar || (contextualBar = {}));
//# sourceMappingURL=appraisalcontextualbar.controller.js.map