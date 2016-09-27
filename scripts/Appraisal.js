Appraisal = {

    OpenAppraisalFormCommand: function (loanId, prospectId) {
        ShowProcessingInfo();
        Appraisal.OpenAppraisalFormCommandOnBegin();
        $.ajax({
            type: "GET",
            url: "Command/Execute",
            cache: false,
            data: 'command=' + "ShowAppraisalForm,LoanId=" + loanId + ",ProspectId=" + prospectId,
            dataType: "html",
            success: function (result) {
                $("#detailsSection").html(result);
            },
            //            error: function (jqXHR, textStatus, errorThrown) {
            //            },
            complete: function (jqXHR, textStatus) {
                CloseProcessingInfo();
            }
        });
    },

    OpenAppraisalFormAsMainCommand: function (loanId, prospectId) {
        ShowProcessingInfo();
        $.ajax({
            type: "GET",
            url: "Command/Execute",
            cache: false,
            data: 'command=' + "ShowAppraisalForm,LoanId=" + loanId + ",ProspectId=" + prospectId,
            dataType: "html",
            success: function (result) {
                $("#oldGridPlaceholder").removeAttr("style");
                $("#oldAppraisal").html(result);
                
            },
            //            error: function (jqXHR, textStatus, errorThrown) {
            //            },
            complete: function (jqXHR, textStatus) {
                CloseProcessingInfo();
            }
        });
    },

    OpenAppraisalFormCommandOnBegin: function (data) {
        $("#detailsSection").slideDown(400);
    },

    BindAppraisalFormMinimize: function () {
        if ($("#appraisalformminmax").hasClass('min')) {
            manageprospectscontentHeight = $("#appraisalcontent").height();
            $("#appraisalcontent").animate({
                height: "0px"
            },
                500,
                function () {
                    $("#appraisalformminmax").removeClass('min');
                    $("#appraisalformminmax").addClass('max');
                    $("#appraisalcontent").removeClass('appraisalcontent');
                    $("#appraisalcontent").addClass('appraisalcontent2');
                    $("#appraisalhead").removeClass('appraisalhead');
                    $("#appraisalhead").addClass('appraisalhead2');
                }
            );
        }
        else if ($("#appraisalformminmax").hasClass('max')) {
            $("#appraisalhead").removeClass('appraisalhead2');
            $("#appraisalcontent").removeClass('appraisalcontent2');
            $("#appraisalcontent").addClass('appraisalcontent');
            $("#appraisalhead").addClass('appraisalhead');
            $("#appraisalcontent").animate({
                height: manageprospectscontentHeight
            },
                500,
                function () {
                    $("#appraisalformminmax").removeClass('max');
                    $("#appraisalformminmax").addClass('min');
                }
            );
        }
    },

    OpenAppraisalBillingHistoryPopup: function (data) {
        ShowProcessingInfo();
        $.ajax({
            type: "GET",
            url: "Command/Execute",
            cache: false,
            data: 'command=ShowAppraisalBillingHistory,OrderAppraisalId=' + data,
            dataType: "html",
            success: function (result) {
                $('.modalBackground').fadeIn();
                $("#addNew").html(result);
            },
            error: function (jqXHR, textStatus, errorThrown) {

            },
            complete: function (jqXHR, textStatus) {
                CloseProcessingInfo();
            }
        });
    },

    CloseAppraisalBillingHistoryPopup: function () {
        $('.modalBackground').fadeOut();
        $("#appraisalBillingHistoryPopup").hide();
    }
}