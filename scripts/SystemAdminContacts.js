var lastSelectedPage;
var ctPreviousValue = 99;
var _searchStringTextbox = "searchinput";
var _contactTypeDdl = "contactTypes";
var _isContactTypeTelerikControl = false;
var _contactSearchContainerName = "systemAdminBody";
var _isSystemAdminView = true;
var _clearSearchButton = "clearsearchbutton";
var _method = "GetContacts";
var _controller = "SystemAdmin";
var _containerClass = "";
var _activeInactive = "isContactActive";
var _collapseOtherSearchGrids = false;
var _showGridContainers = "";
var _restartSearch = 'false'; /*active*/
Contacts = {

    SetSearchControlParameters: function (searchStringTextbox, contactTypeDdl, isContactTypeTelerikControl,
        contactSearchContainerName, isSystemAdminView, clearSearchButton, controller, method) {
        _searchStringTextbox = searchStringTextbox;
        _contactTypeDdl = contactTypeDdl;
        _isContactTypeTelerikControl = isContactTypeTelerikControl;
        _contactSearchContainerName = contactSearchContainerName;
        _isSystemAdminView = isSystemAdminView;
        _clearSearchButton = clearSearchButton;
        _controller = controller;
        _method = method;
    },

    SetSearchControlParametersFromDate: function (element) {

        var container = $(element).closest(".contactsSearchResultGridMasterInfo");
        if (container.length) {
            _searchStringTextbox = container.data('_searchStringTextbox');
            _contactTypeDdl = container.data('_contactTypeDdl');
            _isContactTypeTelerikControl = container.data('_isContactTypeTelerikControl');
            _contactSearchContainerName = container.data('_contactSearchContainerName');
            _isSystemAdminView = container.data('_isSystemAdminView');
            _clearSearchButton = container.data('_clearSearchButton');
            _controller = container.data('_controller');
            _method = container.data('_method');
            _containerClass = "." + container.data('_containerClass') + " ";
            _activeInactive = container.data('_activeInactive');
            _collapseOtherSearchGrids = container.data('_collapseOtherSearchGrids');
            _showGridContainers = "." + container.data('_showGridContainers');
            _restartSearch = container.data('_restartSearch');
        }
       
    },

    GetSearchStringValue: function ()
    { return $('#' + _searchStringTextbox).val(); },

    GetContactTypeValue: function (element) {
        var value;
        if (_isContactTypeTelerikControl)
            value = $("#" + _contactTypeDdl).data("tDropDownList").value();
        else
            value = $('#' + _contactTypeDdl).val();

        return value;
    },
    GetLoanIdValue: function () {
        var loanId = "";

        if ($('.tablelistselected').length) {

            $('.tablelistselected .loanid').each(function() {
                if (loanId == "")
                    loanId = $(this).text();
                else {
                    loanId = loanId + "," + $(this).text();
                }
            });
        }

        return loanId;
    },
    GetIsActive: function () {
        var activeInactive = null;
        var element = $('#' + _activeInactive);

        if (element.val() == '-1') activeInactive = "null";
        else if (element.val() == '1') activeInactive = 'true';
        else activeInactive = 'false';

        return activeInactive;
    },
    SetContactTypeValue: function (value) {

        if (_isContactTypeTelerikControl)
            $("#" + _contactTypeDdl).data("tDropDownList").value(value);
        else
            $('#' + _contactTypeDdl).val(value);

        return value;
    },

    CheckIfCompanyHasChildren: function (element) {
        Contacts.SetSearchControlParametersFromDate(element);
        var companyHasChildren = "null";

        if ($('#companyHasChildren').length && $('#companyHasChildren').val() == '1') companyHasChildren = "true";
        else if ($('#companyHasChildren').length && $('#companyHasChildren').val() == '-1') companyHasChildren = 'false';
        else companyHasChildren = 'null';

        return companyHasChildren;

    },

    PreviouslySelectedPage: function () {
        var pageNumber = -1;
        if ($('.page-selected').length)
            pageNumber = parseInt($(".page-selected").html());

        return pageNumber;
    },

    PageNavigation: function (clickedElement, totalPages, currentPage) {
        Contacts.SetSearchControlParametersFromDate(clickedElement);
        index = $(_containerClass + '.business-contacts-footer-nav').index(clickedElement);
        pageIndex = $(_containerClass + '.business-contacts-footer-numbers.page-selected').index();

        if (index == 0) {

            if (pageIndex != 0) {
                $(_containerClass + '.business-contacts-footer-numbers').eq(pageIndex).removeClass('page-selected');
                $(_containerClass + '.business-contacts-footer-numbers').eq(pageIndex - 1).addClass('page-selected');
                lastSelectedPage = parseInt(lastSelectedPage) - 1;

                Contacts.StartNavigation();
                Contacts.AjaxCall(_controller, _method, JSON.stringify({
                    currentPage: currentPage - 1,
                    contactType: Contacts.GetContactTypeValue(clickedElement),
                    activeInactive: Contacts.GetIsActive(),
                    searchString: Contacts.GetSearchStringValue(),
                    pageSize: 10,
                    requestMultiplePages: 'false',
                    getNextPages: 'null',
                    hasChildren: Contacts.CheckIfCompanyHasChildren(clickedElement),
                    loanId: Contacts.GetLoanIdValue()
                }));
            }
        }
        else if (index == 1) {
            if ((pageIndex + 1) <= totalPages) {

                if ((pageIndex + 1) >= 10 && currentPage < totalPages) {
                    $(_containerClass + '.business-contacts-footer-numbers').eq(0).remove();
                    $(_containerClass + "<div class='business-contacts-footer-numbers page-selected'>" + (parseInt(lastSelectedPage) + 1) + "</div >").insertAfter('div.business-contacts-footer-numbers.page-selected');
                    $(_containerClass + '.business-contacts-footer-numbers').eq(pageIndex - 1).removeClass('page-selected');

                    lastSelectedPage = parseInt(lastSelectedPage) + 1;

                    Contacts.StartNavigation();
                    Contacts.AjaxCall(_controller, _method, JSON.stringify({
                        currentPage: lastSelectedPage,
                        contactType: Contacts.GetContactTypeValue(clickedElement),
                        activeInactive: Contacts.GetIsActive(),
                        searchString: Contacts.GetSearchStringValue(),
                        pageSize: 10,
                        requestMultiplePages: 'false',
                        getNextPages: 'null',
                        hasChildren: Contacts.CheckIfCompanyHasChildren(clickedElement),
                        loanId: Contacts.GetLoanIdValue()
                    }));
                }
                else if (currentPage < totalPages || currentPage == null) {
                    lastSelectedPage = parseInt($(_containerClass + '.business-contacts-footer-numbers').eq(pageIndex + 1).text().trim());

                    $(_containerClass + '.business-contacts-footer-numbers').eq(pageIndex).removeClass('page-selected');
                    $(_containerClass + '.business-contacts-footer-numbers').eq(pageIndex + 1).addClass('page-selected');
                    Contacts.StartNavigation();
                    Contacts.AjaxCall(_controller, _method, JSON.stringify({
                        currentPage: $('.business-contacts-footer-numbers').eq(pageIndex + 1).text().trim(),
                        contactType: Contacts.GetContactTypeValue(clickedElement),
                        activeInactive: Contacts.GetIsActive(),
                        searchString: Contacts.GetSearchStringValue(),
                        pageSize: 10,
                        requestMultiplePages: 'false',
                        getNextPages: 'null',
                        hasChildren: Contacts.CheckIfCompanyHasChildren(clickedElement),
                        loanId: Contacts.GetLoanIdValue()
                    }));

                }
            }
        }
    },
    SelectPage: function (element) {
        Contacts.SetSearchControlParametersFromDate(element);
        lastSelectedPage = $(element).text().trim();
        $(_containerClass + '.business-contacts-footer-numbers').removeAttr('style');
        $(_containerClass + '.business-contacts-footer-numbers').removeClass('page-selected');

        $(element).addClass('page-selected');

        Contacts.StartNavigation();
        Contacts.AjaxCall(_controller, _method, JSON.stringify({
            currentPage: lastSelectedPage,
            contactType: Contacts.GetContactTypeValue(element),
            activeInactive: Contacts.GetIsActive(),
            searchString: Contacts.GetSearchStringValue(),
            pageSize: 10,
            requestMultiplePages: 'false',
            getNextPages: 'null',
            hasChildren: Contacts.CheckIfCompanyHasChildren(element),
            loanId: Contacts.GetLoanIdValue()
        }));
    },
    AjaxCall: function (controller, method, parameters) {

        $.ajax({
            type: "GET",
            url: controller + "/" + method,
            cache: false,
            data: { parametersJSON: parameters.toString(), isSystemAdminView: _isSystemAdminView },
            dataType: "html",
            success: function (result) {
                $("#" + _contactSearchContainerName).html(result);

                if (_collapseOtherSearchGrids) {
                    Contacts.ResizeContactContainerOnSearchStart();
                }
                else
                    Contacts.EndNavigation();
                 $(".expand-True").click();
            },
            error: function () {
                Contacts.EndNavigation();
            }
        });
    },
    StartNavigation: function () {
        $('.grayOutContent').show();
        $('.loader').show();
    },
    EndNavigation: function () {
        if (!_isSystemAdminView) {
            $("#loandetailscontent").animate({
                height: $('.imp-div-lcCompanyContact-container').height() + 0 + "px"
            }, {
                delay: 300,
                complete: function () {
                    $("#loandetailsminmax").removeClass('max');
                    $("#loandetailsminmax").addClass('min');
                    $('.grayOutContent').hide();
                    $('.loader').hide();
                }
            }
            );
        }
        else {
            $('.grayOutContent').hide();
            $('.loader').hide();
        }


    },
    ResizeContactContainerOnSearchStart: function () {
        $(_showGridContainers).fadeOut("slow", function () {

            $(_containerClass).fadeIn("slow", function () {
                $("#loandetailscontent").animate
								({
								    height: $('.imp-div-lcCompanyContact-container').height() + 0 + "px"
								}, {
								    duration: 500,
								    complete: function () {
								        $("#loandetailsminmax").removeClass('max');
								        $("#loandetailsminmax").addClass('min');
								        $('.grayOutContent').hide();
								        $('.loader').hide();
								    }
								}
								);
            });

        });
    },
    ResizeContactContainerInitialAnimate: function () {
        $("#loandetailscontent").animate({
            height: 61 + "px"
        }, {
            delay: 300,
            complete: function () {
                $("#loandetailsminmax").removeClass('max');
                $("#loandetailsminmax").addClass('min');
            }
        }
            );
    },
    Search: function (element, searchValue, isOldSearch) {

        Contacts.SetSearchControlParametersFromDate(element);

        if (!_isSystemAdminView)
            Contacts.ResizeContactContainerInitialAnimate();

        var searchTerm;
        if (isOldSearch) {
            $('#' + _clearSearchButton).show();
            searchTerm = Contacts.GetSearchStringValue(element);
        } else {
            searchTerm = searchValue;
        }

        if (searchTerm == undefined) {
            searchTerm = '';
        }

        Contacts.StartNavigation();
        Contacts.AjaxCall(_controller, _method, JSON.stringify({
            currentPage: '1',
            contactType: Contacts.GetContactTypeValue(element),
            activeInactive: Contacts.GetIsActive(),
            searchString: searchTerm,
            pageSize: 10,
            requestMultiplePages: 'false',
            getNextPages: 'null',
            hasChildren: Contacts.CheckIfCompanyHasChildren(element),
            loanId: Contacts.GetLoanIdValue()
        }));
    },
    GetTenPages: function (direction, totalPages, currentPage, endPage, element) {
        Contacts.SetSearchControlParametersFromDate(element);
        var startPage = parseInt($(element).parent().find(".business-contacts-footer-numbers-value").first().html());
        currentPage;
        if (direction.indexOf('true') != -1) {
            currentPage = endPage + 1;
        } else if (direction.indexOf('false') != -1) {
            currentPage = (startPage - 10) >= (totalPages - (totalPages - 1)) ? (startPage - 10) : 1;
        }

        Contacts.StartNavigation();
        Contacts.AjaxCall(_controller, _method, JSON.stringify({
            currentPage: currentPage,
            contactType: Contacts.GetContactTypeValue(element),
            activeInactive: Contacts.GetIsActive(),
            searchString: Contacts.GetSearchStringValue(),
            pageSize: 10,
            requestMultiplePages: 'true',
            getNextPages: direction,
            hasChildren: Contacts.CheckIfCompanyHasChildren(element),
            loanId: Contacts.GetLoanIdValue()
        }));
    },
    RestartSearch: function (element, gridSearchControlContainer) {
        Contacts.SetSearchControlParametersFromDate(element);
        Contacts.StartNavigation();
        $('#' + _searchStringTextbox).val('Search').css({ 'color': 'rgb(99, 99, 99)' });
        Contacts.SetContactTypeValue(-1);
        Contacts.AjaxCall(_controller, _method, JSON.stringify({
            currentPage: '1',
            contactType: '-1',
            activeInactive: _restartSearch,
            searchString: 'Search',
            pageSize: 10,
            requestMultiplePages: 'false',
            getNextPages: 'null',
            hasChildren: Contacts.CheckIfCompanyHasChildren(element),
            loanId: Contacts.GetLoanIdValue()
        }));
    },
    AddContact: function (element) {
        $(element).parent().parent().addClass('to-be-added');
        var companyId = $(element).parent().parent().find('div.companyId').text();
        Contacts.OpenContactsPopup(0, companyId, $('#hdnCompanyType_' + companyId).val());
    },
    DeleteContact: function (message, element) {
        $(element).parent().parent().addClass('to-be-deleted');
        $('.grayOutContent').show();
        $('#spanMessage').text(message);
        $('.customMessage').show();
        
    },
    OpenDeleteLoanContactPopup: function (contactId) {
        $('#selectedContactId').val(contactId);

        $('.modalBackground').css('display', 'block');
        $('.deleteLoanContact').show();
        
    },

    DeleteLoanContact: function () {
        var contactId = $('#selectedContactId').val();
        $.ajax({
            type: "GET",
            url: 'SystemAdmin/DeleteLoanContact',
            data: 'contactId=' + contactId,
            success: function (result) {

                Contacts.CloseDeleteLoanContactPopup();

                if ($(".loanDetailsCompanyContactOtherSearchContainer .page-selected").length)
                    $(".loanDetailsCompanyContactOtherSearchContainer .page-selected").click();
                else
                    $("#clearOtherSearchButtonCompanyContacts").click();
            },
            error: function () {
            },
            complete: function () {
            }
        });

    },

    CloseDeleteLoanContactPopup: function () {
        $('#selectedContactId').val(-1);

        $('.deleteLoanContact').hide();
        $('.modalBackground').css('display', 'none');
        
    },

    ClosePopup: function () {
        $('.to-be-deleted').removeClass('to-be-deleted');
        $('.grayOutContent').hide();
        $('.customMessage').hide();
        
    },
    DeactivateCompanyMessage: function (message) {
        $('.grayOutContent').show();
        $('#spanMessageCompany').html(message);
        $('.customMessageCompany').show();
    },
    ClosePopupCompany: function () {
        $('.grayOutContent').hide();
        $('.customMessageCompany').hide();
       
    },
    DeactivationConfirmedCompany: function () {
        $('.grayOutContent').hide();
        $('.customMessageCompany').hide();
        Contacts.SaveCompanyData();
    },
    OpenCompanyPopup: function (companyId, contactType) {
        
        $.ajax({
            type: "GET",
            url: 'SystemAdmin/GetCCompanyProfile',
            data: 'companyId=' + companyId + '&contactType=' + contactType,
            success: function (result) {
                $('.modalBackground').fadeIn();
                $("#newBusinessContact").html(result);
            },
            error: function () {
            },
            complete: function () {
            }
        });
    },
    ContinueDeletion: function (element) {
        Contacts.SetSearchControlParametersFromDate(element);
        Contacts.AjaxCall(_controller, "DeleteContactCompany", JSON.stringify({
            CompanyId: $('.to-be-deleted').find('div.companyId').text(),
            ContactId: $('.to-be-deleted').find('div.userId').text(),
            CurrentPage: $('div.page-selected').text()
        }));
    },

    OpenContactsPopup: function (contactId, companyId, contactType) {
      
        $.ajax({
            type: "GET",
            url: 'SystemAdmin/GetCContactProfile',
            data: 'contactId=' + contactId + "&companyId=" + companyId + "&contactType=" + contactType,
            success: function (result) {
                $('.modalBackground').fadeIn();
                $("#newBusinessContact").html(result);
            },
            error: function () {
            },
            complete: function () {
            }
        });
    },

    CloseSystemAdminBusinessContactPopup: function () {
        Contacts.CloseCompanyHistoryPopup();
        Contacts.ClosePopupCompany();
        $('.modalBackground').fadeOut();
        $(".ui-autocomplete").attr("style", "display:none;");
        $(".systemAdminBussinessContactsPopup").hide();
        $('.to-be-added').removeClass('to-be-added');
    },
    ValidateCompanyData: function () {
        var form = $("#frmCCompany");

        $("form").removeData("validator");
        $("form").removeData("unobtrusiveValidation");
        //        form.data('validator').settings.ignore = '';
        $.validator.unobtrusive.parse("#frmCCompany");

        var isValid = form.validate().form();

        if (!isValid) {
            $(".input-validation-error").first().focus();
        }

        return isValid;
    },
    SaveCompanyData: function (element) {
        var form = $("#frmCCompany");
        var urlAction = form.attr("action");

        var data = form.serialize();

        $.ajax({
            url: urlAction,
            cache: false,
            data: data + "&currentPage=" + $('.page-selected').text(),
            type: 'POST',
            //            dataType: 'html',
            success: function (data) {
                //                Contacts.RefreshCurrentPageOfGrid(element);
                if ($("#clearsearchbutton").css("display") == "block")
                    Contacts.Search(element);
                else
                    $('.page-selected').click();
            },
            complete: function (e) {
                Contacts.CloseSystemAdminBusinessContactPopup();

            }
        });


    },
    ValidateContactData: function () {
        var form = $("#frmContact");

        $("form").removeData("validator");
        $("form").removeData("unobtrusiveValidation");
        $.validator.unobtrusive.parse("#frmContact");

        var isValid = form.validate().form();
        if (!isValid && $(".input-validation-error").first().attr("id") != "cCompany_ContactType" && $(".input-validation-error").first().attr("id") != "cCompany_StateId") {
            $(".input-validation-error").first().focus();
        }

        return isValid;
    }
	,
    SaveContactData: function (element) {
        var form = $("#frmContact");
        var urlAction = form.attr("action");

        var data = form.serialize();

        $.ajax({
            url: urlAction,
            cache: false,
            data: data + "&contactType=" + $("#hdnContactType").val() + "&currentPage=" + $('.page-selected').text(),
            type: 'POST',
            //            dataType: 'html',
            success: function (data) {
                //                Contacts.RefreshCurrentPageOfGrid(element);
                if ($("#clearsearchbutton").css("display") == "block")
                    Contacts.Search(element);
                else
                    $('.page-selected').click();
            },
            complete: function (e) {
                Contacts.CloseSystemAdminBusinessContactPopup();

            }
        });

    },
    GetcCompanyTypeView: function (companyId, contactType) {

        var _companyId = $("#cCompanyId").val();

        if ((ctPreviousValue != contactType && _companyId != companyId) || (ctPreviousValue != contactType && _companyId == companyId)) {
            $.ajax({
                type: "GET",
                url: 'SystemAdmin/GetcCompanyTypeView',
                data: 'companyId=' + companyId + "&contactType=" + contactType,
                success: function (result) {

                    $("#cContactType").html(result);
                },
                error: function () {
                },
                complete: function () {

                    $("#frmCCompany").each(function () { $.data($(this)[0], 'validator', false); });
                    $.validator.unobtrusive.parse("#frmCCompany");
                }
            });

            ctPreviousValue = contactType;
        }
    }
	,
    GetcContactTypeView: function (contactId, companyId, contactType) {
        $.ajax({
            type: "GET",
            url: 'SystemAdmin/GetcContactTypeView',
            data: 'contactId=' + contactId + "&companyId=" + companyId + "&contactType=" + contactType,
            success: function (result) {

                $("#cContactType").html(result);
            },
            error: function () {
            },
            complete: function () {
            }
        });
    }
	 ,
    CContactProfileShowHistory: function () {

        var companyId = $("#cCompanyId").val();
        $(".ui-autocomplete").attr("style", "display:none;");
        $.ajax({
            type: "GET",
            url: 'SystemAdmin/GetCContactProfileShowHistory',
            data: 'companyId=' + companyId,
            success: function (result) {
                $('.modalBackgroundUpper').fadeIn();
                $("#businessContactsHistoryPopup").html(result);
            },
            error: function () {
            },
            complete: function () {
            }
        });
    },
    CloseCompanyHistoryPopup: function () {
        $('.modalBackgroundUpper').fadeOut();
        $("#businessContactsHistoryPopup").html("");
        
    },
    CheckIsDuplicateLoginCompany: function (element) {

        var isValid = Contacts.ValidateCompanyData();
        if (!isValid)
            return;

        var form = $("#frmCCompany");
        var data = form.serialize();
        var isDuplicate = false;


        $.ajax({
            type: "POST",
            url: 'SystemAdmin/CheckIsDuplicateLoginCompany',
            data: data,
            success: function (data) {
                if (data.success == true) {

                    isDuplicate = data.isDuplicate;

                }

            },
            error: function () {
            },
            complete: function () {
                if (isDuplicate)
                    $("#cContactsDuplicateValidationMsg").html("This record is duplicate, please change one of required fields!");
                else {
                    $("#cContactsDuplicateValidationMsg").html("");

                    if ($('#cCompany_Deactivated').is(':checked')) {
                        Contacts.DeactivateCompanyMessage("You are attempting to deactivate entire company."
                        + "<br/>" +
                        "All contacts associated to this company will be deactivated. Do you wish to continue?");
                    }
                    else
                        Contacts.SaveCompanyData();
                }

            }
        });
        return isDuplicate;
    },

    CheckIsDuplicateLoginContact: function (element) {
        var isValid = Contacts.ValidateContactData();

        if (!isValid)
            return;

        var form = $("#frmContact");
        var data = form.serialize();
        var isDuplicate = false;

        $.ajax({
            type: "POST",
            url: 'SystemAdmin/CheckIsDuplicateLoginContact',
            data: data,
            success: function (data) {
                if (data.success == true) {
                    isDuplicate = data.isDuplicate;
                }
            },
            error: function () {
            },
            complete: function () {
                if (isDuplicate)
                    $("#cContactsDuplicateValidationMsg").html("This record is duplicate, please change one of required fields!");
                else {
                    $("#cContactsDuplicateValidationMsg").html("");
                    Contacts.SaveContactData(element);
                }

            }
        });

        return isDuplicate;
    },
    ClearSearch: function (element) {


        Contacts.SetSearchControlParametersFromDate(element);

        if (!_isSystemAdminView)
            Contacts.ResizeContactContainerInitialAnimate();

        Contacts.StartNavigation();

        if (_collapseOtherSearchGrids) {
            $(_containerClass).fadeOut();
            $(_showGridContainers).fadeIn();
        }

        $('#' + _searchStringTextbox).val('Search').css({ 'color': 'rgb(99, 99, 99)' });
        Contacts.SetContactTypeValue(-1);
        $(_containerClass + '.imp-div-lcCompanyContact-rowResult').html('');
        Contacts.EndNavigation();
        $('#' + _clearSearchButton).hide();
    },
    CollapseExpandCompanyContacts: function (sender) {

        var element = $(sender.parentNode.parentNode.parentNode).find('div.busniess-contacts-row-child-container');

        if (!element.is(':visible')) {
            //collapse all other expanded contacts
            //$('.busniess-contacts-row-child-container').slideUp();
            //$("div.business-contacts-child-indicator:not('.no-children')").removeClass('imp-aus-arrow-exspanded-div').addClass('imp-aus-arrow-collapsed-div').css({ 'margin-top': '13px' });
            //$('.busniess-contacts-row-container').css({ 'background-color': '#fff', 'border-top': '0px', 'border-bottom': '1px solid #e6e6e6' });
            //$('.busniess-contacts-row-parent').css({ 'background-color': '#fff' });
            //$('div.business-contacts-row-child').unbind('mouseout mouseover');
            //$('div.busniess-contacts-row-parent').unbind('mouseout mouseover');
            //$('.busniess-contacts-row-container').find('div.busniess-contacts-row-parent').removeClass('whiteHover');
            //$('.busniess-contacts-row-child-container').find('div.business-contacts-row-child').removeClass('whiteHover');

            //bind hover events
            hoverFunction($('.busniess-contacts-row-container'));
            hoverFunction($('.busniess-contacts-row-parent'));

            //expand contact that is clicked on
            element.slideDown();
            $(sender.parentNode.parentNode.parentNode).find('div.business-contacts-child-indicator').removeClass('imp-aus-arrow-collapsed-div').addClass('imp-aus-arrow-exspanded-div').css({ 'margin-top': '17px' });
            $('.busniess-contacts-row-container').unbind('mouseover').unbind('mouseout');
            $(sender.parentNode.parentNode.parentNode).css({ 'background-color': '#e7e7e7', 'border-top': '1px solid gray', 'border-bottom': '1px solid gray' });
            $(sender.parentNode.parentNode.parentNode).find('div.busniess-contacts-row-parent').addClass('whiteHover');
            element.find('div.business-contacts-row-child').addClass('whiteHover');

            selectedCompanyHover();
        }
        else {

            element.slideUp();
            $(sender.parentNode.parentNode.parentNode).find('div.business-contacts-child-indicator').removeClass('imp-aus-arrow-exspanded-div').addClass('imp-aus-arrow-collapsed-div').css({ 'margin-top': '14px' });
            $(sender.parentNode.parentNode.parentNode).find('div.business-contacts-row-child').unbind('mouseout mouseover');
            $(sender.parentNode.parentNode.parentNode).find('div.busniess-contacts-row-parent').unbind('mouseout mouseover');
            $(sender.parentNode.parentNode.parentNode).find('div.busniess-contacts-row-parent').removeClass('whiteHover');
            element.removeClass('whiteHover');
            $(sender.parentNode.parentNode.parentNode).css({ 'background-color': '#fff', 'border-top': '0px', 'border-bottom': '1px solid #e6e6e6' });
            hoverFunction($('.busniess-contacts-row-container').eq(index));
            hoverFunction($('.busniess-contacts-row-parent').eq(index));
        }
    },
    RefreshCurrentPageOfGrid: function (element) {
        Contacts.SetSearchControlParametersFromDate(element);
        Contacts.StartNavigation();

        Contacts.AjaxCall(_controller, _method, JSON.stringify({
            currentPage: $('.page-selected').text(),
            contactType: -1,
            activeInactive: Contacts.GetIsActive(),
            searchString: 'Search',
            pageSize: 10,
            requestMultiplePages: 'false',
            getNextPages: 'null',
            hasChildren: Contacts.CheckIfCompanyHasChildren()
        }));
    },
    CloseChooseBuyerSellerAgentPoPup: function () {
        $('.chooseBuyerSellerAgentPoPup').hide();
        $('.modalBackground').css('display', 'none');
    }
    ,
    ShowDuplicateLoanContactPopUp: function () {
        $('.imp-div-duplicateContactPoPup').show();
        $('.modalBackground').css('display', 'block');

        if ($("#businessContactPopup").is(":visible"))
            $('.modalBackground').css('z-index', '103');
    }
    ,
    HideDuplicateLoanContactPopUp: function () {
        $('.imp-div-duplicateContactPoPup').hide();

        if (!($("#businessContactPopup").is(":visible")))
            $('.modalBackground').css('display', 'none');
        else {
            $('.modalBackground').css('z-index', '100');
        }
    },
    EnableIntegrationOff: function () {

        if ($('#companyContactsContactDisabled').is(':checked')) {

            if ($('#contactsEnableIntegrationsOff') != undefined && $('#contactsEnableIntegrationsOff').length > 0) {
                $('#contactsEnableIntegrationsOff').click();

                $('#contactsEnableIntegrationsOff').attr('onclick', 'return false;');
                $('#contactsEnableIntegrationsOn').attr('onclick', 'return false;');
            }
        }
        else {
            if ($('#contactsEnableIntegrationsOff') != undefined && $('#contactsEnableIntegrationsOff').length > 0) {
                $('#contactsEnableIntegrationsOff').removeAttr('onclick');
                $('#contactsEnableIntegrationsOn').removeAttr('onclick');
            }
        }
    }
};


