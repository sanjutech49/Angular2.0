ConciergeCommandEmbedded = {
    OpenConciergeEmbeddedCommand: function (action, workQueueType, loanId, prospectId) {

        ConciergeCommandEmbedded.OpenConciergeEmbeddedCommandOnBegin();
        ConciergeCommandEmbedded.RateOptionsSection(loanId, prospectId)
        $.ajax({
            type: "GET",
            url: "Command/Execute",
            cache: false,
            data: "command=ConciergeEmbeddedLoad,WorkQueueType=" + workQueueType + ",Action=" + action + ",LoanId=" + loanId + ",ProspectId=" + prospectId + ",hideHeader=0",
            dataType: "html",
            success: function (result) {
                $("#detailsSection").html(result);
                HideProcessingInfo();
            },
            error: function (jqXHR, textStatus, errorThrown) {
            },
            complete: function (jqXHR, textStatus) {
            }
        });
    },

    OpenConciergeEmbeddedSubCommand: function (action, workQueueType, loanId, prospectId, hideHeader) {

        ConciergeCommandEmbedded.OpenConciergeEmbeddedCommandOnBegin();
        ConciergeCommandEmbedded.RateOptionsSection(loanId, prospectId);
        $.ajax({
            type: "GET",
            url: "Command/Execute",
            cache: false,
            data: "command=ConciergeEmbeddedLoad,WorkQueueType=" + workQueueType + ",Action=" + action + ",LoanId=" + loanId + ",ProspectId=" + prospectId + ",hideHeader=" + hideHeader,
            dataType: "html",
            success: function (result) {
                $("#detailsSubSection").html(result);
                HideProcessingInfo();
            },
            error: function (jqXHR, textStatus, errorThrown) {
            },
            complete: function (jqXHR, textStatus) {
            }
        });
    },



    RateOptionsSection: function (loanid, prospectid) {
        //AdditionalViews.AdditionalViewSectionOnBegin();
        //$("#rateOptionsBoxOnManageProspects").slideDown(400);
        $.ajax({
            type: "GET",
            url: 'Home/ShowRateOption', // Must go in Commands section
            data: 'loanId=' + loanid + '&prospectId=' + prospectid + "&builtInMode=false",
            success: function (result) {
                $("#rateOptionsDetailsSection").show();
                $('#rateOptionsDetailsSection').html(result);
                BindRateOptionsDetails();
            },
            error: function () {
            },
            complete: function () {
                //BindRateOptionsDetails();
            }
        });
    },


    OpenConciergeEmbeddedCommandOnBegin: function (data) {
        $("#detailsSection").slideDown(400);
    },
    ShowIFrame: function (data) {
        $("#conciergeEmbeddedFrameLoading").fadeOut();
        $("#conciergeEmbeddedFrame").fadeIn();

        $.receiveMessage(
                    function (event) {
                        var eventdata = JSON.parse(event.data);                       

                        if (eventdata.mouseMoveInIframe !== undefined) {                           
                            BindSessionExpirationEvents();
                            return;
                        }                           

                        if (eventdata.numberOfAlerts !== undefined) {
                            var gridNumber = parseInt($('.tablelistselected .numberOfAlerts').text());
                            var tabNumber = parseInt($("#tabAlertsCount").text());
                            var taskNumber = parseInt($("#nooftasks2").text());
                            setTimeout(function () {
                                $("#tabAlertsCount").html(tabNumber + a.numberOfAlerts);

                                $('.tablelistselected .numberOfAlerts').html(gridNumber + a.numberOfAlerts); 

                                $("#nooftasks2").html(taskNumber + a.numberOfAlerts);
                            }, 3000);
                        }                        

                        // if offset is set as parameter, scroll to it
                        if (eventdata['toOffSet'] != undefined) {
                            $.scrollTo(eventdata['toOffSet'] + $('#detailsSection').offset().top, eventdata['timeout']);
                        }

                        if (eventdata['height'] != undefined) {
                            $('#conciergeEmbeddedFrame').animate({
                                height: eventdata['height']
                            });

                            if (eventdata['isPostBack'] != 'True' && $("#nameofview").text() == "Loan Application")
                                ConciergeCommandEmbedded.PositionIFrame();
                        }
                        if (eventdata['changeToCommand'] == "DisplayRedislosureTab") {
                            LoanDetails.ShowReDisclosureTab(eventdata);
                        }
                        else if (eventdata['changeToCommand'] == "HideRedislosureTab") {
                            LoanDetails.HideRedislosureTab();
                        }
                        else if (eventdata['closeView'] != undefined && eventdata['closeView'] == 'True') {
                            $("#detailsSection").html("");
                            $("[DetailsLoaded]").removeAttr("DetailsLoaded");

                            if (eventdata['currentLoanId'] != undefined)
                                ConciergeCommandEmbedded.ChangeToCommand(eventdata);
                            else
                                $(".tablelistselected").click();
                        }
                    });
    },
    CloseIFrame: function () {
        if ($("#detailsSection").css("display") == "none")
            return;
        $("#detailsSection").slideUp(400);
        $("#detailsSection").html("");
    },
    CloseConciergeCommandEmbedded: function () {
        ConciergeCommandEmbedded.CloseIFrame();
    }
    ,
    BindOpenConciergeEmbeddedCommandMinimize: function () {
        if ($("#conciergecommandembeddedminmax").hasClass('min')) {
            conciergecommandembeddedHeight = $("#conciergecommandembeddedcontent").height();
            $("#conciergecommandembeddedcontent").animate({
                height: "0px"
            },
				500,
				function () {
				    $("#conciergecommandembeddedminmax").removeClass('min');
				    $("#conciergecommandembeddedminmax").addClass('max');
				    $("#conciergecommandembeddedcontent").removeClass('conciergecommandembeddedcontent');
				    $("#conciergecommandembeddedcontent").addClass('conciergecommandembeddedcontent2');
				    $("#conciergecommandembeddedhead").removeClass('conciergecommandembeddedhead');
				    $("#conciergecommandembeddedhead").addClass('conciergecommandembeddedhead2');
				}
			);
        }
        else if ($("#conciergecommandembeddedminmax").hasClass('max')) {
            $("#conciergecommandembeddedhead").removeClass('conciergecommandembeddedhead2');
            $("#conciergecommandembeddedcontent").removeClass('conciergecommandembeddedcontent2');
            $("#conciergecommandembeddedcontent").addClass('conciergecommandembeddedcontent');
            $("#conciergecommandembeddedhead").addClass('conciergecommandembeddedhead');
            $("#conciergecommandembeddedcontent").animate({
                height: conciergecommandembeddedHeight
            },
				500,
				function () {
				    $("#conciergecommandembeddedminmax").removeClass('max');
				    $("#conciergecommandembeddedminmax").addClass('min');
				}
			);
        }

    },

    ChangeToCommand: function (eventdata) {
        var workQueue = '';
        if (eventdata['switchToWorkQueue'] != undefined && eventdata['switchToWorkQueue'] != "") {
            workQueue = eventdata['switchToWorkQueue'];
        }
        else {

            $.ajax({
                type: "GET",
                url: '/Home/GetCurrentWorkQueue',
                async: false,
                success: function (data) {
                    workQueue = data;
                }
            });
        }

        var loanId = eventdata['currentLoanId'];
        var prospectId = eventdata['contactId'];
        var refresh = 'false';
        if (eventdata['refresh'] != null && eventdata['refresh'] == 'True')
            refresh = 'true';
        // Switch to correct queue or refresh current queue
        switch (workQueue) {
            case WorkQueueTypes.Prospects:
                ProspectGrid.ProspectDataHelperOnChangeCommand('command=OpenProspectTab,Refresh=' + refresh, loanId, prospectId);
                break;
            case WorkQueueTypes.Pipeline:
                PipelineGrid.PipelineDataHelperOnChangeCommand('command=OpenPipelineTab,Refresh=' + refresh, loanId);
                break;
            case WorkQueueTypes.NewLoanApplications:
                NewLoanApplicationGrid.NewLoanApplicationDataHelperOnChangeCommand('command=OpenNewLoanApplicationTab,Refresh=' + refresh, loanId);
                break;
            case WorkQueueTypes.PendingApproval:
                PendingApprovalGrid.PendingApprovalDataHelperOnChangeCommand('command=OpenPendingApprovalTab,Refresh=' + refresh, loanId);
                break;
            case WorkQueueTypes.Alerts:
                AlertGrid.AlertDataHelperOnChangeCommand('command=OpenAlertTab,Refresh=' + refresh, loanId);
                break;
            case WorkQueueTypes.Completed:
                CompletedLoansGrid.CompletedLoansDataHelperOnChangeCommand('command=OpenCompletedLoansTab,Refresh=' + refresh, loanId);
                break;
            case WorkQueueTypes.Cancel:
                CancelGrid.CancelDataHelperOnChangeCommand('command=OpenCancelTab,Refresh=' + refresh, loanId);
                break;
            case WorkQueueTypes.PreApproval:
                PreApprovalGrid.PreApprovalDataHelperOnChangeCommand('command=OpenPreApprovalTab,Refresh=' + refresh, loanId);
                break;
            case WorkQueueTypes.OrderRequested:
                OrderRequestedGrid.OrderRequestedDataOnChangeCommand('command=OpenOrderRequestedTab,Refresh=' + refresh, loanId);
                break;
            case WorkQueueTypes.OrderProcessed:
                OrderProcessedGrid.OrderProcessedDataOnChangeCommand('command=OpenOrderProcessedTab,Refresh=' + refresh, loanId);
                break;
            case WorkQueueTypes.OrderDeliveredForReview:
                OrderDeliveredForReviewGrid.OrderDeliveredForReviewDataOnChangeCommand('command=OpenOrderDeliveredForReviewTab,Refresh=' + refresh, loanId);
                break;
            case WorkQueueTypes.OrderException:
                OrderExceptionGrid.OrderExceptionDataOnChangeCommand('command=OpenOrderExceptionForReviewTab,Refresh=' + refresh, loanId);
                break;
            case WorkQueueTypes.MailRoom:
                MailRoomGrid.MailRoomDataHelperOnChangeCommand('command=OpenMailRoomTab,Refresh=' + refresh, loanId);
                break;
            default:
                ProspectGrid.ProspectDataHelperOnChangeCommand('command=OpenProspectTab,Refresh=' + refresh, loanId, prospectId);
                break;
        }
        if ($("#nooftasks2").html() == "0") {
            if (workQueue == WorkQueueTypes.Prospects)
                $(".t8").removeAttr("colSpan");
            ConciergeCommandEmbedded.CloseIFrame();
            AdditionalViews.CloseAdditionalViewSection();
            return;
        }
        // Open correct command
        if (eventdata['changeToCommand'] == undefined) {
            ProspectGrid.ProspectDataHelper('command=OpenProspectTab,Refresh=' + refresh, loanId);
        }
        else {
            if (eventdata['changeToCommand'] == WorkQueueCommands.ManageProspects) {
                var $selectedRow = $(".prospectid").filter(function () {
                    if (prospectId == null || prospectId == undefined)
                        prospectId = "0";
                    return $(this).text().trim() == prospectId.trim();
                }).closest("tr");
                if ($selectedRow.length == 1) {
                    $selectedRow.trigger("click");
                }
                else if (prospectId == null || prospectId == undefined || $selectedRow.length == 0) {
                    var $selectedRow = $(".loanid").filter(function () { return $(this).text().trim() == loanId.trim(); }).closest("tr");
                    if ($selectedRow.length != 0) {
                        $selectedRow.trigger("click");
                    }
                    else {
                        $selectedRow = $(".encryptedloanid").filter(function () { return $(this).text().trim() == loanId.trim(); }).closest("tr");
                        if ($selectedRow.length != 0) {
                            $selectedRow.trigger("click");
                        }
                        else {
                            var firstRow = $("#task_0P").first();
                            if (firstRow.length == 1)
                                firstRow.click();
                        }
                    }
                }
            }
            else {
                ConciergeCommandEmbedded.SelectRowOnChangeCommand(loanId);

                if (eventdata['changeToCommand'] == WorkQueueCommands.ManageLoan) {
                    LoanDetails.LoanDetailsCommand(workQueue, loanId, prospectId);
                }
                else if (eventdata['changeToCommand'] == WorkQueueCommands.ManageFees) {
                    ManageFees.ManageFeesLoad(loanId, '');
                }
                else if (eventdata['changeToCommand'] == "Assign Loan Info") {
                    console.log("Save&Exit - Assign Loan Info");
                }
                else if (eventdata['changeToCommand'] == "Open Assign Loan Info" && loanId != "") {
                    AssignLoanInfo.AssignLoanInfoLoad(loanId);
                }
                else {
                    AdditionalViews.AdditionalViewSection(loanId, '');
                    ConciergeCommandEmbedded.OpenConciergeEmbeddedCommand(eventdata['changeToCommand'], workQueue, loanId, '');
                }
            }

            if ($(".tablelistselected").length == 0) {
                var firstRow = $("#task_0P").first();
                if (firstRow.length == 1)
                    firstRow.click();
            }
        }
    },
    PositionIFrame: function () {
        var pos = $('#conciergecommandembeddedhead').offset();
        var navbarHeightCss = $(".navbar-fixed-top").css("height")
        var navbarHeight = "50";
        if (navbarHeightCss != undefined)
            navbarHeight = navbarHeightCss.replace("px", "");

        if (pos != null)
            $('html,body').animate({ scrollTop: pos.top - 50 });
    },
    SelectRowOnChangeCommand: function (loanId) {
        if (loanId != "") {
            var $selectedRow = $(".loanid").filter(function () { return $(this).text().trim() == loanId.trim(); }).closest("tr");
            if ($selectedRow.length != 0) {
                $selectedRow.attr("DetailsLoaded", "true");
                $selectedRow.trigger("click");
            }
            else {
                $selectedRow = $(".encryptedloanid").filter(function () { return $(this).text().trim() == loanId.trim(); }).closest("tr");
                if ($selectedRow.length != 0) {
                    $selectedRow.attr("DetailsLoaded", "true");
                    $selectedRow.trigger("click");
                }
                else {
                    var firstRow = $("#task_0P").first();
                    if (firstRow.length == 1)
                        firstRow.click();
                }
            }
        }
    }
}
