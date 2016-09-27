var loanCenter;
(function (loanCenter) {
    'use strict';
    var complianceCheckPassedPopupController = (function () {
        function complianceCheckPassedPopupController(model, $modalStack, callBackSaveAndRequestDisclosure, checkSaveDiscloseActionsCallback) {
            var _this = this;
            this.model = model;
            this.$modalStack = $modalStack;
            this.callBackSaveAndRequestDisclosure = callBackSaveAndRequestDisclosure;
            this.checkSaveDiscloseActionsCallback = checkSaveDiscloseActionsCallback;
            this.done = function () {
                _this.callBackSaveAndRequestDisclosure();
                _this.cancel();
            };
            this.cancel = function () {
                _this.$modalStack.dismissAll('close');
                _this.checkSaveDiscloseActionsCallback();
            };
        }
        complianceCheckPassedPopupController.className = 'complianceCheckPassedPopupController';
        complianceCheckPassedPopupController.$inject = ['model', '$modalStack', 'callBackSaveAndRequestDisclosure', 'checkSaveDiscloseActionsCallback'];
        return complianceCheckPassedPopupController;
    })();
    loanCenter.complianceCheckPassedPopupController = complianceCheckPassedPopupController;
    angular.module('loanCenter').controller(complianceCheckPassedPopupController.className, complianceCheckPassedPopupController);
})(loanCenter || (loanCenter = {}));
//# sourceMappingURL=compliancecheckpassedpopup.controller.js.map