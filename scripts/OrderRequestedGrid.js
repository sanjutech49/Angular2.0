OrderRequestedGrid = {

    OrderRequestedDataOnBegin: function (data) {
        ShowProcessingInfo();
        classRemover();
        $('#orderrequestedtab').addClass('queueselected');
        $('#orderrequestedtab').parent().addClass('selected');
        $("#borrowerDetailsSection").hide();
        $("#loanDetailsSection").hide();
        ConciergeCommandEmbedded.CloseIFrame();
    },

    OrderRequestedDataOnComplete: function (data) {
        HideProcessingInfo();
    },

    OrderRequestedDataHelper: function (data) {
        OrderRequestedGrid.OrderRequestedDataOnBegin();
        OrderRequestedGrid.OrderRequestedAjaxCall(data, true, "");
    },

    OrderRequestedDataOnRefresh: function (command, loanId) {
        if (AreThereAnyChangesOnManageFees(OrderRequestedGrid.OrderRequestedDataOnRefresh, new Array(command, loanId)) == true)
            return;

        OrderRequestedGrid.OrderRequestedDataOnBegin();
        OrderRequestedGrid.OrderRequestedAjaxCall(command, true, loanId);
    },

    OrderRequestedDataOnChangeCommand: function (command, loanId) {
        OrderRequestedGrid.OrderRequestedDataOnBegin();
        OrderRequestedGrid.OrderRequestedAjaxCall(command, false, loanId, true, false);
        UpdateNumberOfRecordsInTabs();
    },

    OrderRequestedDataOnFailure: function (data) {
        HideProcessingInfo();
    },

    OrderRequestedAjaxCall: function (data, refresh, loanId, commandChanged, async) {
        $.ajax({
            type: "GET",
            url: "Command/Execute",
            cache: false,
            async: async,
            data: data,
            dataType: "html",
            success: function (result) {
                $("#mainsection").html(result);
                OrderRequestedGrid.OrderRequestedDataOnSuccess(refresh, loanId, commandChanged);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                OrderRequestedGrid.OrderRequestedDataOnFailure();
            },
            complete: function (jqXHR, textStatus) {
                OrderRequestedGrid.OrderRequestedDataOnComplete();
            }
        });
    },

    OrderRequestedDataOnSuccess: function (refresh, loanId, commandChanged) {
        BindRightClickMenu();
        HideProcessingInfo();

        if ($("#nooftasks2").html() == "0") {
            ConciergeCommandEmbedded.CloseIFrame();
            AdditionalViews.CloseAdditionalViewSection();
            HideProcessingInfo();
        }

        $("#tabOrderRequestedCount").html($("#nooftasks2").html());

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