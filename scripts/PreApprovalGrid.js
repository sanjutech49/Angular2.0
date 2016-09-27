PreApprovalGrid = {
    PreApprovalDataOnBegin: function (data) {
        ShowProcessingInfo();
        classRemover();
        $('#preapprovaltab').addClass('queueselected');
        $('#preapprovaltab').parent().addClass('selected');
        $("#borrowerDetailsSection").hide();
        $("#loanDetailsSection").hide();
        ConciergeCommandEmbedded.CloseIFrame();
    },
    PreApprovalDataOnComplete: function (data) {
        HideProcessingInfo();
    },
    PreApprovalDataHelper: function (data) {
        if (AreThereAnyChangesOnManageFees(NewLoanApplicationGrid.NewLoanApplicationDataHelper, new Array(data)) == true)
            return;

        PreApprovalGrid.PreApprovalDataOnBegin();
        PreApprovalGrid.PreApprovalAjaxCall(data, false, "");
    },
    PreApprovalDataHelperOnRefresh: function (command, loanId) {
        if (AreThereAnyChangesOnManageFees(NewLoanApplicationGrid.NewLoanApplicationDataHelper, new Array(command, loanId)) == true)
            return;

        PreApprovalGrid.PreApprovalDataOnBegin();
        PreApprovalGrid.PreApprovalAjaxCall(command, true, loanId);
    },
    PreApprovalDataHelperOnChangeCommand: function (command, loanId) {
        if (AreThereAnyChangesOnManageFees(NewLoanApplicationGrid.NewLoanApplicationDataHelper, new Array(command, loanId)) == true)
            return;

        PreApprovalGrid.PreApprovalDataOnBegin();
        PreApprovalGrid.PreApprovalAjaxCall(command, false, loanId, true, false);
        UpdateNumberOfRecordsInTabs();
    },
    PreApprovalDataOnFailure: function (data) {
        HideProcessingInfo();
    },
    PreApprovalAjaxCall: function (data, refresh, loanId, commandChanged, async) {
        $.ajax({
            type: "GET",
            url: "Command/Execute",
            cache: false,
            async: async,
            data: data,
            dataType: "html",
            success: function (result) {
                $("#mainsection").html(result);
                PreApprovalGrid.PreApprovalDataOnSuccess(refresh, loanId, commandChanged);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                PreApprovalGrid.PreApprovalDataOnFailure();
            },
            complete: function (jqXHR, textStatus) {
                PreApprovalGrid.PreApprovalDataOnComplete();
            }
        });
    },

    PreApprovalDataOnSuccess: function (refresh, loanId, commandChanged) {

        BindOfficerTaskEvents();
        BindRightClickMenu();

        $("#tabPreApprovalCount").html($("#nooftasks2").html());

        if ($("#nooftasks2").html() == "0") {
            ConciergeCommandEmbedded.CloseIFrame();
            AdditionalViews.CloseAdditionalViewSection();
            HideProcessingInfo();
        }

        if (commandChanged == true) {
            var $selectedLoan = $(".preapprovaltable .loanid").filter(function () { return $(this).text().trim() == loanId.trim(); });
            if ($selectedLoan.length > 0) {
                trId = $selectedLoan.closest("tr").attr('id')
                $("[id^='" + trId.substring(0, trId.length - 1) + "']").addClass("tablelistselected");
                $("[id^='" + trId.substring(0, trId.length - 1) + "']").slideDown(200);

                $("[id='" + trId.substring(0, trId.length - 1) + "']").removeClass('last');
                fnumber = trId.substring(5, trId.length - 1);

                $('[id=childIndicator_' + fnumber + ']').removeClass('childIndicator');
            }
            HideProcessingInfo();
            return;
        }
        if (refresh == true && loanId != "") {
            var $selectedLoan = $(".preapprovaltable .loanid").filter(function () { return $(this).text().trim() == loanId.trim(); });
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
