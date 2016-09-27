var AUSOverride = {
    loanId: '',
    integration: '',
    isOverrideMode: false,
    casesAvailable: false,

    caseId: function () {
        return this.isOverrideMode ? $('#caseid-override').val() : $('#case-id').val();
    },

    checkPermissionToOverride: function () {
        $.ajax({
            type: "GET",
            url: 'Aus/AUSCaseIDPrivilege',
            //data: { serviceTrackingId: serviceTrackingId },

            success: function (data) {
                $('#caseid-override').prop('readonly', !data);
                return data;
            },
            error: function () {
                return false;
            }
        });
    },

    setOverrideMode: function (override) {
        this.isOverrideMode = override;

        if (this.isOverrideMode) {
            $('#case-id').hide();
            $('#case-id-div').hide();
            $('#caseid-override').show();
            $('#caseid-override').val('');

            if (this.casesAvailable)
                $('#canceloverride').show();
            else
                $('#canceloverride').hide();

            $('#caseid-override').focus();

            AUSOverride.hideVendorLoanId();
        }
        else {
            $('#case-id').show();
            $('#case-id-div').show();
            $('#canceloverride').hide();
            $('#caseid-override').hide();

            $('#case-id').focus();
        }
    },

    caseIdWasChanged: function () {
        var selectedCase = $('#case-id').val();

        if (selectedCase === '')
            this.setOverrideMode(true);
        else
            // refresh VendorLoanId for LP
            if (this.integration === 'LP')
                this.updateVendorLoanId(selectedCase);
    },

    cancelOverride: function () {
        this.init(this.loanId, this.integration);
    },

    init: function (loanId, integration) {
        this.loanId = loanId;
        this.integration = integration;

        AUSOverride.initcaseid();

        // set readonly if a user doesn't have permission
        AUSOverride.checkPermissionToOverride();


        // if we have some additional cases for this loan let user to choose one,
        // otherwise - show an edit box
        //AUSOverride.setOverrideMode(!AUSOverride.casesAvailable);
    },

    initcaseid: function () {
        // clear existing options
        $('#case-id').find('option').remove().end();
        AUSOverride.casesAvailable = false;

        $.ajax({
            type: "GET",
            url: 'Aus/GetUniqueCaseIds',
            data: { LoanId: this.loanId, integration: this.integration },

            success: function (data) {
                for (var i = 0; i < data.length; i++) {

                    $('#case-id').append($('<option>',
		            {
		                value: data[i].CaseId,
		                text: data[i].CaseId,
		                selected: data[i].isDefault
		            }));
                };

                AUSOverride.casesAvailable = data.length > 1;
                AUSOverride.setOverrideMode(!AUSOverride.casesAvailable);
                if (AUSOverride.casesAvailable)
                    AUSOverride.updateVendorLoanId(data[1].CaseId);
            },
            error: function () {
                return false;
            }
        });

    },

    updateVendorLoanId: function (selectedCase) {
        // refresh VendorLoanId for LP
        if (this.integration === 'LP') {

            $.ajax({
                type: "GET",
                url: 'Aus/GetVendorLoanIdForCase',
                data: { caseId: selectedCase, loanid: this.loanId, integration: this.integration },

                success: function (data) {

                    if (!data) {
                        AUSOverride.hideVendorLoanId();
                        return;
                    }
                    else {
                        // update vendor LoanId
                        $('#vendorloanid').text(data);
                        $('#vendorloanidlabel').show();
                        $('#vendorloanid').show();
                    }
                },
                error: function () {
                }
            });
        }
    },

    hideVendorLoanId: function () {
        $('#vendorloanidlabel').hide();
        $('#vendorloanid').hide();
    }
};

