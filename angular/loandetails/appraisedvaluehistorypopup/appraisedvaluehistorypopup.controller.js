(function () {
    'use strict';
    angular.module('loanDetails')
        .controller('appraisedValueHistoryController', appraisedValueHistoryController);

    function appraisedValueHistoryController($log, modalPopoverFactory, appraisedValueHistoryPopupSvc) {

        var vm = this;
       
        vm.appraisedValueHistoryPopupViewModel = {};
        vm.init = init;
     
        function init(loanId) {
            appraisedValueHistoryPopupSvc.GetAppraisedValueHistoryPopupData.GetAppraisedValueHistoryPopupData({ loanId:loanId}).$promise.then(
                function (data) {
                   
                    vm.appraisedValueHistoryPopupViewModel = data;
                    ShowAppraisedHistoryPopup();
                },
                function (error) {
                    $log.error('Failure loading Appraised Value History Popup data', error);
                });
        };

        function ShowAppraisedHistoryPopup() {

            var ctrl = {
                AppraisedValueHistories: vm.appraisedValueHistoryPopupViewModel.AppraisedValueHistories,
               
            };
            var _apprHistoryPopup = modalPopoverFactory.openModalPopover('angular/loandetails/appraisedvaluehistorypopup/appraisedvaluehistorypopup.html', ctrl, vm.appraisedValueHistoryPopupViewModel, vm.event);

            _apprHistoryPopup.result.then(function (data) {
            });
        }
    };

})();

