// This file (AusService.ts - ver 1.0) has been has been automatically generated, do not modify! 

/// <reference path="../../global/global.ts" />	
/// <reference path="../../lib/httpUtil.ts" />	
/// <reference path="../enums.ts" />	
/// <reference path="../viewModels.ts" />	

module srv {
	export class AusService  {

		static className = 'AusService';
		static $inject = ['httpUtil'];
		
		constructor(private httpUtil : util.httpUtil) {
		}
		
		EagerLoadGeneric = <T>(loanId: string, userAccountId: number, successHandler: util.SuccessResponseCallBack<T>, serviceEventOrMessage?: util.ServiceEvent|string, errorHandler?: util.ErrorResponseCallBack, methodPath = 'AusService/EagerLoad', config?: ng.IRequestShortcutConfig): ng.IPromise<T> => {
            return this.httpUtil.get<T>(methodPath, { loanId : loanId, userAccountId : userAccountId }, serviceEventOrMessage, errorHandler, config, successHandler);
        }

		EagerLoad = (loanId: string, userAccountId: number, serviceEventOrMessage?: util.ServiceEvent|string, successHandler?: util.SuccessResponseCallBack<IAusViewModel>, errorHandler?: util.ErrorResponseCallBack, methodPath = 'AusService/EagerLoad', config?: ng.IRequestShortcutConfig): ng.IPromise<IAusViewModel> => {
			return this.EagerLoadGeneric<IAusViewModel>(loanId, userAccountId, successHandler || this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
		}
	}
}

moduleRegistration.registerService(moduleNames.services, srv.AusService);

