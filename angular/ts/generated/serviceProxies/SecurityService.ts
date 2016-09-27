// This file (SecurityService.ts - ver 1.0) has been has been automatically generated, do not modify! 

/// <reference path="../../global/global.ts" />	
/// <reference path="../../lib/httpUtil.ts" />	
/// <reference path="../enums.ts" />	
/// <reference path="../viewModels.ts" />	

module srv {
	export class SecurityService  {

		static className = 'SecurityService';
		static $inject = ['httpUtil'];
		
		constructor(private httpUtil : util.httpUtil) {
		}
		
		AuthenticateUserGeneric = <T>(userName: string, password: string, successHandler: util.SuccessResponseCallBack<T>, serviceEventOrMessage?: util.ServiceEvent|string, errorHandler?: util.ErrorResponseCallBack, methodPath = 'SecurityService/AuthenticateUser', config?: ng.IRequestShortcutConfig): ng.IPromise<T> => {
            return this.httpUtil.get<T>(methodPath, { userName : userName, password : password }, serviceEventOrMessage, errorHandler, config, successHandler);
        }

		AuthenticateUser = (userName: string, password: string, serviceEventOrMessage?: util.ServiceEvent|string, successHandler?: util.SuccessResponseCallBack<boolean>, errorHandler?: util.ErrorResponseCallBack, methodPath = 'SecurityService/AuthenticateUser', config?: ng.IRequestShortcutConfig): ng.IPromise<boolean> => {
			return this.AuthenticateUserGeneric<boolean>(userName, password, successHandler || this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
		}
		
		GetLoanContextGeneric = <T>(token: string, successHandler: util.SuccessResponseCallBack<T>, serviceEventOrMessage?: util.ServiceEvent|string, errorHandler?: util.ErrorResponseCallBack, methodPath = 'SecurityService/GetLoanContext', config?: ng.IRequestShortcutConfig): ng.IPromise<T> => {
            return this.httpUtil.get<T>(methodPath, { token : token }, serviceEventOrMessage, errorHandler, config, successHandler);
        }

		GetLoanContext = (token: string, serviceEventOrMessage?: util.ServiceEvent|string, successHandler?: util.SuccessResponseCallBack<ISecureLinkAuthenticationViewModel>, errorHandler?: util.ErrorResponseCallBack, methodPath = 'SecurityService/GetLoanContext', config?: ng.IRequestShortcutConfig): ng.IPromise<ISecureLinkAuthenticationViewModel> => {
			return this.GetLoanContextGeneric<ISecureLinkAuthenticationViewModel>(token, successHandler || this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
		}
	}
}

moduleRegistration.registerService(moduleNames.services, srv.SecurityService);

