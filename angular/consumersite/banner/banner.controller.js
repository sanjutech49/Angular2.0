/// <reference path="../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../ts/lib/common.util.ts" />
/// <reference path="../../ts/global/global.ts" />
var consumersite;
(function (consumersite) {
    var BannerController = (function () {
        function BannerController($sce, navigationService) {
            var _this = this;
            this.$sce = $sce;
            this.navigationService = navigationService;
            this.bannerEntries = [
                {
                    loanAppState: 0 /* undefined */,
                    imageFileName: 'rocket-ship.png',
                    header: "[Sponser this Page]",
                    message: '[Sponser Message]',
                },
                {
                    loanAppState: 1 /* borrowerPersonalInfo */,
                    imageFileName: 'rocket-ship.png',
                    header: "You're on the fast track to get your new loan.",
                    message: 'We just need a little info from you.',
                },
                {
                    loanAppState: 2 /* coBorrowerPersonalInfo */,
                    imageFileName: 'rocket-ship.png',
                    header: "You're on the fast track to get your new loan.",
                    message: 'We just need a little info from you.',
                },
                {
                    loanAppState: 3 /* propertyInfo */,
                    imageFileName: 'map.png',
                    header: "We're about to give your home a mortgage makeover.",
                    message: "We just need to know where it's at (figuratively & literally).",
                },
                {
                    loanAppState: 4 /* borrowerAddressInfo */,
                    imageFileName: 'map.png',
                    header: "We're about to give your home a mortgage makeover.",
                    message: "We just need to know where it's at (figuratively & literally).",
                },
                {
                    loanAppState: 5 /* coBorrowerAddressInfo */,
                    imageFileName: 'map.png',
                    header: "We're about to give your home a mortgage makeover.",
                    message: "We just need to know where it's at (figuratively & literally).",
                },
                {
                    loanAppState: 6 /* borrowerEmployment */,
                    imageFileName: "piggy-bank.png",
                    header: "You're halfway to the finish line",
                    message: 'What does your <b>employment</b> look like?',
                },
                {
                    loanAppState: 7 /* borrowerPreviousEmployment */,
                    imageFileName: "piggy-bank.png",
                    header: "You're halfway to the finish line",
                    message: 'What does your <b>employment</b> look like?',
                },
                {
                    loanAppState: 8 /* coBorrowerEmployment */,
                    imageFileName: "piggy-bank.png",
                    header: "You're halfway to the finish line",
                    message: 'What does your <b>employment</b> look like?',
                },
                {
                    loanAppState: 9 /* coBorrowerPreviousEmployment */,
                    imageFileName: "piggy-bank.png",
                    header: "You're halfway to the finish line",
                    message: 'What does your <b>employment</b> look like?',
                },
                {
                    loanAppState: 10 /* otherIncome */,
                    imageFileName: 'piggy-bank.png',
                    header: 'You’ve passed the midpoint.',
                    message: 'What does your <b>other income</b> look like?',
                },
                {
                    loanAppState: 11 /* assets */,
                    imageFileName: 'piggy-bank.png',
                    header: 'It looks like free credit scores are on the menu',
                    message: "You're almost there, we just need to know what kind of <b>Assets</b> you have.",
                },
                {
                    loanAppState: 12 /* borrowerGovernmentMonitoring */,
                    imageFileName: 'bank.png',
                    header: "You're nearly to the <b>finish line</b>.",
                    message: "We just have a few questions the government requires us to ask.",
                },
                {
                    loanAppState: 13 /* coBorrowerGovernmentMonitoring */,
                    imageFileName: 'bank.png',
                    header: "You're nearly to the <b>finish line</b>.",
                    message: "We just have a few questions the government requires us to ask.",
                },
                {
                    loanAppState: 14 /* declarations */,
                    imageFileName: 'bank.png',
                    header: "You're nearly to the <b>finish line</b>.",
                    message: "We just have a few questions the government requires us to ask.",
                },
                {
                    loanAppState: 15 /* summary */,
                    imageFileName: 'report.png',
                    header: "You’re minutes away from your 3 FREE Credit Scores.",
                    message: "Just <span class='green-text-header'>confirm the info</span> you entered is correct and you’ll be on your way!",
                },
                {
                    loanAppState: 17 /* credit */,
                    imageFileName: 'keys.png',
                    header: "Good to Go! We’re ready for the keys to your mortgage universe.",
                    message: "With these last tidbits of info we’ll give you your FREE credit scores.",
                },
                {
                    loanAppState: 18 /* account */,
                    imageFileName: 'cogs.png',
                    header: "While we’re running credit lets create your account.",
                    message: 'Also let us know if you’d like to add anyone else to the loan.',
                },
                {
                    loanAppState: 19 /* creditResults */,
                    imageFileName: 'house.png',
                    header: "You’re one step from the finish line.",
                    message: 'We just need to know which mortgages belong to the subject property.',
                },
                {
                    loanAppState: 20 /* success */,
                    imageFileName: 'green-flag.png',
                    header: 'Congratulations, you finished your Loan Application like a Boss.',
                    message: "Plus, we’ve got what we need to create your Preapproval Letter.",
                },
                {
                    loanAppState: 21 /* eConsent */,
                    imageFileName: 'mail.png',
                    header: 'Good bye snail mail, hello electronic documents',
                    message: 'This will enable us to quickly deliver important loan documents to you electronically.',
                },
                {
                    loanAppState: 22 /* alertPreferences */,
                    imageFileName: 'mail.png',
                    header: 'Tell us how you’d like to receive important alerts about your loan.',
                    message: 'You can always change these preferences later if you’d like.',
                },
                {
                    loanAppState: 23 /* activationCode */,
                    imageFileName: 'mail.png',
                    header: 'Tell us how you’d like to receive important alerts about your loan.',
                    message: 'You can always change these preferences later if you’d like.',
                },
                {
                    loanAppState: 24 /* signout */,
                    imageFileName: 'green-flag.png',
                    header: 'You are a Loan Rockstar.',
                    message: "You’ve finished all that there is to do for the moment",
                },
            ];
            this.bannerEntry = this.bannerEntries[0];
            this.imageDirectory = '../../../Content/images/ConsumerSite/';
            this.fullImagePath = '';
            this.phoneNumber = '(800) 555-5555';
            this.checkState = function () {
                if (_this.navigationService.currentState != _this.bannerEntry.loanAppState) {
                    _this.bannerEntry = lib.findFirst(_this.bannerEntries, function (be) { return be.loanAppState == _this.navigationService.currentState; });
                    _this.fullImagePath = _this.imageDirectory + _this.bannerEntry.imageFileName;
                }
            };
            this.bannerEntry = lib.findFirst(this.bannerEntries, function (be) { return be.loanAppState == navigationService.currentState; });
            this.fullImagePath = this.imageDirectory + this.bannerEntry.imageFileName;
        }
        Object.defineProperty(BannerController.prototype, "imageUrl", {
            get: function () {
                this.checkState();
                return this.fullImagePath;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BannerController.prototype, "header", {
            get: function () {
                this.checkState();
                return this.$sce.trustAsHtml(this.bannerEntry.header);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BannerController.prototype, "message", {
            get: function () {
                this.checkState();
                return this.$sce.trustAsHtml(this.bannerEntry.message);
            },
            enumerable: true,
            configurable: true
        });
        BannerController.className = 'bannerController';
        BannerController.$inject = ['$sce', 'navigationService'];
        return BannerController;
    })();
    moduleRegistration.registerController(consumersite.moduleName, BannerController);
})(consumersite || (consumersite = {}));
//# sourceMappingURL=banner.controller.js.map