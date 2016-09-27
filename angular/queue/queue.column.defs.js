(function () {
    'use strict';
    angular.module('queue')
        .provider('queueColumnDefs', queueColumnDefs);

    /**
    * Resolves a client side model containing flags and properties specific to the client side only.
    */
    function queueColumnDefs() {

        this.$get = function () {
            return columnDefs;
        };

        var navigationSvc;

        var state;

        var enumTypes;

        var _stateParams;

        var _applicationData;

        function columnDefs(enums, $stateParams, applicationData, NavigationSvc, $state) {

            var result = {};

            navigationSvc = NavigationSvc;
            state = $state;
            enumTypes = enums;
            _stateParams = $stateParams;
            _applicationData = applicationData;

            //result.data = createColumnDefs($stateParams.queue, applicationData);
            //result.createColumnDefs = createColumnDefs;

            return result;
        };

        //function createColumnDefs(queue, applicationData)
        //{
        //    //If there is no column definitions for selected queue in application data add them
        //    addColumnsToApplicationDataIfNotExists(queue, applicationData);

        //    var colDefs = bindQueueColumnDefs(applicationData, queue);

        //    return colDefs;

        //}

        //function addColumnsToApplicationDataIfNotExists(queue, applicationData) {

        //    if (!applicationData.allQueueColumns) {
        //        applicationData.allQueueColumns = getAllQueueColumns();
        //    }

        //    if (!applicationData.queueColumns) {
        //        applicationData.queueColumns = [];
        //    }

        //    var inApplicationData;
        //    angular.forEach(applicationData.queueColumns, function (columns) {
        //        if (columns.queue == queue)
        //            inApplicationData = true;
        //    });

        //    if (!inApplicationData)
        //        applicationData.queueColumns.push(getColumnsForQueue(queue));
        //}

        //function getAllQueueColumns() {

        //    var allAvailableQueuesColumns = ["Adverse Reason", 
        //                                     "Adverse Reason Date",
        //                                     "Appraisal Age",
        //                                     "Appraisal Condition",
        //                                     "Appraisal Delivered Date",
        //                                     "Appraisal Expected Delivery Date",
        //                                     "Appraisal Inspection Date",
        //                                     "Appraisal Ordered Date",
        //                                     "Appraisal Order ID",
        //                                     "Appraisal Order Status Date",
        //                                     "Appraisal Requested Date",
        //                                     "Appraisal Rush",
        //                                     "Appraisal Status",
        //                                     "Appraised Value",
        //                                     "Borrower Activity",
        //                                     "Borrower Mailing Address",
        //                                     "Borrower Name",
        //                                     "Branch",
        //                                     "Channel",
        //                                     "Company",
        //                                     "Conforming/Non-Conforming",
        //                                     "Created Date",
        //                                     "Credit Expiration Date",
        //                                     "Decision Score",
        //                                     "Disclosure Date",
        //                                     "Disclosure Due Date",
        //                                     "Disclosure Status",
        //                                     "Doc Delivery",
        //                                     "Docs",
        //                                     "Division",
        //                                     "E-Consent Date",
        //                                     "Email",
        //                                     "Employment Status",
        //                                     "Est Closing Date",
        //                                     "Est Value",
        //                                     "Intent to Proceed Date",
        //                                     "Lead Status",
        //                                     "Loan #",
        //                                     "Loan Amt",
        //                                     "Loan Application Date",
        //                                     "Loan Officer",
        //                                     "Loan Program",
        //                                     "Loan Purpose",
        //                                     "Loan Status",
        //                                     "Loan Type",
        //                                     "Lock Expiration Date",
        //                                     "Modified By",
        //                                     "Modified Date",
        //                                     "Occupancy",
        //                                     "PreApproval Letter",
        //                                     "Preferred Phone",
        //                                     "Property Type",
        //                                     "Purchase Amt",
        //                                     "Rate",
        //                                     "Seller Name",
        //                                     "Subject Address - State",
        //                                     "Subject Address - Street",
        //                                     "Term & Amort"]

        //    return allAvailableQueuesColumns;

        //}

        //function getColumnsForQueue(queue) {
        //    var columns;

            //switch (queue) {
            //    //My Pipeline
            //    case enumTypes.myListQueue.openLoans:
            //        columns = ["Borrower Name", "Loan #", "Created Date", "Doc Delivery", "Loan Purpose", "Loan Program", "Occupancy", "Loan Amt", "Rate", "Subject Address - Street",
            //                    "Subject Address - State", "Loan Application Date", "Disclosure Date", "E-Consent Date", "Intent to Proceed Date", "Lock Expiration Date", "Est Closing Date", "Loan Status", "Appraisal Status",
            //                        "Borrower Activity", "Modified Date", "Loan Officer"]
            //        break;
            //    case enumTypes.myListQueue.closedLoans:
            //        columns = ["Borrower Name", "Loan #", "Subject Address - Street", "Subject Address - State", "Loan Type", "Occupancy", "Property Type", "Est Value", "Loan Amt", "Term & Amort", "Rate", "Loan Officer", "Created Date", "Modified Date", "Credit Expiration Date", "Loan Program", "Appraised Value", "Decision Score", "Preferred Phone", "Email", "Employment Status", "Company", "Channel", "Division", "Branch"]
            //        break;
            //    case enumTypes.myListQueue.cancelledLoans:
            //        columns = ["Borrower Name", "Loan #", "Subject Address - Street", "Subject Address - State", "Loan Type", "Occupancy", "Property Type", "Est Value", "Loan Amt", "Term & Amort", "Rate", "Loan Officer", "Created Date", "Modified Date", "Credit Expiration Date", "Loan Program", "Appraised Value", "Decision Score", "Preferred Phone", "Email", "Employment Status", "Company", "Channel", "Division", "Branch"]
            //        break;
            //    case enumTypes.myListQueue.prospects:
            //        columns = ["Borrower Name", "Loan #", "Created Date", "Doc Delivery", "Loan Purpose", "Loan Type", "Occupancy", "Loan Amt", "Subject Address - Street", "Subject Address - State", "Loan Program", "Lead Status",
            //            "PreApproval Letter", "Modified Date", "Modified By", "Loan Officer"]
            //        break;
            //    case enumTypes.myListQueue.unsubmitted:
            //        columns = ["Borrower Name", "Loan #", "Created Date"]
            //        break;
            //    case enumTypes.myListQueue.registered:
            //        columns = ["Borrower Name", "Loan #", "Created Date"]
            //        break;
            //    case enumTypes.myListQueue.submitted:
            //        columns = ["Borrower Name", "Loan #", "Created Date"]
            //        break;
            //    case enumTypes.myListQueue.opening:
            //        columns = ["Borrower Name", "Loan #", "Created Date"]
            //        break;
            //    case enumTypes.myListQueue.preApproval:
            //        columns = ["Borrower Name", "Loan #", "Created Date", "Doc Delivery", "Loan Purpose", "Loan Type", "Occupancy", "Loan Amt", "Subject Address - Street", "Subject Address - State", "Loan Program", "PreApproval Letter", "Modified Date", "Loan Officer"]
            //        break;
            //    case enumTypes.myListQueue.approved:
            //        columns = ["Borrower Name", "Loan #", "Created Date"]
            //        break;
            //    case enumTypes.myListQueue.docsOut:
            //        columns = ["Borrower Name", "Loan #", "Created Date"]
            //        break;
            //    case enumTypes.myListQueue.funding:
            //        columns = ["Borrower Name", "Loan #", "Created Date"]
            //        break;
            //    case enumTypes.myListQueue.mailRoom:
            //        columns = ["Borrower Name", "Loan #", "Borrower Mailing Address", "Disclosure Status", "Disclosure Due Date", "Loan Officer"]
            //        break;
            //    case enumTypes.myListQueue.pendingEConsent:
            //        columns = ["Borrower Name", "Loan #", "Email", "Loan Application Date", "Loan Status", "Disclosure Due Date", "Doc Delivery",
            //            "Disclosure Status", "Loan Program", "Loan Officer", "E-Consent Date"]
            //        break;
            //    case enumTypes.myListQueue.pendingDisclosures:
            //        columns = ["Borrower Name", "Loan #", "Loan Application Date", "E-Consent Date", "Disclosure Due Date", "Disclosure Status", "Doc Delivery",
            //             "Loan Program", "Subject Address - Street", "Subject Address - State", "Loan Status", "Loan Officer"]
            //        break;
            //    case enumTypes.myListQueue.orderRequested:
            //        columns = ["Appraisal Order ID", "Borrower Name", "Loan #", "Loan Type", "Loan Amt", "Purchase Amt", "Est Value", "Seller Name", "Appraisal Rush",
            //            "Loan Officer", "Appraisal Requested Date", "Appraisal Age"]
            //        break;
            //    case enumTypes.myListQueue.orderProcessed:
            //        columns = ["Appraisal Order ID", "Borrower Name", "Loan #", "Loan Purpose", "Loan Amt", "Purchase Amt", "Est Value", "Seller Name", "Conforming/Non-Conforming", "Appraisal Rush",
            //            "Loan Officer", "Appraisal Requested Date", "Appraisal Ordered Date", "Appraisal Inspection Date",
            //            "Appraisal Expected Delivery Date", "Appraisal Status", "Appraisal Order Status Date", "Appraisal Age"];
            //        break;
            //    case enumTypes.myListQueue.delivered:
            //        columns = ["Appraisal Order ID", "Borrower Name", "Loan #", "Loan Type", "Loan Amt", "Purchase Amt", "Est Value", "Appraised Value", "Loan Officer", "Appraisal Ordered Date", "Appraisal Inspection Date", "Appraisal Delivered Date", "Appraisal Age"]
            //        break;
            //    case enumTypes.myListQueue.exceptions:
            //        columns = ["Appraisal Order ID", "Borrower Name", "Loan #", "Loan Type", "Loan Amt", "Purchase Amt", "Est Value", "Appraised Value", "Appraisal Condition", "Loan Officer", "Appraisal Status", "Appraisal Order Status Date", "Appraisal Age"]
            //        break;
            //    case enumTypes.myListQueue.incomplete:
            //        columns = ["Borrower Name", "Loan #", "Doc Delivery", "Loan Application Date", "Disclosure Due Date", "E-Consent Date", "Intent to Proceed Date", "Lock Expiration Date", "Appraisal Status", "Loan Officer"]
            //        break;
            //    case enumTypes.myListQueue.adverse:
            //        columns = ["Borrower Name", "Loan #", "Loan Officer", "Loan Application Date", "E-Consent Date", "Adverse Reason", "Adverse Reason Date", "PreApproval Letter",
            //            "Appraisal Status", "Loan Purpose", "Subject Address - Street", "Subject Address - State"]
            //        break;
            //    case enumTypes.myListQueue.processing:
            //        columns = ["Borrower Name", "Loan #", "Doc Delivery", "Loan Application Date", "E-Consent Date", "Intent to Proceed Date", "Lock Expiration Date", "Est Closing Date",
            //                 "Loan Type", "Loan Purpose", "Loan Program", "Loan Officer", "Borrower Activity", "Docs"]
            //        break;
            //    default:
            //        columns = ["Borrower Name", "Loan #", "Created Date"]
            //        console.log("ERROR: Unsupported myListQueue item!");
            //}

        //    return { queue: queue, columns: columns };
        //}

        //function bindQueueColumnDefs(applicationData, queue) {

        //    var columnDefs = [];

        //    //Adding row number
        //    columnDefs.push({ headerName: "", field: "number", width: 40, icons: { menu: '<i/>' }, headerClass: 'ag-header-cell-without-style', suppressSorting: true });

        //    angular.forEach(applicationData.queueColumns, function (queueColumn) {

        //        if (queueColumn.queue == queue) {
        //            angular.forEach(queueColumn.columns, function (column) {
        //                columnDefs.push(getColumnDefs(column));
        //            });
        //        }

        //    });

        //    return columnDefs;

        //}

        //function displayNameCellRenderer(params) {
        //    if (!params.data.borrowerFirstName && !params.data.borrowerLastName)
        //        return null;
        //    else if (!params.data.borrowerFirstName && params.data.borrowerLastName)
        //        return params.data.borrowerLastName;
        //    else if (params.data.borrowerFirstName && !params.data.borrowerLastName)
        //        return null;
        //    else
        //        return params.data.borrowerLastName + '<span style="color: #9d9d9d">, ' + params.data.borrowerFirstName + '</span>';
        //}

        //function cellClickedHandler(row) {

        //    var loanId = row.data.loanId;

        //    if (row.data.parentLoanId)
        //        loanId = row.data.parentLoanId;

        //    if (angular.element(document.getElementById('divMainNavBar')).scope() != undefined)
        //        angular.element(document.getElementById('divMainNavBar')).scope().updateValuesOnRowChangeNEW(loanId);

        //    if (!(isNaN(parseFloat(row.data.loanNumber)))) {
        //        if (_applicationData.currentUser.hasPrivilege(enumTypes.privileges.ViewStandardList)) {
        //            state.go('loanCenter.loan.loanDetails.sections', { 'loanId': loanId }, { reload: true });
        //        }
        //        else if (_applicationData.currentUser.hasPrivilege(enumTypes.privileges.ViewAppraisalLists)) {
        //            state.go('loanCenter.loan.appraisal', { 'loanId': loanId }, { reload: true });
        //        }
        //        else {
        //            //TODO: Handle else
        //        }
        //    }
        //    else {
        //        state.go('loanCenter.loan.loanApplication.personal', { 'loanId': loanId }, { reload: true });
        //    }
           
        //};

        //function dueDateClickedHandler(row) {

        //    var loanId = row.data.loanId;

        //    if (row.data.parentLoanId)
        //        loanId = row.data.parentLoanId;

        //    if (angular.element(document.getElementById('divMainNavBar')).scope() != undefined)
        //        angular.element(document.getElementById('divMainNavBar')).scope().updateValuesOnRowChangeNEW(loanId);


        //if (state.params.queue == enumTypes.myListQueue.mailRoom) {
        //    state.go('loanCenter.workbench.mailroom', { 'loanId':loanId }, { reload: true });
        //}
        //else
        //    state.go('loanCenter.loan.documents.docvault', { 'loanId': loanId }, { reload: true });

        //};

        //function dateComparator(date1, date2) {
        //    return (date1 == date2 ? 0 : (date1 > date2 ? 1 : -1));
        //};

        //function dateRenderer(params) {
        //    return params.data[params.colDef.field] ? params.data[params.colDef.field].format('MM/DD/YY') : null;
        //};

        //function dateTimeRenderer(params) {
        //    return params.data[params.colDef.field] ? params.data[params.colDef.field].format('MM/DD/YY hh:mm a') : null;
        //};

        //function currencyRenderer(params) {
        //    return params.data[params.colDef.field] ? params.data[params.colDef.field].toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") : null;
        //};

        //function threeDecimalRenderer(params) {
        //    return params.data[params.colDef.field] ? params.data[params.colDef.field].toFixed(3) : null;
        //};


        
        //function getColumnDefs(column) {
        //    var colDefs;

        //    switch (column) {
        //        //#A              
        //        case "Adverse Reason":
        //            colDefs = { headerName: "Adverse Reason", field: "adverseReason", width: 130 }
        //            break;
        //        case "Adverse Reason Date":
        //            colDefs = {
        //                headerName: "Adverse Reason Date", field: "adverseReasonDate", width: 180,
        //                cellRenderer: dateRenderer,
        //                valueGetter: dateRenderer,
        //                comparator: dateComparator,
        //                filter: 'set'
        //            }
        //            break;
        //        case "Appraisal Age":
        //            colDefs = { headerName: "Age", field: "appraisalAge", width: 80 }
        //            break;
        //        case "Appraisal Condition":
        //            colDefs = { headerName: "Appraisal Condition", field: "appraisalCondition", width: 140 }
        //            break;
        //        case "Appraisal Delivered Date":
        //            colDefs = {
        //                headerName: "Appraisal Delivered Date", field: "appraisalDeliveredDate", width: 170, 
        //                cellRenderer: dateRenderer,
        //                valueGetter: dateRenderer,
        //                comparator: dateComparator,
        //                filter: 'set'
        //            }
        //            break;
        //        case "Appraisal Expected Delivery Date":
        //            colDefs = {
        //                headerName: "Expected Delivery", field: "appraisalExpectedDeliveryDate", width: 130,
        //                cellRenderer: dateRenderer,
        //                valueGetter: dateRenderer,
        //                comparator: dateComparator,
        //                filter: 'set'
        //            }
        //            break;
        //        case "Appraisal Inspection Date":
        //            colDefs = {
        //                headerName: "Inspection", field: "appraisalInspectionDate", width: 90,
        //                cellRenderer: dateRenderer,
        //                valueGetter: dateRenderer,
        //                comparator: dateComparator,
        //                filter: 'set'
        //            }
        //            break;
        //        case "Appraisal Order ID":
        //            colDefs = { headerName: "Order ID", field: "appraisalOrderId", width: 100 }
        //            break;
        //        case "Appraisal Ordered Date":
        //            colDefs = {
        //                headerName: "Appraisal Ordered Date", field: "appraisalOrderedDate", width: 170,
        //                cellRenderer: dateRenderer,
        //                valueGetter: dateRenderer,
        //                comparator: dateComparator,
        //                filter: 'set'
        //            }
        //            break;
        //        case "Appraisal Order Status Date":
        //            colDefs = {
        //                headerName: "Order Status Date", field: "appraisalOrderStatusDate", width: 130,
        //                cellRenderer: dateRenderer,
        //                valueGetter: dateRenderer,
        //                comparator: dateComparator,
        //                filter: 'set'
        //            }
        //            break;
        //        case "Appraisal Requested Date":
        //            colDefs = {
        //                headerName: "Requested Appraisal", field: "appraisalRequestedDate", width: 150,
        //                cellRenderer: dateRenderer,
        //                valueGetter: dateRenderer,
        //                comparator: dateComparator,
        //                filter: 'set'
        //            }
        //            break;
        //        case "Appraisal Rush":
        //            colDefs = { headerName: "Appraisal Rush", field: "appraisalRush", width: 130 }
        //            break;
        //        case "Appraisal Status":
        //            colDefs = { headerName: "Appraisal Status", field: "appraisalStatus", width: 130 }
        //            break;
        //        case "Appraised Value":
        //            colDefs = { headerName: "Appraised Value", field: "appraisedValue", width: 90, cellRenderer: currencyRenderer, valueGetter: currencyRenderer }
        //            break;
        //    //#B
        //        case "Branch":
        //            colDefs = { headerName: "Branch", field: "branch", width: 130 }
        //            break;
        //        case "Borrower Activity":
        //            colDefs = { headerName: "Borrower Activity", field: "borrowerActivity", width: 130 }
        //            break;
        //        case "Borrower Mailing Address":
        //            colDefs = { headerName: "Mailing Address", field: "borrowerMailingAddress", width: 210 }
        //            break;
        //        case "Borrower Name":
        //            colDefs = { headerName: "Borrower Name", width: 130, cellRenderer: displayNameCellRenderer, filter: 'set', valueGetter: displayNameCellRenderer }
        //            break
        //    //#C
        //        case "Channel":
        //            colDefs = { headerName: "Channel", field: "channel", width: 130 }
        //            break;
        //        case "Company":
        //            colDefs = { headerName: "Company", field: "company", width: 130 }
        //            break;
        //        case "Conforming/Non-Conforming":
        //            colDefs = { headerName: "Conf/Non-Conf", field: "conformingNonConforming", width: 130 }
        //            break;
        //        case "Created Date":
        //            colDefs = {
        //                headerName: "Created", field: "dateCreated", width: 110,
        //                cellRenderer: dateTimeRenderer,
        //                valueGetter: dateTimeRenderer,
        //                comparator: dateComparator,
        //                filter: 'set'
        //            }
        //            break;
        //        case "Credit Expiration Date":
        //            colDefs = {
        //                headerName: "Credit Exp", field: "creditExpirationDate", width: 130,
        //                cellRenderer: dateRenderer,
        //                valueGetter: dateRenderer,
        //                comparator: dateComparator,
        //                filter: 'set'
        //            }
        //            break;
        //    //#D
        //        case "Decision Score":
        //            colDefs = { headerName: "FICO", field: "decisionScore", width: 130 }
        //            break;
        //        case "Disclosure Date":
        //            colDefs = {
        //                headerName: "Disclosure Date", field: "disclosureDate", width: 130,
        //                cellRenderer: dateRenderer,
        //                valueGetter: dateRenderer,
        //                comparator: dateComparator,
        //                filter: 'set'
        //            }
        //            break;
        //        case "Disclosure Due Date":
        //            colDefs = {
        //                headerName: "Due Date", field: "disclosureDueDate", width: 110,
        //                cellRenderer: dateRenderer,
        //                valueGetter: dateRenderer,
        //                comparator: dateComparator,
        //                cellClass: 'ag-loan-number',
        //                cellClicked: dueDateClickedHandler,
        //                filter: 'set'
        //            }
        //            break;
        //        case "Disclosure Status":
        //            colDefs = { headerName: "Disclosure Status", field: "disclosureStatus", width: 160 }
        //            break;
        //        case "Division":
        //            colDefs = { headerName: "Division", field: "division", width: 130 }
        //            break;
        //        case "Doc Delivery":
        //            colDefs = { headerName: "Doc Delivery", field: "docDelivery", width: 110 }
        //            break;
        //        case "Docs":
        //            colDefs = { headerName: "Docs", field: "docs", width: 110 }
        //            break;
                    
        //    //#E
        //        case "E-Consent Date":
        //            colDefs = {
        //                headerName: "E-Consent", field: "eConsentDate", width: 130,
        //                cellRenderer: dateTimeRenderer,
        //                valueGetter: dateTimeRenderer,
        //                comparator: dateComparator,
        //                filter: 'set'
        //            }
        //            break;
        //        case "Email":
        //            colDefs = { headerName: "Email", field: "email", width: 200 }
        //            break;
        //        case "Employment Status":
        //            colDefs = { headerName: "Employment Status", field: "employmentStatus", width: 150 }
        //            break;
        //        case "Est Closing Date":
        //            colDefs = {
        //                headerName: "Est Closing Date", field: "closingDate", width: 130,
        //                cellRenderer: dateRenderer,
        //                valueGetter: dateRenderer,
        //                comparator: dateComparator,
        //                filter: 'set'
        //            }
        //            break;
        //        case "Est Value":
        //            colDefs = { headerName: "Est Value", field: "estimatedValue", width: 90, cellRenderer: currencyRenderer, valueGetter: currencyRenderer }
        //            break;
        //    //#I
        //        case "Intent to Proceed Date":
        //            colDefs = {
        //                headerName: "ITP", field: "itpDate", width: 130,
        //                cellRenderer: dateRenderer,
        //                valueGetter: dateRenderer,
        //                comparator: dateComparator,
        //                filter: 'set'
        //            }
        //            break;
        //    //#L
        //        case "Lead Status":
        //            colDefs = { headerName: "Lead Status", field: "leadStatus", width: 130 }
        //            break;
        //        case "Loan #":
        //            colDefs = { headerName: "Loan #", field: "loanNumber", width: 80, cellClass: 'ag-loan-number', cellClicked: cellClickedHandler, filter: LoanFilter }
        //            break;
        //        case "Loan Amt":
        //            colDefs = { headerName: "Loan Amt", field: "loanAmount", width: 90, cellRenderer: currencyRenderer, valueGetter: currencyRenderer }
        //            break;
        //        case "Loan Application Date":
        //            colDefs = {
        //                headerName: "App Date", field: "loanApplicationDate", width: 110,
        //                cellRenderer: dateRenderer,
        //                valueGetter: dateRenderer,
        //                comparator: dateComparator,
        //                filter: 'set'
        //            }
        //            break;
        //        case "Loan Officer":
        //            colDefs = { headerName: "Loan Officer", field: "conciergeFullName", width: 130 }
        //            break;
        //        case "Loan Program":
        //            colDefs = { headerName: "Loan Program", field: "loanProgram", width: 160 }
        //            break;
        //        case "Loan Purpose":
        //            colDefs = { headerName: "Loan Purpose", field: "loanPurpose", width: 110 }
        //            break;
        //        case "Loan Status":
        //            colDefs = { headerName: "Loan Status", field: "milestoneStatus", width: 110 }
        //            break; 
        //        case "Loan Type":
        //            colDefs = { headerName: "Loan Type", field: "loanType", width: 95 }
        //            break;
        //        case "Lock Expiration Date":
        //            colDefs = {
        //                headerName: "Lock Exp", field: "lockExpireDate", width: 110,
        //                cellRenderer: dateRenderer,
        //                valueGetter: dateRenderer,
        //                comparator: dateComparator,
        //                filter: 'set'
        //            }
        //            break;
        //    //#M
        //        case "Modified By":
        //            colDefs = { headerName: "Modified By", field: "modifiedBy", width: 130 }
        //            break;
        //        case "Modified Date":
        //            colDefs = {
        //                headerName: "Modified Date", field: "dateModified", width: 130,
        //                cellRenderer: dateTimeRenderer,
        //                valueGetter: dateTimeRenderer,
        //                comparator: dateComparator,
        //                filter: 'set'
        //            }
        //            break;
        //    //#O
        //        case "Occupancy":
        //            colDefs = { headerName: "Occupancy", field: "occupancyType", width: 95 }
        //            break;
        //    //#P
        //        case "PreApproval Letter":
        //            colDefs = { headerName: "PreApproval Letter", field: "preApprovalLetter", width: 160 }
        //            break;
        //        case "Preferred Phone":
        //            colDefs = { headerName: "Preferred Phone", field: "prefferedPhone", width: 130 }
        //            break;
        //        case "Property Type":
        //            colDefs = { headerName: "Property Type", field: "propertyType", width: 130 }
        //            break;
        //        case "Purchase Amt":
        //            colDefs = { headerName: "Purchase Amt", field: "purchaseAmt", width: 130, cellRenderer: currencyRenderer, valueGetter: currencyRenderer }
        //            break;
        //    //#R
        //        case "Rate":
        //            colDefs = { headerName: "Rate", field: "rate", width: 60, cellRenderer: threeDecimalRenderer, valueGetter: threeDecimalRenderer }
        //            break;
        //    //#S
        //        case "Seller Name":
        //            colDefs = { headerName: "Seller Name", field: "sellerName", width: 130 }
        //            break;
        //        case "Subject Address - Street":
        //            colDefs = { headerName: "Street", field: "streetAddress", width: 170 }
        //            break;
        //        case "Subject Address - State":
        //            colDefs = { headerName: "State", field: "state", width: 65 }
        //            break;
        //    //#T
        //        case "Term & Amort":
        //            colDefs = { headerName: "Term & Amort", field: "termAmort", width: 105 }
        //            break;

        //        default:
        //            console.log("ERROR: Column definitions for column: " + column + " is not define!");
        //    }

        //    return colDefs;

        //} 


    }
})();


