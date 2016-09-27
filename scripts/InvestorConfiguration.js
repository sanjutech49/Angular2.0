var InvestorConfigurationVars = {
    lastSelectedPage: "",
    index: 0,
    activeInactive: "isInvestorActive",
    defaultMethod: "GridResult",
    aDeactivateMethod: "ActivateDeactivate",
    checkIsInvestorDuplicateMethod: "CheckIsInvestorDuplicate",
    checkIsProductDuplicateMethod: "CheckIsInvestorProductDuplicate",
    showConfirmationWarningMethod: "ShowConfirmationWarning",
    controller: "InvestorConfiguration",
    searchContainerName: "systemAdminBody",
    pageSize: 10,
    searchStringTextbox: "searchinput",
    clearSearchButton: "clearsearchbutton",
    hdnOriginalInvestorName: "hdnOriginalInvestorName",
    investorNameTextbox: "txtInvestorName",
    productRuCodeTextbox: "txtInvestorProductCode",
    errorMsgDiv: "divInvestorErrorMsg",
    investorProductDuplicateElement: "InvestorProductDuplicateValidationMsg",
    hdnInvestorProductRuCode: "hdnInvestorProductRuCode",
    containerClass: "",
    footerNumbersClassSelector: "imp-sa-footer-nav-numbers",
    footerNavClassSelector: "imp-sa-footer-nav",
    validationClass: "input-validation-error",
    modalPopupName: "modalPopupResult",
    modalPopupClass: "imp-sa-popup-content",
    selectedId: "SelectedId",
    iconColor: { add: "#208ddc", del: "#dd3131", inactive: "#797979" }
};


