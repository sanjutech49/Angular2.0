
AppraisalRequest = {
    SaveBusinessContact: function (businessContactId) {
        //IfFormIsValid($(this)); SaveBusinessContact();
        $('#validationTooltip').hide();
        var operationType = "save";
        if (businessContactId != "00000000-0000-0000-0000-000000000000" && businessContactId != "") operationType = "update";

        // Check business contact type
        var businessContactData;
        var postData;
        var contactType = $('#businessContactCategory').val();
        var loanId = $('.tablelistselected .loanid').text();
        var loanParts = loanId.split("\n");
        loanId = loanParts[0];
        //        if (contactType == 10) // Realtor, change this to seller!
        //        {
        //            var sellerType = $('input:radio[name=sellerType]:checked').val();
        //            if (sellerType == '0') {
        //                $.ajax({
        //                    type: "POST",
        //                    url: "/BusinessContact/ValidateAndSaveBusinessContactData",
        //                    contentType: "application/json; charset=utf-8",
        //                    data: "{ sellerType: '" + $('input:radio[name=sellerType]:checked').val() + "', " +
        //                            "seller1FirstName: '" + $('#txtContactFirstName').val() + "', " +
        //                            "seller1LastName: '" + $('#txtContactLastName').val() + "', " +
        //                            "seller1PreferredPhone: '" + $('#txtContactPhonePreferred').val() + "', " +
        //                            "seller1PreferredPhoneType: '" + $('#prefferedPhoneCategory').val() + "', " +
        //                            "seller1AlternatePhone: '" + $('#txtContactPhoneAlternate').val() + "', " +
        //                            "seller1AlternatePhoneType: '" + $('#alternatePhoneCategory').val() + "', " +
        //                            "seller1Email: '" + $('#txtContactEmail').val() + "', " +

        //                            "seller2FirstName: '" + $('#txtContactFirstNameSecondSeller').val() + "', " +
        //                            "seller2LastName: '" + $('#txtContactLastNameSecondSeller').val() + "', " +
        //                            "seller2PreferredPhone: '" + $('#txtContactPhonePreferredSecondSeller').val() + "', " +
        //                            "seller2PreferredPhoneType: '" + $('#prefferedPhoneCategorySecondSeller').val() + "', " +
        //                            "seller2AlternatePhone: '" + $('#txtContactPhoneAlternateSecondSeller').val() + "', " +
        //                            "seller2AlternatePhoneType: '" + $('#alternatePhoneCategorySecondSeller').val() + "', " +
        //                            "seller2Email: '" + $('#txtContactEmailSecondSeller').val() + "', " +

        //                            "streetAddress: '" + $('#txtStreetAddress').val() + "', " +
        //                            "zipCode: '" + $('#txtZipCode').val() + "', " +
        //                            "city: '" + $('#txtCityContact').val() + "', " +
        //                            "stateName: '" + $('#contactState').data("tDropDownList").text() + "', " +
        //                            "stateId: '" + $('#contactState').val() + "', " +
        //                            "type: '" + $('#businessContactCategory').val() + "', " +
        //                            "loanId: '" + loanId + "', " +
        //                            "userAccountId: '" + $('#uxUserAccountId').text() + "', " +
        //                            "operationType: '" + operationType + "', " +
        //                            "borrowerContactId: '" + businessContactId + "', " +
        //                            "referenceNumberSeller1: '" + $('#txtReferenceNumberSeller1').val() + "', " +
        //                            "referenceNumberSeller2: '" + $('#txtReferenceNumberSeller2').val() + "' }",
        //                    success: function (msg) {
        //                        $("#businessContactPopup").hide();
        //                        $(".modalBackground").css("display", "none");

        //                        //Refresh page
        //                        var currentRow = $('.biggreens').closest('tr');
        //                        currentRow.removeAttr('detailsloaded');
        //                        currentRow.click();
        //                    },
        //                    error: function (xhr, ajaxOptions, thrownError) {
        //                        alert(thrownError);
        //                    }
        //                });
        //            }
        //            else // Bank, LLC
        //            {
        //                $.ajax({
        //                    type: "POST",
        //                    url: "/BusinessContact/ValidateAndSaveBusinessContactDataBankLLC",
        //                    contentType: "application/json; charset=utf-8",
        //                    data: "{ sellerType: '" + $('input:radio[name=sellerType]:checked').val() + "', " +
        //                            "seller1FirstName: '" + $('#txtContactFirstName').val() + "', " +
        //                            "company: '" + $('#txtCompany').val() + "', " +
        //                            "contact: '" + $('#txtContactCompany').val() + "', " +
        //                            "contactPreferredPhone: '" + $('#txtContactPhonePreferredCompany').val() + "', " +
        //                            "contactPreferredPhoneType: '" + $('#prefferedPhoneCategoryCompany').val() + "', " +
        //                            "contactAlternatePhone: '" + $('#txtContactPhoneAlternateCompany').val() + "', " +
        //                            "contactAlternatePhoneType: '" + $('#alternatePhoneCategoryCompany').val() + "', " +
        //                            "contactEmail: '" + $('#txtContactEmailCompany').val() + "', " +
        //                            "streetAddress: '" + $('#txtStreetAddress').val() + "', " +
        //                            "zipCode: '" + $('#txtZipCode').val() + "', " +
        //                            "city: '" + $('#txtCityContact').val() + "', " +
        //                            "stateId: '" + $('#contactState').val() + "', " +
        //                            "stateName: '" + $('#contactState').data("tDropDownList").text() + "', " +
        //                            "type: '" + $('#businessContactCategory').val() + "', " +
        //                            "loanId: '" + loanId + "', " +
        //                            "userAccountId: '" + $('#uxUserAccountId').text() + "', " +
        //                            "operationType: '" + operationType + "', " +
        //                            "borrowerContactId: '" + businessContactId + "', " +
        //                            "referenceNumber: '" + $('#txtReferenceNumberBankLLC').val() + "' }",
        //                    success: function (msg) {
        //                        $("#businessContactPopup").hide();
        //                        $(".modalBackground").css("display", "none");

        //                        //Refresh page
        //                        var currentRow = $('.biggreens').closest('tr');
        //                        currentRow.removeAttr('detailsloaded');
        //                        currentRow.click();
        //                    },
        //                    error: function (xhr, ajaxOptions, thrownError) {
        //                        alert(thrownError);
        //                    }
        //                });
        //            }
        //        }
        //        else {


        var parameters = AppraisalRequest.GetBusinessContactsParameters(businessContactId);

        $.ajax({
            type: "POST",
            url: "BusinessContact/ValidateAndSaveBusinessContactNonSeller",
            data: { JSONParameters: parameters.toString() },
            dataType: "html",
            cache: false,
            success: function (msg) {
                $("#businessContactPopup").hide();
                $(".modalBackground").css("display", "none");

                //Refresh page
                //                var currentRow = $('.biggreens').closest('tr');
                //                currentRow.removeAttr('detailsloaded');
                //                currentRow.click();

                if ($(".loanDetailsCompanyContactOtherSearchContainer .page-selected").length)
                    $(".loanDetailsCompanyContactOtherSearchContainer .page-selected").click();
                else
                    $("#clearOtherSearchButtonCompanyContacts").click();

                $('#txtSearchCompanyOrContactName').val('Search').css({ 'color': 'rgb(99, 99, 99)' });
                $('#ddlContactTypelist').val(-1);
                $('.loanDetailsCompanyContactSearchContainer .imp-div-lcCompanyContact-rowResult').html('');
                $('#clearSearchButtonCompanyContacts').hide();
                
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert(thrownError);
            }
        });
        // }
    },

    GetBusinessContactsParameters: function (businessContactId) {
        var operationType = "save";
        if (businessContactId != "00000000-0000-0000-0000-000000000000" && businessContactId != "") operationType = "update";

        var loanId = $('.tablelistselected .loanid').text();
        var loanParts = loanId.split("\n");
        loanId = loanParts[0];

        var parameters = JSON.stringify({
            CompanyName: $('#txtOtherCompany').val(),
            FirstName: $('#txtOtherContactFirstName').val(),
            LastName: $('#txtOtherContactLastName').val(),
            PreferredPhone: $('#txtOtherContactPhonePreferred').val(),
            PreferredPhoneType: $('#prefferedPhoneCategoryOther').val(),
            AlternatePhone: $('#txtOtherContactPhoneAlternate').val(),
            AlternatePhoneType: $('#alternatePhoneCategoryOther').val(),
            Email: $('#txtOtherContactEmail').val(),
            StreetAddress: $('#txtStreetAddressOther').val(),
            Zip: $('#txtOtherZipCode').val(),
            City: $('#txtOtherCityContact').val(),
            StateId: $('#contactStateOther').val(),
            StateName: $("#contactStateOther option:selected").text(),
            CompanyType: $('#businessContactCategory').val(),
            LoanId: loanId,
            UserAccountId: $('#uxUserAccountId').text(),
            OperationType: operationType,
            BorrowerContactId: businessContactId,
            ReferenceNumber: $('#txtReferenceNumber').val(),
            LoanContactsContactSubType: $('input:radio[name=LoanContactsContactSubType]:checked').val(),
            LoanContactsCompanyId: $('#hdnLoanContactsCompanyId').val(),
            LoanContactsContactId: $('#hdnLoanContactsContactId').val()


        });

        return parameters;

    },
    CheckIsDuplicateLoanLoginCompanyAndContact: function (element) {


        var isDuplicateCompany = false;
        var isDuplicateContact = false;
        var businesscontactid = $(element).attr('businesscontactid');
        var parameters = AppraisalRequest.GetBusinessContactsParameters(businesscontactid);

        $.ajax({
            type: "POST",
            url: "BusinessContact/CheckIsDuplicateLoginLoanCompanyAndContact",
            data: { JSONParameters: parameters.toString() },
            success: function (data) {
                if (data.success == true) {

                    isDuplicateCompany = data.isDuplicateCompany;
                    isDuplicateContact = data.isDuplicateContact;


                }

            },
            error: function () {
            },
            complete: function () {
                if (isDuplicateContact < 1) {


                    AppraisalRequest.SaveBusinessContact(businesscontactid);
                }
                else {
                    Contacts.ShowDuplicateLoanContactPopUp();
                }

            }
        });
        return isDuplicateContact < 1;
    },

    GetBusinesCategoryString: function (categoryId) {
        var categoryName;
        switch (categoryId) {
            //case ContactType.Realtor:               
            case 1:
                categoryName = "Realtor";
                break;
            // case ContactType.BuyersAgent:               
            case 2:
                categoryName = "BuyersAgent";
                break;
            // case ContactType.Escrow:               
            case 3:
                categoryName = "Escrow";
                break;
            // case ContactType.Others:               
            case 4:
                categoryName = "Others";
                break;
            // case ContactType.PropertyManager:               
            case 5:
                categoryName = "PropertyManager";
                break;
            // case ContactType.SellersAgent:               
            case 6:
                categoryName = "SellersAgent";
                break;
            // case ContactType.Title:               
            case 7:
                categoryName = "Title";
                break;
        }
        return categoryName;
    }
};

