/// <reference path="../../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path='../../../../Scripts/typings/ui-router/angular-ui-router.d.ts'/>

module docusign {

    export class ConsumerNavBarController
    {
        consumerController: any;

        static className = 'ConsumerNavBarController';

        public static $inject =
        [
            "$state",
            "docusignSVC",
            'authenticationContext',
            'loanViewModel'
        ];

        private isESigningComplete: boolean = false;

        constructor(
            private $state: ng.ui.IStateService,
            private docusignSVC: IDocusignService,
            private authenticationContext: cls.SecureLinkAuthenticationViewModel,
            private loanViewModel: cls.LoanViewModel) {
            this.isESigningComplete = this.docusignSVC.isESigningComplete(this.authenticationContext, this.loanViewModel);
        }

        public goToESigning = () =>
        {
            this.$state.go('docusign.esign.instructions');   
        }

        public goToAppraisal = () => {
            if (this.isESigningComplete) {
                this.$state.go('docusign.appraisal');
            }
        }

        public goToUpload = () =>
        {
            this.$state.go('docusign.docupload');   
        }

        public signOut = () =>
        {
            if (confirm('Are you sure you want to log out?')){
                if (this.docusignSVC.removeAuthenticationContext()) {
                    this.$state.go("authenticate");
                }
                else {
                    this.docusignSVC.log("ERROR REMOVING AUTHENTICATION", "error");
                }
            }
        }

        public goToEConsentSettings = () =>
        {
            this.$state.go('docusign.settings', { 'previousState': this.$state.current});
        }


        //Method for determining if a state is complete yet, if so it enables the green checkmark beside the navButton tab
        //public isESigningComplete = (): boolean =>
        //{
        //    return this.docusignSVC.isESigningComplete(this.authenticationContext, this.loanViewModel);
        //}

        public isAppraisalComplete = (): boolean =>
        {
            return false;
            //return this.docusignSVC.isAppraisalComplete();
        }

        //Methods for determining the current active state, if so it highlights the current navButton tab as Bold
        public isESigningBold = (): boolean =>
        {
            if (this.$state.current.parent == 'docusign.esign' || this.isESigningComplete)
            {
                return true;
            }
            return false;
        }
        
        public isAppraisalBold = (): boolean =>
        {
            if (this.$state.current.name == 'docusign.appraisal' || this.isAppraisalComplete())
            {
                return true;
            }
            return false;
        }

        public isUploadBold = (): boolean =>
        {
            if (this.$state.current.name == 'docusign.docupload')
            {
                return true;
            }
            return false;
        }

        public isPrimaryApplication = (): boolean => {
            var isPrimaryApplication = this.docusignSVC.isPrimaryApplication(this.authenticationContext, this.loanViewModel);
            return isPrimaryApplication;
        }
    }

    angular.module('docusign').controller('ConsumerNavBarController', ConsumerNavBarController);
}