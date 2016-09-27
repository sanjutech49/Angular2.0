var changedOccurred;
var originalClosingCostSection1100 = "";
var originalClosingCostSection1200 = "";
ManageFees = {
    ManageFeesLoad: function (loanId, prospectId) {
        var showChangeClosingDatePopup;
        ShowProcessingInfo();

        $.ajax({
            type: 'GET',
            url: '/Command/Execute',
            cache: false,
            data: 'Command=ManageFees,LoanId=' + loanId,
            dataType: "html",
            success: function (data) {
                $('#detailsSection').html(data);
                ManageFees.ManageFeesSuccess();
            },
            error: function () {
                HideProcessingInfo();
            }
        });
    },
    ManageFeesSuccess: function () {

        $("#detailsSection").slideDown(400);

        changedOccurred = false;

        if ($("#hdnIsAuthorizedToLockFee").val() == "False") {
            $(".rightClick").each(function () {
                $(this).removeClass("rightClick");
            });

            $(".rightClickTotal").each(function () {
                $(this).removeClass("rightClickTotal");
            });
        }

        $("#manageFeesSection").find('input,select').change(function () {
            changedOccurred = true;
        });

        var minDateRange = new Date();
        var maxDateRange = new Date();

        //schedule date is one today + 1 month
        maxDateRange.setMonth(minDateRange.getMonth() + 2);
        minDateRange.setDate(minDateRange.getDate() + 1);

        $("#txtFromDate901").datepicker({
            minDate: minDateRange,
            maxDate: maxDateRange,
            beforeShowDay: $.datepicker.noWeekends,
            yearRange: minDateRange.getFullYear() + ":" + maxDateRange.getFullYear()
        });

        $("#txtFromDate901").bind("change", ManageFees.OpenClosingDatePopup);

        $("#manageFeesInfoIcon").mouseenter(function () {
            var pos = $("#manageFeesInfoIcon").offset();

            $(".infoinconbubble").css({
                top: (pos.top - 45) + "px",
                display: "block"
            });
        });

        $("#manageFeesInfoIcon").mouseleave(function () {
            $(".infoinconbubble").css('display', 'none');
        });
        $(".managefeesTabs").click(function () {
            var arrowImg = "";
            $(".managefeesTabs").each(function () {
                if ($(this).hasClass("managefeesTabsSelected")) {
                    $(this).removeClass("managefeesTabsSelected");
                }

                if ($(this).find('img').length > 0) {
                    var imgElem = $(this).find($("img"));
                    arrowImg = $(imgElem).prop('outerHTML');
                    $(this).children("img").remove();
                }

            });

            $(".manageFeesPage").each(function () {
                $(this).hide();
            });

            $(this).addClass("managefeesTabsSelected");
            $(this).html($(this).html() + arrowImg.toString());

            if ($(this).attr('id') == "manageFeesTab1") {
                $("#manageFeesPage1").show();
            }

            if ($(this).attr('id') == "manageFeesTab2") {
                $("#manageFeesPage2").show();
            }

            if ($(this).attr('id') == "manageFeesTab3") {
                $("#manageFeesPage3").show();
            }
        });

        ManageFees.BindPtcPocPopupEvents();
        ManageFees.ManageLockedCosts();
        ManageFees.Bind1000SectionEvents();
        ManageFees.UpdateBorrowerFunds();
        ManageFees.UpdateBorrowerFunds1100();
        ManageFees.Bind1100SectionEvents();
        ManageFees.BindTotalAmountActions();

        ManageFees.CalcSectionTotal("", true, "801");
        ManageFees.CalcSectionTotal("", true, "1101");
        ManageFees.Bind801SectionEvents();
        ManageFees.LoadCalc803Total();

        ManageFees.Bind700SectionEvents();
        ManageFees.Bind900SectionEvents();

        ManageFees.Bind1200SectionEvents();
        ManageFees.Calculate1205();
        ManageFees.Calculate1201();
        ManageFees.Calculate1203();

        ManageFees.Bind1300SectionEvents();
        ManageFees.Calculate1301();

        $('.btnSaveCosts').unbind('click keyup');
        $('.btnSaveCosts').bind('click keyup', function () {
            ManageFees.SaveCosts(false);
        });

        originalClosingCostSection1100 = "";
        originalClosingCostSection1200 = "";

        HideProcessingInfo();

        ManageFees.BindLockFeeMenu();
    },
    BindLockFeeMenu: function () {
        $(".rightClick").contextMenu({
            menu: 'lockFeeMenu'
        },
	    function (action, el, pos) {
	        ManageFees.RightClick(action, el, pos);
	    });

        $(".rightClickTotal").contextMenu({
            menu: 'lockAllFeesMenu'
        },
	    function (action, el, pos) {
	        ManageFees.RightClick(action, el, pos);
	    });
    },
    InitializeConfirmationPopup: function (message, yesButtonText, noButtonText) {
        $('#changeSectionAmountPopupText').html(message);
        $('#changeSectionAmountPopupBtnYes').val(yesButtonText);
        $('#changeSectionAmountPopupBtnNo').val(noButtonText);
        $('#changeSectionAmountPopupBtnYes').removeAttr('onclick');
        $('#changeSectionAmountPopupBtnNo').removeAttr('onclick');
        $('#changeSectionAmountPopupBtnYes').unbind('click');
        $('#changeSectionAmountPopupBtnNo').unbind('click');
    },
    OnSmartGFECleared: function (callBackFn, params, closeSection) {
        $('.modalBackgroundWhite').css('display', 'block');

        ManageFees.InitializeConfirmationPopup("iMP requires fees to be completed in Section 1100 and 1200. All fees will be reinstated.", "Continue", "Cancel");

        $('#changeSectionAmountPopupBtnYes').click(function () {
            $("#closingCostSection1100").html(originalClosingCostSection1100);
            $("#closingCostSection1200").html(originalClosingCostSection1200);
            $("#chbTurnOffSmartGFE").removeAttr("checked");
            $("#hdnSmartGFEEnabled").val("True");

            ManageFees.CloseSectionAmountPopup();

            if (typeof callBackFn === "function" || (typeof callBackFn === "object" && params == "click")) {
                ManageFees.SaveCosts(true);
                ManageFees.CloseSectionAndTriggerCallBackFunction(callBackFn, params);
            }
            else {
                if (closeSection != false)
                    closeSection = true;
                ManageFees.SaveCosts(closeSection);
            }
        });

        $('#changeSectionAmountPopupBtnNo').attr('onclick', 'ManageFees.CloseSectionAmountPopup()');

        $('#changeSectionAmountPopup').show();
    },
    OnCloseManageFeesSection: function (callBackFn, params) {
        if (ManageFees.IsSmartGFESectionEmpty()) {
            ManageFees.OnSmartGFECleared(callBackFn, params);
            return;
        }

        if (changedOccurred == true) {
            $('.modalBackgroundWhite').css('display', 'block');

            ManageFees.InitializeConfirmationPopup("You haven't saved all changes. Do you want the system to update for you?", "Yes", "No");

            if (typeof callBackFn === "function" || (typeof callBackFn === "object" && params == "click")) {
                $('#changeSectionAmountPopupBtnYes').click(function () {
                    ManageFees.CloseSectionAmountPopup();
                    ManageFees.SaveCosts(true);
                    ManageFees.CloseSectionAndTriggerCallBackFunction(callBackFn, params);
                });

                $('#changeSectionAmountPopupBtnNo').click(function () {
                    ManageFees.CloseSectionAmountPopup();
                    ManageFees.CloseSectionAndTriggerCallBackFunction(callBackFn, params);
                });
            }
            else {
                $('#changeSectionAmountPopupBtnYes').click(function () {
                    ManageFees.CloseSectionAmountPopup();
                    ManageFees.SaveCosts(true);
                });

                $('#changeSectionAmountPopupBtnNo').attr('onclick', 'ManageFees.CloseManageFeesSection()');
            }
            $('#changeSectionAmountPopup').show();

        }
        else {
            ManageFees.CloseSectionAndTriggerCallBackFunction(callBackFn, params);
        }
    },
    CloseSectionAndTriggerCallBackFunction: function (callBackFn, params) {
        ManageFees.CloseManageFeesSection();
        if (typeof callBackFn === "function")
            callBackFn.apply(null, params);
        else if (typeof callBackFn === "object" && params == "click")
            callBackFn.click();
    },
    CloseManageFeesSection: function () {
        $('#changeSectionAmountPopup').hide();
        if ($('.divProcessingPopup').css("display") != "block")
            $('.modalBackgroundWhite').css('display', '');
        $("#detailsSection").slideUp(400);
        $("#detailsSection").html("");
    },
    ManageFeesShowClosingCostsHistory: function () {
        var loanId = $('.tablelistselected').find('.loanid').text();
        $.ajax({
            type: "GET",
            url: 'ManageFees/ShowClosingCostsHistory',
            data: 'loanId=' + loanId,
            success: function (result) {
                $('#divClosingCostsHistoryPopup').show();
                $('#divClosingCostsHistoryPopup').html(result);
                $('.modalBackground').css('display', 'block');
            },
            error: function () {
            },
            complete: function () {
            }
        });

    },
    ManageFeesShowCostsHistory: function () {
        var loanId = $('.tablelistselected').find('.loanid').text();
        $.ajax({
            type: "GET",
            url: 'ManageFees/ShowCostHistoryPopup',
            data: 'loanId=' + loanId,
            success: function (result) {
                $('#divClosingCostsHistoryPopup').show();
                $('#divClosingCostsHistoryPopup').html(result);

                $('.modalBackground').css('display', 'block');
            },
            error: function () {
            },
            complete: function () {
            }
        });

    },
    ManageLockedCosts: function () {
        $('.locked').each(function () {
            var selectedAmountField = $(this);
            var numberOfRow = selectedAmountField.attr("id").substring(20);
            var closingCostSectionLeft = selectedAmountField.parent().parent();

            $('.closingCostSubtitleNumber').each(function () {
                if ($(this).text() === (numberOfRow + '.')) {
                    closingCostSectionLeft = $(this).parent();
                }
            });
            // Add lock icon
            if (closingCostSectionLeft.find('span') != undefined) {
                closingCostSectionLeft.find('span').each(function () {
                    if ($(this).hasClass('lockImageSection')) {
                        $(this).addClass('lockedManageFeesImage ');
                    }
                });
            }
        });
    },
    OpenClosingDatePopup: function (data, e) {
        if (showChangeClosingDatePopup) {
            $('.modalBackgroundWhite').css('display', 'block');
            $('#changeClosingDatePopup').show();
        }
    },
    SaveOldClosingDate: function (element) {
        showChangeClosingDatePopup = true;
        $(element).attr("oldValue", $(element).val());
    },
    CloseClosingDatePopup: function () {
        $("#txtFromDate901").val($("#txtFromDate901").attr("oldValue"));
        showChangeClosingDatePopup = false;
        $('#changeClosingDatePopup').hide();
        $('.modalBackgroundWhite').css('display', '');
    },
    UpdateClosingDate: function () {
        $('#changeClosingDatePopup').hide();

        // Update Closing Date
        var loanId = $('.tablelistselected').find('.loanid').text();
        var prospectId = $('.tablelistselected').find(".prospectid").first().text().trim();
        var closingDate = $("#txtFromDate901").val();

        $.ajax({
            type: "POST",
            url: 'ManageFees/UpdateCostClosingDate',
            data: 'loanId=' + loanId + "&closingDate=" + closingDate,
            success: function (data) {
                if (data.success == true) {
                    if (data.isClosingDateChanged == true) {
                        $("#closingCostHistoryImg").removeClass("closingCostHistoryImage");
                        $("#closingCostHistoryImg").addClass("closingCostHistoryImageGreen");
                    }
                    ManageFees.Update901s1002s1004s(data.group901, "901", true);
                    ManageFees.Update901s1002s1004s(data.group1002, "1002", false);
                    ManageFees.Update901s1002s1004s(data.group1004, "1004", false);
                }
                // Originally reloaded whole Manage Fees page     
                //             ManageFees.ManageFeesLoad(loanId, prospectId);
            },
            error: function () {
            },
            complete: function () {
                $('.modalBackgroundWhite').css('display', '');
            }
        });
    },
    Update901s1002s1004s: function (item, hudlineNumber, isAmountRight) {
        if (item != null) {
            if (isAmountRight) {
                $('#txtFromBorrowerFunds' + hudlineNumber).val(item.FromBorrowerFunds != 0 ? CurrencyFormatted(item.FromBorrowerFunds) : "");
                $('#txtInterestDays' + hudlineNumber).val(item.InterestDays != 0 ? item.InterestDays : "");
                $('#txtInterestRate' + hudlineNumber).val(item.InterestRate != 0 ? CurrencyFormatted(item.InterestRate) : "");
                $('#txtFromDate' + hudlineNumber).val(item.ClosingDate);
                $('#txtClosingDateTo' + hudlineNumber).val(item.ClosingDateTo);

            }
            else {
                $('#txtAmountPerMonth' + hudlineNumber).val(item.Amount != 0 && item.MonthsToBePaid != 0 ? CurrencyFormatted(parseFloat(item.Amount) / parseFloat(item.MonthsToBePaid)) != 0 ?
                CurrencyFormatted(parseFloat(item.Amount) / parseFloat(item.MonthsToBePaid)) : "" : "");
                $('#txtMonthsToBePaid' + hudlineNumber).val(item.MonthsToBePaid != 0 ? item.MonthsToBePaid : "");
                $('#txtAmount' + hudlineNumber).val(item.Amount != 0 ? CurrencyFormatted(item.Amount) : "");
            }

            $('#txtFromBorrowerFunds' + hudlineNumber).val(item.FromBorrowerFunds != 0 ? CurrencyFormatted(item.FromBorrowerFunds) : "");
            $('#txtPocAmount' + hudlineNumber).val(item.PocAmount != 0 ? CurrencyFormatted(item.PocAmount) : "");
        }

    }
    ,
    ClosePTCPopup: function () {
        $("#ptc-popup").hide();
        $('.modalBackgroundWhite').css('display', '');
    },
    BindManageFeesMinimize: function () {
        if ($("#managefeesminmax").hasClass('min')) {
            managefeescontentHeight = $("#managefeescontent").height();
            $("#managefeescontent").animate({
                height: "0px"
            },
                500,
                function () {
                    $("#managefeesminmax").removeClass('min');
                    $("#managefeesminmax").addClass('max');
                    $("#managefeescontent").removeClass('managefeescontent');
                    $("#managefeescontent").addClass('managefeescontent2');
                    $("#managefeeshead").removeClass('managefeeshead');
                    $("#managefeeshead").addClass('managefeeshead2');
                }
            );
        }
        else if ($("#managefeesminmax").hasClass('max')) {
            $("#managefeeshead").removeClass('managefeeshead2');
            $("#managefeescontent").removeClass('managefeescontent2');
            $("#managefeescontent").addClass('managefeescontent');
            $("#managefeeshead").addClass('managefeeshead');
            $("#managefeescontent").animate({
                height: managefeescontentHeight
            },
                500,
                function () {
                    $("#managefeesminmax").removeClass('max');
                    $("#managefeesminmax").addClass('min');
                }
            );
        }
    },
    Bind1100SectionEvents: function () {
        if ($("#chbTurnOffSmartGFE").length > 0) {
            if ($("#chbTurnOffSmartGFE").is(":checked") == false) {
                $("#closingCostSection1100,#closingCostSection1200").find("input[type!=checkbox],select").each(function () {
                    if ($(this).attr("type") != "checkbox")
                        $(this).attr("disabled", "disabled");
                });
                $("#divSmartGFECertificate").show();
                $("#closingCostSection1100,#closingCostSection1200").find(".overlayDiv-amountDisabled").removeClass("rightClickTotal");
            }
            else {
                $("#divSmartGFECertificate").hide();
                $("#closingCostSection1100,#closingCostSection1200").find(".overlayDiv-amountDisabled").addClass("rightClickTotal");
            }
        }

        $(".Calc1101TotalAmount").change(function () {
            ManageFees.UpdateBorrowerFunds1100();
        });
        $(".Calc1101SubHudlineGroupPocAmount").change(function () {
            ManageFees.CalcSectionTotal("PocAmount", false, "1101");
        });
        $(".Calc1101SubHudlineGroupSellerFunds").change(function () {
            ManageFees.CalcSectionTotal("SellerFunds", false, "1101");
        });
    },
    chbTurnOffSmartGFE_onclick: function () {
        if ($("#chbTurnOffSmartGFE").is(":checked") == true) {
            if (originalClosingCostSection1100 == "") {
                originalClosingCostSection1100 = $("#closingCostSection1100").html();
            }
            if (originalClosingCostSection1200 == "") {
                originalClosingCostSection1200 = $("#closingCostSection1200").html();
            }
            $('.modalBackgroundWhite').css('display', 'block');
            $('#turnOffSmartGFEPopup').show();
        }
        else {
            $("#hdnSmartGFEEnabled").val("True");

            if (originalClosingCostSection1100 == "" || originalClosingCostSection1200 == "") {
                ManageFees.RetrieveSmardtGfeData();

            }
            else {
                $("#closingCostSection1100").html(originalClosingCostSection1100);
                $("#closingCostSection1200").html(originalClosingCostSection1200);
                $("#chbTurnOffSmartGFE").removeAttr("checked");
                ManageFees.BindPtcPocPopupEvents();
                ManageFees.UpdateBorrowerFunds1100();
                ManageFees.Bind1100SectionEvents();
                ManageFees.Bind1200SectionEvents();
                ManageFees.BindLockFeeMenu();
                ManageFees.Calculate1201();
                ManageFees.Calculate1203();
            }


        }
        //        
    },
    IsSmartGFESectionEmpty: function () {
        var smartGFEDisabled = $("#hdnSmartGFEEnabled").val() == "False" && $("#hdnSmartGFEEnabledOriginalValue").val() == "True";

        if (!smartGFEDisabled)
            return false;

        var costsEntered = false;
        $("#closingCostSection1100,#closingCostSection1200").find(".Amount").each(function () {
            var amountValue = $(this).val();
            var fieldId = $(this).attr("id");
            if (amountValue != '' && parseFloat(amountValue.split(',').join('')) != 0 && fieldId != "txtAmount1105" && fieldId != "txtAmount1106") {
                costsEntered = true;
                return false;
            }
        });

        return !costsEntered;
    },
    ClearSmartGFEField: function (field, removeValue) {
        if (removeValue)
            field.val("");

        // Enable all fields except those that are disabled by default (totals)
        if (field.attr("previouslydisabled") != "True")
            field.removeAttr("disabled");
    },
    EnableSmartGFESections: function () {
        $("#hdnSmartGFEEnabled").val("False");
        $("#divSmartGFECertificate").hide();

        $("#closingCostSection1100").find("input,select").each(function () {
            var field = $(this);
            // Mark amount fields that had values yellow
            if (field.hasClass("CalculateFromBorrowerFunds") && field.val() != "")
                field.addClass("smartGFEAmountField1100");

            if (field.attr("id").indexOf("Provider") != -1)
                ManageFees.ClearSmartGFEField(field, true);
            else
                ManageFees.ClearSmartGFEField(field);
        });

        $("#closingCostSection1200").find("input,select").each(function () {
            var field = $(this);
            // Mark amount fields that had values yellow
            if (field.attr("id") == "txtAmount1202" && field.val() != "") {
                $("#txtDeed1202").addClass("smartGFEAmountField1200");
                $("#txtMortgage1202").addClass("smartGFEAmountField1200");
                $("#txtRelease1202").addClass("smartGFEAmountField1200");
            }
            if (field.attr("id") == "txtAmount1204" && field.val() != "") {
                $("#txtDeed1204").addClass("smartGFEAmountField1200");
                $("#txtMortgage1204").addClass("smartGFEAmountField1200");
            }
            if (field.attr("id") == "txtAmount1205" && field.val() != "") {
                $("#txtDeed1205").addClass("smartGFEAmountField1200");
                $("#txtMortgage1205").addClass("smartGFEAmountField1200");
            }

            if (field.hasClass("CalculateFromBorrowerFunds") && field.val() != "" && field.attr("id") != "txtAmount1202" && field.attr("id") != "txtAmount1204" && field.attr("id") != "txtAmount1205")
                field.addClass("smartGFEAmountField1200");

            if (field.attr("id").indexOf("Provider") != -1)
                ManageFees.ClearSmartGFEField(field, true);
            else
                ManageFees.ClearSmartGFEField(field);
        });

        $(".smartGFEAmountField1100").remove("blur");
        $(".smartGFEAmountField1100").blur(function () {
            var field = $(this);
            if (field.val() != "") {
                field.removeClass("smartGFEAmountField1100");
                ManageFees.LockFee(field);
            }
        });

        $(".smartGFEAmountField1200").remove("blur");
        $(".smartGFEAmountField1200").blur(function () {
            var field = $(this);
            if (field.val() != "") {
                field.removeClass("smartGFEAmountField1200");
            }
        });

        ManageFees.UpdateBorrowerFunds1100();
        ManageFees.Bind1100SectionEvents();
        ManageFees.Bind1200SectionEvents();
        ManageFees.BindLockFeeMenu();

        $('#turnOffSmartGFEPopup').hide();
        $('.modalBackgroundWhite').css('display', '');
    },
    CloseSmartGFEPopup: function () {
        $("#chbTurnOffSmartGFE").removeAttr("checked");
        $('#turnOffSmartGFEPopup').hide();
        $('.modalBackgroundWhite').css('display', '');
    },
    Bind1000SectionEvents: function () {
        $(".MonthsToBePaidOperation").change(function () {
            var value = parseFloat($(this).val());
            var hudlineNumber = $(this).attr('hudlinenumber');

            if (!isNaN(value)) {
                var amountPerMonthValue = parseFloat($("#txtAmountPerMonth" + hudlineNumber).val());
                if (!isNaN(amountPerMonthValue)) {
                    $("#txtAmount" + hudlineNumber).val((amountPerMonthValue * value).toFixed(2)).change();
                    $('#txtAmount' + hudlineNumber).blur();
                    $(this).blur();
                }
            }

        });

        $(".AmountPerMonthOperation").change(function () {
            var value = parseFloat($(this).val());
            var hudlineNumber = $(this).attr('hudlinenumber');

            if (!isNaN(value)) {
                var monthsToBePaidValue = parseFloat($("#txtMonthsToBePaid" + hudlineNumber).val());
                if (!isNaN(monthsToBePaidValue)) {
                    $("#txtAmount" + hudlineNumber).val((monthsToBePaidValue * value).toFixed(2)).change();
                    $('#txtAmount' + hudlineNumber).blur();
                    $(this).blur();
                }
            }

        });

        $(".TotalAmountOperation").change(function () {
            var value = parseFloat($(this).val());
            var hudlineNumber = $(this).attr('hudlinenumber');

            if (!isNaN(value)) {
                var monthsToBePaidValue = parseFloat($("#txtMonthsToBePaid" + hudlineNumber).val());
                if (!isNaN(monthsToBePaidValue)) {
                    $("#txtAmountPerMonth" + hudlineNumber).val((value / monthsToBePaidValue).toFixed(2));
                    $("#txtAmountPerMonth" + hudlineNumber).blur();
                    $(this).blur();
                }
            }
            $('.modalBackgroundWhite').css('display', 'block');

            ManageFees.InitializeConfirmationPopup("Items entered in lines 1002-1006 do no equal line 1001. Do you want the system to update for you?", "Yes", "No");
            $('#changeSectionAmountPopupBtnYes').attr('onclick', 'ManageFees.UpdateBorrowerFunds()');
            $('#changeSectionAmountPopupBtnNo').attr('onclick', 'ManageFees.CloseSectionAmountPopup()');
            $('#changeSectionAmountPopup').show();

        });
    },
    Bind1200SectionEvents: function () {
        $("#txtAmount1202").change(function () {
            if ($(this).is(":disabled") == false) {
                // Clear sub amounts
                $("#txtDeed1202").val('');
                $("#txtMortgage1202").val('');
                $("#txtRelease1202").val('');
            }
            ManageFees.Calculate1201();
        });

        $("#txtFromBorrowerFunds1207,#txtFromBorrowerFunds1208").change(function () {
            ManageFees.Calculate1201();
        });

        $("#txtAmount1204").change(function () {
            if ($(this).is(":disabled") == false) {
                // Clear sub amounts
                $("#txtDeed1204").val('');
                $("#txtMortgage1204").val('');
            }
            ManageFees.Calculate1203();
        });

        $("#txtAmount1205").change(function () {
            if ($(this).is(":disabled") == false) {
                // Clear sub amounts
                $("#txtDeed1205").val('');
                $("#txtMortgage1205").val('');
            }
            ManageFees.Calculate1203();
        });
    },
    Bind1300SectionEvents: function () {
        $(".Calc1301TotalAmount").change(function () {
            ManageFees.Calculate1301();
        });
    },
    UpdateBorrowerFunds: function () {
        var resultAmount = 0;
        var value;
        for (i = 2; i < 7; i++) {
            value = $("#txtAmount100" + i).val();
            if (value != null)
                value = value.split(',').join('');

            if (!isNaN(value)) {
                var cleanvalue = parseFloat(value);

                if (!isNaN(cleanvalue))
                    resultAmount = resultAmount + cleanvalue;
            }
        }
        resultAmount = resultAmount.toFixed(2);
        var resultFormatted = CurrencyFormatted(resultAmount);
        if (resultAmount > 0)
            $('#txtFromBorrowerFunds1001').val(resultFormatted);
        else
            $('#txtFromBorrowerFunds1001').val("");

        $('#changeSectionAmountPopup').hide();
        $('.modalBackgroundWhite').css('display', '');
    },
    UpdateBorrowerFunds1100: function () {
        var resultAmount = 0;

        $(".Calc1101TotalAmount").each(function () {
            var amount = $(this).val();
            amount = amount.split(',').join('');
            if (!isNaN(amount) && !isNaN(parseFloat(amount)))
                resultAmount += parseFloat(amount);
        });

        resultAmount = resultAmount.toFixed(2);
        var resultFormatted = CurrencyFormatted(resultAmount);

        $('#txtFromBorrowerFunds1101').val(resultFormatted);
    },
    CloseSectionAmountPopup: function () {
        $('#changeSectionAmountPopup').hide();
        $('.modalBackgroundWhite').css('display', '');
    },
    BindTotalAmountActions: function () {
        ManageFees.CalculateFunds("", true);

        $(".CalculateFromBorrowerFunds").change(function () {
            ManageFees.CalculateFunds("BorrowerFunds", false);

            // Bind logic for 901 cost
            if ($(this).attr("id") == "txtFromBorrowerFunds901")
                ManageFees.CalculateInterestRate901();
        });

        $(".CalculateFromSellersFunds").change(function () {
            ManageFees.CalculateFunds("SellersFunds", false);
        });

        $(".CalculateFromPocAmount").change(function () {
            ManageFees.CalculateFunds("PocAmount", false);
        });
    },
    CalculateFunds: function (source, isLoad) {
        var sum = 0;
        var value;
        var sumFormatted;
        var totalFinanaceChargesSumFormatted;
        var totalFinanaceChargesSum = 0;

        if (source == "BorrowerFunds" || isLoad == true) {
            sum = 0;
            $('.CalculateFromBorrowerFunds').each(function () {

                value = this.value;
                value = value.split(',').join('');

                if (!isNaN(value) || value != "") {
                    var parsedValue = parseFloat(value);

                    if (!isNaN(parsedValue))
                        sum = sum + parseFloat(parsedValue);

                    if (!isNaN(parsedValue) && $(this).hasClass("blue"))
                        totalFinanaceChargesSum = totalFinanaceChargesSum + parseFloat(parsedValue);
                }
            });

            if (sum != 0) {
                sumFormatted = CurrencyFormatted(sum);
                $("#FromBorrowerFundsTotal").val(sumFormatted);
            }
            else
                $("#FromBorrowerFundsTotal").val("");

            totalFinanaceChargesSumFormatted = CurrencyFormatted(totalFinanaceChargesSum);
            $("#txtTotalFinanceCharges").val(totalFinanaceChargesSumFormatted);
        }

        if (source == "SellersFunds" || isLoad == true) {
            sum = 0;
            $('.CalculateFromSellersFunds').each(function () {

                value = this.value;
                value = value.split(',').join('');

                if (!isNaN(value) || value != "") {
                    var parsedValue = parseFloat(value);

                    if (!isNaN(parsedValue))
                        sum = sum + parseFloat(parsedValue);
                }
            });

            if (sum != 0) {
                sumFormatted = CurrencyFormatted(sum);
                $("#FromSellersFundsTotal").val(sumFormatted);
            }
            else
                $("#FromSellersFundsTotal").val("");
        }

        if (source == "PocAmount" || isLoad == true) {
            sum = 0;
            $('.CalculateFromPocAmount').each(function () {

                value = this.value;
                value = value.split(',').join('');

                if (!isNaN(value) || value != "") {
                    var parsedValue = parseFloat(value);

                    if (!isNaN(parsedValue))
                        sum = sum + parseFloat(parsedValue);
                }
            });

            if (sum != 0) {
                sumFormatted = CurrencyFormatted(sum);
                $("#FromPocAmountTotal").val(sumFormatted);
            }
            else
                $("#FromPocAmountTotal").val("");
        }
    },
    GetRowNumber: function (selectedAmountField) {
        var numberOfRow;
        if (selectedAmountField.attr("id").substring(20) != undefined && selectedAmountField.attr("id").substring(20) != '') {
            numberOfRow = selectedAmountField.attr("id").substring(20);
        }
        else {
            numberOfRow = selectedAmountField.attr("id").substring(9);
        }

        return numberOfRow;
    },
    SelectLeftSection: function (selectedAmountField, numberOfRow) {
        var closingCostSectionLeft = selectedAmountField.parent().parent();

        $('.closingCostSubtitleNumber').each(function () {
            if ($(this).text() === (numberOfRow + '.')) {
                closingCostSectionLeft = $(this).parent();
            }
        });

        return closingCostSectionLeft;
    },
    LockFee: function (selectedAmountField, closingCostSectionLeft, numberOfRow) {
        if (numberOfRow == undefined)
            numberOfRow = ManageFees.GetRowNumber(selectedAmountField);
        if (closingCostSectionLeft == undefined)
            closingCostSectionLeft = ManageFees.SelectLeftSection(selectedAmountField, numberOfRow);

        selectedAmountField.addClass('locked');

        $("#lockHidden" + numberOfRow).val("True");

        if (closingCostSectionLeft.find('span') != undefined) {
            closingCostSectionLeft.find('span').each(function () {
                if ($(this).hasClass('lockImageSection')) {
                    $(this).addClass('lockedManageFeesImage ');
                }
            });
        }
    },
    UnlockFee: function (selectedAmountField, closingCostSectionLeft, numberOfRow) {
        if (numberOfRow == undefined)
            numberOfRow = ManageFees.GetRowNumber(selectedAmountField);
        if (closingCostSectionLeft == undefined)
            closingCostSectionLeft = ManageFees.SelectLeftSection(selectedAmountField, numberOfRow);

        selectedAmountField.removeClass('locked');

        $("#lockHidden" + numberOfRow).val("False");

        closingCostSectionLeft.find('span').each(function () {
            if ($(this).hasClass('lockImageSection')) {
                $(this).removeClass('lockedManageFeesImage ');
            }
        });
    },
    RightClick: function (action, el, pos) {

        changedOccurred = true;

        var objLink = $('a[href="#' + action + '"]', '.rightClickMenuItem');
        var selectedAmountField = $(el);
        if (selectedAmountField.is("div"))
            selectedAmountField = selectedAmountField.next();

        var numberOfRow = ManageFees.GetRowNumber(selectedAmountField);
        var closingCostSectionLeft = ManageFees.SelectLeftSection(selectedAmountField, numberOfRow);
        var closingCostSectionLeftClass = closingCostSectionLeft.attr("class");

        switch (action) {
            case "lockfee":
                ManageFees.LockFee(selectedAmountField, closingCostSectionLeft, numberOfRow);
                break;

            case "unlockfee":
                ManageFees.UnlockFee(selectedAmountField, closingCostSectionLeft);
                break;

            case "lockfeeall":
                selectedAmountField.addClass('locked');

                switch (selectedAmountField.attr("id")) {
                    case "txtAmount801":
                    case "txtFromBorrowerFunds803":
                        $(".Calc801SubHudlineGroupAmount").each(function () {
                            ManageFees.LockFee($(this));
                        });

                        if (selectedAmountField.attr("id") == "txtFromBorrowerFunds803") {
                            ManageFees.LockFee($("#txtAmount802"));
                        }
                        break;
                    case "txtFromBorrowerFunds1101":
                        $(".Calc1101TotalAmount").each(function () {
                            ManageFees.LockFee($(this));
                        });
                        break;
                    case "txtFromBorrowerFunds1201":
                        ManageFees.LockFee($("#txtAmount1202"));
                        ManageFees.LockFee($("#txtFromBorrowerFunds1207"));
                        ManageFees.LockFee($("#txtFromBorrowerFunds1208"));
                        break;
                    case "txtFromBorrowerFunds1203":
                        ManageFees.LockFee($("#txtAmount1204"));
                        ManageFees.LockFee($("#txtAmount1205"));
                        break;
                    case "txtFromBorrowerFunds1301":
                        $(".Calc1301TotalAmount ").each(function () {
                            ManageFees.LockFee($(this));
                        });
                        break;
                    default:
                        $("." + closingCostSectionLeftClass).find('span').each(function () {
                            if ($(this).hasClass('lockImageSection')) {
                                $(this).addClass('lockedManageFeesImage ');
                            }
                        });

                        $("." + closingCostSectionLeftClass).find('.rightClick ').each(function () {
                            $(this).addClass('locked');
                        });

                        $("." + closingCostSectionLeftClass).find('.closingCostSubtitleNumber').each(function () {
                            var closingCostSubtitleNumber = $(this).text().replace(".", "");
                            $("#lockHidden" + closingCostSubtitleNumber).val("True");
                        });

                        break;
                }

                break;

            case "unlockfeeall":
                selectedAmountField.removeClass('locked');

                switch (selectedAmountField.attr("id")) {
                    case "txtAmount801":
                    case "txtFromBorrowerFunds803":
                        $(".Calc801SubHudlineGroupAmount").each(function () {
                            ManageFees.UnlockFee($(this));
                        });

                        if (selectedAmountField.attr("id") == "txtFromBorrowerFunds803") {
                            ManageFees.UnlockFee($("#txtAmount802"));
                        }
                        break;
                    case "txtFromBorrowerFunds1101":
                        $(".Calc1101TotalAmount").each(function () {
                            ManageFees.UnlockFee($(this));
                        });
                        break;
                    case "txtFromBorrowerFunds1201":
                        ManageFees.UnlockFee($("#txtAmount1202"));
                        ManageFees.UnlockFee($("#txtFromBorrowerFunds1207"));
                        ManageFees.UnlockFee($("#txtFromBorrowerFunds1208"));
                        break;
                    case "txtFromBorrowerFunds1203":
                        ManageFees.UnlockFee($("#txtAmount1204"));
                        ManageFees.UnlockFee($("#txtAmount1205"));
                        break;
                    case "txtFromBorrowerFunds1301":
                        $(".Calc1301TotalAmount ").each(function () {
                            ManageFees.UnlockFee($(this));
                        });
                        break;
                    default:
                        $("." + closingCostSectionLeftClass).find('span').each(function () {
                            if ($(this).hasClass('lockImageSection')) {
                                $(this).removeClass('lockedManageFeesImage ');
                            }
                        });

                        $("." + closingCostSectionLeftClass).find('.rightClick ').each(function () {
                            $(this).removeClass('locked');
                        });

                        $("." + closingCostSectionLeftClass).find('.closingCostSubtitleNumber').each(function () {
                            var closingCostSubtitleNumber = $(this).text().replace(".", "");
                            $("#lockHidden" + closingCostSubtitleNumber).val("False");
                        });

                        break;
                }

                break;

            default:
                break;
        }

    },
    SaveCosts: function (closeSection) {
        if (ManageFees.IsSmartGFESectionEmpty()) {
            ManageFees.OnSmartGFECleared(null, null, closeSection);
            return;
        }

        ShowProcessingInfoManageFee();

        var form = $("#frmSaveCosts");
        var urlAction = form.attr("action");

        var data = form.serialize();

        // Add disabled dropdowns to serialized form data
        $('select[disabled]').each(function () {
            data = data + '&' + $(this).attr('name') + '=' + $(this).val();
        });

        $('#smartGFESections :input[disabled]').each(function () {
            if ($(this).attr('id') != 'txtFromBorrowerFunds1101' && $(this).attr('id') != 'txtFromSellersFunds1101' && $(this).attr('id') != 'txtPocAmount1101'
            && $(this).attr('id') != 'txtFromBorrowerFunds1203' && $(this).attr('id') != 'txtFromBorrowerFunds1201'
            && $(this).attr('id') != 'txtFromSellersFunds1201' && $(this).attr('id') != 'txtFromSellersFunds1203'
            && $(this).attr('id') != 'txtPocAmount1201' && $(this).attr('id') != 'txtPocAmount1203') {
                data = data + '&' + $(this).attr('name') + '=' + $(this).val();
            }
        });



        $.ajax({
            url: urlAction,
            data: data,
            type: 'POST',
            success: function (data) {
                if (closeSection != true) {
                    $('#detailsSection').html(data);
                    ManageFees.ManageFeesSuccess();
                }
                else {
                    ManageFees.CloseManageFeesSection();
                }
            },
            complete: function (e) {
                HideProcessingInfoManageFee();
            }
        });
    },
    Bind801SectionEvents: function () {

        $(".Calc801SubHudlineGroupAmount").change(function () {
            $('.modalBackgroundWhite').css('display', 'block');

            ManageFees.InitializeConfirmationPopup("Items entered in lines 801a-j do no equal line 801. Do you want the system to update for you?", "Yes", "No");
            $('#changeSectionAmountPopupBtnYes').attr('onclick', "ManageFees.ChangeSectionAmountPopup801YesBtnEvents()");
            $('#changeSectionAmountPopupBtnNo').attr('onclick', 'ManageFees.CloseSectionAmountPopup()');
            $('#changeSectionAmountPopup').show();
        });

        $(".Calc801SubHudlineGroupSellerFunds").change(function () {
            ManageFees.CalcSectionTotal("SellerFunds", false, "801");
            ManageFees.Calc803Total("txtFromSellersFunds801", "txtFromSellersFunds802", "txtFromSellersFunds803");
        });

        $(".Calc801SubHudlineGroupPocAmount").change(function () {
            ManageFees.CalcSectionTotal("PocAmount", false, "801");
            ManageFees.Calc803Total("txtPocAmount801", "txtPocAmount802", "txtPocAmount803");
        });

        $("#txtAmount802").change(function () {

            ManageFees.Calc803Total("txtAmount801", "txtAmount802", "txtFromBorrowerFunds803");
        });

        $("#txtFromSellersFunds802").change(function () {

            ManageFees.Calc803Total("txtFromSellersFunds801", "txtFromSellersFunds802", "txtFromSellersFunds803");
        });

        $("#txtPocAmount802").change(function () {

            ManageFees.Calc803Total("txtPocAmount801", "txtPocAmount802", "txtPocAmount803");
        });
    },
    ChangeSectionAmountPopup801YesBtnEvents: function () {
        ManageFees.CalcSectionTotal('Amount', false, '801');
        ManageFees.Calc803Total('txtAmount801', 'txtAmount802', 'txtFromBorrowerFunds803');
        ManageFees.CloseSectionAmountPopup();
    },
    CalcSectionTotal: function (source, isLoad, section) {
        var sum = 0;
        var value;
        var sectionClass;
        var amountTotalField;
        var sumFormatted;
        if (source == "Amount" || isLoad == true) {
            sum = 0;
            sectionClass = ['.Calc', section, 'SubHudlineGroupAmount'].join('');
            $(sectionClass).each(function () {
                value = this.value;
                value = value.split(',').join('');

                if (!isNaN(value) || value != "") {
                    var parsedValue = parseFloat(value);

                    if (!isNaN(parsedValue))
                        sum = sum + parseFloat(parsedValue);
                }
            });

            amountTotalField = ['#txtAmount', section].join('');
            if (sum != 0) {
                sumFormatted = CurrencyFormatted(sum);
                $(amountTotalField).val(sumFormatted);
            }
            else
                $(amountTotalField).val("");
        }

        if (source == "SellerFunds" || isLoad == true) {
            sum = 0;
            sectionClass = ['.Calc', section, 'SubHudlineGroupSellerFunds'].join('');
            $(sectionClass).each(function () {
                value = this.value;
                value = value.split(',').join('');

                if (!isNaN(value) || value != "") {
                    var parsedValue = parseFloat(value);

                    if (!isNaN(parsedValue))
                        sum = sum + parseFloat(parsedValue);
                }
            });

            amountTotalField = ['#txtFromSellersFunds', section].join('');
            if (sum != 0) {
                sumFormatted = CurrencyFormatted(sum);
                $(amountTotalField).val(sumFormatted);
            }
            else
                $(amountTotalField).val("");
        }

        if (source == "PocAmount" || isLoad == true) {
            sum = 0;
            sectionClass = ['.Calc', section, 'SubHudlineGroupPocAmount'].join('');
            $(sectionClass).each(function () {
                value = this.value;
                value = value.split(',').join('');

                if (!isNaN(value) || value != "") {
                    var parsedValue = parseFloat(value);

                    if (!isNaN(parsedValue))
                        sum = sum + parseFloat(parsedValue);
                }
            });

            amountTotalField = ['#txtPocAmount', section].join('');
            if (sum != 0) {
                sumFormatted = CurrencyFormatted(sum);
                $(amountTotalField).val(sumFormatted);
            }
            else
                $(amountTotalField).val("");
        }

    },
    Calc803Total: function (el801, el802, resultField) {
        var sum = 0;
        var sumFormatted;

        var value801 = parseFloat($("#" + el801).val().split(',').join(''));
        var value802 = parseFloat($("#" + el802).val().split(',').join(''));

        if (!isNaN(value801))
            sum = sum + value801;

        if (!isNaN(value802))
            sum = sum + value802;

        sumFormatted = CurrencyFormatted(sum);
        if (sum != 0)
            $("#" + resultField).val(sumFormatted);
        else
            $("#" + resultField).val("");

    },
    LoadCalc803Total: function () {
        ManageFees.Calc803Total("txtAmount801", "txtAmount802", "txtFromBorrowerFunds803");
        ManageFees.Calc803Total("txtFromSellersFunds801", "txtFromSellersFunds802", "txtFromSellersFunds803");
        ManageFees.Calc803Total("txtPocAmount801", "txtPocAmount802", "txtPocAmount803");
    },

    BindPtcPocPopupEvents: function () {

        $(".ptcPopup").dblclick(function () {
            $('.modalBackgroundWhite').css('display', 'block');
            $("#ptcAmount").val("");
            $("#pocAmount").val("");

            var hudlineNumber = $(this).attr('hudlinenumber');
            $("#ptcPocPopupHudlineNumber").val(hudlineNumber);

            var pocAmountValue = parseFloat($("#txtPocAmount" + hudlineNumber).val().split(',').join(''));
            var fundsValue = 0;

            $("#pocAmount").val($("#txtPocAmount" + hudlineNumber).val());
            $("#pocPaidBy").val($("#paidBy" + hudlineNumber + " :selected").text());
            $("#pocPaidTo").val($("#paidTo" + hudlineNumber + " :selected").text());

            $("#isPOC").prop('checked', false);
            if (!isNaN(pocAmountValue) && pocAmountValue > 0)
                $("#isPOC").prop('checked', true);

            $("#ptcIsAprCost").prop('checked', false);
            if ($(this).hasClass("blue"))
                $("#ptcIsAprCost").prop('checked', true);

            $("#ptcAmount").val();
            $("#ptcPaidBy").val();
            $("#ptcPaidTo").val();
            $("#isPTC").val();

            if ($("#txtFromBorrowerFunds" + hudlineNumber).length > 0) {
                fundsValue = parseFloat($("#txtFromBorrowerFunds" + hudlineNumber).val().split(',').join(''));
                ManageFees.CalculatePtcPocAmount(fundsValue, pocAmountValue);

                $("#ptc-popup-TotalAmount").val($("#txtFromBorrowerFunds" + hudlineNumber).val());
            }
            else if ($("#txtAmount" + hudlineNumber).length > 0) {
                fundsValue = parseFloat($("#txtAmount" + hudlineNumber).val().split(',').join(''));
                ManageFees.CalculatePtcPocAmount(fundsValue, pocAmountValue);

                $("#ptc-popup-TotalAmount").val($("#txtAmount" + hudlineNumber).val());
            }

            $('#ptc-popup').show();
        });

        $("#pocAmount").change(function () {

            ManageFees.CalculatePtcPocAmountLogic("POC");
        });

        $("#ptcAmount").change(function () {

            ManageFees.CalculatePtcPocAmountLogic("PTC");
        });

        $("#ptc-popup-FromBorrowerFunds").change(function () {
            ManageFees.CalculatePtcPocAmountLogic("");
        });
    },

    CalculatePtcPocAmountLogic: function (source) {

        var hudlineNumber = $("#ptcPocPopupHudlineNumber").val();
        var pocAmountValue = parseFloat($("#pocAmount").val().split(',').join(''));
        var ptcAmountValue = parseFloat($("#ptcAmount").val().split(',').join(''));
        var fundsValue = 0;
        var fundsValueNonParsed = "0";
        if ($("#txtFromBorrowerFunds" + hudlineNumber).length > 0) {
            fundsValueNonParsed = $("#txtFromBorrowerFunds" + hudlineNumber).val().split(',').join('');
        }
        else if ($("#txtAmount" + hudlineNumber).length > 0) {
            fundsValueNonParsed = $("#txtAmount" + hudlineNumber).val().split(',').join('');
        }

        if (!isNaN(fundsValueNonParsed) && fundsValueNonParsed != 0 && fundsValueNonParsed != "")
            fundsValue = parseFloat(fundsValueNonParsed);

        var ptcPoc = 0;

        if (!isNaN(ptcAmountValue) && source == "PTC") {

            if (!isNaN(pocAmountValue) && pocAmountValue > 0) {
                ptcPoc = ptcAmountValue + pocAmountValue;

                if (pocAmountValue >= fundsValue) {
                    $("#ptcAmount").val(CurrencyFormatted(0));
                    ManageFees.CalculatePtcPocAmount(fundsValue, fundsValue);
                    ManageFees.IsPtcPocChecked(0, pocAmountValue);
                }
                else if (ptcPoc > fundsValue) {
                    ptcPoc = fundsValue - pocAmountValue;
                    $("#ptcAmount").val(CurrencyFormatted(ptcPoc));
                    ManageFees.CalculatePtcPocAmount(fundsValue, fundsValue);
                    ManageFees.IsPtcPocChecked(ptcPoc, pocAmountValue);
                }
                else {
                    $("#ptcAmount").val(CurrencyFormatted(ptcAmountValue));
                    ManageFees.CalculatePtcPocAmount(fundsValue, ptcPoc);
                    ManageFees.IsPtcPocChecked(ptcAmountValue, pocAmountValue);
                }

            }
            else {
                if (ptcAmountValue >= fundsValue) {
                    $("#ptcAmount").val(CurrencyFormatted(fundsValue));
                    ManageFees.CalculatePtcPocAmount(fundsValue, fundsValue);
                    ManageFees.IsPtcPocChecked(fundsValue, 0);
                }
                else {
                    $("#ptcAmount").val(CurrencyFormatted(ptcAmountValue));
                    ManageFees.CalculatePtcPocAmount(fundsValue, ptcAmountValue);
                    ManageFees.IsPtcPocChecked(ptcAmountValue, 0);
                }
            }
        }

        else if (!isNaN(pocAmountValue) && source == "POC") {

            if (!isNaN(ptcAmountValue) && ptcAmountValue > 0) {
                ptcPoc = ptcAmountValue + pocAmountValue;

                if (ptcAmountValue >= fundsValue) {
                    $("#pocAmount").val(CurrencyFormatted(0));
                    ManageFees.CalculatePtcPocAmount(fundsValue, fundsValue);
                    ManageFees.IsPtcPocChecked(ptcAmountValue, 0);
                }
                else if (ptcPoc > fundsValue) {
                    ptcPoc = fundsValue - ptcAmountValue;
                    $("#pocAmount").val(CurrencyFormatted(ptcPoc));
                    ManageFees.CalculatePtcPocAmount(fundsValue, fundsValue);
                    ManageFees.IsPtcPocChecked(ptcAmountValue, ptcPoc);
                }
                else {
                    $("#pocAmount").val(CurrencyFormatted(pocAmountValue));
                    ManageFees.CalculatePtcPocAmount(fundsValue, ptcPoc);
                    ManageFees.IsPtcPocChecked(ptcAmountValue, pocAmountValue);
                }

            }
            else {
                if (pocAmountValue > fundsValue) {
                    $("#pocAmount").val(CurrencyFormatted(fundsValue));
                    ManageFees.CalculatePtcPocAmount(fundsValue, fundsValue);
                    ManageFees.IsPtcPocChecked(0, fundsValue);
                }
                else {
                    $("#pocAmount").val(CurrencyFormatted(pocAmountValue));
                    ManageFees.CalculatePtcPocAmount(fundsValue, pocAmountValue);
                    ManageFees.IsPtcPocChecked(0, pocAmountValue);
                }
            }
        }
        else {
            $("#ptc-popup-FromBorrowerFunds").val(CurrencyFormatted(fundsValue));
        }
    },
    IsPtcPocChecked: function (ptc, poc) {
        if (!isNaN(poc) && (poc > 0 || poc < 0)) {
            $("#isPOC").prop('checked', true);
        }
        else {
            $("#isPOC").prop('checked', false);
        }

        if (!isNaN(ptc) && (ptc > 0 || ptc < 0)) {
            $("#isPTC").prop('checked', true);
        }
        else {
            $("#isPTC").prop('checked', false);
        }
    },

    CalculatePtcPocAmount: function (fundsValue, amountValue) {
        var result = 0;
        if (!isNaN(fundsValue))
            result = fundsValue;

        if (!isNaN(amountValue) && (amountValue > 0 || amountValue < 0)) {
            result = result - amountValue;
        }

        $("#ptc-popup-FromBorrowerFunds").val(CurrencyFormatted(result));
    },

    SavePtcPocPopupAction: function () {
        var hudlineNumber = $("#ptcPocPopupHudlineNumber").val();

        $("#paidBy" + hudlineNumber).val($("#pocPaidBy :selected").text());
        $("#paidTo" + hudlineNumber).val($("#pocPaidTo :selected").text());

        if ($("#ptcIsAprCost").prop('checked') == true) {
            $("#txtPocAmount" + hudlineNumber).addClass("blue");

            $("#txtFromBorrowerFunds" + hudlineNumber).addClass("blue").change();
            $("#txtAmount" + hudlineNumber).addClass("blue");
            if (hudlineNumber == "901")
                $("#txtInterestRate901").addClass("blue");

            $("#aprHidden" + hudlineNumber).val("True");
        }
        else {
            $("#txtPocAmount" + hudlineNumber).removeClass("blue");

            $("#txtFromBorrowerFunds" + hudlineNumber).removeClass("blue").change();
            $("#txtAmount" + hudlineNumber).removeClass("blue");

            if (hudlineNumber == "901")
                $("#txtInterestRate901").removeClass("blue");

            $("#aprHidden" + hudlineNumber).val("False");
        }
        $("#txtPocAmount" + hudlineNumber).val($("#pocAmount").val());
        ManageFees.ClosePTCPopup();
    },
    Bind700SectionEvents: function () {
        $("#txtAmount701").change(function () {
            ManageFees.Calculate703();
        });
        $("#txtAmount702").change(function () {
            ManageFees.Calculate703();
        });
    },
    Bind900SectionEvents: function () {
        $("#txtInterestDays901").change(function () {
            if ($(this).val() == "" || parseFloat($(this).val().split(',').join('')) == 0) {
                var interestRate = parseFloat($("#txtInterestRate901").val().split(',').join(''));
                var total = parseFloat($("#txtFromBorrowerFunds901").val().split(',').join(''));
                var days = total / interestRate;
                $(this).val(days);
            }
            ManageFees.CalculateInterestRate901();
        });
    },
    CalculateInterestRate901: function () {
        var interestDays = parseFloat($("#txtInterestDays901").val().split(',').join(''));
        var total = parseFloat($("#txtFromBorrowerFunds901").val().split(',').join(''));

        if (isNaN(interestDays) || isNaN(total))
            return;

        var average = total / interestDays;

        $("#txtInterestRate901").val(CurrencyFormatted(average));
    },

    CalculateIntangibleFax: function(){
        ManageFees.Calculate1201();
        ManageFees.Calculate1203();
    },
    Calculate1201: function () {
        //	Sum of all Items on GFE #7 = read only total in Borrower column – Total GFE #7 (1201)
        var txtAmount1202 = parseFloat($("#txtAmount1202").val().split(',').join(''));
        var txtAmount1206 = parseFloat($("#txtAmount1206").val().split(',').join(''));
        var txtAmount1207 = parseFloat($("#txtAmount1207").val().split(',').join(''));
        var txtAmount1208 = parseFloat($("#txtAmount1208").val().split(',').join(''));
        var txtAmount1209 = parseFloat($("#txtAmount1209").val().split(',').join(''));
        var txtAmount1210 = parseFloat($("#txtAmount1210").val().split(',').join(''));

        var include1206 = $("#txtName1206").val().indexOf('1201') > 0;
        var include1207 = $("#txtName1207").val().indexOf('1201') > 0;
        var include1208 = $("#txtName1208").val().indexOf('1201') > 0;
        var include1209 = $("#txtName1209").val().indexOf('1201') > 0;
        var include1210 = $("#txtName1210").val().indexOf('1201') > 0;


        var total = 0;
        if (!isNaN(txtAmount1202))
            total += txtAmount1202;

        if (!isNaN(txtAmount1206) && include1206)
            total += txtAmount1206;

        if (!isNaN(txtAmount1207) && include1207)
            total += txtAmount1207;

        if (!isNaN(txtAmount1208) && include1208)
            total += txtAmount1208;

        if (!isNaN(txtAmount1209) && include1209)
            total += txtAmount1209;

        if (!isNaN(txtAmount1210) && include1210)
            total += txtAmount1210;

        $("#txtFromBorrowerFunds1201").val(CurrencyFormatted(total));
    },
    Calculate1202: function () {
        var txtDeed1202 = parseFloat($("#txtDeed1202").val().split(',').join(''));
        var txtMortgage1202 = parseFloat($("#txtMortgage1202").val().split(',').join(''));
        var txtRelease1202 = parseFloat($("#txtRelease1202").val().split(',').join(''));

        var total = 0;
        if (!isNaN(txtDeed1202))
            total += txtDeed1202;

        if (!isNaN(txtMortgage1202))
            total += txtMortgage1202;

        if (!isNaN(txtRelease1202))
            total += txtRelease1202;

        $("#txtAmount1202").val(CurrencyFormatted(total));
        ManageFees.Calculate1201();
    },
    Calculate1203: function () {
        // Sum of Rows 1204 and 1205 – read only total in borrower column – Total GFE #8 (1203)
        var txtAmount1204 = parseFloat($("#txtAmount1204").val().split(',').join(''));
        var txtAmount1205 = parseFloat($("#txtAmount1205").val().split(',').join(''));
        var txtAmount1206 = parseFloat($("#txtAmount1206").val().split(',').join(''));
        var txtAmount1207 = parseFloat($("#txtAmount1207").val().split(',').join(''));
        var txtAmount1208 = parseFloat($("#txtAmount1208").val().split(',').join(''));
        var txtAmount1209 = parseFloat($("#txtAmount1209").val().split(',').join(''));
        var txtAmount1210 = parseFloat($("#txtAmount1210").val().split(',').join(''));

        var include1206 = $("#txtName1206").val().indexOf('1203') > 0;
        var include1207 = $("#txtName1207").val().indexOf('1203') > 0;
        var include1208 = $("#txtName1208").val().indexOf('1203') > 0;
        var include1209 = $("#txtName1209").val().indexOf('1203') > 0;
        var include1210 = $("#txtName1210").val().indexOf('1203') > 0;
        var total = 0;
        if (!isNaN(txtAmount1204))
            total += txtAmount1204;

        if (!isNaN(txtAmount1205))
            total += txtAmount1205;

        if (!isNaN(txtAmount1206) && include1206)
            total += txtAmount1206;

        if (!isNaN(txtAmount1207) && include1207)
            total += txtAmount1207;

        if (!isNaN(txtAmount1208) && include1208)
            total += txtAmount1208;

        if (!isNaN(txtAmount1209) && include1209)
            total += txtAmount1209;

        if (!isNaN(txtAmount1210) && include1210)
            total += txtAmount1210;

        $("#txtFromBorrowerFunds1203").val(CurrencyFormatted(total));
    },
    Calculate1204: function () {
        var txtDeed1204 = parseFloat($("#txtDeed1204").val().split(',').join(''));
        var txtMortgage1204 = parseFloat($("#txtMortgage1204").val().split(',').join(''));

        var total = 0;
        if (!isNaN(txtDeed1204))
            total += txtDeed1204;

        if (!isNaN(txtMortgage1204))
            total += txtMortgage1204;

        $("#txtAmount1204").val(CurrencyFormatted(total));
        ManageFees.Calculate1203();
    },
    Calculate1205: function () {
        var txtDeed1205 = parseFloat($("#txtDeed1205").val().split(',').join(''));
        var txtMortgage1205 = parseFloat($("#txtMortgage1205").val().split(',').join(''));

        var total = 0;
        if (!isNaN(txtDeed1205))
            total += txtDeed1205;

        if (!isNaN(txtMortgage1205))
            total += txtMortgage1205;

        $("#txtAmount1205").val(CurrencyFormatted(total));
        ManageFees.Calculate1203();
    },
    Calculate703: function () {
        var txtAmount701 = parseFloat($("#txtAmount701").val().split(',').join(''));
        var txtAmount702 = parseFloat($("#txtAmount702").val().split(',').join(''));

        var total = 0;
        if (!isNaN(txtAmount701))
            total += txtAmount701;

        if (!isNaN(txtAmount702))
            total += txtAmount702;

        $("#txtFromSellersFunds703").val(CurrencyFormatted(total));
    },
    Calculate1301: function () {
        var total = 0;

        $(".Calc1301TotalAmount").each(function () {
            var currentAmount = parseFloat($(this).val().split(',').join(''));

            if (!isNaN(currentAmount))
                total += currentAmount;

            $("#txtFromBorrowerFunds1301").val(CurrencyFormatted(total));
        });
    },

    RetrieveSmardtGfeData: function () {

        ShowProcessingInfoManageFee();

        var form = $("#frmSaveCosts");
        var data = form.serialize();
        // Add disabled dropdowns to serialized form data
        $('select[disabled]').each(function () {
            data = data + '&' + $(this).attr('name') + '=' + $(this).val();
        });
        $('input[disabled]').each(function () {
            data = data + '&' + $(this).attr('name') + '=' + $(this).val();
        });


        $.ajax({
            url: 'ManageFees/RetrieveSmartGFEData',
            data: data,
            type: 'POST',
            success: function (result) {
                $('#smartGFESections').replaceWith(result);
                $("#closingCostSection1100,#closingCostSection1200").find("input[type!=checkbox],select").each(function () {
                    if ($(this).attr("type") != "checkbox")
                        $(this).attr("disabled", "disabled");
                });
                ManageFees.UpdateBorrowerFunds1100();
                ManageFees.Calculate1201();
                ManageFees.Calculate1203();
            },
            error: function (e) {
                HideProcessingInfoManageFee();
            },
            complete: function (e) {
                HideProcessingInfoManageFee();
            }
        });
    },

    MapProviderTo1200Section: function (value) {

        ManageFees.Calculate1203();
        ManageFees.Calculate1201();

    }
};
