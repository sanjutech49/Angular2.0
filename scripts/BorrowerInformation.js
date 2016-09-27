$(document).ready(function () {
    $("#divborrowerpopup").draggable({ handle: "div.divborrowerpopup" });
    $("#txtBFirstName").focus();

    $('.dblClick').dblclick(function (e) {
        index = $('.dblClick').index(this);
        loanId = $('.dblClick').eq(index).parent().parent().find('input[id*=hdn_]').val();
        ShowBorrowerInformationPopup(loanId);
    });

    //****MULTIPLE BORROWERS EVENTS****//
    $("div[id*=borrowersContainer_]").each(function (e) {
        $("div[id*=borrowersContainer_]").eq(e).mouseover(function () {
            $("div[id*=borrowersContainer_]").css({ 'cursor': 'default', 'background-color': 'white' });
            $("[id*=borrowersContainer_]").eq(e).css({ 'background-color': '#e6e6e6' });
        });

        $("div[id*=borrowersContainer_]").eq(e).mouseout(function () {
            $("div[id*=borrowersContainer_]").eq(e).css({ 'background-color': 'white' });
            $("div[id*=borrowersContainer_]:odd").last().css({ 'background-color': '#e6e6e6' });
        });
    });
    $('input[id*=remove]').click(function (e) {
        e.preventDefault(); //this must be removed after whole logic of button is created
        index = $('input[id*=remove]').index(this);
        //parent = ;
        borrowerId = $('#' + document.getElementById($('input[id*=remove]').eq(index).attr('id')).parentNode.parentNode.id + '').find('input[id*=hdnBorrower_]').val();
        if ($(this).val() == 'Remove') {
            $(this).val('Re-Add');
            DisableRemovedBorrowerCoBorrower(document.getElementById($('input[id*=remove]').eq(index).attr('id')).parentNode.parentNode.id);
            $('#divSaveCancel').css({ 'display': 'block' });
            $('#hdnToBeRemoved').val($('#hdnToBeRemoved').val() + borrowerId + '_1;');
            $('ul.t-reset li:contains(' + borrowerId + ')').hide();
            DisableListItems(borrowerId);
        } else if ($(this).val() == 'Re-Add') {
            $(this).val('Remove');
            ReAddRemovedBorrowerCoBorrower(document.getElementById($('input[id*=remove]').eq(index).attr('id')).parentNode.parentNode.id)
            $('#hdnToBeRemoved').val($('#hdnToBeRemoved').val().replace(borrowerId + '_1;', ''));
            EnableListItems(borrowerId);
            if ($('#hdnToBeRemoved').val() == '' && $('#borrowerPriority').data('tDropDownList').value() == $('#hdnPrimaryBorrower').val()) {
                $('#divSaveCancel').css({ 'display': 'none' });
            }
        }
    });
    $('input[id*=reAdd]').click(function (e) {
        e.preventDefault(); //this must be removed after whole logic of button is created
        index = $('input[id*=reAdd]').index(this);
        parent = document.getElementById($('input[id*=reAdd]').eq(index).attr('id')).parentNode.parentNode.id;
        borrowerId = $('#' + document.getElementById($('input[id*=reAdd]').eq(index).attr('id')).parentNode.parentNode.id + '').find('input[id*=hdnBorrower_]').val();

        if ($(this).val() == 'Remove') {
            $(this).val('Re-Add');
            DisableRemovedBorrowerCoBorrower(document.getElementById($('input[id*=reAdd]').eq(index).attr('id')).parentNode.parentNode.id);
            $
            ('#hdnToBeRemoved').val($('#hdnToBeRemoved').val().replace(borrowerId + '_0;', ''));

            if ($('#hdnToBeRemoved').val() == '' && $('#borrowerPriority').data('tDropDownList').value() == $('#hdnPrimaryBorrower').val()) {
                $('#divSaveCancel').css({ 'display': 'none' });
            }
        }
        else if ($(this).val() == 'Re-Add') {
            $(this).val('Remove');
            ReAddRemovedBorrowerCoBorrower(document.getElementById($('input[id*=reAdd]').eq(index).attr('id')).parentNode.parentNode.id)
            $('#divSaveCancel').css({ 'display': 'block' });
            $('#hdnToBeRemoved').val($('#hdnToBeRemoved').val() + borrowerId + '_0;');
        }
    });

    $('input[id*=reAdd]').each(function (e) {
        buttonParent = document.getElementById($('input[id*=reAdd]').eq(e).attr('id')).parentNode.parentNode.id
        if ($('input[id*=reAdd]').eq(e).val() == 'Re-Add') {
            DisableRemovedBorrowerCoBorrower(buttonParent);
        }
    });
    $('input[id*=remove]').each(function (e) {
        buttonParent = document.getElementById($('input[id*=remove]').eq(e).attr('id')).parentNode.parentNode.id
        if ($('input[id*=remove]').eq(e).val() == 'Re-Add') {
            DisableRemovedBorrowerCoBorrower(buttonParent);
        }
    });

    $('#cancelChanges').click(function (e) {
        e.preventDefault();
        $('#hdnToBeRemoved').val('');

        $('input[id*=remove]').each(function (e) {
            if ($('input[id*=remove]').eq(e).val() == 'Re-Add') {
                $('input[id*=remove]').eq(e).val('Remove');
                ReAddRemovedBorrowerCoBorrower(document.getElementById($('input[id*=remove]').eq(e).attr('id')).parentNode.parentNode.id);
                $('#divSaveCancel').css({ 'display': 'none' });
            }
        });

        $('input[id*=reAdd]').each(function (e) {
            if ($('input[id*=reAdd]').eq(e).val() == 'Remove') {
                $('input[id*=reAdd]').eq(e).val('Re-Add');
                DisableRemovedBorrowerCoBorrower(document.getElementById($('input[id*=reAdd]').eq(e).attr('id')).parentNode.parentNode.id);
                $('#divSaveCancel').css({ 'display': 'none' });
            }
        });

    });

    $("div[id*=borrowersContainer_]:odd").css({ 'background-color': '#e6e6e6' });
    $("div[id*=borrowersContainer_]").first().css({ 'margin-top': '0px' });
    /**************************************/
});

