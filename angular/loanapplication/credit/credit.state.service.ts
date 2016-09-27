/// <reference path="../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../ts/generated/viewModels.ts" />
/// <reference path="../../ts/generated/viewModelClasses.ts" />
/// <reference path="../../ts/extendedViewModels/extendedViewModels.ts" />

module credit {

    export enum creditContext {

        borrower,
        coBorrower,
        both,
    }

    export class CreditStateService {

        static $inject = ['CreditSvc', 'enums', 'loanEvent', 'guidService', 'costDetailsHelpers'];
        static className = 'CreditStateService';

        borrowerDebtAccountOwnershipTypes: srv.IList<srv.ILookupItem>;
        coBorrowerDebtAccountOwnershipTypes: srv.IList<srv.ILookupItem>;
        debtAccountOwnershipTypes: srv.IList<srv.ILookupItem>;

        private wrappedLoan: lib.referenceWrapper<cls.LoanViewModel>;

        // these predicates are used for filtering, etc
        private basePred = (liability: srv.ILiabilityViewModel) => !liability.isRemoved;
        private baseREO = (liability: srv.ILiabilityViewModel) => !liability.notMyLoan && liability.borrowerDebtCommentId != srv.pledgedAssetCommentType.Duplicate;
        private primaryREO = (liability: srv.ILiabilityViewModel) => !liability.isSecondaryPartyRecord;
        private calcPred = (l: srv.ILiabilityViewModel) => this.basePred(l) && l.includeInLiabilitiesTotal;
        private reosPred = (liability: srv.ILiabilityViewModel) => this.basePred(liability) && liability.isPledged; /* && liability.typeId == cls.LiablitityTypeEnum.REO && */

        constructor(private CreditSvc, private enums, private loanEvent, private guidService, private costDetailsHelpers) {
        }

        public initializeLoan = (wrappedLoan: lib.referenceWrapper<cls.LoanViewModel>) => {
            this.wrappedLoan = wrappedLoan;
        }

        public updateCredit = (wrappedLoan: lib.referenceWrapper<cls.LoanViewModel>, showCoBorrrower?: boolean) => {

            this.wrappedLoan = wrappedLoan;

            this.wrappedLoan.ref.active.initializeCredit();

            this.setBorrowerDebtAccountOwnershipTypes(wrappedLoan.ref.active);
            this.setReoPaymentDisplayValue(this.wrappedLoan.ref.active.reos);
        }

        public updateREO = (updatedREO: cls.LiabilityViewModel) => {

            var isBorrower = this.isBorrower(updatedREO);

            //if (isBorrower)
            //    this.updateBorrowerPropertyList(updatedREO, this.wrappedLoan.ref.active.getBorrower().reoPropertyList);
            //else if (this.wrappedLoan.ref.active.isSpouseOnTheLoan)
            //    this.updateBorrowerPropertyList(updatedREO, this.wrappedLoan.ref.active.getCoBorrower().reoPropertyList);

            // this.internalUpdateREO(updatedREO) || this.addREO(updatedREO, !isBorrower);
            // this.addToBorrowerLiabilities(updatedReo, isCoBorrower);
            this.addToBorrowerLiabilities(updatedREO, !isBorrower);

            var allLiabilities = this.wrappedLoan.ref.active.getBorrower().getLiabilities();
            if (this.wrappedLoan.ref.active.isSpouseOnTheLoan && this.wrappedLoan.ref.active.getCoBorrower() && this.wrappedLoan.ref.active.getCoBorrower().getLiabilities())
                allLiabilities = allLiabilities.concat(<cls.LiabilityViewModel[]>this.wrappedLoan.ref.active.getCoBorrower().getLiabilities());

            if ((!this.wrappedLoan.ref.housingExpenses.newFloodInsurance)
                && (!this.wrappedLoan.ref.housingExpenses.newHazardInsurance)
                && (!this.wrappedLoan.ref.housingExpenses.newTaxes)
                && this.wrappedLoan.ref.loanPurposeType == 2) {
                this.updateCost();
            } else {
                this.processPropertyExpenses();
            }

            this.wrappedLoan.ref.active.reos = lib.filter(allLiabilities, this.reosPred);
            this.setReoPaymentDisplayValue(this.wrappedLoan.ref.active.reos);
        }

