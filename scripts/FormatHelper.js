$(function () {
    FormatHelper();
});
function FormatHelper() {

    var emptyField = false;

    $(".Amount,.manageFeesAmount").live("keydown", function (event) {
        // Allow: backspace, delete, tab, escape, and enter
        if (event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 || event.keyCode == 13 || event.keyCode == 110 || event.keyCode == 188 || event.keyCode == 190 ||
        // Allow: Ctrl+A
            (event.keyCode == 65 && event.ctrlKey === true) ||
        // Allow: home, end, left, right
            (event.keyCode >= 35 && event.keyCode <= 39)) {
            // let it happen, don't do anything
            return;
        }
        else {
            // Ensure that it is a number and stop the keypress
            if (event.shiftKey || (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105)) {
                event.preventDefault();
            }
        }

        if (emptyField)
            emptyField = false;
    });

    $(".Percent,.NegativeAmount,.manageFeesPercent").live("keydown", function (event) {
        // Allow: backspace, delete, tab, escape, and enter
        if (event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 || event.keyCode == 13 || event.keyCode == 110 || event.keyCode == 188 || event.keyCode == 190 ||
        // Allow: Ctrl+A, Negative values
            (event.keyCode == 65 && event.ctrlKey === true) || (event.keyCode == 173 && !event.shiftKey) || event.keyCode == 109  ||
        // Allow: home, end, left, right
            (event.keyCode >= 35 && event.keyCode <= 39)) {
            // let it happen, don't do anything
            return;
        }
        else {
            // Ensure that it is a number and stop the keypress
            if (event.shiftKey || (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105)) {
                event.preventDefault();
            }
        }

        if (emptyField)
            emptyField = false;
    });

    $(".Number").live("keydown", function (event) {
        // Allow: backspace, delete, tab, escape, and enter
        if (event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 || event.keyCode == 13 || event.keyCode == 110 ||
        // Allow: Ctrl+A
            (event.keyCode == 65 && event.ctrlKey === true) ||
        // Allow: home, end, left, right
            (event.keyCode >= 35 && event.keyCode <= 39)) {
            // let it happen, don't do anything
            return;
        }
        else {
            // Ensure that it is a number and stop the keypress
            if (event.shiftKey || (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105)) {
                event.preventDefault();
            }
        }

        if (emptyField)
            emptyField = false;
    });

    $('.Amount,.Percent,.manageFeesAmount,.manageFeesPercent').live("mouseup", function () {
        SelectAll(this);
    });


    $('.Amount,.Percent,.NegativeAmount,.manageFeesAmount,.manageFeesPercent').live("focus", function () {
        RemoveUnwanted(this);
                   
        if ($(this).val() == "")
            emptyField = true;
        else
            emptyField = false;

    });

    function SelectAll(id) {
        id.focus();
        id.select();
    }


    function SetFormat(ob, fieldFormat, emptyField) {
        var value = ob.value;
        if (fieldFormat == 'Currency') {
            ob.value = CurrencyFormatted(value, emptyField);
        }
        if (fieldFormat == 'Percentage') {
            ob.value = PercentageFormatted(value, emptyField);
        }
    }

    $('.Percent,.manageFeesPercent').live("blur", function () {
        SetFormat(this, 'Percentage', emptyField);
    });

    $('.Amount,.NegativeAmount,.manageFeesAmount').live("blur", function () {
        SetFormat(this, 'Currency', emptyField);
    });


    function RemoveUnwanted(element) {
        var value = $(element).val();

        if (value != null && value != undefined) 
                $(element).val(value.replace(/[^\d.-]/g, ''));
    }


    function PercentageFormatted(num, emptyField) {

        if (num == null)
            return '';

        num = num.toString().replace(/\%|\,/g, '');
        if (isNaN(num))
            num = "0";
        sign = (num == (num = Math.abs(num)));
        num = Math.floor(num * 1000 + 0.50000000001);
        cents = num % 1000;
        num = Math.floor(num / 1000).toString();
        if (cents > 10 && cents < 100 && cents != 0)
            cents = "0" + cents;
        if (cents < 10)
            cents = "00" + cents;
        for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
            num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3));


        if (emptyField == true && num == "0") {
            return "";
        }

        return (((sign) ? '' : '-') + num + '.' + cents );
    }
}

function CurrencyFormatted(num, emptyField) {

    if (num == null)
        return '';

    num = num.toString().replace(/\$|\,/g, '');
    if (isNaN(num))
        num = "0";
    sign = (num == (num = Math.abs(num)));
    num = Math.floor(num * 100 + 0.50000000001);
    cents = num % 100;
    num = Math.floor(num / 100).toString();
    if (cents < 10)
        cents = "0" + cents;
    for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
        num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3));

    if (emptyField == true && num == "0") {
        return "";
    }
    return (((sign) ? '' : '-') + num + '.' + cents);
}