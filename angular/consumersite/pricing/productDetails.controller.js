/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-animate.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />
/// <reference path="../../ts/generated/viewModels.ts" />
/// <reference path="../../ts/generated/viewModelClasses.ts" />
/// <reference path="../../ts/extendedViewModels/extendedViewModels.ts" />
/// <reference path="../../ts/extendedViewModels/loan.extendedViewModel.ts" />
/// <reference path="../../ts/extendedViewModels/property.extendedViewModel.ts" />
/// <reference path="../../ts/extendedViewModels/transactionInfo.ts" />
/// <reference path="../../ts/lib/referenceWrapper.ts" />
/// <reference path="../../ts/lib/common.util.ts" />
/// <reference path="../../ts/lib/IdentityGenerator.ts" />
var credit;
(function (credit) {
    var ProductDetailsController = (function () {
        function ProductDetailsController($modalInstance, selectedProduct) {
            var _this = this;
            this.$modalInstance = $modalInstance;
            this.selectedProduct = selectedProduct;
            this.cancel = function () {
                _this.$modalInstance.dismiss('cancel');
            };
        }
        ProductDetailsController.$inject = ['$modalInstance', 'selectedProduct'];
        return ProductDetailsController;
    })();
    angular.module('consumersite').controller('productDetailsController', ProductDetailsController);
})(credit || (credit = {}));
//# sourceMappingURL=productDetails.controller.js.map