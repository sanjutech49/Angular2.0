/// <reference path="../../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../../Scripts/typings/underscore/underscore.d.ts" />
/// <reference path='../../providers/uiNavigation.provider.ts' />
var consumersite;
(function (consumersite) {
    var MyNextStepMainController = (function () {
        function MyNextStepMainController($state, uiNavigation, loan, loanAppPageContext, navigationService) {
            var _this = this;
            this.$state = $state;
            this.uiNavigation = uiNavigation;
            this.loan = loan;
            this.loanAppPageContext = loanAppPageContext;
            this.navigationService = navigationService;
            //My Action Items
            this.getLoanReviewLink = function () {
                return _this.navigationService.getSummaryLink();
            };
            this.getDisclosuresLink = function () {
                return "";
            };
            this.canNavigateDisclosures = function () {
                return false;
            };
            this.getAppraisalLink = function () {
                return "";
            };
            this.canNavigateAppraisal = function () {
                return false;
            };
            this.getDocUploadLink = function () {
                return "";
            };
            this.canNavigateDocUpload = function () {
                return false;
            };
            this.getDocReviewLink = function () {
                return "";
            };
            this.canNavigateDocReview = function () {
                return false;
            };
            //Percentage
            this.getProgress = function () {
                return 0.25;
            };
            this.pageLoader = uiNavigation();
            //@TODO: DEV: Temporary to allow the UI not to throw errors if a pricing product hasn't been selected in development.  
            if (this.loan.pricingProduct == null) {
                console.log("MyNextStepMainController::: Pricing Null");
                this.loan.pricingProduct = new consumersite.vm.PricingRowViewModel();
            }
            this.loanAppPageContext.scrollToTop();
        }
        Object.defineProperty(MyNextStepMainController.prototype, "street", {
            //My Loan Status
            get: function () {
                return this.loan.property.streetName;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MyNextStepMainController.prototype, "formattedAddress", {
            get: function () {
                if (angular.isDefined(this.city) && angular.isDefined(this.state) && angular.isDefined(this.zipCode)) {
                    return this.city + ", " + this.state + " " + this.zipCode;
                    ;
                }
                return null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MyNextStepMainController.prototype, "city", {
            get: function () {
                return this.loan.property.cityName;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MyNextStepMainController.prototype, "state", {
            get: function () {
                return this.loan.property.stateName;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MyNextStepMainController.prototype, "zipCode", {
            get: function () {
                return this.loan.property.zipCode;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MyNextStepMainController.prototype, "loanNumber", {
            get: function () {
                return this.loan.loanNumber;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MyNextStepMainController.prototype, "interestRate", {
            get: function () {
                return this.loan.pricingProduct.Rate;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MyNextStepMainController.prototype, "apr", {
            get: function () {
                return this.loan.pricingProduct.APR;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MyNextStepMainController.prototype, "loanAmount", {
            get: function () {
                return this.loan.loanAmount;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MyNextStepMainController.prototype, "downPayment", {
            get: function () {
                return this.loan.downPaymentAmount;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MyNextStepMainController.prototype, "payment", {
            get: function () {
                return this.loan.pricingProduct.MonthlyPayment;
            },
            enumerable: true,
            configurable: true
        });
        MyNextStepMainController.className = 'myNextStepMainController';
        MyNextStepMainController.$inject = ['$state', 'uiNavigation', 'loan', 'loanAppPageContext', 'navigationService'];
        return MyNextStepMainController;
    })();
    consumersite.MyNextStepMainController = MyNextStepMainController;
    moduleRegistration.registerController(consumersite.moduleName, MyNextStepMainController);
})(consumersite || (consumersite = {}));
//# sourceMappingURL=myNextStepMain.controller.js.map