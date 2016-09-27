LoanServices = {
    LoanServicesLoad: function (loanId, hideProgressBar) {
        ShowProcessingInfo();
        $.ajax({
            type: "GET",
            url: 'Command/Execute',
            data: 'Command=RetrieveLoanServices,LoanId=' + loanId,
            success: function (result) {
                $('#detailsSection').html(result);
                $("#detailsSection").slideDown(400);
                LoanServices.BindLoanServicesFunctions();
                if (hideProgressBar == true)
                    HideProcessingInfo();
            },
            error: function () {
            },
            complete: function () {
                HideProcessingInfo();
            }
        });
    },
    BindLoanServicesFunctions: function () {
        $('.expandable').click(function (e) {

            var loanservicesdivrow = $(this).closest('.loanservicesdivrow');
            var loanserviceadditional = loanservicesdivrow.find('.loanservicesdivadditional');
            var arrow = loanservicesdivrow.find(".arrow div");

            if (loanserviceadditional.length > 0 && $(e.target).closest('.t-dropdown').length == 0 && !$(e.target).hasClass("btnSubmitGrey")) {
                if ($(this).closest('.loanservicesdivrow').height() == 30) {
                    $(this).closest('.loanservicesdivrow').animate({ height: loanserviceadditional.height() + 50 + "px" });
                    arrow.removeClass("arrowright");
                    arrow.addClass("arrowdown");
                } else {
                    $(this).closest('.loanservicesdivrow').animate({ height: "30px" });
                    arrow.removeClass("arrowdown");
                    arrow.addClass("arrowright");
                }
            }
        });
    },
    BindManageLoanServicesMinimize: function () {
        if ($("#manageloanservicesminmax").hasClass('min')) {
            manageloanservicescontent = $("#manageloanservicescontent").height();
            $("#manageloanservicescontent").animate({
                height: "0px"
            },
                500,
                function () {
                    $("#manageloanservicesminmax").removeClass('min');
                    $("#manageloanservicesminmax").addClass('max');
                    $("#manageloanservicescontent").removeClass('manageloanservicescontent');
                    $("#manageloanservicescontent").addClass('manageloanservicescontent2');
                    $("#manageloanserviceshead").removeClass('manageloanserviceshead');
                    $("#manageloanserviceshead").addClass('manageloanserviceshead2');
                }
            );
        }
        else if ($("#manageloanservicesminmax").hasClass('max')) {
            $("#manageloanserviceshead").removeClass('manageloanserviceshead2');
            $("#manageloanservicescontent").removeClass('manageloanservicescontent2');
            $("#manageloanservicescontent").addClass('manageloanservicescontent');
            $("#manageloanserviceshead").addClass('manageloanserviceshead');
            $("#manageloanservicescontent").animate({
                height: manageloanservicescontent
            },
                500,
                function () {
                    $("#manageloanservicesminmax").removeClass('max');
                    $("#manageloanservicesminmax").addClass('min');
                }
            );
        }
    },

    CloseDocumentDownloadPopup: function () {
        $('.modalBackground').fadeOut();
        $("#loanServiceDocumentDownloadPopup").hide();
    },

    DocumentDownloadPopup: function (loanServiceId, eventId) {
        $.ajax({
            type: "GET",
            url: "Command/Execute",
            cache: false,
            data: 'command=OpenLoanServiceDownloadPopup,LoanServiceId=' + loanServiceId + ',EventId=' + eventId,
            dataType: "html",
            success: function (result) {
                $('.modalBackground').fadeIn();
                $("#addNew").html(result);
            },
            error: function (jqXHR, textStatus, errorThrown) {
            },
            complete: function (jqXHR, textStatus) {

            }
        });
    },

    RefreshLoanService: function () {
        var loanId = $("[DetailsLoaded]").find(".loanid").first().text().trim();
        LoanServices.LoanServicesLoad(loanId, true);
    },

    RetryLoanServiceEvent: function (loanServiceEventType, loanServiceEventId) {
        ShowProcessingInfo();
        $.ajax({
            type: "GET",
            url: 'Home/RetryLoanServiceEvent',
            data: 'loanServiceEventType=' + loanServiceEventType + '&loanServiceEventIdEncrypted=' + loanServiceEventId,
            success: function (data) {
                if (data == 'True') {
                    alert("Retry request successfully submitted for processing");
                } else {
                    alert("An error occuried while submitting retry request.");
                }
                HideProcessingInfo();
            },
            error: function () {
                alert("An error occuried while submitting retry request.");
                HideProcessingInfo();
            }
        });
    }
   
}
