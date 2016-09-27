/// <reference path="../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../ts/generated/viewModels.ts" />
/// <reference path="../../ts/generated/viewModelClasses.ts" />
/// <reference path="../../ts/extendedViewModels/extendedViewModels.ts" />
var credit;
(function (credit) {
    (function (creditContext) {
        creditContext[creditContext["borrower"] = 0] = "borrower";
        creditContext[creditContext["coBorrower"] = 1] = "coBorrower";
        creditContext[creditContext["both"] = 2] = "both";
    })(credit.creditContext || (credit.creditContext = {}));
    var creditContext = credit.creditContext;
    var CreditStateService = (function () {
        function CreditStateService(CreditSvc, enums, loanEvent, guidService, costDetailsHelpers) {
            var _this = this;
            this.CreditSvc = CreditSvc;
            this.enums = enums;
            this.loanEvent = loanEvent;
            this.guidService = guidService;
            this.costDetailsHelpers = costDetailsHelpers;
            // these predicates are used for filtering, etc
            this.basePred = function (liability) { return !liability.isRemoved; };
            this.baseREO = function (liability) { return !liability.notMyLoan && liability.borrowerDebtCommentId != 9 /* Duplicate */; };
            this.primaryREO = function (liability) { return !liability.isSecondaryPartyRecord; };
            this.calcPred = function (l) { return _this.basePred(l) && l.includeInLiabilitiesTotal; };
            this.reosPred = function (liability) { return _this.basePred(liability) && liability.isPledged; }; /* && liability.typeId == cls.LiablitityTypeEnum.REO && */
            this.initializeLoan = function (wrappedLoan) {
                _this.wrappedLoan = wrappedLoan;
            };
            this.updateCredit = function (wrappedLoan, showCoBorrrower) {
                _this.wrappedLoan = wrappedLoan;
                _this.wrappedLoan.ref.active.initializeCredit();
                _this.setBorrowerDebtAccountOwnershipTypes(wrappedLoan.ref.active);
                _this.setReoPaymentDisplayValue(_this.wrappedLoan.ref.active.reos);
            };
            this.updateREO = function (updatedREO) {
                var isBorrower = _this.isBorrower(updatedREO);
                //if (isBorrower)
                //    this.updateBorrowerPropertyList(updatedREO, this.wrappedLoan.ref.active.getBorrower().reoPropertyList);
                //else if (this.wrappedLoan.ref.active.isSpouseOnTheLoan)
                //    this.updateBorrowerPropertyList(updatedREO, this.wrappedLoan.ref.active.getCoBorrower().reoPropertyList);
                // this.internalUpdateREO(updatedREO) || this.addREO(updatedREO, !isBorrower);
                // this.addToBorrowerLiabilities(updatedReo, isCoBorrower);
                _this.addToBorrowerLiabilities(updatedREO, !isBorrower);
                var allLiabilities = _this.wrappedLoan.ref.active.getBorrower().getLiabilities();
                if (_this.wrappedLoan.ref.active.isSpouseOnTheLoan && _this.wrappedLoan.ref.active.getCoBorrower() && _this.wrappedLoan.ref.active.getCoBorrower().getLiabilities())
                    allLiabilities = allLiabilities.concat(_this.wrappedLoan.ref.active.getCoBorrower().getLiabilities());
                if ((!_this.wrappedLoan.ref.housingExpenses.newFloodInsurance) && (!_this.wrappedLoan.ref.housingExpenses.newHazardInsurance) && (!_this.wrappedLoan.ref.housingExpenses.newTaxes) && _this.wrappedLoan.ref.loanPurposeType == 2) {
                    _this.updateCost();
                }
                else {
                    _this.processPropertyExpenses();
                }
                _this.wrappedLoan.ref.active.reos = lib.filter(allLiabilities, _this.reosPred);
                _this.setReoPaymentDisplayValue(_this.wrappedLoan.ref.active.reos);
            };
            this.showCollections = function () {
                return _this.wrappedLoan.ref.active.collections.length && _this.wrappedLoan.ref.active.collections.length > 0;
            };
            this.showPublicRecords = function () {
                return _this.wrappedLoan.ref.active.publicRecords.length && _this.wrappedLoan.ref.active.publicRecords.length > 0;
            };
            this.updateCost = function () {
                _this.wrappedLoan.ref.prepareSave();
                _this.CreditSvc.UpdateClosingCosts.UpdateClosingCosts(_this.wrappedLoan.ref).$promise.then(function (data) {
                    _this.wrappedLoan.ref.closingCost = data.closingCost;
                    _this.costDetailsHelpers.getCostDetailsData();
                    _this.processPropertyExpenses();
                }, function (error) {
                    var errmsg = "Error:" + JSON.stringify(error);
                    errmsg = errmsg.substr(0, 128);
                    console.error(errmsg);
                    // TODO: this.commonModalWindowFactory.open({ type: this.modalWindowType.error, message: 'A property expenses calculation error occurred.' });
                });
            };
            this.processPropertyExpenses = function () {
                // todo - add context values to the event
                _this.loanEvent.broadcastPropertyChangedEvent(20 /* RealEstate */, {});
            };
            this.deleteREO = function (liability) {
                liability.isRemoved = true;
                lib.removeFirst(_this.wrappedLoan.ref.active.reos, function (l) { return l == liability; });
                var property = liability.getProperty();
                if (property != null) {
                    var nri = property.getNetRentalIncome();
                    if (nri != null) {
                        nri.remove();
                    }
                    _this.resetPropertyOwnershipPercentage(property);
                }
            };
            /**
            * @desc Resets ownership percentage on active loan application if liability has unique property tied to it.
            */
            this.resetPropertyOwnershipPercentage = function (property) {
                if (!property) {
                    return;
                }
                var ti = _this.wrappedLoan.ref.getTransactionInfo();
                if (!!ti) {
                    var liabilitiesWithSameProperty = ti.liabilities.filter(function (li) { return !li.isRemoved && li.isPledged && li.hasProperty() && li.getProperty().propertyId == property.propertyId; });
                    if (liabilitiesWithSameProperty.length == 0) {
                        _this.wrappedLoan.ref.active.ownershipPercentage = null;
                    }
                }
            };
            this.summateTotalREOPropertyValues = function () {
                // @todo-cc: Review for how to detect empty value           
                var pred = function (l) { return _this.basePred(l) && _this.baseREO(l) && _this.primaryREO(l) && l.getProperty() && l.getProperty().currentEstimatedValue && (l.lienPosition == 1 || l.lienPosition == 0 || l.lienPosition == -1 || angular.isUndefined(l.lienPosition) || l.lienPosition == null || "" == ("" + l.lienPosition).trim()); };
                return lib.summate(_this.wrappedLoan.ref.active.reos, pred, function (l) { return l.getProperty().currentEstimatedValue; });
            };
            this.summateTotalREOBalance = function () {
                return lib.summate(_this.wrappedLoan.ref.active.reos, function (l) { return _this.basePred(l) && _this.baseREO(l) && _this.primaryREO(l); }, function (l) { return l.unpaidBalance; });
            };
            this.summateTotalREOPayment = function () {
                return lib.summate(_this.wrappedLoan.ref.active.reos, function (l) { return _this.basePred(l) && l.includeInTotalPayment && _this.primaryREO(l); }, function (l) { return l.totalPaymentDisplayValue; });
            };
            this.addCollection = function (liability, isCoBorrower) {
                _this.wrappedLoan.ref.active.collections.push(liability);
                _this.addToBorrowerLiabilities(liability, isCoBorrower);
            };
            this.deleteCollection = function (liability) {
                liability.isRemoved = true;
                lib.removeFirst(_this.wrappedLoan.ref.active.collections, function (l) { return l == liability; });
            };
            this.summateTotalCollectionsPayments = function () {
                return lib.summate(_this.wrappedLoan.ref.active.collections, _this.calcPred, function (l) { return l.minPayment; });
            };
            this.summateTotalCollectionsUnpaidBalance = function () {
                return lib.summate(_this.wrappedLoan.ref.active.collections, _this.calcPred, function (l) { return l.unpaidBalance; });
            };
            this.summateTotalPublicRecordsAmount = function () {
                return lib.summate(_this.wrappedLoan.ref.active.publicRecords, function (publicRecord) { return publicRecord.publicRecordComment != '4'; }, function (publicRecord) { return publicRecord.amount; });
            };
            this.addLiability = function (liability, isCoBorrower) {
                _this.addLiabilityToBorrower(liability, isCoBorrower);
            };
            this.deleteLiabilities = function (liability, isCoBorrower) {
                // Delete original liability record
                _this.deleteLiability(liability, isCoBorrower);
                _this.removeJointLiability(liability);
            };
            // Delete secondary liability record
            this.removeJointLiability = function (liability) {
                if (liability.isJoint && !liability.isJointWithSingleBorrowerID) {
                    _this.tryDeleteJointLiablity(_this.wrappedLoan.ref.active.borrowerLiabilities[1].liabilities, liability, true) || _this.tryDeleteJointLiablity(_this.wrappedLoan.ref.active.borrowerLiabilities[0].liabilities, liability, false);
                }
            };
            this.tryDeleteJointLiablity = function (liabilities, parentLiability, isCoBorrower) {
                var pred = (lib.IdIsNullOrDefault(parentLiability.liabilityInfoId)) ? function (l) { return l.originalClientId == parentLiability.clientId; } : function (l) { return l.originalLiabilityInfoId == parentLiability.liabilityInfoId; };
                var secondaryLiability = lib.findFirst(liabilities, pred);
                if (secondaryLiability) {
                    _this.deleteLiability(secondaryLiability, isCoBorrower);
                    return true;
                }
                return false;
            };
            this.deleteLiability = function (liability, isCoBorrower) {
                liability.isRemoved = true;
                //this.removeBorrowerLiabilityFromDisplay(liability, isCoBorrower);
            };
            this.summateLiabiltyUnpaidBalance = function (context) {
                return _this.summateLiabilityValues(context, function (l) { return l.unpaidBalance; });
            };
            this.summateLiabiltyPayment = function (context) {
                return _this.summateLiabilityValues(context, function (l) { return l.minPayment; });
            };
            this.summateLiabiltyPaymentPrimary = function (context) {
                return _this.summateLiabilityValuesPrimary(context, function (l) { return l.minPayment; });
            };
            this.summateLiabilityPaymentAdditionalMortgages = function (context) {
                return _this.summateLiabilityValuesAdditionalMorgages(context, function (l) { return l.minPayment; });
            };
            this.moveLiabilityBetweenBorrowers = function (liability) {
                if (_this.wrappedLoan.ref.active.isSpouseOnTheLoan) {
                    var pred = function (l) { return l == liability; };
                }
            };
            this.moveLiabilityToREO = function (liability, isCoBorrower) {
                if (!_this.isValidForMove(liability, isCoBorrower))
                    return;
                _this.CreditSvc.MoveLiabilityToREO.save(liability, function (pledgedAsset) {
                    // convert the liabity asset into a reo
                    // find other reos with the same property id
                    var reos = _this.wrappedLoan.ref.active.reos;
                    var pledgedAssets = lib.filter(reos, function (pa) { return !!pa.getProperty() && pa.getProperty().propertyId == pledgedAsset.propertyId; });
                    // make the lien position the highest against any others
                    // remove auto lien position
                    //liability.lienPosition = lib.max(pledgedAssets,(pa: cls.LiabilityViewModel) => pa.lienPosition) + 1;
                    liability.clientId = pledgedAssets.length;
                    liability.isPledged = pledgedAsset.isPledged;
                    liability.typeId = pledgedAsset.typeId;
                    liability.liabilityInfoType = pledgedAsset.liabilityInfoType;
                    liability.borrowerDebtCommentId = pledgedAsset.borrowerDebtCommentId;
                    liability.includeInLiabilitiesTotal = pledgedAsset.includeInLiabilitiesTotal;
                    liability.setProperty(new cls.PropertyViewModel(_this.wrappedLoan.ref.getTransactionInfoRef(), pledgedAsset.property));
                    liability.totalPaymentDisplayValue = pledgedAsset.totalPaymentDisplayValue;
                    liability.propertyAddressDisplayValue = pledgedAsset.propertyAddressDisplayValue;
                    liability.borrowerId = pledgedAsset.borrowerId;
                    liability.debtsAccountOwnershipType = isCoBorrower ? _this.coBorrowerDebtAccountOwnershipTypes[0].value : _this.borrowerDebtAccountOwnershipTypes[0].value;
                    liability.propertyId = null;
                    _this.wrappedLoan.ref.active.reos.push(liability);
                    //this.removeBorrowerLiabilityFromDisplay(liability, isCoBorrower);
                    _this.removeJointLiability(liability);
                }, function (error) {
                    var errmsg = "Error:" + JSON.stringify(error);
                    errmsg = errmsg.substr(0, 128);
                    console.error(errmsg);
                });
            };
            // @todo - the UI requires too much knowledge of the backend service around moving liabilities between borrowers
            this.moveREOToLiability = function (pledgedAsset, isCoBorrower) {
                if (!_this.isValidForMove(pledgedAsset, isCoBorrower))
                    return;
                var loanApp = _this.wrappedLoan.ref.active;
                var property = pledgedAsset.getProperty();
                _this.removeNetRental(property);
                var targetBorrowerId = isCoBorrower ? _this.wrappedLoan.ref.active.getCoBorrower().borrowerId : _this.wrappedLoan.ref.active.getBorrower().borrowerId;
                // check if the liablility needs to be physically moved between borrower liability lists
                var isLiabilityTransferred = pledgedAsset.borrowerId != targetBorrowerId;
                _this.CreditSvc.moveREOToLiability.save(pledgedAsset, function (liability) {
                    // convert the pledged asset into a liablity
                    pledgedAsset.clientId = _this.wrappedLoan.ref.active.borrowerLiabilities[0].liabilities.length + (_this.wrappedLoan.ref.active.borrowerLiabilities[1] ? _this.wrappedLoan.ref.active.borrowerLiabilities[1].liabilities.length : 0);
                    pledgedAsset.debtCommentId = liability.debtCommentId;
                    pledgedAsset.liabilityInfoType = liability.liabilityInfoType;
                    pledgedAsset.includeInDTI = liability.includeInDTI;
                    pledgedAsset.includeInLiabilitiesTotal = liability.includeInLiabilitiesTotal;
                    pledgedAsset.typeId = liability.typeId;
                    pledgedAsset.isPledged = liability.isPledged;
                    pledgedAsset.debtType = liability.debtType;
                    pledgedAsset.accountOwnershipTypeToolTipText = liability.accountOwnershipTypeToolTipText;
                    pledgedAsset.accountOwnershipTypeIndicator = liability.accountOwnershipTypeIndicator;
                    pledgedAsset.debtsAccountOwnershipType = isCoBorrower ? _this.coBorrowerDebtAccountOwnershipTypes[0].value : _this.borrowerDebtAccountOwnershipTypes[0].value;
                    pledgedAsset.borrowerId = targetBorrowerId;
                    _this.removeLiablityFromREO(pledgedAsset);
                    if (isLiabilityTransferred) {
                        // if moving between borrowers, the existing liabilty has to be removed and the new one needs to aquire a GUID.
                        var liablityTarget = new cls.LiabilityViewModel(_this.wrappedLoan.ref.getTransactionInfoRef(), pledgedAsset);
                        liablityTarget.setProperty(pledgedAsset.getProperty());
                        // intialize the liability target to empty the Empty GUID in case the guid service fails
                        liablityTarget.liabilityInfoId = lib.getEmptyGuid();
                        _this.guidService.getNewGuid().then(function (response) {
                            liablityTarget.liabilityInfoId = response.data;
                        });
                        var targetBorrower;
                        var sourceBorrower;
                        if (isCoBorrower) {
                            sourceBorrower = _this.wrappedLoan.ref.active.getBorrower();
                            targetBorrower = _this.wrappedLoan.ref.active.getCoBorrower();
                        }
                        else {
                            targetBorrower = _this.wrappedLoan.ref.active.getBorrower();
                            sourceBorrower = _this.wrappedLoan.ref.active.getCoBorrower();
                        }
                        // always remove the pledgedAsset because it wll always be the existing liability (keep it in the list as remove will not show in the UI)
                        pledgedAsset.isRemoved = true;
                        // add the liablityTarget because it is new
                        targetBorrower.addLiability(liablityTarget);
                    }
                }, function (error) {
                    var errmsg = "Error:" + JSON.stringify(error);
                    errmsg = errmsg.substr(0, 128);
                    console.error(errmsg);
                });
            };
            this.getCombinedDebtAccountOwnershipTypes = function (borrowerName, coBorrowerName) {
                var debtAccountOwnershipTypes = new Array();
                debtAccountOwnershipTypes.push(new cls.LookupItem(borrowerName, (0 /* Borrower */).toString()));
                debtAccountOwnershipTypes.push(new cls.LookupItem(borrowerName + " with Other", (3 /* BorrowerWithOther */).toString()));
                debtAccountOwnershipTypes.push(new cls.LookupItem(coBorrowerName, (1 /* CoBorrower */).toString()));
                debtAccountOwnershipTypes.push(new cls.LookupItem(coBorrowerName + " with Other", (4 /* CoBorrowerWithOther */).toString()));
                debtAccountOwnershipTypes.push(new cls.LookupItem(borrowerName + ", " + coBorrowerName, (2 /* Joint */).toString()));
                return debtAccountOwnershipTypes;
            };
            this.getCompanyDataForCollection = function (liability, disableFields) {
                return _this.getCompanyDataForBaseLiability(liability, false, disableFields);
            };
            this.getCompanyDataForLiability = function (liability, disableFields) {
                return _this.getCompanyDataForBaseLiability(liability, true, disableFields);
            };
            this.getCompanyDataForBaseLiability = function (liability, isLiabiity, disableFields) {
                if (!liability.debtsAccountOwnershipType)
                    liability.debtsAccountOwnershipType = _this.wrappedLoan.ref.lookup.debtAccountOwnershipTypes[0].value;
                var data = {
                    title: 'Company Information',
                    isLiabilities: isLiabiity,
                    unpaidBalance: liability.unpaidBalance,
                    minPayment: liability.minPayment,
                    debtsAccountOwnershipType: liability.debtsAccountOwnershipType,
                    debtAccountOwnershipTypes: _this.wrappedLoan.ref.lookup.debtAccountOwnershipTypes,
                    disableFields: disableFields || liability.isSecondaryPartyRecord,
                    liabilityTypes: _this.wrappedLoan.ref.lookup.liabilityTypes,
                    states: _this.wrappedLoan.ref.lookup.allStates
                };
                return data;
            };
            //model, isPublicRecord, liabilityTypes, debtAccountOwnershipTypes, isLiabilities, isSecondaryPartyRecord, disableFields, states
            //model, true, this.wrappedLoan.ref.active.LiabilitiesFor(), null, false, false, this.commonData.disableFields, this.wrappedLoan.ref.lookup.allStates);
            this.getCompanyDataForPublicRecord = function (publicRecord, disableFields) {
                var liabilityTypes = _this.wrappedLoan.ref.active.LiabilitiesFor();
                if (!publicRecord.companyData.liabillityFor || publicRecord.companyData.liabillityFor == 'Individual' || (publicRecord.companyData.liabillityFor == 'Joint' && liabilityTypes.length == 1)) {
                    publicRecord.companyData.liabillityFor = liabilityTypes[0].value;
                }
                var data = {
                    title: 'Company Information',
                    isLiabilities: false,
                    unpaidBalance: publicRecord.originalAmount,
                    minPayment: 0,
                    debtsAccountOwnershipType: null,
                    debtAccountOwnershipTypes: null,
                    disableFields: disableFields,
                    liabilityTypes: null,
                    states: _this.wrappedLoan.ref.lookup.allStates
                };
            };
            this.processRulesForLiabilityOwnershipType = function (liability) {
                var hasChanges = liability.companyData.hasChanges;
                _this.CreditSvc.ProcessRulesForLiabilityOwnershipType.save(liability, function (liabilities) {
                    angular.extend(liability, liabilities[0]);
                    liability.companyData.hasChanges = hasChanges;
                    var originalBorrowerId = liability.borrowerId;
                    if (liability.debtsAccountOwnershipType == _this.enums.DebtsAccountOwnershipType.CoBorrower || liability.debtsAccountOwnershipType == _this.enums.DebtsAccountOwnershipType.CoBorrowerWithOther)
                        liability.borrowerId = _this.wrappedLoan.ref.active.getCoBorrower().borrowerId;
                    else
                        liability.borrowerId = _this.wrappedLoan.ref.active.getBorrower().borrowerId;
                    // If record is not joint or borrower was switched, delete previous secondary records
                    if (liability.debtsAccountOwnershipType != _this.enums.DebtsAccountOwnershipType.Joint || originalBorrowerId != liability.borrowerId)
                        _this.removeJointLiability(liability);
                    // If two records were returned, add Secondary debt for second Borrower
                    if (liabilities.length == 2) {
                        if (liability.borrowerId = _this.wrappedLoan.ref.active.getBorrower().borrowerId)
                            liabilities[1].borrowerId = _this.wrappedLoan.ref.active.getCoBorrower().borrowerId;
                        else
                            liabilities[1].borrowerId = _this.wrappedLoan.ref.active.getBorrower().borrowerId;
                        var collection = new cls.LiabilityViewModel(_this.wrappedLoan.ref.getTransactionInfoRef(), liabilities[1]);
                        //collection.fullName = this.wrappedLoan.ref.active.getCoBorrower().fullName;
                        _this.addCollection(collection, true);
                    }
                }, function (error) {
                    var errmsg = "Error:" + JSON.stringify(error);
                    errmsg = errmsg.substr(0, 128);
                    console.error(errmsg);
                });
            };
            this.setBorrowerDebtAccountOwnershipTypes = function (loanApplication) {
                var borrowerFullName = loanApplication.getBorrower().fullName;
                var coBorrowerFullName = loanApplication.isSpouseOnTheLoan ? loanApplication.getCoBorrower().fullName : "";
                // set the borrower account ownership
                _this.borrowerDebtAccountOwnershipTypes = new Array();
                _this.borrowerDebtAccountOwnershipTypes.push(new cls.LookupItem(borrowerFullName, (0 /* Borrower */).toString()));
                if (loanApplication.isSpouseOnTheLoan)
                    _this.borrowerDebtAccountOwnershipTypes.push(new cls.LookupItem(borrowerFullName + ", " + coBorrowerFullName, (2 /* Joint */).toString()));
                _this.borrowerDebtAccountOwnershipTypes.push(new cls.LookupItem(borrowerFullName + " with Other", (3 /* BorrowerWithOther */).toString()));
                // set the coborrower account ownership
                if (loanApplication.isSpouseOnTheLoan) {
                    _this.coBorrowerDebtAccountOwnershipTypes = new Array();
                    _this.coBorrowerDebtAccountOwnershipTypes.push(new cls.LookupItem(coBorrowerFullName, (1 /* CoBorrower */).toString()));
                    _this.coBorrowerDebtAccountOwnershipTypes.push(new cls.LookupItem(coBorrowerFullName + ", " + borrowerFullName, (2 /* Joint */).toString()));
                    _this.coBorrowerDebtAccountOwnershipTypes.push(new cls.LookupItem(coBorrowerFullName + " with Other", (4 /* CoBorrowerWithOther */).toString()));
                }
                // set the combined ownership types if spouse is on the loan
                if (loanApplication.isSpouseOnTheLoan)
                    _this.debtAccountOwnershipTypes = _this.getCombinedDebtAccountOwnershipTypes(borrowerFullName, coBorrowerFullName);
                else
                    _this.debtAccountOwnershipTypes = _this.borrowerDebtAccountOwnershipTypes;
            };
            this.getDebtAccountOwnershipTypes = function () {
                return _this.debtAccountOwnershipTypes;
            };
            this.setCompanyDataName = function (source) {
                var action = function (liability) { return liability.companyData.companyName = (liability.typeId == 2 /* Liability */ || liability.typeId == 3 /* Collection */) && !liability.companyData.companyName && !liability.isNewRow ? "Not specified" : liability.companyData.companyName; };
                lib.forEach(source, action);
            };
            this.setReoPaymentDisplayValue = function (source) {
                var action = function (liability) { return liability.totalPaymentDisplayValue = _this.setTotalPaymentsDisplayValue(liability); };
                lib.forEach(source, action);
            };
            this.summateLiabilityValuesPrimary = function (context, accessor) {
                var total = 0;
                var pred = function (l) { return l.typeId == 2 /* Installment */ && !l.isPledged && !l.isSecondaryPartyRecord && _this.calcPred(l); };
                total += _this.sumateLiabilityValuesHelper(_this.wrappedLoan.ref.primary, context, accessor, pred);
                return total;
            };
            this.summateLiabilityValuesAdditionalMorgages = function (context, accessor) {
                var total = 0;
                var pred = function (l) { return l.typeId == 2 /* Installment */ && !l.isPledged && !l.isSecondaryPartyRecord && _this.calcPred(l); };
                angular.forEach(_this.wrappedLoan.ref.getLoanApplications(), function (loanApplication) {
                    if (!loanApplication.isPrimary) {
                        total += _this.sumateLiabilityValuesHelper(loanApplication, context, accessor, pred);
                    }
                });
                return total;
            };
            this.sumateLiabilityValuesHelper = function (loanApplication, context, accessor, pred) {
                var total = 0;
                if (loanApplication != null && context != null) {
                    if (context == 0 /* borrower */ || context == 2 /* both */) {
                        total += lib.summate(loanApplication.borrowerLiabilities[0].liabilities, pred, accessor);
                    }
                    // don't calculate joint liabilities for the coBorrower
                    if (loanApplication.borrowerLiabilities[1] && (context == 1 /* coBorrower */ || context == 2 /* both */)) {
                        total += lib.summate(loanApplication.borrowerLiabilities[1].liabilities, function (l) { return pred(l); }, accessor);
                    }
                }
                return total;
            };
            this.getBorrowerLiabilities = function (liability) {
                return _this.isBorrower(liability) ? _this.wrappedLoan.ref.active.getBorrower().getLiabilities() : _this.wrappedLoan.ref.active.getCoBorrower().getLiabilities();
            };
            this.isBorrower = function (liablity) {
                if (liablity.borrowerId == _this.wrappedLoan.ref.active.getBorrower().borrowerId)
                    return true;
                else if (liablity.borrowerId == _this.wrappedLoan.ref.active.getCoBorrower().borrowerId)
                    return false;
                else
                    throw "The liability " + liablity.liabilityInfoId + " is not associated to either the brorrower or coBorrower";
            };
            this.addToBorrowerLiabilities = function (liability, isCoBorrower) {
                if (!isCoBorrower)
                    _this.wrappedLoan.ref.active.getBorrower().addLiability(liability);
                else
                    _this.wrappedLoan.ref.active.getCoBorrower().addLiability(liability);
            };
            this.removeLiablityFromREO = function (liability) {
                lib.removeFirst(_this.wrappedLoan.ref.active.reos, function (l) { return l == liability; });
            };
            this.isValidForMove = function (liability, isCoBorrower) {
                return !liability || (isCoBorrower && !_this.wrappedLoan.ref.active.isSpouseOnTheLoan) ? false : true;
            };
            this.addLiabilityToBorrower = function (liability, isCoBorrower) {
                isCoBorrower = _this.wrappedLoan.ref.active.isSpouseOnTheLoan && isCoBorrower;
                var borrowerTgt = isCoBorrower ? _this.wrappedLoan.ref.active.getCoBorrower() : _this.wrappedLoan.ref.active.getBorrower();
                borrowerTgt.addLiability(liability);
                // @todo-cl::PROPERTY-ADDRESS
                var idx = isCoBorrower ? 1 : 0;
                _this.wrappedLoan.ref.active.borrowerLiabilities[idx].liabilities.push(liability);
                return liability;
            };
            this.setTotalPaymentsDisplayValue = function (liability) {
                var paymentDisplayValue = liability.minPayment;
                var totalPropertyExpenses = 0;
                var propertyExpensesExist = (liability.getProperty() && liability.getProperty().propertyExpenses);
                var isFirstLienPosition = liability.lienPosition == 1;
                var isNotMyLoan = liability.borrowerDebtCommentId == 6 /* NotMyLoan */;
                if (propertyExpensesExist && liability.getProperty().propertyExpenses.length > 0) {
                    totalPropertyExpenses += lib.summate(liability.getProperty().propertyExpenses, function (e) { return !e.impounded; }, function (e) { return e.monthlyAmount; });
                }
                if (liability.borrowerDebtCommentId == _this.enums.PledgedAssetComment.PaidOffFreeAndClear) {
                    return totalPropertyExpenses;
                }
                if (isNotMyLoan || !propertyExpensesExist || !isFirstLienPosition)
                    return paymentDisplayValue;
                return paymentDisplayValue + totalPropertyExpenses;
            };
        }
        CreditStateService.prototype.removeNetRental = function (property) {
            if (property != null) {
                var nri = property.getNetRentalIncome();
                if (nri != null) {
                    nri.remove();
                }
            }
        };
        CreditStateService.prototype.summateLiabilityValues = function (context, accessor) {
            var _this = this;
            var total = 0;
            var pred = function (l) { return l.typeId == 2 && !l.isPledged && !l.isSecondaryPartyRecord && _this.calcPred(l); };
            if (context == 0 /* borrower */ || context == 2 /* both */)
                total += lib.summate(this.wrappedLoan.ref.active.borrowerLiabilities[0].liabilities, pred, accessor);
            if (this.wrappedLoan.ref.active.borrowerLiabilities[1] && (context == 1 /* coBorrower */ || context == 2 /* both */))
                total += lib.summate(this.wrappedLoan.ref.active.borrowerLiabilities[1].liabilities, function (l) { return pred(l); }, accessor);
            return total;
        };
        CreditStateService.$inject = ['CreditSvc', 'enums', 'loanEvent', 'guidService', 'costDetailsHelpers'];
        CreditStateService.className = 'CreditStateService';
        return CreditStateService;
    })();
    credit.CreditStateService = CreditStateService;
    angular.module('loanApplication').service(CreditStateService.className, CreditStateService);
})(credit || (credit = {}));
//# sourceMappingURL=credit.state.service.js.map