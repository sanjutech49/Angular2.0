// This file (MegaLoanService.ts - ver 1.0) has been has been automatically generated, do not modify! 

/// <reference path="../../global/global.ts" />	
/// <reference path="../../lib/httpUtil.ts" />	
/// <reference path="../enums.ts" />	
/// <reference path="../viewModels.ts" />	

module srv {
	export class MegaLoanService  {

		static className = 'MegaLoanService';
		static $inject = ['httpUtil'];
		
		constructor(private httpUtil : util.httpUtil) {
		}
		
		EagerLoadGeneric = <T>(loanId: string, userAccountId: number, successHandler: util.SuccessResponseCallBack<T>, serviceEventOrMessage?: util.ServiceEvent|string, errorHandler?: util.ErrorResponseCallBack, methodPath = 'MegaLoanService/EagerLoad', config?: ng.IRequestShortcutConfig): ng.IPromise<T> => {
            return this.httpUtil.get<T>(methodPath, { loanId : loanId, userAccountId : userAccountId }, serviceEventOrMessage, errorHandler, config, successHandler);
        }

		EagerLoad = (loanId: string, userAccountId: number, serviceEventOrMessage?: util.ServiceEvent|string, successHandler?: util.SuccessResponseCallBack<ILoanViewModel>, errorHandler?: util.ErrorResponseCallBack, methodPath = 'MegaLoanService/EagerLoad', config?: ng.IRequestShortcutConfig): ng.IPromise<ILoanViewModel> => {
			return this.EagerLoadGeneric<ILoanViewModel>(loanId, userAccountId, successHandler || this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
		}
		
		SaveGeneric = <T>(loan: ILoanViewModel, userAccountId: number, successHandler: util.SuccessResponseCallBack<T>, serviceEventOrMessage?: util.ServiceEvent|string, errorHandler?: util.ErrorResponseCallBack, methodPath = 'MegaLoanService/Save', config?: ng.IRequestShortcutConfig): ng.IPromise<T> => {
            return this.httpUtil.post<T>(methodPath, { loan : loan, userAccountId : userAccountId }, serviceEventOrMessage, errorHandler, config, successHandler);
        }

		Save = (loan: ILoanViewModel, userAccountId: number, serviceEventOrMessage?: util.ServiceEvent|string, successHandler?: util.SuccessResponseCallBack<ILoanViewModel>, errorHandler?: util.ErrorResponseCallBack, methodPath = 'MegaLoanService/Save', config?: ng.IRequestShortcutConfig): ng.IPromise<ILoanViewModel> => {
			return this.SaveGeneric<ILoanViewModel>(loan, userAccountId, successHandler || this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
		}
	}
}

moduleRegistration.registerService(moduleNames.services, srv.MegaLoanService);

