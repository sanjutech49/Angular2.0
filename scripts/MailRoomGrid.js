MailRoomGrid = {
    MailRoomDataOnBegin: function (data) {
        ShowProcessingInfo();
        classRemover();
        $('#mailroomtab').addClass('queueselected');
        $('#mailroomtab').parent().addClass('selected');
        $("#borrowerDetailsSection").hide();
        $("#loanDetailsSection").hide();
        ConciergeCommandEmbedded.CloseIFrame();
    },
    MailRoomDataOnComplete: function (data) {
        HideProcessingInfo();
    },
    MailRoomDataHelper: function (data) {
        if (AreThereAnyChangesOnManageFees(MailRoomGrid.MailRoomDataHelper, new Array(data)) == true)
            return;

        MailRoomGrid.MailRoomDataOnBegin();
        MailRoomGrid.MailRoomAjaxCall(data, false, "");
    },
    MailRoomDataHelperOnRefresh: function (command, loanId) {
        if (AreThereAnyChangesOnManageFees(MailRoomGrid.MailRoomDataHelperOnRefresh, new Array(command, loanId)) == true)
            return;

        MailRoomGrid.MailRoomDataOnBegin();
        MailRoomGrid.MailRoomAjaxCall(command, true, loanId);
    },
    MailRoomDataHelperOnChangeCommand: function (command, loanId) {
        if (AreThereAnyChangesOnManageFees(MailRoomGrid.MailRoomDataHelperOnRefresh, new Array(command, loanId)) == true)
            return;

        MailRoomGrid.MailRoomDataOnBegin();
        MailRoomGrid.MailRoomAjaxCall(command, false, loanId, true, false);
        UpdateNumberOfRecordsInTabs();
    },
    MailRoomDataOnFailure: function (data) {
        HideProcessingInfo();
        BindOfficerTaskEvents();
    },

    MailRoomAjaxCall: function (data, refresh, loanId, commandChanged, async) {
        $.ajax({
            type: "GET",
            url: "Command/Execute",
            cache: false,
            async: async,
            data: data,
            dataType: "html",
            success: function (result) {
                $("#mainsection").html(result);
                MailRoomGrid.MailRoomDataOnSuccess(refresh, loanId, commandChanged);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                MailRoomGrid.MailRoomDataOnFailure();
            }
        });
    },
    MailRoomDataOnSuccess: function (refresh, loanId, commandChanged, setFirst) { 
        $("#tabMailRoomCount").html($("#nooftasks2").html());
        BindOfficerTaskEvents();
        BindRightClickMenu();

        if ($("#nooftasks2").html() == "0") {
            ConciergeCommandEmbedded.CloseIFrame();
            AdditionalViews.CloseAdditionalViewSection();
            HideProcessingInfo();
        }

        if (setFirst != undefined && setFirst == true && $("[id='task_0P']") && $("[id='task_0P']").attr("id") != undefined) {
            SelectedTask('0P', 'mailroomtablelist first last', false, 'MailRoom');
        }

        if (commandChanged == true) {
            HideProcessingInfo();
            return;
        }

        if (refresh == true && loanId != "") {
            var $selectedLoan = $(".mailroomtable .loanid").filter(function () { return $(this).text().trim() == loanId.trim(); });
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

    MailRoomShowLockRequestedPopup: function (elementNumber) {
        $('.divLockRequestedPopup.' + elementNumber).show();
    },

    MailRoomHideLockRequestedPopup: function (elementNumber) {
        $('.divLockRequestedPopup.' + elementNumber).hide();
    },

    MailRoomChangeStatusesToSent: function (loanId, element) {     
        element.stopPropagation();
        ShowProcessingInfo();

        $.ajax({
            type: "GET",
            url: "Command/Execute",
            cache: false,
            async: false,
            data: 'command=OpenMailRoomTab,ChangeStatuses=true,Refresh=true,' + 'LoanId=' + loanId,
            dataType: "html",
            success: function (result) {
                HideProcessingInfo();
                $("#mainsection").html(result);
                MailRoomGrid.MailRoomDataOnSuccess(false, loanId, false, true);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                MailRoomGrid.MailRoomDataOnFailure();
            }
        });

    },

    MailRoomOpenDisclosures: function (loanId, documentClassId, userAccountId) {
        ShowProcessingInfo();
        $.ajax({
            type: "GET",
            url: "MailRoom/CreateCoverLetter",
            cache: false,
            data: { LoanId: loanId, DocumentClassId: documentClassId, UserAccountId: userAccountId },
            dataType: "html",
            success: function (result) {
                HideProcessingInfo();
                ConciergeCommandEmbedded.OpenConciergeEmbeddedCommand(WorkQueueCommands.ManageDisclosures, WorkQueueTypes.MailRoom, loanId);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                MailRoomGrid.MailRoomDataOnFailure();
            }
        });
    } 

};

function DueDateOnClick( ruleType, ruleDate, id ) {
  
    //var width = $(this).width();
    var pos = $("#" + id).offset();
  
    $('#PopupContainerDueDateForClick').css({
        left: (pos.left + 75) + 'px',
        top: pos.top - 14 + 'px'
    });

    $(".dueDateContentDivMessage").html(ruleType + ": " + ruleDate);

    $('#PopupContainerDueDateForClick').show();    
}