//****MULTIPLE BORROWERS FUNCTIONS****//
function DisableRemovedBorrowerCoBorrower(buttonParent) {
    $('#' + buttonParent + '').css({ 'color': 'gray' });
    $('#' + buttonParent + '').find('span.onlineUser').css({ 'color': 'gray' });
    $('#' + buttonParent + '').find('div.onlineUser').css({ 'color': 'gray' });
    $('.appNumberStyle').css({ 'color': 'black' });
}
function ReAddRemovedBorrowerCoBorrower(buttonParent) {
    $('#' + buttonParent + '').css({ 'color': 'black' });
    $('#' + buttonParent + '').find('span.onlineUser').css({ 'color': '#4781d3' });
    $('#' + buttonParent + '').find('div.onlineUser').css({ 'color': '#4781d3' });
}

function onChange(e) {
    if (e.value != $('#hdnPrimaryBorrower').val()) {
        $('#divSaveCancel').css({ 'display': 'block' });
    }else if($('#hdnToBeRemoved').val() != ''){
        $('#divSaveCancel').css({ 'display': 'block' });
    } 
    else {
        $('#divSaveCancel').css({ 'display': 'none' });
    }
}

function getComboBoxItems() {
    //"ComboBox" is the value specified by the Name() method.
    var combobox = $("#borrowerPriority").data("tDropDownList");
    return combobox;
}

function DisableRemovedBorrowerFromDDL(borrowerToBeRemoved) {
    ddlObject = $('#borrowerPriority').data('tDropDownList')
    ddlItems = ddlObject.data;
    for (i = 0; i < ddlItems.length; i++) {
        if (ddlItems[i].Value == borrowerToBeRemoved) {
            ddlItems[i].css({'background-color':'red', 'color':'yellow'});
        }
    }
}

function DisableListItems(disableItem) {

    var ctrl = $('#borrowerPriority').data('tDropDownList');
    ctrl.open();
    ctrl.close();
    selectedIndex = $.map($("#borrowerPriority").data("tDropDownList").data, function (obj, index) {
        if (obj.Value == disableItem.toString()) {
            return index;
        }
    });
    if ($('#borrowerPriority').data('tDropDownList').value() == disableItem) {
        $('#borrowerPriority').data('tDropDownList').value($('#hdnPrimaryBorrower').val())
    }

    $(ctrl.dropDown.$items[selectedIndex]).removeClass('t-item').css({ 'color': 'Gray', 'font-size':'12px', 'margin-left':'5px' })
}

function EnableListItems(disableItem) {

    var ctrl = $('#borrowerPriority').data('tDropDownList');
    ctrl.open();
    ctrl.close();
    selectedIndex = $.map($("#borrowerPriority").data("tDropDownList").data, function (obj, index) {
        if (obj.Value == disableItem.toString()) {
            return index;
        }
    });

    $(ctrl.dropDown.$items[selectedIndex]).addClass('t-item').css({  'color': 'Black', 'margin-left':'0px' })
} 



/***************************************/


function CloseBorrowerInformationPopup() {
    $("#divborrowerpopup").hide();
    $("#borrowerPopupInfoTooltips").html("");
    $('.modalBackground').css('display', 'none');
    MaxmizeBorrowerSection();
};

var IsZipCodeValidBPresent = true;
var IsZipCodeValidBMail = true;
var IsZipCodeValidBFormer = true;
var IsZipCodeValidCBPresent = true;
var IsZipCodeValidCBMail = true;
var IsZipCodeValidCBFormer = true;
var zipCodeInvalidMessage = "Please enter valid zip code.";

