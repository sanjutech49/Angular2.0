(function () {
    'use strict';
    angular.module('queue')
        .provider('queueResolver', queueResolver);

    /**
    * Resolves a client side model containing flags and properties specific to the client side only.
    */
    function queueResolver() {

        this.$get = function () {
            return resolver;
        };

        function resolver(queueSvc, $stateParams, blockUI, userAccount, enums) {
            blockUI.start('Loading list...');
            var result = {};
            if (userAccount.hasPrivilege(enums.privileges.ViewStandardList) && !$stateParams.queue) {
                setStateParams(enums.myListQueue.openLoans, 'My Pipeline');
            }//set Order Requested queue as default one for HVM users
            else if (userAccount.hasPrivilege(enums.privileges.ViewAppraisalLists) && !$stateParams.queue) {
                setStateParams(enums.myListQueue.orderRequested, 'Order Requested');
            }

            result = queueSvc.queue().get({ currentUserId: userAccount.userAccountId, queue: $stateParams.queue }).$promise.then(function (data) {

                var i;
                for (i = 0; i < data.list.length; i++) {
                    data.list[i].number = i + 1;
                }
                blockUI.stop();
                return data;
            },
            function (error) {
                blockUI.stop();
                return { list: [], error: true };
            });

            function setStateParams(queue, name) {
                $stateParams.queue = queue;
                $stateParams.queueTitle = name;
            }

            return result;
        };

        

    }
})();


