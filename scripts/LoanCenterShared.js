/// <reference path="jquery.ajax.antiCSRF.js" />
/// <reference path="~/Scripts/ConciergeCommandEmbedded.js" />

// Change class of task on click
var stask = ' ';
var kklkinitialclass = '';
var sarrow = ' ';
var ftask = ' ';
var startNewProspectHeight = 0;
var asyncCall_SelectedTask_Signal = false;
var asyncCall_SelectedTask_fnumber;
var asyncCall_SelectedTask_initialclass;
var sessionTimeoutId;
var loanParentRowId = '';
var childLoanIndicatorId;
var currentQueue;
var autoSelect = false;
var collapseBorrowerSection = true;
var selectedRowId;

var _parentLoanId = '00000000-0000-0000-0000-000000000000';

function getParameterFromUrl(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function SelectedTask(fnumber, initialclass, isChild, queue, rowId) {

    var mouseClick;
    if (window.event)
    {
        mouseClick = window.event.which;
    }
    var loanCenterVersion = getParameterFromUrl('v');

    if (selectedRowId != rowId || selectedRowId == null)
    {
        selectedRowId = rowId;
        $("#borrowerDetailsSection").hide();
        $("#loanDetailsSection").hide();
        ConciergeCommandEmbedded.CloseIFrame();
    }


if((!isChild && (loanParentRowId != $('[id=task_'+fnumber+']').attr('id') || (loanParentRowId == $('[id=task_'+fnumber+']').attr('id') && !$('[id*=task_'+fnumber+'].childloan').eq(0).is(':visible'))))
    || (isChild && !$('[id*=task_'+fnumber+'].childloan').eq(0).is(':visible')))
    {   

    if($('#borrowerdetailscontent').is(':visible') && loanParentRowId == $('[id=task_'+fnumber+']').attr('id') && currentQueue == queue) collapseBorrowerSection = false;

    // $("#minimizeborrowerdetails").click();
    $('[id='+loanParentRowId+']').addClass('last');
    $('[id='+childLoanIndicatorId+']').addClass('childIndicator');

    $('[id*=task_].childloan').slideUp(200);
    if(!$('[id*=task_'+fnumber+'].childloan').eq(0).is(':visible') &&  $('[id=childIndicator_'+fnumber+']').is(':visible'))
    {
        $('[id=childIndicator_'+fnumber+']').removeClass('childIndicator');
        $('[id=task_'+fnumber+']').removeClass('last');
        $('[id*=task_'+fnumber+'].childloan').slideDown(200);
    }
    loanParentRowId = $('[id=task_'+fnumber+']').attr('id');
    childLoanIndicatorId = $('[id=childIndicator_'+fnumber+']').attr('id');
    currentQueue = queue;
 }
    // If Manage Fees section is opened, check if all changes are saved
    if (AreThereAnyChangesOnManageFees(SelectedTask, new Array(fnumber, initialclass)) == true)
        return;

    if (loanCenterVersion != "3" || (mouseClick && mouseClick != 1))
    {
     
       // Check if another process is calling ajax already, if true then remember all input values and discard current call
       if (asyncCall_SelectedTask_Signal == true) {
           asyncCall_SelectedTask_fnumber = fnumber;
           asyncCall_SelectedTask_initialclass = initialclass;
           return;
       }
        //hide
       HideSpecificSection();

       //Signal that current process has entered and clear parameter variables
       asyncCall_SelectedTask_Signal = true;
       asyncCall_SelectedTask_fnumber = null;
       asyncCall_SelectedTask_initialclass = null;

    }
   

    if (stask != ' ') {
        $("[id^='" + ftask + "']").removeClass("tablelistselected");
        $("[id='" + sarrow + "']").attr("class", "biggreen");
    }
    sarrow = 'arrowdiv_' + fnumber;
    stask = 'task_' + fnumber;
    $("[id^='" + stask + "']").addClass("tablelistselected");
    $("[id='" + sarrow + "']").attr("class", "biggreens");


    var alreadyLoaded = false;

    if (loanCenterVersion != "3" || (mouseClick && mouseClick != 1)) {

        if (rowId != null)
        {
            alreadyLoaded = $("[id='" + rowId + "']").attr("DetailsLoaded");
        }
        else
        {
            alreadyLoaded = $("[id='" + stask + "']").attr("DetailsLoaded");
        }
    }

    $("[DetailsLoaded]").removeAttr("DetailsLoaded");

    ftask = stask;
    kinitialclass = initialclass;

    if (alreadyLoaded != "true" || ($("#detailsSection").css('display') == 'none' && $("#loanDetailsSection").css('display') == 'none')) {
        var row = $("[id='" + stask + "']");
        var loanId = row.find(".loanid").first().text().trim();
        _parentLoanId = loanId;
        var prospectId = row.find(".prospectid").first().text().trim();
        var workQueueType = $("#currentWorkQueueType").text().trim();
        if (loanCenterVersion != "3" || (mouseClick && mouseClick != 1)) {

            if (workQueueType == WorkQueueTypes.Prospects) {
                if (loanId != "" || prospectId != "") {
                    ManageProspects.ManageProspectsLoad(loanId, prospectId);
                }
            }
            else if (workQueueType == WorkQueueTypes.Alert) {
                if (loanId != "" || prospectId != "") {
                    ConciergeCommandEmbedded.OpenConciergeEmbeddedCommand(WorkQueueCommands.ManageAlerts, WorkQueueTypes.Alert, loanId, prospectId);
                }
            }
            else if ( workQueueType == WorkQueueTypes.ReviewRequired ) {
                var counter = 0;
                var gotoactivityId = -1;
                var gotoLoanId = loanId;
                $("[id^='" + stask + "']").each(function(index) {
                    var selRoW = $("[id='" + stask + "']");
                    if (index > 0)
                        selRoW = $("[id='" + stask + index + "']");
                    var activityId = selRoW.find(".activityId").first().text().trim();
                    if (activityId > 0) {
                        counter++;
                        gotoactivityId = activityId;
                        gotoLoanId = selRoW.find(".loanid").first().text().trim();
                    }
                });

                if (counter == 1) {
                    switch (gotoactivityId) {
                        case "1":
                            ConciergeCommandEmbedded.OpenConciergeEmbeddedCommand(WorkQueueCommands.ManageDisclosures, WorkQueueTypes.PendingApproval, gotoLoanId, prospectId);
                            break;
                        case "2":
                            Appraisal.OpenAppraisalFormCommand(gotoLoanId, prospectId);
                            break;
                        case "3":
                            ConciergeCommandEmbedded.OpenConciergeEmbeddedCommand(WorkQueueCommands.ManageDocuments, WorkQueueTypes.PendingApproval, gotoLoanId, prospectId);
                            break;
                        case "4":
                            break;
                        case "5":
                            break;
                        case "6":
                            break;
                        case "7":
                            Appraisal.OpenAppraisalFormCommand(gotoLoanId, prospectId);
                            break;
                        case "8":
                            ConciergeCommandEmbedded.OpenConciergeEmbeddedCommand(WorkQueueCommands.ManageDisclosures, WorkQueueTypes.PendingApproval, gotoLoanId, prospectId);
                            break;
                        case "9":
                            break;
                    }
                } else {
                    $("#detailsSection").html("");
                    $("#detailsSection").hide();
                }
            }
            else if ( workQueueType == WorkQueueTypes.PreApproval ) {
                var counter = 0;
                var gotoactivityId = -1;
                var gotoLoanId = loanId;
                var selRoW;
               $("[id^='" + stask + "']").each(function(index) {
                    selRoW = $("[id='" + stask + "']");
                    if (index > 0)
                        selRoW = $("[id='" + stask + index + "']");
                    var activityId = selRoW.find(".activityId").first().text().trim();
                    if (activityId > 0) {
                        counter++;
                        gotoactivityId = activityId;
                        gotoLoanId = selRoW.find(".loanid").first().text().trim();
                    }
                });

                switch (gotoactivityId) {
                    case "3":
                        var conciergeName = selRoW.find(".conciergeName").first().text().trim();
                        if (conciergeName == 'Pending')
                            AssignLoanInfo.AssignLoanInfoLoad(loanId);
                        else
                            ConciergeCommandEmbedded.OpenConciergeEmbeddedCommand(WorkQueueCommands.ManageDocuments, WorkQueueTypes.PreApproval, gotoLoanId);
                        break;
                    default:
                        ExecuteRightClickAction('LoanDetails', WorkQueueTypes.PreApproval, loanId);
                        break;

                }

            }

            else if (workQueueType == WorkQueueTypes.OrderRequested || workQueueType == WorkQueueTypes.OrderProcessed ||
                    workQueueType == WorkQueueTypes.OrderDeliveredForReview || workQueueType == WorkQueueTypes.OrderException) {

                Appraisal.OpenAppraisalFormCommand(loanId, '');
            }

            else if (workQueueType == WorkQueueTypes.MailRoom) {

                var documentId = row.find(".documentId").first().text().trim();
                MailRoomGrid.MailRoomOpenDisclosures(loanId, documentId);
            }

            else {
                $("#detailsSection").html("");
                $("#detailsSection").hide();
            }

            if (loanId != "" && loanId != '00000000-0000-0000-0000-000000000000') {
                $("#loanDetailsSection").show();
                $("#borrowerDetailsSection").show();
                AdditionalViews.AdditionalViewSection(loanId, prospectId);
                AdditionalViews.BorrowerInformationSection(loanId, prospectId, collapseBorrowerSection);
                collapseBorrowerSection = true;
            }
            else {
                $("#loanDetailsSection").hide();
                $("#borrowerDetailsSection").hide();
                HideProcessingInfo();
            }
        }

        if (loanCenterVersion != "3" || (mouseClick && mouseClick != 1)) {
            $("[id='" + stask + "']").attr("DetailsLoaded", "true");
        }

        $('#listandpage').css('height','auto');
    

        if (loanCenterVersion != "3" || (mouseClick && mouseClick != 1)) {

            //Check if some other process has tried to make an ajax call and if true make another call with remembered values
            if (asyncCall_SelectedTask_fnumber != null) {
                asyncCall_SelectedTask_Signal = false;
                SelectedTask(asyncCall_SelectedTask_fnumber, asyncCall_SelectedTask_initialclass);
                return;
            }

            //Signal that current process has finished with ajax call and clear parameter variable
            asyncCall_SelectedTask_Signal = false;
            asyncCall_SelectedTask_fnumber = null;
            asyncCall_SelectedTask_initialclass = null;
        }

        if (angular.element(document.getElementById('divMainNavBar')).scope() != undefined)
            angular.element(document.getElementById('divMainNavBar')).scope().updateValuesOnRowChange();
        
    }
}

function LoadAdditionalViewSection(row) {
    var alreadyLoaded = row.attr("DetailsLoaded");
    if (alreadyLoaded == "true")
        return;

    var loanId = row.find(".loanid").first().text().trim();
    var prospectId = row.find(".prospectid").first().text().trim();

    if (loanId != "")
        AdditionalViews.AdditionalViewSection(loanId, prospectId);

    $("[DetailsLoaded]").removeAttr("DetailsLoaded");

    row.attr("DetailsLoaded", "true");
}

function MaxmizeBorrowerSection() {
    $("#borrowerdetailshead").removeClass('borrowerdetailshead2');
    $("#borrowerdetailscontent").removeClass('borrowerdetailscontent2');
    $("#borrowerdetailscontent").addClass('borrowerdetailscontent');
    $("#borrowerdetailshead").addClass('borrowerdetailshead');
    $("#borrowerdetailscontent").slideDown(500, function () {
        $("#borrowerdetailsminmax").removeClass('max');
        $("#borrowerdetailsminmax").addClass('min');
    });
}
function SelectRow(rowId, initialclass, childLoan) {
    rowId = rowId.match(/[^]*P/);
    a = rowId.toString().substring(5, 7);
    SelectedTask(a,initialclass,childLoan,   '', rowId);
}

function CloseCommandSection() {
    $("#detailsSection").slideUp(400);
    $("#detailsSection").html("");
}

function UpdateControlSuccess(control, data) {
    // TODO: Replace control data with new data
    $('#Appointment').unblock();
}

function HideSpecificSection() {
    $("#rateOptionsDetailsSection").html("");
    $("#rateOptionsDetailsSection").hide();
}

function DidLoanSelectionInGridChanged(loanId) {
    var hdnLoanDetailsLoanId = $('#hdnLoanDetailsLoanId').val();
    if (loanId == undefined || loanId == null || hdnLoanDetailsLoanId == undefined)
        return true;

    var loanDetailsLoanId = loanId.trim().toLowerCase();
    var newlySelectedLoanId = hdnLoanDetailsLoanId.trim().toLowerCase();

    return loanDetailsLoanId != newlySelectedLoanId;
}

function ExecuteRightClickAction(action, currentQueue, loanId, prospectId, userAccountId, documentId) {

    if (action == "LoanDetails" && !loanDetailsPopupOpened && !DidLoanSelectionInGridChanged(loanId) &&
        LoanDetails.InitializeConfirmationPopup(ExecuteRightClickAction, new Array(action, currentQueue, loanId, prospectId, userAccountId), 
        "Loan Details are currently open for this loan. <br/>If you proceed, your current changes will not be saved.", "Continue, Don't Save", "Cancel") == true) 
        return;

    if (AreThereAnyChangesOnManageFees(ExecuteRightClickAction, new Array(action, currentQueue, loanId, prospectId, userAccountId)) == true)
        return;

    HideSpecificSection();
    //AdditionalViews.BorrowerInformationSection(_parentLoanId, prospectId);
    collapseBorrowerSection = true;
    AdditionalViews.AdditionalViewSection(loanId, prospectId);
    AdditionalViews.BorrowerInformationSection(loanId, prospectId, collapseBorrowerSection);
    
    
    switch (action) {
        case "AssignLoanInfo":
            AssignLoanInfo.AssignLoanInfoLoad(loanId);
            break;
        case "GetStarted":
            GetStarted.StartNewProspect('command=GetStartedLoad');
            break;
        case "ManageActivities":
            ConciergeCommandEmbedded.OpenConciergeEmbeddedCommand(WorkQueueCommands.ManageActivities, currentQueue, loanId, prospectId);
            break;
        case "ManageAlerts":
            ConciergeCommandEmbedded.OpenConciergeEmbeddedCommand(WorkQueueCommands.ManageAlerts, currentQueue, loanId, prospectId);
            break;
        case "ManageAppraisal":
            //ConciergeCommandEmbedded.OpenConciergeEmbeddedCommand(WorkQueueCommands.ManageAppraisal, currentQueue, loanId, prospectId);
            Appraisal.OpenAppraisalFormCommand(loanId, prospectId);
            break;
        case "ManageCredit":
            ConciergeCommandEmbedded.OpenConciergeEmbeddedCommand(WorkQueueCommands.ManageCredit, currentQueue, loanId, prospectId);
            break;
        case "ManageDisclosures":
            if (currentQueue == WorkQueueTypes.MailRoom){
                MailRoomGrid.MailRoomOpenDisclosures(loanId, documentId, userAccountId);
            }
            else
                ConciergeCommandEmbedded.OpenConciergeEmbeddedCommand(WorkQueueCommands.ManageDisclosures, currentQueue, loanId, prospectId);
            break;
        case "ManageDocuments":
            ConciergeCommandEmbedded.OpenConciergeEmbeddedCommand(WorkQueueCommands.ManageDocuments, currentQueue, loanId, '');
            break;
        case "ManageLoan":
            ConciergeCommandEmbedded.OpenConciergeEmbeddedSubCommand(WorkQueueCommands.ManageLoan, currentQueue, loanId, prospectId, 1);
            break;
        case "ManageFees":
            ManageFees.ManageFeesLoad(loanId, prospectId);
            break;
        case "ManageLoanApplication":
            ConciergeCommandEmbedded.OpenConciergeEmbeddedCommand(WorkQueueCommands.ManageLoanApplication, currentQueue, loanId, prospectId);
            break;
        case "ManageProspects":
            ManageProspects.ManageProspectsLoad(loanId, prospectId, true);
            break;
        case "LoanDetails":
            $("#detailsSection").hide();
            $("#detailsSection").html("");
            LoanDetails.LoanDetailsCommand(currentQueue, loanId, prospectId);
            break;
        case "LoanServices":
            LoanServices.LoanServicesLoad(loanId, true);
            break;
        case "ViewInBorrower":
            ViewInBorrower(loanId, userAccountId);
            break;
        case "FileManagement":
            ConciergeCommandEmbedded.OpenConciergeEmbeddedCommand(WorkQueueCommands.FileManagement, currentQueue, loanId, prospectId);
            break;
        case "disabled":
            return false;
            break;
        case "AusExportDU":
            Aus.DUSubmittButton(loanId);
            break;
        case "AusExportLP":
            Aus.LPSubmittButton(loanId);           
            break;
        case "TESTCreateServiceEvent":
            TESTCreateServiceEvent(loanId);
            break;
        default:
            break;
    }
}

function TESTCreateServiceEvent(loanId) {
    ShowProcessingInfo();
    $.ajax({
        type: "GET",
        url: 'Home/TESTCreateServiceEvent',
        data: 'LoanId=' + loanId,
        success: function (data) {
            if (data == 'True') {
                alert("New event was successfully submitted for processing");
            } else {
                alert("An error occuried while submittig event to processing");
            }
            HideProcessingInfo();
        },
        error: function () {
            alert("An error occuried while submittig event to processing");
            HideProcessingInfo();
        }
    });

}

function BindRightClickMenu() {

    // pending approval (peding disclosures). This supports context menu for creating test loans from pending disclosures
    $(".newloanapplicationtable").find(".newloanapplicationsubjects").contextMenu({
        menu: 'myMenuPendingApprovalGetStarted'
    },
	function (action, el, pos) {
        // the following code should be ignored since the desired behavior has been adddressed at the function: "SetTrianglePosition()"
        TriangleHide(); 
	});

    // prospect
    $(".prospecttable").find(".prospectsubjects").contextMenu({
        menu: 'myMenuProspectsGetStarted'
    },
	function (action, el, pos) {
	    ExecuteRightClickAction(action, WorkQueueTypes.Prospects, null, null);
	  
	});

    $(".prospecttable:not(.childloan),.prospecttablelist:not(.childloan)").contextMenu({
        menu: 'myMenuProspects'
    },
	function (action, el, pos) {
        SelectRow($(el).attr("id"), 'prospecttablelist', false);
	    LoadAdditionalViewSection($(el));
	    var loanId = $(el).find('.loanid').text().trim();
	    var prospectId = $(el).find('.prospectid').text().trim();
	    var userAccountId = $(el).find('.userAccountId').text().trim();
	    ExecuteRightClickAction(action, WorkQueueTypes.Prospects, loanId, prospectId, userAccountId);
	   
	});

    $(".prospecttable.childloan,.prospecttablelist.childloan").contextMenu({
        menu: 'myMenuProspectsChildLoan'
    },
	function (action, el, pos) {
	    SelectRow($(el).attr("id"), 'prospecttablelist', true);
	    var loanId = $(el).find('.loanid').text().trim();
        var prospectId = $(el).find('.prospectid').text().trim();
	    ExecuteRightClickAction(action, WorkQueueTypes.Prospects, loanId, prospectId);
	   
	});

    // pipeline
    $(".pipelinetable").find(".pipelinesubjects").contextMenu({
        menu: 'myMenuPipelineGetStarted'
    },
	function (action, el, pos) {
        var loanId = $(el).find('.loanid').text().trim();
	    ExecuteRightClickAction(action, WorkQueueTypes.Pipeline, loanId, null);
	   
	});


	$(".mailroomtablelist,.mailroomtablelistduedate").contextMenu({
	    menu: 'myMenuMailRoom'
	},
	function (action, el, pos) {   
	    SelectRow($(el).attr("id"), 'mailroomtablelist', false);
	    LoadAdditionalViewSection($(el));
	    var loanId = $(el).find('.loanid').text().trim();        
	    var documentId = $(el).find('.documentId').text().trim();

	    ExecuteRightClickAction(action, WorkQueueTypes.MailRoom, loanId, '', 0, documentId);
	    
	});


    $(".pipelinetablelist:not(.childloan),.pipelinetablelistduedate:not(.childloan)").contextMenu({
        menu: 'myMenuPipeline'
    },
	function (action, el, pos) {
	    SelectRow($(el).attr("id"), 'pipelinetablelist', false);
	    LoadAdditionalViewSection($(el));
	    var loanId = $(el).find('.loanid').text().trim();
	    ExecuteRightClickAction(action, WorkQueueTypes.Pipeline, loanId, '');
	   
	});

	$(".mailroomtablelist,.mailroomtablelistduedate").contextMenu({
	    menu: 'myMenuMailRoom'
	},
	function (action, el, pos) {   
	    SelectRow($(el).attr("id"), 'mailroomtablelist', false);
	    LoadAdditionalViewSection($(el));
	    var loanId = $(el).find('.loanid').text().trim();        
	    var documentId = $(el).find('.documentId').text().trim();

	    ExecuteRightClickAction(action, WorkQueueTypes.MailRoom, loanId, '', 0, documentId);
	   
	});

    $(".pipelinetablelist.childloan,.pipelinetablelistduedate.childloan").contextMenu({
        menu: 'myMenuPipelineChildLoan'
    },
	function (action, el, pos) {  
	    SelectRow($(el).attr("id"), 'pipelinetablelist', true);
	    var loanId = $(el).find('.loanid').text().trim();
	    ExecuteRightClickAction(action, WorkQueueTypes.Pipeline, loanId, '');
	    
	});

    $(".alerttablelist:not(.childloan),.alerttablelistduedate:not(.childloan)").contextMenu({
        menu: 'myMenuAlerts'
    },
	function (action, el, pos) {
	    SelectRow($(el).attr("id"), 'newloanapplicationtablelist', false);
	    LoadAdditionalViewSection($(el));
	    var loanId = $(el).find('.loanid').text().trim();
	    ExecuteRightClickAction(action, WorkQueueTypes.Alert, loanId, '');
	   
	});
    
     $(".alerttablelist.childloan,.alerttablelistduedate.childloan").contextMenu({
        menu: 'myMenuAlertsChildLoan'
    },
	function (action, el, pos) {
	    SelectRow($(el).attr("id"), 'newloanapplicationtablelist', true);
	    var loanId = $(el).find('.loanid').text().trim();
	    ExecuteRightClickAction(action, WorkQueueTypes.Alert, loanId, '');
	  
	});

    $(".completedloanstablelist:not(.childloan),.completedloanstablelistduedate:not(.childloan)").contextMenu({
        menu: 'myMenuCompleted'
    },
	function (action, el, pos) {
	    $(el).click();
	    var loanId = $(el).find('.loanid').text().trim();

	    ExecuteRightClickAction(action, WorkQueueTypes.Completed, loanId, '');
	  
	});

    $(".completedloanstablelist.childloan,.completedloanstablelistduedate.childloan").contextMenu({
        menu: 'myMenuCompletedChildLoan'
    },
	function (action, el, pos) {
	    $(el).click();
	    var loanId = $(el).find('.loanid').text().trim();

	    ExecuteRightClickAction(action, WorkQueueTypes.Completed, loanId, '');
	   
	});

    $(".canceltablelist:not(.childloan),.canceltablelistduedate:not(.childloan)").contextMenu({
        menu: 'myMenuCancel'
    },
	function (action, el, pos) {
	    $(el).click();
	    var loanId = $(el).find('.loanid').text().trim();

	    ExecuteRightClickAction(action, WorkQueueTypes.Cancel, loanId, '');
	    
	});

    $(".canceltablelist.childloan,.canceltablelistduedate.childloan").contextMenu({
        menu: 'myMenuCancelChildLoan'
    },
	function (action, el, pos) {
	    $(el).click();
	    var loanId = $(el).find('.loanid').text().trim();

	    ExecuteRightClickAction(action, WorkQueueTypes.Cancel, loanId, '');
	 
	});

    // new loan application
    $(".newloanapplicationtablelist:not(.childloan),.newloanapplicationtablelistduedate:not(.childloan)").contextMenu({
        menu: 'myMenuNewLoanApplication'
    },
	function (action, el, pos) {
	    SelectRow($(el).attr("id"), 'newloanapplicationtablelist', false);
	    LoadAdditionalViewSection($(el));
	    var loanId = $(el).find('.loanid').text().trim();
	    ExecuteRightClickAction(action, WorkQueueTypes.NewLoanApplications, loanId, '');
	   
	});

      $(".newloanapplicationtablelist.childloan,.newloanapplicationtablelistduedate.childloan").contextMenu({
        menu: 'myMenuNewLoanApplicationChildLoan'
    },
	function (action, el, pos) {
	    SelectRow($(el).attr("id"), 'newloanapplicationtablelist', true);
	    var loanId = $(el).find('.loanid').text().trim();
	    ExecuteRightClickAction(action, WorkQueueTypes.NewLoanApplications, loanId, '');
	   
	});

    // pending approval
    $(".pendingapprovaltablelist:not(.childloan), .pendingapprovaltablelistduedate:not(.childloan)").contextMenu({
        menu: 'myMenuPendingApproval'
    },
	function (action, el, pos) {
	    SelectRow($(el).attr("id"), 'pendingapprovaltablelist', false);
	    LoadAdditionalViewSection($(el));
	    var loanId = $(el).find('.loanid').text().trim();
	    ExecuteRightClickAction(action, WorkQueueTypes.PendingApproval, loanId, '');

	});

     $(".pendingapprovaltablelist.childloan, .pendingapprovaltablelistduedate.childloan").contextMenu({
        menu: 'myMenuPendingApprovalChildLoan'
    },
	function (action, el, pos) {
	    SelectRow($(el).attr("id"), 'pendingapprovaltablelist', true);
	    LoadAdditionalViewSection($(el));
	    var loanId = $(el).find('.loanid').text().trim();
	    ExecuteRightClickAction(action, WorkQueueTypes.PendingApproval, loanId, '');
	    
	});
    
    // preapproval
    $(".preapprovaltablelist:not(.childloan),.preapprovaltablelistduedate:not(.childloan)").contextMenu({
        menu: 'myMenuPreApproval'
    },
	function (action, el, pos) {
	    $(el).click();
	    var loanId = $(el).find('.loanid').text().trim();
	    ExecuteRightClickAction(action, WorkQueueTypes.PreApproval, loanId, '');
	
	});

    $(".preapprovaltablelist.childloan,.preapprovaltablelistduedate.childloan").contextMenu({
        menu: 'myMenuPreApprovalChildLoan'
    },
	function (action, el, pos) {
	    $(el).click();
	    var loanId = $(el).find('.loanid').text().trim();
	    ExecuteRightClickAction(action, WorkQueueTypes.PreApproval, loanId, '');
	   
	});

    // order requested
    $(".orderrequestedtablelist,.orderrequestedtablelistduedate").contextMenu({
        menu: 'myMenuAppraisal'
    },
	function (action, el, pos) {
        $(el).click();          
	    var loanId = $(el).find('.loanid').text().trim();
	    ExecuteRightClickAction(action, WorkQueueTypes.OrderRequested, loanId, '');
	    
	});

    // order processed
    $(".orderprocessedtablelist,.orderprocessedtablelistduedate").contextMenu({
        menu: 'myMenuAppraisal'
    },
	function (action, el, pos) {
	    $(el).click();
	    var loanId = $(el).find('.loanid').text().trim();
	    ExecuteRightClickAction(action, WorkQueueTypes.OrderProcessed, loanId, '');
	    
	});

    // order delivered
    $(".orderdeliveredforreviewtablelist,.orderdeliveredforreviewtablelistduedate").contextMenu({
        menu: 'myMenuAppraisal'
    },
	function (action, el, pos) {
	    $(el).click();
	    var loanId = $(el).find('.loanid').text().trim();
	    ExecuteRightClickAction(action, WorkQueueTypes.OrderDeliveredForReview, loanId, '');
	   
	});

    // order exception
    $(".orderexceptiontablelist,.orderexceptiontablelistduedate").contextMenu({
        menu: 'myMenuAppraisal'
    },
	function (action, el, pos) {
	    $(el).click();
	    var loanId = $(el).find('.loanid').text().trim();
	    ExecuteRightClickAction(action, WorkQueueTypes.OrderException, loanId, '');
	    
	});

}

function ViewInBorrower(loanId, userAccountId) {
    ShowProcessingInfo();
    ConciergeCommandEmbedded.CloseConciergeCommandEmbedded();
    $.ajax({
        type: 'GET',
        url: '/Home/ViewInBorrower',
        cache: false,
        data: 'loanId=' + loanId + '&userAccId=' + userAccountId,
        success: function (data) {
            window.open(data, 'ViewInBorrowerSiteWindow', 'width=' + screen.width + ', height=' + screen.height + ',resizable=yes,top=0,left=0, scrollbars=yes');
            HideProcessingInfo();
        }
    });
}

function BindOfficerTaskEvents() {

    // Context Menu
    $(".tasktablelistduedate,.tasktablelist").contextMenu({
        menu: 'myMenu'
    },
	function (action, el, pos) {
	    alert(
		'Action: ' + action + '\n\n' +
		'Element ID: ' + $(el).attr('id') + '\n\n' +
		'X: ' + pos.x + '  Y: ' + pos.y + ' (relative to element)\n\n' +
		'X: ' + pos.docX + '  Y: ' + pos.docY + ' (relative to document)'
		);
	});

    if (document.getElementById('aftoday') != null && document.getElementById('officerTaskHeadderSpan').innerHTML == document.getElementById('aftoday').innerHTML) {
        document.getElementById('ftoday').setAttribute("class", "lowers");
    }
    else if (document.getElementById('aftomorrow') != null && document.getElementById('officerTaskHeadderSpan').innerHTML == document.getElementById('aftomorrow').innerHTML) {
        document.getElementById('ftomorrow').setAttribute("class", "lowers");
    }
    else if (document.getElementById('afthisweek') != null && document.getElementById('officerTaskHeadderSpan').innerHTML == document.getElementById('afthisweek').innerHTML) {
        document.getElementById('fthisweek').setAttribute("class", "lowers");
    }
    else if (document.getElementById('afnextweek') != null && document.getElementById('officerTaskHeadderSpan').innerHTML == document.getElementById('afnextweek').innerHTML) {
        document.getElementById('fnextweek').setAttribute("class", "lowers");
    }
    else if (document.getElementById('afthismonth') != null && document.getElementById('officerTaskHeadderSpan').innerHTML == document.getElementById('afthismonth').innerHTML) {
        document.getElementById('fthismonth').setAttribute("class", "lowers");
    }
    else if (document.getElementById('afallopen') != null && document.getElementById('officerTaskHeadderSpan').innerHTML == document.getElementById('afallopen').innerHTML) {
        document.getElementById('fallopen').setAttribute("class", "lowers");
    }

    //pending approval
    else if (document.getElementById('afallloans') != null && document.getElementById('officerTaskHeadderSpan').innerHTML == document.getElementById('afallloans').innerHTML) {
        document.getElementById('fallloans').setAttribute("class", "lowers");
    }
    else if (document.getElementById('afmultiple') != null && document.getElementById('officerTaskHeadderSpan').innerHTML == document.getElementById('afmultiple').innerHTML) {
        document.getElementById('fmultiple').setAttribute("class", "lowers");
    }
    else if (document.getElementById('afcompleteloanapp') != null && document.getElementById('officerTaskHeadderSpan').innerHTML == document.getElementById('afcompleteloanapp').innerHTML) {
        document.getElementById('fcompleteloanapp').setAttribute("class", "lowers");
    }
    else if (document.getElementById('afreviewdisclosures') != null && document.getElementById('officerTaskHeadderSpan').innerHTML == document.getElementById('afreviewdisclosures').innerHTML) {
        document.getElementById('freviewdisclosures').setAttribute("class", "lowers");
    }
    else if (document.getElementById('aforderappraisal') != null && document.getElementById('officerTaskHeadderSpan').innerHTML == document.getElementById('aforderappraisal').innerHTML) {
        document.getElementById('forderappraisal').setAttribute("class", "lowers");
    }

    else if (document.getElementById('afuploaddoc') != null && document.getElementById('officerTaskHeadderSpan').innerHTML == document.getElementById('afuploaddoc').innerHTML) {
        document.getElementById('fuploaddoc').setAttribute("class", "lowers");
    }

    else if (document.getElementById('afreviewapproveappraisal') != null && document.getElementById('officerTaskHeadderSpan').innerHTML == document.getElementById('afreviewapproveappraisal').innerHTML) {
        document.getElementById('freviewapproveappraisal').setAttribute("class", "lowers");
    }

    else if (document.getElementById('afsecurerate') != null && document.getElementById('officerTaskHeadderSpan').innerHTML == document.getElementById('afsecurerate').innerHTML) {
        document.getElementById('fsecurerate').setAttribute("class", "lowers");
    }

    else if (document.getElementById('afreissuegfe') != null && document.getElementById('officerTaskHeadderSpan').innerHTML == document.getElementById('afreissuegfe').innerHTML) {
        document.getElementById('freissuegfe').setAttribute("class", "lowers");
    }

    else if (document.getElementById('afsigning') != null && document.getElementById('officerTaskHeadderSpan').innerHTML == document.getElementById('afsigning').innerHTML) {
        document.getElementById('fsigning').setAttribute("class", "lowers");
    }

    $("#minimizetoday").click(
		function () {
		    if ($("#minmax").hasClass('min')) {
                $(".biggreens").addClass('notdisplayed');
                $(".childIndicator").addClass('notdisplayed');
		        $("#listandpage").animate(
					{ height: "0px" },
					500,
					function () {
					    $("#minmax").removeClass('min');
					    $("#minmax").addClass('max');
					    $("#todolisthead").removeClass('todolisthead');
					    $("#todolisthead").addClass('todolisthead2');
					}
				);
		    }
		    else if ($("#minmax").hasClass('max')) {
                $("#todolisthead").removeClass('todolisthead2');
		        $("#todolisthead").addClass('todolisthead');
                $("#listandpage").animateAuto(
                    	 "height",
					500,
					function () {
					    $("#minmax").removeClass('max');
					    $("#minmax").addClass('min');
					    $(".biggreens").removeClass('notdisplayed');
                        $(".childIndicator").removeClass('notdisplayed');
					}
				);
		    }
		}
	);

    BindManageFeesOnCloseEvents();
}

function BindManageFeesOnCloseEvents() {
    $(".todolistfooter").find(".pageselected, .page").click(function () {
        if ($("#manageFeesSection").length != 0) {
            ManageFees.OnCloseManageFeesSection($(this), "click");
            return false;
        }
    });

    $(".conciergecenterHyperLink").click(function () {
        if ($("#manageFeesSection").length != 0) {
            ManageFees.OnCloseManageFeesSection($(this), "click");
            return false;
        }
    });

    $("#nav").find("a").click(function () {
        if ($("#manageFeesSection").length != 0) {
            ManageFees.OnCloseManageFeesSection($(this), "click");
            return false;
        }
    });

    $("#trGridHeader").find("a").click(function () {
        if ($("#manageFeesSection").length != 0) {
            ManageFees.OnCloseManageFeesSection($(this), "click");
            return false;
        }
    });
}

function BindLoanDetails() {

    $("#minimizeloandetails").click(function () {
        if ($("#loandetailsminmax").hasClass('min')) {
            $("#loandetailscontent").animate({
               height: "0px"
                    
            },
                500,
                function () {
                    $("#loandetailsminmax").removeClass('min');
                    $("#loandetailsminmax").addClass('max');
                    $("#loandetailscontent").removeClass('loandetailscontent');
                    $("#loandetailscontent").addClass('loandetailscontent2');
                    $("#loandetailshead").removeClass('loandetailshead');
                    $("#loandetailshead").addClass('loandetailshead2');
                }
            );
        }
        else if ($("#loandetailsminmax").hasClass('max')) {
            $("#loandetailshead").removeClass('loandetailshead2');
            $("#loandetailscontent").removeClass('loandetailscontent2');
            $("#loandetailscontent").addClass('loandetailscontent');
            $("#loandetailshead").addClass('loandetailshead');
            $("#loandetailscontent").animate({
              height: $('.imp-div-lcCompanyContact-container').height() + 0 + "px"
            },
                500,
                function () {
                    $("#loandetailsminmax").removeClass('max');
                    $("#loandetailsminmax").addClass('min');
                }
            );
        }
    });
}

function BindRateOptionsDetails() {


    $("#minimizerateoptiondetails").click(function () {

        if ($("#rateoptionsdetailsminmax").hasClass('min')) {

            $("#rateoptionsdetailcontent").animate({
                height: "0px"
            },
                500,
                function () {
                    $("#rateoptionsdetailsminmax").removeClass('min');
                    $("#rateoptionsdetailsminmax").addClass('max');
                    if ($("#rateoptionsdetailcontent").hasClass('rateoptionsdetailcontent')) {
                        $("#rateoptionsdetailcontent").removeClass('rateoptionsdetailcontent');
                        $("#rateoptionsdetailcontent").addClass('rateoptionsdetailcontent2');
                    }

                    if ($("#rateoptionsdetailcontent").hasClass('rateoptionsdetailcontentWide')) {
                        $("#rateoptionsdetailcontent").removeClass('rateoptionsdetailcontentWide');
                        $("#rateoptionsdetailcontent").addClass('rateoptionsdetailcontentWide2');
                    }
                    $("#rateoptionsliderforDiv").removeClass('rateoptionsliderforDiv');
                    $("#rateoptionsliderforDiv").addClass('rateoptionsliderforDiv2');
                    if ($("#rateoptionshead").hasClass('rateoptionshead2')) {
                        $("#rateoptionshead").removeClass('rateoptionshead2');
                        $("#rateoptionshead").addClass('rateoptionshead2round');
                    }

                    if ($("#rateoptionshead").hasClass('rateoptionshead2Wide')) {
                        $("#rateoptionshead").removeClass('rateoptionshead2Wide');
                        $("#rateoptionshead").addClass('rateoptionshead2WideRound');
                    }
                }
            );
        }
        else if ($("#rateoptionsdetailsminmax").hasClass('max')) {

            if ($("#rateoptionsdetailcontent").hasClass('rateoptionsdetailcontent2')) {
                $("#rateoptionsdetailcontent").removeClass('rateoptionsdetailcontent2');
                $("#rateoptionsdetailcontent").addClass('rateoptionsdetailcontent');
            }

            if ($("#rateoptionsdetailcontent").hasClass('rateoptionsdetailcontentWide2')) {
                $("#rateoptionsdetailcontent").removeClass('rateoptionsdetailcontentWide2');
                $("#rateoptionsdetailcontent").addClass('rateoptionsdetailcontentWide');
            }
            if ($("#rateoptionshead").hasClass('rateoptionshead2round')) {
                $("#rateoptionshead").removeClass('rateoptionshead2round');
                $("#rateoptionshead").addClass('rateoptionshead2');
            }

            if ($("#rateoptionshead").hasClass('rateoptionshead2WideRound')) {
                $("#rateoptionshead").removeClass('rateoptionshead2WideRound');
                $("#rateoptionshead").addClass('rateoptionshead2Wide');
            }
            $("#rateoptionsliderforDiv").removeClass('rateoptionsliderforDiv2');
            $("#rateoptionsliderforDiv").addClass('rateoptionsliderforDiv');
            $("#rateoptionsdetailcontent").animate({
                height: $('.tableRateOptions').height() + 60 + "px"
            },
				500,
				function () {

				    $("#rateoptionsdetailsminmax").removeClass('max');
				    $("#rateoptionsdetailsminmax").addClass('min');
				}
			 );
        }
    });
}

function BindBorrowerDetails() {

    $("#minimizeborrowerdetails").click(function () {
        if ($("#borrowerdetailsminmax").hasClass('min')) {
            $("#borrowerdetailscontent").slideUp(500, function () {
                $("#borrowerdetailsminmax").removeClass('min');
                $("#borrowerdetailsminmax").addClass('max');
                $("#borrowerdetailscontent").removeClass('borrowerdetailscontent');
                $("#borrowerdetailscontent").addClass('borrowerdetailscontent2');
                $("#borrowerdetailshead").removeClass('borrowerdetailshead');
                $("#borrowerdetailshead").addClass('borrowerdetailshead2');
            });
        }
        else if ($("#borrowerdetailsminmax").hasClass('max')) {
            $("#borrowerdetailshead").removeClass('borrowerdetailshead2');
            $("#borrowerdetailscontent").removeClass('borrowerdetailscontent2');
            $("#borrowerdetailscontent").addClass('borrowerdetailscontent');
            $("#borrowerdetailshead").addClass('borrowerdetailshead');
            $("#borrowerdetailscontent").slideDown(500, function () {
                $("#borrowerdetailsminmax").removeClass('max');
                $("#borrowerdetailsminmax").addClass('min');
            });
        }
    });
}

function BindMailboxEvents() {
    // email->animation
    $("#minimizeemail").click(function () {
        if ($("#eminmax").hasClass('min')) {
            $("#emailcontent").animate({
                height: "0px"
            },
				500,
				function () {
				    $("#eminmax").removeClass('min');
				    $("#eminmax").addClass('max');
				    $("#emailcontent").removeClass('emailcontent');
				    $("#emailcontent").addClass('emailcontent2');
				    $("#emailhead").removeClass('emailhead');
				    $("#emailhead").addClass('emailhead2');
				}
			);
        }
        else if ($("#eminmax").hasClass('max')) {
            $("#emailhead").removeClass('emailhead2');
            $("#emailcontent").removeClass('emailcontent2');
            $("#emailcontent").addClass('emailcontent');
            $("#emailhead").addClass('emailhead');
            $("#emailcontent").animate({
                height: "170px"
            },
				500,
				function () {
				    $("#eminmax").removeClass('max');
				    $("#eminmax").addClass('min');
				}
			);
        }
    });

    // Email
    $('article.emailtabs section > h3').click(function () {
        $('article.emailtabs section').removeClass('current');
        $(this).closest('section').addClass('current');
    });
}

function BindAssignLoanInfoEvents() {
    // calendar->animation
    $("#minimizeassignloaninfo").click(function () {
        if ($("#startnewprospectminmax").hasClass('min')) {
            $("#assignloaninfocontent").animate({
                height: "0px"
            },
                500,
                function () {
                    $("#startnewprospectminmax").removeClass('min');
                    $("#startnewprospectminmax").addClass('max');
                    $("#assignloaninfocontent").removeClass('assignloaninfocontent');
                    $("#assignloaninfocontent").addClass('assignloaninfocontent2');
                    $("#assignloaninfohead").removeClass('assignloaninfohead');
                    $("#assignloaninfohead").addClass('assignloaninfohead2');
                }
            );
        } else if ($("#startnewprospectminmax").hasClass('max')) {
            $("#assignloaninfohead").removeClass('assignloaninfohead2');
            $("#assignloaninfocontent").removeClass('assignloaninfocontent2');
            $("#assignloaninfocontent").addClass('assignloaninfocontent');
            $("#assignloaninfohead").addClass('assignloaninfohead');
            $("#assignloaninfocontent").animate({
                height: "367px"
            },
                500,
                function () {
                    $("#startnewprospectminmax").removeClass('max');
                    $("#startnewprospectminmax").addClass('min');
                }
            );
        }
    });
}

function BindCalendarEvents() {
    // calendar->animation
    $("#minimizecalendar").click(function () {
        if ($("#cminmax").hasClass('min')) {
            $("#calendarcontent").animate({
                height: "0px"
            },
				500,
				function () {
				    $("#cminmax").removeClass('min');
				    $("#cminmax").addClass('max');
				    $("#calendarcontent").removeClass('calendarcontent');
				    $("#calendarcontent").addClass('calendarcontent2');
				    $("#calendarhead").removeClass('calendarhead');
				    $("#calendarhead").addClass('calendarhead2');
				}
			);
        }
        else if ($("#cminmax").hasClass('max')) {
            $("#calendarhead").removeClass('calendarhead2');
            $("#calendarcontent").removeClass('calendarcontent2');
            $("#calendarcontent").addClass('calendarcontent');
            $("#calendarhead").addClass('calendarhead');
            $("#calendarcontent").animate({
                height: "210px"
            },
				500,
				function () {
				    $("#cminmax").removeClass('max');
				    $("#cminmax").addClass('min');
				}
			);
        }
    });

    // Calendar tab minimize
    $('article.calendartabs section > h3').click(function () {
        $('article.calendartabs section').removeClass('current');
        $(this).closest('section').addClass('current');
    });
}

function BindStartNewProspectEvents() {
    $("#minimizestartnewprospect").live("click", function () {
        if ($("#startnewprospectminmax").hasClass('min')) {
            startNewProspectHeight = $("#getstartedcontent").height();
            $("#getstartedcontent").animate({
                height: "0px"
            },
				500,
				function () {
				    $("#startnewprospectminmax").removeClass('min');
				    $("#startnewprospectminmax").addClass('max');
				    $("#getstartedcontent").removeClass('getstartedcontent');
				    $("#getstartedcontent").addClass('getstartedcontent2');
				    $("#getstartedhead").removeClass('getstartedhead');
				    $("#getstartedhead").addClass('getstartedhead2');
				}
			);
        }
        else if ($("#startnewprospectminmax").hasClass('max')) {
            $("#getstartedhead").removeClass('getstartedhead2');
            $("#getstartedcontent").removeClass('getstartedcontent2');
            $("#getstartedcontent").addClass('getstartedcontent');
            $("#getstartedhead").addClass('getstartedhead');
            $("#getstartedcontent").animate({
                height: startNewProspectHeight
            },
				500,
				function () {
				    $("#startnewprospectminmax").removeClass('max');
				    $("#startnewprospectminmax").addClass('min');
				}
			);
        }
    });
}

$(function () {
    $(".jqTransform").jqTransform();
    $(".txtPhone").mask("?(999) 999-9999");

    $("[id='task_0P']").click();

    //search input field
    $('#searchinput').focus(function () {
        if (document.getElementById("searchinput").value == 'Search') {
            document.getElementById("searchinput").value = '';
            document.getElementById("searchinput").style.color = 'Black';
        }
    });
    $('#searchinput').blur(function () {
        if (document.getElementById("searchinput").value == '') {
            document.getElementById("searchinput").value = 'Search';
            document.getElementById("searchinput").style.color = '#636363';
        }
    });

    $("#searchinput").keydown(function (event) {
        if (event.keyCode == 13) {
            $(".searchbutton").click();
            return false;
        }
    });

    BindOfficerTaskEvents();
    BindMailboxEvents();
    BindCalendarEvents();
    BindPopupTriggers();
    BindRightClickMenu();
    if ($(".tablelistselected").length == 0)
        $("[id='task_0P']").click();
    
    if($("#displaySystemAdmin").val() == "false") {
         UpdateNumberOfRecordsInTabs();
    }
   
    
    $('.onlynumberandletter').live("focus", function () {
        $(this).removeClass("errorInput");
    });
    $('.onlynumberandletter').live("keyup keydown", function (event) {
        var pass = false;
        if (event.keyCode == 8 || event.keyCode == 46 || (event.keyCode > 36 && event.keyCode < 41))
            pass = true;

        var stop = false;
        if (event.keyCode == 16 && (event.keyCode < 48 && event.keyCode > 90))
            stop = true;

        var inputvalue = String.fromCharCode(event.which);
        var regex = /[a-zA-Z]|\d/;

        if (stop || (!pass && !regex.test(inputvalue))) {
            event.preventDefault();
            return false;
        }
    });

    $('.tabrow a').bind('keypress', function (e) {
        var code = (e.keyCode ? e.keyCode : e.which);
        if (code == 13) { //Enter keycode

            var isOnOrderExceptionTab = $('#orderexceptiontab', $(this)).length > 0;

            if (isOnOrderExceptionTab && !$('.menutitle', $(this)).hasClass('menutitleRed')) {
                $('.menutitle', $('#orderexceptiontab').parent()).addClass("menutitleRed");
            }
            else {
                $('.menutitle', $('#orderexceptiontab').parent()).removeClass("menutitleRed");
            }
        }
    });
    
});

$('.menuitem').click(function () {
    if ($(this).is($('#orderexceptiontab').parent()) && !$('.menutitle', $('#orderexceptiontab').parent()).hasClass('menutitleRed')) {
        $('.menutitle', $('#orderexceptiontab').parent()).addClass("menutitleRed");
    }
    else {
        $('.menutitle', $('#orderexceptiontab').parent()).removeClass("menutitleRed");
    }
});

function classRemover() {
    $('#hometab,#prospectstab,#pipelinetab,#alertstab,#pendingapprovaltab,#completedloanstab,#contactstab,#alertstab,#mailroomtab').removeClass('queueselected');
    $('#referalstab,#dashboardtab,#newloanapplicationtab,#canceltab,#preapprovaltab').removeClass('queueselected');
    $('#orderrequestedtab,#orderprocessedtab,#orderdeliveredforreviewtab,#orderexceptiontab').removeClass('queueselected');

    $('#hometab,#prospectstab,#pipelinetab,#alertstab,#pendingapprovaltab,#completedloanstab,#contactstab,#alertstab, #mailroomtab').parent().removeClass('selected');
    $('#referalstab,#dashboardtab,#newloanapplicationtab,#canceltab,#preapprovaltab').parent().removeClass('selected');
    $('#orderrequestedtab,#orderprocessedtab,#orderdeliveredforreviewtab,#orderexceptiontab').parent().removeClass('selected');
}

// Mailbox Callback functions
function MailboxDataOnSuccess(data) {
    BindMailboxEvents();
}

// Calendar Callback functions
function CalendarDataOnSuccess(data) {
    BindCalendarEvents();
}

function ClearGridData() {
    $('.tasktablelist, .tasktablelistduedate, .tablelistselected').remove();
    $('.prospecttablelist').remove();
    $("#numberOfRecordsDiv").html('<span> 0 records <\span>');
    $("#pagingDiv").html('');
    $("#nooftasks2").html('0');

    var filterContext = $("#FilterContext").val();
    switch (filterContext) {
        case 'OfficerTask':
            $("#tabOfficerTaskCount").html('0');
            $("#tabProspectsCount").html('0');
            break;
        case 'Contact':
            $("#tabOfficerTaskCount").html('0');
            $("#tabProspectsCount").html('0');
            break;
    }
}

function UpdateNumberOfRecordsInTabs() {
    $.ajax({
        type: 'GET',
        url: '/Home/RefreshNumberOfRecordsInTabs',
        cache: false,
        async: true,
        success: function (data) {
            if (data != null) {
                var numbers = data.toString().split(',');
                $('#tabProspectsCount').text(numbers[1]);
                $('#tabPipelineCount').text(numbers[2]);
                $('#tabNewLoanApplicationCount').text(numbers[3]);
                $('#tabPendingApprovalCount').text(numbers[4]);
                $('#tabAlertsCount').text(numbers[5]);
                $('#tabCompletedLoansCount').text(numbers[6]);
                $('#tabCanceledCount').text(numbers[7]);
                $('#tabPreApprovalCount').text(numbers[8]);
                $('#tabOrderRequestedCount').text(numbers[9]);
                $('#tabOrderProcessedCount').text(numbers[10]);
                $('#tabOrderDeliveredForReviewCount').text(numbers[11]);
                $('#tabOrderExceptionCount').text(numbers[12]);
                $('#tabMailRoomCount').text(numbers[13]);
            }
            else {
                $('#tabProspectsCount').text("0");
                $('#tabPipelineCount').text("0");
                $('#tabNewLoanApplicationCount').text("0");
                $('#tabPendingApprovalCount').text("0");
                $('#tabAlertsCount').text("0");
                $('#tabCompletedLoansCount').text("0");
                $('#tabCanceledCount').text("0");
                $('#tabPreApprovalCount').text("0");
                $('#tabOrderRequestedCount').text("0");
                $('#tabOrderProcessedCount').text("0");
                $('#tabOrderDeliveredForReviewCount').text("0");
                $('#tabOrderExceptionCount').text("0");
                $('#tabMailRoomCount').text("0");
            }
        }
    });
}


function ShowProcessingInfo() {
    // If progress bar is already shown, return
    var data = $('#body').parent().data();
    if (data["blockUI.isBlocked"] == 1 || $('.divProcessingPopup').css("display") == "block")
        return;

    $('#body').parent().block({
        theme: true,
        title: 'Request is being processed',
        message: '<img src="../Content/ajax-loader.gif"/>'
    });
}

function ShowProcessingInfoManageFee() {

    $('.divProcessingPopup').show();
    $('.modalBackgroundWhite').css('display', 'block');
}

function HideProcessingInfoManageFee() {
    $('.divProcessingPopup').hide();
    $('.modalBackgroundWhite').css('display', 'none');
}

function HideProcessingInfo() {
    $('#body').parent().unblock();
}

function CloseProcessingInfo() {
    HideProcessingInfo();
    BindOfficerTaskEvents();
}


function ChangeOwner() {
    var selectedOwner = $(this).data("tDropDownList").value();
    var selectedTaskID = $('tr.tablelistselected td.taskid').html();

    $.ajaxAntiForgery({
        type: 'POST',
        url: '/Command/Execute',
        data: 'Command=TaskOwnerChange,TaskId=' + selectedTaskID + ',NewOwnerAccountId=' + selectedOwner
    });
}

function ChangeProspectLO() {
    var newOwnerAccountId = $(this).data("tDropDownList").value();
    var contactId = $('tr.tablelistselected td.prospectid').html();
    var loanId = $('tr.tablelistselected div.loanid').html();

    $.ajaxAntiForgery({
        type: 'GET',
        url: '/Loan/ChangeProspectLO',
        cache: false,
        data: '&contactId=' + contactId + '&newOwnerAccountId=' + newOwnerAccountId + '&lid=' + loanId,
        dataType: "json",
        success: function (data) {
            var $divLicenseExpired = $("#divLicenseExpired" + contactId);
            $divLicenseExpired.removeClass();
            $divLicenseExpired.addClass(data.LicenseExpiredClass);
            $("#trLicenseExpired" + contactId).attr("title", data.LicenseExpiredMessage);
        }
    });
}

function ChangeProspectStatus() {
    var newStatus = $(this).data("tDropDownList").value();
    var contactId = $('tr.tablelistselected td.prospectid').html();

    $.ajaxAntiForgery({
        type: 'POST',
        url: '/Command/Execute',
        data: 'command=ProspectStatusChange,ContactId=' + contactId + ',NewProspectStatus=' + newStatus,
        complete: function (data) {
            Refresh.RefreshDataHelper();
        }
    });
}

function OnUserFilterContextChange() {
    $.ajax({
        type: 'GET',
        url: '/Home/IndexCommand',
        cache: false,
        data: 'control=UserFilter&Command=Reset',
        success: function (data) {
            $('#filtersection').html(data);
        }
    });
}
function BindPopupTriggers() {
    //Tooltip
    var rowid;

    $('.PopupTrigger,.PopupTrigger2').live('click', function () {
        rowid = $(this).attr('rel');
        thisover = $(this);

        if (thisover.parents("tr").attr("DetailsLoaded") != "true")
            return;

        var previousCommand = $(this).attr('rel');
        var pos = $(this).offset();
        var width = $(this).width();
        if (rowid != "") {
            $('#PopupContainerForClick').css({
                left: (pos.left + width) + 'px',
                top: pos.top + 8 + 'px'
            });

            $.ajax({
                type: 'GET',
                url: '/Command/Execute',
                cache: false,
                data: 'command=' + previousCommand.toString(),
                success: function (data) {
                    $('#PopupContainerForClick').html(data);
                    $('#PopupContainerForClick').fadeIn();
                }
            });
        }
    });

    $('.exceptionIcon').live('click', function () {
        var pos = $(this).offset();
        var width = $(this).width();
        $('#PopupContainerForClick').css({
            left: (pos.left + width) + 'px',
            top: pos.top + 8 + 'px'
        });

        $.ajax({
            type: 'GET',
            url: '/Command/Execute',
            cache: false,
            data: 'command=ExceptionItemTooltip,LoanId=' + $(this).closest('tr').children('.loanid').text(),
            success: function (data) {
                $('#PopupContainerForClick').html(data);
                $('#PopupContainerForClick').fadeIn();
            }
        });

    });

    $('.letterTooltipDiv').live('mouseover', function () {
        var pos = $(this).offset();
        var width = $(this).width();
        $('#PopupContainerForClick').css({
            left: (pos.left + width) + 'px',
            top: pos.top + 8 + 'px'
        });

        $('#PopupContainerForClick').html('<div class="letterExpirationDateContentDiv"><div class="letterExpirationDateMessage">Expiration Date: ' + $(this).attr('expirationdate') + '</div></div>');
        $('#PopupContainerForClick').fadeIn();

    });

    $('.letterTooltipDiv').live('mouseleave', function () {
        $('#PopupContainerForClick').fadeOut();
    });


    $("body").live('click', function (e) {
        //close poput on click outside the popup or click on CLOSE button
        var popupClicked = false;
        if ($('#PopupContainerForClick').css('display') == 'block') {
            var $target = $(e.target);
            if ($target.closest("#PopupContainerForClick").length > 0)
                popupClicked = true;
            if (popupClicked && e.target.className != "close")
                e.stopPropagation();
            else
                $('#PopupContainerForClick').hide();
        }

        if ($('#PopupContainerDueDateForClick').css('display') == 'block' && e.target.className != "dueDate") {
            var $target = $(e.target);
            if ($target.closest("#PopupContainerDueDateForClick").length > 0)
                popupClicked = true;
            if (popupClicked && e.target.className != "closeDuoDatePopUp")
                e.stopPropagation();
            else
                $('#PopupContainerDueDateForClick').hide();
        }
    });

}

// If Manage Fees section is opened, check if all changes are saved
function AreThereAnyChangesOnManageFees(callBackFn, params) {
    if ($("#manageFeesSection").length != 0) {
        if (ManageFees.IsSmartGFESectionEmpty()) {
            ManageFees.OnSmartGFECleared(callBackFn, params);
            return true;
        }
        else {
            originalClosingCostSection1100 = "";
            ManageFees.OnCloseManageFeesSection(callBackFn, params);
            return true;
        }
    }
    else {
        return false;
    }
}

function SignOutFromPartial(url, borrowerUrl) {
    if (window.SessionTimeoutOccurred != true) {
        if (AreThereAnyChangesOnManageFees(SignOutFromPartial, new Array(url, borrowerUrl)) == true)
            return;
    }

    // Logout borrower
    window.open(borrowerUrl, "_blank", "width=200,height=110,menubar=no,resizable=no,scrollbars=no,status=no,titlebar=no,toolbar=no");

    $.ajax({
        type: 'POST',
        url: url,
        success: function (data) {
            window.location = data;
        }
    });
}

//tCalendar
if (jQuery) (function () {
    $.extend($.fn, {
        tCalendar: function () {
        }
    });
})(jQuery);

function ShowAjaxErrorPopUp(error) {

    $(".message").css("display", "block");

    $("#dialog-modal").dialog({
        height: 140,
        width: 350,
        modal: true,
        resizable: false,
        buttons: {
            Ok: function () {
                $(this).dialog("close");
            }
        }
    });

    $("#body").parent().unblock();
}

function TriangleIsVisible(menu) {
    if (menu == null || menu == "" || menu == "myMenuProspectsGetStarted" || menu == "myMenuPendingApprovalGetStarted") 
        return false;

    return true;
}

function SetTrianglePosition() {
    
    TriangleHide();
    
    var menu = $("[id^=myMenu]:visible").first().attr('id');
    
    if (!TriangleIsVisible(menu)) 
        return;
    
    var menuString = '#' + menu;
    
    if (!($(menuString).is(':visible')))
        return;

    var mainSectionLeft = parseInt($('#mainsection').position().left);
    var mainSectionWidth = parseInt($('#mainsection').width());
    var contextMenuWidth = parseInt($(menuString).width());
    var triangleWidth = parseInt($('#triangleForMenu').width());
    var contextMenuTop = $(menuString).position().top;
    var contextMenuLeft = $(menuString).position().left;
    
    var isFlipped = false;
    
    // flipped menu
    var maxRightMargin = mainSectionLeft + mainSectionWidth - contextMenuWidth - triangleWidth - 10;
    if ((contextMenuLeft) > maxRightMargin) {
         $(menuString).css({ left: maxRightMargin });
         isFlipped = true;
    }
    var rowHowerTop = $('.tablerowhover').position().top;

    var offsetTopContextMenu = parseInt(20);
    
    var offsetLeft = parseInt(-23);
    var offsetTop = parseInt(33);

    var menuTop = contextMenuTop - offsetTopContextMenu;
    var triangleTop = rowHowerTop - offsetTop;

    var diff = menuTop - triangleTop;

    if (diff > 35) menuTop -= 15;
    
    $(menuString).css({ top: menuTop });

    
    if (isFlipped == true) {
        $("#triangleForMenu").removeClass("triangleContextMenu");
        $("#triangleForMenu").addClass("triangleContextMenuFlip");
        var triangleLeft = $(menuString).position().left + contextMenuWidth - 18;
        $("#triangleForMenu").css({ top: triangleTop, left: triangleLeft });

    } else {
        $("#triangleForMenu").removeClass("triangleContextMenuFlip");
        $("#triangleForMenu").addClass("triangleContextMenu");
        $("#triangleForMenu").css({ top: triangleTop, left: (contextMenuLeft + offsetLeft) });
    }
    
}


function TriangleHide() {
    $("#triangleForMenu").hide();
}

function TriangleShow() {
    var menu = $("[id^=myMenu]:visible").first().attr('id');
    
    if (!TriangleIsVisible(menu)) 
        return;
    
    $("#triangleForMenu").show();
}

function RetrieveSelectedQueueName() {
    var selectedQueueId = $('.queueselected').attr('id');
    var queueName;
    switch (selectedQueueId) {
        case "alertstab":
            queueName = WorkQueueTypes.Alert;
            break;
        case "canceltab":
            queueName = WorkQueueTypes.Cancel;
            break;
        case "completedloanstab":
            queueName = WorkQueueTypes.Completed;
            break;
        case "newloanapplicationtab":
            queueName = WorkQueueTypes.NewLoanApplications;
            break;
        case "pendingapprovaltab":
            queueName = WorkQueueTypes.PendingApproval;
            break;
        case "pipelinetab":
            queueName = WorkQueueTypes.Pipeline;
            break;
        case "prospectstab":
            queueName = WorkQueueTypes.Prospects;
            break;
        case "preapprovaltab":
            queueName = WorkQueueTypes.PreApproval;
            break;
        case "orderexceptiontab":
            queueName = WorkQueueTypes.OrderException;
            break;
        case "orderprocessedtab":
            queueName = WorkQueueTypes.OrderProcessed;
            break;
        case "orderdeliveredforreviewtab":
            queueName = WorkQueueTypes.OrderDeliveredForReview;
            break;
        case "orderexceptiontab":
            queueName = WorkQueueTypes.OrderException;
            break;
        case "mailroomtab":
            queueName = WorkQueueTypes.MailRoom;
            break;
    }

    return queueName;
}

function GetEmptyObject(obj) {
        // Deep copy
        var objCopy = jQuery.extend(true, {}, obj);

        // Reset all properties to create empty obj
        for (var property in objCopy) {
            if (typeof objCopy[property] == "object" && objCopy[property] != null && property != "States") {
                objCopy[property] = GetEmptyObject(objCopy[property]);
            }
            else if (objCopy.hasOwnProperty(property) && property != "States") {
                objCopy[property] = null;
            }
        }
        return objCopy;
}

function HideImpTooltip() {
    $(".imp-tooltip-autoclose").parents('.tooltip:first').prev().click();
}

jQuery.fn.animateAuto = function(prop, speed, callback) {
    var elem, height, width;
    return this.each(function(i, el) {
        el = jQuery(el), elem = el.clone().css({ "height": "auto", "width": "auto" }).appendTo("body");
        height = elem.css("height"),
        width = elem.css("width"),
        elem.remove();

        if (prop === "height")
            el.animate({ "height": height }, speed, callback);
        else if (prop === "width")
            el.animate({ "width": width }, speed, callback);
        else if (prop === "both")
            el.animate({ "width": width, "height": height }, speed, callback);
    });
};

$("body").click(function (e) {
    if ($("#contextmenu-node").length != 0) {
        $("#contextmenu-node").remove();
    }

    if ($(".imp-tooltip-autoclose").length != 0) {
        var openTooltipClicked = false;
        $(".imp-tooltip-autoclose,[tooltip-trigger='click'],[onclick='HideImpTooltip();']").each(function () {
            //don't close tooltip if originally clicked on open tooltip button or inside of tooltip or close button on tooltip
            if ($(this).is(e.target) || $(this).has(e.target).length !== 0) {
                openTooltipClicked = true;
            }
        });

        if (!openTooltipClicked)
            HideImpTooltip();
    }
})









