// This file (CompanyProfileService.ts - ver 1.0) has been has been automatically generated, do not modify! 

/// <reference path="../../global/global.ts" />	
/// <reference path="../../lib/httpUtil.ts" />	
/// <reference path="../enums.ts" />	
/// <reference path="../viewModels.ts" />	

module srv {
	export class CompanyProfileService  {

		static className = 'CompanyProfileService';
		static $inject = ['httpUtil'];
		
		constructor(private httpUtil : util.httpUtil) {
		}
		
		EagerLoadCompanyProfileGeneric = <T>(successHandler: util.SuccessResponseCallBack<T>, serviceEventOrMessage?: util.ServiceEvent|string, errorHandler?: util.ErrorResponseCallBack, methodPath = 'CompanyProfileService/EagerLoadCompanyProfile', config?: ng.IRequestShortcutConfig): ng.IPromise<T> => {
            return this.httpUtil.get<T>(methodPath, null, serviceEventOrMessage, errorHandler, config, successHandler);
        }

		EagerLoadCompanyProfile = (serviceEventOrMessage?: util.ServiceEvent|string, successHandler?: util.SuccessResponseCallBack<ICompanyProfileViewModel>, errorHandler?: util.ErrorResponseCallBack, methodPath = 'CompanyProfileService/EagerLoadCompanyProfile', config?: ng.IRequestShortcutConfig): ng.IPromise<ICompanyProfileViewModel> => {
			return this.EagerLoadCompanyProfileGeneric<ICompanyProfileViewModel>(successHandler || this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
		}
		
		LoadBranchesGeneric = <T>(stateName: string, successHandler: util.SuccessResponseCallBack<T>, serviceEventOrMessage?: util.ServiceEvent|string, errorHandler?: util.ErrorResponseCallBack, methodPath = 'CompanyProfileService/LoadBranches', config?: ng.IRequestShortcutConfig): ng.IPromise<T> => {
            return this.httpUtil.get<T>(methodPath, { stateName : stateName }, serviceEventOrMessage, errorHandler, config, successHandler);
        }

		LoadBranches = (stateName: string, serviceEventOrMessage?: util.ServiceEvent|string, successHandler?: util.SuccessResponseCallBack<IBranchesAbridgedViewModel>, errorHandler?: util.ErrorResponseCallBack, methodPath = 'CompanyProfileService/LoadBranches', config?: ng.IRequestShortcutConfig): ng.IPromise<IBranchesAbridgedViewModel> => {
			return this.LoadBranchesGeneric<IBranchesAbridgedViewModel>(stateName, successHandler || this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
		}
	}
}

moduleRegistration.registerService(moduleNames.services, srv.CompanyProfileService);

