var loanDetails;
(function (loanDetails) {
    'use strict';
    var lockConfirmationController = (function () {
        function lockConfirmationController(model, $modalInstance, $modalStack, $filter, callbackYes) {
            var _this = this;
            this.model = model;
            this.$modalInstance = $modalInstance;
            this.$modalStack = $modalStack;
            this.$filter = $filter;
            this.callbackYes = callbackYes;
            this.onYesClicked = function () {
                _this.callbackYes(true, _this.lockDate, _this.lockExpDate, _this.model.productId);
            };
            this.onNoClicked = function () {
                _this.$modalStack.dismissAll('close');
            };
            this.lockDate = moment();
            this.lockExpDate = moment().add(model.lockPeriod, "days");
        }
        Object.defineProperty(lockConfirmationController.prototype, "LockExpDate", {
            get: function () {
                return moment(this.lockExpDate).format("MM/DD/YY");
            },
            enumerable: true,
            configurable: true
        });
        lockConfirmationController.className = 'lockConfirmationController';
        lockConfirmationController.$inject = ['model', '$modalInstance', '$modalStack', '$filter', 'callbackYes'];
        return lockConfirmationController;
    })();
    angular.module('loanDetails').controller('lockConfirmationController', lockConfirmationController);
})(loanDetails || (loanDetails = {}));
//# sourceMappingURL=lockconfirmation.modal.controller.js.map