// This file (CopyLoanService.ts - ver 1.0) has been has been automatically generated, do not modify! 

/// <reference path="../../global/global.ts" />	
/// <reference path="../../lib/httpUtil.ts" />	
/// <reference path="../enums.ts" />	
/// <reference path="../viewModels.ts" />	

module srv {
	export class CopyLoanService  {

		static className = 'CopyLoanService';
		static $inject = ['httpUtil'];
		
		constructor(private httpUtil : util.httpUtil) {
		}
		
		CopyLoanGeneric = <T>(copyLoanViewModel: ICopyLoanViewModel, successHandler: util.SuccessResponseCallBack<T>, serviceEventOrMessage?: util.ServiceEvent|string, errorHandler?: util.ErrorResponseCallBack, methodPath = 'CopyLoanService/CopyLoan', config?: ng.IRequestShortcutConfig): ng.IPromise<T> => {
            return this.httpUtil.post<T>(methodPath, { copyLoanViewModel : copyLoanViewModel }, serviceEventOrMessage, errorHandler, config, successHandler);
        }

		CopyLoan = (copyLoanViewModel: ICopyLoanViewModel, serviceEventOrMessage?: util.ServiceEvent|string, successHandler?: util.SuccessResponseCallBack<string>, errorHandler?: util.ErrorResponseCallBack, methodPath = 'CopyLoanService/CopyLoan', config?: ng.IRequestShortcutConfig): ng.IPromise<string> => {
			return this.CopyLoanGeneric<string>(copyLoanViewModel, successHandler || this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
		}
	}
}

moduleRegistration.registerService(moduleNames.services, srv.CopyLoanService);

