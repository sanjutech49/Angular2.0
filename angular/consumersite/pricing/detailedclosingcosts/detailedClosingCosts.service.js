var consumersite;
(function (consumersite) {
    var DetailedClosingCostsController = (function () {
        function DetailedClosingCostsController(loan, vm, $modalInstance) {
            var _this = this;
            this.loan = loan;
            this.vm = vm;
            this.$modalInstance = $modalInstance;
            this.close = function () {
                _this.$modalInstance.close(_this.loan);
            };
            //if the user clicks outside of the modal or on the "close" in the top right corner.
            this.dismiss = function () {
                _this.$modalInstance.dismiss("Canceled by user");
            };
        }
        return DetailedClosingCostsController;
    })();
    var DetailedClosingCostsService = (function () {
        function DetailedClosingCostsService($log, $modal) {
            var _this = this;
            this.$log = $log;
            this.$modal = $modal;
            this.openModal = function (loan, vm, successCallback, errorCallback) {
                DetailedClosingCostsService._loan = loan;
                DetailedClosingCostsService._vm = vm;
                var searchModal = _this.$modal.open({
                    templateUrl: '/angular/consumersite/pricing/detailedClosingCosts/detailedClosingCosts.html',
                    backdrop: true,
                    backdropClass: 'noBackdrop',
                    windowClass: 'detailedClosingCostsPosition',
                    //controller: () => {
                    //    return new DetailedClosingCostsController(this.loan,this.vm, searchModal);
                    //},
                    controller: function () {
                        return new DetailedClosingCostsController(_this.loan, _this.vm, searchModal);
                    },
                    controllerAs: 'detailedClosingCostsCntrl',
                });
                searchModal.result.then(
                //success
                function (results) {
                    console.log("closed");
                    successCallback();
                }, 
                //cancel
                function (reason) {
                    console.log("dismissed");
                    console.log(reason);
                });
            };
        }
        Object.defineProperty(DetailedClosingCostsService.prototype, "loan", {
            get: function () {
                return DetailedClosingCostsService._loan;
            },
            enumerable: true,
            configurable: true
        });
        DetailedClosingCostsService.prototype.set = function (val) {
            DetailedClosingCostsService._loan = val;
        };
        Object.defineProperty(DetailedClosingCostsService.prototype, "vm", {
            get: function () {
                return DetailedClosingCostsService._vm;
            },
            set: function (val) {
                DetailedClosingCostsService._vm = val;
            },
            enumerable: true,
            configurable: true
        });
        DetailedClosingCostsService.className = 'detailedClosingCostsService';
        DetailedClosingCostsService.$inject = ['$log', '$modal'];
        return DetailedClosingCostsService;
    })();
    consumersite.DetailedClosingCostsService = DetailedClosingCostsService;
    moduleRegistration.registerService(consumersite.moduleName, DetailedClosingCostsService);
})(consumersite || (consumersite = {}));
//# sourceMappingURL=detailedClosingCosts.service.js.map