
(function ($) {

    $.fn.extend({

        mmlZipData: function (fields, allState) {

            if (!this.length || this.length > 1)
                return $(this);
            if (fields == undefined || fields == null)
                return $(this);
            if (fields.state == undefined)
                return $(this);
            var jqZip = $(this);

            var rcbState = fields.state;
            var rcbCounty = fields.county;

            var txtCity = fields.city != undefined ? fields.city : undefined;
            var txtUnit = fields.unit != undefined ? fields.unit : undefined;
            var txtAddress = fields.address != undefined ? fields.address : undefined;

            var loanType = fields.loantype != undefined ? fields.loantype : 2;

            var MllZipCodeExecuteStateSelectedIndexChanged = true;

            //Zip code changed

            $(this).bind("keyup click", function (e) {
                var keyPressed = e.keyCode ? e.keyCode : e.charCode;

                var zipcode = jqZip.val();

                if (keyPressed == 16) return;

                var ajaxurl = (allState == true) ? "/Loan/GetZipData" : "/Loan/GetZipDataByLoanType";

                if (zipcode.length == 5 && zipcode.indexOf("_") == -1) {

                    $.ajax({
                        type: "GET",
                        url: ajaxurl,
                        cache: false,
                        data: "zip=" + zipcode + "&loanType=" + loanType,
                        // dataType: "html",
                        success: function (result) {
                            if (result != null) {

                                if (result.ErrorMessage != null && result.ErrorMessage != "") {
                                    jqZip.attr("errormessage", result.ErrorMessage);
                                }
                                else
                                    jqZip.removeAttr("errormessage");

                                MllZipCodeExecuteStateSelectedIndexChanged = false;
                                if (txtCity != undefined) {
                                    if (result.City != null) {
                                        $("#" + txtCity).val(result.City);
                                    }
                                    else {
                                        $("#" + txtCity).val("");
                                    }

                                    $("#" + txtCity).trigger("change");
                                }


                                if (result.State != null) {

                                    var combo = $("#"+rcbState).data("tDropDownList");
                                    var data = combo.data;
                                    if (combo.data != null && combo.data != undefined) {
                                        for (var i = 0; i < combo.data.length; i++) {
                                            if (data[i].Text == result.State) {
                                                combo.text(data[i].Text);
                                                combo.value(data[i].Value);
                                                return false;
                                            }
                                        }
                                    }

                                }

                                if (result.Counties != null && rcbCounty != undefined) {

                                    var combo = $find(rcbCounty);

                                    var items = combo.get_items();

                                    items.clear();

                                    if (result.Counties.length == 0) {
                                        items.clear();
                                        combo.set_text("-");
                                    }
                                    else {
                                        for (var i = 0; i < result.Counties.length; i++) {
                                            var comboItem = new Telerik.Web.UI.RadComboBoxItem();
                                            comboItem.set_text(result.Counties[i]);
                                            comboItem.set_value(i);
                                            items.add(comboItem);
                                        }
                                    }

                                    combo.commitChanges();
                                }

                                if (result.County != null && rcbCounty != undefined) {
                                    var selectItem = combo.findItemByText(result.County);

                                    if (selectItem != null)
                                        selectItem.select();
                                }

                            }
                            else {
                                if (txtCity != undefined)
                                    $("#" + txtCity).val("");

                                if (rcbState != undefined) {
                                    var combo = $find(rcbState);

                                    if (combo != null) {
                                        var comboItem = combo.findItemByText("CA");

                                        if (comboItem != null)
                                            comboItem.select();
                                    }
                                }
                            }

                        },
                        error: function (xhr, ajaxOptions, thrownError) { }
                    });
                }

            });

            //State Changed

            var rcbCombobox = $find(rcbState);

            if (rcbCombobox != null && rcbCounty != undefined) {

                rcbCombobox.add_selectedIndexChanged(function (sender, eventArgs) {

                    if (MllZipCodeExecuteStateSelectedIndexChanged) {
                        var stateName = sender.get_text();
                        var zip = "";

                        $.ajax({
                            type: "POST",
                            url: "./Services/ZipData.asmx/GetCountyByState",
                            contentType: "application/json; charset=utf-8",
                            data: "{ 'state': '" + stateName + "' , 'zip': '" + zip + "' }",
                            dataType: "json",
                            success: function (msg) {

                                var result = msg.d;

                                if (result != null) {

                                    var rcbPropertyCounty = $find(rcbCounty);

                                    var items = rcbPropertyCounty.get_items();

                                    items.clear();

                                    if (result.length == 0) {
                                        items.clear();
                                        rcbPropertyCounty.set_text("-");
                                        return
                                    }
                                    else {
                                        for (var i = 0; i < result.length; i++) {
                                            var comboItem = new Telerik.Web.UI.RadComboBoxItem();
                                            comboItem.set_text(result[i]);
                                            comboItem.set_value(i);
                                            items.add(comboItem);
                                        }
                                    }
                                    rcbPropertyCounty.commitChanges();
                                    var firstItem = items.getItem(0);
                                    firstItem.select();

                                    jqZip.val("");

                                    if (txtAddress != undefined)
                                        $("#" + txtAddress).val("");

                                    if (txtUnit != undefined)
                                        $("#" + txtUnit).val("");

                                    if (txtCity != undefined)
                                        $("#" + txtCity).val("");

                                }

                            },
                            error: function (xhr, ajaxOptions, thrownError) { }
                        });
                    }
                    else {

                        MllZipCodeExecuteStateSelectedIndexChanged = true;

                    }

                });

            }
            else if (rcbCombobox != null) {
                rcbCombobox.add_selectedIndexChanged(function () {
                    if (MllZipCodeExecuteStateSelectedIndexChanged) {

                        /*jqZip.val("");

                        if (txtAddress != undefined)
                        $("#" + txtAddress).val("");

                        if (txtUnit != undefined)
                        $("#" + txtUnit).val("");

                        if (txtCity != undefined)
                        $("#" + txtCity).val("");*/

                    }
                    else {

                        MllZipCodeExecuteStateSelectedIndexChanged = true;

                    }
                });
            }

            return $(this);

        },

        mmlzipdata: $.fn.mmlZipData

    });

})(jQuery);