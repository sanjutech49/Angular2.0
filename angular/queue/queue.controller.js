(function () {
    'use strict';
    angular.module('queue')
        .controller('queueController', queueController);

    queueController.$inject = ['$window', '$log', '$scope', '$rootScope', '$state', '$stateParams', 'queueSvc', 'NavigationSvc', 'modalPopoverFactory', 'BroadcastSvc', 'enums', 'controllerData', 'applicationData', 'commonModalWindowFactory', 'modalWindowType', '$timeout', 'blockUI'];

    function queueController($window, $log, $scope, $rootScope, $state, $stateParams, queueSvc, NavigationSvc, modalPopoverFactory, BroadcastSvc, enums, controllerData, applicationData, commonModalWindowFactory, modalWindowType, $timeout, blockUI) {

        $rootScope.navigation = 'Queue';

        var vm = this;

        vm.recordItems = [{ name: '250 Records', value: 250 }, { name: '500 Records', value: 500 }, { name: '1000 Records', value: 1000 }, { name: 'All Records', value: 100000 }];

        vm.displaySizeItem = 1;

        vm.filterNumberOfRecordsInTheGrid = filterNumberOfRecordsInTheGrid;
        vm.onGridSizeChange = onGridSizeChange;

        vm.applicationData = applicationData; 

        vm.queueItems = controllerData.list;

        vm.openMultiBorrowerModal = openMultiBorrowerModal;

        var _searchCounter = 0;
        var _searchCounterLastReceived = 0;
        var _filterTextTimeout;
        var _tempfilterValue = {};
        var _filterValue = {};
        vm.showGridLoader = false;
        
        NavigationSvc.contextualType = enums.ContextualTypes.Queue;

        vm.gridData = [];
        filterNumberOfRecordsInTheGrid(vm.recordItems[0], false); // populates gridData as first N records (N=100 by default). There is no need to refresh the grid on initialization.

        (function () {
            BroadcastSvc.broadcastQueueSizeChanged(vm.queueItems.length);

            if (vm.queueItems.length == 0 && controllerData.error) {
                commonModalWindowFactory.open({ type: modalWindowType.error, message: 'We are unable to retrieve loans for this queue at the moment. Please try again later.' });
            }
            else if (vm.queueItems.length == 0 && !controllerData.error) {
                commonModalWindowFactory.open({ type: modalWindowType.error, message: 'There are no any loans in this queue at the moment.' });
            }
        })();
        
        var queueColumnDefs = createColumnDefs($stateParams.queue);

        $scope.gridOptions = {           
            columnDefs: queueColumnDefs,
            rowSelection: 'single',
            enableSorting: true,
            rowData: vm.gridData,
            rowSelected: rowSelected,
            enableFilter: true,
            enableColResize: true,
            dontUseScrolls: false,
            angularCompileFilters: true,
            angularCompileRows: true,
            icons:
                {
                    menu: '<i class="ag-filter-icon"/>',
                    sortAscending: '<i/>',
                    sortDescending: '<i/>',
                    filter: '<i/>'
                }
        };

        angular.element($window).bind('resize', function () {
            $scope.$digest();
        });

        $scope.$on("BroadcastRefreshGridColumns", function (event)
        {
            $scope.gridOptions.columnDefs = createColumnDefs($stateParams.queue, applicationData);
            $scope.gridOptions.api.onNewCols();
        });

        $scope.$on("BroadcastClearAllFilter", function (event) {
            //Clear Filters
            vm.loanNumberFilter = "";
            vm.borrowerNameFilter = "";
            $state.go('loanCenter.queue', { 'queue': $stateParams.queue, 'queueTitle': $stateParams.queueTitle }, { reload: true }); 
        });

        $scope.$on("BroadcastRefreshQueue", function (event) {
            getFilteredData();
        });

        function getFilteredData()
        {
            if (_filterTextTimeout) {
                $timeout.cancel(_filterTextTimeout);
            }

            _tempfilterValue.loanNumberFilter = vm.loanNumberFilter ? vm.loanNumberFilter : "";
            _tempfilterValue.borrowerNameFilter = vm.borrowerNameFilter ? vm.borrowerNameFilter : "";
            _tempfilterValue.counter = _searchCounter;

            _filterTextTimeout = $timeout(function () {

                _searchCounter = _searchCounter + 1;
                _filterValue = _tempfilterValue;
                console.log(" SENT _filterValue ", _filterValue);
                // Call server
                vm.showGridLoader = true;
                queueSvc.queue().get({
                    currentUserId: applicationData.currentUserId, queue: $stateParams.queue,
                    loanNumberFilter: _filterValue.loanNumberFilter, borrowerNameFilter: _filterValue.borrowerNameFilter,
                    counter: _filterValue.counter
                }).$promise.then(function (data) {
                   
                    if (data.searchCounter >= _searchCounterLastReceived) {
                        _searchCounterLastReceived = data.searchCounter;

                        var i;
                        for (i = 0; i < data.list.length; i++) {
                            data.list[i].number = i + 1;
                        }

                        createNewDatasource(data.list);                        

                        BroadcastSvc.broadcastQueueSizeChanged(data.list.length);
                        console.log("REC data.SearchCounter " + data.searchCounter + " - Applied");
                    }
                    else {
                        console.log("REC data.SearchCounter "+  data.searchCounter + " - Ignored");
                    }
                    vm.showGridLoader = false;                                  
                },
                function (error) {                           
                    console.log("Error: Unable to retrieve filtered data!")
                    vm.showGridLoader = false;                  
                });                

            }, 300); // delay 300 ms   

        }

        function createNewDatasource(filteredData) {

            var dataSource = {
                getRows: function (params) {
                    params.successCallback(filteredData, filteredData.length);                    
                }
            };

            $scope.gridOptions.api.setDatasource(dataSource);
        }
        
        function BorrowerNameFilter() {
        }

        BorrowerNameFilter.prototype.init = function (params) {
            this.$scope = params.$scope;
            this.$scope.onFilterChanged = function (borrowerNameFilter) {
                vm.borrowerNameFilter = borrowerNameFilter;
                getFilteredData();
                params.filterChangedCallback();
            };
            this.valueGetter = params.valueGetter;
        };

        BorrowerNameFilter.prototype.getGui = function () {
            return '<div style="width: 170px;">' +
                '<div style="font-weight: bold; padding: 4px;">Borrower Name Search</div>' +
                '<div style="font-weight: bold; border-top: 1px solid #9D9D9D; width:100%; height:1px;">&nbsp</div>' +
                '<div><input style="margin: 4px 0px 4px 4px; width: 151px" type="text" ng-model="borrowerNameFilter" ng-change="onFilterChanged(borrowerNameFilter)" placeholder="Search..."/></div>' +
                '</div>';
        };

        BorrowerNameFilter.prototype.doesFilterPass = function (params) {           
            return true;
        };

        BorrowerNameFilter.prototype.isFilterActive = function () {
            var value = this.$scope.borrowerNameFilter;
            return value !== null && value !== undefined && value !== '';
        };

        function LoanFilter() {
        }

        LoanFilter.prototype.init = function (params) {
            this.$scope = params.$scope;
            this.$scope.onFilterChanged = function (loanNumberFilter) {
                vm.loanNumberFilter = loanNumberFilter;
                getFilteredData();
                params.filterChangedCallback();
            };
            this.valueGetter = params.valueGetter;
        };        

        LoanFilter.prototype.getGui = function () {
            return '<div style="width: 170px;">' +
                '<div style="font-weight: bold; padding: 4px;">Loan Number Search</div>' +
                '<div style="font-weight: bold; border-top: 1px solid #9D9D9D; width:100%; height:1px;">&nbsp</div>' +
                '<div><input style="margin: 4px 0px 4px 4px; width: 151px;" type="text" ng-model="loanNumberFilter" ng-change="onFilterChanged(loanNumberFilter)" placeholder="Search..."/></div>' +
                '</div>';
        };
     
        LoanFilter.prototype.doesFilterPass = function (params) {           
            return true;
        };

        LoanFilter.prototype.isFilterActive = function () {
            var value = this.$scope.loanNumberFilter;
            return value !== null && value !== undefined && value !== '';
        };

        function rowSelected(row) {
            //$rootScope.SelectedLoan.LoanId = row.loanId;
            if (angular.element(document.getElementById('divMainNavBar')).scope() != undefined)
                angular.element(document.getElementById('divMainNavBar')).scope().prepareLoanOnRowSelect(row.loanId);
        };        

        function displayNameCellRenderer(params) {
           
            if (!params.data.borrowerFirstName && !params.data.borrowerLastName)
                return null;
            else if (!params.data.borrowerFirstName && params.data.borrowerLastName)
                return params.data.borrowerLastName;
            else if (params.data.borrowerFirstName && !params.data.borrowerLastName)
                return null;
            else
            {
                 params.api.rowRenderer.$scope.openMultiBorrowerModal = vm.openMultiBorrowerModal;

                 var retVal =
                    '<div class="borrower-names" style="text-overflow: ellipsis; overflow: hidden;">' +
                    '<span ng-click="openMultiBorrowerModal(data.borrowerNames, $event)" ng-show="' + params.data.isMultiBorrowerLoan + '" class="imp-multiborrower-icon"></span>' +
                    '<span style="text-align: left;" >';

                if ($stateParams.queue == 4 && (params.data.conciergeFullName == "" || params.data.conciergeFullName == null || params.data.conciergeFullName == "Pending"))
                    retVal += '<b>' + params.data.borrowerLastName + '</b>';
                else
                    retVal += params.data.borrowerLastName;

                return retVal += '<span style="color: #9d9d9d">, ' + params.data.borrowerFirstName + '</span></span></div>';
            }
        }
                
        function loanStatusCellRenderer(params) {
            if (params.data.isMilestoneStatusManual)
                return '<div style="font-style:italic">' + params.data.milestoneStatus + '</div>';
            return params.data.milestoneStatus

        }       

        function openMultiBorrowerModal(borrowerNames, event) {
            modalPopoverFactory.openModalPopover('angular/queue/other/multiBorrowerModal.html', {}, borrowerNames, event);
        };

        function onGridSizeChange(item) {
            vm.displaySizeItem = item;
            var grid = document.getElementById("angularGrid");

            //Workspace
            if (vm.displaySizeItem.value == 1) {
                if (grid) {
                    grid.style.width = "1300px";
                }
            }
            //Fill Page
            else {
                if (grid) {
                    grid.style.width = "1500px";
                }
            }

        }

        function cellClickedHandler(row) {

            var loanId = row.data.loanId;

            if (row.data.parentLoanId)
                loanId = row.data.parentLoanId;

            if (angular.element(document.getElementById('divMainNavBar')).scope() != undefined)
                angular.element(document.getElementById('divMainNavBar')).scope().updateValuesOnRowChangeNEW(loanId);

            if (!(isNaN(parseFloat(row.data.loanNumber)))) {
                if (applicationData.currentUser.hasPrivilege(enums.privileges.ViewStandardList)) {
                    $state.go('loanCenter.loan.loanDetails.sections', { 'loanId': loanId }, { reload: true });
                }
                else if (applicationData.currentUser.hasPrivilege(enums.privileges.ViewAppraisalLists)) {
                    $state.go('loanCenter.loan.appraisal', { 'loanId': loanId }, { reload: true });
                }
                else {
                    //TODO: Handle else
                }
            }
            else {
                $state.go('loanCenter.loan.loanApplication.personal', { 'loanId': loanId }, { reload: true });
            }

        };

        function dueDateClickedHandler(row) {

            if (angular.element(document.getElementById('divMainNavBar')).scope() != undefined)
                angular.element(document.getElementById('divMainNavBar')).scope().updateValuesOnRowChangeNEW(row.data.parentLoanId);

            if ($state.params.queue == enums.myListQueue.mailRoom) {
                $state.go('loanCenter.workbench.mailroom', { 'loanId': row.data.loanId, 'parentLoanId': row.data.parentLoanId, 'disclosureDueDate': row.data.disclosureDueDate._i }, { reload: true });
            }
            else
                $state.go('loanCenter.loan.documents.docvault', { 'loanId': row.data.loanId }, { reload: true });

        };

        function dateComparator(date1, date2) {
            return (date1 == date2 ? 0 : (date1 > date2 ? 1 : -1));
        };

        function dateRenderer(params) {
            return params.data[params.colDef.field] ? params.data[params.colDef.field].format('MM/DD/YY') : null;
        };

        function dateTimeRenderer(params) {
            return params.data[params.colDef.field] ? params.data[params.colDef.field].format('MM/DD/YY hh:mm a') : null;
        };

        function currencyRenderer(params) {
            return params.data[params.colDef.field] ? params.data[params.colDef.field].toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") : null;
        };

        function threeDecimalRenderer(params) {
            return params.data[params.colDef.field] ? params.data[params.colDef.field].toFixed(3) : null;
        };

        function filterNumberOfRecordsInTheGrid(item, refreshGrid) {


            vm.displayRecordItem = item;

            var numberOfRecordsToDisplay = vm.queueItems.length;
            if (vm.displayRecordItem.value < numberOfRecordsToDisplay) {
                numberOfRecordsToDisplay = vm.displayRecordItem.value;
            }

            vm.gridData.splice(0, vm.gridData.length);
            var i;
            for (i = 0; i < numberOfRecordsToDisplay; i++) {
                vm.gridData.push(vm.queueItems[i]);
            }

            if (refreshGrid && $scope.gridOptions != undefined)
                $scope.gridOptions.api.onNewRows();
        };

        function createColumnDefs(queue) {
            //If there is no column definitions for selected queue in application data add them
            addColumnsToApplicationDataIfNotExists(queue);

            var colDefs = bindQueueColumnDefs(queue);

            return colDefs;

        }

        function addColumnsToApplicationDataIfNotExists(queue) {

            if (!applicationData.allQueueColumns) {
                applicationData.allQueueColumns = getAllQueueColumns();
            }

            if (!applicationData.queueColumns) {
                applicationData.queueColumns = [];
            }

            var inApplicationData;
            angular.forEach(applicationData.queueColumns, function (columns) {
                if (columns.queue == queue)
                    inApplicationData = true;
            });

            if (!inApplicationData)
                applicationData.queueColumns.push(getColumnsForQueue(queue));
        }

        function bindQueueColumnDefs(queue) {

            var columnDefs = [];

            //Adding row number
            columnDefs.push({ headerName: "", field: "number", width: 40, icons: { menu: '<i/>' }, headerClass: 'ag-header-cell-without-style', suppressSorting: true });

            angular.forEach(applicationData.queueColumns, function (queueColumn) {

                if (queueColumn.queue == queue) {
                    angular.forEach(queueColumn.columns, function (column) {
                        columnDefs.push(getColumnDefs(column));
                    });
                }

            });

            return columnDefs;

        }

        function getAllQueueColumns() {

            var allAvailableQueuesColumns = ["Adverse Reason",
                                             "Adverse Reason Date",
                                             "Appraisal Age",
                                             "Appraisal Condition",
                                             "Appraisal Delivered Date",
                                             "Appraisal Expected Delivery Date",
                                             "Appraisal Inspection Date",
                                             "Appraisal Ordered Date",
                                             "Appraisal Order ID",
                                             "Appraisal Order Status Date",
                                             "Appraisal Requested Date",
                                             "Appraisal Rush",
                                             "Appraisal Status",
                                             "Appraised Value",
                                             "Borrower Activity",
                                             "Borrower Mailing Address",
                                             "Borrower Name",
                                             "Branch",
                                             "Channel",
                                             "Company",
                                             "Conforming/Non-Conforming",
                                             "Created Date",
                                             "Credit Expiration Date",
                                             "Decision Score",
                                             "Disclosure Date",
                                             "Disclosure Due Date",
                                             "Disclosure Status",
                                             "Doc Delivery",
                                             "Docs",
                                             "Division",
                                             "E-Consent Date",
                                             "Email",
                                             "Employment Status",
                                             "Est Closing Date",
                                             "Est Value",
                                             "Intent to Proceed Date",
                                             "Lead Status",
                                             "Loan #",
                                             "Loan Amt",
                                             "Loan Application Date",
                                             "Loan Officer",
                                             "Loan Program",
                                             "Purpose",
                                             "Loan Status",
                                             "Loan Type",
                                             "Lock Expiration Date",
                                             "Modified By",
                                             "Modified Date",
                                             "Occupancy",
                                             "PreApproval Letter",
                                             "Preferred Phone",
                                             "Property Type",
                                             "Purchase Amt",
                                             "Rate",
                                             "Seller Name",
                                             "Subject Address - State",
                                             "Subject Address - Street",
                                             "Term & Amort"]

            return allAvailableQueuesColumns;

        }

        function getColumnsForQueue(queue) {
            var columns;

            switch (queue) {
                //My Pipeline
                case enums.myListQueue.openLoans:
                    columns = ["Borrower Name", "Loan #", "Created Date", "Doc Delivery", "Purpose", "Loan Program", "Occupancy", "Loan Amt", "Rate", "Subject Address - Street",
                                "Subject Address - State", "Loan Application Date", "Disclosure Date", "E-Consent Date", "Intent to Proceed Date", "Lock Expiration Date", "Est Closing Date", "Loan Status", "Appraisal Status",
                                    "Borrower Activity", "Modified Date", "Loan Officer"]
                    break;
                case enums.myListQueue.closedLoans:
                    columns = ["Borrower Name", "Loan #", "Subject Address - Street", "Subject Address - State", "Loan Type", "Occupancy", "Property Type", "Est Value", "Loan Amt", "Term & Amort", "Rate", "Loan Officer", "Created Date", "Modified Date", "Credit Expiration Date", "Loan Program", "Appraised Value", "Decision Score", "Preferred Phone", "Email", "Employment Status", "Company", "Channel", "Division", "Branch"]
                    break;
                case enums.myListQueue.cancelledLoans:
                    columns = ["Borrower Name", "Loan #", "Subject Address - Street", "Subject Address - State", "Loan Type", "Occupancy", "Property Type", "Est Value", "Loan Amt", "Term & Amort", "Rate", "Loan Officer", "Created Date", "Modified Date", "Credit Expiration Date", "Loan Program", "Appraised Value", "Decision Score", "Preferred Phone", "Email", "Employment Status", "Company", "Channel", "Division", "Branch"]
                    break;
                case enums.myListQueue.prospects:
                    columns = ["Borrower Name", "Loan #", "Created Date", "Purpose", "Occupancy", "Loan Amt", "Subject Address - Street", "Subject Address - State", "Doc Delivery", "Loan Officer", "Loan Program", "Lead Status", "PreApproval Letter", "Modified Date", "Modified By", "Loan Type"]
                    break;
                case enums.myListQueue.unsubmitted:
                    columns = ["Borrower Name", "Loan #", "Created Date"]
                    break;
                case enums.myListQueue.registered:
                    columns = ["Borrower Name", "Loan #", "Created Date"]
                    break;
                case enums.myListQueue.submitted:
                    columns = ["Borrower Name", "Loan #", "Created Date"]
                    break;
                case enums.myListQueue.opening:
                    columns = ["Borrower Name", "Loan #", "Created Date"]
                    break;
                case enums.myListQueue.preApproval:
                    columns = ["Borrower Name", "Loan #", "Created Date", "Doc Delivery", "Purpose", "Loan Type", "Occupancy", "Loan Amt", "Subject Address - Street", "Subject Address - State", "Loan Program", "PreApproval Letter", "Modified Date", "Loan Officer"]
                    break;
                case enums.myListQueue.approved:
                    columns = ["Borrower Name", "Loan #", "Created Date"]
                    break;
                case enums.myListQueue.docsOut:
                    columns = ["Borrower Name", "Loan #", "Created Date"]
                    break;
                case enums.myListQueue.funding:
                    columns = ["Borrower Name", "Loan #", "Created Date"]
                    break;
                case enums.myListQueue.mailRoom:
                    columns = ["Borrower Name", "Loan #", "Borrower Mailing Address", "Disclosure Status", "Disclosure Due Date", "Loan Officer"]
                    break;
                case enums.myListQueue.pendingEConsent:
                    columns = ["Borrower Name", "Loan #", "Email", "Loan Application Date", "Loan Status", "Disclosure Due Date", "Doc Delivery",
                        "Disclosure Status", "Loan Program", "Loan Officer", "E-Consent Date"]
                    break;
                case enums.myListQueue.pendingDisclosures:
                    columns = ["Borrower Name", "Loan #", "Loan Application Date", "E-Consent Date", "Disclosure Due Date", "Disclosure Status", "Doc Delivery",
                         "Loan Program", "Subject Address - Street", "Subject Address - State", "Loan Status", "Loan Officer"]
                    break;
                case enums.myListQueue.orderRequested:
                    columns = ["Appraisal Order ID", "Borrower Name", "Loan #", "Loan Type", "Loan Amt", "Purchase Amt", "Est Value", "Seller Name", "Appraisal Rush",
                        "Loan Officer", "Appraisal Requested Date", "Appraisal Age"]
                    break;
                case enums.myListQueue.orderProcessed:
                    columns = ["Appraisal Order ID", "Borrower Name", "Loan #", "Purpose", "Loan Amt", "Purchase Amt", "Est Value", "Seller Name", "Conforming/Non-Conforming", "Appraisal Rush",
                        "Loan Officer", "Appraisal Requested Date", "Appraisal Ordered Date", "Appraisal Inspection Date",
                        "Appraisal Expected Delivery Date", "Appraisal Status", "Appraisal Order Status Date", "Appraisal Age"];
                    break;
                case enums.myListQueue.delivered:
                    columns = ["Appraisal Order ID", "Borrower Name", "Loan #", "Loan Type", "Loan Amt", "Purchase Amt", "Est Value", "Appraised Value", "Loan Officer", "Appraisal Ordered Date", "Appraisal Inspection Date", "Appraisal Delivered Date", "Appraisal Age", "Appraisal Rush"]
                    break;
                case enums.myListQueue.exceptions:
                    columns = ["Appraisal Order ID", "Borrower Name", "Loan #", "Loan Type", "Loan Amt", "Purchase Amt", "Est Value", "Appraised Value", "Appraisal Condition", "Loan Officer", "Appraisal Status", "Appraisal Order Status Date", "Appraisal Age", "Appraisal Rush"]
                    break;
                case enums.myListQueue.incomplete:
                    columns = ["Borrower Name", "Loan #", "Doc Delivery", "Loan Application Date", "Disclosure Due Date", "E-Consent Date", "Intent to Proceed Date", "Lock Expiration Date", "Appraisal Status", "Loan Officer"]
                    break;
                case enums.myListQueue.adverse:
                    columns = ["Borrower Name", "Loan #", "Loan Officer", "Loan Application Date", "E-Consent Date", "Adverse Reason", "Adverse Reason Date", "PreApproval Letter",
                        "Appraisal Status", "Purpose", "Subject Address - Street", "Subject Address - State"]
                    break;
                case enums.myListQueue.processing:
                    columns = ["Borrower Name", "Loan #", "Doc Delivery", "Loan Application Date", "E-Consent Date", "Intent to Proceed Date", "Lock Expiration Date", "Est Closing Date",
                             "Loan Type", "Purpose", "Loan Program", "Loan Officer", "Borrower Activity", "Docs"]
                    break;
                default:
                    columns = ["Borrower Name", "Loan #", "Created Date"]
                    console.log("ERROR: Unsupported myListQueue item!");            
            }

            return { queue: queue, columns: columns };
        }

        function getColumnDefs(column) {
            var colDefs;

            switch (column) {
                //#A              
                case "Adverse Reason":
                    colDefs = { headerName: "Adverse Reason", field: "adverseReason", width: 130, filterParams: { newRowsAction: 'keep' } }
                    break;
                case "Adverse Reason Date":
                    colDefs = {
                        headerName: "Adverse Reason Date", field: "adverseReasonDate", width: 180,
                        cellRenderer: dateRenderer,
                        valueGetter: dateRenderer,
                        comparator: dateComparator,
                        filter: 'set',
                        filterParams: { newRowsAction: 'keep' }
                    }
                    break;
                case "Appraisal Age":
                    colDefs = { headerName: "Age", field: "appraisalAge", width: 80, filterParams: { newRowsAction: 'keep' } }
                    break;
                case "Appraisal Condition":
                    colDefs = { headerName: "Appraisal Condition", field: "appraisalCondition", width: 140, filterParams: { newRowsAction: 'keep' } }
                    break;
                case "Appraisal Delivered Date":
                    colDefs = {
                        headerName: "Delivered Appraisal", field: "appraisalDeliveredDate", width: 170,
                        cellRenderer: dateRenderer,
                        valueGetter: dateRenderer,
                        comparator: dateComparator,
                        filter: 'set',
                        filterParams: { newRowsAction: 'keep' }
                    }
                    break;
                case "Appraisal Expected Delivery Date":
                    colDefs = {
                        headerName: "Expected Delivery", field: "appraisalExpectedDeliveryDate", width: 130,
                        cellRenderer: dateRenderer,
                        valueGetter: dateRenderer,
                        comparator: dateComparator,
                        filter: 'set',
                        filterParams: { newRowsAction: 'keep' }
                    }
                    break;
                case "Appraisal Inspection Date":
                    colDefs = {
                        headerName: "Inspection", field: "appraisalInspectionDate", width: 90,
                        cellRenderer: dateRenderer,
                        valueGetter: dateRenderer,
                        comparator: dateComparator,
                        filter: 'set',
                        filterParams: { newRowsAction: 'keep' }
                    }
                    break;
                case "Appraisal Order ID":
                    colDefs = { headerName: "Order ID", field: "appraisalOrderId", width: 100, filterParams: { newRowsAction: 'keep' } }
                    break;
                case "Appraisal Ordered Date":
                    colDefs = {
                        headerName: "Ordered Appraisal", field: "appraisalOrderedDate", width: 170,
                        cellRenderer: dateRenderer,
                        valueGetter: dateRenderer,
                        comparator: dateComparator,
                        filter: 'set',
                        filterParams: { newRowsAction: 'keep' }
                    }
                    break;
                case "Appraisal Order Status Date":
                    colDefs = {
                        headerName: "Order Status Date", field: "appraisalOrderStatusDate", width: 130,
                        cellRenderer: dateRenderer,
                        valueGetter: dateRenderer,
                        comparator: dateComparator,
                        filter: 'set',
                        filterParams: { newRowsAction: 'keep' }
                    }
                    break;
                case "Appraisal Requested Date":
                    colDefs = {
                        headerName: "Requested Appraisal", field: "appraisalRequestedDate", width: 150,
                        cellRenderer: dateRenderer,
                        valueGetter: dateRenderer,
                        comparator: dateComparator,
                        filter: 'set',
                        filterParams: { newRowsAction: 'keep' }
                    }
                    break;
                case "Appraisal Rush":
                    colDefs = { headerName: "Rush", field: "appraisalRush", width: 130, filterParams: { newRowsAction: 'keep' } }
                    break;
                case "Appraisal Status":
                    colDefs = { headerName: "Order Status", field: "appraisalStatus", width: 130, filterParams: { newRowsAction: 'keep' } }
                    break;
                case "Appraised Value":
                    colDefs = { headerName: "Appraised Value", field: "appraisedValue", width: 90, cellRenderer: currencyRenderer, valueGetter: currencyRenderer, filterParams: { newRowsAction: 'keep' } }
                    break;
                    //#B
                case "Branch":
                    colDefs = { headerName: "Branch", field: "branch", width: 130, filterParams: { newRowsAction: 'keep' } }
                    break;
                case "Borrower Activity":
                    colDefs = { headerName: "Borrower Activity", field: "borrowerActivity", width: 130, filterParams: { newRowsAction: 'keep' } }
                    break;
                case "Borrower Mailing Address":
                    colDefs = { headerName: "Mailing Address", field: "borrowerMailingAddress", width: 210, filterParams: { newRowsAction: 'keep' } }
                    break;
                case "Borrower Name":
                    colDefs = { headerName: "Borrower Name", width: 150, cellRenderer: displayNameCellRenderer, valueGetter: displayNameCellRenderer, filter: BorrowerNameFilter, filterParams: { newRowsAction: 'keep' } }
                    break
                    //#C
                case "Channel":
                    colDefs = { headerName: "Channel", field: "channel", width: 130, filterParams: { newRowsAction: 'keep' } }
                    break;
                case "Company":
                    colDefs = { headerName: "Company", field: "company", width: 130, filterParams: { newRowsAction: 'keep' } }
                    break;
                case "Conforming/Non-Conforming":
                    colDefs = { headerName: "Conf/Non-Conf", field: "conformingNonConforming", width: 130, filterParams: { newRowsAction: 'keep' } }
                    break;
                case "Created Date":
                    colDefs = {
                        headerName: "Created", field: "dateCreated", width: 110,
                        cellRenderer: dateTimeRenderer,
                        valueGetter: dateTimeRenderer,
                        comparator: dateComparator,
                        filter: 'set',
                        filterParams: { newRowsAction: 'keep' }
                    }
                    break;
                case "Credit Expiration Date":
                    colDefs = {
                        headerName: "Credit Exp", field: "creditExpirationDate", width: 130,
                        cellRenderer: dateRenderer,
                        valueGetter: dateRenderer,
                        comparator: dateComparator,
                        filter: 'set',
                        filterParams: { newRowsAction: 'keep' }
                    }
                    break;
                    //#D
                case "Decision Score":
                    colDefs = { headerName: "FICO", field: "decisionScore", width: 130, filterParams: { newRowsAction: 'keep' } }
                    break;
                case "Disclosure Date":
                    colDefs = {
                        headerName: "Disclosure Date", field: "disclosureDate", width: 130,
                        cellRenderer: dateRenderer,
                        valueGetter: dateRenderer,
                        comparator: dateComparator,
                        filter: 'set',
                        filterParams: { newRowsAction: 'keep' }
                    }
                    break;
                case "Disclosure Due Date":
                    colDefs = {
                        headerName: "Due Date", field: "disclosureDueDate", width: 110,
                        cellRenderer: dateRenderer,
                        valueGetter: dateRenderer,
                        comparator: dateComparator,
                        cellClass: 'ag-loan-number',
                        cellClicked: applicationData.currentUser.hasPrivilege(enums.privileges.MailroomWorkbench) ? dueDateClickedHandler: "",
                        filter: 'set',
                        filterParams: { newRowsAction: 'keep' }
                    }
                    break;
                case "Disclosure Status":
                    colDefs = { headerName: "Disclosure Status", field: "disclosureStatus", width: 160, filterParams: { newRowsAction: 'keep' } }
                    break;
                case "Division":
                    colDefs = { headerName: "Division", field: "division", width: 130, filterParams: { newRowsAction: 'keep' } }
                    break;
                case "Doc Delivery":
                    colDefs = { headerName: "Doc Delivery", field: "docDelivery", width: 110, filterParams: { newRowsAction: 'keep' } }
                    break;
                case "Docs":
                    colDefs = { headerName: "Docs", field: "docs", width: 110, filterParams: { newRowsAction: 'keep' } }
                    break;

                    //#E
                case "E-Consent Date":
                    colDefs = {
                        headerName: "E-Consent", field: "eConsentDate", width: 130,
                        cellRenderer: dateTimeRenderer,
                        valueGetter: dateTimeRenderer,
                        comparator: dateComparator,
                        filter: 'set',
                        filterParams: { newRowsAction: 'keep' }
                    }
                    break;
                case "Email":
                    colDefs = { headerName: "Email", field: "email", width: 200, filterParams: { newRowsAction: 'keep' } }
                    break;
                case "Employment Status":
                    colDefs = { headerName: "Employment Status", field: "employmentStatus", width: 150, filterParams: { newRowsAction: 'keep' } }
                    break;
                case "Est Closing Date":
                    colDefs = {
                        headerName: "Est Closing Date", field: "closingDate", width: 130,
                        cellRenderer: dateRenderer,
                        valueGetter: dateRenderer,
                        comparator: dateComparator,
                        filter: 'set',
                        filterParams: { newRowsAction: 'keep' }
                    }
                    break;
                case "Est Value":
                    colDefs = { headerName: "Est Value", field: "estimatedValue", width: 90, cellRenderer: currencyRenderer, valueGetter: currencyRenderer, filterParams: { newRowsAction: 'keep' } }
                    break;
                    //#I
                case "Intent to Proceed Date":
                    colDefs = {
                        headerName: "ITP", field: "itpDate", width: 130,
                        cellRenderer: dateRenderer,
                        valueGetter: dateRenderer,
                        comparator: dateComparator,
                        filter: 'set',
                        filterParams: { newRowsAction: 'keep' }
                    }
                    break;
                    //#L
                case "Lead Status":
                    colDefs = { headerName: "Lead Status", field: "leadStatus", width: 130, filterParams: { newRowsAction: 'keep' } }
                    break;
                case "Loan #":
                    colDefs = { headerName: "Loan #", field: "loanNumber", width: 80, cellClass: 'ag-loan-number', cellClicked: cellClickedHandler, filter: LoanFilter, filterParams: { newRowsAction: 'keep' } }
                    break;
                case "Loan Amt":
                    colDefs = { headerName: "Loan Amt", field: "loanAmount", width: 90, cellRenderer: currencyRenderer, valueGetter: currencyRenderer, filterParams: { newRowsAction: 'keep' } }
                    break;
                case "Loan Application Date":
                    colDefs = {
                        headerName: "App Date", field: "loanApplicationDate", width: 110,
                        cellRenderer: dateRenderer,
                        valueGetter: dateRenderer,
                        comparator: dateComparator,
                        filter: 'set',
                        filterParams: { newRowsAction: 'keep' }
                    }
                    break;
                case "Loan Officer":
                    colDefs = { headerName: "Loan Officer", field: "conciergeFullName", width: 130, filterParams: { newRowsAction: 'keep' } }
                    break;
                case "Loan Program":
                    colDefs = { headerName: "Loan Program", field: "loanProgram", width: 160, filterParams: { newRowsAction: 'keep' } }
                    break;
                case "Purpose":
                    colDefs = { headerName: "Purpose", field: "loanPurpose", width: 110, filterParams: { newRowsAction: 'keep' } }
                    break;
                case "Loan Status":
                    colDefs = { headerName: "Loan Status", field: "milestoneStatus", cellRenderer: loanStatusCellRenderer, valueGetter: loanStatusCellRenderer, width: 110, filterParams: { newRowsAction: 'keep' } }
                    break;
                case "Loan Type":
                    colDefs = { headerName: "Loan Type", field: "loanType", width: 95, filterParams: { newRowsAction: 'keep' } }
                    break;
                case "Lock Expiration Date":
                    colDefs = {
                        headerName: "Lock Exp", field: "lockExpireDate", width: 110,
                        cellRenderer: dateRenderer,
                        valueGetter: dateRenderer,
                        comparator: dateComparator,
                        filter: 'set',
                        filterParams: { newRowsAction: 'keep' }
                    }
                    break;
                    //#M
                case "Modified By":
                    colDefs = { headerName: "Modified By", field: "modifiedBy", width: 130, filterParams: { newRowsAction: 'keep' } }
                    break;
                case "Modified Date":
                    colDefs = {
                        headerName: "Modified Date", field: "dateModified", width: 130,
                        cellRenderer: dateTimeRenderer,
                        valueGetter: dateTimeRenderer,
                        comparator: dateComparator,
                        filter: 'set',
                        filterParams: { newRowsAction: 'keep' }
                    }
                    break;
                    //#O
                case "Occupancy":
                    colDefs = { headerName: "Occupancy", field: "occupancyType", width: 95, filterParams: { newRowsAction: 'keep' } }
                    break;
                    //#P
                case "PreApproval Letter":
                    colDefs = { headerName: "PreApproval Letter", field: "preApprovalLetter", width: 160, filterParams: { newRowsAction: 'keep' } }
                    break;
                case "Preferred Phone":
                    colDefs = { headerName: "Preferred Phone", field: "prefferedPhone", width: 130, filterParams: { newRowsAction: 'keep' } }
                    break;
                case "Property Type":
                    colDefs = { headerName: "Property Type", field: "propertyType", width: 130, filterParams: { newRowsAction: 'keep' } }
                    break;
                case "Purchase Amt":
                    colDefs = { headerName: "Purchase Amt", field: "purchaseAmt", width: 130, cellRenderer: currencyRenderer, valueGetter: currencyRenderer, filterParams: { newRowsAction: 'keep' } }
                    break;
                    //#R
                case "Rate":
                    colDefs = { headerName: "Rate", field: "rate", width: 60, cellRenderer: threeDecimalRenderer, valueGetter: threeDecimalRenderer, filterParams: { newRowsAction: 'keep' } }
                    break;
                    //#S
                case "Seller Name":
                    colDefs = { headerName: "Seller Name", field: "sellerName", width: 130, filterParams: { newRowsAction: 'keep' } }
                    break;
                case "Subject Address - Street":
                    colDefs = { headerName: "Street", field: "streetAddress", width: 170, filterParams: { newRowsAction: 'keep' } }
                    break;
                case "Subject Address - State":
                    colDefs = { headerName: "State", field: "state", width: 65, filterParams: { newRowsAction: 'keep' } }
                    break;
                    //#T
                case "Term & Amort":
                    colDefs = { headerName: "Term & Amort", field: "termAmort", width: 105, filterParams: { newRowsAction: 'keep' } }
                    break;

                default:
                    console.log("ERROR: Column definitions for column: " + column + " is not define!");
            }

            return colDefs;

        }

    };

})();