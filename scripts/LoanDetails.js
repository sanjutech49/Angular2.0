var loanDetailsTabLoaded = false;
var preApprovalTabLoaded = false;
var loanDetailsPopupOpened = false;
var conditionsLoaded = false;

LoanDetails = {
    LoanDetailsCommand: function (workQueueType, loanId, prospectId) {
        conditionsLoaded = false;
        $.ajax({
            type: 'GET',
            url: '/Command/Execute',
            cache: false,
            data: 'Command=LoanDetails,WorkQueueType=' + workQueueType + ",Action=" + WorkQueueCommands.ManageLoan + ",LoanId=" + loanId + ",ProspectId=" + prospectId,
            dataType: "html",
            success: function (data) {
                $('#detailsSection').html(data);

                LoanDetails.LoanDetailsTabs(workQueueType, loanId, prospectId);
                LoanDetails.LoadDetailsAus();
                LoanDetails.LoanDetailsCanvas();
                LoanDetails.LoanDetailsBtn();

                $("#detailsAusSection").hide();
                $("#detailsRedisclosure").hide();
                $("#conditionsSubSection").hide();
                $("#detailsSubSection").html('');
                LoanDetails.ShowDetailsSubSection();

                if (workQueueType === 'PreApproval') {
                    $("#PreapprovalMenu").show();
                    loanDetailsTabLoaded = false;
                    preApprovalTabLoaded = true;
                    ConciergeCommandEmbedded.OpenConciergeEmbeddedSubCommand(WorkQueueCommands.PreApprovalTab, workQueueType, loanId, prospectId, 1);
                }
                else {
                    LoanDetails.RemovePreapprovalMenu();
                    loanDetailsTabLoaded = true;
                    preApprovalTabLoaded = false;
                    ConciergeCommandEmbedded.OpenConciergeEmbeddedSubCommand(WorkQueueCommands.ManageLoan, workQueueType, loanId, prospectId, 1);
                }
            },
            error: function (data) {
                HideProcessingInfo();
            }
        });
    },
    LoanDetailsTabs: function (workQueueType, loanId, prospectId, selectedTab) {
        $('#loanDetailsTab').tabs({
            selected: selectedTab == 2 ? 2 : workQueueType === 'PreApproval' ? 0 : 1,
            select: function (event, ui) {

                // Tab index 0 is PreApproval
                var preApprovalTabIndex = 0;
                // Tab index 1 is ManageLoan
                var manageLoanTabIndex = 1;
                // Tab index 2 and 3 can be Redisclosure & AUS, or just one of those two, or none

                var previouslySelectedTab = $(this).tabs('option', 'selected');
                var tabId = ui.tab.id;

                $("#detailsAusSection").hide();
                $("#detailsRedisclosure").hide();
                $("#conditionsSubSection").hide();
                $("#loanDetailsSubTabProgressBar").hide();

                if (tabId == "PreapprovalMenu") {
                    LoanDetails.ShowDetailsSubSection();

                    // Only reload iFrame, if we switched between ManageLoan and PreApprovalTab commands
                    if (previouslySelectedTab == manageLoanTabIndex || !preApprovalTabLoaded) {
                        $("#detailsSubSection").html('');
                        loanDetailsTabLoaded = false;
                        preApprovalTabLoaded = true;
                        ConciergeCommandEmbedded.OpenConciergeEmbeddedSubCommand(WorkQueueCommands.PreApprovalTab, workQueueType, loanId, prospectId, 1);
                    }
                }
                else if (tabId == "ManageLoanMenu") {
                    LoanDetails.ShowManageLoanTab(previouslySelectedTab, preApprovalTabIndex, workQueueType, loanId, prospectId);
                }
                else if (tabId == "RedisclosureMenu") {
                    $("#detailsRedisclosure").show();
                    $('#detailsSubSection').css('top', '-10000%');
                    $('#detailsSubSection').css('position', 'absolute');
                }
                else if (tabId == "AUSMenu") {
                    $('#detailsSubSection').css('top', '-10000%');
                    $('#detailsSubSection').css('position', 'absolute');
                    $("#detailsAusSection").show();
                }
                else if (tabId == "ConditionsMenu") {
                    $('#detailsSubSection').css('top', '-10000%');
                    $('#detailsSubSection').css('position', 'absolute');
                    $("#loanDetailsSubTabProgressBar").show();

                    // Load conditions template
                    if ($("#conditionsSubSection").length > 0 && $("#conditionsSubSection").html().trim() == "") {
                        $.ajax({
                            type: "GET",
                            url: '../angular/stipsandconditions2.0/conditions.html',
                            async: false,
                            success: function (data) {
                                $("#conditionsSubSection").html(data);
                            }
                        });
                    }

                    // TODO : Persist model state on tab change 
                    //Refresh angular bindings
                    if (angular != undefined) {
                        var loanDetailsSection = angular.element($('#loanDetailsSection')).scope();
                        loanDetailsSection.refresh(loanId);
                    }
                }
                else {
                    LoanDetails.ShowManageLoanTab(previouslySelectedTab, preApprovalTabIndex, workQueueType, loanId, prospectId);
                }
            }
        });
    },
    RemovePreapprovalMenu: function () {
        $("#loanDetailsList li").first().remove();
        $('#ManageLoanMenuLi').css({ "margin-left": '15px' });
        $("#PreapprovalMenu").hide();
        $("#PreapprovalMenu").removeClass();
    },
    ShowManageLoanTab: function (previouslySelectedTab, preApprovalTabIndex, workQueueType, loanId, prospectId) {
        LoanDetails.ShowDetailsSubSection();

        // Only reload iFrame, if we switched between ManageLoan and PreApprovalTab commands
        if (previouslySelectedTab == preApprovalTabIndex || !loanDetailsTabLoaded) {
            $("#detailsSubSection").html('');
            loanDetailsTabLoaded = true;
            preApprovalTabLoaded = false;
            ConciergeCommandEmbedded.OpenConciergeEmbeddedSubCommand(WorkQueueCommands.ManageLoan, workQueueType, loanId, prospectId, 1);
        }
    },
    ShowReDisclosureTab: function (eventdata) {
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

        $("#RedisclosureMenuLi").show();
        $("#loanDetailsTab").tabs("select", 2);

        $.ajax({
            type: 'GET',
            url: '/ReDisclosure/ShowReDisclosureSection',
            cache: false,
            data: "loanId=" + loanId,
            dataType: "html",
            success: function (data) {
                $('#detailsRedisclosure').html(data);

                $("#detailsRedisclosure").show();
                $('#detailsSubSection').css('top', '-10000%');
                $('#detailsSubSection').css('position', 'absolute');
                $("#detailsAusSection").hide();

                ConciergeCommandEmbedded.PositionIFrame();
            },
            error: function (data) {
                HideProcessingInfo();
            }
        });
    },
    HideRedislosureTab: function () {
        $("#RedisclosureMenuLi").hide();
        $("#loanDetailsTab").tabs("select", 1);
        $("#detailsRedisclosure").hide();
        LoanDetails.ShowDetailsSubSection();
        $("#detailsAusSection").hide();
    },
    ShowDetailsSubSection: function () {
        $('#detailsSubSection').css('top', '0');
        $('#detailsSubSection').css('position', 'relative');
    },
    LoadDetailsAus: function () {
        $('#ausTabs').tabs({

            select: function (event, ui) {
                var canvasElements = $("#ausTabs").find(".canvas");

                canvasElements.each(function (index) {

                    if (index == ui.index) {
                        $(this).show();
                    }
                    else {
                        $(this).hide();
                    }
                });
            }
        });

        // disable NSDA and manual types for now
        this.DisableAusTab (2);
        this.DisableAusTab (3);
    },

    SelectAusTab: function (tabId) {
        $("#ausTabs").tabs('option', 'selected', tabId);
    },

    DisableAusTab: function (tabId) {
        $("#ausTabs").tabs("disable", tabId);
        //$("#ausTabs").tabs("option", "disabled", [tabId]);
    },

    EnableAusTab: function (tabId) {
        $("#ausTabs").tabs("enable", tabId);
    },

    DisableAllAusTabs: function () {
        this.DisableAusTab(0);
        this.DisableAusTab(1);
        this.DisableAusTab(2);
        this.DisableAusTab(3);
    },

    LoanDetailsCanvas: function () {
        var canvasElements = $("#ausTabs").find(".canvas");

        canvasElements.each(function (index) {
            var inner = $(this)[0];
            var context = inner.getContext('2d');
            draw(context, "#1FAC58");
            if (index != 0) {
                $(this).hide();
            }
        }
        );
    },

    LoanDetailsBtn: function () {
        var inner = $("#btnInitialSubmit")[0];
        if (inner != undefined)
            var context = inner.getContext('2d');
        if (context != undefined)
            draw(context, "#FFF");
    },
    InitializeConfirmationPopup: function (callBackFn, params, message, firstButton, secondButton) {
        if (loanDetailsPopupOpened || $("#detailsSection").is(":hidden") == true)
            return false;

        $('.modalBackgroundWhite').show();
        $('#changeSectionLoanDetailsPopupText').html(message);
        $('#imp-loan-details-first-button').val(firstButton);
        $('#imp-loan-details-second-button').val(secondButton);
        $('#imp-loan-details-first-button').removeAttr('onclick');
        $('#imp-loan-details-first-button').unbind('click');
        $('#imp-loan-details-second-button').removeAttr('onclick');
        $('#imp-loan-details-second-button').unbind('click');

        $('#imp-loan-details-first-button').click(function () {
            $('.modalBackgroundWhite').hide();
            $("#changeSectionLoanDetailsPopup").hide();

            if (typeof callBackFn === "function") {
                $("#detailsSection").hide();
                $("#detailsSection").html("");
                ShowProcessingInfo();
                callBackFn.apply(null, params);
                loanDetailsPopupOpened = false;
            }
        });
        $('#imp-loan-details-second-button').click(function () {
            $('.modalBackgroundWhite').hide();
            $("#changeSectionLoanDetailsPopup").hide();
            loanDetailsPopupOpened = false;
        });

        $("#changeSectionLoanDetailsPopup").show();
        loanDetailsPopupOpened = true;

        return true;
    }
};

function draw(ctx, color) {
    ctx.clearRect(5, 5, 15, 15);
    ctx.restore(); ctx.save();
    // Translate origin
    ctx.translate(15 / 2, 15 / 2);
    ctx.rotate(10 * Math.PI / -13.2);
    ctx.translate(-15 / 2, -15 / 2);
    ctx.fillStyle = color;
    // Filled triangle
    ctx.beginPath();
    ctx.moveTo(5, 5);
    ctx.lineTo(15, 5);
    ctx.lineTo(5, 15);
    ctx.fill();
}
