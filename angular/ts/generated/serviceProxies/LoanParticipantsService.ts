// This file (LoanParticipantsService.ts - ver 1.0) has been has been automatically generated, do not modify! 

/// <reference path="../../global/global.ts" />	
/// <reference path="../../lib/httpUtil.ts" />	
/// <reference path="../enums.ts" />	
/// <reference path="../viewModels.ts" />	

module srv {
	export class LoanParticipantsService  {

		static className = 'LoanParticipantsService';
		static $inject = ['httpUtil'];
		
		constructor(private httpUtil : util.httpUtil) {
		}
		
		EagerLoadGeneric = <T>(loanId: string, userAccountId: number, successHandler: util.SuccessResponseCallBack<T>, serviceEventOrMessage?: util.ServiceEvent|string, errorHandler?: util.ErrorResponseCallBack, methodPath = 'LoanParticipantsService/EagerLoad', config?: ng.IRequestShortcutConfig): ng.IPromise<T> => {
            return this.httpUtil.get<T>(methodPath, { loanId : loanId, userAccountId : userAccountId }, serviceEventOrMessage, errorHandler, config, successHandler);
        }

		EagerLoad = (loanId: string, userAccountId: number, serviceEventOrMessage?: util.ServiceEvent|string, successHandler?: util.SuccessResponseCallBack<ILoanParticipantsViewModel>, errorHandler?: util.ErrorResponseCallBack, methodPath = 'LoanParticipantsService/EagerLoad', config?: ng.IRequestShortcutConfig): ng.IPromise<ILoanParticipantsViewModel> => {
			return this.EagerLoadGeneric<ILoanParticipantsViewModel>(loanId, userAccountId, successHandler || this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
		}
		
		GetEmptyCompanyContactGeneric = <T>(successHandler: util.SuccessResponseCallBack<T>, serviceEventOrMessage?: util.ServiceEvent|string, errorHandler?: util.ErrorResponseCallBack, methodPath = 'LoanParticipantsService/GetEmptyCompanyContact', config?: ng.IRequestShortcutConfig): ng.IPromise<T> => {
            return this.httpUtil.get<T>(methodPath, null, serviceEventOrMessage, errorHandler, config, successHandler);
        }

		GetEmptyCompanyContact = (serviceEventOrMessage?: util.ServiceEvent|string, successHandler?: util.SuccessResponseCallBack<IBasicCompanyContact<string>>, errorHandler?: util.ErrorResponseCallBack, methodPath = 'LoanParticipantsService/GetEmptyCompanyContact', config?: ng.IRequestShortcutConfig): ng.IPromise<IBasicCompanyContact<string>> => {
			return this.GetEmptyCompanyContactGeneric<IBasicCompanyContact<string>>(successHandler || this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
		}
		
		SaveGeneric = <T>(loanVm: ILoanViewModel, userAccountId: number, successHandler: util.SuccessResponseCallBack<T>, serviceEventOrMessage?: util.ServiceEvent|string, errorHandler?: util.ErrorResponseCallBack, methodPath = 'LoanParticipantsService/Save', config?: ng.IRequestShortcutConfig): ng.IPromise<T> => {
            return this.httpUtil.post<T>(methodPath, { loanVm : loanVm, userAccountId : userAccountId }, serviceEventOrMessage, errorHandler, config, successHandler);
        }

		Save = (loanVm: ILoanViewModel, userAccountId: number, serviceEventOrMessage?: util.ServiceEvent|string, successHandler?: util.SuccessResponseCallBack<ILoanParticipantsViewModel>, errorHandler?: util.ErrorResponseCallBack, methodPath = 'LoanParticipantsService/Save', config?: ng.IRequestShortcutConfig): ng.IPromise<ILoanParticipantsViewModel> => {
			return this.SaveGeneric<ILoanParticipantsViewModel>(loanVm, userAccountId, successHandler || this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
		}
	}
}

moduleRegistration.registerService(moduleNames.services, srv.LoanParticipantsService);