// SUMMARY: document load event occurred
$(document).ready(function () {
    $j('input.t-input').autoNumeric('init', { vMax: '999999999999.99', aSign: '$' });      
   
    MaskAppraisalFields();
    //AccessInformationPanel();

    //Validation
    if ($('.uxLoanPurpose').val() === "Purchase") {
        if (!$('.uxSellerName').hasClass('requiredValidate')) {
            $('.uxSellerName').addClass('requiredValidate');
        }
        if (!$('#uxPurchasePrice').hasClass('requiredValidate')) {
            $('#uxPurchasePrice').addClass('requiredValidate');
        }
    }

    if ($('.uxLoanType').val() != undefined && $('.uxLoanType').val().toLowerCase() === "fha" && !$('.uxFHACaseNumber').hasClass('requiredValidate')) {
        $('.uxFHACaseNumber').addClass('requiredValidate');
    }


    $(".requiredValidate").bind("blur", function () {
        $(this).ValidateTextBox();
    });

    //close validation cloud
    $('#validationTooltipClose').click(function () {
        $('#validationTooltip').hide();
    });

    if ($(".uxPaymentMethod:checked").val() == "CreditCard") {
        EnableCreditCardValidation();
    }
    else {
        DisableCreditCardValidation();
    }


    $(".uxPaymentMethod").change(function (e) {
        //Check if Credit Card is selected
        if (e.target.value == "CreditCard") {
            var billinginformationid = $("#hdnOriginalBillingId").val();

            if (billinginformationid != "00000000-0000-0000-0000-000000000000") {
                GetBillingInformation(billinginformationid);
                DisableCreditCardData();
            }
            else {
                ClearCreditCardData();
                EnableCreditCardData();
            }


            EnableCreditCardValidation();
        }
        else {
            $('.notValid', '#mainDivPaymentInformation').each(function (index, value) {
                $(value).removeClass('notValid');
            });

            ClearCreditCardData();

            DisableCreditCardData();

            DisableCreditCardValidation();
        }
    });

    SetPaymentMethod();

});

function CheckPaymentStatus(loanId) {
    
    // Show loader message
    ShowProcessingInfo();

    // Get data from form
    var request = {
        appraisalOrderId: $('#uxAppraisalOrderId').val(),
        loanId: loanId
    };

    // Send AJAX request
    $.ajaxAntiForgery({
        type: 'POST',
        url: '/Appraisal/GetPaymentInformation',
        cache: false,
        data: request,
        success: function (data) {
            $("#divConversationLogPopup").show();
            $("#divConversationLogPopup").html(data);
            $(".modalBackground").css("display", "block");
        },
        complete: function () {
            CloseProcessingInfo();
        }
    });
}