        public showCollections = (): boolean => {
            return this.wrappedLoan.ref.active.collections.length && this.wrappedLoan.ref.active.collections.length > 0;
        }

        public showPublicRecords = (): boolean => {
            return this.wrappedLoan.ref.active.publicRecords.length && this.wrappedLoan.ref.active.publicRecords.length > 0;
        }

        public updateCost = () => {

            this.wrappedLoan.ref.prepareSave();

            this.CreditSvc.UpdateClosingCosts.UpdateClosingCosts(this.wrappedLoan.ref).$promise.then(
                (data) => {
                    this.wrappedLoan.ref.closingCost = data.closingCost;
                    this.costDetailsHelpers.getCostDetailsData();
                    this.processPropertyExpenses();
                },
                (error) => {
                    var errmsg = "Error:" + JSON.stringify(error);
                    errmsg = errmsg.substr(0, 128);
                    console.error(errmsg);
                    // TODO: this.commonModalWindowFactory.open({ type: this.modalWindowType.error, message: 'A property expenses calculation error occurred.' });
                });
        }

        private processPropertyExpenses = () => {
            // todo - add context values to the event
            this.loanEvent.broadcastPropertyChangedEvent(events.LoanFieldIdentifier.RealEstate, {});
        }

        public deleteREO = (liability: cls.LiabilityViewModel) => {

            liability.isRemoved = true;
            lib.removeFirst(this.wrappedLoan.ref.active.reos, l => l == liability);

            var property = liability.getProperty();
            
            if (property != null) {
                var nri = <cls.IncomeInfoViewModel>property.getNetRentalIncome();
                if (nri != null) {
                    nri.remove();
                }
                this.resetPropertyOwnershipPercentage(property);
            }
        }

        /**
        * @desc Resets ownership percentage on active loan application if liability has unique property tied to it.
        */
        private resetPropertyOwnershipPercentage = (property: srv.IPropertyViewModel): void => {
            if (!property) {
                return;
            }

            var ti = <cls.TransactionInfo>this.wrappedLoan.ref.getTransactionInfo();
            if (!!ti) {
                var liabilitiesWithSameProperty = ti.liabilities.filter(li => !li.isRemoved && li.isPledged && li.hasProperty() && li.getProperty().propertyId == property.propertyId);
                if (liabilitiesWithSameProperty.length == 0) {
                    this.wrappedLoan.ref.active.ownershipPercentage = null;
                }
            }
        }

        public summateTotalREOPropertyValues = (): number => {
            // @todo-cc: Review for how to detect empty value           
            var pred = (l: srv.ILiabilityViewModel) => this.basePred(l) && this.baseREO(l) && this.primaryREO(l) && l.getProperty() && l.getProperty().currentEstimatedValue
                // @todo: using lien position to infer uniqueness , consider revising (performance also bad here)
                && (l.lienPosition == 1 || l.lienPosition == 0 || l.lienPosition == -1 || angular.isUndefined(l.lienPosition) || l.lienPosition == null || "" == ("" + l.lienPosition).trim());
         
            return lib.summate(this.wrappedLoan.ref.active.reos, pred, l => l.getProperty().currentEstimatedValue);
        }

        public summateTotalREOBalance = (): number => {

            return lib.summate(this.wrappedLoan.ref.active.reos, l => this.basePred(l) && this.baseREO(l) && this.primaryREO(l), l => l.unpaidBalance);
        }

        public summateTotalREOPayment = (): number => {

            return lib.summate(this.wrappedLoan.ref.active.reos, l => this.basePred(l) && l.includeInTotalPayment && this.primaryREO(l), l => l.totalPaymentDisplayValue);
        }

        public addCollection = (liability: cls.LiabilityViewModel, isCoBorrower: boolean) => {

            this.wrappedLoan.ref.active.collections.push(liability);
            this.addToBorrowerLiabilities(liability, isCoBorrower);
        }

        public deleteCollection = (liability: cls.LiabilityViewModel) => {

            liability.isRemoved = true;
            lib.removeFirst(this.wrappedLoan.ref.active.collections, l => l == liability);
        }

        public summateTotalCollectionsPayments = (): number => {

            return lib.summate(this.wrappedLoan.ref.active.collections, this.calcPred, l => l.minPayment);
        }

