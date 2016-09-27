// This file (NetTangibleBenefitService.ts - ver 1.0) has been has been automatically generated, do not modify! 

/// <reference path="../../global/global.ts" />	
/// <reference path="../../lib/httpUtil.ts" />	
/// <reference path="../enums.ts" />	
/// <reference path="../viewModels.ts" />	

module srv {
	export class NetTangibleBenefitService  {

		static className = 'NetTangibleBenefitService';
		static $inject = ['httpUtil'];
		
		constructor(private httpUtil : util.httpUtil) {
		}
		
		NtbRequiredGeneric = <T>(request: INtbRequiredRequest, successHandler: util.SuccessResponseCallBack<T>, serviceEventOrMessage?: util.ServiceEvent|string, errorHandler?: util.ErrorResponseCallBack, methodPath = 'NetTangibleBenefitService/NtbRequired', config?: ng.IRequestShortcutConfig): ng.IPromise<T> => {
            return this.httpUtil.post<T>(methodPath, { request : request }, serviceEventOrMessage, errorHandler, config, successHandler);
        }

		NtbRequired = (request: INtbRequiredRequest, serviceEventOrMessage?: util.ServiceEvent|string, successHandler?: util.SuccessResponseCallBack<INtbRequiredResponse>, errorHandler?: util.ErrorResponseCallBack, methodPath = 'NetTangibleBenefitService/NtbRequired', config?: ng.IRequestShortcutConfig): ng.IPromise<INtbRequiredResponse> => {
			return this.NtbRequiredGeneric<INtbRequiredResponse>(request, successHandler || this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
		}
		
		NtbBenefitActivationsGeneric = <T>(request: INtbBenefitActivationRequest, successHandler: util.SuccessResponseCallBack<T>, serviceEventOrMessage?: util.ServiceEvent|string, errorHandler?: util.ErrorResponseCallBack, methodPath = 'NetTangibleBenefitService/NtbBenefitActivations', config?: ng.IRequestShortcutConfig): ng.IPromise<T> => {
            return this.httpUtil.post<T>(methodPath, { request : request }, serviceEventOrMessage, errorHandler, config, successHandler);
        }

		NtbBenefitActivations = (request: INtbBenefitActivationRequest, serviceEventOrMessage?: util.ServiceEvent|string, successHandler?: util.SuccessResponseCallBack<INtbBenefitActivationResponse>, errorHandler?: util.ErrorResponseCallBack, methodPath = 'NetTangibleBenefitService/NtbBenefitActivations', config?: ng.IRequestShortcutConfig): ng.IPromise<INtbBenefitActivationResponse> => {
			return this.NtbBenefitActivationsGeneric<INtbBenefitActivationResponse>(request, successHandler || this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
		}
	}
}

moduleRegistration.registerService(moduleNames.services, srv.NetTangibleBenefitService);

