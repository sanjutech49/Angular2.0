CancelGrid = {
    CancelDataOnBegin: function (data) {
        ShowProcessingInfo();
        classRemover();
        $('#canceltab').addClass("queueselected");
        $('#canceltab').parent().addClass('selected');
        $("#borrowerDetailsSection").hide();
        $("#loanDetailsSection").hide();
        ConciergeCommandEmbedded.CloseIFrame();
    },
    CancelDataOnComplete: function (data) {
        HideProcessingInfo();
    },
    CancelDataOnFailure: function (data) {
        HideProcessingInfo();
    },
    CancelDataHelper: function (data) {
        if (AreThereAnyChangesOnManageFees(CancelGrid.CancelDataHelper, new Array(data)) == true)
            return;
        
        CancelGrid.CancelDataOnBegin();
        CancelGrid.CancelAjaxCall(data, false, "");
    },
    CancelDataHelperOnRefresh: function (command, loanId) {
        if (AreThereAnyChangesOnManageFees(CancelGrid.CancelDataHelperOnRefresh, new Array(command, loanId)) == true)
            return;
        
        CancelGrid.CancelDataOnBegin();
        CancelGrid.CancelAjaxCall(command, true, loanId);
    },
    CancelDataHelperOnChangeCommand: function (command, loanId) {
        if (AreThereAnyChangesOnManageFees(CancelGrid.CancelDataHelperOnChangeCommand, new Array(command, loanId)) == true)
            return;

        CancelGrid.CancelDataOnBegin();
        CancelGrid.CancelAjaxCall(command, false, loanId, true, false);
        UpdateNumberOfRecordsInTabs();
    },
    CancelAjaxCall: function (data, refresh, loanId, commandChanged, async) {
        $.ajax({
            type: "GET",
            url: "Command/Execute",
            cache: false,
            async: async,
            data: data,
            dataType: "html",
            success: function (result) {
                $("#mainsection").html(result);
                CancelGrid.CancelDataOnSuccess(refresh, loanId, commandChanged);

            },
            error: function (jqXHR, textStatus, errorThrown) {
                CancelGrid.CancelDataOnFailure();
            }           
        });
    },
    CancelDataOnSuccess: function (refresh, loanId, commandChanged) {
        BindOfficerTaskEvents();
        BindRightClickMenu();
        $("#tabCanceledCount").html($("#nooftasks2").html());

        if ($("#nooftasks2").html() == "0") {
            ConciergeCommandEmbedded.CloseIFrame();
            AdditionalViews.CloseAdditionalViewSection();
            HideProcessingInfo();
        }

        if (commandChanged == true) {
            HideProcessingInfo();
            return;
        }

        if (refresh == true && loanId != "") {
            var $selectedLoan = $(".canceltable .loanid").filter(function () { return $(this).text().trim() == loanId.trim(); });
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
};
