module loanDetails {
    'use strict';

    class lockConfirmationController {


        static className = 'lockConfirmationController';
        static $inject = ['model', '$modalInstance', '$modalStack', '$filter', 'callbackYes'];

        private lockExpDate;
        private lockDate;

        constructor(public model, private $modalInstance: angular.ui.bootstrap.IModalServiceInstance, private $modalStack, private $filter, private callbackYes ) {
            this.lockDate = moment();
            this.lockExpDate = moment().add(model.lockPeriod, "days");
        }

        public onYesClicked = () => {
            this.callbackYes(true, this.lockDate, this.lockExpDate, this.model.productId);
        }

        public onNoClicked = () => {
            this.$modalStack.dismissAll('close');
        }

        public get LockExpDate() {
            return moment(this.lockExpDate).format("MM/DD/YY");
        }
    }
    angular.module('loanDetails').controller('lockConfirmationController', lockConfirmationController);
} 