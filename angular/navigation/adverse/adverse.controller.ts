module loanCenter {
    'use strict';

    export class adverseController {

        static className = 'adverseController';
        static $inject = ['model', '$modalStack', 'callBackDone','wrappedLoan', 'applicationData'];

        private adverseReason: srv.IAdverseReasonViewModel;

        constructor(public model, private $modalStack, private callBackDone, private wrappedLoan: lib.referenceWrapper<srv.ILoanViewModel>, private applicationData: any) {
            this.adverseReason = new srv.cls.AdverseReasonViewModel();
            if (this.model.adverseReason) {
                angular.extend(this.adverseReason, this.model.adverseReason); 
            }
        }

        public done = (): void => {
            this.callBackDone(this.adverseReason);
        }

        public cancel = (): void => {
            this.$modalStack.dismissAll('close');
        }

        public adverseDisabled = (): boolean => {
            return (!this.showComment() || common.string.isNullOrWhiteSpace(this.adverseReason.reason));
        }
        getAdverseReasons = (): any => {
            var flag_refinance = 1; // 0001
            var flag_common = 2; // 0010
            var flag_purchase = 3; // 0011
            var currentContext = flag_refinance;

            var reasons = lib.filter(this.applicationData.lookup.adverseReasons,(reason: any) => {
                return reason.value == srv.adverseReasons.SelectOne;
            });

            if (this.wrappedLoan.ref.loanPurposeType == srv.LoanPurposeTypeEnum.Purchase && this.wrappedLoan.ref.homeBuyingType == srv.HomeBuyingTypeEnum.GetPreApproved) {
                currentContext = flag_purchase;
                
            }
             lib.forEach(this.applicationData.lookup.adverseReasons,(reason: any) => {
                 if (reason.contextFlags == flag_common || reason.contextFlags == currentContext ) {
                        reasons.push(reason);
                    }
                }); 
            return reasons;
        }
        public showComment = (): boolean => {
            return (this.adverseReason.reasonType!=null && this.adverseReason.reasonType != srv.adverseReasons.SelectOne);
        }
    }

    angular.module('loanCenter').controller('adverseController', adverseController);
} 