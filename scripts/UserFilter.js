UserFilter = {
    Refresh: function () {
        $.ajax({
            type: 'GET',
            url: '/Command/Execute',
            cache: false,
            data: 'Command=UserFilterDataLoad',
            success: function (data) {
                $('#filtersection').html(data);
            },
            complete: function (jqXHR, textStatus) {
            }
        });
    },

    BranchOnChange: function () {
        if (AreThereAnyChangesOnManageFees(UserFilter.BranchOnChange, null) == true)
            return;

        var dropDownList = $("#BranchId").data("tDropDownList");
        var selectedValue = dropDownList.value();
        $.ajax({
            type: 'GET',
            url: '/Command/Execute',
            cache: false,
            data: 'Command=UserFilterLoadUsers,BranchId=' + selectedValue,
            success: function (data) {
                $('#filtersection').html(data);
                
            },
            complete: function (jqXHR, textStatus) {
            }
        });
    },
    CompanyOnChange: function () {
        var dropDownList = $("#CompanyId").data("tDropDownList");
        var selectedValue = dropDownList.value();
        $.ajax({
            type: 'GET',
            url: '/Command/Execute',
            cache: false,
            data: 'Command=UserFilterLoadChannels,CompanyId=' + selectedValue,
            success: function (data) {
                $('#filtersection').html(data);
            },
            complete: function (jqXHR, textStatus) {
            }
        });
    },

    ChannelOnChange: function () {
        var dropDownList = $("#ChannelId").data("tDropDownList");
        var selectedValue = dropDownList.value();
        $.ajax({
            type: 'GET',
            url: '/Command/Execute',
            cache: false,
            data: 'Command=UserFilterLoadDivisions,ChannelId=' + selectedValue,
            success: function (data) {
                $('#filtersection').html(data);
            },
            complete: function (jqXHR, textStatus) {
            }
        });
    },

    DivisionOnChange: function () {
        var dropDownList = $("#DivisionId").data("tDropDownList");
        var selectedValue = dropDownList.value();
        $.ajax({
            type: 'GET',
            url: '/Command/Execute',
            cache: false,
            data: 'Command=UserFilterLoadBranches,DivisionId=' + selectedValue,
            success: function (data) {
                $('#filtersection').html(data);
            },
            complete: function (jqXHR, textStatus) {
            }
        });
    },

    ClearAllFilters: function () {
        $.ajax({
            type: 'GET',
            url: '/Command/Execute',
            cache: false,
            data: 'Command=UserFilterClear',
            success: function (data) {
                $('#filtersection').html(data);
                Refresh.RefreshDataHelper();
            },
            complete: function (jqXHR, textStatus) {
            }
        });
    },

    SortFilters: function () {
        var dropDownList = $("#UserId").data("tDropDownList");
        var selectedValue = dropDownList.value();   
        UserFilter.UserOnChange();       
    },

    UserOnChange: function () {
        if (AreThereAnyChangesOnManageFees(UserFilter.UserOnChange, null) == true)
            return;

        var dropDownList = $("#UserId").data("tDropDownList");
        ShowProcessingInfo();
        var selectedValue = dropDownList.value();
        var filterContext = $("#FilterContext").val();
        var branchId = $("#hdnBranchId").val();

        $.ajax({
            type: 'GET',
            url: '/Command/Execute',
            cache: false,
            data: 'Command=UserFilterSelectedUserChanged,UserId=' + selectedValue,
            success: function (data) {
                $('#mainsection').html(data);
                BindRightClickMenu();
                UpdateNumberOfRecordsInTabs();

                $("[id='task 0']").click();
            },
            complete: function (jqXHR, textStatus) {
                CloseProcessingInfo();
            }
        });
    },

    OrderTypeChang: function () {


    },

    NonConformingChange: function () {

    },

    ExceptionChange: function () { 
    
    },


};