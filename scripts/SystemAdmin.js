SystemAdmin = {
    Search: function (element, searchValue, isOldSearch) {

        var controllerName = $("#menu").find("ul").find("li.selected").text().trim().replace(' ', '');
        var searchTerm;
        if (isOldSearch) {
            searchTerm = $("#searchinput").val();
        } else {
            searchTerm = searchValue;
        }
      
        

        switch (controllerName) {
            case "Contacts":
                Contacts.Search(element, searchValue, isOldSearch);
                break;
            case "InvestorConfiguration":
                InvestorConfiguration.Search(searchTerm);
                break;
            default:
                break;
        }    
    },
    ClearSearch: function (element) {
        $(".clearsearchbutton").hide();
        $('#searchinput').val('Search').css({ 'color': 'rgb(99, 99, 99)' });
        SystemAdmin.Search(element);
    },
    SearchInputKeydown: function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            SystemAdmin.Search(event);
        }
    }
};
