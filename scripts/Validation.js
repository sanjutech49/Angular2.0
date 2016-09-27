var emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

var emailInvalidMessage="Please enter a valid email address.";
var zipCodeInvalidMessage = "Please enter valid zip code.";
var requiredText = "Please insert information.";
var comboBoxRequiredMessage = "Please select some option.";

//var IsZipCodeValid = false;
(function ($) {
    $.fn.ValidateEmail = function () {

        var IsValid = false;
        if (emailRegex.test(this.val())) {
            IsValid = true;
        }
        setValid(this, IsValid, emailInvalidMessage);

        return IsValid;
    },
    
    $.fn.ValidateRequiredFormFields = function (options ) {
       
        var settings = $.extend({
        // These are the defaults.
        fieldName: "field",
        maxLength: 100,
        minLenght: 1}, options );

        var message = settings.fieldName + " is required.";
        
        var IsValid = false;
        var length = this.val().length;
        if ( this.val() != "" ) 
            IsValid = true;
        
        if (  IsValid && settings.minLenght <= length) 
            IsValid = true;
        else if(IsValid){
             message = "Minimum length of "+ settings.fieldName + " is " + settings.minLenght + " characters.";
            IsValid = false;
        }
           
        
       if (  IsValid && settings.maxLength >= length ) 
            IsValid = true;
       else if(IsValid){
            message = "Maximum length of "+ settings.fieldName + " is " + settings.maxLength + " characters.";
           IsValid = false;
       }
         
        setValidWithMessage(this, IsValid, message);

        return IsValid;
    },

        $.fn.ValidatePhoneField = function (options ) {
       
        var settings = $.extend({
        // These are the defaults.
        fieldName: "Phone",
        isRequired: false,
        fullNumber: false
        }, options );

        var message = settings.fieldName + " is required.";
        
        var IsValid = true;
        var length = this.val().length;
        if ( settings.isRequired == true && this.val() == "" ) 
            IsValid = false;
        
        if (  IsValid &&  length == 14 && settings.fullNumber) 
            IsValid = true;
        else if(IsValid && settings.fullNumber){
             message = settings.fieldName + " number is incomplete.";
            IsValid = false;
        }
           
         
        setValidWithMessage(this, IsValid, message);

        return IsValid;
    },
    $.fn.ValidateComboBox = function (options) {
        $.fn.ValidateComboBox.defaultOptions = {
            isRadComboBox: true,
            defaultValue: '-1'
        };
        options = $.extend({}, $.fn.ValidateComboBox.defaultOptions, options);
        
        var value;
        var element;

        if(options.isRadComboBox){        
            value = this.data("tDropDownList").value().trim();
            element= this.parent().children('.t-dropdown-wrap');
        }
        else{
            value = this.val().trim();
            element = this;
        }

        if(value==options.defaultValue){
            setValid(element, false, comboBoxRequiredMessage, true);
            return false;
        }
        else{
            setValid(element, true, "", true);
            return true;
        }

    },

    $.fn.ValidateTextBox = function (options) {
    var isValid = true;
    //these default options can be extended with some more...
        $.fn.ValidateTextBox.defaultOptions = {
            required: true,
            validateLength: false,
            maxlength: 250,
            minlength: 1,
            isInt: false,
            isCreditCardNumber: false,
            creditcardType: 1
        }

     options = $.extend({}, $.fn.ValidateTextBox.defaultOptions, options);

     var value = this.val().trim();
  
     if(options.required && (value.length<=0 || value == 0)){
            isValid = false;
            setValid(this, false, requiredText);
        }
     
     if( isValid && options.validateLength && value.length > options.maxlength ){
            isValid = false;
            setValid(this, false, "Only " + options.maxlength + " characters are supported.");
        }

     if( isValid && options.validateLength && value.length < options.minlength ){
            isValid = false;
            setValid(this, false, "At least " + options.minlength + " characters are needed.");
        }

     if( isValid && options.isInt && !isNumber( value ) ){
        isValid = false;
        setValid(this, false, "Only numbers are supported.");
     }
    
     if(isValid){
            setValid(this,true,"");
        }

     if(isValid && options.isCreditCardNumber ){
        ValidateCreditCardNumber(this, options.creditcardType, value);
     }

    },

    $.fn.FillAndValidateZipCode = function(options){

        //these default options can be extended with some more...
        $.fn.FillAndValidateZipCode.defaultOptions = {
            cityID: 'txtCityContact',
            stateID: 'contactState',
            IsValid: null,
            isTelerik: true
        }

        options = $.extend({}, $.fn.FillAndValidateZipCode.defaultOptions, options);     
        var element = this;
            if (element.val().length == 5 && element.val().indexOf("_") == -1) {

            var citySelector = "#" + options.cityID;
            var stateSelector = "#" + options.stateID;
              
                var isTelerik = options.isTelerik;
            zipdata.GetZipData(element.val(), function (result, callback) {
                if (result != null) {
                    $.isFunction( options.IsValid ) && options.IsValid.call( this, true );
                    setValid(element, true, zipCodeInvalidMessage);

                    if (result.City != null)
                        $(citySelector).val(result.City);
                    else {
                        $.isFunction( options.IsValid ) && options.IsValid.call( this, false );
                        $(citySelector).val("");
                        setValid(element, false, zipCodeInvalidMessage);                      
                    }  

                    if (result.State != null) {
                        
                        if(isTelerik)
                        {
                            var combo = $(stateSelector).data("tDropDownList");
                            var data = combo.data;
                            if(combo.data != null && combo.data != undefined)
                            {
                                for(var i=0; i<combo.data.length; i++)
                                {
                                    if(data[i].Text == result.State)
                                    {
                                        combo.text(data[i].Text);
                                        combo.value(data[i].Value);
                                        return false;
                                    }
                                }
                            }
                        }
                        else 
                        {
                           var mvcddlVal =  $(stateSelector + " option:contains('" + result.State +"')").val();
                            
                            if(typeof mvcddlVal != 'undefined') 
                            {
                                $(stateSelector).val(mvcddlVal);
                            }
                        }
                    }         
                }
                else {
                    $.isFunction( options.IsValid ) && options.IsValid.call( this, false );
                    $(citySelector).val("");
                    setValid(element, false, zipCodeInvalidMessage);                      
                }
            },
                function (error) { });    
        }
        else
        {
            $.isFunction( options.IsValid ) && options.IsValid.call( this, false );
            setValid(element, false, zipCodeInvalidMessage);
        }
    },
    
   $.fn.FillAndValidateZipCodeContacts = function(options){

        //these default options can be extended with some more...
        $.fn.FillAndValidateZipCode.defaultOptions = {
            cityID: 'txtCityContact',
            stateID: 'contactState',
            IsValid: null,
            isTelerik: true,
            functionExecute: function () {}
        }

        options = $.extend({}, $.fn.FillAndValidateZipCode.defaultOptions, options);     
        var element = this;
            if (element.val().length == 5 && element.val().indexOf("_") == -1) {

            var citySelector = "#" + options.cityID;
            var stateSelector = "#" + options.stateID;
            var isTelerik = options.isTelerik;
            var functionExecute = options.functionExecute;  
                
            zipdata.GetZipData(element.val(), function (result, callback) {
                if (result != null) {
                    $.isFunction( options.IsValid ) && options.IsValid.call( this, true );
                    setValidContacts(element, true, zipCodeInvalidMessage);
                   
                    if (result.City != null)
                       { $(citySelector).val(result.City); functionExecute(); }
                    else {
                        $.isFunction( options.IsValid ) && options.IsValid.call( this, false );
                        $(citySelector).val("");
                        setValidContacts(element, false, zipCodeInvalidMessage);
                    }  

                    if (result.State != null) {
                        
                        if(isTelerik)
                        {
                            var combo = $(stateSelector).data("tDropDownList");
                            var data = combo.data;
                            if(combo.data != null && combo.data != undefined)
                            {
                                for(var i=0; i<combo.data.length; i++)
                                {
                                    if(data[i].Text == result.State)
                                    {
                                        combo.text(data[i].Text);
                                        combo.value(data[i].Value);
                                        return false;
                                    }
                                }
                            }
                        }
                        else 
                        {
                           var mvcddlVal =  $(stateSelector + " option:contains('" + result.State +"')").val();
                            
                            if(typeof mvcddlVal != 'undefined') 
                            {
                                $(stateSelector).val(mvcddlVal);
                            }
                        }
                    } 
                    functionExecute();
                }
                else {
                    $.isFunction( options.IsValid ) && options.IsValid.call( this, false );
                    $(citySelector).val("");
                    setValidContacts(element, false, zipCodeInvalidMessage);  
                }
            },
                function (error) { });    
        }
        else
        {
            $.isFunction( options.IsValid ) && options.IsValid.call( this, false );
            setValidContacts(element, false, zipCodeInvalidMessage);
        }
    }

})(jQuery);

