OrderDeliveredForReviewGrid = {

    OrderDeliveredForReviewDataOnBegin: function (data) {
        ShowProcessingInfo();
        classRemover();
        $('#orderdeliveredforreviewtab').addClass('queueselected');
        $('#orderdeliveredforreviewtab').parent().addClass('selected');
        $("#borrowerDetailsSection").hide();
        $("#loanDetailsSection").hide();
        ConciergeCommandEmbedded.CloseIFrame();
    },

    OrderDeliveredForReviewDataOnComplete: function (data) {
        HideProcessingInfo();
    },

    OrderDeliveredForReviewDataHelper: function (data) {
        OrderDeliveredForReviewGrid.OrderDeliveredForReviewDataOnBegin();
        OrderDeliveredForReviewGrid.OrderDeliveredForReviewAjaxCall(data, true, "");
    },

    OrderDeliveredForReviewDataOnRefresh: function (command, loanId) {
        if (AreThereAnyChangesOnManageFees(OrderDeliveredForReviewGrid.OrderDeliveredForReviewDataOnRefresh, new Array(command, loanId)) == true)
            return;

        OrderDeliveredForReviewGrid.OrderDeliveredForReviewDataOnBegin();
        OrderDeliveredForReviewGrid.OrderDeliveredForReviewAjaxCall(command, true, loanId);
    },

    OrderDeliveredForReviewDataOnChangeCommand: function (command, loanId) {
        OrderDeliveredForReviewGrid.OrderDeliveredForReviewDataOnBegin();
        OrderDeliveredForReviewGrid.OrderDeliveredForReviewAjaxCall(command, false, loanId, true, false);
        UpdateNumberOfRecordsInTabs();
    },

    OrderDeliveredForReviewDataOnFailure: function (data) {
        HideProcessingInfo();
    },

    OrderDeliveredForReviewAjaxCall: function (data, refresh, loanId, commandChanged, async) {
        $.ajax({
            type: "GET",
            url: "Command/Execute",
            cache: false,
            async: async,
            data: data,
            dataType: "html",
            success: function (result) {
                $("#mainsection").html(result);
                OrderDeliveredForReviewGrid.OrderDeliveredForReviewDataOnSuccess(refresh, loanId, commandChanged);
            },
            error: function (xhr, status, error) {
                alert(xhr);
                OrderDeliveredForReviewGrid.OrderDeliveredForReviewDataOnFailure();
            },
            complete: function (jqXHR, textStatus) {
                OrderDeliveredForReviewGrid.OrderDeliveredForReviewDataOnComplete();
            }
        });
    },

    OrderDeliveredForReviewDataOnSuccess: function (refresh, loanId, commandChanged) {
        BindRightClickMenu();
        HideProcessingInfo();

        if ($("#nooftasks2").html() == "0") {
            ConciergeCommandEmbedded.CloseIFrame();
            AdditionalViews.CloseAdditionalViewSection();
            HideProcessingInfo();
        }

        $("#tabOrderDeliveredForReviewCount").html($("#nooftasks2").html());

        if (commandChanged == true) {
            HideProcessingInfo();
            return;
        }

        if (refresh == true && loanId != "") {
            var $selectedLoan = $(".queuetable .loanid").filter(function () { return $(this).text().trim() == loanId.trim(); });
            if ($selectedLoan.length > 0)
                $selectedLoan.closest("tr").trigger("click");
            else if ($(".tablelistselected").length == 0)
                $("[id='task_0P']").click();
        }
        else if ($(".tablelistselected").length == 0) {
            $("[id='task_0P']").click();
            HideProcessingInfo();
        }
    }
}