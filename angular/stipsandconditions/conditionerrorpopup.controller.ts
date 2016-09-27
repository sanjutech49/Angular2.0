/// <reference path="../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../scripts/typings/angular-ui-bootstrap/angular-ui-bootstrap.d.ts" />
/// <reference path="ModalDismissBaseController.ts" />

module loanCenter {

    class ErrorPopupViewModel {
        constructor(public errorHeader:  String  = '', public errorMessage: String  = '') { }
    }

    export class ModalErrorPopupController {
        constructor(public errorPopup: angular.ui.bootstrap.IModalServiceInstance, protected CurativeErrorPopupViewModel: ErrorPopupViewModel) { }

        public okay = () => {
            this.errorPopup.close();
        }

        public cancel = () => {
            this.errorPopup.close();
        }
    }

    export class ConditionErrorPopupController {

        protected errorPopupModal: angular.ui.bootstrap.IModalServiceInstance;

        static className = "ConditionErrorPopupController";

        static $inject = ['$modal'];

        constructor(private $modal: angular.ui.bootstrap.IModalService) { }

        showErrorPopUp = (header, message) => {
            this.errorPopupModal = this.$modal.open({
                templateUrl: 'angular/stipsandconditions/errorPopup.html',
                backdrop: 'static',
                controller: () => {
                    var ErrorPopup = new ErrorPopupViewModel(header, message);
                    return new ModalErrorPopupController(this.errorPopupModal, ErrorPopup);
                },
                controllerAs: 'ErrorPopupCtrl',
            });
        }
    }

    angular.module('stipsandconditions').controller('ConditionErrorPopupController', ConditionErrorPopupController);
}

//@Todo:  Need to properly register
//moduleRegistration.registerController(moduleNames.loanCenter, loanCenter.ConditionItemNotesController);
