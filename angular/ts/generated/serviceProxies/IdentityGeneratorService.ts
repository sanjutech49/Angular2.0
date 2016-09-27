// This file (IdentityGeneratorService.ts - ver 1.0) has been has been automatically generated, do not modify! 

/// <reference path="../../global/global.ts" />	
/// <reference path="../../lib/httpUtil.ts" />	
/// <reference path="../enums.ts" />	
/// <reference path="../viewModels.ts" />	

module srv {
	export class IdentityGeneratorService  {

		static className = 'IdentityGeneratorService';
		static $inject = ['httpUtil'];
		
		constructor(private httpUtil : util.httpUtil) {
		}
		
		GetGuidsGeneric = <T>(count: number, successHandler: util.SuccessResponseCallBack<T>, serviceEventOrMessage?: util.ServiceEvent|string, errorHandler?: util.ErrorResponseCallBack, methodPath = 'IdentityGeneratorService/GetGuids', config?: ng.IRequestShortcutConfig): ng.IPromise<T> => {
            return this.httpUtil.get<T>(methodPath, { count : count }, serviceEventOrMessage, errorHandler, config, successHandler);
        }

		GetGuids = (count: number, serviceEventOrMessage?: util.ServiceEvent|string, successHandler?: util.SuccessResponseCallBack<string[]>, errorHandler?: util.ErrorResponseCallBack, methodPath = 'IdentityGeneratorService/GetGuids', config?: ng.IRequestShortcutConfig): ng.IPromise<string[]> => {
			return this.GetGuidsGeneric<string[]>(count, successHandler || this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
		}
	}
}

moduleRegistration.registerService(moduleNames.services, srv.IdentityGeneratorService);

