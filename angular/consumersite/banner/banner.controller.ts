/// <reference path="../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../ts/lib/common.util.ts" />
/// <reference path="../../ts/global/global.ts" />

module consumersite {

    interface IBannerEntry {
        loanAppState: navigation.loanAppNavigationState;
        imageFileName: string;
        header: string;
        message: string;
    }

    class BannerController {

        bannerEntries: IBannerEntry[] = [
            {
                loanAppState: navigation.loanAppNavigationState.undefined,
                imageFileName: 'rocket-ship.png',
                header: "[Sponser this Page]",
                message: '[Sponser Message]',
            }, {
                loanAppState: navigation.loanAppNavigationState.borrowerPersonalInfo,
                imageFileName: 'rocket-ship.png',
                header: "You're on the fast track to get your new loan.",
                message: 'We just need a little info from you.',
            }, {
                loanAppState: navigation.loanAppNavigationState.coBorrowerPersonalInfo,
                imageFileName: 'rocket-ship.png',
                header: "You're on the fast track to get your new loan.",
                message: 'We just need a little info from you.',
            }, {
                loanAppState: navigation.loanAppNavigationState.propertyInfo,
                imageFileName: 'map.png',
                header: "We're about to give your home a mortgage makeover.",
                message: "We just need to know where it's at (figuratively & literally).",
            }, {
                loanAppState: navigation.loanAppNavigationState.borrowerAddressInfo,
                imageFileName: 'map.png',
                header: "We're about to give your home a mortgage makeover.",
                message: "We just need to know where it's at (figuratively & literally).",
            }, {
                loanAppState: navigation.loanAppNavigationState.coBorrowerAddressInfo,
                imageFileName: 'map.png',
                header: "We're about to give your home a mortgage makeover.",
                message: "We just need to know where it's at (figuratively & literally).",
            }, {
                loanAppState: navigation.loanAppNavigationState.borrowerEmployment,
                imageFileName: "piggy-bank.png",
                header: "You're halfway to the finish line",
                message: 'What does your <b>employment</b> look like?',
            }, {
                loanAppState: navigation.loanAppNavigationState.borrowerPreviousEmployment,
                imageFileName: "piggy-bank.png",
                header: "You're halfway to the finish line",
                message: 'What does your <b>employment</b> look like?',
            }, {
                loanAppState: navigation.loanAppNavigationState.coBorrowerEmployment,
                imageFileName: "piggy-bank.png",
                header: "You're halfway to the finish line",
                message: 'What does your <b>employment</b> look like?',
            }, {
                loanAppState: navigation.loanAppNavigationState.coBorrowerPreviousEmployment,
                imageFileName: "piggy-bank.png",
                header: "You're halfway to the finish line",
                message: 'What does your <b>employment</b> look like?',
            }, {
                loanAppState: navigation.loanAppNavigationState.otherIncome,
                imageFileName: 'piggy-bank.png',
                header: 'You’ve passed the midpoint.',
                message: 'What does your <b>other income</b> look like?',
            }, {
                loanAppState: navigation.loanAppNavigationState.assets,
                imageFileName: 'piggy-bank.png',
                header: 'It looks like free credit scores are on the menu',
                message: "You're almost there, we just need to know what kind of <b>Assets</b> you have.",
            }, {
                loanAppState: navigation.loanAppNavigationState.borrowerGovernmentMonitoring,
                imageFileName: 'bank.png',
                header: "You're nearly to the <b>finish line</b>.",
                message: "We just have a few questions the government requires us to ask.",
            }, {
                loanAppState: navigation.loanAppNavigationState.coBorrowerGovernmentMonitoring,
                imageFileName: 'bank.png',
                header: "You're nearly to the <b>finish line</b>.",
                message: "We just have a few questions the government requires us to ask.",
            }, {
                loanAppState: navigation.loanAppNavigationState.declarations,
                imageFileName: 'bank.png',
                header: "You're nearly to the <b>finish line</b>.",
                message: "We just have a few questions the government requires us to ask.",
            }, {
                loanAppState: navigation.loanAppNavigationState.summary,
                imageFileName: 'report.png',
                header: "You’re minutes away from your 3 FREE Credit Scores.",
                message: "Just <span class='green-text-header'>confirm the info</span> you entered is correct and you’ll be on your way!",
            }, {
                loanAppState: navigation.loanAppNavigationState.credit,
                imageFileName: 'keys.png',
                header: "Good to Go! We’re ready for the keys to your mortgage universe.",
                message: "With these last tidbits of info we’ll give you your FREE credit scores.",
            }, {
                loanAppState: navigation.loanAppNavigationState.account,
                imageFileName: 'cogs.png',
                header: "While we’re running credit lets create your account.",
                message: 'Also let us know if you’d like to add anyone else to the loan.',
            }, {
                loanAppState: navigation.loanAppNavigationState.creditResults,
                imageFileName: 'house.png',
                header: "You’re one step from the finish line.",
                message: 'We just need to know which mortgages belong to the subject property.',
            }, {
                loanAppState: navigation.loanAppNavigationState.success,
                imageFileName: 'green-flag.png',
                header: 'Congratulations, you finished your Loan Application like a Boss.',
                message: "Plus, we’ve got what we need to create your Preapproval Letter.",
            }, {
                loanAppState: navigation.loanAppNavigationState.eConsent,
                imageFileName: 'mail.png',
                header: 'Good bye snail mail, hello electronic documents',
                message: 'This will enable us to quickly deliver important loan documents to you electronically.',
            }, {
                loanAppState: navigation.loanAppNavigationState.alertPreferences,
                imageFileName: 'mail.png',
                header: 'Tell us how you’d like to receive important alerts about your loan.',
                message: 'You can always change these preferences later if you’d like.',
            }, {
                loanAppState: navigation.loanAppNavigationState.activationCode,
                imageFileName: 'mail.png',
                header: 'Tell us how you’d like to receive important alerts about your loan.',
                message: 'You can always change these preferences later if you’d like.',
            }, {
                loanAppState: navigation.loanAppNavigationState.signout,
                imageFileName: 'green-flag.png',
                header: 'You are a Loan Rockstar.',
                message: "You’ve finished all that there is to do for the moment",
            },
        ];

        static className = 'bannerController';
        static $inject = ['$sce', 'navigationService'];

        private bannerEntry: IBannerEntry = this.bannerEntries[0];
        private imageDirectory = '../../../Content/images/ConsumerSite/';
        private fullImagePath = '';
        phoneNumber = '(800) 555-5555';

        constructor(private $sce: ng.ISCEService, private navigationService: UINavigationService) {
            this.bannerEntry = lib.findFirst(this.bannerEntries, be => be.loanAppState == navigationService.currentState);
            this.fullImagePath = this.imageDirectory + this.bannerEntry.imageFileName;
        }

        get imageUrl(): string {
            this.checkState();
            return this.fullImagePath;
        }

        get header(): string {
            this.checkState();
            return this.$sce.trustAsHtml(this.bannerEntry.header);
        }

        get message(): string {
            this.checkState();
            return this.$sce.trustAsHtml(this.bannerEntry.message);
        }

        private checkState = () => {
            if (this.navigationService.currentState != this.bannerEntry.loanAppState) {
                this.bannerEntry = lib.findFirst(this.bannerEntries, be => be.loanAppState == this.navigationService.currentState);
                this.fullImagePath = this.imageDirectory + this.bannerEntry.imageFileName;
            }
        }
    }

    moduleRegistration.registerController(consumersite.moduleName, BannerController);
}