function SaveBorrowerInformation() {
   

    var form = $("#frmSaveBorrowerInformation");
    var urlAction = form.attr("action");

    var tempDataB = "&BorrowerModelInfo.PrefferedNumber.PhoneNumberType=" + $('#ddlBPrefferedPhone').val() +
        "&Borrower.BorrowerPersonalInfo.MaritalStatusId=" + $('#ddlBMaritalStatus').val() +
        "&BorrowerModelInfo.AlternateNumber.PhoneNumberType=" + $('#ddlBAlternatePhone').val()+
        "&BorrowerModelInfo.PresentAddress.StateId="+$("#ddlBPresentState").val()+
        "&BorrowerModelInfo.MailingAddress.IsSameAsPropertyAddress=" + $("#cbSame").is(":checked")+
        "&TitleAndManner.MannerTitleHeld=" + $('#ddlMannerTitle').data('tDropDownList').value();

    if ($("#txtCBNoYears").val() < 2) {
        tempDataB = tempDataB + "&BorrowerModelInfo.FormerAddress.StateId=" + $("#ddlBFormerState").val();
    }

    if ($("#cbSame") != null && !($("#cbSame").is(":checked"))) {
        tempDataB = tempDataB + "&BorrowerModelInfo.MailingAddress.StateId=" + $("#ddlBMailingState").val();
    }
    var coBorrowerId = $("#hdnCoBorrowerId").val();
   

    var data = form.serialize() + tempDataB;
    if (coBorrowerId !== "00000000-0000-0000-0000-000000000000") {
        
        var tempDataCoB = "&CoBorrowerModelInfo.PrefferedNumber.PhoneNumberType=" + $('#ddlCBPrefferedPhone').val() +
        "&CoBorrower.BorrowerPersonalInfo.MaritalStatusId=" + $('#ddlCBMaritalStatus').val() +
        "&CoBorrowerModelInfo.AlternateNumber.PhoneNumberType=" + $('#ddlCBAlternatePhone').val() +
        "&CoBorrowerModelInfo.PresentAddress.StateId=" + $("#ddlCBPresentState").val() +
        "&CoBorrowerModelInfo.MailingAddress.IsSameAsPropertyAddress=" + $("#cbCOSame").is(":checked");

        if ($("#txtCBNoYears").val() < 2) {
            tempDataCoB = tempDataCoB + "&CoBorrowerModelInfo.FormerAddress.StateId=" + $("#ddlCBFormerState").val();
        }

        if ($("#cbCOSame") != null && !($("#cbCOSame").is(":checked"))) {
            tempDataCoB = tempDataCoB + "&CoBorrowerModelInfo.MailingAddress.StateId=" + $("#ddlCBMailingState").val();
        }
        data = data + tempDataCoB;


    }

    if (($("#txtNoYears").val() == "" || $("#txtNoYears").val() == 0) && $("#txtNoMonths").val() != "" && $("#txtNoMonths").val() != 0) {
        $("#txtNoYears").removeAttr("data-val-required");
    }
    else {
        $("#txtNoYears").attr("data-val-required", "The No. Years field is required.");
    }

    if (($("#txtCBNoYears").val() == "" || $("#txtCBNoYears").val() == 0) && $("#txtCBNoMonths").val() != "" && $("#txtCBNoMonths").val() != 0 && document.getElementById("divCoBorrowerAddress") != null && !($('#rbSameAddressYes').is(":checked"))) {
        $("#txtCBNoYears").removeAttr("data-val-required");
    }
    else if (document.getElementById("divCoBorrowerAddress") != null && !($('#rbSameAddressYes').is(":checked"))) {
        $("#txtCBNoYears").attr("data-val-required", "The No. Years field is required.");
    }


    if (($("#txtNoYearsFormer").val() == "" || $("#txtNoYearsFormer").val() == 0) && $("#txtNoMonthsFormer").val() != "" && $("#txtNoMonthsFormer").val() != 0) {
        $("#txtNoYearsFormer").removeAttr("data-val-required");
    }
    else {
        $("#txtNoYearsFormer").attr("data-val-required", "The No. Years field is required.");
    }

    if (($("#txtNoYearsCBFormer").val() == "" || $("#txtNoYearsCBFormer").val() == 0) && $("#txtNoMonthsCBFormer").val() != "" && $("#txtNoMonthsCBFormer").val() != 0 && document.getElementById("divCoBorrowerAddress") != null && !($('#rbSameAddressYes').is(":checked"))) {
        $("#txtNoYearsCBFormer").removeAttr("data-val-required");
    }
    else if (document.getElementById("divCoBorrowerAddress") != null && !($('#rbSameAddressYes').is(":checked"))) {
        $("#txtNoYearsCBFormer").attr("data-val-required", "The No. Years field is required.");
    }

    
    $("form").removeData("validator");
    $("form").removeData("unobtrusiveValidation");
    $.validator.unobtrusive.parse("#frmSaveBorrowerInformation");
    
    var isValid = form.validate().form();

    if (!isValid) {
        $(".input-validation-error").first().focus();
        return;
    }

    if (!IsZipCodeValidBPresent && $('#txtBPresentZip').val() != "") {
        setValid($("#txtBPresentZip"), false, zipCodeInvalidMessage);
       
        return;
    }
    if (!IsZipCodeValidBFormer && $('#txtBFormerZip').val() != "" && $("#txtNoYears").val() < 2) {
        setValid($("#txtBFormerZip"), false, zipCodeInvalidMessage);
        return;
    }
    if (!IsZipCodeValidBMail && $('#txtBMailingZip').val() != "" && $("#cbSame") != null && !($("#cbSame").is(":checked"))) {
        setValid($("#txtBMailingZip"), false, zipCodeInvalidMessage);
        return;
    }

    if ( document.getElementById("divCoBorrowerAddress") != null && !($('#rbSameAddressYes').is(":checked")) ) {

        if ((!IsZipCodeValidCBPresent && $('#txtCBPresentZip').val() != "" )|| $('#txtCBPresentZip').val() == "tesam") 
        {
            $("#txtCBPresentZip").qtip("open");
             setValid($("#txtCBPresentZip"), false, zipCodeInvalidMessage);
            return;
        }
        if (!IsZipCodeValidCBFormer && $('#txtCBFormerZip').val() != "" && $("#txtCBNoYears").val() < 2) {
            setValid($("#txtCBFormerZip"), false, zipCodeInvalidMessage);
            return;
        }
        if (!IsZipCodeValidCBMail && $('#txtCBMailingZip').val() != "" && $("#cbCOSame") != null && !($("#cbCOSame").is(":checked"))) {
            setValid($("#txtCBMailingZip"), false, zipCodeInvalidMessage);
            return;
        }
    }

    $.ajax({
        url: urlAction,
        data: data,
        type: 'POST',
        beforeSend: function (data) {
            $(".btnCloseBorrowerInforamtion").hide();
            $(".btnSaveBorrowerInforamtion").hide();

            $("#saveAndExitnotification").text('Saving...');
            $("#saveAndExitnotification").show();
            $("#saveAndExitsmallloader").show();
        },
        success: function (data) {
            if (data.success) {
                $("#saveAndExitnotification").text('Saved');
                $("#saveAndExitsmallloader").hide();
                setTimeout(function () { $('#saveAndExitnotification').fadeOut(); CloseBorrowerInformationPopup(); }, 400);
                var prospectId = $(".tabrow").find(".menuitem.selected").first().text().trim();
                var loanId = $('.tablelistselected .loanid').text();
                AdditionalViews.BorrowerInformationSection(loanId, prospectId);

            }
            else {

                if (data.errors) {
                    ShowErrorFromServer(data.errors);

                    $("#saveAndExitnotification").text();
                }
                else {
                    $("#saveAndExitnotification").text('Failed to save');
                }
                $("#saveAndExitsmallloader").hide();
                $(".btnCancelBorrower").show();
            }
        },
        complete: function (e) {
            //HideProcessingInfoManageFee();
        },
        error: function (errors) {
            $("#saveAndExitnotification").text('Failed to save');
            $("#saveAndExitsmallloader").hide();
        }
    });
}

