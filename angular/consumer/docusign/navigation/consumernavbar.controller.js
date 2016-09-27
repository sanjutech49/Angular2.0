/// <reference path="../../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path='../../../../Scripts/typings/ui-router/angular-ui-router.d.ts'/>
var docusign;
(function (docusign) {
    var ConsumerNavBarController = (function () {
        function ConsumerNavBarController($state, docusignSVC, authenticationContext, loanViewModel) {
            var _this = this;
            this.$state = $state;
            this.docusignSVC = docusignSVC;
            this.authenticationContext = authenticationContext;
            this.loanViewModel = loanViewModel;
            this.isESigningComplete = false;
            this.goToESigning = function () {
                _this.$state.go('docusign.esign.instructions');
            };
            this.goToAppraisal = function () {
                if (_this.isESigningComplete) {
                    _this.$state.go('docusign.appraisal');
                }
            };
            this.goToUpload = function () {
                _this.$state.go('docusign.docupload');
            };
            this.signOut = function () {
                if (confirm('Are you sure you want to log out?')) {
                    if (_this.docusignSVC.removeAuthenticationContext()) {
                        _this.$state.go("authenticate");
                    }
                    else {
                        _this.docusignSVC.log("ERROR REMOVING AUTHENTICATION", "error");
                    }
                }
            };
            this.goToEConsentSettings = function () {
                _this.$state.go('docusign.settings', { 'previousState': _this.$state.current });
            };
            //Method for determining if a state is complete yet, if so it enables the green checkmark beside the navButton tab
            //public isESigningComplete = (): boolean =>
            //{
            //    return this.docusignSVC.isESigningComplete(this.authenticationContext, this.loanViewModel);
            //}
            this.isAppraisalComplete = function () {
                return false;
                //return this.docusignSVC.isAppraisalComplete();
            };
            //Methods for determining the current active state, if so it highlights the current navButton tab as Bold
            this.isESigningBold = function () {
                if (_this.$state.current.parent == 'docusign.esign' || _this.isESigningComplete) {
                    return true;
                }
                return false;
            };
            this.isAppraisalBold = function () {
                if (_this.$state.current.name == 'docusign.appraisal' || _this.isAppraisalComplete()) {
                    return true;
                }
                return false;
            };
            this.isUploadBold = function () {
                if (_this.$state.current.name == 'docusign.docupload') {
                    return true;
                }
                return false;
            };
            this.isPrimaryApplication = function () {
                var isPrimaryApplication = _this.docusignSVC.isPrimaryApplication(_this.authenticationContext, _this.loanViewModel);
                return isPrimaryApplication;
            };
            this.isESigningComplete = this.docusignSVC.isESigningComplete(this.authenticationContext, this.loanViewModel);
        }
        ConsumerNavBarController.className = 'ConsumerNavBarController';
        ConsumerNavBarController.$inject = [
            "$state",
            "docusignSVC",
            'authenticationContext',
            'loanViewModel'
        ];
        return ConsumerNavBarController;
    })();
    docusign.ConsumerNavBarController = ConsumerNavBarController;
    angular.module('docusign').controller('ConsumerNavBarController', ConsumerNavBarController);
})(docusign || (docusign = {}));
//# sourceMappingURL=consumernavbar.controller.js.map