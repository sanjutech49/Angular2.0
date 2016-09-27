var resultGlobal;

BussinesContactDetails = {
    BussinesContactDetailsPopup: function (contactId, loanType, lcContactType, lcCompanyId, lcContactId, isGlobalContact) {
        var loanId = $('.tablelistselected .loanid').text();
        $.ajax({
            type: "GET",
            url: "Command/Execute",
            cache: false,
            data: 'command=OpenBusinessContactPopup,ContactId=' + contactId + ',LoanType=' + loanType + ',LCContactType=' + lcContactType
            + ',LCCompanyId=' + lcCompanyId + ',LCContactId=' + lcContactId + ',IsGlobalContact=' + isGlobalContact + ',LoanId=' + loanId,
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

    BussinesContactDetailsDelete: function (contactId, loanId) {
        var businessContactId = { businessContactId: contactId };

        $.ajaxAntiForgery({
            type: 'POST',
            url: '/BusinessContact/DeleteBusinessContact',
            cache: false,
            data: businessContactId,
            dataType: "JSON",
            success: function (data) {
                AdditionalViews.AdditionalViewSection(loanId, 0, 1);
            }
        });
    },

    CloseBusinessContactPopup: function () {
        $("#validationtooltip").hide();
        $('.modalBackground').fadeOut();
        $("#businessContactPopup").hide();
        $("#validationTooltip").hide();
        $(".qtip").remove();
    },

    ValidateAndSaveBusinessContactData: function (contactId, loanId) {
       
        var sellers = new Array();
        var seller1 = {
            //Seller 1 data

            OrderNumber: 1,
            FirstNameSeller: $("#txtContactFirstName").val(),
            LastNameSeller: $("#txtContactLastName").val(),
            ContactPhonePreferredSeller: $("#txtContactPhonePreferred").val(),
            PrefferedPhoneCategorySeller: $('#prefferedPhoneCategory').data('tDropDownList').value(),
            ContactPhoneAlternateSeller: $("#txtContactPhoneAlternate").val(),
            AlternatePhoneCategorySeller: $('#alternatePhoneCategory').data('tDropDownList').value(),
            EmailSeller: $("#txtContactEmail").val()
        }

        var seller2 = {
            //Seler 2 data

            SellerNumber: 2,
            FirstNameSeller: $("#txtContactFirstNameSecondSeller").val(),
            LastNameSeller: $("#txtContactLastNameSecondSeller").val(),
            ContactPhonePreferredSeller: $("#txtContactPhonePreferredSecondSeller").val(),
            PrefferedPhoneCategorySeller: $('#prefferedPhoneCategorySecondSeller').data('tDropDownList').value(),
            ContactPhoneAlternateSeller: $("#txtContactPhoneAlternateSecondSeller").val(),
            AlternatePhoneCategorySeller: $('#alternatePhoneCategorySecondSeller').data('tDropDownList').value(),
            EmailSeller: $("#txtContactEmailSecondSeller").val()
        }

        sellers.push(seller1);
        sellers.push(seller2);

        var businessContactInfo = {

            SellerType: $('.radioBtnContactType:checked').val(),

            //Seler's data
            Sellers: sellers,

            //Company data
            CompanyName: $("#txtCompany").val(),
            Contact: $("#txtContactCompany").val(),
            PrefferedPhone: $("#txtContactPhonePreferredCompany").val(),
            PrefferedPhoneCategory: $('#prefferedPhoneCategoryCompany').data('tDropDownList').value(),
            AlternatePhone: $("#txtContactPhoneAlternateCompany").val(),
            AlternatePhoneCategory: $('#alternatePhoneCategoryCompany').data('tDropDownList').value(),
            Email: $("#txtContactEmailCompany").val(),

            //Common data
            ZipCode: $("#txtZipCode").val(),
            City: $("#txtCityContact").val(),
            State: $('#contactState').data('tDropDownList').value(),
            Statename: $('#contactState').data('tDropDownList').text(),

            BusinessContactCategory: $('#businessContactCategory').val(),
            BusinessContactId: contactId
        };

        $.ajaxAntiForgery({
            type: 'POST',
            url: '/BusinessContact/ValidateAndSaveBusinessContactData',
            cache: false,
            data: businessContactInfo,
            success: function () {
                BussinesContactDetails.CloseBusinessContactPopup();
                AdditionalViews.AdditionalViewSection(loanId, 0, 1);
            }
        });
    },

    ClearData: function () {

        $("#txtZipCode").val("").unmask().mask("?99999");
        $("#txtOtherZipCode").val("").unmask().mask("?99999");

        $("#txtCityContact").val("");
        $("#txtOtherCityContact").val("");

        $(".txtContact").val("");
        $(".txtCompany").val("");
        $(".txtFirstName").val("");
        $(".txtLastName").val("");

        $("#txtContactPhonePreferred").val("").unmask().mask("?(999) 999-9999");
        $("#txtContactPhoneAlternate").val("").unmask().mask("?(999) 999-9999");
        $("#txtContactPhonePreferredCompany").val("").unmask().mask("?(999) 999-9999");
        $("#txtContactPhoneAlternateCompany").val("").unmask().mask("?(999) 999-9999");
        $("#txtOtherContactPhonePreferred").val("").unmask().mask("?(999) 999-9999");
        $("#txtOtherContactPhoneAlternate").val("").unmask().mask("?(999) 999-9999");

        $(".txtEmail").val("");
        $(".txtStreetAddress").val("");
        $("#prefferedPhoneCategory").data('tDropDownList').select(1);
        $("#alternatePhoneCategory").data('tDropDownList').select(1);
        $("#prefferedPhoneCategoryCompany").data('tDropDownList').select(1);
        $("#alternatePhoneCategoryCompany").data('tDropDownList').select(1);
        $("#prefferedPhoneCategoryOther").val(1);
        $("#alternatePhoneCategoryOther").val(1);

        // second seller data
        $(".txtFirstNameAltSeller").val("");
        $(".txtLastNameAltSeller").val("");
        $("#txtContactPhonePreferredSecondSeller").val("").unmask().mask("?(999) 999-9999");
        $("#txtContactPhoneAlternateSecondSeller").val("").unmask().mask("?(999) 999-9999");
        $("#prefferedPhoneCategorySecondSeller").data('tDropDownList').select(1);
        $("#alternatePhoneCategorySecondSeller").data('tDropDownList').select(1);
        $(".txtEmailAltSeller").val("");

        $("#contactState").data('tDropDownList').select(0);
        $("#contactStateOther").val(0);

        $("#txtReferenceNumberSeller1").val("");
        $("#txtReferenceNumberSeller2").val("");
        $("#txtReferenceNumberBankLLC").val("");
        $("#txtReferenceNumber").val("");
    },

    GetBusinessContactInformation: function (businessContactId) {

        if (businessContactId != -1) {
            ShowProcessingInfo();
            $.ajaxAntiForgery({
                type: 'GET',
                url: '/BusinessContact/GetBusinessContactInformation',
                cache: false,
                data: 'businessContactId=' + businessContactId,
                success: function (data) {

                    if (data.Contact != undefined && $(".txtContact").length > 0)
                        $(".txtContact").val(data.Contact);

                    if (data.Company != undefined && $(".txtCompany").length > 0)
                        $(".txtCompany").val(data.Company);

                    if (data.FirstName != undefined && $(".txtFirstName").length > 0)
                        $(".txtFirstName").val(data.FirstName);

                    if (data.LastName != undefined && $(".txtLastName").length > 0)
                        $(".txtLastName").val(data.LastName);

                    if (data.StreetAddress != undefined && $(".txtStreetAddress").length > 0)
                        $(".txtStreetAddress").val(data.StreetAddress);

                    if (data.ZipCode != undefined && $("#txtZipCode").length > 0)
                        $("#txtZipCode").val(data.ZipCode).unmask().mask("?99999");

                    if (data.ZipCode != undefined && $("#txtOtherZipCode").length > 0)
                        $("#txtOtherZipCode").val(data.ZipCode).unmask().mask("?99999");

                    if (data.City != undefined && $("#txtCityContact").length > 0)
                        $("#txtCityContact").val(data.City);

                    if (data.City != undefined && $("#txtOtherCityContact").length > 0)
                        $("#txtOtherCityContact").val(data.City);

                    if (data.StateId != undefined && $("#contactState") != undefined)
                        $("#contactState").data('tDropDownList').select(data.StateId);

                    if (data.StateId != undefined && $("#contactStateOther") != undefined)
                        $("#contactStateOther").val(data.StateId);

                    if (data.PrefPhoneNumber != undefined && $("#txtContactPhonePreferred").length > 0)
                        $("#txtContactPhonePreferred").val(data.PrefPhoneNumber).unmask().mask("?(999) 999-9999");

                    if (data.AltPhoneNumber != undefined && $("#txtContactPhoneAlternate").length > 0)
                        $("#txtContactPhoneAlternate").val(data.AltPhoneNumber).unmask().mask("?(999) 999-9999");

                    if (data.PrefPhoneNumber != undefined && $("#txtContactPhonePreferredCompany").length > 0)
                        $("#txtContactPhonePreferredCompany").val(data.PrefPhoneNumber).unmask().mask("?(999) 999-9999");

                    if (data.AltPhoneNumber != undefined && $("#txtContactPhoneAlternateCompany").length > 0)
                        $("#txtContactPhoneAlternateCompany").val(data.AltPhoneNumber).unmask().mask("?(999) 999-9999");

                    if (data.PrefPhoneNumber != undefined && $("#txtOtherContactPhonePreferred").length > 0)
                        $("#txtOtherContactPhonePreferred").val(data.PrefPhoneNumber).unmask().mask("?(999) 999-9999");

                    if (data.AltPhoneNumber != undefined && $("#txtOtherContactPhoneAlternate").length > 0)
                        $("#txtOtherContactPhoneAlternate").val(data.AltPhoneNumber).unmask().mask("?(999) 999-9999");

                    if (data.Email != undefined && $(".txtEmail").length > 0)
                        $(".txtEmail").val(data.Email);

                    if (data.PrefPhoneNumberType != undefined && $("#prefferedPhoneCategory") != undefined)
                        $("#prefferedPhoneCategory").data('tDropDownList').select(data.PrefPhoneNumberType);

                    if (data.AltPhoneNumberType != undefined && $("#alternatePhoneCategory") != undefined)
                        $("#alternatePhoneCategory").data('tDropDownList').select(data.AltPhoneNumberType);

                    if (data.PrefPhoneNumberType != undefined && $("#prefferedPhoneCategoryCompany") != undefined)
                        $("#prefferedPhoneCategoryCompany").data('tDropDownList').select(data.PrefPhoneNumberType);

                    if (data.AltPhoneNumberType != undefined && $("#alternatePhoneCategoryCompany") != undefined)
                        $("#alternatePhoneCategoryCompany").data('tDropDownList').select(data.AltPhoneNumberType);

                    if (data.PrefPhoneNumberType != undefined && $("#prefferedPhoneCategoryOther") != undefined)
                        $("#prefferedPhoneCategoryOther").val(data.PrefPhoneNumberType);

                    if (data.AltPhoneNumberType != undefined && $("#alternatePhoneCategoryOther") != undefined)
                        $("#alternatePhoneCategoryOther").val(data.AltPhoneNumberType);

                    if (data.ReferenceNumber != undefined && $("#txtReferenceNumberSeller1").length > 0)
                        $("#txtReferenceNumberSeller1").val(data.ReferenceNumber);

                    if (data.ReferenceNumber != undefined && $("#txtReferenceNumberBankLLC").length > 0)
                        $("#txtReferenceNumberBankLLC").val(data.ReferenceNumber);

                    if (data.ReferenceNumber != undefined && $("#txtReferenceNumber").length > 0)
                        $("#txtReferenceNumber").val(data.ReferenceNumber);

                    //alternate seller

                    if (data.FirstNameAltSeller != undefined && $(".txtFirstNameAltSeller").length > 0)
                        $(".txtFirstNameAltSeller").val(data.FirstNameAltSeller);

                    if (data.LastNameAltSeller != undefined && $(".txtLastNameAltSeller").length > 0)
                        $(".txtLastNameAltSeller").val(data.LastNameAltSeller);

                    if (data.PrefPhoneNumberAltSeller != undefined && $("#txtContactPhonePreferredSecondSeller").length > 0)
                        $("#txtContactPhonePreferredSecondSeller").val(data.PrefPhoneNumberAltSeller).unmask().mask("?(999) 999-9999");

                    if (data.AltPhoneNumberAltSeller != undefined && $("#txtContactPhoneAlternateSecondSeller").length > 0)
                        $("#txtContactPhoneAlternateSecondSeller").val(data.AltPhoneNumberAltSeller).unmask().mask("?(999) 999-9999");

                    if (data.EmailAltSeller != undefined && $(".txtEmailAltSeller").length > 0)
                        $(".txtEmailAltSeller").val(data.EmailAltSeller);

                    if (data.PrefPhoneNumberTypeAltSeller != undefined && $("#prefferedPhoneCategorySecondSeller") != undefined)
                        $("#prefferedPhoneCategorySecondSeller").data('tDropDownList').select(data.PrefPhoneNumberTypeAltSeller);

                    if (data.AltPhoneNumberTypeAltSeller != undefined && $("#alternatePhoneCategorySecondSeller") != undefined)
                        $("#alternatePhoneCategorySecondSeller").data('tDropDownList').select(data.AltPhoneNumberTypeAltSeller);

                    if (data.ReferenceNumberAlterSeler != undefined && $("#txtReferenceNumberSeller2").length > 0)
                        $("#txtReferenceNumberSeller2").val(data.ReferenceNumberAlterSeler);
                },
                complete: function () {
                    CloseProcessingInfo();
                }
            });
        }

    }

};


