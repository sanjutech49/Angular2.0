module loanCenter {
    'use strict';

    export class complianceCheckPassedPopupController {

        static className = 'complianceCheckPassedPopupController';
        static $inject = ['model', '$modalStack', 'callBackSaveAndRequestDisclosure','checkSaveDiscloseActionsCallback'];

        constructor(public model, private $modalStack, private callBackSaveAndRequestDisclosure, private checkSaveDiscloseActionsCallback) {
        }

        public done = (): void => {
            this.callBackSaveAndRequestDisclosure()
            this.cancel();
        }

        public cancel = (): void => {
            this.$modalStack.dismissAll('close');
            this.checkSaveDiscloseActionsCallback();
        }
    }

    angular.module('loanCenter').controller(complianceCheckPassedPopupController.className, complianceCheckPassedPopupController);
} 