function ShowErrorFromServer(errorMap) {
    var summary = "You have the following errors: \n \n"; 
    $.each(errorMap, function (key, value) {
        summary += '* ' + value + "\n";
    });
    
    $("#errors").text(  summary);
}

function ShowBorrowerInformationPopup(loanId) {
    ShowProcessingInfo();
    //var loanId =  $('.tablelistselected .loanid').text();
    $.ajax({
        type: "GET",
        url: '/BorrowerInformation/ShowBorrowerPopup',
        data: 'loanId=' + loanId,
        success: function (result) {
            if (result == null)
                ShowError("Borrower information not found.");

            $("#divConversationLogPopup").show();
            $("#divConversationLogPopup").html(result);
            $(".modalBackground").css("display", "block");
        },
        error: function () {
        },
        complete: function () {
            CloseProcessingInfo();
            BorrowerPopupLoad();

            $("#txtCBNoYears").keyup();
            $("#txtNoYears").keyup();
        }
    });

};

function ApplyOnCoBorrowerAddress() {
    if ($("#cbCOSame") != null && $("#cbCOSame").is(":checked")) {
        $('#divCoMailingAddress').hide();
    }

    $("#cbCOSame").change(function () {
        if ($("#cbCOSame").is(":checked")) {
            $('#divCoMailingAddress').slideUp();
        }
        else {
            $('#divCoMailingAddress').slideDown();
        }
    });


    $("#txtCBPresentZip").keyup(function () {

        if ($("#txtCBPresentZip").val().length > 4) {
            IsZipCodeValidCBPresent = false;
            $(this).FillAndValidateZipCode({ cityID: 'txtCBPresentCity', stateID: 'ddlCBPresentState', IsValid: function (isZipValid) {
                IsZipCodeValidCBPresent = isZipValid;
            }
            });
        }
    });

    $("#txtCBMailingZip").keyup(function () {
        IsZipCodeValidCBMail = false;
        if ($("#txtCBMailingZip").val().length > 4) {
            $(this).FillAndValidateZipCode({ cityID: 'txtCBMailingCity', stateID: 'ddlCBMailingState', IsValid: function (isZipValid) {
                IsZipCodeValidCBMail = isZipValid;
            }
            });
        }
    });

    $("#txtCBFormerZip").keyup(function () {
        IsZipCodeValidCBFormer = false;
        if ($("#txtCBFormerZip").val().length > 4) {
            $(this).FillAndValidateZipCode({ cityID: 'txtCBFormerCity', stateID: 'ddlCBFormerState', IsValid: function (isZipValid) {
                IsZipCodeValidCBFormer = isZipValid;
            }
            });

        }
    });  
    
    
//    $("#txtCBPresentZip").mmlZipData({
//        city: "txtCBPresentCity",
//        address: "txtCBPresentStreet",
//        state: "ddlCBPresentState"
//    });
//    $("#txtCBMailingZip").mmlZipData({
//        city: "txtCBMailingCity",
//        address: "txtCBMailingStreet",
//        state: "ddlCBMailingState"
//    });

//    $("#txtCBFormerZip").mmlZipData({
//        city: "txtCBFormerCity",
//        address: "txtCBFormerStreet",
//        state: "ddlCBFormerState"
//    });
}
function PreventEventActionsOnLonaCenter(event, element) 
{
    if ($(element).attr('readonly')) 
    {        
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();

        return false;
    }
    
    return true;
}




