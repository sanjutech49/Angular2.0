// This file (ActivityService.ts - ver 1.0) has been has been automatically generated, do not modify! 

/// <reference path="../../global/global.ts" />	
/// <reference path="../../lib/httpUtil.ts" />	
/// <reference path="../enums.ts" />	
/// <reference path="../viewModels.ts" />	

module srv {
	export class ActivityService  {

		static className = 'ActivityService';
		static $inject = ['httpUtil'];
		
		constructor(private httpUtil : util.httpUtil) {
		}
		
		UpdateCompleteLoanApplicationStepStatusesGeneric = <T>(loanId: string, stepName: string, successHandler: util.SuccessResponseCallBack<T>, serviceEventOrMessage?: util.ServiceEvent|string, errorHandler?: util.ErrorResponseCallBack, methodPath = 'ActivityService/UpdateCompleteLoanApplicationStepStatuses', config?: ng.IRequestShortcutConfig): ng.IPromise<T> => {
            return this.httpUtil.get<T>(methodPath, { loanId : loanId, stepName : stepName }, serviceEventOrMessage, errorHandler, config, successHandler);
        }

		UpdateCompleteLoanApplicationStepStatuses = (loanId: string, stepName: string, serviceEventOrMessage?: util.ServiceEvent|string, successHandler?: util.SuccessResponseCallBack<boolean>, errorHandler?: util.ErrorResponseCallBack, methodPath = 'ActivityService/UpdateCompleteLoanApplicationStepStatuses', config?: ng.IRequestShortcutConfig): ng.IPromise<boolean> => {
			return this.UpdateCompleteLoanApplicationStepStatusesGeneric<boolean>(loanId, stepName, successHandler || this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
		}
		
		UpdatePreApprovalStepStatusesGeneric = <T>(loanId: string, stepName: string, successHandler: util.SuccessResponseCallBack<T>, serviceEventOrMessage?: util.ServiceEvent|string, errorHandler?: util.ErrorResponseCallBack, methodPath = 'ActivityService/UpdatePreApprovalStepStatuses', config?: ng.IRequestShortcutConfig): ng.IPromise<T> => {
            return this.httpUtil.get<T>(methodPath, { loanId : loanId, stepName : stepName }, serviceEventOrMessage, errorHandler, config, successHandler);
        }

		UpdatePreApprovalStepStatuses = (loanId: string, stepName: string, serviceEventOrMessage?: util.ServiceEvent|string, successHandler?: util.SuccessResponseCallBack<boolean>, errorHandler?: util.ErrorResponseCallBack, methodPath = 'ActivityService/UpdatePreApprovalStepStatuses', config?: ng.IRequestShortcutConfig): ng.IPromise<boolean> => {
			return this.UpdatePreApprovalStepStatusesGeneric<boolean>(loanId, stepName, successHandler || this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
		}
	}
}

moduleRegistration.registerService(moduleNames.services, srv.ActivityService);

