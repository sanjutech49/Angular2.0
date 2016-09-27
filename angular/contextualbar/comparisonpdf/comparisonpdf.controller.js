/// <reference path="simplecontentmodal.html" />
(function () {
    'use strict';

    angular.module('contextualBar').controller('comparisonPDFController', comparisonPDFController);

    comparisonPDFController.$inject = ['loan', 'applicationData', 'comparison', 'enums', '$modal', '$controller', 'modalPopoverFactory'];

    function comparisonPDFController(loan, applicationData, comparison, enums, $modal, $controller, modalPopoverFactory) {

        var vm = this;

        angular.extend(this, $controller('DocumentCtrl', { $scope: vm }));
        vm.rowData = comparison.sentEmailItems;
        vm.openModal = openModal;
        vm.openTooltip = openTooltip;
        vm.multipleRecipients = [];


        function getLookupDescriptionForValue(value, lookupName){
            if (applicationData.lookup[lookupName]) {
                for (var i = 0; i < applicationData.lookup[lookupName].length - 1; i++){
                    if (applicationData.lookup[lookupName][i].value == value)
                        return applicationData.lookup[lookupName][i].text;
                }
            }

            return "";
        }

        function percentageRenderer(params) {
            return '<div style="padding-left:10px;">' + params.value + "%</div>";
        }


        function openModal(params) {
            var instance = $modal.open({
                templateUrl: 'angular/contextualbar/comparisonpdf/simplecontentmodal.html',
                windowClass: 'simple-content-modal',
                controller: 'simpleContentModalController',
                controllerAs: 'simpleContent',
                resolve: {
                    comparisonParams: function () {
                        return params;
                    }
                }
            });
        }

        function openTooltip(params) {
            var emails = params.split(',');
            var otherEmails = emails[1].split(';');
              
            vm.multipleRecipients = [];
            vm.multipleRecipients.push(emails[0]);
            vm.multipleRecipients = vm.multipleRecipients.concat(otherEmails);

            var sectionSevenPopup = modalPopoverFactory.openModalPopover('angular/contextualbar/comparisonpdf/multiplerecipients.html', vm, {}, event, {
                arrowRight: false, className: 'tooltip-arrow-left', verticalPopupPositionPerHeight: 0, horisontalPopupPositionPerWidth: 0.33
            });
        }

        function renderHeadersToTheRight(params) {
            var header = renderHeader(params.colDef.headerName);
            header.style.textAlign = "right";
            return header;
        }

        function renderPercentageHeaders(params) {
            var header = renderHeader(params.colDef.headerName);
            header.style.paddingLeft = "8px";
            return header;
        }

        function renderHeader(headerName) {
            var eHeader = document.createElement('div');
            var eTitle = document.createTextNode(headerName);
            eHeader.appendChild(eTitle);

            return eHeader;
        }

        /*
        * one of these column definitions needs to be removed once ag-grid is updated and hide column functionality is available.
        */
        var purchaseColumns = [
        {
            headerName: "", width: 30, field: "number", icons:
                    {
                        menu: '<i/>'
                    },
            headerClass: 'ag-header-cell-without-style',
            suppressSorting: true,
            cellRenderer: function (params) {
                params.$scope.downloadDocument = vm.DownloadDocument;
                return '<div style="background: url(../../Content/LoanCenterSprite.png);background-position: -148px -245px; width: 18px; height: 30px; position: absolute; top:4px;" ng-click=downloadDocument(' + '\'' + params.data.reportRepositoryItemId + '\'' + ')></div>';
            },
            cellClass: 'columnDefault'
        },
        {
            headerName: "", field: "htmlContent", width: 40, icons:
                    {
                        menu: '<i/>'
                    },
            headerClass: 'ag-header-cell-without-style',
            suppressSorting: true,
            cellRenderer: function(params){
                if (!params.data.isWhatIfRateOption) {
                    params.$scope.openModal = vm.openModal;
                    return '<div style="background: url(../../Content/LoanCenterSprite.png);background-position: -123px -242px; width: 26px; height: 30px; position: absolute; top:2px;" ng-click="openModal(data)"></div>'
                }

                return "";
            }
        },
        {
            headerName: "Recipients",
            width: 170,
            filter: 'set',
            field: "emailAddress",
            cellRenderer: function (params) {
                if (!params.data.isWhatIfRateOption) {
                    var email = params.value.split(',');
                    if (email.length > 1) {
                        params.$scope.openTooltip = vm.openTooltip;
                        var a = email[0].length > 26 ? email[0].substring(0, 25) : email[0];
                        return '<div style="color:#208ddc;" ng-click="openTooltip(data.emailAddress)">' + a + '...</div>'
                    }
                    return '<span>' + params.value + '</span>';
                } else
                    return '<span style="color: #9d9d9d">none - save only</span>';
            }
        },
        {
            headerName: "Property",
            field: "propertyType",
            cellRenderer: function (params) { return getLookupDescriptionForValue(params.value, 'subjectPropertyTypes') },
            width: 100,
        },
        { headerName: "Occupancy", field: "occupancyType", cellRenderer: function (params) { return getLookupDescriptionForValue(params.value, 'occupancyTypeListGrid') }, width: 90 },
        {
            headerName: "Purch Pr.",
            field: "purchasePrice",
            width: 80,
            cellStyle: { "text-align": "right" },
            //hide: true,
            cellRenderer: function (params) {
                return '<span>{{data.purchasePrice | impCurrency:"$":0}}</span>'
            },
            headerCellRenderer: renderHeadersToTheRight
        },
        {
            headerName: "Loan Amt",
            field: "loanAmount",
            width: 90,
            cellStyle: { "text-align": "right" },
            cellRenderer: function (params) {
                return '<span>{{data.loanAmount | impCurrency:"$":0}}</span>'
            },
            headerCellRenderer: renderHeadersToTheRight
        },
        {
            headerName: "Down Pmt",
            field: "downPayment",
            width: 90,
            cellStyle: { "text-align": "right" },
            //hide: true,
            cellRenderer: function (params) {
                return '<span>{{data.downPayment | impCurrency:"$":0}}</span>'
            },
            headerCellRenderer: renderHeadersToTheRight
        },
        {
            headerName: "DTI",
            field: "dti",
            cellRenderer: percentageRenderer,
            width: 60,
            headerCellRenderer: renderPercentageHeaders
        },
        {
            headerName: "LTV",
            field: "ltv", cellRenderer: percentageRenderer,
            width: 70,
            headerCellRenderer: renderPercentageHeaders
        },
        {
            headerName: "FICO", field: "fico",
            width: 70,
        },
        { headerName: "Impounds", field: "impounds", cellRenderer: function (params) { return getLookupDescriptionForValue(params.value, 'impoundListGrid') }, width: 80 },
        {
            headerName: "Created",
            cellRenderer: function (params) {
                return new Date(params.data.dateCreated.replace('T', ' ')).format("MM/dd/yy h:mmtt")
            }, width: 110
        }
        ];

        var refiColumns = [
        {
            headerName: "", width: 30, field: "number", icons:
                    {
                        menu: '<i/>'
                    },
            headerClass: 'ag-header-cell-without-style',
            suppressSorting: true,
            cellRenderer: function (params) {
                params.$scope.downloadDocument = vm.DownloadDocument;
                return '<div style="background: url(../../Content/LoanCenterSprite.png);background-position: -148px -245px; width: 18px; height: 30px; position: absolute; top:4px;" ng-click=downloadDocument(' + '\'' + params.data.reportRepositoryItemId + '\'' + ')></div>';
            },
            cellClass: 'columnDefault'
        },
        {
            headerName: "", field: "htmlContent", width: 40, icons:
                    {
                        menu: '<i/>'
                    },
            headerClass: 'ag-header-cell-without-style',
            suppressSorting: true,
            cellRenderer: function (params) {
                if (!params.data.isWhatIfRateOption) {
                    params.$scope.openModal = vm.openModal;
                    return '<div style="background: url(../../Content/LoanCenterSprite.png);background-position: -123px -242px; width: 26px; height: 30px; position: absolute; top:2px;" ng-click="openModal(data)"></div>'
                }

                return '';
            }
        },
        {
            headerName: "Recipients",
            width: 170,
            filter: 'set',
            field: "emailAddress",
            cellRenderer: function (params) {
                if (!params.data.isWhatIfRateOption) {
                    var email = params.value.split(',');
                    if (email.length > 1) {
                        params.$scope.openTooltip = vm.openTooltip;
                        var a = email[0].length > 26 ? email[0].substring(0, 25) : email[0];
                        return '<div style="color:#208ddc;" ng-click="openTooltip(data.emailAddress)">' + a + '...</div>'
                    }
                    return '<span>' + params.value + '</span>';
                } else
                    return '<span style="color: #9d9d9d">none - save only</span>';
            }
        },
        {
            headerName: "Property",
            field: "propertyType",
            cellRenderer: function (params) { return getLookupDescriptionForValue(params.value, 'subjectPropertyTypes') },
            width: 100,
        },
        { headerName: "Occupancy", field: "occupancyType", cellRenderer: function (params) { return getLookupDescriptionForValue(params.value, 'occupancyTypeListGrid') }, width: 90 },
        {
            headerName: "Est. Value",
            field: "estimatedValue", 
            width: 80,
            cellStyle: { "text-align": "right" },
            //hide: true,
            cellRenderer: function (params) {
                return '<span>{{data.estimatedValue | impCurrency:"$":0}}</span>'
            },
            headerCellRenderer: renderHeadersToTheRight },
        {
            headerName: "Loan Amt",
            field: "loanAmount",
            width: 90,
            cellStyle: { "text-align": "right" },
            cellRenderer: function (params) {
                return '<span>{{data.loanAmount | impCurrency:"$":0}}</span>'
            },
            headerCellRenderer: renderHeadersToTheRight
        },
        {
            headerName: "Cash Out",
            field: "cashout",
            width: 90,
            cellStyle: { "text-align": "right" },
           // hide: true,
            cellRenderer: function (params) {
                return '<span>{{data.cashout | impCurrency:"$":0}}</span>'
            },
            headerCellRenderer: renderHeadersToTheRight
        },
        {
            headerName: "DTI",
            field: "dti",
            cellRenderer: percentageRenderer,
            width: 60,
            headerCellRenderer: renderPercentageHeaders
        },
        {
            headerName: "LTV",
            field: "ltv", cellRenderer: percentageRenderer,
            width: 70,
            headerCellRenderer: renderPercentageHeaders
        },
        {
            headerName: "FICO",
            field: "fico",
            width: 70,
        },
       { headerName: "Impounds", field: "impounds", cellRenderer: function (params) { return getLookupDescriptionForValue(params.value, 'impoundListGrid') }, width: 80 },
       {
           headerName: "Created",
           cellRenderer: function (params) {
               return new Date(params.data.dateCreated.replace('T', ' ')).format("MM/dd/yy h:mmtt")
           }, width: 110
       }
        ];
        /*
        *
        */

        vm.gridOptions = {
            columnDefs: loan.ref.loanPurposeType == enums.LoanTransactionTypes.Purchase ? purchaseColumns : refiColumns,
            rowSelection: 'single',
            enableSorting: false,
            rowData: vm.rowData,
            enableFilter: false,
            enableColResize: false,
            enableServerSideSorting: true,
            dontUseScrolls: false,
            angularCompileRows: true
        };
    }
})();