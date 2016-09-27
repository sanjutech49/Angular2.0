AdditionalViews =
    {
        AdditionalViewSectionOnBegin: function (data) {
            ShowProcessingInfo();
        },
        AdditionalViewSectionOnSuccess: function (data) {
            HideProcessingInfo();
            BindLoanDetails();
        },
        BorrowerInformationSectionOnSuccess: function (data, collapseSection) {
            HideProcessingInfo();
            BindBorrowerDetails();
            if (!collapseSection) $('#minimizeborrowerdetails').click();
        },
        AdditionalViewSection: function (loanid, prospectid, collapseSection) {
            AdditionalViews.AdditionalViewSectionOnBegin();
            $("#loanDetailsSection").slideDown(400);
            $.ajax({
                type: "GET",
                url: "Command/Execute",
                cache: false,
                data: "command=LoanDetailsSectionLoad,LoanId=" + loanid + ",ProspectId=" + prospectid + ",CollapseSection=" + collapseSection,
                dataType: "html",
                success: function (result) {
                    $("#loanDetailsSection").html(result);
                    AdditionalViews.AdditionalViewSectionOnSuccess();
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    HideProcessingInfo();
                },
                complete: function (jqXHR, textStatus) {
                }
            });
        },
        BorrowerInformationSection: function (loanid, prospectid, collapseSection) {

            AdditionalViews.AdditionalViewSectionOnBegin();
            $("#borrowerDetailsSection").slideDown(400);
            $.ajax({
                type: "GET",
                url: "Command/Execute",
                cache: false,
                data: "command=BorrowerDetailsSection,LoanId=" + loanid + ",ProspectId=" + prospectid + ",CollapseSection=" + collapseSection,
                dataType: "html",
                success: function (result) {
                    $("#borrowerDetailsSection").html(result);
                    AdditionalViews.BorrowerInformationSectionOnSuccess(null, collapseSection);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    HideProcessingInfo();
                },
                complete: function (jqXHR, textStatus) {
                }
            });
        },
        CloseAdditionalViewSection: function () {
            $("#loanDetailsSection").slideUp(400);
            $("#borrowerDetailsSection").slideUp(400);
        }
    }