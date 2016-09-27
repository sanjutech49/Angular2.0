zipdata = {
    GetZipData: function (zipcode, successfunc, errorfunc) {
        $.ajax({
            type: "POST",
            url: "/Validation/GetZipData",
            contentType: "application/json; charset=utf-8",
            data: "{ 'zip': '" + zipcode + "' }",
            dataType: "json",
            success: function (msg) {
                successfunc(msg);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                errorfunc(thrownError);
            }
        });
    }
}