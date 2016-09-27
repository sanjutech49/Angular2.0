var resultGlobal;

RateOptions = {

    RateOptionsNotePopup: function (sentEmailId) {
        $.ajax({
            type: "GET",
            url: "Command/Execute",
            cache: false,
            data: 'command=OpenRateOptionNotesPopup,SentMailId=' + sentEmailId,
            dataType: "html",
            success: function (result) {
                $('.modalBackground').fadeIn();
                $("#addNew").html(result);
                resultGlobal = result;
            },
            error: function (jqXHR, textStatus, errorThrown) {
            },
            complete: function (jqXHR, textStatus) {

            }
        });
    },

    CloseRateOptionNotePopup: function () {
        $('.modalBackground').fadeOut();
        $("#rateOptionsNotesPopup").hide();
    },


    SaveRetailOptionNotes: function (sentEmailId) {


        $.ajax({
            type: "POST",
            url: "/Home/UpdateRateOptionsNote",
            contentType: "application/json; charset=utf-8",
            data: "{ Id: '" + sentEmailId + "', " +
                     "Notes: '" + $("#SentEmailNote").val() + "' }",
            success: function (msg) {
                $('.modalBackground').fadeOut();
                $("#rateOptionsNotesPopup").hide();
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert(thrownError);
            },
            complete: function (jqXHR, textStatus) {
            }
        });
    }
}