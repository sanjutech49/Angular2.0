/// <reference path="../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../scripts/typings/angular-ui-bootstrap/angular-ui-bootstrap.d.ts" />

module common {

    export class ModalDismissBaseController {

        constructor(protected $modalInstance: angular.ui.bootstrap.IModalServiceInstance) {
        }

        ok = () => {
            this.$modalInstance.dismiss('cancel');
        };
    }
}

moduleRegistration.registerController(moduleNames.controllers, common.ModalDismissBaseController);