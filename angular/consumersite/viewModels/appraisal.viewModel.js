/// <reference path='../../../angular/ts/extendedViewModels/property.extendedViewModel.ts' />
var consumersite;
(function (consumersite) {
    var vm;
    (function (vm) {
        var Appraisal = (function () {
            function Appraisal(appraisal) {
                this.getAppraisal = function () { return appraisal; };
            }
            Object.defineProperty(Appraisal.prototype, "appraisalProducts", {
                get: function () {
                    return this.getAppraisal().appraisalProducts;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Appraisal.prototype, "billingAddress", {
                //appraisal payment info section
                get: function () {
                    return this.getAppraisal().creditCardInfo.billingAddress;
                },
                set: function (val) {
                    this.getAppraisal().creditCardInfo.billingAddress = val;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Appraisal.prototype, "ccvNumber", {
                get: function () {
                    return this.getAppraisal().creditCardInfo.ccvNumber;
                },
                set: function (val) {
                    this.getAppraisal().creditCardInfo.ccvNumber = val;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Appraisal.prototype, "creditCardExpirationMonth", {
                get: function () {
                    return this.getAppraisal().creditCardInfo.creditCardExpirationMonth;
                },
                set: function (val) {
                    this.getAppraisal().creditCardInfo.creditCardExpirationMonth = val;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Appraisal.prototype, "creditCardExpirationYear", {
                get: function () {
                    return this.getAppraisal().creditCardInfo.creditCardExpirationYear;
                },
                set: function (val) {
                    this.getAppraisal().creditCardInfo.creditCardExpirationYear = val;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Appraisal.prototype, "creditCardNumber", {
                get: function () {
                    return this.getAppraisal().creditCardInfo.creditCardNumber;
                },
                set: function (val) {
                    this.getAppraisal().creditCardInfo.creditCardNumber = val;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Appraisal.prototype, "creditCardType", {
                get: function () {
                    return this.getAppraisal().creditCardInfo.creditCardType;
                },
                set: function (val) {
                    this.getAppraisal().creditCardInfo.creditCardType = val;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Appraisal.prototype, "nameOnCreditCard", {
                get: function () {
                    return this.getAppraisal().creditCardInfo.nameOnCreditCard;
                },
                set: function (val) {
                    this.getAppraisal().creditCardInfo.nameOnCreditCard = val;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Appraisal.prototype, "contactRelation", {
                //appraisal contact section
                get: function () {
                    return this.getAppraisal().appraisalContact.contactRelation;
                },
                set: function (val) {
                    this.getAppraisal().appraisalContact.contactRelation = val;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Appraisal.prototype, "email", {
                get: function () {
                    return this.getAppraisal().appraisalContact.email;
                },
                set: function (val) {
                    this.getAppraisal().appraisalContact.email = val;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Appraisal.prototype, "firstName", {
                get: function () {
                    return this.getAppraisal().appraisalContact.firstName;
                },
                set: function (val) {
                    this.getAppraisal().appraisalContact.firstName = val;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Appraisal.prototype, "lastName", {
                get: function () {
                    return this.getAppraisal().appraisalContact.lastName;
                },
                set: function (val) {
                    this.getAppraisal().appraisalContact.lastName = val;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Appraisal.prototype, "phone", {
                get: function () {
                    return this.getAppraisal().appraisalContact.phone;
                },
                set: function (val) {
                    this.getAppraisal().appraisalContact.phone = val;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Appraisal.prototype, "phoneType", {
                get: function () {
                    return this.getAppraisal().appraisalContact.phoneType;
                },
                set: function (val) {
                    this.getAppraisal().appraisalContact.phoneType = val;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Appraisal.prototype, "specialInstructions", {
                get: function () {
                    return this.getAppraisal().appraisalContact.specialInstructions;
                },
                set: function (val) {
                    this.getAppraisal().appraisalContact.specialInstructions = val;
                },
                enumerable: true,
                configurable: true
            });
            return Appraisal;
        })();
        vm.Appraisal = Appraisal;
    })(vm = consumersite.vm || (consumersite.vm = {}));
})(consumersite || (consumersite = {}));
//# sourceMappingURL=appraisal.viewModel.js.map