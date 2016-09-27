var xhrGetLoanNumber;
var timer = null;

var hdnCurrentLoanNumber;
var txtLoanNumber;
var waitingForConfimation;

AssignLoanInfo = {
    AssignLoanInfoLoad: function (loanId) {
        ShowProcessingInfo();
        $.ajax({
            type: 'GET',
            url: '/Command/Execute',
            cache: false,
            data: 'Command=AssignLoanInfoLoad,LoanId=' + loanId,
            dataType: "html",
            success: function (data) {
                $('#detailsSection').html(data);
                AssignLoanInfo.AssignLoanInfoSuccess(loanId);
            }
        });
    },
    CompanyOnChange: function () {
        var dropDownList = $("#ddlCompanyId").data("tDropDownList");
        var selectedValue = dropDownList.value();
        $.ajax({
            type: 'GET',
            url: '/Command/Execute',
            cache: false,
            data: 'Command=AssignLoanInfoLoadChannels,CompanyId=' + selectedValue,
            success: function (data) {
                $('#detailsSection').html(data);
            },
            complete: function (jqXHR, textStatus) {
            }
        });
    },
    ChannelOnChange: function () {
        var dropDownList = $("#ddlChannelId").data("tDropDownList");
        var selectedValue = dropDownList.value();
        $.ajax({
            type: 'GET',
            url: '/Command/Execute',
            cache: false,
            data: 'Command=AssignLoanInfoLoadDivisions,ChannelId=' + selectedValue,
            success: function (data) {
                $('#detailsSection').html(data);
            },
            complete: function (jqXHR, textStatus) {
            }
        });
    },
    DivisionOnChange: function () {
        var dropDownList = $("#ddlDivisionId").data("tDropDownList");
        var selectedValue = dropDownList.value();
        $.ajax({
            type: 'GET',
            url: '/Command/Execute',
            cache: false,
            data: 'Command=AssignLoanInfoLoadBranches,DivisionId=' + selectedValue,
            success: function (data) {
                $('#detailsSection').html(data);
            },
            complete: function (jqXHR, textStatus) {
            }
        });
    },
    BranchOnChange: function () {
        var dropDownList = $("#ddlBranchId").data("tDropDownList");
        var selectedValue = dropDownList.value();
        $.ajax({
            type: 'GET',
            url: '/Command/Execute',
            cache: false,
            data: 'Command=AssignLoanInfoLoadConciergesAndLOs,BranchId=' + selectedValue,
            success: function (data) {
                $('#detailsSection').html(data);
            },
            complete: function (jqXHR, textStatus) {
            }
        });
    },

    AssignLoanInfoSuccess: function (loanId) {
        $("#detailsSection").slideDown(400);
        HideProcessingInfo();
        BindAssignLoanInfoEvents();
        if (xhrGetLoanNumber != null) {
            //alert('PageLoad: xhr exists for loanid = ' + loanId);
            clearTimeout(timer);
            xhrGetLoanNumber.abort();
        }
        AssignLoanInfo.UpdateLoanNumber(loanId);
    },
    SaveAssignedInfo: function (loanId, companyId) {
        var regex = /[a-z0-9]$/;
        if (regex.test($(".assignloaninfotable #LoanNumber").val().toLowerCase()) == false) {
            $(".assignloaninfotable #LoanNumber").addClass("errorInput");
            return false;
        }

        $('.assignloaninfonotification').text('Saving...');
        $('.assignloaninfonotification').show();
        $('#assignloaninfosmallloader').show();
        $('#assignloaninfosubmit').hide();
  
        var assignLoanInfo = {
            LoanId: loanId,
            LoanNumber: $(".assignloaninfotable #LoanNumber").val(),
            LosFolder: $(".assignloaninfotable #LosFolder").data("tDropDownList").value(),
            ConciergeId: $(".assignloaninfotable #ConciergeId").data("tDropDownList").value(),
            ConciergeNMLS: $(".assignloaninfotable #ConciergeNMLS").val(),
            LoaId: $(".assignloaninfotable #LoaId").val(),
            EnableDigitalDocsCall: $('.assignloaninfotable #EnableDigitalDocs').is(':checked'),
            CompanyId: companyId,
            ChannelId: $("#ddlChannelId").data("tDropDownList").value(),
            DivisionId: $("#ddlDivisionId").data("tDropDownList").value(),
            BranchId: $("#ddlBranchId").data("tDropDownList").value(),
            CallCenterId: $(".assignloaninfotable #CallCenterId").val()
        };

        $.ajaxAntiForgery({
            type: 'POST',
            url: '/Loan/SaveAssignInfo',
            cache: false,
            data: assignLoanInfo,
            dataType: "html",
            success: function (data) {
                if (data == "True") {
                    $('.assignloaninfonotification').text('Saved');
                    Refresh.RefreshDataHelper();
                }
                else
                    $('.assignloaninfonotification').text('Failed to save');

                $('#assignloaninfosmallloader').hide();
                $('#assignloaninfosubmit').show();
                setTimeout(function () { $('.assignloaninfonotification').fadeOut(); }, 2000);
            },
            complete: function () {

            },
            failed: function () {
                $('.assignloaninfonotification').text('Failed to save');
                $('#assignloaninfosmallloader').hide();
                $('#assignloaninfosubmit').show();
                setTimeout(function () { $('.assignloaninfonotification').fadeOut(); }, 2000);
            }

        });


    },

    NSMLChanged: function () {
        var conciergeId = $(".assignloaninfotable #ConciergeId").data("tDropDownList").value();
        $.ajax({
            type: 'GET',
            url: '/UserAccount/GetNMLS',
            cache: false,
            data: 'conciergeId=' + conciergeId,
            dataType: "html",
            success: function (data) {
                $(".assignloaninfotable #ConciergeNMLS").val(data);
            }
        });
    },
    UrlDeliveryMethodChanged: function () {
        var hlDownloadUrla = $('#aUrlaDownloadLink').attr("href");
        hlDownloadUrla = hlDownloadUrla.substring(0, hlDownloadUrla.length - 1) + $("#ddlUrlaDeliveryMethod").data("tDropDownList").value();
        $('#aUrlaDownloadLink').attr("href", hlDownloadUrla);
    },

    UpdateLoanNumber: function (loanId) {
        //var loanId = $("#hdnSelectedLoanId").val();
        //alert('Polling for loanid = ' + loanId);
        if (xhrGetLoanNumber)
            xhrGetLoanNumber.abort();

        xhrGetLoanNumber = $.ajax({
            type: "GET",
            url: "/Loan/GetLoanNumber",
            contentType: "application/json; charset=utf-8",
            data: 'loanId=' + loanId,
            dataType: "json",
            success: function (data) {
                if (data != null && (waitingForConfimation != true)) {
                    $("#LoanNumber").val(data.LoanNumber);
                    if ((data.LoanNumber != '') && (data.LoanNumber != 'Pending')) {
                        // Loan Number recieved, hide 'Import to LOS in Progress' message
                        $(".divInProgressMessage").hide();
                    }
                }

                timer = setTimeout(function () { AssignLoanInfo.UpdateLoanNumber(loanId); }, 45000);
            },
            error: function (xhr, ajaxOptions, thrownError) {
            }
        });
    },

    ShowConfirmationPopup: function (loanId, companyId) {
        hdnCurrentLoanNumber = $("#hdnCurrentLoanNumber").val();
        txtLoanNumber = $("#LoanNumber").val();

        if ((hdnCurrentLoanNumber.toLowerCase() == "pending") && (hdnCurrentLoanNumber.toLowerCase() != txtLoanNumber.toLowerCase())) {
            // user changed loan number from Pending to other value, show confirmation popup

            //$.facebox.settings.yesnoquestion = true;
            //$.facebox.settings.yesImage = "../../Images/facebox/yeslabel.png";
            //$.facebox.settings.noImage = "../../Images/facebox/nolabel.png";
            //$.facebox.settings.yesnocallback = ConfirmChanges;
            $("#divConfirmationPopup").show();
            //$.facebox("Please confirm that the Loan ID and LOS folder values are correct?");
            waitingForConfimation = true;
            //return false;
        }
        else {
            waitingForConfimation = false;
            AssignLoanInfo.SaveAssignedInfo(loanId, companyId);
            //return true;
        }
    },

    ConfirmChanges: function (accepted, loanId) {
        if (accepted) {
            // proceed to save loan info
            AssignLoanInfo.SaveAssignedInfo(loanId);
        }
        else {
            // return to old value ?
            $("#LoanNumber").val(hdnCurrentLoanNumber);
            $("#divConfirmationPopup").hide();
        }
    },

    CloseConfirmationPopup: function () {
        $("#divConfirmationPopup").hide();
    }
}