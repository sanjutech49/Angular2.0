/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
var consumersite;
(function (consumersite) {
    var UIBlockWithSpinner = (function () {
        function UIBlockWithSpinner($uibModal, $uibModalStack) {
            var _this = this;
            this.$uibModal = $uibModal;
            this.$uibModalStack = $uibModalStack;
            this.call = function (method, message, successHandler, errorHandler) {
                if (errorHandler === void 0) { errorHandler = null; }
                var moduleSettings = {
                    backdrop: 'static',
                    backdropClass: 'custom-modal-backdrop',
                    keyboard: false,
                    templateUrl: '/angular/consumersite/demo/spinnerMessage.html',
                    controller: function () {
                        return { message: message };
                    },
                    controllerAs: 'messageSpinnerCntrl',
                    windowClass: 'common-modal',
                };
                _this.$uibModal.open(moduleSettings);
                method().then(function (data) {
                    _this.$uibModalStack.dismissAll('close');
                    successHandler(data);
                }, function (error) {
                    _this.$uibModalStack.dismissAll('close');
                    if (errorHandler)
                        errorHandler(error);
                });
            };
        }
        UIBlockWithSpinner.className = 'uiBlockWithSpinner';
        UIBlockWithSpinner.$inject = ['$uibModal', '$uibModalStack'];
        return UIBlockWithSpinner;
    })();
    consumersite.UIBlockWithSpinner = UIBlockWithSpinner;
    moduleRegistration.registerService(consumersite.moduleName, UIBlockWithSpinner);
})(consumersite || (consumersite = {}));
//# sourceMappingURL=ui.messageBlockWithSpinner.js.map