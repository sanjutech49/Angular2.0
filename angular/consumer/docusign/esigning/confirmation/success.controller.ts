/// <reference path="../../../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../../../scripts/typings/angular-ui-bootstrap/angular-ui-bootstrap.d.ts" />

module docusign {

    class SuccessViewModel {
        constructor() { }
    }

    export class ModalSuccessController {
        constructor(public eConsent: angular.ui.bootstrap.IModalServiceInstance, protected CurativeEConsentViewModel: SuccessViewModel) { }

        public continue = () => {
            this.eConsent.close();
        }
    }

    export class SuccessController {

        protected successModal: angular.ui.bootstrap.IModalServiceInstance;

        static className = "SuccessController";

        static $inject = ['$modal'];

        constructor(private $modal: angular.ui.bootstrap.IModalService) {
        }

        openSuccessPopUp = (inputTemplateURL) => {
            this.successModal = this.$modal.open({
                templateUrl: inputTemplateURL,
                backdrop: 'static',
                controller: () => {
                    var EConsent = new SuccessViewModel();
                    return new ModalSuccessController(this.successModal, EConsent);
                },
                controllerAs: 'ModalSuccessCtrl'
            });
        };
    }

    angular.module('docusign').controller('SuccessController', SuccessController);
}