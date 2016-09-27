ManageProspects = {

    ManageProspectsLoad: function (loanId, prospectId, hideProgressBar) {
        ShowProcessingInfo();

        $.ajax({
            type: 'GET',
            url: '/Command/Execute',
            cache: false,
            data: 'Command=ManageProspects,LoanId=' + loanId + ',ProspectId=' + prospectId,
            dataType: "html",
            success: function (data) {
                $('#detailsSection').html(data);
                ManageProspects.ManageProspectsSuccess(hideProgressBar);
            }
        });

    },

    ManageProspectsSave: function (loanId, prospectId, companyId) {

        $('.manageprospectnotification').text('Saving...');
        $('.manageprospectnotification').show();

        var manageProspect = {
            LoanId: loanId,
            ProspectId: prospectId,
            SelectedStatus: $("#ddlStatus").data("tDropDownList").value(),
            SelectedCallCenter: $("#ddlCallCenter").data("tDropDownList").value(),
            SelectedConcierge: $("#ddlConcierge").data("tDropDownList").value(),
            SelectedLoa: $("#ddlLoa").data("tDropDownList").value(),
            CompanyId: companyId,
            ChannelId: $("#ddlChannelId").data("tDropDownList").value(),
            DivisionId: $("#ddlDivisionId").data("tDropDownList").value(),
            BranchId: $("#ddlBranchId").data("tDropDownList").value()
        }

        $.ajax({
            type: 'POST',
            url: '/Loan/ManageProspectsSave',
            cache: false,
            data: manageProspect,
            dataType: "html",
            success: function (data) {
                if (data == "True") {
                    $('.manageprospectnotification').text('Saved');
                    Refresh.RefreshDataHelper();
                }
                else
                    $('.manageprospectnotification').text('Failed to save');

                setTimeout(function () { $('.manageprospectnotification').fadeOut(); }, 2000);
            },
            complete: function () {

            },
            failed: function () {
            }
        });

    },

    ManageProspectsSuccess: function (hideProgressBar) {
        $("#detailsSection").slideDown(400);
        if (hideProgressBar == true)
            HideProcessingInfo();
    },

    BindManageProspectsMinimize: function () {
        if ($("#manageprospectsminmax").hasClass('min')) {
            manageprospectscontentHeight = $("#manageprospectscontent").height();
            $("#manageprospectscontent").animate({
                height: "0px"
            },
                500,
                function () {
                    $("#manageprospectsminmax").removeClass('min');
                    $("#manageprospectsminmax").addClass('max');
                    $("#manageprospectscontent").removeClass('manageprospectscontent');
                    $("#manageprospectscontent").addClass('manageprospectscontent2');
                    $("#manageprospectshead").removeClass('manageprospectshead');
                    $("#manageprospectshead").addClass('manageprospectshead2');
                }
            );
        }
        else if ($("#manageprospectsminmax").hasClass('max')) {
            $("#manageprospectshead").removeClass('manageprospectshead2');
            $("#manageprospectscontent").removeClass('manageprospectscontent2');
            $("#manageprospectscontent").addClass('manageprospectscontent');
            $("#manageprospectshead").addClass('manageprospectshead');
            $("#manageprospectscontent").animate({
                height: manageprospectscontentHeight
            },
                500,
                function () {
                    $("#manageprospectsminmax").removeClass('max');
                    $("#manageprospectsminmax").addClass('min');
                }
            );
        }
    },


    ClickAndShowEmailDetails: function (element) {
        var emailId = $(element).attr("mailId");

        $.ajax({
            type: "GET",
            url: 'Home/ShowEmailDetails',
            data: 'emailId=' + emailId,
            success: function (result) {
                $('.modalBackground').fadeIn();
                $('#divEmailDetailsPopup').show();
                $('#divEmailDetailsPopup').html(result);
            },
            error: function () {
            },
            complete: function () {
            }
        });
    },

    CloseEmailDetails: function () {
        $('.modalBackground').fadeOut();
        $("#divEmailDetailsPopup").hide();
    },

    GetLoansAndRatesFromManageProspects: function () {
        var userAccountId = $(".tablelistselected .userAccountId").text();
        var loanId = $(".tablelistselected .loanid").text();
        var contactId = $(".tablelistselected .prospectid").text();

        GetStarted.StartNewProspect('command=GetLoansAndRatesFromManageProspects,userAccountId=' + userAccountId + ',loanId=' + loanId + ',contactId=' + contactId, true);
    },
       CompanyOnChange: function () {
           var dropDownList = $("#ddlCompanyId").data("tDropDownList");
           var selectedValue = dropDownList.value();
           $.ajax({
               type: 'GET',
               url: '/Command/Execute',
               cache: false,
               data: 'Command=ManageProspectsLoadChannels,CompanyId=' + selectedValue,
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
               data: 'Command=ManageProspectsLoadDivisions,ChannelId=' + selectedValue,
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
               data: 'Command=ManageProspectsLoadBranches,DivisionId=' + selectedValue,
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
               data: 'Command=ManageProspectsLoadConciergesAndLOs,BranchId=' + selectedValue,
               success: function (data) {
                   $('#detailsSection').html(data);
               },
               complete: function (jqXHR, textStatus) {
               }
           });
       }

}
