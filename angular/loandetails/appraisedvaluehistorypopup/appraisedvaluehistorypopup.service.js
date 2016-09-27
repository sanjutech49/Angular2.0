(function () {
    'use strict';

    angular.module('loanDetails')

    .factory('appraisedValueHistoryPopupSvc', appraisedValueHistoryPopupSvc);

    appraisedValueHistoryPopupSvc.$inject = ['$resource', 'apiRoot'];

    function appraisedValueHistoryPopupSvc($resource, ApiRoot) {
        var appraisedValueHistoryPopupPath = ApiRoot + 'AppraisedHistoryPopup/';

        var GetAppraisedValueHistoryPopupData = $resource(appraisedValueHistoryPopupPath, {}, {
            GetAppraisedValueHistoryPopupData: { method: 'GET', params: { loanId: 'loanId' } }
        });


        var appraisedValueHistoryPopupService =
           {
               GetAppraisedValueHistoryPopupData: GetAppraisedValueHistoryPopupData,               
           }

        return appraisedValueHistoryPopupService;
    };

})();