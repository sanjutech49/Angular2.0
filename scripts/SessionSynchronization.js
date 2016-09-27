//var timerExpMessage = null;
//perform heartbeat check for last activity time
function HeartBeatCheck() {

    var timeoutTimeInMiliSec = parseInt($('#hdnHeartBeatTime').val()) * 60 * 1000;
    if ($('#dialog-SessionSync') != undefined && $('#dialog-SessionSync').css('display') != 'none' && $("#dialog-SessionSync").attr('messageType') == 'Warning') {
       timeoutTimeInMiliSec = 60000;
    }

    var warningTime = (parseInt($('#hdnSessionExpirationTime').val()) - parseInt($('#hdnWarningTime').val())) * 60 * 1000;
    var expirationTime = parseInt($('#hdnSessionExpirationTime').val()) * 60 * 1000;
   
    setTimeout(function () {

        var target = null;
        if (window.frames[0] != undefined) {
            if (window.frames[0].frames.length != 0) {
                target = window.frames[0].frames[0];
            }
            else {
                target = window.frames[0];
            }

            var data = {
                'loanCenterHeartBeat': ''
            };

            $.postMessage(
            JSON.stringify(data),
            '*',
            target
            );
        }        

        $.ajax({
            type: "POST",
            url: "./Services/SessionExpiration.asmx/GetSessionSynchronizationObject",
            contentType: "application/json; charset=utf-8",
            data: "{ 'lat': '" + $('#hdnLastActivityTime').val() + "' }",
            dataType: "json",
            success: function (response) {

                $('#hdnLastActivityTime').val(response.d);

                var currentDateTimeRes = new Date();
                var curTimeRes = currentDateTimeRes.format("MM/dd/yyyy hh:mm:ss tt");

                var timeDiff = new Date(curTimeRes) - new Date(response.d);
          
                if (timeDiff >= warningTime && timeDiff < expirationTime) {
                    ShowSessionWarningMessage();                   
                }
                else if (timeDiff >= expirationTime) {
                    ShowSessionExpirationMessage();
                }
                else {                    
                    if ($('#dialog-SessionSync') != undefined && $('#dialog-SessionSync').css('display') != 'none' && $("#dialog-SessionSync").attr('messageType') == 'Warning') {
                       
                        $("#dialog-SessionSync").dialog('destroy');
                    }

                    HeartBeatCheck();
                }

            },
            failure: function (msg) {

            }
        });
    }, timeoutTimeInMiliSec);
}

//show session warning message
function ShowSessionWarningMessage() {

    $.ajax({
        type: "POST",
        url: "./Services/SessionExpiration.asmx/GetSessionTimeoutWarningMessage",
        contentType: "application/json; charset=utf-8",
        data: "{ }",
        dataType: "json",
        success: function (response) {

            if ($("#dialog-SessionSync").length == 0 || $("#dialog-SessionSync").attr('messageType') != 'Expired') {
                ShowSessionSyncDialog(response.d, function () { $("#sessionSyncMessage").css('font-size', '11px'); }, function () {
                    var currentDateTime = new Date();
                    var curTime = currentDateTime.format("MM/dd/yyyy hh:mm:ss tt");
                    $('#hdnLastActivityTime').val(curTime);
                });
            }

            HeartBeatCheck();
        },
        failure: function (msg) {

        }
    });
}

//show session expired message and perform logout
function ShowSessionExpirationMessage() {
    $.ajax({
        type: "POST",
        url: "./Services/SessionExpiration.asmx/GetSessionTimeoutExpiredMessage",
        contentType: "application/json; charset=utf-8",
        data: "{ }",
        dataType: "json",
        success: function (response) {

            ShowSessionSyncDialog(response.d, function () { $("#sessionSyncMessage").css('font-size', '15px'); }, function () { $('button.signout').click(); });         
        },
        failure: function (msg) {

        }
    });
}

function ShowSessionSyncDialog(data, configurationCallback, buttonCallback) {

    $("#dialog-SessionSync").attr('title', data["PopupMessageTitle"]);
    $("#dialog-SessionSync").attr('messageType', data["MessageType"]);
    $("#sessionSyncMessage").text(data["PopupMessageContent"]).show();

    if (typeof configurationCallback == "function") {
                configurationCallback();
            }
    
    $("#dialog-SessionSync").dialog({
        modal: true,
        resizable: false,
        closeOnEscape: false,
        buttons: {
            Ok: function () {
                $("#sessionSyncMessage").hide();
                $(this).dialog("destroy");
                if (typeof buttonCallback == "function") {
                            buttonCallback();
                 }
            }
        }
    });
    $(".ui-dialog-titlebar-close").hide();
}