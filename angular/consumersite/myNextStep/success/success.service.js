var consumersite;
(function (consumersite) {
    var SuccessModalController = (function () {
        function SuccessModalController($modalInstance) {
            var _this = this;
            this.$modalInstance = $modalInstance;
            this.close = function () {
                _this.$modalInstance.close();
            };
        }
        return SuccessModalController;
    })();
    var SuccessModalService = (function () {
        function SuccessModalService($modal) {
            var _this = this;
            this.$modal = $modal;
            this.openSuccessModal = function () {
                var successModalInstance = _this.$modal.open({
                    templateUrl: '/angular/consumersite/myNextStep/success/success.esigning.html',
                    backdrop: 'static',
                    controller: function () {
                        return new SuccessModalController(successModalInstance);
                    },
                    controllerAs: 'modalSuccessCntrl',
                });
                successModalInstance.result.then(
                //success
                function (results) {
                }, 
                //cancel
                function (reason) {
                    console.log(reason);
                });
            };
        }
        SuccessModalService.className = 'successModalService';
        SuccessModalService.$inject = ['$modal'];
        return SuccessModalService;
    })();
    consumersite.SuccessModalService = SuccessModalService;
    moduleRegistration.registerService(consumersite.moduleName, SuccessModalService);
})(consumersite || (consumersite = {}));
//# sourceMappingURL=success.service.js.map