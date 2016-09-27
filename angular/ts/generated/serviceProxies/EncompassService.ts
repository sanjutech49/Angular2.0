// This file (EncompassService.ts - ver 1.0) has been has been automatically generated, do not modify! 

/// <reference path="../../global/global.ts" />	
/// <reference path="../../lib/httpUtil.ts" />	
/// <reference path="../enums.ts" />	
/// <reference path="../viewModels.ts" />	

module srv {
	export class EncompassService  {

		static className = 'EncompassService';
		static $inject = ['httpUtil'];
		
		constructor(private httpUtil : util.httpUtil) {
		}
		
		UpdateLoanInEncompassGeneric = <T>(loanVM: ILoanViewModel, successHandler: util.SuccessResponseCallBack<T>, serviceEventOrMessage?: util.ServiceEvent|string, errorHandler?: util.ErrorResponseCallBack, methodPath = 'EncompassService/UpdateLoanInEncompass', config?: ng.IRequestShortcutConfig): ng.IPromise<T> => {
            return this.httpUtil.post<T>(methodPath, { loanVM : loanVM }, serviceEventOrMessage, errorHandler, config, successHandler);
        }

		UpdateLoanInEncompass = (loanVM: ILoanViewModel, serviceEventOrMessage?: util.ServiceEvent|string, successHandler?: util.SuccessResponseCallBack<boolean>, errorHandler?: util.ErrorResponseCallBack, methodPath = 'EncompassService/UpdateLoanInEncompass', config?: ng.IRequestShortcutConfig): ng.IPromise<boolean> => {
			return this.UpdateLoanInEncompassGeneric<boolean>(loanVM, successHandler || this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
		}
	}
}

moduleRegistration.registerService(moduleNames.services, srv.EncompassService);

