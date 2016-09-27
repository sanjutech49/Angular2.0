/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../loanevents/loanEvents.service.ts" />
/// <reference path="../../ts/extendedViewModels/loan.extendedViewModel.ts" />
/// <reference path="../../ts/generated/viewModels.ts" />
/// <reference path="../../ts/lib/referenceWrapper.ts" />
/// <reference path="../../ts/lib/referenceWrapper.ts" />
/// <reference path="../../common/common.date.ts" />
var loanCenter;
(function (loanCenter) {
    var PropertyController = (function () {
        function PropertyController(propertySvc, BroadcastSvc, simpleModalWindowFactory, wrappedLoan, applicationData, commonCalculatorSvc, loanEvent, commonService) {
            var _this = this;
            this.propertySvc = propertySvc;
            this.BroadcastSvc = BroadcastSvc;
            this.simpleModalWindowFactory = simpleModalWindowFactory;
            this.wrappedLoan = wrappedLoan;
            this.applicationData = applicationData;
            this.commonCalculatorSvc = commonCalculatorSvc;
            this.loanEvent = loanEvent;
            this.commonService = commonService;
            this.showLoader = true;
            this.disableFields = false;
            this.message = '';
            this.isAgentSectionVisible = false;
            this.downPaymentValue = 0;
            this.isCoBorrowerAddressDifferent = false;
            this.enums = [];
            this.indicators = {
                doesYourAgentAlsoRepresentsSeller: false,
                downPaymentPercentageToFixed: 0,
                downPaymentPercentageOriginal: 0,
            };
            this.getFHACountyLoanLimit = function () {
                _this.wrappedLoan.ref.fhaCountyLoanLimit = _this.commonService.getFHAOrVALoanLimit(_this.applicationData.fhaLoanLimits, _this.wrappedLoan.ref.getSubjectProperty().stateName, _this.wrappedLoan.ref.getSubjectProperty().countyName, _this.wrappedLoan.ref.getSubjectProperty().numberOfUnits);
            };
            this.ownershipCurrentResidence = function (ownership) {
                if (angular.isDefined(ownership)) {
                    _this.wrappedLoan.ref.active.getBorrower().getCurrentAddress().ownership = +ownership;
                }
                return _this.wrappedLoan.ref.active.getBorrower().getCurrentAddress().ownership;
            };
            this.onOwnershipPercentageChanged = function (ownership) {
                if (ownership > 100) {
                    _this.wrappedLoan.ref.active.ownershipPercentage = _this.wrappedLoan.ref.remainingOwnershipCalculation(true);
                }
            };
            this.onOccupancyTypeChanged = function (occupancyType) {
                if (occupancyType != 1 /* PrimaryResidence */) {
                    _this.wrappedLoan.ref.active.getBorrower().getCurrentAddress().isSameAsPropertyAddress = false;
                }
                _this.loanEvent.broadcastPropertyChangedEvent(30 /* todo */);
            };
            this.triggerLoanCalculator = function () {
                if (!_this.wrappedLoan.ref.active.ownershipPercentage) {
                    _this.wrappedLoan.ref.active.ownershipPercentage = 0;
                }
                // accessing will create if not exists (lazy)             
                var nri = _this.netRentalIncome;
                _this.loanEvent.broadcastPropertyChangedEvent(30 /* todo */);
            };
            this.isValidDate = function (value) {
                return common.date.isValidDate(value);
            };
            this.onHomeByingTypeChange = function (item) {
                if (!isNaN(Number(item)))
                    _this.wrappedLoan.ref.homeBuyingType = Number(item);
                if (item == 3) {
                    _this.wrappedLoan.ref.getSubjectProperty().streetName = 'TBD';
                }
                else {
                    _this.wrappedLoan.ref.getSubjectProperty().streetName = '';
                    _this.wrappedLoan.ref.sellersAgentContact = _this.indicators.doesYourAgentAlsoRepresentsSeller ? _this.wrappedLoan.ref.buyersAgentContact : _this.defaultSellersAgentContact;
                }
                _this.wrappedLoan.ref.areSixPiecesAcquiredForAllLoanApplications();
            };
            this.onBuyerRepresentSellerChange = function () {
                _this.wrappedLoan.ref.sellersAgentContact = _this.indicators.doesYourAgentAlsoRepresentsSeller ? _this.wrappedLoan.ref.buyersAgentContact : _this.defaultSellersAgentContact;
            };
            this.onDownPaymentBlur = function () {
                _this.loanEvent.broadcastPropertyChangedEvent(25 /* downPaymentValue */, _this.wrappedLoan.ref.downPayment);
                _this.calculateDownPayment("DownPayment");
            };
            this.onPurchasePriceBlur = function () {
                _this.loanEvent.broadcastPropertyChangedEvent(2 /* PurchasePrice */, _this.wrappedLoan.ref.getSubjectProperty().purchasePrice);
                if (_this.wrappedLoan.ref.loanPurposeType === 1)
                    _this.calculateDownPayment("PurchasePrice");
            };
            this.onCurrentEstimatedValue = function () {
                _this.loanEvent.broadcastPropertyChangedEvent(3 /* EstimatedValue */, _this.wrappedLoan.ref.getSubjectProperty().currentEstimatedValue);
                //if (this.wrappedLoan.ref.loanPurposeType === 2)
                //    calculateDownPayment("currentEstimatedValue");
            };
            this.onLoanAmountBlur = function () {
                _this.wrappedLoan.ref.financialInfo.mortgageAmount = _this.wrappedLoan.ref.loanAmount;
                _this.loanEvent.broadcastPropertyChangedEvent(0 /* LoanAmount */, _this.wrappedLoan.ref.loanAmount);
                if (_this.wrappedLoan.ref.loanPurposeType === 1)
                    _this.calculateDownPayment("LoanAmount");
            };
            this.onDownPaymentPercentageBlur = function () {
                _this.loanEvent.broadcastPropertyChangedEvent(24 /* downPaymentPercentageToFixed */, _this.indicators.downPaymentPercentageToFixed);
                _this.calculateDownPayment("DownPaymentPercentage");
            };
            this.calculateDownPayment = function (base) {
                var purchasePrice = _this.wrappedLoan.ref.getSubjectProperty().purchasePrice;
                var loanAmount = _this.wrappedLoan.ref.loanAmount;
                var downPayment = _this.downPaymentValue;
                var downPaymentPercentage = _this.indicators.downPaymentPercentageToFixed;
                var result = _this.commonCalculatorSvc.recalculateDownPayment(purchasePrice, loanAmount, downPayment, downPaymentPercentage, 0, base);
                _this.wrappedLoan.ref.downPaymentAmount(result.downPayment);
                _this.downPaymentValue = result.downPayment;
                _this.wrappedLoan.ref.loanAmount = result.loanAmount;
                _this.indicators.downPaymentPercentageToFixed = result.downPaymentPercentage;
                _this.wrappedLoan.ref.getSubjectProperty().purchasePrice = result.purchasePrice;
            };
            this.collapseExpand = function () {
                _this.isAgentSectionVisible = !_this.isAgentSectionVisible;
            };
            this.getLabelText = function (key, value) {
                return _this.propertySvc.getLabelText(key, value);
            };
            this.showPreviousAddressPerBorrower = function (btyp) {
                if (btyp === void 0) { btyp = 2 /* OtherBorrower */; }
                // use [srv.BorrowerType.OtherBorrower] to calculate both
                if (btyp == 2 /* OtherBorrower */) {
                    return _this.showPreviousAddressPerBorrower(1 /* CoBorrower */) || _this.showPreviousAddressPerBorrower(0 /* Borrower */);
                }
                if (btyp == 1 /* CoBorrower */ && _this.wrappedLoan.ref.active.isSpouseOnTheLoan && !_this.coBorrowerCurrentAddressIsDifferentFromBorrower) {
                    return false;
                }
                var addr;
                switch (btyp) {
                    case 1 /* CoBorrower */:
                        addr = _this.wrappedLoan.ref.active.getCoBorrower().getCurrentAddress();
                        break;
                    case 0 /* Borrower */:
                        addr = _this.wrappedLoan.ref.active.getBorrower().getCurrentAddress();
                        break;
                    default:
                        addr = null;
                        break;
                }
                if (addr == null) {
                    return false;
                }
                else {
                    var isShow = _this.propertySvc.showPreviousAddress(addr.timeAtAddressYears, addr.timeAtAddressMonths);
                    return isShow;
                }
            };
            this.isDownPaymentCompletionRuleSatisfy = function () {
                return (_this.wrappedLoan.ref.sixPiecesAcquiredForAllLoanApplications && !(_this.downPaymentValue == 0 || _this.downPaymentValue));
            };
            this.toggleAddressIsSameAs = function (addr, gs, areSame) {
                //
                // manage state transition , it is not necessary to maintain state an address when [@areSame==true]
                //
                addr.isSameAsPropertyAddress = areSame;
                if (gs.g(addr) == areSame) {
                    // nothing to mutate
                    return;
                }
                if (!areSame) {
                    // transition from same to different , clear out any previous address values
                    addr.clearAddress(false);
                }
                if (areSame) {
                }
                // assign updated value
                gs.s(addr, areSame);
            };
            this.gsSubj = new GSSubj();
            this.gsMail = new GSMail();
            this.gsPrim = new GSPrim();
            this.enums['LoanPurposeType'] = srv.LoanPurposeTypeEnum;
            this.enums['OccupancyType'] = srv.OccupancyType;
            this.enums['OwnershipType'] = srv.OwnershipStatusTypeEnum;
            this.indicators = {
                doesYourAgentAlsoRepresentsSeller: wrappedLoan.ref.checkAgentsDifferences(),
                downPaymentPercentageToFixed: 0,
                downPaymentPercentageOriginal: 0,
            };
            var borrowerCurrentAddress = this.wrappedLoan.ref.active.getBorrower().getCurrentAddress();
            borrowerCurrentAddress.isSameAsPropertyAddress = this.borrowerCurrentAddressIsSameAsPropertyAddress;
            this.defaultSellersAgentContact = this.wrappedLoan.ref.sellersAgentContact;
            if (this.wrappedLoan.ref.loanPurposeType === 1) {
                this.onLoanAmountBlur();
            }
            if (this.wrappedLoan.ref.loanPurposeType === 2 /* Refinance */ && this.wrappedLoan.ref.active.OccupancyType == 1 /* PrimaryResidence */)
                borrowerCurrentAddress.isSameAsPropertyAddress = true;
            this.applicationData.lookup.currentLoanLicensedStatesForLO = this.wrappedLoan.ref.getLicencedStates(this.applicationData);
            if (this.wrappedLoan.ref.loanPurposeType === 1 /* Purchase */ && this.wrappedLoan.ref.homeBuyingType == 3 /* GetPreApproved */ && common.string.isNullOrWhiteSpace(wrappedLoan.ref.getSubjectProperty().streetName))
                this.wrappedLoan.ref.getSubjectProperty().streetName = 'TBD';
        }
        Object.defineProperty(PropertyController.prototype, "subjectProperty", {
            get: function () {
                return this.wrappedLoan.ref.getSubjectProperty();
            },
            set: function (subjProp) {
                /*Read-Only*/
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PropertyController.prototype, "netRentalIncome", {
            get: function () {
                return this.subjectProperty.getNetRentalIncome();
            },
            set: function (nri) {
                /*Read-Only*/
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PropertyController.prototype, "occupancyType", {
            get: function () {
                return this.wrappedLoan.ref.getSubjectProperty().OccupancyType;
            },
            set: function (occupancyType) {
                this.wrappedLoan.ref.getSubjectProperty().OccupancyType = occupancyType;
                // cascade ; @todo-cl: The implementation of the following functions (and subsequent call stack) is in question ?
                // accessing will create if not exists (lazy)
                var nri = this.netRentalIncome;
                this.loanEvent.broadcastPropertyChangedEvent(14 /* PropertyOccupancyTypeChanged */, this.wrappedLoan.ref.getSubjectProperty());
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PropertyController.prototype, "addressEffectiveBorrowerCurrent", {
            get: function () {
                var addr;
                if (this.borrowerCurrentAddressIsSameAsPropertyAddress)
                    addr = this.wrappedLoan.ref.getSubjectProperty();
                else
                    addr = this.wrappedLoan.ref.active.getBorrower().getCurrentAddress();
                return addr;
            },
            set: function (addr) {
                /* Read-Only */
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PropertyController.prototype, "addressEffectiveBorrowerMailing", {
            get: function () {
                var addr;
                if (!this.borrowerMailingAddressIsDifferentFromCurrentAddress)
                    addr = this.addressEffectiveBorrowerCurrent;
                else
                    addr = this.wrappedLoan.ref.active.getBorrower().getMailingAddress();
                return addr;
            },
            set: function (addr) {
                /* Read-Only */
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PropertyController.prototype, "borrowerCurrentAddressIsSameAsPropertyAddressIsDisabled", {
            get: function () {
                var loanVm = this.wrappedLoan.ref;
                return loanVm.loanPurposeType == 2 /* Refinance */ && loanVm.getSubjectProperty().OccupancyType == 1 /* PrimaryResidence */;
            },
            set: function (isDisabled) {
                /*Read-Only*/
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PropertyController.prototype, "borrowerCurrentAddressIsSameAsPropertyAddress", {
            get: function () {
                if (this.borrowerCurrentAddressIsSameAsPropertyAddressIsDisabled) {
                    // Always true in this case , assign and and return [true]
                    return this.wrappedLoan.ref.active.getBorrower().getCurrentAddress().isSameAsPropertyAddress = true;
                }
                else {
                    return this.wrappedLoan.ref.active.getBorrower().getCurrentAddress().isSameAsPropertyAddress;
                }
            },
            set: function (areSame) {
                this.toggleAddressIsSameAs(this.wrappedLoan.ref.active.getBorrower().getCurrentAddress(), this.gsSubj, areSame);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PropertyController.prototype, "borrowerMailingAddressIsDifferentFromCurrentAddress", {
            get: function () {
                var areSame = this.wrappedLoan.ref.active.getBorrower().getMailingAddress().isSameMailingAsBorrowerCurrentAddress;
                return !areSame;
            },
            set: function (areDifferent) {
                this.toggleAddressIsSameAs(this.wrappedLoan.ref.active.getBorrower().getMailingAddress(), this.gsMail, !areDifferent);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PropertyController.prototype, "addressEffectiveCoBorrowerCurrent", {
            get: function () {
                var addr;
                if (this.coBorrowerCurrentAddressIsDifferentFromBorrower)
                    addr = this.wrappedLoan.ref.active.getCoBorrower().getCurrentAddress();
                else
                    addr = this.addressEffectiveBorrowerCurrent;
                return addr;
            },
            set: function (addr) {
                /* Read-Only */
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PropertyController.prototype, "addressEffectiveCoBorrowerMailing", {
            get: function () {
                var addr;
                if (!this.coBorrowerMailingAddressIsDifferentFromCurrentAddress)
                    addr = this.addressEffectiveCoBorrowerCurrent;
                else
                    addr = this.wrappedLoan.ref.active.getCoBorrower().getMailingAddress();
                return addr;
            },
            set: function (addr) {
                /* Read-Only */
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PropertyController.prototype, "coBorrowerCurrentAddressIsDifferentFromBorrower", {
            get: function () {
                // @todo-cl: Consider a conjunction with [this.wrappedLoan.ref.active.isSpouseOnTheLoan] as well
                var areSame = this.wrappedLoan.ref.active.getCoBorrower().getCurrentAddress().isSameAsPrimaryBorrowerCurrentAddress;
                return !areSame;
            },
            set: function (areDifferent) {
                this.toggleAddressIsSameAs(this.wrappedLoan.ref.active.getCoBorrower().getCurrentAddress(), this.gsPrim, !areDifferent);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PropertyController.prototype, "coBorrowerMailingAddressIsDifferentFromCurrentAddress", {
            get: function () {
                var areSame = this.wrappedLoan.ref.active.getCoBorrower().getMailingAddress().isSameMailingAsBorrowerCurrentAddress;
                return !areSame;
            },
            set: function (areDifferent) {
                this.toggleAddressIsSameAs(this.wrappedLoan.ref.active.getCoBorrower().getMailingAddress(), this.gsMail, !areDifferent);
            },
            enumerable: true,
            configurable: true
        });
        PropertyController.$inject = ['propertySvc', 'BroadcastSvc', 'simpleModalWindowFactory', 'wrappedLoan', 'applicationData', 'commonCalculatorSvc', 'loanEvent', 'commonService'];
        return PropertyController;
    })();
    var GSSubj = (function () {
        function GSSubj() {
            this.g = function (addr) { return addr.isSameAsPropertyAddress; };
            this.s = function (addr, b) { return addr.isSameAsPropertyAddress = b; };
        }
        return GSSubj;
    })();
    var GSMail = (function () {
        function GSMail() {
            this.g = function (addr) { return addr.isSameMailingAsBorrowerCurrentAddress; };
            this.s = function (addr, b) { return addr.isSameMailingAsBorrowerCurrentAddress = b; };
        }
        return GSMail;
    })();
    var GSPrim = (function () {
        function GSPrim() {
            this.g = function (addr) { return addr.isSameAsPrimaryBorrowerCurrentAddress; };
            this.s = function (addr, b) {
                addr.isSameAsPrimaryBorrowerCurrentAddress = b;
                addr.isSameMailingAsBorrowerCurrentAddress = b;
            };
        }
        return GSPrim;
    })();
    angular.module('loanApplication').controller('propertyController', PropertyController);
})(loanCenter || (loanCenter = {}));
//# sourceMappingURL=property.controller.js.map