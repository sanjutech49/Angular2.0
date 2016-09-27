/// <reference path='../../../angular/ts/extendedViewModels/property.extendedViewModel.ts' />
var srv;
(function (srv) {
    var SendEmailReportViewModel = (function () {
        function SendEmailReportViewModel() {
        }
        return SendEmailReportViewModel;
    })();
    srv.SendEmailReportViewModel = SendEmailReportViewModel;
})(srv || (srv = {}));
var consumersite;
(function (consumersite) {
    var vm;
    (function (vm) {
        var SendEmailReport = (function () {
            function SendEmailReport(property) {
                this.getProperty = function () { return property; };
            }
            Object.defineProperty(SendEmailReport.prototype, "firstName", {
                get: function () {
                    return this.getProperty().firstName;
                },
                set: function (firstName) {
                    this.getProperty().firstName = firstName;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SendEmailReport.prototype, "lastName", {
                get: function () {
                    return this.getProperty().lastName;
                },
                set: function (lastName) {
                    this.getProperty().lastName = lastName;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SendEmailReport.prototype, "emailAddress", {
                get: function () {
                    return this.getProperty().emailAddress;
                },
                set: function (emailAddress) {
                    this.getProperty().emailAddress = emailAddress;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SendEmailReport.prototype, "emailAddressRecipients", {
                get: function () {
                    return this.getProperty().emailAddressRecipients;
                },
                set: function (emailAddressRecipients) {
                    this.getProperty().emailAddressRecipients = emailAddressRecipients;
                },
                enumerable: true,
                configurable: true
            });
            return SendEmailReport;
        })();
        vm.SendEmailReport = SendEmailReport;
    })(vm = consumersite.vm || (consumersite.vm = {}));
})(consumersite || (consumersite = {}));
//# sourceMappingURL=sendEmailReport.viewModel.js.map