function setValid(element, isValid, message, isComboBox) {

    if(typeof(isComboBox)==='undefined') isComboBox = false;

    if(isValid && element.hasClass("notValid"))
    {
        element.removeClass("notValid");
        $("#validationTooltip").hide();
    }
    else if(!isValid)
    {
        var pos = element.offset();
        var goToPosition = { left: (pos.left - 5), top: (pos.top - $("#validationTooltip").height()) };

        if ($(element).val() != "" || isComboBox) {
            $("#spnTooltipMessage").text(message);
        }
        else {
            $("#spnTooltipMessage").text("Please Enter Value!");
        }
        $("#validationTooltip").css({
            'top': goToPosition.top,
            'left': goToPosition.left
        }).show();
        element.addClass("notValid");
    }
}


function setValidContacts(element, isValid, message) 
{
    if(isValid && element.hasClass("notValid"))
    {
        element.removeClass("notValid");
        element.qtip("destroy");
    }
    else if(!isValid)
    {
        element.addClass("notValid");
        ValidationQtipPopUp(element, message);
    }
}


function setValidWithMessage(element, isValid, message, isComboBox) {
   
    $( ".notValid" ).each(function() {
    $( this ).removeClass( "notValid" );
    });
    
    if(typeof(isComboBox)==='undefined') isComboBox = false;

    if(isValid && element.hasClass("notValid"))
    {
        element.removeClass("notValid");
        $("#validationTooltip").hide();
    }
    else if(!isValid)
    {
        var pos = element.offset();
        var goToPosition = { left: (pos.left - 5), top: (pos.top - $("#validationTooltip").height()) };

        $("#spnTooltipMessage").text(message);
        
        $("#validationTooltip").css({
            'top': goToPosition.top,
            'left': goToPosition.left
        }).show();
        element.addClass("notValid");
    }
}

