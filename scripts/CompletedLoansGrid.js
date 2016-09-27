CompletedLoansGrid = {
    CompletedLoansDataOnBegin: function (data) {
        ShowProcessingInfo();
        classRemover();
        $('#completedloanstab').addClass('queueselected');
        $('#completedloanstab').parent().addClass('selected');
        $("#borrowerDetailsSection").hide();
        $("#loanDetailsSection").hide();
        ConciergeCommandEmbedded.CloseIFrame();
    },
    CompletedLoansDataOnComplete: function (data) {
        HideProcessingInfo();
    },
    CompletedLoansDataHelper: function (data) {
        if (AreThereAnyChangesOnManageFees(CompletedLoansGrid.CompletedLoansDataHelper, new Array(data)) == true)
            return;
        
        CompletedLoansGrid.CompletedLoansDataOnBegin();
        CompletedLoansGrid.CompletedLoansAjaxCall(data, false, "");
    },
    CompletedLoansDataHelperOnRefresh: function (command, loanId) {
        if (AreThereAnyChangesOnManageFees(CompletedLoansGrid.CompletedLoansDataHelperOnRefresh, new Array(command, loanId)) == true)
            return;
        
        CompletedLoansGrid.CompletedLoansDataOnBegin();
        CompletedLoansGrid.CompletedLoansAjaxCall(command, true, loanId);
    },
    CompletedLoansDataHelperOnChangeCommand: function (command, loanId) {
        if (AreThereAnyChangesOnManageFees(CompletedLoansGrid.CompletedLoansDataHelperOnChangeCommand, new Array(command, loanId)) == true)
            return;
        
        CompletedLoansGrid.ProspectDataOnBegin();
        CompletedLoansGrid.ProspectAjaxCall(command, false, loanId, true, false);
        UpdateNumberOfRecordsInTabs();
    },
    CompletedLoansDataOnFailure: function (data) {
        HideProcessingInfo();
        BindOfficerTaskEvents();
    },

    CompletedLoansAjaxCall: function (data, refresh, loanId, commandChanged, async) {
        $.ajax({
            type: "GET",
            url: "Command/Execute",
            cache: false,
            async: async,
            data: data,
            dataType: "html",
            success: function (result) {
                $("#mainsection").html(result);
                CompletedLoansGrid.CompletedLoansDataOnSuccess(refresh, loanId, commandChanged);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                CompletedLoansGrid.CompletedLoansDataOnFailure();
            }           
        });
    },

    CompletedLoansDataOnSuccess: function (refresh, loanId, commandChanged) {

        BindRightClickMenu();
        BindOfficerTaskEvents();

        $("#tabCompletedLoansCount").html($("#nooftasks2").html());

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
            var $selectedLoan = $(".completedloanstable .loanid").filter(function () { return $(this).text().trim() == loanId.trim(); });
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
