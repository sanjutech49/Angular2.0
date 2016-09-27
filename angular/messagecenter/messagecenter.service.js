(function () {
    'use strict';
    angular.module('messagecenter').factory('messagecenterSvc', messagecenterSvc);

    messagecenterSvc.$inject = ['$resource', 'apiRoot'];
    function messagecenterSvc($resource, ApiRoot) {

        var messagecenterApiPath = ApiRoot + 'MessageCenter/';

        var MessageCenterServices = $resource(messagecenterApiPath + ':path', { path: '@path' }, 
        {
            GetData: { method: 'GET', params: { loanId: 'loanId', userAccountId: 'userAccountId'}},					
            SubmitData: { method: 'POST', params: { loanId: 'loanId', userAccountId: 'userAccountId' }}
        });

        var messagecenterService =
        {
            MessageCenterServices: MessageCenterServices
        };

        return messagecenterService;
    };
})();
