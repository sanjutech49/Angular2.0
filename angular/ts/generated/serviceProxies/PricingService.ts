// This file (PricingService.ts - ver 1.0) has been has been automatically generated, do not modify! 

/// <reference path="../../global/global.ts" />	
/// <reference path="../../lib/httpUtil.ts" />	
/// <reference path="../enums.ts" />	
/// <reference path="../viewModels.ts" />	

module srv {
	export class PricingService  {

		static className = 'PricingService';
		static $inject = ['httpUtil'];
		
		constructor(private httpUtil : util.httpUtil) {
		}
		
		StartNewProspectGeneric = <T>(successHandler: util.SuccessResponseCallBack<T>, serviceEventOrMessage?: util.ServiceEvent|string, errorHandler?: util.ErrorResponseCallBack, methodPath = 'PricingService/StartNewProspect', config?: ng.IRequestShortcutConfig): ng.IPromise<T> => {
            return this.httpUtil.get<T>(methodPath, null, serviceEventOrMessage, errorHandler, config, successHandler);
        }

		StartNewProspect = (serviceEventOrMessage?: util.ServiceEvent|string, successHandler?: util.SuccessResponseCallBack<ILoanViewModel>, errorHandler?: util.ErrorResponseCallBack, methodPath = 'PricingService/StartNewProspect', config?: ng.IRequestShortcutConfig): ng.IPromise<ILoanViewModel> => {
			return this.StartNewProspectGeneric<ILoanViewModel>(successHandler || this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
		}
		
		CreateSmartGFEGeneric = <T>(loanVM: ILoanViewModel, successHandler: util.SuccessResponseCallBack<T>, serviceEventOrMessage?: util.ServiceEvent|string, errorHandler?: util.ErrorResponseCallBack, methodPath = 'PricingService/CreateSmartGFE', config?: ng.IRequestShortcutConfig): ng.IPromise<T> => {
            return this.httpUtil.post<T>(methodPath, { loanVM : loanVM }, serviceEventOrMessage, errorHandler, config, successHandler);
        }

		CreateSmartGFE = (loanVM: ILoanViewModel, serviceEventOrMessage?: util.ServiceEvent|string, successHandler?: util.SuccessResponseCallBack<string>, errorHandler?: util.ErrorResponseCallBack, methodPath = 'PricingService/CreateSmartGFE', config?: ng.IRequestShortcutConfig): ng.IPromise<string> => {
			return this.CreateSmartGFEGeneric<string>(loanVM, successHandler || this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
		}
		
		GetGFEDataGeneric = <T>(loanVM: ILoanViewModel, successHandler: util.SuccessResponseCallBack<T>, serviceEventOrMessage?: util.ServiceEvent|string, errorHandler?: util.ErrorResponseCallBack, methodPath = 'PricingService/GetGFEData', config?: ng.IRequestShortcutConfig): ng.IPromise<T> => {
            return this.httpUtil.post<T>(methodPath, { loanVM : loanVM }, serviceEventOrMessage, errorHandler, config, successHandler);
        }

		GetGFEData = (loanVM: ILoanViewModel, serviceEventOrMessage?: util.ServiceEvent|string, successHandler?: util.SuccessResponseCallBack<IClosingCostViewModel>, errorHandler?: util.ErrorResponseCallBack, methodPath = 'PricingService/GetGFEData', config?: ng.IRequestShortcutConfig): ng.IPromise<IClosingCostViewModel> => {
			return this.GetGFEDataGeneric<IClosingCostViewModel>(loanVM, successHandler || this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
		}
		
		UpdateLoanVmGeneric = <T>(loan: ILoanViewModel, guid: string, legacyProduct: any, successHandler: util.SuccessResponseCallBack<T>, serviceEventOrMessage?: util.ServiceEvent|string, errorHandler?: util.ErrorResponseCallBack, methodPath = 'PricingService/UpdateLoanVm', config?: ng.IRequestShortcutConfig): ng.IPromise<T> => {
            return this.httpUtil.post<T>(methodPath, { loan : loan, guid : guid, legacyProduct : legacyProduct }, serviceEventOrMessage, errorHandler, config, successHandler);
        }

		UpdateLoanVm = (loan: ILoanViewModel, guid: string, legacyProduct: any, serviceEventOrMessage?: util.ServiceEvent|string, successHandler?: util.SuccessResponseCallBack<void>, errorHandler?: util.ErrorResponseCallBack, methodPath = 'PricingService/UpdateLoanVm', config?: ng.IRequestShortcutConfig): ng.IPromise<void> => {
			return this.UpdateLoanVmGeneric<void>(loan, guid, legacyProduct, successHandler || this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
		}
	}
}

moduleRegistration.registerService(moduleNames.services, srv.PricingService);

