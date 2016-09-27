

function OverrideAddClass() {
    var originalAddClassMethod = jQuery.fn.addClass;

    jQuery.fn.addClass = function () {
        // Execute the original method.

        var result = originalAddClassMethod.apply(this, arguments);

        // call your function
        // this gets called everytime you use the addClass method

        if ($(this).hasClass("imp-ddl-contacts"))
        { this.trigger("addClassChange");  }

    // return the original result
        return result;
    };
}

function OverrideRemoveClass() {
    var originalRemoveClassMethod = jQuery.fn.removeClass;
    jQuery.fn.removeClass = function () {

        var result = originalRemoveClassMethod.apply(this, arguments);

        if ($(this).hasClass("imp-ddl-contacts"))
        { this.trigger("removeClassChange");  }

        return result;
    };
}
function InitializeContactsControlsValidationDesign() {
   
    OverrideAddClass();
    OverrideRemoveClass();
    $('select.imp-ddl-contacts').bind('addClassChange removeClassChange', function (event) {

        var element = $(this);

        if (element.hasClass('input-validation-error')) {
            element.parent().removeClass('imp-span-ddl-contacts-container-focus').addClass('container-input-validation-error');
        }
        else if (!(element.hasClass('notValid'))) {
            element.parent().removeClass('container-input-validation-error'); 
            if (element.is(":focus")) {
                element.parent().addClass('imp-span-ddl-contacts-container-focus');
            } 
        }

        if (element.hasClass("imp-ddl-contacts-disabled")) {
            element.parent().addClass('container-input-disabled');
            element.parent().removeClass('imp-span-ddl-contacts-container-focus');
           
        }
        else {
            element.parent().removeClass('container-input-disabled');
        }

        if (element.hasClass('notValid')) {
            element.parent().removeClass('imp-span-ddl-contacts-container-focus').addClass('container-input-validation-error');
        }
        else if (!(element.hasClass('input-validation-error'))) {
            element.parent().removeClass('container-input-validation-error'); if (element.is(":focus")) {
                element.parent().addClass('imp-span-ddl-contacts-container-focus');
            } 
        }
    });

}


function InitializeContactsControlsEvents() {
    $(".imp-span-ddl-contacts-container").live("focus", function () {
        var element = $(this);
        if (!(element.hasClass('container-input-validation-error')) )
        { element.addClass('imp-span-ddl-contacts-container-focus'); }
        else {
            element.removeClass('imp-span-ddl-contacts-container-focus');
        }
    });

    $(".imp-span-ddl-contacts-container").live("focusout", function () {
        var element = $(this);
        element.removeClass('imp-span-ddl-contacts-container-focus');
    });
}