        public summateTotalCollectionsUnpaidBalance = (): number => {

            return lib.summate(this.wrappedLoan.ref.active.collections, this.calcPred, l => l.unpaidBalance);
        }

        public summateTotalPublicRecordsAmount = (): number => {

            return lib.summate(this.wrappedLoan.ref.active.publicRecords,(publicRecord: cls.PublicRecordViewModel) => publicRecord.publicRecordComment != '4', publicRecord => publicRecord.amount);
        }

        public addLiability = (liability: cls.LiabilityViewModel, isCoBorrower: boolean) => {

            this.addLiabilityToBorrower(liability, isCoBorrower);

        }

        public deleteLiabilities = (liability: srv.ILiabilityViewModel, isCoBorrower: boolean) => {

            // Delete original liability record
            this.deleteLiability(liability, isCoBorrower);
            this.removeJointLiability(liability);
        }

        // Delete secondary liability record
        private removeJointLiability = (liability: srv.ILiabilityViewModel) => {

            if (liability.isJoint && !liability.isJointWithSingleBorrowerID) {
                this.tryDeleteJointLiablity(this.wrappedLoan.ref.active.borrowerLiabilities[1].liabilities, liability, true) ||
                this.tryDeleteJointLiablity(this.wrappedLoan.ref.active.borrowerLiabilities[0].liabilities, liability, false);
            }
        }

        private tryDeleteJointLiablity = (liabilities: srv.ILiabilityViewModel[], parentLiability: srv.ILiabilityViewModel, isCoBorrower: boolean) => {

            var pred = (lib.IdIsNullOrDefault(parentLiability.liabilityInfoId)) ? l => l.originalClientId == parentLiability.clientId : l => l.originalLiabilityInfoId == parentLiability.liabilityInfoId;
            var secondaryLiability = lib.findFirst(liabilities, pred);
            if (secondaryLiability) {
                this.deleteLiability(secondaryLiability, isCoBorrower);
                return true;
            }
            return false;
        }

        public deleteLiability = (liability: srv.ILiabilityViewModel, isCoBorrower: boolean) => {

            liability.isRemoved = true;
            //this.removeBorrowerLiabilityFromDisplay(liability, isCoBorrower);
        }

        public summateLiabiltyUnpaidBalance = (context: creditContext) => {

            return this.summateLiabilityValues(context, l => l.unpaidBalance);
        }

        public summateLiabiltyPayment = (context: creditContext) => {

            return this.summateLiabilityValues(context, l => l.minPayment);
        }

        public summateLiabiltyPaymentPrimary = (context: creditContext) => {
            return this.summateLiabilityValuesPrimary(context, l => l.minPayment);
        }

        public summateLiabilityPaymentAdditionalMortgages = (context: creditContext) => {
            return this.summateLiabilityValuesAdditionalMorgages(context, l => l.minPayment);
        }

        public moveLiabilityBetweenBorrowers = (liability: srv.ILiabilityViewModel) => {

            if (this.wrappedLoan.ref.active.isSpouseOnTheLoan) {

                var pred = l => l == liability;

                //
                // @todo-cl::PROPERTY-ADDRESS
                //

                //if (lib.move(this.wrappedLoan.ref.active.borrowerLiabilities[0].liabilities, this.wrappedLoan.ref.active.borrowerLiabilities[1].liabilities, pred)) {
                //    lib.move(this.wrappedLoan.ref.active.getBorrower().Liabilities, this.wrappedLoan.ref.active.getCoBorrower().Liabilities, pred);
                //}
                //else if (lib.move(this.wrappedLoan.ref.active.borrowerLiabilities[1].liabilities, this.wrappedLoan.ref.active.borrowerLiabilities[0].liabilities, pred)) {
                //    lib.move(this.wrappedLoan.ref.active.getCoBorrower().Liabilities, this.wrappedLoan.ref.active.getBorrower().Liabilities, pred);
                //}
            }
        }

