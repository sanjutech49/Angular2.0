var va;
(function (va) {
    var controller;
    (function (controller) {
        var IRRLMaxController = (function () {
            function IRRLMaxController(wrappedLoan, vaCenterService, commonModalWindowFactory, modalWindowType) {
                var _this = this;
                this.wrappedLoan = wrappedLoan;
                this.vaCenterService = vaCenterService;
                this.commonModalWindowFactory = commonModalWindowFactory;
                this.modalWindowType = modalWindowType;
                this.calculateVAFields = function () {
                    var self = _this;
                    _this.vaCenterService.calculateVA(_this.wrappedLoan.ref.getSubjectProperty().firstMortgageAmount, _this.wrappedLoan.ref.vaInformation.costOfImprovements, _this.wrappedLoan.ref.vaInformation.cashPaymentFromVeteran, _this.wrappedLoan.ref.financialInfo.discountPoints, _this.vaCenterService.getVAFundingFee()).$promise.then(function (data) {
                        self.vaCenterService.calculatorResponse = data.response;
                    }, function (error) {
                        self.commonModalWindowFactory.open({ type: self.modalWindowType.error, message: "We couldn't calculate IRRL VA fields at the moment. Please try again" });
                    });
                };
                this.showDicountPoints = function () {
                    return _this.wrappedLoan.ref.financialInfo.discountPoints <= 0 ? 0 : _this.wrappedLoan.ref.financialInfo.discountPoints;
                };
                this.calculateVAFields();
            }
            IRRLMaxController.$inject = ['wrappedLoan', 'vaCenterService', 'commonModalWindowFactory', 'modalWindowType'];
            return IRRLMaxController;
        })();
        angular.module('vaCenter').controller('irrlMaxController', IRRLMaxController);
    })(controller = va.controller || (va.controller = {}));
})(va || (va = {}));
//# sourceMappingURL=irrlmax.controller.js.map