function hoverFunction(element) {
    element.mouseover(function () {
        $(this).css({ 'background-color': '#b8b8b8', 'border-bottom-color': '#b8b8b8' });
    });
    element.mouseout(function () {
        $(this).css({ 'background-color': '#fff', 'border-bottom-color': '#e6e6e6' });
    });
}
function selectedCompanyHover() {
    $('.whiteHover').mouseover(function () {
        $(this).css({ 'background-color': '#fff' });
    });
    $('.whiteHover').mouseout(function () {
        $(this).css({ 'background-color': '#e7e7e7' });
    });
}
function onChangeContactType(e) {
    if (e.value != -1) {

    }
}
function onChangeContactActive(e) {
    if (e.value != 0) {

    }
    
    
}

function InitializeSystemAdminContactsEvents() {

    hoverFunction($('.busniess-contacts-row-container'));

    $(".businessCCompanyEdit").click(function () {
        var companyId = $(this).closest(".busniess-contacts-row-parent").find(".companyId").html();
        var contactType = $(this).closest(".busniess-contacts-row-parent").find(".businessContactsContactType").html();

        Contacts.OpenCompanyPopup(companyId, contactType);

    });

    $(".businessCContactsEdit").click(function () {
        var contactId = $(this).closest(".business-contacts-row-child").find(".userId").html();
        var companyId = $(this).closest(".busniess-contacts-row-container").find(".companyId").html();
        var contactType =$(this).closest(".busniess-contacts-row-container").find(".businessContactsContactType").html();

        Contacts.OpenContactsPopup(contactId, companyId, contactType);

    });

    $("#txtcCompanyZip").keyup(function () {
        var IsZipCodeValidBPresent = false;
        
        if ($("#txtcCompanyZip").val().length > 4) {
            $(this).FillAndValidateZipCode({ cityID: 'txtcCompanyCity', stateID: 'cCompany_StateId', IsValid: function (isZipValid) {
                IsZipCodeValidBPresent = isZipValid;

            }
            });

        }

    });
}
