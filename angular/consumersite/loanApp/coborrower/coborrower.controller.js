var consumersite;
(function (consumersite) {
    var CoborrowerController = (function () {
        function CoborrowerController() {
            this.controllerAsName = "coborrowerCntrl";
        }
        CoborrowerController.className = "coborrowerController";
        CoborrowerController.$inject = [];
        return CoborrowerController;
    })();
    consumersite.CoborrowerController = CoborrowerController;
    moduleRegistration.registerController(consumersite.moduleName, CoborrowerController);
    var loanCenter;
    (function (loanCenter) {
        'use strict';
        var CurrentAddressInfo = (function () {
            function CurrentAddressInfo(CoborrowerInfo) {
                this.coborrowerInfoObj = {
                    firstName: null,
                    middleName: null,
                    lastName: null,
                    suffix: null,
                    advertisingSource: null,
                    email: null,
                    homePhone: null,
                    cellPhone: null,
                    maritalStatus: null,
                    nbrDependents: null,
                    dependentAges: null,
                    addCoborrower: false
                };
            }
            return CurrentAddressInfo;
        })();
    })(loanCenter || (loanCenter = {}));
})(consumersite || (consumersite = {}));
//# sourceMappingURL=coborrower.controller.js.map