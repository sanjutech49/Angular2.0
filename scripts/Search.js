Search = {
    SearchDataHelper: function (clearSearchData, searchValue, isOldSearch) {
        
        if (AreThereAnyChangesOnManageFees(Search.SearchDataHelper, new Array(clearSearchData)) == true) 
            return;

        var search = "";

        if (isOldSearch) {
            if (clearSearchData === false) {
                if ($("#searchinput").val() !== "Search" && $("#searchinput").val() !== "") {
                    search = $("#searchinput").val();
                    $(".clearsearchbutton").css("display", "block");
                } else {
                    return;
                }
            } else {
                document.getElementById("searchinput").value = 'Search';
                document.getElementById("searchinput").style.color = '#636363';
                $(".clearsearchbutton").css("display", "none");
            }
        } else {
            search = searchValue;
        }


        $.ajax({
            type: "GET",
            url: '/Home/GetCurrentTabForSearchData',
            data: 'searchValue=' + search,
            success: function (data) {

                switch (data) {
                    case "Prospect":
                        ProspectGrid.ProspectDataHelper('command=OpenProspectTab');
                        break;
                    case "PreApproval":
                        PreApprovalGrid.PreApprovalDataHelper('command=OpenPreApprovalTab');
                        break;
                    case "Pipeline":
                        PipelineGrid.PipelineDataHelper('command=OpenPipelineTab');
                        break;
                    case "NewLoanApplication":
                        NewLoanApplicationGrid.NewLoanApplicationDataHelper('command=OpenNewLoanApplicationTab');
                        break;
                    case "PendingApproval":
                        PendingApprovalGrid.PendingApprovalDataHelper('command=OpenPendingApprovalTab');
                        break;
                    case "Alerts":
                        AlertGrid.AlertDataHelper('command=OpenAlertTab');
                        break;
                    case "CompletedLoans":
                        CompletedLoansGrid.CompletedLoansDataHelper('command=OpenCompletedLoansTab');
                        break;
                    case "Cancelled":
                        CancelGrid.CancelDataHelper('command=OpenCancelTab');
                        break;
                    case "OrderRequested":
                        OrderRequestedGrid.OrderRequestedDataHelper('command=OpenOrderRequestedTab');
                        break;
                    case "OrderProcessed":
                        OrderProcessedGrid.OrderProcessedDataHelper('command=OpenOrderProcessedTab');
                        break;
                    case "OrderDeliveredForReview":
                        OrderDeliveredForReviewGrid.OrderDeliveredForReviewDataHelper('command=OpenOrderDeliveredForReviewTab');
                        break;
                    case "OrderException":
                        OrderExceptionGrid.OrderExceptionDataHelper('command=OpenOrderExceptionTab');
                        break;
                    case "MailRoom":
                        MailRoomGrid.MailRoomDataHelper('command=OpenMailRoomTab');
                        break;
                    default:
                        ProspectGrid.ProspectDataHelper('command=OpenProspectTab');
                        break;

                }
                UpdateNumberOfRecordsInTabs();
            }
        });
    }
};
