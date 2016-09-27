/// <reference path="../../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../../Scripts/typings/underscore/underscore.d.ts" />
var consumersite;
(function (consumersite) {
    var SendReportController = (function () {
        // dependencies are injected via AngularJS $injector
        // controller's name is registered in Application.ts and specified from ng-controller attribute in index.html
        function SendReportController(address) {
            if (address === void 0) { address = consumersite.vm.Address; }
            this.address = address;
            this.controllerAsName = "sendReportCntrl";
            this.streetName = this._address.streetName;
            this.zipCode = this._address.zipCode;
            this.cityName = this._address.cityName;
            this.yearsAtAddress = this._address.yearsAtAddress;
            this.monthsAtAddress = this._address.monthsAtAddress;
            this.currAddrSameAsMailingAddr = this._address.currAddrSameAsMailingAddr;
            this.mailingAddress = this._address.mailingAddress;
        }
        SendReportController.className = "sendReportController";
        SendReportController.$inject = [];
        return SendReportController;
    })();
    consumersite.SendReportController = SendReportController;
    moduleRegistration.registerController(consumersite.moduleName, consumersite.AddressController);
    var loanCenter;
    (function (loanCenter) {
        'use strict';
        var CurrentAddressInfo = (function () {
            function CurrentAddressInfo(AddressInfo) {
                this.addressInfoObj = {
                    cityName: null,
                    stateId: null,
                    stateName: null,
                    states: null,
                    streetName: null,
                    unitNumber: null,
                    zipCode: null,
                    yearsAtAddress: null,
                    monthsAtAddress: null,
                    currAddrSameAsMailingAddr: null
                };
            }
            return CurrentAddressInfo;
        })();
        var MailingAddressInfo = (function () {
            function MailingAddressInfo(AddressInfo) {
                this.addressInfoObj = {
                    cityName: null,
                    stateId: null,
                    stateName: null,
                    states: null,
                    streetName: null,
                    unitNumber: null,
                    zipCode: null
                };
            }
            return MailingAddressInfo;
        })();
    })(loanCenter || (loanCenter = {}));
})(consumersite || (consumersite = {}));
//# sourceMappingURL=sendreport.js.map