function onChange() {
    $(this).ValidateComboBox();
    if ($('.validateCreditCardNumber').val().length > 0) {
        $('.validateCreditCardNumber').ValidateTextBox({ required: true, validateLength: true, maxlength: 19, minlength: 12, isInt: true, isCreditCardNumber: true, creditcardType: $('#uxCreditCardType').data("tDropDownList").value() });
    }
}

function DisplayRushFee() {
    if ($(".uxRushChecked").is(":checked")) {
        //Enable/Disable added to remove value shadow in telerik control
        $("#uxRushFee").data("tTextBox").enable();
        $("#uxRushFee").data("tTextBox").value(100);
        $("#uxRushFee").data("tTextBox").disable();
    }
    else {
        $("#uxRushFee").data("tTextBox").value("");
    }

    //add disable class
    $(this).removeClass('t-input');
    $(this).addClass('disabledTelerik');
}

// SUMMARY: Apply rush fee rule
function AddRushFee() {

    DisplayRushFee();

    RecalculateTotalFee();
}

// SUMMARY: Recalculate total fee
function RecalculateTotalFee() {
    var totalFee = 0;

    for (var i = 1; i < 8; i++) {
        if ($("#uxAppraisalFee" + i).data("tTextBox").value() > 0)
            totalFee = totalFee + parseFloat($("#uxAppraisalFee" + i).data("tTextBox").value());
    }

    if ($(".uxRushChecked").is(":checked"))
        totalFee = totalFee + 100;

    // Enable control before writing value to it and than disable again to prevent duplicate value in textbox
    $("#uxTotalFee").data("tTextBox").enable();
    $("#uxPaymentAmount").data("tTextBox").enable();

    $("#uxTotalFee").data("tTextBox").value(totalFee);
    $("#uxPaymentAmount").data("tTextBox").value(totalFee);

    $("#uxTotalFee").data("tTextBox").disable();
    $("#uxPaymentAmount").data("tTextBox").disable();

}

function EnableAppraisalTypes() {
    for (var i = 1; i < 7; i++) {
        id = i;
        nextid = i + 1;
        if ($("#uxAppraisalType" + id).data("tDropDownList").value() != -1) {
            $("#uxAppraisalType" + id).data("tDropDownList").enable();
            $("#uxAppraisalFee" + id).data("tTextBox").enable();
            $("#uxAppraisalType" + nextid).data("tDropDownList").enable();
        }

    }
}

// SUMMARY: Set access information panel
function AccessInformationPanel(loanId) {

    // Get drop down list values
    var dropDownList = $("#uxAccessInformationList").data("tDropDownList");
    var selectedValue = dropDownList.value();
    if (selectedValue != 0) {
        $(".mainDivAppointmentInformation").fadeIn();
        $(".BorrowerInformationFieldset").css("height", "350px");
        $(".PropertyInformationFieldset").css("height", "350px");
        //$(".uxBorrowerPreferredContact").parent().css("display", "none");

        if (selectedValue == 1) {

        }
        else {
            //GetBusinessContact(loanId);
        }
    }
    else {
        $(".mainDivAppointmentInformation").fadeOut();
        $(".BorrowerInformationFieldset").css("height", "200px");
        $(".PropertyInformationFieldset").css("height", "200px");
        //$(".uxBorrowerPreferredContact").parent().css("display", "");

    }
}

function ClearProductsAndFees() {
    for (var i = 1; i < 7 + 1; i++) {
        // reset child Appraisal Type dropdowns
        $("#uxAppraisalType" + i).data("tDropDownList").value(-1);
        // disable child Appraisal Type dropdowns
        $("#uxAppraisalType" + i).data("tDropDownList").disable();
        // reset child Appraisal Fee textboxes
        $("#uxAppraisalFee" + i).data("tTextBox").value("");
        // disable child Appraisal Fee textboxes
        $("#uxAppraisalFee" + i).data("tTextBox").disable();
        $("#uxAppraisalFee" + i).removeClass('t-input');
        $("#uxAppraisalFee" + i).addClass('disabledTelerik');
        setValid($("#uxAppraisalFee" + i), true, "");
        // remove child Appraisal Fee classes
        $("#uxAppraisalFee" + i).removeClass("quoted");
        $("#productMessage" + i).css("display", "none");
        $("#productMessage" + i).removeAttr("title");
        $("#feeMessage" + i).css("display", "none");
        $("#feeMessage" + i).removeAttr("title");
    }
    //Clear rush fee
    $("#uxRushFee").data("tTextBox").value("");
    $(".uxRushChecked").removeAttr("checked");
    //Enable first drop down list
    $("#uxAppraisalType1").data("tDropDownList").enable();
    $("#uxAppraisalType1").ValidateComboBox();

    RecalculateTotalFee();
}

function DisableCreditCardData() {
    $("#hdnNewBillingInformation").val("False");

    $("#uxExistingCreditCards").data("tDropDownList").disable();
    $("#uxCreditCardType").data("tDropDownList").disable();
    $("#txtCreditCardNr").attr("disabled", "disabled");
    $("#txtCCVNr").attr("disabled", "disabled");
    $("#uxExpirationMonth").data("tDropDownList").disable();
    $("#uxExpirationYear").data("tDropDownList").disable();
    $("#txtNameOnCard").attr("disabled", "disabled");
}

function EnableCreditCardData() {
    $("#hdnNewBillingInformation").val("True");

    $("#uxExistingCreditCards").data("tDropDownList").enable();
    $("#uxCreditCardType").data("tDropDownList").enable();
    $("#txtCreditCardNr").removeAttr("disabled");
    $("#txtCCVNr").removeAttr("disabled");
    $("#uxExpirationMonth").data("tDropDownList").enable();
    $("#uxExpirationYear").data("tDropDownList").enable();
    $("#txtNameOnCard").removeAttr("disabled");
}

function EnableCreditCardValidation() {
    if (!$('#uxCreditCardType').hasClass('comboBoxRequired')) {
        $('#uxCreditCardType').addClass('comboBoxRequired');
    }
    if (!$('#txtCreditCardNr').hasClass('validateCreditCardNumber')) {
        $('#txtCreditCardNr').addClass('validateCreditCardNumber');
    }
    if (!$('#txtCCVNr').hasClass('ccvValidation')) {
        $('#txtCCVNr').addClass('ccvValidation');
    }
    if (!$('#uxExpirationMonth').hasClass('comboBoxRequired')) {
        $('#uxExpirationMonth').addClass('comboBoxRequired');
    }
    if (!$('#uxExpirationYear').hasClass('comboBoxRequired')) {
        $('#uxExpirationYear').addClass('comboBoxRequired');
    }
    if (!$('#txtNameOnCard').hasClass('requiredValidate')) {
        $('#txtNameOnCard').addClass('requiredValidate');
    }

    $('#txtCCVNr, #txtNameOnCard, #txtCreditCardNr').bind("blur", function () {
        if ($(this).attr('id') == 'txtCCVNr') {
            $(this).ValidateTextBox({ required: true, validateLength: true, maxlength: 4, isInt: true });
        }
        else if ($(this).attr('id') == 'txtCreditCardNr') {
            $(this).ValidateTextBox({ required: true, validateLength: true, maxlength: 19, minlength: 12, isInt: true, isCreditCardNumber: true, creditcardType: $("#uxCreditCardType").data("tDropDownList").value() });
        }
        else {
            $(this).ValidateTextBox();
        }
    });
}

