module va.controller {
    class IRRLQMCertificationController {
        static $inject = ['wrappedLoan', 'vaCenterService', 'fhaCenterService', 'modalPopoverFactory', 'loanEvent'];

        constructor(public wrappedLoan: lib.referenceWrapper<cls.LoanViewModel>, private vaCenterService: va.service.IVACenterService,
            private fhaCenterService: fha.service.IFHACenterService, private modalPopoverFactory, private loanEvent) {
            loanEvent.broadcastPropertyChangedEvent(events.LoanFieldIdentifier.todo);
        }

        /**
        * @desc: Gets color based on value of model
        */
        colorTheText = (value: boolean): string => {
            return this.vaCenterService.colorTheText(value);
        }

        /**
        * @desc: Gets text based on value of model [true = Yes, flase = No]
        */
        getText = (value: boolean, isResult: boolean): string => {
            if (isResult)
                return this.vaCenterService.getText(value);
            else
                return this.fhaCenterService.getText(null, value);
        }

        showCurrentLoanOriginationDate = (event) => {
            var originationDatePopup = this.modalPopoverFactory.openModalPopover('angular/vacenter/irrlqmcertification/originationdate.html', {}, moment(this.wrappedLoan.ref.CurrentLoanOriginationDate).format('MM/DD/YYYY'), event );
            originationDatePopup.result.then((data) => {
                this.wrappedLoan.ref.CurrentLoanOriginationDate = data;
                this.loanEvent.broadcastPropertyChangedEvent(events.LoanFieldIdentifier.todo);
            });
        }
    }
    angular.module('vaCenter').controller('irrlQMCertificationController', IRRLQMCertificationController);
}