function BorrowerPopupLoad() {

//    ChangeTitleHeld(true);


    $("#txtBFirstName").bind("change", function () {
   
        ChangeTitleHeld();
    });

    $("#txtBMiddleName").bind("change", function () {
      
        ChangeTitleHeld();
    });

    $("#txtBLastName").bind("change", function () {
        
        ChangeTitleHeld();
    });

    $("#txtCBFirstName").bind("change", function () {
      
        ChangeTitleHeld();
    });

    $("#txtCBMiddleName").bind("change", function () {
        
        ChangeTitleHeld();
    });

    $("#txtCBLastName").bind("change", function () {
    
        ChangeTitleHeld();
    });

    $("#ddlBMaritalStatus").bind("valueChange", function () { ChangeTitleHeld(); });

    $("#ddlCBMaritalStatus").bind("valueChange", function () {  ChangeTitleHeld(); });
    
    
    $(".jqTransform").jqTransform();
    $(".txtPhone").mask("?(999) 999-9999");
    $(".txtZip").mask("?99999");
    //$(".txtDateOfBirth").mask("?99/99/9999");

    if ($("#hdnInputDisabled").val() == "disabled") {
        ToggleCoBorrowerComboBox(false);
        $(".coBorrowerInformation input").attr("disabled", "disabled");
      //  $("#chbSwitchBorrowerInformation").attr("disabled", true);
    }

    $('.btnCancelBorrower').click(function () {
        $(".borrowerInformationPopupBackground").fadeOut();
    });

    if ($("#cbSame").is(":checked")) {
        $('#divMailingAddress').hide();
    }

  
    $("#cbSame").change(function() {
        if ($("#cbSame").is(":checked")) {
            $('#divMailingAddress').slideUp();
        }
        else {
            $('#divMailingAddress').slideDown();
        }
    });

    ApplyOnCoBorrowerAddress();

    ApplyAddressRules();
    
    
    $("#cbCoborrowerSame").change(function() {
        if ($("#cbCoborrowerSame").is(":checked")) {
            $('#divCoMailingAddress').slideUp();
        }
        else {
            $('#divCoMailingAddress').slideDown();
        }
    });

    $('#rbSameAddressYes').change(function() {
        if ($('#rbSameAddressYes').is(":checked"))
            $("#divCoBorrowerAddress").slideUp();
    });
    $('#rbSameAddressNo').change(function () {
        if ($('#rbSameAddressNo').is(":checked")) {
            $("#divCoBorrowerAddress").slideDown();
            ApplyOnCoBorrowerAddress();
        }
    });
    
    $("#txtBPresentZip").keyup(function (event) {
        PreventEventActionsOnLonaCenter(event, this);
    });


    $("#txtBPresentZip").keyup(function () {
        IsZipCodeValidBPresent = false;

        if ($("#txtBPresentZip").val().length > 4) {
            $(this).FillAndValidateZipCode({ cityID: 'txtBPresentCity', stateID: 'ddlBPresentState', IsValid: function (isZipValid) {
                IsZipCodeValidBPresent = isZipValid;
            }
            });

        }
    });

    $("#txtBMailingZip").keyup(function () {
        IsZipCodeValidBMail = false;
        if ($("#txtBMailingZip").val().length > 4) {
            $(this).FillAndValidateZipCode({ cityID: 'txtBMailingCity', stateID: 'ddlBMailingState', IsValid: function (isZipValid) {
                IsZipCodeValidBMail = isZipValid;
            }

            });
        }
    });

        $("#txtBFormerZip").keyup(function () {
            IsZipCodeValidBFormer = false;
            if ($("#txtBFormerZip").val().length > 4) {
                $(this).FillAndValidateZipCode({ cityID: 'txtBFormerCity', stateID: 'ddlBFormerState', IsValid: function (isZipValid) {
                    IsZipCodeValidBFormer = isZipValid;
                }
                });
            }
        });  
    
//    $("#txtBPresentZip").mmlZipData({
//        city: "txtBPresentCity",
//        address: "txtBPresentStreet",
//        state: "ddlBPresentState"
//    });
//    $("#txtBMailingZip").mmlZipData({
//        city: "txtBMailingCity",
//        address: "txtBMailingStreet",
//        state: "ddlBMailingState"
//    });

//    $("#txtBFormerZip").mmlZipData({
//        city: "txtBFormerCity",
//        address: "txtBFormerStreet",
//        state: "ddlBFormerState"
//    });
 

    if ($("#rbSameAddressYes").is(":checked")) {

        ApplyOnCoBorrowerAddress();
    }
     

    $('#rbBSpouseYes').change(function() {
        if ($('#rbBSpouseYes').is(":checked")) {
            //Currently not available
           // ToggleCoBorrowerComboBox(true);
          //  $(".coBorrowerInformation input").removeAttr("disabled");
         //   $(".coBorrowerInformation .txtCBEmail").attr("disabled", "disabled");
        }
    });
    $('#rbBSpouseNo').change(function() {
        if ($('#rbBSpouseNo').is(":checked")) {
            ToggleCoBorrowerComboBox(false);
            $(".coBorrowerInformation input").attr("disabled", "disabled");
        }
    });

    $('#Borrower_PropertyTitle').change(function () {
        if ($('#Borrower_PropertyTitle').is(":checked") && $('#Borrower_PropertyTitle').val() == "Individual") {

            $("#titleInNameValue").show();
            var firstNameB = $("#txtBFirstName").val();
            var lastNameB = $("#txtBLastName").val();
            var firstNameCoB = $("#txtCBFirstName").val();
            var lastNameCoB = $("#txtCBLastName").val();
            var heldInTitle = firstNameB + " " + lastNameB;
            if (firstNameCoB != "" || lastNameCoB != "") {
                heldInTitle += "," + firstNameCoB + " " + lastNameCoB;
            }
            $("#txtHeldInTitle").val(heldInTitle);
        }
        else {
            $("#titleInNameValue").hide();
        }
    });

    var chbSwitchBorrowerInformationPressed = 0;
    $('#chbSwitchBorrowerInformation').click(function() {
        if ($("#chbSwitchBorrowerInformation").is(":checked") && chbSwitchBorrowerInformationPressed == 0) {
            SwitchBorrowerCoBorrower();
            chbSwitchBorrowerInformationPressed = 1;
            $("#chbSwitchBorrowerInformation").attr("disabled", false);
        } else {
            SwitchBorrowerCoBorrower();
            $("#chbSwitchBorrowerInformation").attr("disabled", true);
        }
    });
    
    
    $("#txtNoYears,#txtNoMonths").keyup(function () {
        var value = $("#txtNoYears").val();
        DisplayFormerAddress(value, "formerAddressBorrower");
    });


    $("#txtCBNoYears,#txtCBNoMonths").keyup(function () {
        var value = $("#txtCBNoYears").val();
        DisplayFormerAddress(value, "formerAddressCoBorrower");
    });

}

