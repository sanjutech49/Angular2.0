/// <reference path="../../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../../Scripts/typings/underscore/underscore.d.ts" />
var consumersite;
(function (consumersite) {
    var ModalEConsentController = (function () {
        function ModalEConsentController(borrowers, $modalInstance) {
            var _this = this;
            this.borrowers = borrowers;
            this.$modalInstance = $modalInstance;
            this.setEConsentStatus = function (val) {
                if (val != 1 /* Accept */ && val != 2 /* Decline */)
                    _this.eConsentStatus = 0 /* None */;
                else
                    _this.eConsentStatus = val;
            };
            this.close = function () {
                _this.eConsentDate = new Date();
                console.log(_this.activeBorrower.borrower.eConsent.consentStatus);
                _this.$modalInstance.close((_this.eConsentStatus == 1 /* Accept */));
            };
            this.dismiss = function () {
                _this.$modalInstance.dismiss("User Canceled eConsent");
            };
            console.log(borrowers);
            //@TODO temporary for Demo
            //this.borrowers[0].borrower.firstName = "Kerry";
            //this.borrowers[0].borrower.lastName = "Bayens";
            //set active to empty since it is single, primary borrower.
            this.activeBorrower = {
                borrower: {
                    fullName: "Select One",
                    eConsent: {
                        consentStatus: 0 /* None */,
                        statusAt: new Date(),
                    }
                },
                isPrimaryBorrower: true,
            };
        }
        Object.defineProperty(ModalEConsentController.prototype, "consentStatusAccept", {
            get: function () {
                return 1 /* Accept */;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ModalEConsentController.prototype, "consentStatusDecline", {
            get: function () {
                return 2 /* Decline */;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ModalEConsentController.prototype, "fullName", {
            get: function () {
                return this.activeBorrower.borrower.fullName;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ModalEConsentController.prototype, "isPrimaryBorrower", {
            get: function () {
                return this.activeBorrower.isPrimaryBorrower;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ModalEConsentController.prototype, "isMultiBorrower", {
            get: function () {
                return (this.borrowers.length > 1);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ModalEConsentController.prototype, "eConsentStatus", {
            get: function () {
                return this.activeBorrower.borrower.eConsent.consentStatus;
            },
            set: function (val) {
                this.activeBorrower.borrower.eConsent.consentStatus = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ModalEConsentController.prototype, "eConsentDate", {
            get: function () {
                return this.activeBorrower.borrower.eConsent.statusAt;
            },
            set: function (date) {
                this.activeBorrower.borrower.eConsent.statusAt = date;
            },
            enumerable: true,
            configurable: true
        });
        return ModalEConsentController;
    })();
    consumersite.ModalEConsentController = ModalEConsentController;
})(consumersite || (consumersite = {}));
//# sourceMappingURL=eConsent.controller.js.map