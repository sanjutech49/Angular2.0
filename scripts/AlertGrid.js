AlertGrid = {
    AlertDataOnBegin: function (data) {
        ShowProcessingInfo();
        classRemover();
        $('#alertstab').addClass('queueselected');
        $('#alertstab').parent().addClass('selected');
        $("#borrowerDetailsSection").hide();
        $("#loanDetailsSection").hide();
        ConciergeCommandEmbedded.CloseIFrame();
    },
    AlertDataOnComplete: function (data) {
        HideProcessingInfo();
    },
    AlertDataOnFailure: function (data) {
        HideProcessingInfo();
    },
    AlertDataHelper: function (data) {
        if (AreThereAnyChangesOnManageFees(AlertGrid.AlertDataHelper, new Array(data)) == true)
            return;

        AlertGrid.AlertDataOnBegin();
        AlertGrid.AlertAjaxCall(data, false, "");
    },

    AlertDataHelperOnRefresh: function (command, loanId) {
        if (AreThereAnyChangesOnManageFees(AlertGrid.AlertDataHelperOnRefresh, new Array(command, loanId)) == true)
            return;

        AlertGrid.AlertDataOnBegin();
        AlertGrid.AlertAjaxCall(command, true, loanId);
    },
    AlertDataHelperOnChangeCommand: function (command, loanId) {
        if (AreThereAnyChangesOnManageFees(AlertGrid.AlertDataHelperOnChangeCommand, new Array(command, loanId)) == true)
            return;

        AlertGrid.AlertDataOnBegin();
        AlertGrid.AlertAjaxCall(command, false, loanId, true, false);
      //  UpdateNumberOfRecordsInTabs();
    },
    AlertAjaxCall: function (data, refresh, loanId, commandChanged, async) {
        $.ajax({
            type: "GET",
            url: "Command/Execute",
            cache: false,
            async: async,
            data: data,
            dataType: "html",
            success: function (result) {
                $("#mainsection").html(result);
                AlertGrid.AlertDataOnSuccess(refresh, loanId, commandChanged);
                UpdateNumberOfRecordsInTabs();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                AlertGrid.AlertDataOnFailure();
                UpdateNumberOfRecordsInTabs();
            }
        });
    },

    AlertDataOnSuccess: function (refresh, loanId, commandChanged) {

        BindOfficerTaskEvents();
        BindRightClickMenu();      
        //$("#tabAlertsCount").html($("#nooftasks2").html());


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
            var $selectedLoan = $(".alerttable .loanid").filter(function () { return $(this).text().trim() == loanId.trim(); });
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
