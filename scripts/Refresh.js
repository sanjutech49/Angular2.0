Refresh = {
    RefreshDataHelper: function (isRefresh) {

        if (AreThereAnyChangesOnManageFees(Refresh.RefreshDataHelper, null) == true)
            return;

        if (typeof (isRefresh) === 'undefined' || isRefresh != 'false') {
            isRefresh = 'true';
        }

        var loanId = $('.tablelistselected:not(.childloan) .loanid').text();
        $.ajax({
            type: "GET",
            url: '/Home/GetCurrentTabForRefresh',
            success: function (data) {

                switch (data) {
                    case "Prospect":
                        var prospectId = $('.tablelistselected').find(".prospectid").first().text().trim();
                        ProspectGrid.ProspectDataHelperOnRefresh("command=OpenProspectTab,Refresh=" + isRefresh, loanId, prospectId);
                        break;
                    case "Pipeline":
                        PipelineGrid.PipelineDataHelperOnRefresh("command=OpenPipelineTab,Refresh=" + isRefresh, loanId);
                        break;
                    case "NewLoanApplication":
                        NewLoanApplicationGrid.NewLoanApplicationDataHelperOnRefresh("command=OpenNewLoanApplicationTab,Refresh=" + isRefresh, loanId);
                        break;
                    case "PendingApproval":
                        PendingApprovalGrid.PendingApprovalDataHelperOnRefresh("command=OpenPendingApprovalTab,Refresh=" + isRefresh, loanId);
                        break;
                    case "Alerts":
                        AlertGrid.AlertDataHelperOnRefresh("command=OpenAlertTab,Refresh=" + isRefresh, loanId);
                        break;
                    case "CompletedLoans":
                        CompletedLoansGrid.CompletedLoansDataHelperOnRefresh("command=OpenCompletedLoansTab,Refresh=" + isRefresh, loanId);
                        break;
                    case "Cancelled":
                        CancelGrid.CancelDataHelperOnRefresh("command=OpenCancelTab,Refresh=" + isRefresh, loanId);
                        break;
                    case "PreApproval":
                        PreApprovalGrid.PreApprovalDataHelperOnRefresh("command=OpenPreApprovalTab,Refresh=" + isRefresh, loanId);
                        break;
                    case "OrderRequested":
                        OrderRequestedGrid.OrderRequestedDataOnRefresh("command=OpenOrderRequestedTab,Refresh=" + isRefresh, loanId);
                        break;
                    case "OrderProcessed":
                        OrderProcessedGrid.OrderProcessedDataOnRefresh("command=OpenOrderProcessedTab,Refresh=" + isRefresh, loanId);
                        break;
                    case "OrderDeliveredForReview":
                        OrderDeliveredForReviewGrid.OrderDeliveredForReviewDataOnRefresh("command=OpenOrderDeliveredForReviewTab,Refresh=" + isRefresh, loanId);
                        break;
                    case "OrderException":
                        OrderExceptionGrid.OrderExceptionDataOnRefresh("command=OpenOrderExceptionTab,Refresh=" + isRefresh, loanId);
                        break;
                    case "MailRoom":
                        MailRoomGrid.MailRoomDataHelperOnRefresh("command=OpenMailRoomTab,Refresh=" + isRefresh, loanId);
                        break;
                    default:
                        ProspectGrid.ProspectDataHelperOnRefresh("command=OpenProspectTab,Refresh=" + isRefresh, loanId);
                        break;
                }

                UpdateNumberOfRecordsInTabs();
            }
        });
    }
};