        public moveLiabilityToREO = (liability: cls.LiabilityViewModel, isCoBorrower: boolean) => {
            
            if (!this.isValidForMove(liability, isCoBorrower))
                return;

            this.CreditSvc.MoveLiabilityToREO.save(liability,(pledgedAsset: cls.LiabilityViewModel) => {
                 
                // convert the liabity asset into a reo
                // find other reos with the same property id
                var reos = this.wrappedLoan.ref.active.reos;
                var pledgedAssets = lib.filter(reos,(pa: srv.ILiabilityViewModel) => !!pa.getProperty() && pa.getProperty().propertyId == pledgedAsset.propertyId);

                // make the lien position the highest against any others
                // remove auto lien position
                //liability.lienPosition = lib.max(pledgedAssets,(pa: cls.LiabilityViewModel) => pa.lienPosition) + 1;
                liability.clientId = pledgedAssets.length;
                liability.isPledged = pledgedAsset.isPledged;
                liability.typeId = pledgedAsset.typeId;
                liability.liabilityInfoType = pledgedAsset.liabilityInfoType;
                liability.borrowerDebtCommentId = pledgedAsset.borrowerDebtCommentId;
                liability.includeInLiabilitiesTotal = pledgedAsset.includeInLiabilitiesTotal;
                liability.setProperty(new cls.PropertyViewModel(this.wrappedLoan.ref.getTransactionInfoRef(),pledgedAsset.property));
                liability.totalPaymentDisplayValue = pledgedAsset.totalPaymentDisplayValue;
                liability.propertyAddressDisplayValue = pledgedAsset.propertyAddressDisplayValue;
                liability.borrowerId = pledgedAsset.borrowerId;
                liability.debtsAccountOwnershipType = isCoBorrower ? this.coBorrowerDebtAccountOwnershipTypes[0].value : this.borrowerDebtAccountOwnershipTypes[0].value;
                liability.propertyId = null;

                this.wrappedLoan.ref.active.reos.push(liability);
                //this.removeBorrowerLiabilityFromDisplay(liability, isCoBorrower);
                this.removeJointLiability(liability);               
            },
                error => {
                    var errmsg = "Error:" + JSON.stringify(error);
                    errmsg = errmsg.substr(0, 128);
                    console.error(errmsg);
                });
        }

        private removeNetRental(property: srv.IPropertyViewModel) {
            if (property != null) {
                var nri = <cls.IncomeInfoViewModel>property.getNetRentalIncome();
                if (nri != null) {
                    nri.remove();
                }
            }
        }

        // @todo - the UI requires too much knowledge of the backend service around moving liabilities between borrowers
        public moveREOToLiability = (pledgedAsset: cls.LiabilityViewModel, isCoBorrower: boolean) => {

            if (!this.isValidForMove(pledgedAsset, isCoBorrower))
                return;

            var loanApp = <cls.LoanApplicationViewModel>this.wrappedLoan.ref.active;


            var property = pledgedAsset.getProperty();

            this.removeNetRental(property);

            var targetBorrowerId = isCoBorrower ? this.wrappedLoan.ref.active.getCoBorrower().borrowerId : this.wrappedLoan.ref.active.getBorrower().borrowerId;

            // check if the liablility needs to be physically moved between borrower liability lists
            var isLiabilityTransferred = pledgedAsset.borrowerId != targetBorrowerId;

            this.CreditSvc.moveREOToLiability.save(pledgedAsset,(liability: srv.ILiabilityViewModel) => {

                // convert the pledged asset into a liablity
                pledgedAsset.clientId = this.wrappedLoan.ref.active.borrowerLiabilities[0].liabilities.length + (this.wrappedLoan.ref.active.borrowerLiabilities[1] ? this.wrappedLoan.ref.active.borrowerLiabilities[1].liabilities.length : 0);
                pledgedAsset.debtCommentId = liability.debtCommentId;
                pledgedAsset.liabilityInfoType = liability.liabilityInfoType;
                pledgedAsset.includeInDTI = liability.includeInDTI;
                pledgedAsset.includeInLiabilitiesTotal = liability.includeInLiabilitiesTotal;
                pledgedAsset.typeId = liability.typeId;
                pledgedAsset.isPledged = liability.isPledged;
                pledgedAsset.debtType = liability.debtType;
                pledgedAsset.accountOwnershipTypeToolTipText = liability.accountOwnershipTypeToolTipText;
                pledgedAsset.accountOwnershipTypeIndicator = liability.accountOwnershipTypeIndicator;
                pledgedAsset.debtsAccountOwnershipType = isCoBorrower ? this.coBorrowerDebtAccountOwnershipTypes[0].value : this.borrowerDebtAccountOwnershipTypes[0].value;
                pledgedAsset.borrowerId = targetBorrowerId;
                this.removeLiablityFromREO(pledgedAsset);

                if (isLiabilityTransferred) {

                    // if moving between borrowers, the existing liabilty has to be removed and the new one needs to aquire a GUID.
                    var liablityTarget = new cls.LiabilityViewModel(this.wrappedLoan.ref.getTransactionInfoRef(), pledgedAsset);
                    liablityTarget.setProperty(pledgedAsset.getProperty());

                    // intialize the liability target to empty the Empty GUID in case the guid service fails
                    liablityTarget.liabilityInfoId = lib.getEmptyGuid();

                    this.guidService.getNewGuid().then(response => {
                        liablityTarget.liabilityInfoId = response.data
                    });

                    var targetBorrower: srv.IBorrowerViewModel;
                    var sourceBorrower: srv.IBorrowerViewModel;

                    if (isCoBorrower) {
                        sourceBorrower = this.wrappedLoan.ref.active.getBorrower();
                        targetBorrower = this.wrappedLoan.ref.active.getCoBorrower();
                    } else {
                        targetBorrower = this.wrappedLoan.ref.active.getBorrower();
                        sourceBorrower = this.wrappedLoan.ref.active.getCoBorrower();
                    }

                    // always remove the pledgedAsset because it wll always be the existing liability (keep it in the list as remove will not show in the UI)
                    pledgedAsset.isRemoved = true;                   

                    // add the liablityTarget because it is new
                    targetBorrower.addLiability(liablityTarget);
                }
            },
                (error) => {
                    var errmsg = "Error:" + JSON.stringify(error);
                    errmsg = errmsg.substr(0, 128);
                    console.error(errmsg);
                });
        }

