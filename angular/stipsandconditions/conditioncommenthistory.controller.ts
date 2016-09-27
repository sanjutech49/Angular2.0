/// <reference path="../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../scripts/typings/angular-ui-bootstrap/angular-ui-bootstrap.d.ts" />
/// <reference path="ModalDismissBaseController.ts" />
/// <reference path=".././ts/generated/viewModels.ts" />
/// <reference path="../ts/global/global.ts" />
/// <reference path="../loancenter/loancenter.app.ts" />

module loanCenter {

    export class ConditionCommentHistoryModalController {

        static className = 'ConditionCommentHistoryController';

        constructor(protected historyModal: angular.ui.bootstrap.IModalServiceInstance, private ConditionCommentHistoryViewModel, private Description, private Code) { }

        public ok = () => {
            this.historyModal.close();
        }
    }

    export class ConditionCommentHistoryController {

        protected historyModal: angular.ui.bootstrap.IModalServiceInstance;

        static className = 'ItemHistoryController';
        static $inject = ['$modal'];

        constructor(protected $modal) { }

        public openCommentHistoryPopUp = (condition) => {
            

            //TODO:  Need to refactor this as a service.  This is artifact from S&C version 2.0
            $.getJSON('http://localhost:52037/api/Conditions/GetConditionHistoryItems?conditionId=' + condition.conditionId,(data) => {
                this.historyModal = this.$modal.open({
                    templateUrl: 'angular/stipsandconditions/conditioncommenthistory.html',
                    controller: () => {
                        return new ConditionCommentHistoryModalController(this.historyModal, data, condition.configurationViewModelCode.title, condition.configurationViewModelCode.code);
                    },
                    controllerAs: 'ConCommentHistoryModalCtrl',
                    backdrop: 'static'
                });
            });
        };
    }

    angular.module('stipsandconditions').controller('ConditionCommentHistoryController', ConditionCommentHistoryController);
}
// TODO:  Register Controlers with registration module when it becomes available.
//moduleRegistration.registerController(moduleNames.loanCenter, loanCenter.ConditionCommentHistoryController);