function DisableCreditCardValidation() {
    $('#uxCreditCardType').removeClass('comboBoxRequired');
    $('#txtCreditCardNr').removeClass('validateCreditCardNumber');
    $('#txtCCVNr').removeClass('ccvValidation');
    $('#uxExpirationMonth').removeClass('comboBoxRequired');
    $('#uxExpirationYear').removeClass('comboBoxRequired');
    $('#txtNameOnCard').removeClass('requiredValidate');

    $('#txtCCVNr, #txtNameOnCard, #txtCreditCardNr').unbind("blur");
}

function ClearCreditCardData() {
    $("#hdnBillingId").val("");
    $("#uxExistingCreditCards").data("tDropDownList").value("-1");
    $("#uxCreditCardType").data("tDropDownList").value("-1");
    $("#txtCreditCardNr").val("");
    $("#txtCCVNr").val("");
    $("#uxExpirationMonth").data("tDropDownList").value("-1");
    $("#uxExpirationYear").data("tDropDownList").value("-1");
    $("#txtNameOnCard").val("");
}


function AppraisalTypeChanged() {

    var value = $(this).attr("value");
    var id = $(this).attr('id').slice(-1);
    var nextid = parseInt(id) + 1;

    if (value.trim() != -1) {
        $("#uxAppraisalFee" + id).data("tTextBox").enable();
        //$("#uxAppraisalFee" + id).ValidateTextBox();
        $("#productMessage" + id).css("display", "none");
        $("#productMessage" + id).removeAttr("title");
        GetFee(id);
        if (id != 7)
            $("#uxAppraisalType" + nextid).data("tDropDownList").enable();
    }
    else {
        for (var i = nextid; i < 7 + 1; i++) {
            // reset child Appraisal Type dropdowns
            $("#uxAppraisalType" + i).data("tDropDownList").value(-1);
            // disable child Appraisal Type dropdowns
            $("#uxAppraisalType" + i).data("tDropDownList").disable();
        }

        for (var i = id; i < 7 + 1; i++) {
            // reset child Appraisal Fee textboxes
            $("#uxAppraisalFee" + i).data("tTextBox").value("");
            // disable child Appraisal Fee textboxes
            $("#uxAppraisalFee" + i).data("tTextBox").disable();
            // remove child Appraisal Fee classes
            $("#uxAppraisalFee" + i).removeClass("quoted");
            $("#productMessage" + i).css("display", "none");
            $("#productMessage" + i).removeAttr("title");
            $("#feeMessage" + i).css("display", "none");
            $("#feeMessage" + i).removeAttr("title");
        }
    }

    RecalculateTotalFee();

    if ($('.uxAppraisalTypeComboBox input[value!="-1"]:not(:disabled)').length === 0 || $(this).is('#uxAppraisalType1')) {
        $(this).ValidateComboBox();
    }
}

function AppraisalTypeLoad() {
    if (!$(this).is('#uxAppraisalType1')) {
        var id = $(this).attr('id').slice(-1);
        var previousid = parseInt(id) - 1;

        if ($("#uxAppraisalType" + previousid).data("tDropDownList").value() == -1) {
            $(this).data("tDropDownList").disable();
        }
    }
}

function onLoad(e) {
    if ($(this).is(':disabled')) {
        $(this).removeClass('t-input');
        $(this).addClass('disabledTelerik');
    }
}

function AppraisalFeeLoad() {
    if (!$(this).is('#uxAppraisalFee1')) {
        var id = $(this).attr('id').slice(-1);

        if ($("#uxAppraisalType" + id).data("tDropDownList").value() == -1) {
            $(this).data("tTextBox").disable();

            //add disable class
            $(this).removeClass('t-input');
            $(this).addClass('disabledTelerik');
        }
    }
}

function CurrencyTextBoxChanged() {
 $(this).ValidateTextBox();
}

function PaymentInformationComboBoxLoaded() {
    if ($(".uxPaymentMethod:checked").val() == "CreditCard") {
        $(this).data('tDropDownList').enable();
        $("#txtCreditCardNr").removeAttr("disabled");
        $("#txtCCVNr").removeAttr("disabled");
        $("#txtNameOnCard").removeAttr("disabled");
    } 
    else {
        $(this).data('tDropDownList').disable();
        $("#txtCreditCardNr").attr("disabled", "disabled");
        $("#txtCCVNr").attr("disabled", "disabled");
        $("#txtNameOnCard").attr("disabled", "disabled");
    }
}

// SUMMARY: Mask telephone numbers
function MaskAppraisalFields() {
    // Phone numbers
    $(".uxBorrowerPhone").mask("(999)999-9999");
    $(".uxBorrowerWorkPhone").mask("(999)999-9999");
    $(".uxBorrowerCellPhone").mask("(999)999-9999");
    $(".uxAccessInfoHomePhone").mask("(999)999-9999");
    $(".uxAccessInfoBusinessPhone").unmask().mask("(999)999-9999");
    $(".uxAccessInfoCellPhone").mask("(999)999-9999");

    // FHA Case number 
    //$(".uxFHACaseNumber").mask("?999-9999999)");
}

function ShowInfo() {
}