        public getCombinedDebtAccountOwnershipTypes = (borrowerName: string, coBorrowerName: string): srv.IList<srv.ILookupItem> => {
            var debtAccountOwnershipTypes: srv.ILookupItem[] = new Array<srv.cls.LookupItem>();

            debtAccountOwnershipTypes.push(new cls.LookupItem(borrowerName,(srv.DebtsAccountOwnershipType.Borrower).toString()));
            debtAccountOwnershipTypes.push(new cls.LookupItem(borrowerName + " with Other",(srv.DebtsAccountOwnershipType.BorrowerWithOther).toString()));
            debtAccountOwnershipTypes.push(new cls.LookupItem(coBorrowerName,(srv.DebtsAccountOwnershipType.CoBorrower).toString()));
            debtAccountOwnershipTypes.push(new cls.LookupItem(coBorrowerName + " with Other",(srv.DebtsAccountOwnershipType.CoBorrowerWithOther).toString()));
            debtAccountOwnershipTypes.push(new cls.LookupItem(borrowerName + ", " + coBorrowerName,(srv.DebtsAccountOwnershipType.Joint).toString()));

            return debtAccountOwnershipTypes;
        }

        getCompanyDataForCollection = (liability: srv.ILiabilityViewModel, disableFields: boolean): any => {

            return this.getCompanyDataForBaseLiability(liability, false, disableFields);
        }

        getCompanyDataForLiability = (liability: srv.ILiabilityViewModel, disableFields: boolean): any => {

            return this.getCompanyDataForBaseLiability(liability, true, disableFields);
        }

        private getCompanyDataForBaseLiability = (liability: srv.ILiabilityViewModel, isLiabiity: boolean, disableFields: boolean): any => {

            if (!liability.debtsAccountOwnershipType)
                liability.debtsAccountOwnershipType = this.wrappedLoan.ref.lookup.debtAccountOwnershipTypes[0].value;

            var data = {
                title: 'Company Information',
                isLiabilities: isLiabiity,
                unpaidBalance: liability.unpaidBalance,
                minPayment: liability.minPayment,
                debtsAccountOwnershipType: liability.debtsAccountOwnershipType,
                debtAccountOwnershipTypes: this.wrappedLoan.ref.lookup.debtAccountOwnershipTypes,
                disableFields: disableFields || liability.isSecondaryPartyRecord,
                liabilityTypes: this.wrappedLoan.ref.lookup.liabilityTypes,
                states: this.wrappedLoan.ref.lookup.allStates
            }

            return data;
        }