function DisplayFormerAddress(value, divId) {
    if (value > 1) {
        $("#" + divId).slideUp();
        $("#" + divId + " input").attr("disabled", true);
    }
    else {
        $("#" + divId).slideDown();
        $("#" + divId + " input").attr("disabled", false);
    }
}

function SwitchBorrowerCoBorrower() {
    var txtBFirstName = $("#txtBFirstName").val();
    $("#txtBFirstName").val($("#txtCBFirstName").val());
    $("#txtCBFirstName").val(txtBFirstName);

    var txtBMiddleName = $("#txtBMiddleName").val();
    $("#txtBMiddleName").val($("#txtCBMiddleName").val());
    $("#txtCBMiddleName").val(txtBMiddleName);

    var txtBLastName = $("#txtBLastName").val();
    $("#txtBLastName").val($("#txtCBLastName").val());
    $("#txtCBLastName").val(txtBLastName);

    var txtBEmail = $("#txtBEmail").val();
    $("#txtBEmail").val($("#txtCBEmail").val());
    $("#txtCBEmail").val(txtBEmail);

    var txtBSuffix = $("#txtBSuffix").val();
    $("#txtBSuffix").val($("#txtCBSuffix").val());
    $("#txtCBSuffix").val(txtBSuffix);

    var txtBPrefferedPhone = $("#BorrowerModelInfo_PrefferedNumber_Number").val();
    $("#BorrowerModelInfo_PrefferedNumber_Number").val($("#txtCBPrefferedPhone").val());
    $("#txtCBPrefferedPhone").val(txtBPrefferedPhone);

    var txtBAlternatePhone = $("#txtBAlternatePhone").val();
    $("#txtBAlternatePhone").val($("#txtCBAlternatePhone").val());
    $("#txtCBAlternatePhone").val(txtBAlternatePhone);

    var txtDateOfBirth = $("#txtDateOfBirth").val();
    $("#txtDateOfBirth").val($("#txtCBDateOfBirth").val());
    $("#txtCBDateOfBirth").val(txtDateOfBirth);

    var txtBSsn1 = $("#txtBSsn1").val();
    $("#txtBSsn1").val($("#txtCBSsn1").val());
    $("#txtCBSsn1").val(txtBSsn1);

    var txtBSsn2 = $("#txtBSsn2").val();
    $("#txtBSsn2").val($("#txtCBSsn2").val());
    $("#txtCBSsn2").val(txtBSsn2);

    var txtBSsn3 = $("#txtBSsn3").val();
    $("#txtBSsn3").val($("#txtCBSsn3").val());
    $("#txtCBSsn3").val(txtBSsn3);

    var txtBFicoScore = $("#txtBFicoScore").val();
    $("#txtBFicoScore").val($("#txtCBFicoScore").val());
    $("#txtCBFicoScore").val(txtBFicoScore);

    var txtBYearOfSchool = $("#txtBYearOfSchool").val();
    $("#txtBYearOfSchool").val($("#txtCBYearOfSchool").val());
    $("#txtCBYearOfSchool").val(txtBYearOfSchool);

    var txtBDependetsNumber = $("#txtBDependetsNumber").val();
    $("#txtBDependetsNumber").val($("#txtCBDependetsNumber").val());
    $("#txtCBDependetsNumber").val(txtBDependetsNumber);

    var txtBDependetsAges = $("#txtBDependetsAges").val();
    $("#txtBDependetsAges").val($("#txtCBDependetsAges").val());
    $("#txtCBDependetsAges").val(txtBDependetsAges);

    var ddlBPrefferedPhone = $("#ddlBPrefferedPhone").data("tDropDownList").value();
    $("#ddlBPrefferedPhone").data("tDropDownList").select($("#ddlCBPrefferedPhone").data("tDropDownList").value());
    $("#ddlCBPrefferedPhone").data("tDropDownList").select(ddlBPrefferedPhone);

    var ddlBAlternatePhone = $("#ddlBAlternatePhone").data("tDropDownList").value();
    $("#ddlBAlternatePhone").data("tDropDownList").select($("#ddlCBAlternatePhone").data("tDropDownList").value());
    $("#ddlCBAlternatePhone").data("tDropDownList").select(ddlBAlternatePhone);

    var ddlBMaritalStatus = $("#ddlBMaritalStatus").data("tDropDownList").value();
    $("#ddlBMaritalStatus").data("tDropDownList").select($("#ddlCBMaritalStatus").data("tDropDownList").value());
    $("#ddlCBMaritalStatus").data("tDropDownList").select(ddlBMaritalStatus);

}