function ShowMessageBox(message) {
    $(".message").text(message);
    $(".message").css("display", "block");

    $("#dialog-modal").dialog({
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
}

// *** ENTITIES ***

AppraisalDropdown = {
    First: 1,
    Second: 2,
    Third: 3,
    Fourth: 4
}

// *** END ENTITIES ***

// *** VALIDATION ***

//Validate data
function Validation() {

    var IsValid = false;

    $('input.requiredValidate, .requiredValidateAndMaxLength20, .validateCreditCardNumber:not(.notValid), input.comboBoxRequired, #uxAppraisalType1, .uxAppraisalFeeTextBox input:not(:disabled), .ccvValidation').each(function (key, value) {
        if (!$(value).hasClass('comboBoxRequired') && !$(value).is('#uxAppraisalType1:not(:disabled)')) {

            //text box validation
            if (!$(value).hasClass('requiredValidateAndMaxLength20') && !$(value).hasClass('validateCreditCardNumber')) {
                $(value).ValidateTextBox();
            }
            else if ($(value).hasClass('requiredValidateAndMaxLength20')) {
                $(value).ValidateTextBox({ required: true, validateLength: true, maxlength: 20, isInt: true });
            }
            else if ($(value).hasClass('validateCreditCardNumber')) {
                if ($("#hdnNewBillingInformation").val() == "True") {
                    $(this).ValidateTextBox({ required: true, validateLength: true, maxlength: 19, minlength: 12, isInt: true });
                }
                else {
                    $(this).ValidateTextBox({ required: true, validateLength: true, maxlength: 19, minlength: 12, isInt: false });
                }
            }

        }
        else {
            $(value).ValidateComboBox();
        }
    });
    if ($('.notValid').length == 0) {
        IsValid = true;
    }

    return IsValid;
}

function UpfrontValidation() {

    // validation for Loan Number
    var uxLoanNumber = $('.uxLoanNumber');
    uxLoanNumber.focusout(function () {
        if (!isNumber(uxLoanNumber.val())) {
            DisplayMessage("ctl00_ContentPlaceHolder1_OrderAppraisalControl_uxLoanNumber", "<div style='margin-top:10px;margin-left:7px;'>Please try again. Loan number is not correct.</div>");
        }
    });

    // validation for Purchase price
    var uxPurchasePrice = $('.uxPurchasePrice');
    uxPurchasePrice.focusout(function () {
        if (!isNumber(uxPurchasePrice.val())) {
            DisplayMessage("ctl00_ContentPlaceHolder1_OrderAppraisalControl_uxPurchasePrice", "<div style='margin-top:10px;margin-left:7px;'>Please try again. Purchase price is not correct.</div>");
        }
    });

    // validation for Loan Amount
    var uxLoanAmount = $('.uxLoanAmount');
    uxLoanAmount.focusout(function () {
        if (!isNumber(uxLoanAmount.val())) {
            DisplayMessage("ctl00_ContentPlaceHolder1_OrderAppraisalControl_uxLoanAmount", "<div style='margin-top:10px;margin-left:7px;'>Please try again. Loan Amount is not correct.</div>");
        }
    });

    // validation for Borrower email
    var uxBorrowerEmail = $('.uxBorrowerEmail');
    uxBorrowerEmail.focusout(function () {
        if (!validateEmail(uxBorrowerEmail.val())) {
            DisplayMessage("ctl00_ContentPlaceHolder1_OrderAppraisalControl_uxBorrowerEmail", "<div style='margin-top:10px;margin-left:7px;'>Please try again. Borrower email is not in the correct format.</div>");
        }
    });

    // validation for Access Information email
    var uxAccessInformationEmail = $('.uxAccessInfoEmail');
    uxAccessInformationEmail.focusout(function () {
        if (!validateEmail(uxAccessInformationEmail.val())) {
            DisplayMessage("ctl00_ContentPlaceHolder1_OrderAppraisalControl_uxAccessInfoEmail", "<div style='margin-top:10px;margin-left:7px;'>Please try again. Access information email is not in the correct format.</div>");
        }
    });

    // validation for Payment Amount
    var uxPaymentAmount = $('.uxPaymentAmount');
    uxPaymentAmount.focusout(function () {
        if (!isNumber(uxPaymentAmount.val())) {
            DisplayMessage("ctl00_ContentPlaceHolder1_OrderAppraisalControl_uxPaymentAmount", "<div style='margin-top:10px;margin-left:7px;'>Please try again. Payment amount is not correct.</div>");
        }
    });

    // validation for Payment Reference number
    var uxReferenceNumber = $('.uxReferenceNumber');
    uxReferenceNumber.focusout(function () {
        if (!isNumber(uxReferenceNumber.val())) {
            DisplayMessage("ctl00_ContentPlaceHolder1_OrderAppraisalControl_uxReferenceNumber", "<div style='margin-top:10px;margin-left:7px;'>Please try again. Reference number is not correct.</div>");
        }
    });

    // validation for Estimated value
    var uxEstimatedValue = $('.uxEstimatedValue');
    uxEstimatedValue.focusout(function () {
        if (!isNumber(uxEstimatedValue.val())) {
            DisplayMessage("ctl00_ContentPlaceHolder1_OrderAppraisalControl_uxEstimatedValue", "<div style='margin-top:10px;margin-left:7px;'>Please try again. Estimated value is not correct.</div>");
        }
    });

    // validation for Appraised value
    var uxAppraisedValue = $('.uxAppraisedValue');
    uxAppraisedValue.focusout(function () {
        if (!isNumber(uxAppraisedValue.val())) {
            DisplayMessage("ctl00_ContentPlaceHolder1_OrderAppraisalControl_uxAppraisedValue", "<div style='margin-top:10px;margin-left:7px;'>Please try again. Appraised value is not correct.</div>");
        }
    });

    // validation for Doc ID #
    var uxDocumentId = $('.uxUCDPDocumentId');
    uxDocumentId.focusout(function () {
        if (!isNumber(uxDocumentId.val())) {
            DisplayMessage("ctl00_ContentPlaceHolder1_OrderAppraisalControl_uxUCDPDocumentId", "<div style='margin-top:10px;margin-left:7px;'>Please try again. Document Id is not correct.</div>");
        }
    });

}

// SUMMARY: Check if input is number
function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

// SUMMARY: Check if input is email
function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

// *** END VALIDATION ***


function GetProductsAndFees() {
    ShowProcessingInfo();
    var appraisalProductRequest = {
        MortgageType: $(".uxLoanType").attr("value"),
        EstimatedPropertyValue: $("#uxEstimatedValue").data("tTextBox").value(),
        NoOfUnits: $(".uxPropertyUnits").attr("value"),
        OccupancyType: $("#uxPropertyOccupancy").data("tDropDownList").value(),
        PropertyAddressCounty: $(".uxPropertyCounty").attr("value"),
        PropertyAddressState: $("#uxPropertyState").data("tDropDownList").text(),
        PropertyType: $("#uxPropertyType").data("tDropDownList").value()
    };

    $.ajaxAntiForgery({
        type: 'POST',
        url: '/Appraisal/GetProductsAndFees',
        cache: false,
        data: appraisalProductRequest,
        success: function (data) {

            for (var i = 1; i < data.Response.Product.length + 1; i++) {
                var product = data.Response.Product[i - 1];

                if (product.ProductType != null) {
                    $("#uxAppraisalType" + i).data("tDropDownList").value(product.ProductType.Product.Value);

                    if (product.ProductType.Status != undefined && product.ProductType.Status != "Success") {
                        $("#productMessage" + i).css("display", "block");
                        $("#productMessage" + i).attr("title", product.ProductType.Message);
                    }
                    else {
                        $("#productMessage" + i).css("display", "none");
                        $("#productMessage" + i).removeAttr("title")
                    }
                }

                if (product.ProductFee != null) {
                    $("#uxAppraisalFee" + i).data("tTextBox").value(product.ProductFee.Fee);

                    if (product.ProductFee.Comment != "") {
                        $("#uxAppraisalFee" + i).addClass("quoted");
                    }
                    else {
                        $("#uxAppraisalFee" + i).removeClass("quoted");
                    }

                    if (product.ProductFee.Status != undefined && product.ProductFee.Status != "Success") {
                        $("#feeMessage" + i).css("display", "block");
                        $("#feeMessage" + i).attr("title", product.ProductFee.Message);
                    }
                    else {
                        $("#feeMessage" + i).css("display", "none");
                        $("#feeMessage" + i).removeAttr("title")
                    }
                }
                else
                    $("#uxAppraisalFee" + i).removeClass("quoted");
            }
            RecalculateTotalFee();
            EnableAppraisalTypes();
        },
        complete: function () {
            CloseProcessingInfo();
            $('#uxAppraisalType1:not(:disabled)').ValidateComboBox();
        }
    });

}


function GetFee(id) {
    ShowProcessingInfo();
    var appraisalFeeRequest = {
        Product: $("#uxAppraisalType" + id).data("tDropDownList").value(),
        EstimatedPropertyValue: $("#uxEstimatedValue").data("tTextBox").value(),
        NumberOfUnits: $(".uxPropertyUnits").attr("value"),
        County: $(".uxPropertyCounty").attr("value"),
        State: $("#uxPropertyState").data("tDropDownList").text()
    };

    $.ajaxAntiForgery({
        type: 'POST',
        url: '/Appraisal/GetFee',
        cache: false,
        data: appraisalFeeRequest,
        success: function (data) {
            var fee = data.OrderAppraisalFee;
            var comment = data.OrderAppraisalFeeComment;
            var message = data.OrderAppraisalFeeMessage;
            var status = data.OrderAppraisalFeeStatus;

            if (fee != undefined)
                $("#uxAppraisalFee" + id).data("tTextBox").value(fee);
            else {
                $("#uxAppraisalFee" + id).data("tTextBox").value("");

                ShowMessageBox("Fee not found for selected product");
            }

            if (comment != "" && comment != undefined)
                $("#uxAppraisalFee" + id).addClass("quoted");
            else
                $("#uxAppraisalFee" + id).removeClass("quoted");

            if (status != undefined && status != "Success") {
                $("#feeMessage" + id).css("display", "block");
                $("#feeMessage" + id).attr("title", message);
            }
            else {
                $("#feeMessage" + id).css("display", "none");
                $("#feeMessage" + id).removeAttr("title");
            }

            RecalculateTotalFee();
        },
        complete: function () {
            CloseProcessingInfo();
            $("#uxAppraisalFee" + id).ValidateTextBox();
            $("#uxAppraisalFee" + id).bind("blur", function () {
                $(this).ValidateTextBox();
            });
        }
    });
}


function GetBusinessContact(loanId) {

    $.ajaxAntiForgery({
        type: 'GET',
        url: '/Appraisal/GetBusinessContact',
        cache: false,
        data: 'loanId=' + loanId,
        success: function (data) {
            var bcName = data.FirstName + " " + data.LastName;
            var bcHomePhone = data.HomePhone;
            var bcCellPhone = data.CellPhone;
            var bcWorkPhone = data.WorkPhone;
            var bcEmail = data.Email;
            var bcPreferred = data.Preferred;

        }
    });
}

function GetBillingInformation( billinginformationid ) {

    if (billinginformationid != -1) {
        ShowProcessingInfo();
        $.ajaxAntiForgery({
            type: 'GET',
            url: '/Appraisal/GetBillingInformation',
            cache: false,
            data: 'billingInformationId=' + billinginformationid,
            success: function (data) {
                if (data.CreditCardNumber != undefined)
                    $("#txtCreditCardNr").val(data.CreditCardNumber);
                if (data.CreditCardCCV != undefined)
                    $("#txtCCVNr").val(data.CreditCardCCV);
                if (data.NameOnCard != undefined)
                    $("#txtNameOnCard").val(data.NameOnCard);
                if (data.ExpirationYear != undefined)
                    $("#uxExpirationYear").data("tDropDownList").value(data.ExpirationYear);
                if (data.ExpirationMonth != undefined)
                    $("#uxExpirationMonth").data("tDropDownList").value(data.ExpirationMonth);
                if (data.CreditCardType != undefined)
                    $("#uxCreditCardType").data("tDropDownList").value(data.CreditCardType);
            },
            complete: function () {
                CloseProcessingInfo();
            }
        });
    }
    //combobox validation
    //$(this).ValidateComboBox();
}

function GetOrderAppraisalData() {
    
    var orderAppraisal = {
        LoanId: $("#hdnLoanId").val(),
        LoanType: $("#loanType").val(),
        OrderId: $("#hdnOrderId").val(),
        NewBillingInformation: $("#hdnNewBillingInformation").val(),
        OrderAppraisalId: $("#hdnOrderAppraisalId").val(),
        BillingInformation: {
                                BillingInformationid: $("#hdnBillingId").val(),
                                CreditCardType: $("#uxCreditCardType").data("tDropDownList").value() != -1 ? $("#uxCreditCardType").data("tDropDownList").value() : "",
                                CreditCardNumber: $("#txtCreditCardNr").val(),
                                CCV: $("#txtCCVNr").val(),
                                NameOnCard: $("#txtNameOnCard").val(),
                                ExpirationDate: $("#uxExpirationYear").data("tDropDownList").value() + "-" + $("#uxExpirationMonth").data("tDropDownList").value() + "-01"
                            },
        PreferredContact: {
                                PreferredContactId: $("#hdnPreferredContactId").val(),
                                PreferredContactType: $("#uxAccessInformationList").data("tDropDownList").value() != -1 ? $("#uxAccessInformationList").data("tDropDownList").value() : "",
                                PreferredContactFirstName: $("#uxAccessInfoName").val(),
                                PreferredContactLastName: $("#uxAccessInfoLastName").val(),
                                PreferredContactEmail: $("#uxAccessInfoEmail").val(),
                                PreferredContactPhone: $("#uxAccessInfoHomePhone").val(),
                                PreferredContactPhoneType: $("#uxAccessInfoPreferredPhone").data("tDropDownList").value() != -1 ? $("#uxAccessInfoPreferredPhone").data("tDropDownList").value() : ""
                            },
        SpecialInstructions: $("#uxSpecialInstructions").val(),
        PaymentMethod: $(".uxPaymentMethod:checked").val(),
        PaidBy: $(".uxPaidBy:checked").val(),
        OrderType: $('input:radio[name=uxOrders]:checked').val(),
        AppraisalOrderId: $('#uxAppraisalOrderId').val(),
        ProductsWithFees: [{ OrderAppraisalProductsFeesId: $("#hdnOrderAppraisalProductsFeesId1").val(),
                                ProductValue: $("#uxAppraisalType1").data("tDropDownList").value() != -1 ? $("#uxAppraisalType1").data("tDropDownList").value() : "",
                                ProductName: $("#uxAppraisalType1").data("tDropDownList").value() != -1 ? $("#uxAppraisalType1").data("tDropDownList").text() : "",
                                FeeAmount: $("#uxAppraisalFee1").data("tTextBox").value() },
                            { OrderAppraisalProductsFeesId: $("#hdnOrderAppraisalProductsFeesId2").val(), 
                                ProductValue: $("#uxAppraisalType2").data("tDropDownList").value() != -1 ? $("#uxAppraisalType2").data("tDropDownList").value() : "",
                                ProductName: $("#uxAppraisalType2").data("tDropDownList").value() != -1 ? $("#uxAppraisalType2").data("tDropDownList").text() : "",
                                FeeAmount: $("#uxAppraisalFee2").data("tTextBox").value() },
                            { OrderAppraisalProductsFeesId: $("#hdnOrderAppraisalProductsFeesId3").val(),
                                ProductValue: $("#uxAppraisalType3").data("tDropDownList").value() != -1 ? $("#uxAppraisalType3").data("tDropDownList").value() : "",
                                ProductName: $("#uxAppraisalType3").data("tDropDownList").value() != -1 ? $("#uxAppraisalType3").data("tDropDownList").text() : "",
                                FeeAmount: $("#uxAppraisalFee3").data("tTextBox").value() },
                            { OrderAppraisalProductsFeesId: $("#hdnOrderAppraisalProductsFeesId4").val(),
                                ProductValue: $("#uxAppraisalType4").data("tDropDownList").value() != -1 ? $("#uxAppraisalType4").data("tDropDownList").value() : "",
                                ProductName: $("#uxAppraisalType4").data("tDropDownList").value() != -1 ? $("#uxAppraisalType4").data("tDropDownList").text() : "",
                                FeeAmount: $("#uxAppraisalFee4").data("tTextBox").value() },
                            { OrderAppraisalProductsFeesId: $("#hdnOrderAppraisalProductsFeesId5").val(),
                                ProductValue: $("#uxAppraisalType5").data("tDropDownList").value() != -1 ? $("#uxAppraisalType5").data("tDropDownList").value() : "",
                                ProductName: $("#uxAppraisalType5").data("tDropDownList").value() != -1 ? $("#uxAppraisalType5").data("tDropDownList").text() : "",
                                FeeAmount: $("#uxAppraisalFee5").data("tTextBox").value() },
                            { OrderAppraisalProductsFeesId: $("#hdnOrderAppraisalProductsFeesId6").val(),
                                ProductValue: $("#uxAppraisalType6").data("tDropDownList").value() != -1 ? $("#uxAppraisalType6").data("tDropDownList").value() : "",
                                ProductName: $("#uxAppraisalType6").data("tDropDownList").value() != -1 ? $("#uxAppraisalType6").data("tDropDownList").text() : "",
                                FeeAmount: $("#uxAppraisalFee6").data("tTextBox").value() },
                            { OrderAppraisalProductsFeesId: $("#hdnOrderAppraisalProductsFeesId7").val(),
                                ProductValue: $("#uxAppraisalType7").data("tDropDownList").value() != -1 ? $("#uxAppraisalType7").data("tDropDownList").value() : "",
                                ProductName: $("#uxAppraisalType7").data("tDropDownList").value() != -1 ? $("#uxAppraisalType7").data("tDropDownList").text() : "",
                                FeeAmount: $("#uxAppraisalFee7").data("tTextBox").value() } ],
        RushOrder: $(".uxRushChecked").is(':checked'),
        PaymentAmount: $("#uxPaymentAmount").data("tTextBox").value(),
        UserAccountId: $("#hdnUserAccountId").val(),
        State: $("#uxPropertyState").data("tDropDownList").text(),
        DocumentsToLenderX: GetLenderXFileData(),
        Seller: GetSellerData(),
        FHACaseId: $("#txtFHACaseId").val()
    };

    return orderAppraisal;
}

function GetSellerData() {

    var seller = {
        Insert: false,
        SellerName: '',
        SellerType: ''
    };

    if ($('#SellerName').is(':not(:disabled)')) {
        seller = {
            Insert: true,
            SellerName: $('#SellerName').val(),
            SellerType: $('.uxSellerType:checked').val()
        };
    }

    return seller;
}


function SaveAppraisalOrder() {
    var IsValid = Validation();
    if (!IsValid)
        return false;
        
    ShowProcessingInfo();

    $.ajaxAntiForgery({
        type: 'POST',
        url: '/Appraisal/SaveAppraisalOrder',
        cache: false,
        data: $.toDictionary( GetOrderAppraisalData() ),
        success: function (data) {
            $("#divConversationLogPopup").show();
            $("#divConversationLogPopup").html(data);
            $(".modalBackground").css("display", "block");
        },
        complete: function () {
            CloseProcessingInfo();
            $("#hdnNewBillingInformation").val("False");
        }
    });
}

function GetLenderXFileData() {
    var listOfDocumentsToLenderX = [];

    $('.file').each(function (index, value) {
        var uplodedFileId = $(value).attr("id");

        var lenderXFile = {
            UploadedFileId: uplodedFileId,
            Checked: $("#chkUpload_" + uplodedFileId).is(':checked'),
            Submitted: $("#chkSubmited_" + uplodedFileId).is(':checked'),
            LenderXFileId: $("#chkSubmited_" + uplodedFileId).val()
        }
        if (lenderXFile != undefined && lenderXFile.LenderXFileId != '' ) {
            listOfDocumentsToLenderX.push(lenderXFile);
        }
    });
    return listOfDocumentsToLenderX;
}

//validate credid card expiration
function ValidateCCExpirationDate() {

    var monthDivWraper = $("#uxExpirationMonth").parent().children('.t-dropdown-wrap');
    var yearDivWraper = $("#uxExpirationYear").parent().children('.t-dropdown-wrap');

    if ($(".uxPaymentMethod:checked").val() == "CreditCard") {

        var comboExpMonth = $("#uxExpirationMonth").data("tDropDownList").value();
        var comboExpYear = $("#uxExpirationYear").data("tDropDownList").value();

        if (comboExpMonth == undefined || comboExpYear == undefined ) {
            setValid( monthDivWraper, false, "This date has expired. Please enter a valid date.", true );
            setValid( yearDivWraper, false, "This date has expired. Please enter a valid date.", true );
            return false;
        }

        if (comboExpMonth != undefined && comboExpYear != undefined ) {
            var selectedDate = new Date(comboExpYear, comboExpMonth, 1);
            var today = new Date();

            today.setDate(1);
            today.setHours(0, 0, 0, 0);

            if (selectedDate < today) {
                setValid( monthDivWraper, false, "This date has expired. Please enter a valid date.", true );
                setValid( yearDivWraper, false, "This date has expired. Please enter a valid date.", true );
                return false;
            }
        };
    }
    setValid(monthDivWraper, true, "", true);
    setValid(yearDivWraper, true, "", true);
    return true;
}

function SubmitToLenderX() {
    var IsValid = Validation();
    if (!IsValid || !ValidateCCExpirationDate())
        return false;

    ShowProcessingInfo();

    $.ajaxAntiForgery({
        type: 'POST',
        url: '/Appraisal/SubmitToLenderX',
        cache: false,
        data: $.toDictionary(GetOrderAppraisalData()),
        success: function (data) {
            $("#divConversationLogPopup").show();
            $("#divConversationLogPopup").html(data);
            $(".modalBackground").css("display", "block");

            $.ajax({
                type: "GET",
                url: '/Home/GetCurrentWorkQueue',
                async: false,
                success: function (data2) {
                    workQueue = data2;

                    if (workQueue == WorkQueueTypes.OrderRequested) {
                        OrderRequestedGrid.OrderRequestedDataOnRefresh("command=OpenOrderRequestedTab,Refresh=true");

                        if (!($("[id='task 0']") && $("[id='task 0']").attr("id"))) {
                            OrderRequestedGrid.OrderRequestedDataOnRefresh("command=OpenOrderRequestedTab,Refresh=false");
                        }
                    }
                }
            });
        },
        complete: function () {
            Refresh.RefreshDataHelper();
            CloseProcessingInfo();
            $("#hdnNewBillingInformation").val("False");
        }
    });
}

function NewCreditCard() {
    $("#uxPaymentCreditCard").attr('checked', true);
    ClearCreditCardData();
    EnableCreditCardData();

    EnableCreditCardValidation();
}

function SaveBusinessContact(loanId) {

    // Check business contact type
    var businessContactData;
    var postData;
    var contactType = $('#businessContactCategory').val();

     var data1 = 
     {
            sellerType: $('input:radio[name=sellerType]:checked').val(),
            seller1FirstName: $('#txtContactFirstName').val(),
            seller1LastName: $('#txtContactLastName').val(),
            seller1PreferredPhone: $('#txtContactPhonePreferred').val(),
            seller1PreferredPhoneType: '1',
            seller1AlternatePhone: $('#txtContactPhoneAlternate').val(),
            seller1AlternatePhoneType: '1',
            seller1Email: $('#txtContactEmail').val(),

            seller2FirstName: $('#txtContactFirstNameSecondSeller').val(),
            seller2LastName: $('#txtContactLastNameSecondSeller').val(),
            seller2PreferredPhone: $('#txtContactPhonePreferredSecondSeller').val(),
            seller2PreferredPhoneType: '1',
            seller2AlternatePhone: $('#txtContactPhoneAlternateSecondSeller').val(),
            seller2AlternatePhoneType: '1',
            seller2Email: $('#txtContactEmailSecondSeller').val(),

            streetAddress: $('#txtStreetAddress').val(),
            zipCode: $('#txtZipCode').val(),
            city: $('#txtCityContact').val(),
            stateName: $('#contactState').data("tDropDownList").text(),
            type: GetBusinesCategoryString($('#businessContactCategory').val()),
            userAccountId: $('#uxUserAccountId').text()
     }

     alert( JSON.stringify(data1) );

    $.ajaxAntiForgery({
        type: 'POST',
        url: '/BusinessContactController/ValidateAndSaveBusinessContactData',
        data: data1,
        success: function (data) {
            
        }
    });
}

function CleanData( data )
{
    data = data.replace( " ", "" );
    data = data.replace( "(", "" );
    data = data.replace( ")", "" );
    data = data.replace( "-", "" );
    data = data.replace( "_", "");
    return data;
}

function CheckAppraisalStatus(loanId) {
    
    // Show loader message
    ShowProcessingInfo();

    // Get data from form
    var request = {
        appraisalOrderId: $('#uxAppraisalOrderId').val(),
        loanId: loanId
    };

    // Send AJAX request
    $.ajaxAntiForgery({
        type: 'POST',
        url: '/Appraisal/GetAppraisalOrderStatus',
        cache: false,
        data: request,
        success: function (data) {
            $("#divConversationLogPopup").show();
            $("#divConversationLogPopup").html(data);
            $(".modalBackground").css("display", "block");
        },
        complete: function () {
            CloseProcessingInfo();
        }
    });
}

function SubmitAppraisalOrder() {
    var IsValid = Validation();
    if (!IsValid)
        return false;

    ShowProcessingInfo();

    $.ajaxAntiForgery({
        type: 'POST',
        url: '/Appraisal/SubmitAppraisalOrder',
        cache: false,
        data: $.toDictionary( GetOrderAppraisalData() ),
        success: function (data) {
            $("#divConversationLogPopup").show();
            $("#divConversationLogPopup").html(data);
            $(".modalBackground").css("display", "block");
        },
        complete: function () {
            Refresh.RefreshDataHelper();
            CloseProcessingInfo();
            $("#hdnNewBillingInformation").val("False");
        }
    });
}

// SUMMARY: Retrieve contact information for access information section
function RetrieveAccessInformationData() {

    EnableContactFields();
    
    // Show loader message
    ShowProcessingInfo();

    // Get data from form
    var request = {
        contactType: $("#uxAccessInformationList").data("tDropDownList").value(),
        loanId: $("#hdnLoanId").val()
    };

    // Send AJAX request
    $.ajaxAntiForgery({
        type: 'POST',
        url: '/Appraisal/GetBusinessContact',
        cache: false,
        data: request,
        success: function (data) {
            $('#uxAccessInfoName').val(data.FirstName);
            $('#uxAccessInfoLastName').val(data.LastName);
            $('#uxAccessInfoEmail').val(data.Email);
            $('#uxAccessInfoHomePhone').val(data.PreferredPhone).unmask().mask("(999)999-9999");
            $("#uxAccessInfoPreferredPhone").data("tDropDownList").select(data.Preferred);
            $('#hdnPreferredContactId').val(data.ContactId);
        },
        complete: function () {
            CloseProcessingInfo();
        }
    });
}

function EnableContactFields() {
    var contactType = $("#uxAccessInformationList").data("tDropDownList").value();
    if (contactType == 7) // Other
    {
        $('#uxAccessInfoName').prop("disabled", false);
        $('#uxAccessInfoLastName').prop("disabled", false);
        $('#uxAccessInfoEmail').prop("disabled", false);
        $('#uxAccessInfoHomePhone').prop("disabled", false);
        $("#uxAccessInfoPreferredPhone").data("tDropDownList").enable();
    }
    else {
        $('#uxAccessInfoName').prop("disabled", true);
        $('#uxAccessInfoLastName').prop("disabled", true);
        $('#uxAccessInfoEmail').prop("disabled", true);
        $('#uxAccessInfoHomePhone').prop("disabled", true);
        $("#uxAccessInfoPreferredPhone").data("tDropDownList").disable();
    }
}

function SetPaymentMethod() {
    $(".uxPaidBy").change(function () {
        var id = $(this).attr("id");
        if (id == "uxPaidByLO") {
            $("#uxPaymentCheck").attr('disabled', 'disabled');
            $("#uxPaymentPTC").attr('disabled', 'disabled');
            $("#uxPaymentCreditCard").attr('checked', 'checked');
        }
        else {
            $("#uxPaymentCheck").removeAttr("disabled");
            $("#uxPaymentPTC").removeAttr("disabled");
        }
    });
}


function DisablePaymentInformation(disable) {
    if (!disable)
        return;

    $(".uxPaymentMethod").attr('disabled', 'disabled');
    $(".uxPaidBy").attr('disabled', 'disabled');
    
    DisableCreditCardData();
}
