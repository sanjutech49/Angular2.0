module loanCenter {
    'use strict';

    export class complianceCheckFailedPopupController {

        static className = 'complianceCheckFailedPopupController';
        static $inject = ['model', '$modalStack', 'callbackOpenDocument','checkSaveDiscloseActionsCallback'];

        constructor(public model, private $modalStack, private callbackOpenDocument, private checkSaveDiscloseActionsCallback, public errorList) {
            if (this.model.errorList) {
                this.errorList = this.model.errorList;
            }
        }

        public done = (): void => {
            this.callbackOpenDocument(this.model.documentRepositoryId, true, true);
            this.cancel();
        }

        public cancel = (): void => {
            this.$modalStack.dismissAll('close');
            this.checkSaveDiscloseActionsCallback();
        }

        public getComplianceCheckErrorText = (errorId): string => {
            var complanceError = lib.findFirst(this.model.complaianceCheckErrors, item => item.value == errorId, null)
            if (complanceError) {
                return complanceError.text;
            }
            return "";
        }
    }

    angular.module('loanCenter').controller(complianceCheckFailedPopupController.className, complianceCheckFailedPopupController);
} 