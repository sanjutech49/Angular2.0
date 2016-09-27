// This file (ComplianceResultService.ts - ver 1.0) has been has been automatically generated, do not modify! 

/// <reference path="../../global/global.ts" />	
/// <reference path="../../lib/httpUtil.ts" />	
/// <reference path="../enums.ts" />	
/// <reference path="../viewModels.ts" />	

module srv {
	export class ComplianceResultService  {

		static className = 'ComplianceResultService';
		static $inject = ['httpUtil'];
		
		constructor(private httpUtil : util.httpUtil) {
		}
		
		GetGeneric = <T>(loanId: string, userAccountId: number, successHandler: util.SuccessResponseCallBack<T>, serviceEventOrMessage?: util.ServiceEvent|string, errorHandler?: util.ErrorResponseCallBack, methodPath = 'ComplianceResultService/Get', config?: ng.IRequestShortcutConfig): ng.IPromise<T> => {
            return this.httpUtil.get<T>(methodPath, { loanId : loanId, userAccountId : userAccountId }, serviceEventOrMessage, errorHandler, config, successHandler);
        }

		Get = (loanId: string, userAccountId: number, serviceEventOrMessage?: util.ServiceEvent|string, successHandler?: util.SuccessResponseCallBack<IList<IComplianceResultViewModel>>, errorHandler?: util.ErrorResponseCallBack, methodPath = 'ComplianceResultService/Get', config?: ng.IRequestShortcutConfig): ng.IPromise<IList<IComplianceResultViewModel>> => {
			return this.GetGeneric<IList<IComplianceResultViewModel>>(loanId, userAccountId, successHandler || this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
		}
		
		SubmitGeneric = <T>(request: IComplianceEaseRequestViewModel, successHandler: util.SuccessResponseCallBack<T>, serviceEventOrMessage?: util.ServiceEvent|string, errorHandler?: util.ErrorResponseCallBack, methodPath = 'ComplianceResultService/Submit', config?: ng.IRequestShortcutConfig): ng.IPromise<T> => {
            return this.httpUtil.post<T>(methodPath, { request : request }, serviceEventOrMessage, errorHandler, config, successHandler);
        }

		Submit = (request: IComplianceEaseRequestViewModel, serviceEventOrMessage?: util.ServiceEvent|string, successHandler?: util.SuccessResponseCallBack<boolean>, errorHandler?: util.ErrorResponseCallBack, methodPath = 'ComplianceResultService/Submit', config?: ng.IRequestShortcutConfig): ng.IPromise<boolean> => {
			return this.SubmitGeneric<boolean>(request, successHandler || this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
		}
	}
}

moduleRegistration.registerService(moduleNames.services, srv.ComplianceResultService);