        //model, isPublicRecord, liabilityTypes, debtAccountOwnershipTypes, isLiabilities, isSecondaryPartyRecord, disableFields, states

        //model, true, this.wrappedLoan.ref.active.LiabilitiesFor(), null, false, false, this.commonData.disableFields, this.wrappedLoan.ref.lookup.allStates);
        getCompanyDataForPublicRecord = (publicRecord: srv.IPublicRecordViewModel, disableFields): any => {

            var liabilityTypes = this.wrappedLoan.ref.active.LiabilitiesFor();

            if (!publicRecord.companyData.liabillityFor || publicRecord.companyData.liabillityFor == 'Individual' ||
                (publicRecord.companyData.liabillityFor == 'Joint' && liabilityTypes.length == 1)) {
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
                states: this.wrappedLoan.ref.lookup.allStates
            }
        }

        processRulesForLiabilityOwnershipType = (liability: srv.ILiabilityViewModel) => {

            var hasChanges = liability.companyData.hasChanges;

            this.CreditSvc.ProcessRulesForLiabilityOwnershipType.save(liability,(liabilities: srv.ILiabilityViewModel[]) => {

                angular.extend(liability, liabilities[0]);

                liability.companyData.hasChanges = hasChanges;

                var originalBorrowerId = liability.borrowerId;

                if (liability.debtsAccountOwnershipType == this.enums.DebtsAccountOwnershipType.CoBorrower ||
                    liability.debtsAccountOwnershipType == this.enums.DebtsAccountOwnershipType.CoBorrowerWithOther)
                    liability.borrowerId = this.wrappedLoan.ref.active.getCoBorrower().borrowerId;
                else
                    liability.borrowerId = this.wrappedLoan.ref.active.getBorrower().borrowerId;          

                // If record is not joint or borrower was switched, delete previous secondary records
                if (liability.debtsAccountOwnershipType != this.enums.DebtsAccountOwnershipType.Joint || originalBorrowerId != liability.borrowerId)
                    this.removeJointLiability(liability);
                   
                // If two records were returned, add Secondary debt for second Borrower
                if (liabilities.length == 2) {

                    if (liability.borrowerId = this.wrappedLoan.ref.active.getBorrower().borrowerId)
                        liabilities[1].borrowerId = this.wrappedLoan.ref.active.getCoBorrower().borrowerId;
                    else
                        liabilities[1].borrowerId = this.wrappedLoan.ref.active.getBorrower().borrowerId;

                    var collection = new cls.LiabilityViewModel(this.wrappedLoan.ref.getTransactionInfoRef(), liabilities[1]);
                    //collection.fullName = this.wrappedLoan.ref.active.getCoBorrower().fullName;

                    this.addCollection(collection, true);
                }
            },
                (error) => {
                    var errmsg = "Error:" + JSON.stringify(error);
                    errmsg = errmsg.substr(0, 128);
                    console.error(errmsg);
                });
        }

