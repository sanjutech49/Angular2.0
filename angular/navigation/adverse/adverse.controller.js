var loanCenter;
(function (loanCenter) {
    'use strict';
    var adverseController = (function () {
        function adverseController(model, $modalStack, callBackDone, wrappedLoan, applicationData) {
            var _this = this;
            this.model = model;
            this.$modalStack = $modalStack;
            this.callBackDone = callBackDone;
            this.wrappedLoan = wrappedLoan;
            this.applicationData = applicationData;
            this.done = function () {
                _this.callBackDone(_this.adverseReason);
            };
            this.cancel = function () {
                _this.$modalStack.dismissAll('close');
            };
            this.adverseDisabled = function () {
                return (!_this.showComment() || common.string.isNullOrWhiteSpace(_this.adverseReason.reason));
            };
            this.getAdverseReasons = function () {
                var flag_refinance = 1; // 0001
                var flag_common = 2; // 0010
                var flag_purchase = 3; // 0011
                var currentContext = flag_refinance;
                var reasons = lib.filter(_this.applicationData.lookup.adverseReasons, function (reason) {
                    return reason.value == 0 /* SelectOne */;
                });
                if (_this.wrappedLoan.ref.loanPurposeType == 1 /* Purchase */ && _this.wrappedLoan.ref.homeBuyingType == 3 /* GetPreApproved */) {
                    currentContext = flag_purchase;
                }
                lib.forEach(_this.applicationData.lookup.adverseReasons, function (reason) {
                    if (reason.contextFlags == flag_common || reason.contextFlags == currentContext) {
                        reasons.push(reason);
                    }
                });
                return reasons;
            };
            this.showComment = function () {
                return (_this.adverseReason.reasonType != null && _this.adverseReason.reasonType != 0 /* SelectOne */);
            };
            this.adverseReason = new srv.cls.AdverseReasonViewModel();
            if (this.model.adverseReason) {
                angular.extend(this.adverseReason, this.model.adverseReason);
            }
        }
        adverseController.className = 'adverseController';
        adverseController.$inject = ['model', '$modalStack', 'callBackDone', 'wrappedLoan', 'applicationData'];
        return adverseController;
    })();
    loanCenter.adverseController = adverseController;
    angular.module('loanCenter').controller('adverseController', adverseController);
})(loanCenter || (loanCenter = {}));
//# sourceMappingURL=adverse.controller.js.map