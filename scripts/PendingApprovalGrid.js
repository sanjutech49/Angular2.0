PendingApprovalGrid = {
    PendingApprovalDataOnBegin: function (data) {
        ShowProcessingInfo();
        classRemover();
        $('#pendingapprovaltab').addClass('queueselected');
        $('#pendingapprovaltab').parent().addClass('selected');
        $("#borrowerDetailsSection").hide();
        $("#loanDetailsSection").hide();
        ConciergeCommandEmbedded.CloseIFrame();
    },
    PendingApprovalDataOnComplete: function (data) {
        HideProcessingInfo();
    },
    PendingApprovalDataHelper: function (data) {
        if (AreThereAnyChangesOnManageFees(PendingApprovalGrid.PendingApprovalDataHelper, new Array(data)) == true)
            return;

        PendingApprovalGrid.PendingApprovalDataOnBegin();
        PendingApprovalGrid.PendingApprovalAjaxCall(data, false, "");
    },
    PendingApprovalDataHelperOnRefresh: function (command, loanId) {
        if (AreThereAnyChangesOnManageFees(PendingApprovalGrid.PendingApprovalDataHelperOnRefresh, new Array(command, loanId)) == true)
            return;

        PendingApprovalGrid.PendingApprovalDataOnBegin();
        PendingApprovalGrid.PendingApprovalAjaxCall(command, true, loanId);
    },
    PendingApprovalDataHelperOnChangeCommand: function (command, loanId) {
        if (AreThereAnyChangesOnManageFees(PendingApprovalGrid.PendingApprovalDataHelperOnChangeCommand, new Array(command, loanId)) == true)
            return;

        PendingApprovalGrid.PendingApprovalDataOnBegin();
        PendingApprovalGrid.PendingApprovalAjaxCall(command, false, loanId, true, false);
        UpdateNumberOfRecordsInTabs();
    },
    PendingApprovalDataOnFailure: function (data) {
        HideProcessingInfo();
    },
    GetDefaultPendingApprovalCommand: function (loanId) {
        $.ajax({
            url: "/Loan/GetDefaultPendingApprovalCommand",

            data: "loanId=" + loanId,
            type: "post",
            success: function (data) {
                if (data.success) {
                    ConciergeCommandEmbedded.OpenConciergeEmbeddedCommand(data.action, WorkQueueTypes.PendingApproval, loanId, '');
                }
            }
        });
    },
    PendingApprovalAjaxCall: function (data, refresh, loanId, commandChanged, async) {
        $.ajax({
            type: "GET",
            url: "Command/Execute",
            cache: false,
            async: async,
            data: data,
            dataType: "html",
            success: function (result) {
                $("#mainsection").html(result);
                PendingApprovalGrid.PendingApprovalDataOnSuccess(refresh, loanId, commandChanged);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                PendingApprovalGrid.PendingApprovalDataOnFailure();
            }
        });
    },

    PendingApprovalDataOnSuccess: function (refresh, loanId, commandChanged) {

        BindOfficerTaskEvents();
        BindRightClickMenu();

        $("#tabPendingApprovalCount").html($("#nooftasks2").html());

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
            var $selectedLoan = $(".pendingapprovaltable .loanid").filter(function () { return $(this).text().trim() == loanId.trim(); });
            if ($selectedLoan.length > 0)
                $selectedLoan.closest("tr").trigger("click");
            else if ($(".tablelistselected").length == 0)
                $("[id='task_0P']").click();
        }
        else if ($(".tablelistselected").length == 0) {
            $("[id='task_0P']").click();
            HideProcessingInfo();
        }
    },

    PendingApprovalShowLockRequestedPopup: function (elementNumber) {
        $('.divLockRequestedPopup.' + elementNumber).show();
    },

    PendingApprovalHideLockRequestedPopup: function (elementNumber) {
        $('.divLockRequestedPopup.' + elementNumber).hide();
    }
};
