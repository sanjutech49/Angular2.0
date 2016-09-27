TaskGrid = {
    OfficerDataOnBegin: function (data) {
        ShowProcessingInfo();
        classRemover();
        $('#hometab').addClass('hometabselected');
    },
    OfficerDataOnComplete: function (data) {
        HideProcessingInfo();
        $('#FilterContext').val('OfficerTask');
    },
    OfficerDataOnFailure: function (data) {
        // TODO: Add handling
    },
    OfficerDataHelper: function (data) {
        TaskGrid.OfficerDataOnBegin();
        $.ajax({
            type: "GET",
            url: "Command/Execute",
            cache: false,
            data: data,
            dataType: "html",
            success: function (result) {
                $("#mainsection").html(result);
                TaskGrid.OfficerDataOnSuccess();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                TaskGrid.OfficerDataOnFailure();
            },
            complete: function (jqXHR, textStatus) {
                TaskGrid.OfficerDataOnComplete();
            }
        });       
    },
    OfficerDataOnSuccess: function (data) {
        $("#tabOfficerTaskCount").html($("#nooftasks2").html());
        BindOfficerTaskEvents();
    }
};