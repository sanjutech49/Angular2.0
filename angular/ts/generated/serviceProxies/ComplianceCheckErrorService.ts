// This file (ComplianceCheckErrorService.ts - ver 1.0) has been has been automatically generated, do not modify! 

/// <reference path="../../global/global.ts" />	
/// <reference path="../../lib/httpUtil.ts" />	
/// <reference path="../enums.ts" />	
/// <reference path="../viewModels.ts" />	

module srv {
	export class ComplianceCheckErrorService  {

		static className = 'ComplianceCheckErrorService';
		static $inject = ['httpUtil'];
		
		constructor(private httpUtil : util.httpUtil) {
		}
		
		GetGeneric = <T>(loanId: string, successHandler: util.SuccessResponseCallBack<T>, serviceEventOrMessage?: util.ServiceEvent|string, errorHandler?: util.ErrorResponseCallBack, methodPath = 'ComplianceCheckErrorService/Get', config?: ng.IRequestShortcutConfig): ng.IPromise<T> => {
            return this.httpUtil.get<T>(methodPath, { loanId : loanId }, serviceEventOrMessage, errorHandler, config, successHandler);
        }

		Get = (loanId: string, serviceEventOrMessage?: util.ServiceEvent|string, successHandler?: util.SuccessResponseCallBack<IList<IComplianceCheckErrorViewModel>>, errorHandler?: util.ErrorResponseCallBack, methodPath = 'ComplianceCheckErrorService/Get', config?: ng.IRequestShortcutConfig): ng.IPromise<IList<IComplianceCheckErrorViewModel>> => {
			return this.GetGeneric<IList<IComplianceCheckErrorViewModel>>(loanId, successHandler || this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
		}
	}
}

moduleRegistration.registerService(moduleNames.services, srv.ComplianceCheckErrorService);

