var va;
(function (va) {
    var controller;
    (function (controller) {
        var IRRLQMCertificationController = (function () {
            function IRRLQMCertificationController(wrappedLoan, vaCenterService, fhaCenterService, modalPopoverFactory, loanEvent) {
                var _this = this;
                this.wrappedLoan = wrappedLoan;
                this.vaCenterService = vaCenterService;
                this.fhaCenterService = fhaCenterService;
                this.modalPopoverFactory = modalPopoverFactory;
                this.loanEvent = loanEvent;
                /**
                * @desc: Gets color based on value of model
                */
                this.colorTheText = function (value) {
                    return _this.vaCenterService.colorTheText(value);
                };
                /**
                * @desc: Gets text based on value of model [true = Yes, flase = No]
                */
                this.getText = function (value, isResult) {
                    if (isResult)
                        return _this.vaCenterService.getText(value);
                    else
                        return _this.fhaCenterService.getText(null, value);
                };
                this.showCurrentLoanOriginationDate = function (event) {
                    var originationDatePopup = _this.modalPopoverFactory.openModalPopover('angular/vacenter/irrlqmcertification/originationdate.html', {}, moment(_this.wrappedLoan.ref.CurrentLoanOriginationDate).format('MM/DD/YYYY'), event);
                    originationDatePopup.result.then(function (data) {
                        _this.wrappedLoan.ref.CurrentLoanOriginationDate = data;
                        _this.loanEvent.broadcastPropertyChangedEvent(30 /* todo */);
                    });
                };
                loanEvent.broadcastPropertyChangedEvent(30 /* todo */);
            }
            IRRLQMCertificationController.$inject = ['wrappedLoan', 'vaCenterService', 'fhaCenterService', 'modalPopoverFactory', 'loanEvent'];
            return IRRLQMCertificationController;
        })();
        angular.module('vaCenter').controller('irrlQMCertificationController', IRRLQMCertificationController);
    })(controller = va.controller || (va.controller = {}));
})(va || (va = {}));
//# sourceMappingURL=irrlqmcertification.controller.js.map