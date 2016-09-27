// This file (SecureLinkEmailAlternativeService.ts - ver 1.0) has been has been automatically generated, do not modify! 

/// <reference path="../../global/global.ts" />	
/// <reference path="../../lib/httpUtil.ts" />	
/// <reference path="../enums.ts" />	
/// <reference path="../viewModels.ts" />	

module srv {
	export class SecureLinkEmailAlternativeService  {

		static className = 'SecureLinkEmailAlternativeService';
		static $inject = ['httpUtil'];
		
		constructor(private httpUtil : util.httpUtil) {
		}
		
		GetSecureLinkUrlTokenGeneric = <T>(secureLinkEmailVM: ISecureLinkEmailViewModel, successHandler: util.SuccessResponseCallBack<T>, serviceEventOrMessage?: util.ServiceEvent|string, errorHandler?: util.ErrorResponseCallBack, methodPath = 'SecureLinkEmailAlternativeService/GetSecureLinkUrlToken', config?: ng.IRequestShortcutConfig): ng.IPromise<T> => {
            return this.httpUtil.post<T>(methodPath, { secureLinkEmailVM : secureLinkEmailVM }, serviceEventOrMessage, errorHandler, config, successHandler);
        }

		GetSecureLinkUrlToken = (secureLinkEmailVM: ISecureLinkEmailViewModel, serviceEventOrMessage?: util.ServiceEvent|string, successHandler?: util.SuccessResponseCallBack<ISecureLinkUrlResponse>, errorHandler?: util.ErrorResponseCallBack, methodPath = 'SecureLinkEmailAlternativeService/GetSecureLinkUrlToken', config?: ng.IRequestShortcutConfig): ng.IPromise<ISecureLinkUrlResponse> => {
			return this.GetSecureLinkUrlTokenGeneric<ISecureLinkUrlResponse>(secureLinkEmailVM, successHandler || this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
		}
		
		SendSecureLinkEmailGeneric = <T>(secureLinkEmailVM: ISecureLinkEmailViewModel, successHandler: util.SuccessResponseCallBack<T>, serviceEventOrMessage?: util.ServiceEvent|string, errorHandler?: util.ErrorResponseCallBack, methodPath = 'SecureLinkEmailAlternativeService/SendSecureLinkEmail', config?: ng.IRequestShortcutConfig): ng.IPromise<T> => {
            return this.httpUtil.post<T>(methodPath, { secureLinkEmailVM : secureLinkEmailVM }, serviceEventOrMessage, errorHandler, config, successHandler);
        }

		SendSecureLinkEmail = (secureLinkEmailVM: ISecureLinkEmailViewModel, serviceEventOrMessage?: util.ServiceEvent|string, successHandler?: util.SuccessResponseCallBack<boolean>, errorHandler?: util.ErrorResponseCallBack, methodPath = 'SecureLinkEmailAlternativeService/SendSecureLinkEmail', config?: ng.IRequestShortcutConfig): ng.IPromise<boolean> => {
			return this.SendSecureLinkEmailGeneric<boolean>(secureLinkEmailVM, successHandler || this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
		}
		
		GetSecureLinkEmailTemplatesGeneric = <T>(secureLinkEmailVM: ISecureLinkEmailViewModel, successHandler: util.SuccessResponseCallBack<T>, serviceEventOrMessage?: util.ServiceEvent|string, errorHandler?: util.ErrorResponseCallBack, methodPath = 'SecureLinkEmailAlternativeService/GetSecureLinkEmailTemplates', config?: ng.IRequestShortcutConfig): ng.IPromise<T> => {
            return this.httpUtil.post<T>(methodPath, { secureLinkEmailVM : secureLinkEmailVM }, serviceEventOrMessage, errorHandler, config, successHandler);
        }

		GetSecureLinkEmailTemplates = (secureLinkEmailVM: ISecureLinkEmailViewModel, serviceEventOrMessage?: util.ServiceEvent|string, successHandler?: util.SuccessResponseCallBack<IList<ISecureLinkEmailTemplate>>, errorHandler?: util.ErrorResponseCallBack, methodPath = 'SecureLinkEmailAlternativeService/GetSecureLinkEmailTemplates', config?: ng.IRequestShortcutConfig): ng.IPromise<IList<ISecureLinkEmailTemplate>> => {
			return this.GetSecureLinkEmailTemplatesGeneric<IList<ISecureLinkEmailTemplate>>(secureLinkEmailVM, successHandler || this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
		}
	}
}

moduleRegistration.registerService(moduleNames.services, srv.SecureLinkEmailAlternativeService);

