NewLoanApplicationGrid = {
    NewLoanApplicationDataOnBegin: function (data) {
        ShowProcessingInfo();
        classRemover();
        $('#newloanapplicationtab').addClass('queueselected');
        $('#newloanapplicationtab').parent().addClass('selected');
        $("#borrowerDetailsSection").hide();
        $("#loanDetailsSection").hide();
        ConciergeCommandEmbedded.CloseIFrame();
    },
    NewLoanApplicationeDataOnComplete: function (data) {
        HideProcessingInfo();
    },
    NewLoanApplicationDataHelper: function (data) {
        if (AreThereAnyChangesOnManageFees(NewLoanApplicationGrid.NewLoanApplicationDataHelper, new Array(data)) == true)
            return;

        NewLoanApplicationGrid.NewLoanApplicationDataOnBegin();
        NewLoanApplicationGrid.NewLoanApplicationAjaxCall(data, false, "");
    },
    NewLoanApplicationDataHelperOnRefresh: function (command, loanId) {
        if (AreThereAnyChangesOnManageFees(NewLoanApplicationGrid.NewLoanApplicationDataHelperOnRefresh, new Array(command, loanId)) == true)
            return;

        NewLoanApplicationGrid.NewLoanApplicationDataOnBegin();
        NewLoanApplicationGrid.NewLoanApplicationAjaxCall(command, true, loanId);
    },
    NewLoanApplicationDataHelperOnChangeCommand: function (command, loanId) {
        if (AreThereAnyChangesOnManageFees(NewLoanApplicationGrid.NewLoanApplicationDataHelperOnChangeCommand, new Array(command, loanId)) == true)
            return;

        NewLoanApplicationGrid.NewLoanApplicationDataOnBegin();
        NewLoanApplicationGrid.NewLoanApplicationAjaxCall(command, false, loanId, true, false);
        UpdateNumberOfRecordsInTabs();
    },
    NewLoanApplicationDataOnFailure: function (data) {
        HideProcessingInfo();
    },

    NewLoanApplicationAjaxCall: function (data, refresh, loanId, commandChanged, async) {
        if (async == undefined)
            async = true;
        $.ajax({
            type: "GET",
            url: "Command/Execute",
            cache: false,
            async: async,
            data: data,
            dataType: "html",
            success: function (result) {
                $("#mainsection").html(result);
                NewLoanApplicationGrid.NewLoanApplicationDataOnSuccess(refresh, loanId, commandChanged);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                NewLoanApplicationGrid.NewLoanApplicationDataOnFailure();
            }
        });
    },

    NewLoanApplicationDataOnSuccess: function (refresh, loanId, commandChanged) {
        $("#tabNewLoanApplicationCount").html($("#nooftasks2").html());

        if ($("#nooftasks2").html() == "0") {
            ConciergeCommandEmbedded.CloseIFrame();
            AdditionalViews.CloseAdditionalViewSection();
            HideProcessingInfo();
        }

        BindOfficerTaskEvents();
        BindRightClickMenu();

        if (commandChanged == true) {
            HideProcessingInfo();
            return;
        }

       
        if (refresh == true && loanId != "") {
            var $selectedLoan = $(".newloanapplicationtable .loanid").filter(function () { return $(this).text().trim() == loanId.trim(); });
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
