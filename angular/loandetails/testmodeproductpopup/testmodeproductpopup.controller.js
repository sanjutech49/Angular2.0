var loanCenter;
(function (loanCenter) {
    'use strict';
    var testModeProductPopupController = (function () {
        function testModeProductPopupController(model, $modalStack, callBackSaveAndRequestDisclosure, callBackShowDisclosureLockModal, productId) {
            var _this = this;
            this.model = model;
            this.$modalStack = $modalStack;
            this.callBackSaveAndRequestDisclosure = callBackSaveAndRequestDisclosure;
            this.callBackShowDisclosureLockModal = callBackShowDisclosureLockModal;
            this.productId = productId;
            this.done = function () {
                _this.cancel();
                if (!_this.model.isLock) {
                    _this.callBackSaveAndRequestDisclosure(null, null, null, _this.productId);
                }
                else {
                    _this.callBackShowDisclosureLockModal(_this.productId);
                }
            };
            this.cancel = function () {
                _this.$modalStack.dismissAll('close');
            };
            if (this.model.productId) {
                this.productId = this.model.productId;
            }
        }
        testModeProductPopupController.className = 'testModeProductPopupController';
        testModeProductPopupController.$inject = ['model', '$modalStack', 'callBackSaveAndRequestDisclosure', 'callBackShowDisclosureLockModal'];
        return testModeProductPopupController;
    })();
    loanCenter.testModeProductPopupController = testModeProductPopupController;
    angular.module('loanCenter').controller('testModeProductPopupController', testModeProductPopupController);
})(loanCenter || (loanCenter = {}));
//# sourceMappingURL=testmodeproductpopup.controller.js.map