function ToggleCoBorrowerComboBox(enabled) {
    if (enabled) {
        $("#ddlCBPrefferedPhone").data("tDropDownList").enable();
        $("#ddlCBAlternatePhone").data("tDropDownList").enable();
        $("#ddlCBMaritalStatus").data("tDropDownList").enable();
    } else {
        $("#ddlCBPrefferedPhone").data("tDropDownList").disable();
        $("#ddlCBAlternatePhone").data("tDropDownList").disable();
        $("#ddlCBMaritalStatus").data("tDropDownList").disable();
    }
}

function BorrowerSaveTest(model) {
    alert(model);
    alert(model.Borrower.BorrowerId);
}


function ChangeTitleHeld(firstLoad) 
{
    var coBorrowerId = $("#hdnCoBorrowerId").val();
       
    var borrowerMaritialStatus = $("#ddlBMaritalStatus").data("tDropDownList").value();

    var coBorrowerMaritialStatus = $("#ddlCBMaritalStatus").data("tDropDownList").value();

    var bFirstName = $('#txtBFirstName').val();
    var bMiddleName = $('#txtBMiddleName').val();
    if (bMiddleName != '')
        bMiddleName = bMiddleName + ' ';

    var bLastName = $('#txtBLastName').val();
    var borrowerFullName = bFirstName + ' ' + bMiddleName + bLastName;

    var cbFirstName = $('#txtCBFirstName').val();
    var cbMiddleName = $('#txtCBMiddleName').val();
    if (cbMiddleName != '')
        cbMiddleName = cbMiddleName + ' ';
    var cbLastName = $('#txtCBLastName ').val();
    var coBorrowerFullName = cbFirstName + ' ' + cbMiddleName + cbLastName;

//    if ($('.rblTitleHeldRefinanceUp input,.rblTitleHeldRefinanceUp input').eq(0).attr('checked') == 'checked') {
//        $('.divTitleHeldUpQuestions,.divTitleHeldDownQuestions').show();
//    }
    
    //if spouse is NOT gonna be on the loan   
    if (  coBorrowerId == "00000000-0000-0000-0000-000000000000") {
        //if spouse is gonna be on the title
        if ($("#hdnIsSpousePartnerOnTitle").val() == "True") 
        {
            if (!firstLoad) 
            {
                $('#txtHeldInTitle').val(borrowerFullName + ', ');
             
            }
        }
        else 
        {
            if (!firstLoad) {
                $('#txtHeldInTitle').val(borrowerFullName);
              
            }
        }

    }
    //if spouse is gonna be on the loan
    else if (coBorrowerId != "00000000-0000-0000-0000-000000000000") 
    {
        if (!firstLoad) 
        {
            $('#txtHeldInTitle').val(borrowerFullName + ', ' + coBorrowerFullName);

            if (borrowerMaritialStatus == 0 && coBorrowerMaritialStatus == 0 ) // Both Married
            {
                $("#ddlMannerTitle").data("tDropDownList").value(1);  // Joint Tenants
            }
            else if (borrowerMaritialStatus != 2 ) { // Borrower Unmarried
                $("#ddlMannerTitle").data("tDropDownList").value(-1);  //Select One
               
            }
        }

  $('.divTitleHeldDown').show();
    }

    if (borrowerMaritialStatus == 2 ) //Unmarried
    {
        $('#txtHeldInTitle').val(borrowerFullName);
        $("#ddlMannerTitle").data("tDropDownList").value(6); // Sole Owner
        
    }
}


