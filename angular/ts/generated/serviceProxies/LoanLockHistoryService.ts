// This file (LoanLockHistoryService.ts - ver 1.0) has been has been automatically generated, do not modify! 

/// <reference path="../../global/global.ts" />	
/// <reference path="../../lib/httpUtil.ts" />	
/// <reference path="../enums.ts" />	
/// <reference path="../viewModels.ts" />	

module srv {
	export class LoanLockHistoryService  {

		static className = 'LoanLockHistoryService';
		static $inject = ['httpUtil'];
		
		constructor(private httpUtil : util.httpUtil) {
		}
		
		LoadGeneric = <T>(loanId: string, userAccountId: number, successHandler: util.SuccessResponseCallBack<T>, serviceEventOrMessage?: util.ServiceEvent|string, errorHandler?: util.ErrorResponseCallBack, methodPath = 'LoanLockHistoryService/Load', config?: ng.IRequestShortcutConfig): ng.IPromise<T> => {
            return this.httpUtil.get<T>(methodPath, { loanId : loanId, userAccountId : userAccountId }, serviceEventOrMessage, errorHandler, config, successHandler);
        }

		Load = (loanId: string, userAccountId: number, serviceEventOrMessage?: util.ServiceEvent|string, successHandler?: util.SuccessResponseCallBack<ILoanLockHistoryViewModel>, errorHandler?: util.ErrorResponseCallBack, methodPath = 'LoanLockHistoryService/Load', config?: ng.IRequestShortcutConfig): ng.IPromise<ILoanLockHistoryViewModel> => {
			return this.LoadGeneric<ILoanLockHistoryViewModel>(loanId, userAccountId, successHandler || this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
		}
	}
}

moduleRegistration.registerService(moduleNames.services, srv.LoanLockHistoryService);

