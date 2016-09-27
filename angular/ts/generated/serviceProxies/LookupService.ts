// This file (LookupService.ts - ver 1.0) has been has been automatically generated, do not modify! 

/// <reference path="../../global/global.ts" />	
/// <reference path="../../lib/httpUtil.ts" />	
/// <reference path="../enums.ts" />	
/// <reference path="../viewModels.ts" />	

module srv {
	export class LookupService  {

		static className = 'LookupService';
		static $inject = ['httpUtil'];
		
		constructor(private httpUtil : util.httpUtil) {
		}
		
		EagerLoadGeneric = <T>(lookupId: string, keyword: string, successHandler: util.SuccessResponseCallBack<T>, serviceEventOrMessage?: util.ServiceEvent|string, errorHandler?: util.ErrorResponseCallBack, methodPath = 'LookupService/EagerLoad', config?: ng.IRequestShortcutConfig): ng.IPromise<T> => {
            return this.httpUtil.get<T>(methodPath, { lookupId : lookupId, keyword : keyword }, serviceEventOrMessage, errorHandler, config, successHandler);
        }

		EagerLoad = (lookupId: string, keyword: string, serviceEventOrMessage?: util.ServiceEvent|string, successHandler?: util.SuccessResponseCallBack<ILoanViewModel>, errorHandler?: util.ErrorResponseCallBack, methodPath = 'LookupService/EagerLoad', config?: ng.IRequestShortcutConfig): ng.IPromise<ILoanViewModel> => {
			return this.EagerLoadGeneric<ILoanViewModel>(lookupId, keyword, successHandler || this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
		}
	}
}

moduleRegistration.registerService(moduleNames.services, srv.LookupService);

