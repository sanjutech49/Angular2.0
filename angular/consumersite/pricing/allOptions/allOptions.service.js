var consumersite;
(function (consumersite) {
    var PricingAllOptionsController = (function () {
        function PricingAllOptionsController(vf, $modalInstance) {
            var _this = this;
            this.vf = vf;
            this.$modalInstance = $modalInstance;
            this.currencyFormatting = function (value) {
                return value.toString() + " $";
            };
            this.close = function () {
                _this.$modalInstance.close(_this.vf);
            };
            //if the user clicks outside of the modal or on the "close" in the top right corner.
            this.dismiss = function () {
                _this.$modalInstance.dismiss("Canceled by user");
            };
            this.vf = vf;
        }
        Object.defineProperty(PricingAllOptionsController.prototype, "showAll", {
            get: function () {
                return (this.showAllFixed && this.showAllARM);
            },
            set: function (value) {
                this.showAllFixed = value;
                this.showAllARM = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PricingAllOptionsController.prototype, "showAllFixed", {
            get: function () {
                return (this.vf.show30Fixed && this.vf.show25Fixed && this.vf.show20Fixed && this.vf.show15Fixed && this.vf.show10Fixed);
            },
            set: function (value) {
                this.vf.show30Fixed = value;
                this.vf.show25Fixed = value;
                this.vf.show20Fixed = value;
                this.vf.show15Fixed = value;
                this.vf.show10Fixed = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PricingAllOptionsController.prototype, "show30Fixed", {
            get: function () {
                return this.vf.show30Fixed;
            },
            set: function (value) {
                this.vf.show30Fixed = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PricingAllOptionsController.prototype, "show25Fixed", {
            get: function () {
                return this.vf.show25Fixed;
            },
            set: function (value) {
                this.vf.show25Fixed = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PricingAllOptionsController.prototype, "show20Fixed", {
            get: function () {
                return this.vf.show20Fixed;
            },
            set: function (value) {
                this.vf.show20Fixed = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PricingAllOptionsController.prototype, "show15Fixed", {
            get: function () {
                return this.vf.show15Fixed;
            },
            set: function (value) {
                this.vf.show15Fixed = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PricingAllOptionsController.prototype, "show10Fixed", {
            get: function () {
                return this.vf.show10Fixed;
            },
            set: function (value) {
                this.vf.show10Fixed = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PricingAllOptionsController.prototype, "showAllARM", {
            //
            get: function () {
                return (this.vf.show10ARM && this.vf.show7ARM && this.vf.show5ARM && this.vf.show3ARM);
            },
            set: function (value) {
                this.vf.show10ARM = value;
                this.vf.show7ARM = value;
                this.vf.show5ARM = value;
                this.vf.show3ARM = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PricingAllOptionsController.prototype, "show10ARM", {
            get: function () {
                return this.vf.show10ARM;
            },
            set: function (value) {
                this.vf.show10ARM = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PricingAllOptionsController.prototype, "show7ARM", {
            get: function () {
                return this.vf.show7ARM;
            },
            set: function (value) {
                this.vf.show7ARM = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PricingAllOptionsController.prototype, "show5ARM", {
            get: function () {
                return this.vf.show5ARM;
            },
            set: function (value) {
                this.vf.show5ARM = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PricingAllOptionsController.prototype, "show3ARM", {
            get: function () {
                return this.vf.show3ARM;
            },
            set: function (value) {
                this.vf.show3ARM = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PricingAllOptionsController.prototype, "sortField", {
            //
            get: function () {
                return this.vf.sortField;
            },
            set: function (value) {
                this.vf.sortField = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PricingAllOptionsController.prototype, "sortDirection", {
            get: function () {
                return this.vf.sortDirection;
            },
            set: function (value) {
                this.vf.sortDirection = value;
            },
            enumerable: true,
            configurable: true
        });
        return PricingAllOptionsController;
    })();
    consumersite.PricingAllOptionsController = PricingAllOptionsController;
    var PricingAllOptionsService = (function () {
        function PricingAllOptionsService($log, $modal) {
            var _this = this;
            this.$log = $log;
            this.$modal = $modal;
            this.doModal = function (loan, vf) {
                var input = {
                    show30Fixed: vf.show30Fixed,
                    show25Fixed: vf.show25Fixed,
                    show20Fixed: vf.show20Fixed,
                    show15Fixed: vf.show15Fixed,
                    show10Fixed: vf.show10Fixed,
                    show10ARM: vf.show10ARM,
                    show7ARM: vf.show7ARM,
                    show5ARM: vf.show5ARM,
                    show3ARM: vf.show3ARM,
                    sortField: vf.sortField,
                    sortDirection: vf.sortDirection,
                    maxInterest: vf.maxInterest,
                    maxPayment: vf.maxPayment,
                    maxCost: vf.maxCost
                };
                PricingAllOptionsService._loan = loan;
                PricingAllOptionsService._loan.pricingFilter = input;
                var optionsModal = _this.$modal.open({
                    templateUrl: '/angular/consumersite/pricing/allOptions/allOptions.html',
                    backdrop: true,
                    backdropClass: 'noBackdrop',
                    windowClass: 'allOptionsPosition',
                    controller: function () {
                        return new PricingAllOptionsController(input, optionsModal);
                    },
                    controllerAs: 'allOptionsCntrl',
                });
                optionsModal.result.then(
                //success
                function (results) {
                    console.log("closed");
                    console.log(results);
                    PricingAllOptionsService._loan.pricingFilter = results;
                }, 
                //cancel
                function (reason) {
                    console.log("dismissed");
                    console.log(reason);
                });
            };
        }
        PricingAllOptionsService.className = 'pricingAllOptionsService';
        PricingAllOptionsService.$inject = ['$log', '$modal'];
        return PricingAllOptionsService;
    })();
    consumersite.PricingAllOptionsService = PricingAllOptionsService;
    moduleRegistration.registerService(consumersite.moduleName, PricingAllOptionsService);
})(consumersite || (consumersite = {}));
//# sourceMappingURL=allOptions.service.js.map