        public setBorrowerDebtAccountOwnershipTypes = (loanApplication: srv.ILoanApplicationViewModel) => {

            var borrowerFullName = loanApplication.getBorrower().fullName;
            var coBorrowerFullName = loanApplication.isSpouseOnTheLoan ? loanApplication.getCoBorrower().fullName : "";

            // set the borrower account ownership
            this.borrowerDebtAccountOwnershipTypes = new Array<srv.cls.LookupItem>();
            this.borrowerDebtAccountOwnershipTypes.push(new cls.LookupItem(borrowerFullName,(srv.DebtsAccountOwnershipType.Borrower).toString()));
            if (loanApplication.isSpouseOnTheLoan)
                this.borrowerDebtAccountOwnershipTypes.push(new cls.LookupItem(borrowerFullName + ", " + coBorrowerFullName,(srv.DebtsAccountOwnershipType.Joint).toString()));
            this.borrowerDebtAccountOwnershipTypes.push(new cls.LookupItem(borrowerFullName + " with Other",(srv.DebtsAccountOwnershipType.BorrowerWithOther).toString()));

            // set the coborrower account ownership
            if (loanApplication.isSpouseOnTheLoan) {

                this.coBorrowerDebtAccountOwnershipTypes = new Array<srv.cls.LookupItem>();
                this.coBorrowerDebtAccountOwnershipTypes.push(new cls.LookupItem(coBorrowerFullName,(srv.DebtsAccountOwnershipType.CoBorrower).toString()));
                this.coBorrowerDebtAccountOwnershipTypes.push(new cls.LookupItem(coBorrowerFullName + ", " + borrowerFullName,(srv.DebtsAccountOwnershipType.Joint).toString()));
                this.coBorrowerDebtAccountOwnershipTypes.push(new cls.LookupItem(coBorrowerFullName + " with Other",(srv.DebtsAccountOwnershipType.CoBorrowerWithOther).toString()));
            }

            // set the combined ownership types if spouse is on the loan
            if (loanApplication.isSpouseOnTheLoan)
                this.debtAccountOwnershipTypes = this.getCombinedDebtAccountOwnershipTypes(borrowerFullName, coBorrowerFullName);
            else // set the combined ownership is just the borrower types if there is no spouse on the loan application
                this.debtAccountOwnershipTypes = this.borrowerDebtAccountOwnershipTypes;
        }


        public getDebtAccountOwnershipTypes = () => {
            return this.debtAccountOwnershipTypes;
        }

        private setCompanyDataName = (source: srv.ILiabilityViewModel[]) => {

            var action = (liability: srv.ILiabilityViewModel) => liability.companyData.companyName = (liability.typeId == cls.LiablitityTypeEnum.Liability || liability.typeId == cls.LiablitityTypeEnum.Collection) && !liability.companyData.companyName && !liability.isNewRow ? "Not specified" : liability.companyData.companyName;
            lib.forEach(source, action);
        }

        private setReoPaymentDisplayValue = (source: srv.ILiabilityViewModel[]) => {

            var action = (liability: srv.ILiabilityViewModel) => liability.totalPaymentDisplayValue = this.setTotalPaymentsDisplayValue(liability);
            lib.forEach(source, action);
        }

        private summateLiabilityValues(context: creditContext, accessor: lib.IAccessor<srv.ILiabilityViewModel, number>): number {

            var total = 0;

            var pred = (l: srv.ILiabilityViewModel) => l.typeId == 2 && !l.isPledged && !l.isSecondaryPartyRecord && this.calcPred(l);

            if (context == creditContext.borrower || context == creditContext.both)
                total += lib.summate(this.wrappedLoan.ref.active.borrowerLiabilities[0].liabilities, pred, accessor);

            if (this.wrappedLoan.ref.active.borrowerLiabilities[1] && (context == creditContext.coBorrower || context == creditContext.both)) // don't calculate joint liabilities for the coBorrower
                total += lib.summate(this.wrappedLoan.ref.active.borrowerLiabilities[1].liabilities, l => pred(l), accessor);

            return total;
        }

        private summateLiabilityValuesPrimary = (context: creditContext, accessor: lib.IAccessor<srv.ILiabilityViewModel, number>) : number => {
            var total = 0;
            var pred = (l: srv.ILiabilityViewModel) => l.typeId == srv.LiabilityTypeEnum.Installment && !l.isPledged && !l.isSecondaryPartyRecord && this.calcPred(l);
            total += this.sumateLiabilityValuesHelper(this.wrappedLoan.ref.primary, context, accessor, pred);
            return total;
        }

        private summateLiabilityValuesAdditionalMorgages = (context: creditContext, accessor: lib.IAccessor<srv.ILiabilityViewModel, number>) : number => {
            var total = 0;
            var pred = (l: srv.ILiabilityViewModel) => l.typeId == srv.LiabilityTypeEnum.Installment && !l.isPledged && !l.isSecondaryPartyRecord && this.calcPred(l);
            angular.forEach(this.wrappedLoan.ref.getLoanApplications(), (loanApplication) =>
            {
                if (!loanApplication.isPrimary)
                {
                    total += this.sumateLiabilityValuesHelper(loanApplication, context, accessor, pred);
                }
            });
            return total;
        }

