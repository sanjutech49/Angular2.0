Log = {
    ClickAndShowLog: function () {

        var loanId = $('.tablelistselected').find('.loanid').text();
        var prospectId = $('.tablelistselected').find('.prospectid').text();
        $.ajax({
            type: "GET",
            url: 'Home/ShowLog',
            data: 'loanId=' + loanId +
                  '&prospectId=' + prospectId,
            success: function (result) {
                $('.modalBackground').fadeIn();
                $('#divpopup').show();
                $('#divpopup').html(result);
            },
            error: function () {
            },
            complete: function () {
            }
        });
    },

    CloseLog: function () {
        $('.modalBackground').fadeOut();
        $('#divpopup').hide();
    },

    ClickAndShowConversationLogDetails: function (element, loanId, source) {
        var conversationLogId = $(element).closest(".logItem").find("#logTableItemId").text();
        $.ajax({
            type: "GET",
            url: 'Home/ShowConversationLog',
            data: 'conversationLogId=' + conversationLogId + '&loanId=' + loanId + "&source=" + source,
            success: function (result) {
                $('#divConversationLogPopup').show();
                $('#divConversationLogPopup').html(result);
                if ($('#isNotNotesPopup').val() == "True") {
                    $('.modalBackground').css('display', 'block');
                }
            },
            error: function () {
            },
            complete: function () {
            }
        });
    },

    CloseConversationLogPopup: function () {
        $("#divconversationlogpopup").hide();
        if ($('#isNotNotesPopup').val() == "True") {
            $('.modalBackground').css('display', 'none');
        }
    },

    SaveConversationLog: function (logId, loanId) {
        var subject = $("#logSubject").val();
        var topic = $("#logCategory").val();
        var comment = $("#LogItem_Comment").val();       
        var prospectId = $('.tablelistselected').find('.prospectid').text(); //contactId

        $.ajax({
            type: "GET",
            url: 'Home/SaveConversationLog',
            data:
				'loanId=' + loanId +
				'&logId=' + logId +
				'&subject=' + subject +
				'&topic=' + topic + '' +
				'&comment=' + comment +
				'&viewableonborower=' + false +
                '&prospectId=' + prospectId,
            success: function (result) {

                // Refresh list after adding new log
                $.ajax({
                    type: "GET",
                    url: 'Home/ShowLog',
                    data: 'loanId=' + loanId +
                          '&prospectId=' + prospectId,
                    success: function (result2) {
                        //$('.modalBackground').fadeIn();
                        //$('#divpopup').show();
                        if ($('#isNotNotesPopup').val() != "True") {
                            $('#divpopup').html(result2);
                        }
                        $('#divConversationLogPopup').hide();

                    },
                    error: function () {
                    },
                    complete: function () {
                    }
                });


                $.ajax({
                    type: "GET",
                    url: 'Home/ShowLog',
                    data: 'loanId=' + loanId +
                          '&prospectId=' + prospectId +
                          '&source=true',
                    success: function (result2) {
                        $('#alertBoxOnManageProspects').html(result2);
                        if ($('#isNotNotesPopup').val() == "True") {
                            $('.modalBackground').css('display', 'none');
                        }

                    },
                    error: function () {
                    },
                    complete: function () {
                    }
                });

                //$('#divConversationLogPopup').html(result);
            },
            error: function () {
            },
            complete: function () {
            }
        });
    },
    GetNumberOfCharactersLeftToEnter: function(element) {
        var value = 250;
        if (parseInt($(element).val().length) > 0) {
            value = 250 - parseInt($(element).val().length);
        }
        $("#conversationlogcontentcommentnote").html("Max. " + value + " characters");
    }
};
