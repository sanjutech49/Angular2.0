var loanCenter;
(function (loanCenter) {
    'use strict';
    var complianceCheckFailedPopupController = (function () {
        function complianceCheckFailedPopupController(model, $modalStack, callbackOpenDocument, checkSaveDiscloseActionsCallback, errorList) {
            var _this = this;
            this.model = model;
            this.$modalStack = $modalStack;
            this.callbackOpenDocument = callbackOpenDocument;
            this.checkSaveDiscloseActionsCallback = checkSaveDiscloseActionsCallback;
            this.errorList = errorList;
            this.done = function () {
                _this.callbackOpenDocument(_this.model.documentRepositoryId, true, true);
                _this.cancel();
            };
            this.cancel = function () {
                _this.$modalStack.dismissAll('close');
                _this.checkSaveDiscloseActionsCallback();
            };
            this.getComplianceCheckErrorText = function (errorId) {
                var complanceError = lib.findFirst(_this.model.complaianceCheckErrors, function (item) { return item.value == errorId; }, null);
                if (complanceError) {
                    return complanceError.text;
                }
                return "";
            };
            if (this.model.errorList) {
                this.errorList = this.model.errorList;
            }
        }
        complianceCheckFailedPopupController.className = 'complianceCheckFailedPopupController';
        complianceCheckFailedPopupController.$inject = ['model', '$modalStack', 'callbackOpenDocument', 'checkSaveDiscloseActionsCallback'];
        return complianceCheckFailedPopupController;
    })();
    loanCenter.complianceCheckFailedPopupController = complianceCheckFailedPopupController;
    angular.module('loanCenter').controller(complianceCheckFailedPopupController.className, complianceCheckFailedPopupController);
})(loanCenter || (loanCenter = {}));
//# sourceMappingURL=compliancecheckfailedpopup.controller.js.map