function ApplyAddressRules() {
    $('input:[type=radio][name=BorrowerModelInfo.PresentAddress.OwnershipType],input:[type=radio][name=CoBorrowerModelInfo.PresentAddress.OwnershipType]').click(function () {

        if ($(this).attr("name") == 'BorrowerModelInfo.PresentAddress.OwnershipType')
        {
                if ($(this).attr("value") == "Own") {
                    $("#borrowerMonthlyRentDiv").addClass("notdisplayed");

                }
                if ($(this).attr("value") == "Rent") {
                    $("#borrowerMonthlyRentDiv").removeClass("notdisplayed");
                    $("#txtMonthlyRent").removeAttr('disabled');
                    $("#txtMonthlyRent").val($("#txtMonthlyRent").attr("monthlyRent"));

                }
                if ($(this).attr("value") == "RentFree") {
                    $("#borrowerMonthlyRentDiv").removeClass("notdisplayed");
                    $("#txtMonthlyRent").attr('disabled', 'disabled');
                    $("#txtMonthlyRent").val(0);
                }
            }
        
            if ($(this).attr("name") == 'BorrowerModelInfo.FormerAddress.OwnershipType') {
                if ($(this).attr("value") == "Own") {
                    $("#borrowerMonthlyRentFormerDiv").addClass("notdisplayed");

                }
                if ($(this).attr("value") == "Rent") {
                    $("#borrowerMonthlyRentFormerDiv").removeClass("notdisplayed");
                    $("#txtMonthlyRentFormer").removeAttr('disabled');
                    $("#txtMonthlyRentFormer").val($("#txtMonthlyRentFormer").attr("monthlyRent"));

                }
                if ($(this).attr("value") == "RentFree") {
                    $("#borrowerMonthlyRentFormerDiv").removeClass("notdisplayed");
                    $("#txtMonthlyRentFormer").attr('disabled', 'disabled');
                    $("#txtMonthlyRentFormer").val(0);
                }
            }

            if ($(this).attr("id") == 'rbCFAddress' || $(this).attr("name") == 'CoBorrowerModelInfo.FormerAddress.OwnershipType') {
                if ($(this).attr("value") == "Own") {
                    $("#coborrowerMonthlyRentFormerDiv").addClass("notdisplayed");

                }
                if ($(this).attr("value") == "Rent") {
                    $("#coborrowerMonthlyRentFormerDiv").removeClass("notdisplayed");
                    $("#txtCoMonthlyRentFormer").removeAttr('disabled');
                    $("#txtCoMonthlyRentFormer").val($("#txtCoMonthlyRentFormer").attr("monthlyRent"));

                }
                if ($(this).attr("value") == "RentFree") {
                    $("#coborrowerMonthlyRentFormerDiv").removeClass("notdisplayed");
                    $("#txtCoMonthlyRentFormer").attr('disabled', 'disabled');
                    $("#txtCoMonthlyRentFormer").val(0);
                }
            }
        
           if ($(this).attr("name") == 'CoBorrowerModelInfo.PresentAddress.OwnershipType'|| $(this).attr("id") == 'rbCAddress')
            {
                if ($(this).attr("value") == "Own") {
                    $("#coborrowerMonthlyRentDiv").addClass("notdisplayed");

                }
                if ($(this).attr("value") == "Rent") {
                    $("#coborrowerMonthlyRentDiv").removeClass("notdisplayed");
                    $("#txtCoMonthlyRent").removeAttr('disabled');
                    $("#txtCoMonthlyRent").val($("#txtCoMonthlyRent").attr("monthlyRent"));

                }
                if ($(this).attr("value") == "RentFree") {
                    $("#coborrowerMonthlyRentDiv").removeClass("notdisplayed");
                    $("#txtCoMonthlyRent").attr('disabled', 'disabled');
                    $("#txtCoMonthlyRent").val(0);
                }
        }
    });
        
}

BorrowerInformation = {
    Save: function() {
        // Retrieve data object
        // Submit to form
    },

    CreateDataModel: function() {
        var dataModel = {
            Borrower: {
                BorrowerType: 1,
                LoanId: $('.tablelistselected .loanid').text(),
                UserAccountId: $('#hdnBorrowerUserAccountId').text(),
                BorrowerPersonalInfo: {
                    FirstName: $('#hdnBorrowerUserAccountId').text(),
                    MiddleName: $('#hdnBorrowerUserAccountId').text(),
                    LastName: $('#hdnBorrowerUserAccountId').text(),
                    FullName: $('#hdnBorrowerUserAccountId').text(),
                    Prefix: $('#hdnBorrowerUserAccountId').text(),
                    Suffix: $('#hdnBorrowerUserAccountId').text(),
                    SSN: $('#hdnBorrowerUserAccountId').text(),
                    CitizenshipId: $('#MaritalStatus').text()
                }
            }
        };
    }
};


/***** SAVE CHANGES FUNCTIONALLITY *****/

BorrowerHandling = {
    SaveChanges: function (data) {
        ShowProcessingInfo();
        $.ajax({
            type: "GET",
            url: "Command/Execute",
            cache: false,
            data: data,
            dataType: "html",
            success: function (result) {
                $("#borrowerDetailsSection").html(result);
                AdditionalViews.BorrowerInformationSectionOnSuccess();
                Refresh.RefreshDataHelper();
                $('#hdnToBeRemoved').val('')
                HideProcessingInfo();
                $('#divSaveCancel').css({ 'display': 'none' });
            }
        });
    }
}
