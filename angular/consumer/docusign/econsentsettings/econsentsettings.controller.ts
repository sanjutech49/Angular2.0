/// <reference path="../../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path='../../../../Scripts/typings/ui-router/angular-ui-router.d.ts'/>
/// <reference path="../../../ts/generated/enums.ts" />

module docusign {

    export class EConsentSettingsController {


        private eConsentDeclined: boolean = false;
        private authenticatedBorrowers: srv.IBorrowerViewModel[];

        static className = 'EConsentSettingsController';

        static $inject = [
            "$state",
            "$stateParams",
            "docusignSVC",
            'authenticationContext',
            'loanViewModel'
        ];

        constructor(private $state: ng.ui.IStateService,
                    private $stateParams: ng.ui.IStateParamsService,
                    private docusignSVC: IDocusignService,
                    private authenticationContext: cls.SecureLinkAuthenticationViewModel,
                    private loanViewModel: cls.LoanViewModel)
        {
            this.authenticatedBorrowers = this.docusignSVC.getAuthenticatedBorrowers(authenticationContext, loanViewModel);
            //this.docusignSVC.log(this.authenticatedBorrowers);
        }

        public eConsentAcceptedStatus = (): number => {
            return srv.ConsentStatusEnum.Accept;
        }

        public cancel = () =>
        {
            if (this.$stateParams['previousState'].url && this.$stateParams['previousState'].name != 'authentication')
            {
                this.$state.go(this.$stateParams['previousState']);
            }
            else
            {
                this.$state.go('docusign.esign');
            }
            
        }

        public save = () =>
        {
            if (confirm('Are you sure you want to decline eConsent?')) {
                var borrowerId = this.authenticationContext.borrower.borrowerId;
                var authContext = this.authenticationContext;
                var consentStatus = srv.ConsentStatusEnum.Decline;
                //We can just post a decline for the first borrower because under the hood it will mark both as decline.
                var url = 'SecureLink/SaveEConsentStatus?borrowerId=' + borrowerId + '&consentStatus=' + consentStatus;
                this.docusignSVC.post(url, authContext).then(() => {
                    //No need to update the model optimistically becuase we are simple signing out.
                    this.signOut();
                });

                //old code - saving the whole loan
                //for (var i = 0; i < this.authenticatedBorrowers.length; i++) {
                //    this.authenticatedBorrowers[i].eConsent.consentStatus = srv.ConsentStatusEnum.Decline;
                //}
                //this.docusignSVC.save().then(() => {
                //    this.signOut();
                //});
            }
        }

        private signOut = () =>
        {
            if (this.docusignSVC.removeAuthenticationContext())
            {
                this.$state.go("authenticate");
            }
            else
            {
                this.docusignSVC.log("ERROR REMOVING AUTHENTICATION", "error");
            }
        }
    }

    angular.module('docusign').controller('EConsentSettingsController', EConsentSettingsController);
}