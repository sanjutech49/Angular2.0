/// <reference path="../../ts/generated/viewModels.ts" />
/// <reference path="../../ts/extendedViewModels/property.extendedviewmodel.ts" />
/// <reference path="../../ts/generated/viewModelClasses.ts" />
/// <reference path="../../common/common.objects.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var srv;
(function (srv) {
    var cls;
    (function (cls) {
        var SecureLinkEmailTemplateViewModel = (function () {
            function SecureLinkEmailTemplateViewModel() {
            }
            return SecureLinkEmailTemplateViewModel;
        })();
        cls.SecureLinkEmailTemplateViewModel = SecureLinkEmailTemplateViewModel;
    })(cls = srv.cls || (srv.cls = {}));
})(srv || (srv = {}));
var cls;
(function (cls) {
    (function (TitleHeldInType) {
        TitleHeldInType[TitleHeldInType["InMyNamesAsIndividuals"] = 0] = "InMyNamesAsIndividuals";
        TitleHeldInType[TitleHeldInType["InATrust"] = 1] = "InATrust";
        TitleHeldInType[TitleHeldInType["InACorporation"] = 2] = "InACorporation";
    })(cls.TitleHeldInType || (cls.TitleHeldInType = {}));
    var TitleHeldInType = cls.TitleHeldInType;
    var CreditViewModel = (function (_super) {
        __extends(CreditViewModel, _super);
        function CreditViewModel(credit) {
            var _this = this;
            _super.call(this);
            this.isCreditReportValid = function () {
                if (!_this.creditReportDate || _this.creditStatus != 2 /* retrieved */)
                    return false;
                if (moment(_this.creditReportDate).format("YYYY-MM-DD") < moment().subtract('89', 'days').format("YYYY-MM-DD"))
                    return false;
                else
                    return true;
            };
            if (credit) {
                common.objects.automap(this, credit);
            }
        }
        return CreditViewModel;
    })(srv.cls.CreditViewModel);
    cls.CreditViewModel = CreditViewModel;
    var CountyLoanLimitViewModel = (function () {
        function CountyLoanLimitViewModel() {
        }
        return CountyLoanLimitViewModel;
    })();
    cls.CountyLoanLimitViewModel = CountyLoanLimitViewModel;
    var DeclarationViewModel = (function (_super) {
        __extends(DeclarationViewModel, _super);
        function DeclarationViewModel(declaration) {
            _super.call(this);
            if (declaration) {
                common.objects.automap(this, declaration);
            }
            if ((!angular.isDefined(this.loanOriginatorSource) || this.loanOriginatorSource == null) && !declaration)
                this.loanOriginatorSource = 1 /* Telephone */;
        }
        return DeclarationViewModel;
    })(srv.cls.DeclarationViewModel);
    cls.DeclarationViewModel = DeclarationViewModel;
    var DeclarationInfoViewModel = (function (_super) {
        __extends(DeclarationInfoViewModel, _super);
        function DeclarationInfoViewModel(declarationInfo) {
            var _this = this;
            _super.call(this);
            this.expiredAfterIssued = function () {
                if (_this.dateIssued != null) {
                    if (_this.dateExpired == null)
                        return true;
                    var dateBefore = moment(_this.dateIssued).format('MM/DD/YYYY');
                    var dateAfter = moment(_this.dateExpired).format('MM/DD/YYYY');
                    return new Date(dateBefore) < new Date(dateAfter);
                }
                else
                    return true;
            };
            if (declarationInfo) {
                common.objects.automap(this, declarationInfo);
            }
        }
        return DeclarationInfoViewModel;
    })(srv.cls.DeclarationInfoViewModel);
    cls.DeclarationInfoViewModel = DeclarationInfoViewModel;
    var REOInfoViewModel = (function (_super) {
        __extends(REOInfoViewModel, _super);
        function REOInfoViewModel(reoInfo) {
            _super.call(this);
            if (reoInfo) {
                common.objects.automap(this, reoInfo);
            }
        }
        Object.defineProperty(REOInfoViewModel.prototype, "NegativeAmortizationFeature", {
            get: function () {
                return common.objects.boolToString(this.negativeAmortizationFeature);
            },
            set: function (value) {
                this.negativeAmortizationFeature = common.string.toBool(value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(REOInfoViewModel.prototype, "PrePaymentPenalty", {
            get: function () {
                return common.objects.boolToString(this.prePaymentPenalty);
            },
            set: function (value) {
                this.prePaymentPenalty = common.string.toBool(value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(REOInfoViewModel.prototype, "FullyIndexedRate", {
            get: function () {
                this.fullyIndexedRate = this.amortizationType == 2 /* ARM */ ? this.fullyIndexedRate : this.interestRate;
                return this.fullyIndexedRate;
            },
            set: function (value) {
                this.fullyIndexedRate = value;
            },
            enumerable: true,
            configurable: true
        });
        return REOInfoViewModel;
    })(srv.cls.REOInfoViewModel);
    cls.REOInfoViewModel = REOInfoViewModel;
    var CompanyDataViewModel = (function (_super) {
        __extends(CompanyDataViewModel, _super);
        // @todo-cl::PROPERTY-ADDRESS
        function CompanyDataViewModel(companyData, getBorrowerFullName) {
            var _this = this;
            _super.call(this);
            this.getBorrowerFullName = getBorrowerFullName;
            //get AddressViewModel(): srv.IAddressViewModel {
            //    return (this.addressViewModel ? this.addressViewModel : (this.addressViewModel = new cls.AddressViewModel()));
            //}
            //set AddressViewModel(newAddress: srv.IAddressViewModel) {
            //    this.addressViewModel = newAddress;
            //}
            //
            // @todo: Remove from CreditHelpers
            //
            this.isCompanyDataFilledIn = function () {
                return _this.hasVal(_this.companyName) || _this.hasVal(_this.attn) || _this.hasVal(_this.phone) || _this.hasVal(_this.fax) || _this.hasVal(_this.streetAddress1) || _this.hasVal(_this.streetAddress2) || _this.hasVal(_this.addressViewModel && _this.addressViewModel.cityName) || _this.hasVal(_this.addressViewModel && _this.addressViewModel.stateName) || _this.hasVal(_this.addressViewModel && _this.addressViewModel.zipCode);
            };
            // Util? // @todo: lambda
            this.hasVal = function (s) {
                if (s == undefined || s == null || s.trim().length == 0) {
                    return false;
                }
                else {
                    return true;
                }
            };
            if (companyData) {
                common.objects.automap(this, companyData);
                this.addressViewModel = new cls.PropertyViewModel(null, companyData.addressViewModel);
            }
            else
                this.addressViewModel = new cls.PropertyViewModel(null);
            this.hasChanges = false;
        }
        return CompanyDataViewModel;
    })(srv.cls.CompanyDataViewModel);
    cls.CompanyDataViewModel = CompanyDataViewModel;
    var MiscellaneousDebtViewModel = (function (_super) {
        __extends(MiscellaneousDebtViewModel, _super);
        function MiscellaneousDebtViewModel(miscDebt, debtType, userEntry, borrowerFullName) {
            _super.call(this);
            if (miscDebt)
                common.objects.automap(this, miscDebt);
            else {
                this.typeId = debtType || 1 /* ChildCareExpensesForVALoansOnly */; // optional param, by default child aliomny
                this.isUserEntry = (userEntry || userEntry === undefined); // optional paramteter, by default set userEntry to true
                this.monthsLeft = null; //Bug 18562
                this.amount = 0;
                this.payee = "";
                this.isRemoved = false;
            }
            //
            //if (!this.borrowerFullName && this.getBorrowerFullName != undefined)
            //    this.borrowerFullName = this.getBorrowerFullName();
            this.borrowerFullName = borrowerFullName;
            //if (!this.miscellaneousDebtId || this.miscellaneousDebtId == lib.getEmptyGuid()) {
            //    this.miscellaneousDebtId = util.IdentityGenerator.nextGuid();
            //}
        }
        Object.defineProperty(MiscellaneousDebtViewModel.prototype, "Amount", {
            get: function () {
                return this.amount;
            },
            set: function (newAmount) {
                if (newAmount != 0) {
                    this.isRemoved = false;
                }
                this.amount = newAmount;
            },
            enumerable: true,
            configurable: true
        });
        return MiscellaneousDebtViewModel;
    })(srv.cls.MiscellaneousDebtViewModel);
    cls.MiscellaneousDebtViewModel = MiscellaneousDebtViewModel;
    var UserAccountViewModel = (function (_super) {
        __extends(UserAccountViewModel, _super);
        function UserAccountViewModel(userAccount) {
            var _this = this;
            _super.call(this);
            this.isInRole = function (role) {
                for (var i = 0; i < _this.roles.length; i++) {
                    if (_this.roles[i].roleName === role)
                        return true;
                }
                return false;
            };
            this.hasPrivilege = function (privilegeName) {
                var privilegeList = _this.privileges.filter(function (item) { return item.name.toLowerCase().trim() == privilegeName.toLowerCase().trim(); });
                return privilegeList.length > 0;
            };
            if (userAccount) {
                common.objects.automap(this, userAccount);
                if (userAccount.userAccountId == undefined) {
                    this.userAccountId = 0;
                }
                this.originalUsername = userAccount.username;
            }
            else {
                this.isOnlineUser = false;
            }
            if (!this.securityQuestionId) {
                this.securityQuestionId = 0;
            }
        }
        Object.defineProperty(UserAccountViewModel.prototype, "isEmailChanged", {
            get: function () {
                return this.username != this.originalUsername;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UserAccountViewModel.prototype, "isSecurityQuestionChanged", {
            get: function () {
                return this.securityQuestionId != this.originalSecurityQuestionId;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UserAccountViewModel.prototype, "isSecurityAnswerChanged", {
            get: function () {
                return this.securityAnswer != this.originalSecurityAnswer;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UserAccountViewModel.prototype, "IsOnlineUser", {
            get: function () {
                return this.isOnlineUser;
            },
            set: function (newIsOnlineUser) {
                this.isOnlineUser = newIsOnlineUser;
                if (!newIsOnlineUser) {
                    this.securityQuestionId = 0;
                    this.securityAnswer = '';
                    this.resetPassword = false;
                    this.sendActivationEmail = !this.isActivated;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UserAccountViewModel.prototype, "InvalidEmail", {
            get: function () {
                return this.isEmailValid = this.username == null || this.username.trim() === '';
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UserAccountViewModel.prototype, "invalidConfirmEmail", {
            get: function () {
                var isInvalidConfirmEmail = this.confirmEmail == null || this.confirmEmail.trim() === '';
                if (!isInvalidConfirmEmail)
                    isInvalidConfirmEmail = this.username.trim().toLowerCase() !== this.confirmEmail.trim().toLowerCase();
                return isInvalidConfirmEmail;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UserAccountViewModel.prototype, "InvalidEmails", {
            get: function () {
                return this.isEmailValid || this.isConfirmEmailValid;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UserAccountViewModel.prototype, "isResetPasswordDisabled", {
            get: function () {
                return this.sendActivationEmail || !this.isActivated || this.loanUserAccountId == 0 || this.isEmailChanged || this.isSecurityQuestionChanged || this.isSecurityAnswerChanged;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UserAccountViewModel.prototype, "invalidSecurityAnswer", {
            get: function () {
                return this.securityAnswer == null || this.securityAnswer.trim() === '';
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UserAccountViewModel.prototype, "isModelValid", {
            get: function () {
                return this.isOnlineUser ? !this.InvalidEmails && !this.invalidSecurityAnswer : !this.InvalidEmails;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UserAccountViewModel.prototype, "fullName", {
            get: function () {
                var fullName = (this.firstName ? this.firstName.trim() : '') + ' ' + (this.middleName ? this.middleName.trim() + " " : '') + (this.lastName ? this.lastName.trim() : '');
                return fullName.trim() ? fullName : '';
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UserAccountViewModel.prototype, "FilterUsername", {
            //set IsCoBorrower(newIsCoborrower: boolean) {
            //    this.isCoBorrower = newIsCoborrower;
            //}
            //get IsCoBorrower(): boolean {
            //    return this.isCoBorrower;
            //}
            get: function () {
                if (!common.string.isNullOrWhiteSpace(this.username) && lib.startsWith('newprospect', this.username))
                    return '';
                return this.username;
            },
            enumerable: true,
            configurable: true
        });
        return UserAccountViewModel;
    })(srv.cls.UserAccountViewModel);
    cls.UserAccountViewModel = UserAccountViewModel;
    var PublicRecordViewModel = (function (_super) {
        __extends(PublicRecordViewModel, _super);
        function PublicRecordViewModel(publicRecord, getBorrowerFullName) {
            var _this = this;
            _super.call(this);
            this.getBorrowerFullName = getBorrowerFullName;
            this.initialize = function (publicRecord) {
                if (publicRecord)
                    common.objects.automap(_this, publicRecord);
                if (_this.companyData)
                    _this.companyData = new CompanyDataViewModel(_this.companyData, _this.getBorrowerFullName);
            };
            this.hidden = false;
            /**
            * @desc Includes public record into sum of total amount
            */
            this.includeInTotalAmount = function (publicRecord) {
                if (publicRecord.publicRecordComment === '4' && (publicRecord.type.indexOf('lien') > -1 || publicRecord.type.indexOf('judgment') > -1)) {
                    publicRecord.includeInTotal = true;
                }
                else {
                    publicRecord.includeInTotal = false;
                }
            };
            this.initialize(publicRecord);
        }
        Object.defineProperty(PublicRecordViewModel.prototype, "creditor", {
            get: function () {
                return this.companyData.companyName;
            },
            /**
            * @desc srv.IPayOffSectionItemViewModel members
            */
            set: function (value) {
                this.companyData.companyName = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PublicRecordViewModel.prototype, "balance", {
            get: function () {
                return this.amount;
            },
            set: function (value) {
                this.amount = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PublicRecordViewModel.prototype, "payoffCommentId", {
            get: function () {
                return this.publicRecordComment;
            },
            set: function (value) {
                this.publicRecordComment = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PublicRecordViewModel.prototype, "isUserAdded", {
            get: function () {
                return this.isUserEntry;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PublicRecordViewModel.prototype, "isPublicRecord", {
            get: function () {
                return true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PublicRecordViewModel.prototype, "isLiability", {
            get: function () {
                return false;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PublicRecordViewModel.prototype, "isRemoved", {
            get: function () {
                return false;
            },
            //added a benign setter because angular.extend method will break when trying to map a property that has only a getter
            set: function (value) {
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PublicRecordViewModel.prototype, "canEdit", {
            get: function () {
                return true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PublicRecordViewModel.prototype, "isPayoffItem", {
            get: function () {
                return false;
            },
            enumerable: true,
            configurable: true
        });
        return PublicRecordViewModel;
    })(srv.cls.PublicRecordViewModel);
    cls.PublicRecordViewModel = PublicRecordViewModel;
    var LookupItem = (function (_super) {
        __extends(LookupItem, _super);
        function LookupItem(text, value) {
            _super.call(this);
            this.text = text;
            this.value = value;
        }
        LookupItem.fromLookupItem = function (src) {
            var li = new LookupItem(src.text, src.value);
            li.selected = src.selected;
            li.disabled = src.disabled;
            li.contextFlags = src.contextFlags;
            return li;
        };
        return LookupItem;
    })(srv.cls.LookupItem);
    cls.LookupItem = LookupItem;
    var TitleInformationViewModel = (function (_super) {
        __extends(TitleInformationViewModel, _super);
        function TitleInformationViewModel(titleInfo) {
            _super.call(this);
            if (titleInfo)
                common.objects.automap(this, titleInfo);
            else {
                if (!this.titleHeldIn)
                    this.titleHeldIn = 0 /* InMyNamesAsIndividuals */; // set default to 'In my/our name(s) as individuals'
            }
            if (!this.mannerTitleHeld || this.mannerTitleHeld == "-1")
                //set default value of field - "To Be Decided in Escrow"
                this.mannerTitleHeld = "9";
        }
        return TitleInformationViewModel;
    })(srv.cls.TitleInformationViewModel);
    cls.TitleInformationViewModel = TitleInformationViewModel;
    var PricingAdjustmentsViewModel = (function (_super) {
        __extends(PricingAdjustmentsViewModel, _super);
        function PricingAdjustmentsViewModel(pricingAdjustments) {
            _super.call(this);
            if (pricingAdjustments) {
                common.objects.automap(this, pricingAdjustments);
            }
        }
        Object.defineProperty(PricingAdjustmentsViewModel.prototype, "InvestorPrice", {
            get: function () {
                return this.investorPrice;
            },
            set: function (value) {
                this.investorPrice = (!this.isAmountValid(value)) ? 0 : value;
                this.calculateTotals(1 /* investor */);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PricingAdjustmentsViewModel.prototype, "LoanOfficerPrice", {
            get: function () {
                return this.loanOfficerPrice;
            },
            set: function (value) {
                this.loanOfficerPrice = (!this.isAmountValid(value)) ? 0 : value;
                this.calculateTotals(2 /* loanOfficer */);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PricingAdjustmentsViewModel.prototype, "InvestorPurchasePrice", {
            get: function () {
                return this.investorPurchasePrice;
            },
            set: function (value) {
                this.investorPurchasePrice = (!this.isAmountValid(value)) ? 0 : value;
                this.calculateTotals(3 /* investorBasePurchase */);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PricingAdjustmentsViewModel.prototype, "EnterprisePrice", {
            get: function () {
                return this.enterprisePrice;
            },
            set: function (value) {
                this.enterprisePrice = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PricingAdjustmentsViewModel.prototype, "FinalLoanOfficerPrice", {
            get: function () {
                return this.finalLoanOfficerPrice;
            },
            set: function (value) {
                this.finalLoanOfficerPrice = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PricingAdjustmentsViewModel.prototype, "FinalLoanOfficerPriceByLo", {
            get: function () {
                return this.finalLoanOfficerPriceByLo;
            },
            set: function (value) {
                this.finalLoanOfficerPriceByLo = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PricingAdjustmentsViewModel.prototype, "FinalLoanOfficerPriceByDivision", {
            get: function () {
                return this.finalLoanOfficerPriceByDivision;
            },
            set: function (value) {
                this.finalLoanOfficerPriceByDivision = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PricingAdjustmentsViewModel.prototype, "FinalLoanOfficerPriceByCompany", {
            get: function () {
                return this.finalLoanOfficerPriceByCompany;
            },
            set: function (value) {
                this.finalLoanOfficerPriceByCompany = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PricingAdjustmentsViewModel.prototype, "FinalPurchasePrice", {
            get: function () {
                return this.finalPurchasePrice;
            },
            set: function (value) {
                this.finalPurchasePrice = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PricingAdjustmentsViewModel.prototype, "Adjustments", {
            get: function () {
                if (this.adjustments != null && this.adjustments.length != 0) {
                    var len = this.adjustments.length;
                    for (var i = 0; i < len; i++) {
                        this.adjustments[i].value = this.isAmountValidOrMinus(this.adjustments[i].value) ? this.adjustments[i].value : 0;
                    }
                }
                this.calculateTotals(4 /* adjustment */);
                return this.adjustments;
            },
            set: function (adj) {
                if (adj != null && adj.length != 0) {
                    var len = adj.length;
                    for (var i = 0; i < len; i++) {
                        adj[i].value = this.isAmountValidOrMinus(adj[i].value) ? adj[i].value : 0;
                    }
                }
                this.adjustments = adj;
                this.calculateTotals(4 /* adjustment */);
            },
            enumerable: true,
            configurable: true
        });
        PricingAdjustmentsViewModel.prototype.calculateTotals = function (secType) {
            if (secType == 4 /* adjustment */) {
                this.calculateTotals(1 /* investor */);
                this.calculateTotals(2 /* loanOfficer */);
                this.calculateTotals(3 /* investorBasePurchase */);
            }
            var calcTotal = 0;
            var calcTotalByLo = 0;
            var calcTotalByDivision = 0;
            var calcTotalByCompany = 0;
            if (this.adjustments != null && this.adjustments.length != 0) {
                var len = this.adjustments.length;
                for (var i = 0; i < len; i++) {
                    if (this.adjustments[i].adjustmentSectionType == secType) {
                        if (!this.adjustments[i].isDeleted) {
                            if (this.isAmountValid(this.adjustments[i].value)) {
                                calcTotal += Number(this.adjustments[i].value);
                                if (secType == 2 /* loanOfficer */) {
                                    if (this.adjustments[i].paidBy == 1 /* LoanOfficer */) {
                                        calcTotalByLo += (!this.isAmountValid(this.adjustments[i].value)) ? 0 : Number(this.adjustments[i].value);
                                    }
                                    if (this.adjustments[i].paidBy == 2 /* Division */) {
                                        calcTotalByDivision += (!this.isAmountValid(this.adjustments[i].value)) ? 0 : Number(this.adjustments[i].value);
                                    }
                                    if (this.adjustments[i].paidBy == 3 /* Company */) {
                                        calcTotalByCompany += (!this.isAmountValid(this.adjustments[i].value)) ? 0 : Number(this.adjustments[i].value);
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if (secType == 1 /* investor */) {
                calcTotal += (!this.isAmountValid(this.investorPrice)) ? 0 : Number(this.investorPrice);
                this.enterprisePrice = calcTotal;
                this.loanOfficerPrice = this.enterprisePrice;
            }
            if (secType == 2 /* loanOfficer */) {
                calcTotal += (!this.isAmountValid(this.loanOfficerPrice)) ? 0 : Number(this.loanOfficerPrice);
                this.finalLoanOfficerPrice = calcTotal;
                this.finalLoanOfficerPriceByLo = calcTotalByLo;
                this.finalLoanOfficerPriceByDivision = calcTotalByDivision;
                this.finalLoanOfficerPriceByCompany = calcTotalByCompany;
            }
            if (secType == 3 /* investorBasePurchase */) {
                calcTotal += (!this.isAmountValid(this.investorPurchasePrice)) ? 0 : Number(this.investorPurchasePrice);
                this.finalPurchasePrice = calcTotal;
            }
        };
        PricingAdjustmentsViewModel.prototype.isAmountValidOrMinus = function (amount) {
            return this.isAmountValid(amount) || (amount.toString() == '-');
        };
        PricingAdjustmentsViewModel.prototype.isAmountValid = function (amount) {
            return amount != null && !isNaN(parseFloat(amount));
        };
        return PricingAdjustmentsViewModel;
    })(srv.cls.PricingAdjustmentsViewModel);
    cls.PricingAdjustmentsViewModel = PricingAdjustmentsViewModel;
    var AdjustmentsViewModel = (function (_super) {
        __extends(AdjustmentsViewModel, _super);
        function AdjustmentsViewModel(adjustment) {
            _super.call(this);
            this.firstLoad = true;
            this.orderBy = 0;
            this.newAdjustment = false;
            this.hasSubType = false;
            this.hasPaidByType = false;
            this.orderAdjustmentSet = false;
            this.sortingNotRequired = false;
            if (adjustment) {
                common.objects.automap(this, adjustment);
            }
            else {
                this.value = 0;
                this.calculateValue = 0;
            }
        }
        Object.defineProperty(AdjustmentsViewModel.prototype, "CalculateValue", {
            get: function () {
                return this.calculateValue;
            },
            set: function (newValue) {
                this.value = ((!this.isAmountValid(newValue)) ? 0 : newValue) * 100 / this.totalLoanAmount;
                this.calculateValue = newValue;
            },
            enumerable: true,
            configurable: true
        });
        AdjustmentsViewModel.prototype.isAmountValid = function (amount) {
            return amount != null && !isNaN(parseFloat(amount));
        };
        return AdjustmentsViewModel;
    })(srv.cls.AdjustmentsViewModel);
    cls.AdjustmentsViewModel = AdjustmentsViewModel;
    var SellSideViewModel = (function (_super) {
        __extends(SellSideViewModel, _super);
        function SellSideViewModel() {
            _super.apply(this, arguments);
        }
        return SellSideViewModel;
    })(srv.cls.SellSideInformationViewModel);
    cls.SellSideViewModel = SellSideViewModel;
    var LockingPricingLookupViewModel = (function (_super) {
        __extends(LockingPricingLookupViewModel, _super);
        function LockingPricingLookupViewModel() {
            _super.apply(this, arguments);
        }
        return LockingPricingLookupViewModel;
    })(srv.cls.LockingPricingLookupViewModel);
    cls.LockingPricingLookupViewModel = LockingPricingLookupViewModel;
    var PhoneViewModel = (function (_super) {
        __extends(PhoneViewModel, _super);
        function PhoneViewModel(phoneType) {
            _super.call(this);
            if (phoneType) {
                if (phoneType == "preferred") {
                    this.type = "1";
                    this.isPrefrred = true;
                }
                else if (phoneType == "alternate") {
                    this.type = "2";
                    this.isPrefrred = false;
                }
            }
            else {
                if ((this.type == null || this.type == undefined || this.type == "") && this.isPrefrred) {
                    this.type = "1";
                }
                else if ((this.type == null || this.type == undefined || this.type == "") && !this.isPrefrred) {
                    this.type = "2";
                }
            }
        }
        return PhoneViewModel;
    })(srv.cls.PhoneViewModel);
    cls.PhoneViewModel = PhoneViewModel;
    var RealEstateViewModel = (function (_super) {
        __extends(RealEstateViewModel, _super);
        function RealEstateViewModel(realEstate) {
            _super.call(this);
            if (realEstate)
                common.objects.automap(this, realEstate);
            this.initialize();
        }
        RealEstateViewModel.prototype.initialize = function () {
            this.addressForDropDown = [];
        };
        return RealEstateViewModel;
    })(srv.cls.RealEstateViewModel);
    cls.RealEstateViewModel = RealEstateViewModel;
    var AgentContactViewModel = (function (_super) {
        __extends(AgentContactViewModel, _super);
        function AgentContactViewModel(agentContact) {
            _super.call(this);
            if (agentContact) {
                common.objects.automap(this, agentContact);
            }
        }
        return AgentContactViewModel;
    })(srv.cls.AgentContactViewModel);
    cls.AgentContactViewModel = AgentContactViewModel;
    var SecureLinkAuthenticationViewModel = (function (_super) {
        __extends(SecureLinkAuthenticationViewModel, _super);
        function SecureLinkAuthenticationViewModel() {
            _super.apply(this, arguments);
        }
        return SecureLinkAuthenticationViewModel;
    })(srv.cls.SecureLinkAuthenticationViewModel);
    cls.SecureLinkAuthenticationViewModel = SecureLinkAuthenticationViewModel;
    var SecureLinkBorrowerViewModel = (function (_super) {
        __extends(SecureLinkBorrowerViewModel, _super);
        function SecureLinkBorrowerViewModel() {
            _super.apply(this, arguments);
        }
        return SecureLinkBorrowerViewModel;
    })(srv.cls.SecureLinkBorrowerViewModel);
    cls.SecureLinkBorrowerViewModel = SecureLinkBorrowerViewModel;
    var DocumentsViewModel = (function (_super) {
        __extends(DocumentsViewModel, _super);
        function DocumentsViewModel(document) {
            _super.call(this);
            this.isInEditMode = false;
            this.isItemClicked = false;
            this.isDeleted = false;
            this.isUserEntry = false;
            this.isAdded = false;
            this.isCompleted = false;
            if (document) {
                common.objects.automap(this, document);
            }
        }
        return DocumentsViewModel;
    })(srv.cls.DocumentsViewModel);
    cls.DocumentsViewModel = DocumentsViewModel;
    var DocVaultDocumentViewModel = (function (_super) {
        __extends(DocVaultDocumentViewModel, _super);
        function DocVaultDocumentViewModel(docVaultDocument) {
            _super.call(this);
            this.shouldImport = false;
            if (docVaultDocument) {
                common.objects.automap(this, docVaultDocument);
            }
        }
        return DocVaultDocumentViewModel;
    })(srv.cls.DocVaultDocumentViewModel);
    cls.DocVaultDocumentViewModel = DocVaultDocumentViewModel;
    var MilestoneStatus = (function () {
        function MilestoneStatus() {
            var _this = this;
            this.setDefault = function (isWholeSale, homebuyingType) {
                //preApproval
                if (homebuyingType == 3 /* GetPreApproved */) {
                    return 4 /* preApproved */;
                }
                else {
                    if (isWholeSale)
                        return 10 /* unsubmitted */;
                    else
                        return 1 /* prospect */;
                }
            };
            this.setStatus = function (isWholeSale, allLoanAppsCompleted, sixPiecesAcquired, homeBuyingType) {
                if (sixPiecesAcquired) {
                    if (allLoanAppsCompleted)
                        return 15 /* appCompleted */;
                    else
                        return 2 /* incomplete */;
                }
                else {
                    return _this.setDefault(isWholeSale, homeBuyingType);
                }
            };
        }
        return MilestoneStatus;
    })();
    cls.MilestoneStatus = MilestoneStatus;
    var ManageUserAccountsViewModel = (function (_super) {
        __extends(ManageUserAccountsViewModel, _super);
        function ManageUserAccountsViewModel(manageUserAccount) {
            _super.call(this);
            if (manageUserAccount) {
                common.objects.automap(this, manageUserAccount);
            }
            this.verifyBorrowerName = false;
            this.verifyCoBorrowerName = false;
            this.verifySubjectPropertyAddress = false;
            this.verifySecurityQuestion = false;
        }
        Object.defineProperty(ManageUserAccountsViewModel.prototype, "isEmailVisible", {
            get: function () {
                return !(this.isJointAccount && this.userAccount.isCoBorrower && !this.isSeparateAccount) || this.coBorrowerAccountOptionId != 1 /* JointWithBorrower */;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ManageUserAccountsViewModel.prototype, "isConfirmEmailVisible", {
            get: function () {
                return this.isEmailVisible;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ManageUserAccountsViewModel.prototype, "isJointAccountMessageVisible", {
            get: function () {
                return this.isJointAccount && this.userAccount.isCoBorrower && !this.isSeparateAccount && this.coBorrowerAccountOptionId == 1 /* JointWithBorrower */;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ManageUserAccountsViewModel.prototype, "isOnlineUserVisible", {
            get: function () {
                return this.isEmailVisible;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ManageUserAccountsViewModel.prototype, "isPasswordVisible", {
            get: function () {
                return false;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ManageUserAccountsViewModel.prototype, "isQuestionAndAnswerVisible", {
            get: function () {
                return this.isSecurityVisible || (this.userAccount.userAccountId == 0 && !(this.isJointAccount && this.userAccount.isCoBorrower)) || (this.userAccount.isCoBorrower && this.isSeparateAccount && ((this.userAccount.jointAccountId != 0 && this.userAccount.jointAccountId != null && this.userAccount.jointAccountId == this.borrowerUserAccountId) && this.userAccount.userAccountId != 0 || this.userAccount.userAccountId == 0));
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ManageUserAccountsViewModel.prototype, "isResendActivationVisible", {
            get: function () {
                return (this.userAccount.userAccountId != 0 && !this.userAccount.isCoBorrower || (this.userAccount.isCoBorrower && !this.isQuestionAndAnswerVisible && this.isSeparateAccount)) && !this.userAccount.isActivated && !this.isSecurityVisible;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ManageUserAccountsViewModel.prototype, "isResendValidationVisible", {
            get: function () {
                return this.userAccount.userAccountId != 0 && this.userAccount.isActivated && this.sendVerification;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ManageUserAccountsViewModel.prototype, "isActionButtonVisible", {
            get: function () {
                return this.isEmailVisible;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ManageUserAccountsViewModel.prototype, "isVerifyAccountInformationVisible", {
            get: function () {
                return this.userAccount.isActivated && this.automaticallyOpen && this.isEmailVisible && this.userAccount.isOnlineUser;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ManageUserAccountsViewModel.prototype, "isVerifyBorrowerNameVisible", {
            get: function () {
                return this.userAccount.username && this.userAccount.confirmEmail && this.userAccount.username.toLowerCase() == this.userAccount.confirmEmail.toLowerCase();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ManageUserAccountsViewModel.prototype, "isVerifyCoBorrowerNameVisible", {
            get: function () {
                return this.verifyBorrowerName && !common.string.isNullOrWhiteSpace(this.coBorrowerFirstName) && !common.string.isNullOrWhiteSpace(this.coBorrowerLastName);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ManageUserAccountsViewModel.prototype, "isVerifySubjectPropertyAddressVisible", {
            get: function () {
                return this.recentSubjectPropertyAddress.zipCode != null && ((this.isVerifyCoBorrowerNameVisible && this.verifyCoBorrowerName) || (!this.isVerifyCoBorrowerNameVisible && this.verifyBorrowerName));
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ManageUserAccountsViewModel.prototype, "isVerifySecurityQuestionVisible", {
            get: function () {
                return this.isVerifySubjectPropertyAddressVisible && this.verifySubjectPropertyAddress && !common.string.isNullOrWhiteSpace(this.userAccount.securityAnswer);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ManageUserAccountsViewModel.prototype, "VerifyBorrowerName", {
            get: function () {
                return this.verifyBorrowerName;
            },
            set: function (value) {
                if (!value)
                    this.VerifyCoBorrowerName = value;
                this.verifyBorrowerName = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ManageUserAccountsViewModel.prototype, "VerifyCoBorrowerName", {
            get: function () {
                return this.verifyCoBorrowerName;
            },
            set: function (value) {
                if (!value)
                    this.VerifySubjectPropertyAddress = value;
                this.verifyCoBorrowerName = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ManageUserAccountsViewModel.prototype, "VerifySubjectPropertyAddress", {
            get: function () {
                return this.verifySubjectPropertyAddress;
            },
            set: function (value) {
                if (!value)
                    this.VerifySecurityQuestion = value;
                this.verifySubjectPropertyAddress = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ManageUserAccountsViewModel.prototype, "VerifySecurityQuestion", {
            get: function () {
                return this.verifySecurityQuestion;
            },
            set: function (value) {
                this.verifySecurityQuestion = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ManageUserAccountsViewModel.prototype, "securityQuestion", {
            get: function () {
                var self = this;
                return this.securityQuestions.filter(function (item) {
                    return item.value == new String(self.userAccount.securityQuestion);
                })[0].text;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ManageUserAccountsViewModel.prototype, "isEmailDisabled", {
            get: function () {
                return this.userAccount.userAccountId == this.originalUserAccountId && this.userAccount.isActivated;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ManageUserAccountsViewModel.prototype, "actionButtonText", {
            get: function () {
                if (this.isVerifyAccountInformationVisible)
                    return srv.manageUserAccountButtonActions.connectAccount;
                else
                    return (!this.userAccount.userAccountId || this.userAccount.userAccountId == 0) && !this.isJointAccount || (this.isJointAccount && this.userAccount.isCoBorrower) ? srv.manageUserAccountButtonActions.createAccount : srv.manageUserAccountButtonActions.updateAccount;
            },
            enumerable: true,
            configurable: true
        });
        return ManageUserAccountsViewModel;
    })(srv.cls.ManageUserAccountsViewModel);
    cls.ManageUserAccountsViewModel = ManageUserAccountsViewModel;
    var DisclosureStatusDetailsViewModel = (function (_super) {
        __extends(DisclosureStatusDetailsViewModel, _super);
        function DisclosureStatusDetailsViewModel(disclosureStatusDetailsViewModel) {
            _super.call(this);
            if (disclosureStatusDetailsViewModel) {
                common.objects.automap(this, disclosureStatusDetailsViewModel);
            }
        }
        return DisclosureStatusDetailsViewModel;
    })(srv.cls.DisclosureStatusDetailsViewModel);
    cls.DisclosureStatusDetailsViewModel = DisclosureStatusDetailsViewModel;
    var FHACalculatorRequestViewModel = (function (_super) {
        __extends(FHACalculatorRequestViewModel, _super);
        function FHACalculatorRequestViewModel(FHAScenarioViewModel, allowableBorrowerPaidClosingCosts, prepaidExpenses, lenderCreditforClosingCostsAndPrepaids, countyLoanLimit, baseLoanAmount, userAccountId) {
            _super.call(this);
            this.fhaScenario = FHAScenarioViewModel;
            this.allowableBorrowerPaidClosingCosts = allowableBorrowerPaidClosingCosts;
            this.prepaidExpenses = prepaidExpenses;
            this.lenderCreditforClosingCostsAndPrepaids = lenderCreditforClosingCostsAndPrepaids;
            this.countyLoanLimit = countyLoanLimit;
            this.baseLoanAmount = baseLoanAmount;
            this.userAccountId;
        }
        return FHACalculatorRequestViewModel;
    })(srv.cls.FHACalculatorRequest);
    cls.FHACalculatorRequestViewModel = FHACalculatorRequestViewModel;
    var VACalculatorRequestViewModel = (function (_super) {
        __extends(VACalculatorRequestViewModel, _super);
        function VACalculatorRequestViewModel(existingVALoanBalance, eehiCosts, veteranPaymentCash, discountPoints, originationFee, vaFundingFee, totalClosingCosts) {
            _super.call(this);
            this.existingVALoanBalance = existingVALoanBalance;
            this.eehiCosts = eehiCosts;
            this.veteranPaymentCash = veteranPaymentCash;
            this.discountPoints = discountPoints;
            this.originationFee = originationFee;
            this.vaFundingFee = vaFundingFee;
            this.totalClosingCosts = totalClosingCosts;
        }
        return VACalculatorRequestViewModel;
    })(srv.cls.VACalculatorRequest);
    cls.VACalculatorRequestViewModel = VACalculatorRequestViewModel;
    var LoanDateHistoryViewModel = (function (_super) {
        __extends(LoanDateHistoryViewModel, _super);
        function LoanDateHistoryViewModel(dateHistory) {
            _super.call(this);
            if (dateHistory) {
                common.objects.automap(this, dateHistory);
            }
        }
        return LoanDateHistoryViewModel;
    })(srv.cls.LoanDateHistoryViewModel);
    cls.LoanDateHistoryViewModel = LoanDateHistoryViewModel;
    var CopyLoanViewModel = (function (_super) {
        __extends(CopyLoanViewModel, _super);
        function CopyLoanViewModel(_borrowerIds, _copySubjectPropertyFlag, _creditReportIds, _creditReportIncluded, _loanApplicationIds, _loanId, _loanNumber, _newClosingDate, _newLienPositon, _newLoanPurpose, _newMainApplicationId, _subjectPropertyId, _userAccountId) {
            _super.call(this);
            this.borrowerIds = _borrowerIds;
            this.copySubjectPropertyFlag = _copySubjectPropertyFlag;
            this.creditReportIds = _creditReportIds;
            this.creditReportIncluded = _creditReportIncluded;
            this.loanApplicationIds = _loanApplicationIds;
            this.loanId = _loanId;
            this.loanNumber = _loanNumber;
            this.newClosingDate = _newClosingDate;
            this.newLienPosition = _newLienPositon;
            this.newLoanPurpose = _newLoanPurpose;
            this.newMainApplicationId = _newMainApplicationId;
            this.subjectPropertyId = _subjectPropertyId;
            this.userAccountId = _userAccountId;
        }
        return CopyLoanViewModel;
    })(srv.cls.CopyLoanViewModel);
    cls.CopyLoanViewModel = CopyLoanViewModel;
})(cls || (cls = {}));
//# sourceMappingURL=extendedviewmodels.js.map