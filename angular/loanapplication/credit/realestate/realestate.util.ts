/// <reference path="../../../ts/extendedViewModels/transactionInfo.ts" />

module credit {

    export class LienPositionLookup implements srv.ILookupItem {

        selected: boolean;

        liabilityInfoId: string;
        disabled: boolean;

        constructor(public text: string, public value: string, private propertyId?: string) {
        }

        isLienPositionDisabled = (liabilityInfoId: string) => {

            console.log('isLienPositionDisabled: liabilityInfoId = ' + liabilityInfoId + ' propertyId = ' + this.propertyId);

            if (!this.liabilityInfoId)
                return false;

            console.log(this.text + " should disable " + this.liabilityInfoId != liabilityInfoId);

            return this.liabilityInfoId != liabilityInfoId;
        }
    }

    export class PropertyState {

        public lienPositionLookups: LienPositionLookup[] = [];

        constructor(public propertyId: string, lienPositionLookup: srv.IList<srv.ILookupItem>) {

            this.lienPositionLookups.push(new LienPositionLookup("Select One", "0"));
            lienPositionLookup.forEach(lookup => this.lienPositionLookups.push(new LienPositionLookup(lookup.text, lookup.value, propertyId)));
        }

        setLienPosition = (lienPosition: number, liabilityInfoId: string) => {

            console.log('setLienPosition: liability id' + liabilityInfoId + ' for prorperty id = ' + this.propertyId);

            // remove the previous lien position as a REO can only have one
            var lpl = lib.findFirst(this.lienPositionLookups, l => l.liabilityInfoId == liabilityInfoId);

            if (lpl)
                lpl.liabilityInfoId = null;

            if (lienPosition > 0) {

                // assign the new
                lpl = lib.findFirst(this.lienPositionLookups, l => +l.value == lienPosition);
                lpl.liabilityInfoId = liabilityInfoId;
            }
        }
    }
}

module realestate.util {
    //
    //export function copyTransactionInfo(loanVm: cls.LoanViewModel): cls.LoanViewModel {
    //    var loanVmTgt = new cls.LoanViewModel();
    //    common.objects.automap(loanVmTgt, loanVm);

    //    var tiSrc = <cls.TransactionInfo>loanVm.getTransactionInfo();
    //    var tiTgt = angular.copy(tiSrc);
    //    // @todo-cl: REview , should not be necessary unless types do not carry over with angular.copy()
    //    // ti.prepareSave();
    //    // ti.populate(() => this, loan.transactionInfo);

    //    loanVmTgt.getTransactionInfo = () => tiTgt;

    //    return loanVmTgt;
    //}

    //
    //export function copyREO(reo: cls.LiabilityViewModel): cls.LiablitySnapshot {

    //    return new cls.LiablitySnapshot(reo);
    //}
    //////////
    ////////export function copyREO(reo: srv.ILiabilityViewModel, lcb: cls.ILoanCallback): srv.ILiabilityViewModel {
    ////////    var loanVmCopy = copyTransactionInfo(lcb());
    ////////    var reoCopy = new cls.LiabilityViewModel(() => loanVmCopy, reo, reo.borrowerFullName);
    ////////    return reoCopy;
    ////////}

    //export function createREO(source: cls.LiablitySnapshot, wrappedLoan: lib.referenceWrapper<srv.ILoanViewModel>): cls.LiabilityViewModel {

    //    return new cls.LiabilityViewModel(() => <cls.LoanViewModel>wrappedLoan.ref, source);
    //}

    export function createPropertyCopy(property: cls.PropertyViewModel) {

        return new cls.PropertySnapshot(property);
    }
}
