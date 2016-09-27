/// <reference path="../../../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../../../scripts/typings/angular-ui-bootstrap/angular-ui-bootstrap.d.ts" />
var docusign;
(function (docusign) {
    var SuccessViewModel = (function () {
        function SuccessViewModel() {
        }
        return SuccessViewModel;
    })();
    var ModalSuccessController = (function () {
        function ModalSuccessController(eConsent, CurativeEConsentViewModel) {
            var _this = this;
            this.eConsent = eConsent;
            this.CurativeEConsentViewModel = CurativeEConsentViewModel;
            this.continue = function () {
                _this.eConsent.close();
            };
        }
        return ModalSuccessController;
    })();
    docusign.ModalSuccessController = ModalSuccessController;
    var SuccessController = (function () {
        function SuccessController($modal) {
            var _this = this;
            this.$modal = $modal;
            this.openSuccessPopUp = function (inputTemplateURL) {
                _this.successModal = _this.$modal.open({
                    templateUrl: inputTemplateURL,
                    backdrop: 'static',
                    controller: function () {
                        var EConsent = new SuccessViewModel();
                        return new ModalSuccessController(_this.successModal, EConsent);
                    },
                    controllerAs: 'ModalSuccessCtrl'
                });
            };
        }
        SuccessController.className = "SuccessController";
        SuccessController.$inject = ['$modal'];
        return SuccessController;
    })();
    docusign.SuccessController = SuccessController;
    angular.module('docusign').controller('SuccessController', SuccessController);
})(docusign || (docusign = {}));
//# sourceMappingURL=success.controller.js.map