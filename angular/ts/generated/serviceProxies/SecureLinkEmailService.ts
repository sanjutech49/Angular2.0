// This file (SecureLinkEmailService.ts - ver 1.0) has been has been automatically generated, do not modify! 

/// <reference path="../../global/global.ts" />	
/// <reference path="../../lib/httpUtil.ts" />	
/// <reference path="../enums.ts" />	
/// <reference path="../viewModels.ts" />	

module srv {
	export class SecureLinkEmailService  {

		static className = 'SecureLinkEmailService';
		static $inject = ['httpUtil'];
		
		constructor(private httpUtil : util.httpUtil) {
		}
		
		GetSecureLinkEmailTemplatesGeneric = <T>(loanId: string, loanApplicationId: string, successHandler: util.SuccessResponseCallBack<T>, serviceEventOrMessage?: util.ServiceEvent|string, errorHandler?: util.ErrorResponseCallBack, methodPath = 'SecureLinkEmailService/GetSecureLinkEmailTemplates', config?: ng.IRequestShortcutConfig): ng.IPromise<T> => {
            return this.httpUtil.get<T>(methodPath, { loanId : loanId, loanApplicationId : loanApplicationId }, serviceEventOrMessage, errorHandler, config, successHandler);
        }

		GetSecureLinkEmailTemplates = (loanId: string, loanApplicationId: string, serviceEventOrMessage?: util.ServiceEvent|string, successHandler?: util.SuccessResponseCallBack<IList<ISecureLinkEmailTemplate>>, errorHandler?: util.ErrorResponseCallBack, methodPath = 'SecureLinkEmailService/GetSecureLinkEmailTemplates', config?: ng.IRequestShortcutConfig): ng.IPromise<IList<ISecureLinkEmailTemplate>> => {
			return this.GetSecureLinkEmailTemplatesGeneric<IList<ISecureLinkEmailTemplate>>(loanId, loanApplicationId, successHandler || this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
		}
	}
}

moduleRegistration.registerService(moduleNames.services, srv.SecureLinkEmailService);

