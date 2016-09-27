// This file (CostService.ts - ver 1.0) has been has been automatically generated, do not modify! 

/// <reference path="../../global/global.ts" />	
/// <reference path="../../lib/httpUtil.ts" />	
/// <reference path="../enums.ts" />	
/// <reference path="../viewModels.ts" />	

module srv {
	export class CostService  {

		static className = 'CostService';
		static $inject = ['httpUtil'];
		
		constructor(private httpUtil : util.httpUtil) {
		}
		
		EagerLoadGeneric = <T>(loanId: string, userAccountId: number, successHandler: util.SuccessResponseCallBack<T>, serviceEventOrMessage?: util.ServiceEvent|string, errorHandler?: util.ErrorResponseCallBack, methodPath = 'CostService/EagerLoad', config?: ng.IRequestShortcutConfig): ng.IPromise<T> => {
            return this.httpUtil.get<T>(methodPath, { loanId : loanId, userAccountId : userAccountId }, serviceEventOrMessage, errorHandler, config, successHandler);
        }

		EagerLoad = (loanId: string, userAccountId: number, serviceEventOrMessage?: util.ServiceEvent|string, successHandler?: util.SuccessResponseCallBack<IClosingCostViewModel>, errorHandler?: util.ErrorResponseCallBack, methodPath = 'CostService/EagerLoad', config?: ng.IRequestShortcutConfig): ng.IPromise<IClosingCostViewModel> => {
			return this.EagerLoadGeneric<IClosingCostViewModel>(loanId, userAccountId, successHandler || this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
		}
		
		SaveGeneric = <T>(loanVm: ILoanViewModel, userAccountId: number, successHandler: util.SuccessResponseCallBack<T>, serviceEventOrMessage?: util.ServiceEvent|string, errorHandler?: util.ErrorResponseCallBack, methodPath = 'CostService/Save', config?: ng.IRequestShortcutConfig): ng.IPromise<T> => {
            return this.httpUtil.post<T>(methodPath, { loanVm : loanVm, userAccountId : userAccountId }, serviceEventOrMessage, errorHandler, config, successHandler);
        }

		Save = (loanVm: ILoanViewModel, userAccountId: number, serviceEventOrMessage?: util.ServiceEvent|string, successHandler?: util.SuccessResponseCallBack<IClosingCostViewModel>, errorHandler?: util.ErrorResponseCallBack, methodPath = 'CostService/Save', config?: ng.IRequestShortcutConfig): ng.IPromise<IClosingCostViewModel> => {
			return this.SaveGeneric<IClosingCostViewModel>(loanVm, userAccountId, successHandler || this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
		}
		
		GetActiveDisclosureDetailsGeneric = <T>(loanId: string, successHandler: util.SuccessResponseCallBack<T>, serviceEventOrMessage?: util.ServiceEvent|string, errorHandler?: util.ErrorResponseCallBack, methodPath = 'CostService/GetActiveDisclosureDetails', config?: ng.IRequestShortcutConfig): ng.IPromise<T> => {
            return this.httpUtil.get<T>(methodPath, { loanId : loanId }, serviceEventOrMessage, errorHandler, config, successHandler);
        }

		GetActiveDisclosureDetails = (loanId: string, serviceEventOrMessage?: util.ServiceEvent|string, successHandler?: util.SuccessResponseCallBack<IDisclosuresDetailsViewModel>, errorHandler?: util.ErrorResponseCallBack, methodPath = 'CostService/GetActiveDisclosureDetails', config?: ng.IRequestShortcutConfig): ng.IPromise<IDisclosuresDetailsViewModel> => {
			return this.GetActiveDisclosureDetailsGeneric<IDisclosuresDetailsViewModel>(loanId, successHandler || this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
		}
	}
}

moduleRegistration.registerService(moduleNames.services, srv.CostService);

