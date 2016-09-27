// This file (CreditService.ts - ver 1.0) has been has been automatically generated, do not modify! 

/// <reference path="../../global/global.ts" />	
/// <reference path="../../lib/httpUtil.ts" />	
/// <reference path="../enums.ts" />	
/// <reference path="../viewModels.ts" />	

module srv {
	export class CreditService  {

		static className = 'CreditService';
		static $inject = ['httpUtil'];
		
		constructor(private httpUtil : util.httpUtil) {
		}
		
		ReRunCreditReportGeneric = <T>(loanId: string, userAccountId: number, reRunCredit: boolean, borrowerId: string, successHandler: util.SuccessResponseCallBack<T>, serviceEventOrMessage?: util.ServiceEvent|string, errorHandler?: util.ErrorResponseCallBack, methodPath = 'CreditService/ReRunCreditReport', config?: ng.IRequestShortcutConfig): ng.IPromise<T> => {
            return this.httpUtil.get<T>(methodPath, { loanId : loanId, userAccountId : userAccountId, reRunCredit : reRunCredit, borrowerId : borrowerId }, serviceEventOrMessage, errorHandler, config, successHandler);
        }

		ReRunCreditReport = (loanId: string, userAccountId: number, reRunCredit: boolean, borrowerId: string, serviceEventOrMessage?: util.ServiceEvent|string, successHandler?: util.SuccessResponseCallBack<boolean>, errorHandler?: util.ErrorResponseCallBack, methodPath = 'CreditService/ReRunCreditReport', config?: ng.IRequestShortcutConfig): ng.IPromise<boolean> => {
			return this.ReRunCreditReportGeneric<boolean>(loanId, userAccountId, reRunCredit, borrowerId, successHandler || this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
		}
	}
}

moduleRegistration.registerService(moduleNames.services, srv.CreditService);

