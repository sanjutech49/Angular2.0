UploadFile = {
    ClickAndShowUploadFile: function (_loanid, _userAccountId) {

        $.ajax({
            type: "GET",
            url: 'Appraisal/ShowUploadFile',
            data: { loanId: encodeURIComponent(_loanid), userAccountId: encodeURIComponent(_userAccountId) },
            dataType: 'html',
            success: function (result) {
                $('.modalBackground').fadeIn();
                $('#divpopup').show();
                $('#divpopup').html(result);
            },
            error: function (request, status, error) {
                console.log("Error: " , error , " Status: " + status);
            },
            complete: function () {
            }
        });
    },

    CloseShowUploadFilePopup: function () {
        $("#divconversationlogpopup").hide();
        if ($('#isNotNotesPopup').val() == "True") {
            $('.modalBackground').css('display', 'none');
        }
    },
    CloseShowUploadFile: function () {
        $('.modalBackground').fadeOut();
        $('#divpopup').hide();
    },
    ReloadAppraisalDocuments: function (_loanid, _userAccountId, _source) {
      
        
        $.ajax({
            type: "GET",
            url: 'Appraisal/GetAppraisalUploadedDocuments',
            data: { loanId: encodeURIComponent(_loanid), userAccountId: encodeURIComponent(_userAccountId) },
            success: function (result) {

                $("#appraisalOrderInformationDocuments").html(result);
            },
            error: function (request, status, error) {
                console.log("Error: " , error , " Status: " + status);
            },
            complete: function () {
                var container = $("#appraisalOrderInformationDocuments");
                if (container.length) {
                    var i = 0;
                    var listOfDocObjectsOut = $("#appraisalOrderInformationDocuments").data('_DocObjects');
                    
                    listOfDocObjectsOut.forEach(function (entry) {

                        $("#" + listOfDocObjectsOut[i].id + " .uploadDocumentContent input[type='checkbox']").attr("checked", listOfDocObjectsOut[i].value);
                        i++;
                    });
                }

                if (_source == "appraisalForm") {
                    
                }
                else {
                   
                    
                }
            }
        });
    }
};