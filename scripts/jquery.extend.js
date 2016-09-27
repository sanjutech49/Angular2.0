(function ($) {

    $.validator.unobtrusive.onError = function(error, inputElement) { // 'this' is the form element       
        var container = $(this).find("[data-valmsg-for='" + inputElement[0].name + "']"),
            replace = $.parseJSON(container.attr("data-valmsg-replace")) !== false;

        // Remove the following line so the default validation messages are not displayed       
        // container.removeClass("field-validation-valid").addClass("field-validation-error");

        error.data("unobtrusiveContainer", container);

        if (replace) {
            container.empty();
            error.removeClass("input-validation-error").appendTo(container);
        }
        else {
            error.hide();
        }

        /**** Added code to display the error message in a qTip tooltip ****/
        // Set positioning based on the elements position in the form
        var elem = $(inputElement),
            corners = ['left center', 'right center'],
            flipIt = elem.parents('span.right').length > 0;

        // Check we have a valid error message
        if (!error.is(':empty')) {
            // Apply the tooltip only if it isn't valid
            elem.filter(':not(.valid)').qtip({
                    overwrite: false,
                    content: error,
                    position: {
                        my: corners[flipIt ? 0 : 1],
                        at: corners[flipIt ? 1 : 0],
                        viewport: $(window)
                    },
                    show: {
                        event: false,
                        ready: true
                    },
                    hide: false,
                    style: {
                        classes: 'ui-tooltip-red' // Make it red... the classic error colour!
                    }
                })

                // If we have a tooltip on this element already, just update its content
                .qtip('option', 'content.text', error);
        }

            // If the error is empty, remove the qTip
        else { elem.qtip('destroy'); }
    };
})(jQuery);