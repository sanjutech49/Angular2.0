// This file (LeadManagerService.ts - ver 1.0) has been has been automatically generated, do not modify! 

/// <reference path="../../global/global.ts" />	
/// <reference path="../../lib/httpUtil.ts" />	
/// <reference path="../enums.ts" />	
/// <reference path="../viewModels.ts" />	

module srv {
	export class LeadManagerService  {

		static className = 'LeadManagerService';
		static $inject = ['httpUtil'];
		
		constructor(private httpUtil : util.httpUtil) {
		}
		
		UpsertGeneric = <T>(model: ILeadModel, successHandler: util.SuccessResponseCallBack<T>, serviceEventOrMessage?: util.ServiceEvent|string, errorHandler?: util.ErrorResponseCallBack, methodPath = 'LeadManagerService/Upsert', config?: ng.IRequestShortcutConfig): ng.IPromise<T> => {
            return this.httpUtil.post<T>(methodPath, { model : model }, serviceEventOrMessage, errorHandler, config, successHandler);
        }

		Upsert = (model: ILeadModel, serviceEventOrMessage?: util.ServiceEvent|string, successHandler?: util.SuccessResponseCallBack<ILoanViewModel>, errorHandler?: util.ErrorResponseCallBack, methodPath = 'LeadManagerService/Upsert', config?: ng.IRequestShortcutConfig): ng.IPromise<ILoanViewModel> => {
			return this.UpsertGeneric<ILoanViewModel>(model, successHandler || this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
		}
	}
}

moduleRegistration.registerService(moduleNames.services, srv.LeadManagerService);