Aus = {
    OpenAusTab: function (viewForRendering, loanId) {

        if (viewForRendering == "FannieMae") {

            $.ajax({
                type: "GET",
                url: "Aus/ShowFannieMaeDu",
                cache: false,
                data: { LoanId: loanId },
                dataType: "html",
                success: function (result) {

                    if ($('#fannieMaeDuLink').parent().attr('class').contains("ui-state-active"))
                    {
                        $("#fannieMaeDu").show();
                        $("#fannieMaeDu").html(result);

                        $("#freddieMacLp").hide();
                        $("#freddieMacLp").html(' ');

                        AUSOverride.init(loanId, 'DU');
                        // expand first data block (if any)
                        Aus.AusArrowClick('expand', 'results', 1);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                },
                complete: function (jqXHR, textStatus) {

                }
            });
        }
        else if (viewForRendering == "FreddieMac") {
            $.ajax({
                type: "GET",
                url: "Aus/ShowFreddieMacLp",
                cache: false,
                data: { LoanId: loanId },
                dataType: "html",
                success: function (result) {
                    if ($('#freddieMacLink').parent().attr('class').contains("ui-state-active")) {
                        $("#fannieMaeDu").hide();
                        $("#fannieMaeDu").html(' ');

                        $("#freddieMacLp").show();
                        $("#freddieMacLp").html(result);

                        AUSOverride.init(loanId, 'LP');
                        // expand first data block (if any)
                        Aus.AusArrowClick('expand', 'results', 1);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    $("#freddieMacLp").html('ERROR');
                },
                complete: function (jqXHR, textStatus) {

                }
            });
        }
        else if (viewForRendering == "UsdaGus") {
        }
        else if (viewForRendering == "ManualUnderwriting") {
        }
    },

    AusArrowClick: function (action, data, blocknum) {

        if (action == "collapse") {
            if (data == "validation") {
                $(".arrowCollapsedValidation").css('display', 'inline-block');
                $(".arrowExpandedValidation").css('display', 'none');
                $(".ausValidationTable").hide();

            }
            if (data == "results") {
                $(".fakecollapsed" + blocknum).css('display', 'inline-block');
                $(".fakeexpanded" + blocknum).css('display', 'none');
                $(".resulttable" + blocknum).hide();
            }
        }

        if (action == "expand") {
            if (data == "validation") {
                $(".arrowCollapsedValidation").css('display', 'none');
                $(".arrowExpandedValidation").css('display', 'inline-block');
                $(".ausValidationTable").show();
            }
            if (data == "results") {
                $(".fakecollapsed" + blocknum).css('display', 'none');
                $(".fakeexpanded" + blocknum).css('display', 'inline-block');
                $(".resulttable" + blocknum).show();
            }
        }
    },

    DUSubmittButton: function (loanId, caseid) {
        ShowProcessingInfo();
        $.ajax({
            type: "GET",
            url: 'Home/Aus_DU_Export',
            data: { LoanId: loanId, caseId: caseid },
            success: function (data) {
                if (data == 'True') {
                    $('.btnDuSubmit').attr('disabled', 'disabled');

                    setTimeout(function () { Aus.OpenAusTab("FannieMae", loanId) }, 2000);
                    setTimeout(function () { Aus.OpenAusTab("FannieMae", loanId) }, 10000);
                    setTimeout(function () { Aus.OpenAusTab("FannieMae", loanId) }, 30000);
                    setTimeout(function () { Aus.OpenAusTab("FannieMae", loanId) }, 60000);
                    setTimeout(function () { Aus.OpenAusTab("FannieMae", loanId) }, 90000);
                } else {
                    alert("An error occured while submitting event to processing");
                }
                HideProcessingInfo();
            },
            error: function () {
                alert("An error occured while submitting event to processing");
                HideProcessingInfo();
            }
        });
    },

    LPSubmittButton: function (loanId, caseid) {
        ShowProcessingInfo();
        $.ajax({
            type: "GET",
            url: 'Home/Aus_LP_Export',
            data: { LoanId: loanId, caseId: caseid },
            success: function (data) {
                if (data == 'True') {
                    $('.btnLpSubmit').attr('disabled', 'disabled');

                    setTimeout(function () { Aus.OpenAusTab("FreddieMac", loanId) }, 2000);
                    setTimeout(function () { Aus.OpenAusTab("FreddieMac", loanId) }, 10000);
                    setTimeout(function () { Aus.OpenAusTab("FreddieMac", loanId) }, 30000);
                    setTimeout(function () { Aus.OpenAusTab("FreddieMac", loanId) }, 60000);
                    setTimeout(function () { Aus.OpenAusTab("FreddieMac", loanId) }, 90000);
                } else {
                    alert("An error occured while submitting event to processing");
                }
                HideProcessingInfo();
            },
            error: function () {
                alert("An error occuried while submittig event to processing");
                HideProcessingInfo();
            }
        });
    },

    ShowErrorPopup: function (serviceTrackingId) {
        Aus.SetErrorMessage('Retrieving...');

        $("#AUSMessageDialog").dialog({ position: { my: "center", at: "center", of: window }, modal: true, height: 400, width: 800, title: 'Error Message' });

        $.ajax({
            type: "GET",
            url: 'Home/GetServiceTrackingContract',
            data: { serviceTrackingId: serviceTrackingId },

            success: function (data) {
                // replace EOL with br
                var html = data.ErrorMessage.replace(/(?:\r\n|\r|\n)/g, '<br />');

                // show in UI
                Aus.SetErrorMessage(html);
            },
            error: function () {
                Aus.SetErrorMessage("An error occured while retrieving the data");
            }
        });
    },

    SetErrorMessage: function (message) {
        $('#aus-error-message').empty();
        $('#aus-error-message').append(message);
    }
}


var DefaultAUS = {
    GetAllowedAus: function (loanId, ausTabVisible) {
        // disable Aus menu before we know we have some Aus types for the loan
        $("#AUSMenuLi").hide();

        $.ajax({
            url: 'Aus/GetAllowedAusTypes',
            data: { loanId: loanId },

            success: function (data) {

                // add options to drop down
                for (var i = 0; i < data.length; i++) {

                    $('#aus-type').append($('<option>',
		            {
		                value: data[i].AusType,
		                text: data[i].AusType,
		                selected: data[i].Default
		            }));
                };

                // disable the whole Aus tab if there were no aus types were provided
                if (data.length == 0 || !ausTabVisible)
                    return;
                
                // TODO: make sure user has proper permission to access AUS tab
                $("#AUSMenuLi").show();

                // find default tab
                var defaultTabNum = DefaultAUS.FindDefaultTabForAusType(data);
                LoanDetails.SelectAusTab(defaultTabNum);

                for (var i = 0; i < 4; i++)
                {
                    if (DefaultAUS.TabShouldBeDisabled(i, data))
                        LoanDetails.DisableAusTab(i);
                }
            },
            error: function () {

            }
        });
    },

    UpdateDefaultAus: function (loanId) {
        $.ajax({
            url: 'Aus/UpdateDefaultAus',
            data: { loanId: loanId, defaultAus: $('#aus-type').val() },
            type: "POST",
            success: function (data) {

            },
            error: function () {

            }
        });
    },

    ResolveTabNum: function (ausType) {
        switch (ausType)
        {
        	case "DU":
        	    return 0;
        	    break;

            case "LP":
                return 1;
                break;

            case "sdf":
                return 2;
                break;

            case "sretwer":
                return 3;
                break;

            default:
                return -1;
                break;
        }
    },

    TabShouldBeDisabled: function(tabId, data){
        var disable=true;
        for (var i = 0; i < data.length; i++)
        {
            var tab = DefaultAUS.ResolveTabNum(data[i].AusType);
            if (tab == tabId)
                disable=false;
        }

        return disable;
    },

    FindDefaultTabForAusType: function (data) {
        for (var i = 0; i < data.length; i++) {
            if (data[i].Default)
                return DefaultAUS.ResolveTabNum(data[i].AusType);
        }
    }
}