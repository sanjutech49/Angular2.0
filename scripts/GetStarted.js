GetStarted = {
    StartNewProspect: function (data, fromManageProspect) {
        GetStarted.StartNewProspectOnBegin(fromManageProspect);
        BindStartNewProspectEvents();
        $.ajax({
            type: "GET",
            url: "Command/Execute",
            cache: false,
            data: data,
            dataType: "html",
            success: function (result) {
                $("#detailsSection").html(result);
                HideProcessingInfo();
            },
            error: function (jqXHR, textStatus, errorThrown) {

            },
            complete: function (jqXHR, textStatus) {


            }

        });
    },
    StartNewProspectOnBegin: function (fromManageProspect) {
        ShowProcessingInfo();
        $("#detailsSection").slideDown(400);

        if (fromManageProspect != true) {
            $(".biggreens").attr("class", "biggreen");
            $(".tablelistselected").attr("class", "prospecttablelist");
        }

        if ($("#minmax").hasClass("min"))
            $("#minmax").trigger("click");

        if ($("#loandetailsminmax").hasClass('min'))
            $("#minimizeloandetails").click();
    },
    ShowIFrame: function (data) {
        $("#borrowerEmbeddedFrameLoading").fadeOut();
        $("#borrowerEmbeddedFrame").fadeIn();

        $.receiveMessage(
                    function (event) {
                        var eventdata = JSON.parse(event.data);
                        // if offset is set as parameter, scroll to it
                      
                        if (eventdata.mouseMoveInIframe !== undefined) {                           
                            BindSessionExpirationEvents();
                            return;
                        }

                        if (eventdata['toOffSet'] != undefined) {
                            $.scrollTo(eventdata['toOffSet'] + $('#detailsSection').offset().top, eventdata['timeout']);
                        }
                        if (eventdata['height'] != undefined) {

                            
                            $('#borrowerEmbeddedFrame').animate({
                                height: eventdata['height']
                            });
                        }

                        var pos = $('#detailsSection .getstarteddiv').offset();
                        var navbarHeightCss = $(".navbar-fixed-top").css("height")
                        var navbarHeight = "50";
                        if (navbarHeightCss != undefined)
                            navbarHeight = navbarHeightCss.replace("px", "");

                        if (eventdata['isPostBack'] != 'True' && pos != null)
                            $('html,body').animate({ scrollTop: pos.top - navbarHeight });

                        if (eventdata['closeView'] != undefined && eventdata['closeView'] == 'True') {
                            if ($("#minmax").hasClass("max"))
                                $("#minmax").trigger("click");

                            $("#detailsSection").slideUp(400);
                            $("#detailsSection").html("");

                            if (eventdata['currentLoanId'] != undefined || eventdata['contactId'] != undefined || eventdata['contactId'] != null) {
                                ConciergeCommandEmbedded.ChangeToCommand(eventdata);
                            }
                        }
                    });

        $("#borrowerEmbeddedFrame").removeAttr("onload");
    }
}
