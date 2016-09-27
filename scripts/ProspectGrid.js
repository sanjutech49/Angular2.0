
ProspectGrid = {
    ProspectDataOnBegin: function (data) {
        ShowProcessingInfo();
        classRemover();
        $('#prospectstab').addClass('queueselected');
        $('#prospectstab').parent().addClass('selected');
        $("#borrowerDetailsSection").hide();
        $("#loanDetailsSection").hide();
        ConciergeCommandEmbedded.CloseIFrame();
    },
    ProspectDataOnComplete: function (data) {
        $('#FilterContext').val('Contact');
        HideProcessingInfo();       
    },
    ProspectDataOnFailure: function (data) {
        HideProcessingInfo();        
    },
    ProspectDataHelper: function (data) {
        if (AreThereAnyChangesOnManageFees(ProspectGrid.ProspectDataHelper, new Array(data)) == true)
            return;
        ProspectGrid.ProspectDataOnBegin();
        ProspectGrid.ProspectAjaxCall(data, false, "");       
    },

    ProspectDataHelperOnRefresh: function (command, loanId, prospectId) {
        if (AreThereAnyChangesOnManageFees(ProspectGrid.ProspectDataHelperOnRefresh, new Array(command, loanId, prospectId)) == true)
            return;

        ProspectGrid.ProspectDataOnBegin();
        ProspectGrid.ProspectAjaxCall(command, true, loanId, false, true, prospectId);
    },
    ProspectDataHelperOnChangeCommand: function (command, loanId, prospectId) {
        if (AreThereAnyChangesOnManageFees(ProspectGrid.ProspectDataHelperOnChangeCommand, new Array(command, loanId, prospectId)) == true)
            return;
        
        ProspectGrid.ProspectDataOnBegin();
        ProspectGrid.ProspectAjaxCall(command, false, loanId, true, false, prospectId);
        UpdateNumberOfRecordsInTabs();
    },
    ProspectDataNewLoadAfterGetStarted: function (data, loanid) {
        if (AreThereAnyChangesOnManageFees(ProspectGrid.NewLoanApplicationDataHelper, new Array(data, loanid)) == true)
            return;
        
        ProspectGrid.ProspectAjaxCall(data, true, loanid);
    },
    ProspectDataOnSuccess: function (refresh, loanId, commandChanged, prospectId) {

        $("#tabProspectsCount").html($("#nooftasks2").html());       

        if ($("#nooftasks2").html() == "0") {
            $(".t8").removeAttr("colSpan");
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
            if (loanId.trim() != "00000000-0000-0000-0000-000000000000") {
                var $selectedLoan = $(".prospecttable .loanid").filter(function () { return $(this).text().trim() == loanId.trim(); });
                if ($selectedLoan.length > 0)
                    $selectedLoan.closest("tr").trigger("click");
            }
            else if (prospectId != undefined) {
                var $selectedProspect = $(".prospecttable .prospectid").filter(function () { return $(this).text().trim() == prospectId.trim(); });
                if ($selectedProspect.length > 0)
                    $selectedProspect.closest("tr").trigger("click");
            }
            else if ($(".tablelistselected").length == 0)
                $("[id='task_0P']").click();
        }

         if ($(".tablelistselected").length == 0) {
            $("[id='task_0P']").click();
            HideProcessingInfo();
        } 
    },
    ProspectAjaxCall: function (data, refresh, loanId, commandChanged, async, prospectId) {
        $.ajax({
            type: "GET",
            url: "Command/Execute",
            cache: false,
            async: async,
            data: data,
            dataType: "html",
            success: function (result) {
                $("#mainsection").html(result);
                ProspectGrid.ProspectDataOnSuccess(refresh, loanId, commandChanged, prospectId);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                ProspectGrid.ProspectDataOnFailure();
            },
            complete: function (jqXHR, textStatus) {
                ProspectGrid.ProspectDataOnComplete();
            }
        });
    }
};
