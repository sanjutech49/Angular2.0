/* START Export and Import Loans */

$("#ImportLoan").change(function () {
    var formdata = new FormData(); //FormData object
    var fileInput = document.getElementById('ImportLoan');

    if (fileInput.files[0].size <= 0) {
        ShowAjaxMessagePopUp("Selected file is empty: its size is zero bytes.");
    }
    if (fileInput.files[0].type.indexOf("xml") < 0) {
        ShowAjaxMessagePopUp("Invalid file, please select a loan XML file.");
    }
});

$("#UploadXMLfile").click(function () {

    var formdata = new FormData(); //FormData object
    var fileInput = document.getElementById('ImportLoan');
    var refreshData = false;

    if (fileInput.files.length > 0) {

        if (fileInput.files[0].size > 0) {
            $("#importloan_dialog").dialog("close");
            ShowProcessingInfo();
            //Iterating through each files selected in fileInput
            for (i = 0; i < fileInput.files.length; i++) {
                //Appending each file to FormData object
                formdata.append(fileInput.files[i].name, fileInput.files[i]);
            }
            //Creating an XMLHttpRequest and sending
            var xhr = new XMLHttpRequest();
            xhr.open('POST', '/Loan/GetLoanFromXml');
            xhr.send(formdata);
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    HideProcessingInfo();
                    if (xhr.responseText == '"OK"') {
                        Refresh.RefreshDataHelper();
                    }
                    else {
                        ShowAjaxMessagePopUp("The loan was not imported. Please check selected file or proceed selecting another one.");
                    }
                }
            }
            $(this).dialog("close");
        }
        else {
            ShowAjaxMessagePopUp("Selected file is empty, its size is zero bytes.");
        }
    }
    else {
        ShowAjaxMessagePopUp("Please select a loan XML file");
        return false;
    }
});

$("#UploadXMLfile_from_pending_approval").click(function () {

    var formdata = new FormData(); //FormData object
    var fileInput = document.getElementById('ImportLoan_from_pending_approval');
    var refreshData = false;

    if (fileInput.files.length > 0) {
        if (fileInput.files[0].size > 0) {
            $("#importloan_dialog_from_pending_approval").dialog("close");
            ShowProcessingInfo();
            //Iterating through each files selected in fileInput
            for (i = 0; i < fileInput.files.length; i++) {
                //Appending each file to FormData object
                formdata.append(fileInput.files[i].name, fileInput.files[i]);
            }

            //Creating an XMLHttpRequest and sending
            var xhr = new XMLHttpRequest();
            xhr.open('POST', '/Loan/GetLoanFromXmlForPendingApproval');
            xhr.send(formdata);
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    HideProcessingInfo();
                    if (xhr.responseText == '"OK"') {
                        Refresh.RefreshDataHelper();
                    }
                    else {
                        ShowAjaxMessagePopUp("The loan was not created. Please check selected file or proceed selecting another one.");
                    }
                }
            }
            $(this).dialog("close");
        }
        else {
            ShowAjaxMessagePopUp("Selected file is empty, its size is zero bytes.");
        }
    }
    else {
        ShowAjaxMessagePopUp("Please select a loan XML file");
        return false;
    }
});

// This function is used in pipeline: \Views\Shared\Index.cshtml file
// * Javier Livio 06/17/2014 ****************************************
function ClickAndCopyLoan() {
    $("#confirmation_dialog").dialog({
        buttons: {
            "Confirm": function () {
                var loanId = $('.tablelistselected').find('.loanid').text();
                $(this).dialog("close");
                ShowProcessingInfo();
                $.ajax({
                    type: "GET",
                    url: 'Loan/CopyLoan',
                    data: 'loanId=' + loanId,
                    success: function (result) {
                        if (result == 'OK') {
                            Refresh.RefreshDataHelper();
                        } else {
                            HideProcessingInfo();
                            ShowAjaxMessagePopUp("An error occurred while copying a loan.");
                        }
                    },
                    error: function () {
                        HideProcessingInfo();
                    },
                    complete: function () {
                        HideProcessingInfo();
                    }
                });
            },
            "Cancel": function () {
                $(this).dialog("close");
                return false;
            }
        }
    });

    $("#confirmation_dialog").dialog("open");
}

function ClickAndExportLoan() {
    ShowProcessingInfo();
    var hdnEncryptSSN = $("#hdnEncryptSSN").val();
    if (hdnEncryptSSN == "") {
        hdnEncryptSSN = "false";
    }
    var url = "Downloader.axd?documentType=LoanXML&LoanId=" + $('.tablelistselected').find('.loanid').text() + "&encryptssn=" + hdnEncryptSSN;
    document.location = url;
    HideProcessingInfo();
}

function ClickAndImportLoan() {
    $("#importloan_dialog").dialog();
    $("#ImportLoan").show();
    $("#UploadXMLfile").show();
}

function ClickAndImportLoanFromPendingApproval() {
    $("#importloan_dialog_from_pending_approval").dialog();
    $("#ImportLoan_from_pending_approval").show();
    $("#UploadXMLfile_from_pending_approval").show();
}

function ShowAjaxMessagePopUp(message) {

    $(".alertmessage").css("display", "block");
    $('#dialog-modal-text').text(message);
    $("#dialog-modal-responsive").dialog({
        height: 140,
        width: 350,
        modal: true,
        resizable: false,
        buttons: {
            Ok: function () {
                $(this).dialog("close");
            }
        }
    });

    $("#body").parent().unblock();
}

/* End Import Export Loan */