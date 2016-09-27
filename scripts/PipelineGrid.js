PipelineGrid = {
    PipelineDataOnBegin: function (data) {
        ShowProcessingInfo();
        classRemover();
        $('#pipelinetab').addClass('queueselected');
        $('#pipelinetab').parent().addClass('selected');
        $("#borrowerDetailsSection").hide();
        $("#loanDetailsSection").hide();
        ConciergeCommandEmbedded.CloseIFrame();
    },
    PipelineDataOnComplete: function (data) {
        HideProcessingInfo();
    },
    PipelineDataHelper: function (data) {
        if (AreThereAnyChangesOnManageFees(PipelineGrid.PipelineDataHelper, new Array(data)) == true)
            return;

        PipelineGrid.PipelineDataOnBegin();
        PipelineGrid.PipelineAjaxCall(data, false, "");
    },
    PipelineDataHelperOnRefresh: function (command, loanId) {
        if (AreThereAnyChangesOnManageFees(PipelineGrid.PipelineDataHelperOnRefresh, new Array(command, loanId)) == true)
            return;

        PipelineGrid.PipelineDataOnBegin();
        PipelineGrid.PipelineAjaxCall(command, true, loanId);
    },
    PipelineDataHelperOnChangeCommand: function (command, loanId) {
        if (AreThereAnyChangesOnManageFees(PipelineGrid.PipelineDataHelperOnRefresh, new Array(command, loanId)) == true)
            return;

        PipelineGrid.PipelineDataOnBegin();
        PipelineGrid.PipelineAjaxCall(command, false, loanId, true, false);
        UpdateNumberOfRecordsInTabs();
    },
    PipelineDataOnFailure: function (data) {
        HideProcessingInfo();
        BindOfficerTaskEvents();
    },

    PipelineAjaxCall: function (data, refresh, loanId, commandChanged, async) {
        $.ajax({
            type: "GET",
            url: "Command/Execute",
            cache: false,
            async: async,
            data: data,
            dataType: "html",
            success: function (result) {
                $("#mainsection").html(result);
                PipelineGrid.PipelineDataOnSuccess(refresh, loanId, commandChanged);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                PipelineGrid.PipelineDataOnFailure();
            }
        });
    },
    PipelineDataOnSuccess: function (refresh, loanId, commandChanged) {
        $("#tabPipelineCount").html($("#nooftasks2").html());
        BindOfficerTaskEvents();
        BindRightClickMenu();

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
            var $selectedLoan = $(".pipelinetable .loanid").filter(function () { return $(this).text().trim() == loanId.trim(); });
            if ($selectedLoan.length > 0)
                $selectedLoan.closest("tr").trigger("click");
            else if ($(".tablelistselected").length == 0)
                $("[id='task_0P']").click();
        }
        else if ($(".tablelistselected").length == 0) {
            $("[id='task_0P']").click(); 
        }

        HideProcessingInfo();
    },

    PipelineShowLockRequestedPopup: function (elementNumber) {
        $('.divLockRequestedPopup.' + elementNumber).show();
    },

    PipelineHideLockRequestedPopup: function (elementNumber) {
        $('.divLockRequestedPopup.' + elementNumber).hide();
    }
};