function isNumber(n) {
    return !isNaN(parseInt(n)) && isFinite(n);
}

function ValidateCreditCardNumber (element, cardtype, cardnumber) {
    $.ajax({
        type: "POST",
        url: "/Validation/ValidateCreditCardNumber",
        contentType: "application/json; charset=utf-8",
        data: "{ 'CardType': " + cardtype + ", 'CardNumber': '" + cardnumber + "' }",
        dataType: "json",
        success: function (data) {
        if(data.isValidCreditCardNumber)
            {
                setValid($(element),true,"");
            }
        else
            {
                setValid($(element),false,"Invalid credit card number.");
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
        }
    });
}


function ValidateCCData()
{
    // Get data from form
    var data = {
            BillingInformationid: $("#hdnBillingId").val(),
            CreditCardType: $("#uxCreditCardType").data("tDropDownList").value() != -1 ? $("#uxCreditCardType").data("tDropDownList").value() : "",
            CreditCardNumber: $("#txtCreditCardNr").val(),
            CCV: $("#txtCCVNr").val(),
            NameOnCard: $("#txtNameOnCard").val(),
            ExpirationDate: $("#uxExpirationYear").data("tDropDownList").value() + "-" + $("#uxExpirationMonth").data("tDropDownList").value() + "-01"
        };

    // Validate data
    $.ajax({
        type: "POST",
        url: "/Validation/ValidateCreditCardNumber",
        contentType: "application/json; charset=utf-8",
        data: data,
        dataType: "json",
        success: function (data) {
            return data.Status;
        },
        error: function (xhr, ajaxOptions, thrownError) {
            window.console && console.log("Error: " , thrownError);
        }
    });
}

    function ValidationQtipPopUp (element, textMessage) 
    {
       
        var show = element.hasClass("input-validation-error");
      
        var corners = ['bottom center', 'top center'];
        var flipIt = element.parents('span.right').length > 0;
        element.filter('.notValid').qtip({
            content: { text: "<span>"+ textMessage +"</span>"}, 
            position: {           
                my: corners[0],
                at: corners[1],
                viewport: $(window)
            },
            show: { solo: true },
            hide:{ when: { event: 'click' } },
            style: { classes: 'ui-tooltip-red ui-tooltip-red-contacts' }
        });
    }
