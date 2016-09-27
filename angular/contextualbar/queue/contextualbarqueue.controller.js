(function () {
    'use strict';

    angular.module('contextualBar').controller('ContextualBarQueueCtrl', ContextualBarQueueCtrl);

    ContextualBarQueueCtrl.$inject = ['$scope', '$state', 'BroadcastSvc', 'applicationData', '$stateParams', '$modal', 'importFnmSvc', 'columnOptionsFactory'];

    function ContextualBarQueueCtrl($scope, $state, BroadcastSvc, applicationData, $stateParams, $modal, importFnmSvc, columnOptionsFactory) {
        var vm = this;
        vm.applicationData = applicationData;
        vm.isUserWholesale = isUserWholesale();
        vm.createNewLoanApplication = createNewLoanApplication;
        vm.openColumnOptionsModalWindow = openColumnOptionsModalWindow;
        vm.refreshQueue = refreshQueue;
        vm.clearAllFilters = clearAllFilters;
        vm.totalNumberOfRecords = null;

        vm.branchId;
        vm.loadOptions = [];

        $scope.$on("QueueSizeChanged", function (event, args) {
            vm.totalNumberOfRecords = args;
        });

        vm.selectedQueue = $stateParams.queueTitle;

        function createNewLoanApplication() {
            importFnmSvc.openImportLoanModal(applicationData, false);
        }

        function isUserWholesale() {
            var user = _.find(applicationData.companyProfile.channels, function (channel) {
                return channel.channelId == applicationData.currentUser.channelId;
            });
            if (user) {
                return !!user.isWholesale;
            }
            else return false;
        }

        function clearAllFilters()
        {
            BroadcastSvc.broadcastClearAllFilter();
        }

        function refreshQueue()
        {
            BroadcastSvc.broadcastRefreshQueue();  
        }

        function openColumnOptionsModalWindow() {
            var index = -1;
            for (var i = 0; i < vm.applicationData.queueColumns.length; i++)
            {
                if (vm.applicationData.queueColumns[i].queue == $stateParams.queue)
                {
                    index = i;
                }
            }
            if (index != -1)
            {
                columnOptionsFactory.open({
                    modalTitle: "Column Options",
                    availableColumnsTitle: "Available Columns",
                    selectedColumnsTitle: "Selected Columns",
                    availableColumns: applicationData.allQueueColumns,
                    selectedColumns: applicationData.queueColumns[index].columns,
                    update: function (selectedColumns) {
                        applicationData.queueColumns[index].columns = selectedColumns;
                        BroadcastSvc.broadcastRefreshGridColumns();
                    }
                });
            }
            else
            {
                console.log("Queue not selected!")
            }
        }

    }
})();