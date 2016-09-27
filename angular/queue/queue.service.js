(function () {
    'use strict';

    angular.module('queue')

    .factory('queueSvc', queueSvc);

    queueSvc.$inject = ['$resource', 'apiRoot'];

    function queueSvc($resource, apiRoot) {
        var queueApiPath = apiRoot + 'queue/';
        var dates = 
            [
                'dateModified', 
                'dateCreated', 
                'creditExpirationDate', 
                'loanApplicationDate', 
                'lockExpireDate',
                'closingDate',
                'disclosureDate',
                'eConsentDate',
                'itpDate',
                'appraisalRequestedDate',
                'appraisalInspectionDate',
                'appraisalExpectedDeliveryDate',
                'appraisalOrderStatusDate',
                'appraisalOrderedDate',
                'appraisalDeliveredDate',
                'disclosureDueDate',
                'adverseReasonDate'
            ]
        function queue() {
            return $resource(queueApiPath, {}, 
                {
                    'get': { method: 'GET', transformResponse : transformResponse }
                });
        }

        function transformResponse(data) {            
            var result = JSON.parse(data, transformDate);           
            return result;            
        };

        function transformDate(key, value) {
            if (dates.indexOf(key) > -1 && value)
                return new moment(value);
            else
                return value;
        }

        var queueService =
           {
               queue: queue
           }

        return queueService;
    };

})();