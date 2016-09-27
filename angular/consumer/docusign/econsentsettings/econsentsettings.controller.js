/// <reference path="../../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path='../../../../Scripts/typings/ui-router/angular-ui-router.d.ts'/>
/// <reference path="../../../ts/generated/enums.ts" />
var docusign;
(function (docusign) {
    var EConsentSettingsController = (function () {
        function EConsentSettingsController($state, $stateParams, docusignSVC, authenticationContext, loanViewModel) {
            var _this = this;
            this.$state = $state;
            this.$stateParams = $stateParams;
            this.docusignSVC = docusignSVC;
            this.authenticationContext = authenticationContext;
            this.loanViewModel = loanViewModel;
            this.eConsentDeclined = false;
            this.eConsentAcceptedStatus = function () {
                return 1 /* Accept */;
            };
            this.cancel = function () {
                if (_this.$stateParams['previousState'].url && _this.$stateParams['previousState'].name != 'authentication') {
                    _this.$state.go(_this.$stateParams['previousState']);
                }
                else {
                    _this.$state.go('docusign.esign');
                }
            };
            this.save = function () {
                if (confirm('Are you sure you want to decline eConsent?')) {
                    var borrowerId = _this.authenticationContext.borrower.borrowerId;
                    var authContext = _this.authenticationContext;
                    var consentStatus = 2 /* Decline */;
                    //We can just post a decline for the first borrower because under the hood it will mark both as decline.
                    var url = 'SecureLink/SaveEConsentStatus?borrowerId=' + borrowerId + '&consentStatus=' + consentStatus;
                    _this.docusignSVC.post(url, authContext).then(function () {
                        //No need to update the model optimistically becuase we are simple signing out.
                        _this.signOut();
                    });
                }
            };
            this.signOut = function () {
                if (_this.docusignSVC.removeAuthenticationContext()) {
                    _this.$state.go("authenticate");
                }
                else {
                    _this.docusignSVC.log("ERROR REMOVING AUTHENTICATION", "error");
                }
            };
            this.authenticatedBorrowers = this.docusignSVC.getAuthenticatedBorrowers(authenticationContext, loanViewModel);
            //this.docusignSVC.log(this.authenticatedBorrowers);
        }
        EConsentSettingsController.className = 'EConsentSettingsController';
        EConsentSettingsController.$inject = [
            "$state",
            "$stateParams",
            "docusignSVC",
            'authenticationContext',
            'loanViewModel'
        ];
        return EConsentSettingsController;
    })();
    docusign.EConsentSettingsController = EConsentSettingsController;
    angular.module('docusign').controller('EConsentSettingsController', EConsentSettingsController);
})(docusign || (docusign = {}));
//# sourceMappingURL=econsentsettings.controller.js.map