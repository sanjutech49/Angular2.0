// This file (LockingPricingService.ts - ver 1.0) has been has been automatically generated, do not modify! 

/// <reference path="../../global/global.ts" />	
/// <reference path="../../lib/httpUtil.ts" />	
/// <reference path="../enums.ts" />	
/// <reference path="../viewModels.ts" />	

module srv {
	export class LockingPricingService  {

		static className = 'LockingPricingService';
		static $inject = ['httpUtil'];
		
		constructor(private httpUtil : util.httpUtil) {
		}
		
		LoadLookupsGeneric = <T>(userAccountId: number, successHandler: util.SuccessResponseCallBack<T>, serviceEventOrMessage?: util.ServiceEvent|string, errorHandler?: util.ErrorResponseCallBack, methodPath = 'LockingPricingService/LoadLookups', config?: ng.IRequestShortcutConfig): ng.IPromise<T> => {
            return this.httpUtil.get<T>(methodPath, { userAccountId : userAccountId }, serviceEventOrMessage, errorHandler, config, successHandler);
        }

		LoadLookups = (userAccountId: number, serviceEventOrMessage?: util.ServiceEvent|string, successHandler?: util.SuccessResponseCallBack<ILockingPricingLookupViewModel>, errorHandler?: util.ErrorResponseCallBack, methodPath = 'LockingPricingService/LoadLookups', config?: ng.IRequestShortcutConfig): ng.IPromise<ILockingPricingLookupViewModel> => {
			return this.LoadLookupsGeneric<ILockingPricingLookupViewModel>(userAccountId, successHandler || this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
		}
		
		LoadLockExpireDateGeneric = <T>(successHandler: util.SuccessResponseCallBack<T>, serviceEventOrMessage?: util.ServiceEvent|string, errorHandler?: util.ErrorResponseCallBack, methodPath = 'LockingPricingService/LoadLockExpireDate', config?: ng.IRequestShortcutConfig): ng.IPromise<T> => {
            return this.httpUtil.get<T>(methodPath, null, serviceEventOrMessage, errorHandler, config, successHandler);
        }

		LoadLockExpireDate = (serviceEventOrMessage?: util.ServiceEvent|string, successHandler?: util.SuccessResponseCallBack<ILockingInformationViewModel>, errorHandler?: util.ErrorResponseCallBack, methodPath = 'LockingPricingService/LoadLockExpireDate', config?: ng.IRequestShortcutConfig): ng.IPromise<ILockingInformationViewModel> => {
			return this.LoadLockExpireDateGeneric<ILockingInformationViewModel>(successHandler || this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
		}
	}
}

moduleRegistration.registerService(moduleNames.services, srv.LockingPricingService);