InvestorConfiguration =
{
    CurrentPage: 0,
    CollapseExpandInvestor: function(sender, investorId) {
        if ($("#" + sender.id).hasClass("right")) {
            $("#" + InvestorConfigurationVars.selectedId).val(investorId);
            $("#" + sender.id).removeClass("right");
            $("#" + sender.id).addClass("down");
            $("#" + sender.id).parent().parent().find("#imp-sa-grid-slide-" + investorId).slideDown(5);
        } else if ($("#" + sender.id).hasClass("down")) {
            $("#" + sender.id).removeClass("down");
            $("#" + sender.id).addClass("right");
            $("#" + sender.id).parent().parent().find("#imp-sa-grid-slide-" + investorId).hide();
        }
    },
    CenterThePopup: function() {
        // center the popup
        var popupWidth = parseFloat($("." + InvestorConfigurationVars.modalPopupClass).width());
        var popupHeight = parseFloat($("." + InvestorConfigurationVars.modalPopupClass).height());
        $("." + InvestorConfigurationVars.modalPopupClass).css("margin-left", (-(popupWidth / 2.0)).toString() + "px");
        $("." + InvestorConfigurationVars.modalPopupClass).css("margin-top", (-(popupHeight / 1.5)).toString() + "px");
    },
    OpenPopup: function(action, investorId, investorProductId) {
        if (investorId != null) {
            var adata = "investorId=" + investorId + (investorProductId != null ? "&investorProductId=" + investorProductId : "");
            InvestorConfiguration.OpenPopupAjaxCall(action, adata);
        }
    },
    ClosePopup: function() {
        $(".modalBackground").fadeOut();
        $("#" + InvestorConfigurationVars.modalPopupName).html("");
        InvestorConfiguration.Search();
    },
    OpenPopupAjaxCall: function(action, adata) {
        $.ajax({
            type: "GET",
            url: InvestorConfigurationVars.controller + "/" + action,
            data: adata,
            success: function(result) {
                $(".modalBackground").fadeIn();
                $("#" + InvestorConfigurationVars.modalPopupName).html(result);
            },
            error: function() {

            },
            complete: function() {

            }
        });
    },
    Search: function (searchTerm) {

        var pageNumber = 1;
        var active = InvestorConfiguration.GetIsActive();

        if (searchTerm == null) {
            searchTerm = InvestorConfiguration.GetSearchStringValue();
        }
        if (searchTerm === 'Search') {
            searchTerm = '';
        }
        if (searchTerm) {
            $("#" + InvestorConfigurationVars.clearSearchButton).show();
        }


        var selectedId = null;
        if (InvestorConfiguration.CurrentPage !== 0) {
            pageNumber = InvestorConfiguration.CurrentPage;
            InvestorConfiguration.CurrentPage = 0;
            selectedId = $("#" + InvestorConfigurationVars.selectedId).val();
        }

        var adata = ("active=" + active) + "&searchTerm=" + searchTerm + "&pageNumber=" + pageNumber + "&pageSize=" + InvestorConfigurationVars.pageSize + "&selectedId=" + selectedId;
        InvestorConfiguration.AjaxCall(InvestorConfigurationVars.defaultMethod, adata, false);
    },
    ClearSearch: function() {
        $("#" + InvestorConfigurationVars.searchStringTextbox).val("Search").css({ 'color': "rgb(99, 99, 99)" });
        InvestorConfiguration.Search();
    },
    GetSearchStringValue: function() {
        var returnVal = $("#" + InvestorConfigurationVars.searchStringTextbox).val();
        if (returnVal == undefined || returnVal === "Search") {
            returnVal = "";
        }
        return returnVal;
    },
    GetIsActive: function() {
        var activeInactive;
        var element = $("#" + InvestorConfigurationVars.activeInactive);

        if (element.val() === "-1") {
            activeInactive = null;
        } else if (element.val() === "1") {
            activeInactive = true;
        } else if (element.val() === "0") {
            activeInactive = false;
        } else {
            activeInactive = null;
        }

        return activeInactive;
    },
    OnChangeInvestorActive: function () {

    },
    AjaxCall: function(method, adata, isPost) {
        var controller = InvestorConfigurationVars.controller;

        var requestType = isPost ? "POST" : "GET";

        var isSuccess = false;
        var isUpdated = false;
        var hasErrors = false;
        if (controller && method && adata) {
            $.ajax({
                type: requestType,
                url: controller + "/" + method,
                data: adata,
                async: true,
                success: function(data) {
                    if (isPost) {
                        if (data.success === true) {
                            isSuccess = true;
                            isUpdated = data.isUpdated != undefined ? data.isUpdated : false;
                            InvestorConfiguration.CurrentPage = $("#CurrentPage").val();
                        } else if (data.errors) {
                            hasErrors = true;
                            InvestorConfiguration.ShowErrorFromServer(data.errors);
                            isSuccess = false;
                        } else {
                            isSuccess = false;
                        }
                    } else {
                        $("#" + InvestorConfigurationVars.searchContainerName).html(data);
                    }

                },
                error: function() {

                },
                complete: function() {
                    if (!isPost) { // if searching 
                        InvestorConfiguration.EndNavigation();
                    } else if (hasErrors === false) {
                        if (isSuccess) {
                            if (isUpdated) {
                                InvestorConfiguration.ClosePopup();
                                //InvestorConfiguration.SelectPage($('.page-selected')); // refresh grid                                                
                            } else {
                                ShowAjaxErrorPopUp();
                            }
                        } else {
                            ShowAjaxErrorPopUp();
                        }
                    }
                }
            });
        }

        return isSuccess;
    },
    ShowErrorFromServer: function(errorMap) {
        var summary = "You have the following errors: \n \n";
        $.each(errorMap, function(key, value) {
            summary += "* \n" + value + "\n";
        });

        $("#divInvestorErrorMsg").text(summary);
        $("#divInvestorErrorMsg").show();
    },
    Save: function(action, formName) {

        var form = $("#" + formName);
        var adata = form.serialize();

        // Add disabled checkboxes to serialized form data
        $("input[disabled][type='checkbox']").each(function() {
            adata = adata + "&" + $(this).attr("name") + "=" + $(this).val();
        });
        var isUpdated = InvestorConfiguration.AjaxCall(action, adata, true);

        if (!isUpdated) {
            //ShowAjaxErrorPopUp();
            return null;
        }

        return isUpdated;
    },
    ShowAjaxErrorPopup: function() {
        $(".message").css("display", "block");

        $("#dialog-modal").dialog({
            height: 140,
            width: 350,
            modal: true,
            resizable: false,
            closeOnEscape: true,
            close: function() {
                $(".modalBackground").fadeOut();

            },
            buttons: {
                Ok: function() {
                    $(this).dialog("close");
                    $(".modalBackground").fadeOut();
                }
            }
        });

        $("#body").parent().unblock();
    },
    OnChangeFunc: function() {

    },
    ValidateForm: function(formName, isInvestorProduct) {
        var form = $("#" + formName);

        $("form").removeData("validator");
        $("form").removeData("unobtrusiveValidation");
        //        form.data('validator').settings.ignore = '';
        $.validator.unobtrusive.parse("#" + formName);

        var validator = form.validate();
        var isValid = validator.form();


        if (isInvestorProduct) {
            var productNameAndRuCodeValid = validator.element("#txtInvestorProductName") && validator.element("#txtInvestorProductCode");


            var defaultPricingSelector = "input[name^='InvestorProduct.DefaultPricing']";
            var CDTIPricingTypesSelector = "input[name^='InvestorProduct.CDTIPricingTypes']";

            $(defaultPricingSelector).change(function() {
                InvestorConfiguration.RemoveValErrorClassHideToolTip($(defaultPricingSelector));
                if (this.checked) {
                    InvestorConfiguration.RemoveValErrorClassHideToolTip($(CDTIPricingTypesSelector));
                }
            });

            if ($(defaultPricingSelector).length !== 0 && $(defaultPricingSelector + ":checked").length === 0) {

                $(defaultPricingSelector).first().addClass(InvestorConfigurationVars.validationClass);

                if (productNameAndRuCodeValid) {
                    //   element,        tooltip
                    var corners = ["bottom center", "top center"];
                    //var corners = ['bottomLeft', 'leftTop'];
                    InvestorConfiguration.ValidationPopUp($(defaultPricingSelector).siblings("label").first(), "Default Pricing is required.", true, corners);
                }
            } else {
                $(defaultPricingSelector).first().removeClass(InvestorConfigurationVars.validationClass);
            }




            $(CDTIPricingTypesSelector).change(function () {               
                InvestorConfiguration.RemoveValErrorClassHideToolTip($(CDTIPricingTypesSelector));
            });

            if ($(CDTIPricingTypesSelector).length !== 0 && $(CDTIPricingTypesSelector + ":checked").length === 0) {

                $(CDTIPricingTypesSelector).first().addClass(InvestorConfigurationVars.validationClass);
                if (isValid) {
                    isValid = false;
                    InvestorConfiguration.ValidationPopUp($(CDTIPricingTypesSelector).first().parent().find("label"), "CDTI Pricing Type is required.");
                }


            } else {
                $(CDTIPricingTypesSelector).first().removeClass(InvestorConfigurationVars.validationClass);
            }


            var aUsTypesSelector = "input[name^='InvestorProduct.AusTypes']";

            $(aUsTypesSelector).click(function() {
                InvestorConfiguration.RemoveValErrorClassHideToolTip($(aUsTypesSelector));
            });

            if ($(aUsTypesSelector).length !== 0 && $(aUsTypesSelector + ":checked").length === 0) {
                $(aUsTypesSelector).first().addClass(InvestorConfigurationVars.validationClass);
                if (isValid) {
                    isValid = false;
                    InvestorConfiguration.ValidationPopUp($(aUsTypesSelector).first().parent().find("label"), "AUS Type is required.");
                }

            } else {
                $(aUsTypesSelector).first().removeClass(InvestorConfigurationVars.validationClass);
                InvestorConfiguration.AddRemoveValClassCreatePopup($(aUsTypesSelector).first(), true, "");
            }


            var investorRulesSelector = "input[name^='InvestorProduct.InvestorProductRule.InvestorRulesConfigurationId']";

            // If any of radio buttons are clicked remove invalid class from radio buttons and textboxes! Also hide tooltip 
            $(investorRulesSelector).click(function() {
                $(investorRulesSelector).removeClass(InvestorConfigurationVars.validationClass);
                InvestorConfiguration.RemoveValErrorClassHideToolTip($(this).parent().parent().find("input[type='text']"));
            });

            if ($(investorRulesSelector).length !== 0 && $(investorRulesSelector + ":checked").length === 0) {
                $(investorRulesSelector).first().addClass(InvestorConfigurationVars.validationClass);

                if (isValid) {
                    isValid = false;
                    InvestorConfiguration.ValidationPopUp($(investorRulesSelector).first().parent().find("label").first(), "The Qualifying Rate Calculation field is required.");
                }
            } else {
                if ($(investorRulesSelector + ":checked").parent().find("input[type='text']").val() != undefined &&
                    $(investorRulesSelector + ":checked").parent().find("input[type='text']").val().trim() === "" &&
                     $(investorRulesSelector + ":checked").length > 0) {

                    $(investorRulesSelector + ":checked").parent().find("input[type='text']").addClass(InvestorConfigurationVars.validationClass);

                    if (isValid) {
                        isValid = false;
                        //Show popup for textbox
                        InvestorConfiguration.ValidationPopUp($(investorRulesSelector + ":checked").parent().find("input[type='text']"), "The Qualifying Rate Calculation field is required.");
                    }

                    // hide popup for textbox
                    $(investorRulesSelector + ":checked").parent().find("input[type='text']").click(function() {
                        InvestorConfiguration.RemoveValErrorClassHideToolTip($(investorRulesSelector));
                    });


                } else {
                    $(investorRulesSelector).first().removeClass(InvestorConfigurationVars.validationClass);
                    //$("input[name^='InvestorProduct.InvestorProductRule.InvestorRulesConfigurationId']:checked").parent().find("input[type='text']").removeClass(InvestorConfigurationVars.validationClass);
                }
            }

            if ($("#InvestorWebsiteUrl") != null && ($("#InvestorWebsiteUrl").val() !== "" && !InvestorConfiguration.isUrl($("#InvestorWebsiteUrl").val()))) {
                $("#InvestorWebsiteUrl").addClass(InvestorConfigurationVars.validationClass);
                if (isValid) {
                    InvestorConfiguration.ValidationPopUp($("#InvestorWebsiteUrl"), "A valid URL was not provided.");
                    isValid = false;
                }
            } else {
                $("#InvestorWebsiteUrl").removeClass(InvestorConfigurationVars.validationClass);
            }
        }

        if (!isValid) {
            $(".input-validation-error").first().focus();
        }

        return isValid;
    },
    RemoveValErrorClassHideToolTip: function(element) {
        if (element.hasClass(InvestorConfigurationVars.validationClass)) {
            element.removeClass(InvestorConfigurationVars.validationClass);
        }
        if ($(".ui-tooltip-red") != undefined) {
            $(".ui-tooltip-red").hide();
        }
    },
    isUrl: function(s) {
        if (/^(http|https|ftp):\/\/[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/.test(s) || s === "N/A") {
            return true;
        }
        return false;
    },

    AddRemoveValClassCreatePopup: function(element, isValid, message) {
        if (isValid && element.hasClass(InvestorConfigurationVars.validationClass)) {
            element.removeClass(InvestorConfigurationVars.validationClass);
            element.qtip("destroy");
        } else if (!isValid) {
            if (!element.hasClass(InvestorConfigurationVars.validationClass)) {
                element.addClass(InvestorConfigurationVars.validationClass);
            }
            InvestorConfiguration.ValidationPopUp(element, message);
        }
    },
    //customCorners must be an array of 2 element
    ValidationPopUp: function(element, textMessage, useCustomPosition, customCorners) {
        var corners = ["bottom center", "top center"];

        if (useCustomPosition != null && useCustomPosition === true && customCorners != null) {
            corners = customCorners;
        }

        element.qtip({
            content: { text: "<span>" + textMessage + "</span>" },
            position: {
                my: corners[0],
                at: corners[1],
                viewport: $(window)
            },
            show: {
                event: false,
                ready: true
            },
            hide: { when: { target: false, event: "click mouseleave" } },
            style: { classes: "ui-tooltip-red" }
        });
    },
    ShowWarningMessage: function(investorId, name, investorProductId, activate) {
        if (investorId != null && name != null && activate != null) {
            if (investorProductId == null) {
                investorProductId = -1;
            }
            var adata = "investorId=" + investorId + "&name=" + encodeURIComponent(name) + "&investorProductId=" + investorProductId + "&activate=" + activate;
            InvestorConfiguration.OpenPopupAjaxCall(InvestorConfigurationVars.showConfirmationWarningMethod, adata);
        }
    },
    ActivateDeactivate: function(investorId, investorProductId, activate, isDelete) {
        if (investorId != null && activate != null) {
            var action = InvestorConfigurationVars.aDeactivateMethod;
            var adata = "investorId=" + investorId + ("&investorProductId=" + investorProductId) + "&activate=" + activate + "&isDelete=" + isDelete;
            InvestorConfiguration.AjaxCall(action, adata, true);
            InvestorConfiguration.CurrentPage = $("#CurrentPage").val();
        }
    },
    SelectDefaultPricing: function(element) {
        if (element != null) {
            var elementValue = element.value != undefined ? element.value : element.val();
            if (elementValue != undefined) {
                var matchingCDTISelector = "input[name*='CDTIPricingTypes'][value='" + elementValue + "']";
                var allButMatchingCDTISelector = "input[name*='CDTIPricingTypes']:not([value='" + elementValue + "'])";


                $(matchingCDTISelector).prop("checked", true);


                // default PricingType must be checked
                $(matchingCDTISelector).prop("checked", "checked");
                $(matchingCDTISelector).attr("disabled", "disabled");

                InvestorConfiguration.RemoveValErrorClassHideToolTip($(matchingCDTISelector));
                //$(matchingCDTISelector).click();

                // remove disabled attribute from other checkboxes 
                $(allButMatchingCDTISelector).removeAttr("disabled");
            }
        }
    },

    //Method to check is new/modified Investor/InvestorProduct a duplicate
    // if parameter isInvestorProduct is true then method checks for duplicate product, if it's false then it checks for duplicate Investor
    CheckIsDuplicateRecord: function(postAction, formName, isAdd, isInvestorProduct) {
        var isValid = InvestorConfiguration.ValidateForm(formName, isInvestorProduct);
        if (!isValid) {
            return null;
        }

        var originalRuCode = $("#" + InvestorConfigurationVars.hdnInvestorProductRuCode).val();
        var currentRuCode = $("#" + InvestorConfigurationVars.productRuCodeTextbox).val();

        var currentInvestorName = $("#" + InvestorConfigurationVars.investorNameTextbox).val();
        var originalInvestorName = $("#" + InvestorConfigurationVars.hdnOriginalInvestorName).val();

        var productCheckAreParamsValid = (currentRuCode != undefined && currentRuCode !== "");
        var investorCheckAreParamsValid = (currentInvestorName != undefined && currentInvestorName !== "");

        if (!isAdd && ((!investorCheckAreParamsValid && !productCheckAreParamsValid) || (investorCheckAreParamsValid && productCheckAreParamsValid))) {
            ShowAjaxErrorPopUp();
            return null;
        }


        // If it's update for product and unique values (ruCode) are same as before, skip the rest of function 
        if (!isAdd && ((isInvestorProduct && originalRuCode != undefined && currentRuCode != undefined && originalRuCode.trim() === currentRuCode.trim()))) {
            InvestorConfiguration.Save(postAction, formName, isInvestorProduct);
            return null;
        }
        // if it's update for investor and value is same as old
        else if (!isAdd && !isInvestorProduct && originalInvestorName != undefined && currentInvestorName != undefined && originalInvestorName.trim() == currentInvestorName.trim()) { 
            InvestorConfiguration.Save(postAction, formName, isInvestorProduct);
            //InvestorConfiguration.SelectPage($('.page-selected')); // refresh grid  
            return null;
        }

        var adata;
        var method;

        if (isInvestorProduct && currentRuCode != null) {
            adata = "ruCode=" + currentRuCode.trim();
            method = InvestorConfigurationVars.checkIsProductDuplicateMethod;
        } else if (!isInvestorProduct && currentInvestorName != null) {
            adata = "investorName=" + currentInvestorName.trim();
            method = InvestorConfigurationVars.checkIsInvestorDuplicateMethod;
        } else {
            return null;
        }


        var isSuccess = false;
        var isDuplicate = false;

        $.ajax({
            type: "POST",
            url: InvestorConfigurationVars.controller + "/" + method,
            data: adata,
            success: function(data) {
                if (data.success === true) {
                    isSuccess = true;
                    isDuplicate = data.isDuplicate;
                }
            },
            error: function() {
            },
            complete: function() {
                var validateDuplicateElement = isInvestorProduct ? $("#" + InvestorConfigurationVars.productRuCodeTextbox) : $("#" + InvestorConfigurationVars.investorNameTextbox);
                if (isSuccess) {
                    if (isDuplicate) {
                        validateDuplicateElement.addClass(InvestorConfigurationVars.validationClass);
                        InvestorConfiguration.ValidationPopUp(validateDuplicateElement, "This record is duplicate.");
                    } else {
                        validateDuplicateElement.removeClass(InvestorConfigurationVars.validationClass);
                        validateDuplicateElement.qtip("destroy");
                        InvestorConfiguration.Save(postAction, formName, true);
                    }
                } else {
                    ShowAjaxErrorPopUp();
                }

            }
        });
        return "";
    },

    InvestorProductDOMReady: function() {
        $("#txtInvestorProductName").focus();

        var defaultPricing = $("input[name=\"InvestorProduct.DefaultPricing\"]:checked");
        if (defaultPricing != null) {
            InvestorConfiguration.SelectDefaultPricing(defaultPricing);
        }


        $("input[name*='InvestorProduct.InvestorProductRule.UserDefinedValues'][type='text']").mask("9?9");


        $("input[name*='UserDefinedValues']").prop("disabled", true);
        $("input[name*='InvestorRule'][type='radio']:checked").parent().find("input[name*='UserDefinedValues']").prop("disabled", false);


        $("input[name*='InvestorRule'][type='radio']").click(function() {
            $("input[name*='UserDefinedValues']").prop("disabled", true);
            $("input[name*='InvestorRule'][type='radio']:checked").parent().find("input[name*='UserDefinedValues']").prop("disabled", false);
        });
    },
    InvestorDetailsDOMReady: function() {
        $("#txtInvestorName").focus();

        $(".decimal3").jStepper(
        { minValue: 0, maxValue: 1, normalStep: 0.001, defaultValue: 0, minDecimals: 0, maxDecimals: 10, decimalSeparator: "." });
      
    },
    GridBindings: function() {
        InvestorConfiguration.ActiveButton();
        InvestorConfiguration.DrawIcons();
        InvestorConfiguration.DrawMainAddIcon();
        $(".imp-sa-ddl").click("focus", function() {
            var element = $(this);
            if (!(element.hasClass("container-input-validation-error"))) {
                element.addClass("imp-span-ddl-contacts-container-focus");
            } else {
                element.removeClass("imp-span-ddl-contacts-container-focus");
            }
        });

        $(".imp-sa-ddl").click("focusout", function() {
            var element = $(this);
            element.removeClass("imp-span-ddl-contacts-container-focus");
        });
    },
    ActiveButton: function() {
        var canvasElements = $(".imp-sa-grid-row").find(".canvas-active");

        canvasElements.each(function() {
            var inner = $(this)[0];
                var context = inner.getContext("2d");
                if ($(this).hasClass("active")) {
                drawActiveButton(context, true, "#1FA962", "#BCBCBC", "#D8DBDB");
                } else if ($(this).hasClass("disabled")) {
                drawActiveButton(context, false, "#797979", "#BCBCBC", "#E9ECED");
                } else {
                drawActiveButton(context, false, "#E9ECED", "#666666", "#E9ECED");
            }
        }
        );
    },
    DrawIcons: function() {
        var canvasElements = $(".imp-sa-grid-row").find("#icon");

        canvasElements.each(function() {
            var inner = $(this)[0];
                var context = inner.getContext("2d");

            var isPlus = "false";
            var color = InvestorConfigurationVars.iconColor.inactive;;

                if ($(this).hasClass("active")) {
                    if ($(this).hasClass("add")) {
                    color = InvestorConfigurationVars.iconColor.add;
                    isPlus = "true";
                    } else if ($(this).hasClass("del")) {
                    color = InvestorConfigurationVars.iconColor.del;
                    isPlus = "false";
                }
            }
                drawMinusPlus(context, color, null, isPlus, 'small');
        }
        );
    },
    DrawMainAddIcon: function() {
        var canvasElement = document.getElementById("icon");
        var context = canvasElement.getContext("2d");
        var color = InvestorConfigurationVars.iconColor.add;;

        drawMinusPlus(context, color, null, "true", "large");
    },

    DrawCanvas: function(elementId, isActive, isPlus, action) {
        var c = document.getElementById(elementId);
        var ctx = c.getContext("2d");

        var color = "";
        if (isActive === false)
            color = InvestorConfigurationVars.color.inactive;
        else {
            switch (action) {
            case "add":
                    color = InvestorConfigurationVars.color.add;
                    break;
            case "del":
                    color = InvestorConfigurationVars.color.del;
                    break;
            }
        }
        
        drawMinusPlus(ctx, color, null, isPlus, "small");
    },

    // ### Footer Navigation - Paging
    GetPages: function(direction, totalPages, currentPage, endPage, element) {
        var startPage = parseInt($(element).parent().find("." + InvestorConfigurationVars.footerNumbersClassSelector + "-value").first().html());
        if (direction.indexOf("true") !== -1) {
            currentPage = endPage + 1;
        } else if (direction.indexOf("false") !== -1) {
            currentPage = (startPage - InvestorConfigurationVars.pageSize) >= (totalPages - (totalPages - 1)) ? (startPage - InvestorConfigurationVars.pageSize) : 1;
        }

        var activeInactive = InvestorConfiguration.GetIsActive();
        var searchTerm = InvestorConfiguration.GetSearchStringValue();

        InvestorConfiguration.StartNavigation();
        var adata = ("active=" + activeInactive) + "&searchTerm=" + searchTerm + "&pageNumber=" + currentPage + "&pageSize=" + InvestorConfigurationVars.pageSize;
        InvestorConfiguration.AjaxCall(InvestorConfigurationVars.defaultMethod, adata, false);
    },
    PageNavigation: function(clickedElement, totalPages, currentPage) {
        InvestorConfigurationVars.index = $(InvestorConfigurationVars.containerClass + "." + InvestorConfigurationVars.footerNavClassSelector).index(clickedElement);
        var pageIndex = $(InvestorConfigurationVars.containerClass + "." + InvestorConfigurationVars.footerNumbersClassSelector + ".page-selected").index();

        var activeInactive = InvestorConfiguration.GetIsActive();
        var searchTerm = InvestorConfiguration.GetSearchStringValue();
        var adata;
        if (InvestorConfigurationVars.index === 0) {

            if (pageIndex !== 0) {
                $(InvestorConfigurationVars.containerClass + "." + InvestorConfigurationVars.footerNumbersClassSelector).eq(pageIndex).removeClass("page-selected");
                $(InvestorConfigurationVars.containerClass + "." + InvestorConfigurationVars.footerNumbersClassSelector).eq(pageIndex - 1).addClass("page-selected");
                InvestorConfigurationVars.lastSelectedPage = parseInt(InvestorConfigurationVars.lastSelectedPage) - 1;

                InvestorConfiguration.StartNavigation();

                adata = ("active=" + activeInactive) + "&searchTerm=" + searchTerm + "&pageNumber=" + currentPage - 1 + "&pageSize=" + InvestorConfigurationVars.pageSize;

                InvestorConfiguration.AjaxCall(InvestorConfigurationVars.defaultMethod, adata, false);
            }
        } else if (InvestorConfigurationVars.index === 1) {
            if ((pageIndex + 1) <= totalPages) {

                if ((pageIndex + 1) >= InvestorConfigurationVars.pageSize && currentPage < totalPages) {
                    $(InvestorConfigurationVars.containerClass + "." + InvestorConfigurationVars.footerNumbersClassSelector).eq(0).remove();
                    $(InvestorConfigurationVars.containerClass + "<div class='" + InvestorConfigurationVars.footerNumbersClassSelector + " page-selected'>" + (parseInt(InvestorConfigurationVars.lastSelectedPage) + 1) + "</div >").insertAfter("div." + InvestorConfigurationVars.footerNumbersClassSelector + ".page-selected");
                    $(InvestorConfigurationVars.containerClass + "." + InvestorConfigurationVars.footerNumbersClassSelector).eq(pageIndex - 1).removeClass("page-selected");

                    InvestorConfigurationVars.lastSelectedPage = parseInt(InvestorConfigurationVars.lastSelectedPage) + 1;

                    adata = ("active=" + activeInactive) + "&searchTerm=" + searchTerm + "&pageNumber=" + InvestorConfigurationVars.lastSelectedPage - 1 + "&pageSize=" + InvestorConfigurationVars.pageSize;

                    InvestorConfiguration.AjaxCall(InvestorConfigurationVars.defaultMethod, adata, false);
                    InvestorConfiguration.StartNavigation();

                } else if (currentPage < totalPages || currentPage == null) {
                    InvestorConfigurationVars.lastSelectedPage = parseInt($(InvestorConfigurationVars.containerClass + "." + InvestorConfigurationVars.footerNumbersClassSelector).eq(pageIndex + 1).text().trim());

                    $(InvestorConfigurationVars.containerClass + "." + InvestorConfigurationVars.footerNumbersClassSelector).eq(pageIndex).removeClass("page-selected");
                    $(InvestorConfigurationVars.containerClass + "." + InvestorConfigurationVars.footerNumbersClassSelector).eq(pageIndex + 1).addClass("page-selected");

                    InvestorConfiguration.StartNavigation();
                    currentPage = $("." + InvestorConfigurationVars.footerNumbersClassSelector).eq(pageIndex + 1).text().trim();

                    adata = ("active=" + activeInactive) + "&searchTerm=" + searchTerm + "&pageNumber=" + currentPage + "&pageSize=" + InvestorConfigurationVars.pageSize;
                    InvestorConfiguration.AjaxCall(InvestorConfigurationVars.defaultMethod, adata, false);
                }
            }
        }
    },
    SelectPage: function(element) {
        InvestorConfigurationVars.lastSelectedPage = $(element).text().trim();
        $(InvestorConfigurationVars.containerClass + "." + InvestorConfigurationVars.footerNumbersClassSelector).removeAttr("style");
        $(InvestorConfigurationVars.containerClass + "." + InvestorConfigurationVars.footerNumbersClassSelector).removeClass("page-selected");

        $(element).addClass("page-selected");

        InvestorConfiguration.StartNavigation();

        var currentPage = InvestorConfigurationVars.lastSelectedPage;
        var activeInactive = InvestorConfiguration.GetIsActive();
        var searchTerm = InvestorConfiguration.GetSearchStringValue();
        var adata = ("active=" + activeInactive) + "&searchTerm=" + searchTerm + "&pageNumber=" + currentPage + "&pageSize=" + InvestorConfigurationVars.pageSize;
        InvestorConfiguration.AjaxCall(InvestorConfigurationVars.defaultMethod, adata, false);
    },
    StartNavigation: function() {
        $(".grayOutContent").show();
        $(".loader").show();
    },
    EndNavigation: function() {
        $(".grayOutContent").hide();
        $(".loader").hide();
    }

    // ### End of Footer Navigation - Paging
};