module loanCenter {
    'use strict';

    export class testModeProductPopupController {

        static className = 'testModeProductPopupController';
        static $inject = ['model', '$modalStack', 'callBackSaveAndRequestDisclosure', 'callBackShowDisclosureLockModal'];

        constructor(public model, private $modalStack, private callBackSaveAndRequestDisclosure, private callBackShowDisclosureLockModal, public productId: string) {
            if (this.model.productId) {
                this.productId = this.model.productId;
            }
        }

        public done = (): void => {
            this.cancel();
            if (!this.model.isLock) {
                this.callBackSaveAndRequestDisclosure(null, null, null, this.productId);
            }
            else {
                this.callBackShowDisclosureLockModal(this.productId);
            }
        }

        public cancel = (): void => {
            this.$modalStack.dismissAll('close');
        }
    }
    angular.module('loanCenter').controller('testModeProductPopupController', testModeProductPopupController);
} 