/// <reference path="../../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../../Scripts/typings/underscore/underscore.d.ts" />
var consumersite;
(function (consumersite) {
    var ProductDetailsController = (function () {
        function ProductDetailsController($modalInstance, selectedProduct) {
            var _this = this;
            this.$modalInstance = $modalInstance;
            this.selectedProduct = selectedProduct;
            this.controllerAsName = "productDetailsCtrl";
            this.close = function () {
                _this.$modalInstance.dismiss('cancel');
            };
        }
        ProductDetailsController.className = "productDetailsController";
        ProductDetailsController.$inject = [];
        return ProductDetailsController;
    })();
    consumersite.ProductDetailsController = ProductDetailsController;
    moduleRegistration.registerController(consumersite.moduleName, ProductDetailsController);
})(consumersite || (consumersite = {}));
//# sourceMappingURL=productDetails.controller.js.map