        private sumateLiabilityValuesHelper = (loanApplication: srv.ILoanApplicationViewModel, context: creditContext, accessor: lib.IAccessor<srv.ILiabilityViewModel, number>, pred: any) : number => {
            var total = 0;
            if (loanApplication != null && context != null) {
                if (context == creditContext.borrower || context == creditContext.both) {
                    total += lib.summate(loanApplication.borrowerLiabilities[0].liabilities, pred, accessor);
                }

                // don't calculate joint liabilities for the coBorrower
                if (loanApplication.borrowerLiabilities[1] && (context == creditContext.coBorrower || context == creditContext.both)) {
                    total += lib.summate(loanApplication.borrowerLiabilities[1].liabilities, l => pred(l), accessor);
                }
            }
            return total;
        }

        private getBorrowerLiabilities = (liability: srv.ILiabilityViewModel): cls.LiabilityViewModel[]=> {

            return this.isBorrower(liability) ? <cls.LiabilityViewModel[]>this.wrappedLoan.ref.active.getBorrower().getLiabilities() : <cls.LiabilityViewModel[]>this.wrappedLoan.ref.active.getCoBorrower().getLiabilities();

        }

        private isBorrower = (liablity: srv.ILiabilityViewModel): boolean => {
            if (liablity.borrowerId == this.wrappedLoan.ref.active.getBorrower().borrowerId)
                return true;
            else if (liablity.borrowerId == this.wrappedLoan.ref.active.getCoBorrower().borrowerId)
                return false;
            else
                throw "The liability " + liablity.liabilityInfoId + " is not associated to either the brorrower or coBorrower";
        }

        private addToBorrowerLiabilities = (liability: cls.LiabilityViewModel, isCoBorrower: boolean) => {

            if (!isCoBorrower)
                this.wrappedLoan.ref.active.getBorrower().addLiability(liability);
            else
                this.wrappedLoan.ref.active.getCoBorrower().addLiability(liability);
        }

        private removeLiablityFromREO = (liability: srv.ILiabilityViewModel) => {

            lib.removeFirst(this.wrappedLoan.ref.active.reos, l => l == liability);
        }

        private isValidForMove = (liability: srv.ILiabilityViewModel, isCoBorrower: boolean): boolean => {

            return !liability || (isCoBorrower && !this.wrappedLoan.ref.active.isSpouseOnTheLoan) ? false : true;
        }

        private addLiabilityToBorrower = (liability: cls.LiabilityViewModel, isCoBorrower: boolean): cls.LiabilityViewModel => {

            isCoBorrower = this.wrappedLoan.ref.active.isSpouseOnTheLoan && isCoBorrower;
            
            var borrowerTgt: cls.BorrowerViewModel = isCoBorrower ? <cls.BorrowerViewModel>this.wrappedLoan.ref.active.getCoBorrower() : <cls.BorrowerViewModel>this.wrappedLoan.ref.active.getBorrower();

            borrowerTgt.addLiability(liability);

            // @todo-cl::PROPERTY-ADDRESS
            var idx = isCoBorrower ? 1 : 0;
            this.wrappedLoan.ref.active.borrowerLiabilities[idx].liabilities.push(liability);

            return liability;
        }

        public setTotalPaymentsDisplayValue = (liability: srv.ILiabilityViewModel): number => {

            var paymentDisplayValue = liability.minPayment;
            var totalPropertyExpenses = 0;

            var propertyExpensesExist = (liability.getProperty() && liability.getProperty().propertyExpenses);

            var isFirstLienPosition = liability.lienPosition == 1;

            var isNotMyLoan = liability.borrowerDebtCommentId == srv.pledgedAssetCommentType.NotMyLoan;

            if (propertyExpensesExist && liability.getProperty().propertyExpenses.length > 0) {
                totalPropertyExpenses += lib.summate(liability.getProperty().propertyExpenses, e => !e.impounded, e => e.monthlyAmount);
            }
            if (liability.borrowerDebtCommentId == this.enums.PledgedAssetComment.PaidOffFreeAndClear) {
                return totalPropertyExpenses;
            }
            if (isNotMyLoan || !propertyExpensesExist || !isFirstLienPosition)
                return paymentDisplayValue;

            return paymentDisplayValue + totalPropertyExpenses;
        }
    }
    angular.module('loanApplication').service(CreditStateService.className, CreditStateService);
}