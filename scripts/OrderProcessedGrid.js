OrderProcessedGrid = {

    OrderProcessedDataOnBegin: function (data) {
        ShowProcessingInfo();
        classRemover();
        $('#orderprocessedtab').addClass('queueselected');
        $('#orderprocessedtab').parent().addClass('selected');
        $("#borrowerDetailsSection").hide();
        $("#loanDetailsSection").hide();
        ConciergeCommandEmbedded.CloseIFrame();
    },

    OrderProcessedDataOnComplete: function (data) {
        HideProcessingInfo();
    },

    OrderProcessedDataHelper: function (data) {
        OrderProcessedGrid.OrderProcessedDataOnBegin();
        OrderProcessedGrid.OrderProcessedAjaxCall(data, true, "");
    },

    OrderProcessedDataOnRefresh: function (command, loanId) {
        if (AreThereAnyChangesOnManageFees(OrderProcessedGrid.OrderProcessedDataOnRefresh, new Array(command, loanId)) == true)
            return;

        OrderProcessedGrid.OrderProcessedDataOnBegin();
        OrderProcessedGrid.OrderProcessedAjaxCall(command, true, loanId);
    },

    OrderProcessedDataOnChangeCommand: function (command, loanId) {
        OrderProcessedGrid.OrderProcessedDataOnBegin();
        OrderProcessedGrid.OrderProcessedAjaxCall(command, false, loanId, true, false);
        UpdateNumberOfRecordsInTabs();
    },

    OrderProcessedDataOnFailure: function (data) {
        HideProcessingInfo();
    },

    OrderProcessedAjaxCall: function (data, refresh, loanId, commandChanged, async) {
        $.ajax({
            type: "GET",
            url: "Command/Execute",
            cache: false,
            async: async,
            data: data,
            dataType: "html",
            success: function (result) {
                $("#mainsection").html(result);
                OrderProcessedGrid.OrderProcessedDataOnSuccess(refresh, loanId, commandChanged);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                OrderProcessedGrid.OrderProcessedDataOnFailure();
            },
            complete: function (jqXHR, textStatus) {
                OrderProcessedGrid.OrderProcessedDataOnComplete();
            }
        });
    },

    OrderProcessedDataOnSuccess: function (refresh, loanId, commandChanged) {
        BindRightClickMenu();
        HideProcessingInfo();

        if ($("#nooftasks2").html() == "0") {
            ConciergeCommandEmbedded.CloseIFrame();
            AdditionalViews.CloseAdditionalViewSection();
            HideProcessingInfo();
        }

        $("#tabOrderProcessedCount").html($("#nooftasks2").html());

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