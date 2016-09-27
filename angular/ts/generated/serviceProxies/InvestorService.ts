// This file (InvestorService.ts - ver 1.0) has been has been automatically generated, do not modify! 

/// <reference path="../../global/global.ts" />	
/// <reference path="../../lib/httpUtil.ts" />	
/// <reference path="../enums.ts" />	
/// <reference path="../viewModels.ts" />	

module srv {
	export class InvestorService  {

		static className = 'InvestorService';
		static $inject = ['httpUtil'];
		
		constructor(private httpUtil : util.httpUtil) {
		}
		
		GetProductRuleGeneric = <T>(ruCode: string, successHandler: util.SuccessResponseCallBack<T>, serviceEventOrMessage?: util.ServiceEvent|string, errorHandler?: util.ErrorResponseCallBack, methodPath = 'InvestorService/GetProductRule', config?: ng.IRequestShortcutConfig): ng.IPromise<T> => {
            return this.httpUtil.get<T>(methodPath, { ruCode : ruCode }, serviceEventOrMessage, errorHandler, config, successHandler);
        }

		GetProductRule = (ruCode: string, serviceEventOrMessage?: util.ServiceEvent|string, successHandler?: util.SuccessResponseCallBack<string>, errorHandler?: util.ErrorResponseCallBack, methodPath = 'InvestorService/GetProductRule', config?: ng.IRequestShortcutConfig): ng.IPromise<string> => {
			return this.GetProductRuleGeneric<string>(ruCode, successHandler || this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
		}
	}
}

moduleRegistration.registerService(moduleNames.services, srv.InvestorService);

