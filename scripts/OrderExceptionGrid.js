OrderExceptionGrid = {

    OrderExceptionDataOnBegin: function (data) {
        ShowProcessingInfo();
        classRemover();
        $('#orderexceptiontab').addClass('queueselected');
        $('#orderexceptiontab').parent().addClass('selected');
        $("#borrowerDetailsSection").hide();
        $("#loanDetailsSection").hide();
        ConciergeCommandEmbedded.CloseIFrame();
    },

    OrderExceptionDataOnComplete: function (data) {
        HideProcessingInfo();
    },

    OrderExceptionDataHelper: function (data) {
        OrderExceptionGrid.OrderExceptionDataOnBegin();
        OrderExceptionGrid.OrderExceptionAjaxCall(data, true, "");
    },

    OrderExceptionDataOnRefresh: function (command, loanId) {
        if (AreThereAnyChangesOnManageFees(OrderExceptionGrid.OrderExceptionDataOnRefresh, new Array(command, loanId)) == true)
            return;

        OrderExceptionGrid.OrderExceptionDataOnBegin();
        OrderExceptionGrid.OrderExceptionAjaxCall(command, true, loanId);
    },

    OrderExceptionDataOnChangeCommand: function (command, loanId) {
        OrderExceptionGrid.OrderExceptionDataOnBegin();
        OrderExceptionGrid.OrderExceptionAjaxCall(command, false, loanId, true, false);
        UpdateNumberOfRecordsInTabs();
    },

    OrderExceptionDataOnFailure: function (data) {
        HideProcessingInfo();
    },

    OrderExceptionAjaxCall: function (data, refresh, loanId, commandChanged, async) {
        $.ajax({
            type: "GET",
            url: "Command/Execute",
            cache: false,
            async: async,
            data: data,
            dataType: "html",
            success: function (result) {
                $("#mainsection").html(result);
                OrderExceptionGrid.OrderExceptionDataOnSuccess(refresh, loanId, commandChanged);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                OrderExceptionGrid.OrderExceptionDataOnFailure();
            },
            complete: function (jqXHR, textStatus) {
                OrderExceptionGrid.OrderExceptionDataOnComplete();
            }
        });
    },

    OrderExceptionDataOnSuccess: function (refresh, loanId, commandChanged) {
        BindRightClickMenu();
        HideProcessingInfo();

        if ($("#nooftasks2").html() == "0") {
            ConciergeCommandEmbedded.CloseIFrame();
            AdditionalViews.CloseAdditionalViewSection();
            HideProcessingInfo();
        }

        $("#tabOrderExceptionCount").html($("#nooftasks2").html());

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