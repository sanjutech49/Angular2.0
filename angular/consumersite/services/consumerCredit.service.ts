module consumersite {

    export interface IConsumerCreditService {
        checkCreditStatus(active: srv.ILoanApplicationViewModel, userAccountId: number, borrowerId: string, isReRun: boolean): void;

        runCredit(loan: vm.Loan): void;
    }

    export class ConsumerCreditService implements IConsumerCreditService {

        static $inject = ['$log'];
        static className = 'consumerCreditService';
        
        constructor(private $log: ng.ILogService) {
            
        }

        public checkCreditStatus(active: srv.ILoanApplicationViewModel, userAccountId: number, borrowerId: string, isReRun: boolean): void {

        }

        public runCredit(loan: vm.Loan): void {

        }
    }

    moduleRegistration.registerService(consumersite.moduleName, ConsumerCreditService);
}