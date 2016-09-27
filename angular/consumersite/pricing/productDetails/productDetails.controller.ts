/// <reference path="../../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../../Scripts/typings/underscore/underscore.d.ts" />

module consumersite {

    export class ProductDetailsController {

        public controllerAsName: string = "productDetailsCtrl";
        static className = "productDetailsController";

        public static $inject = [];

        constructor(private $modalInstance: angular.ui.bootstrap.IModalServiceInstance, public selectedProduct) {

        }

        close = () => {

            this.$modalInstance.dismiss('cancel');
        }

    }
    moduleRegistration.registerController(consumersite.moduleName, ProductDetailsController);
} 