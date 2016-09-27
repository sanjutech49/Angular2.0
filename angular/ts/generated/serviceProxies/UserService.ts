// This file (UserService.ts - ver 1.0) has been has been automatically generated, do not modify! 

/// <reference path="../../global/global.ts" />	
/// <reference path="../../lib/httpUtil.ts" />	
/// <reference path="../enums.ts" />	
/// <reference path="../viewModels.ts" />	

module srv {
	export class UserService  {

		static className = 'UserService';
		static $inject = ['httpUtil'];
		
		constructor(private httpUtil : util.httpUtil) {
		}
		
		EagerLoadGeneric = <T>(userId: number, successHandler: util.SuccessResponseCallBack<T>, serviceEventOrMessage?: util.ServiceEvent|string, errorHandler?: util.ErrorResponseCallBack, methodPath = 'UserService/EagerLoad', config?: ng.IRequestShortcutConfig): ng.IPromise<T> => {
            return this.httpUtil.get<T>(methodPath, { userId : userId }, serviceEventOrMessage, errorHandler, config, successHandler);
        }

		EagerLoad = (userId: number, serviceEventOrMessage?: util.ServiceEvent|string, successHandler?: util.SuccessResponseCallBack<IUserAccountViewModel>, errorHandler?: util.ErrorResponseCallBack, methodPath = 'UserService/EagerLoad', config?: ng.IRequestShortcutConfig): ng.IPromise<IUserAccountViewModel> => {
			return this.EagerLoadGeneric<IUserAccountViewModel>(userId, successHandler || this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
		}
		
		LoadGeneric = <T>(username: string, successHandler: util.SuccessResponseCallBack<T>, serviceEventOrMessage?: util.ServiceEvent|string, errorHandler?: util.ErrorResponseCallBack, methodPath = 'UserService/Load', config?: ng.IRequestShortcutConfig): ng.IPromise<T> => {
            return this.httpUtil.get<T>(methodPath, { username : username }, serviceEventOrMessage, errorHandler, config, successHandler);
        }

		Load = (username: string, serviceEventOrMessage?: util.ServiceEvent|string, successHandler?: util.SuccessResponseCallBack<IManageUserAccountsViewModel>, errorHandler?: util.ErrorResponseCallBack, methodPath = 'UserService/Load', config?: ng.IRequestShortcutConfig): ng.IPromise<IManageUserAccountsViewModel> => {
			return this.LoadGeneric<IManageUserAccountsViewModel>(username, successHandler || this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
		}
		
		LoadUserAccountByIdGeneric = <T>(userId: number, successHandler: util.SuccessResponseCallBack<T>, serviceEventOrMessage?: util.ServiceEvent|string, errorHandler?: util.ErrorResponseCallBack, methodPath = 'UserService/LoadUserAccountById', config?: ng.IRequestShortcutConfig): ng.IPromise<T> => {
            return this.httpUtil.get<T>(methodPath, { userId : userId }, serviceEventOrMessage, errorHandler, config, successHandler);
        }

		LoadUserAccountById = (userId: number, serviceEventOrMessage?: util.ServiceEvent|string, successHandler?: util.SuccessResponseCallBack<IUserAccountViewModel>, errorHandler?: util.ErrorResponseCallBack, methodPath = 'UserService/LoadUserAccountById', config?: ng.IRequestShortcutConfig): ng.IPromise<IUserAccountViewModel> => {
			return this.LoadUserAccountByIdGeneric<IUserAccountViewModel>(userId, successHandler || this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
		}
		
		CreateOrUpdateUserAccountsGeneric = <T>(loanId: string, borrower: IBorrowerViewModel, coBorrower: IBorrowerViewModel, isSpouseOnTheLoan: boolean, loUserId: number, successHandler: util.SuccessResponseCallBack<T>, serviceEventOrMessage?: util.ServiceEvent|string, errorHandler?: util.ErrorResponseCallBack, methodPath = 'UserService/CreateOrUpdateUserAccounts', config?: ng.IRequestShortcutConfig): ng.IPromise<T> => {
            return this.httpUtil.post<T>(methodPath, { loanId : loanId, borrower : borrower, coBorrower : coBorrower, isSpouseOnTheLoan : isSpouseOnTheLoan, loUserId : loUserId }, serviceEventOrMessage, errorHandler, config, successHandler);
        }

		CreateOrUpdateUserAccounts = (loanId: string, borrower: IBorrowerViewModel, coBorrower: IBorrowerViewModel, isSpouseOnTheLoan: boolean, loUserId: number, serviceEventOrMessage?: util.ServiceEvent|string, successHandler?: util.SuccessResponseCallBack<IUserAccountViewModel[]>, errorHandler?: util.ErrorResponseCallBack, methodPath = 'UserService/CreateOrUpdateUserAccounts', config?: ng.IRequestShortcutConfig): ng.IPromise<IUserAccountViewModel[]> => {
			return this.CreateOrUpdateUserAccountsGeneric<IUserAccountViewModel[]>(loanId, borrower, coBorrower, isSpouseOnTheLoan, loUserId, successHandler || this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
		}
		
		LoadLoanOfficersGeneric = <T>(branchOfficerName: string, branchId: string, successHandler: util.SuccessResponseCallBack<T>, serviceEventOrMessage?: util.ServiceEvent|string, errorHandler?: util.ErrorResponseCallBack, methodPath = 'UserService/LoadLoanOfficers', config?: ng.IRequestShortcutConfig): ng.IPromise<T> => {
            return this.httpUtil.get<T>(methodPath, { branchOfficerName : branchOfficerName, branchId : branchId }, serviceEventOrMessage, errorHandler, config, successHandler);
        }

		LoadLoanOfficers = (branchOfficerName: string, branchId: string, serviceEventOrMessage?: util.ServiceEvent|string, successHandler?: util.SuccessResponseCallBack<ILoanOfficersAbridgedViewModel>, errorHandler?: util.ErrorResponseCallBack, methodPath = 'UserService/LoadLoanOfficers', config?: ng.IRequestShortcutConfig): ng.IPromise<ILoanOfficersAbridgedViewModel> => {
			return this.LoadLoanOfficersGeneric<ILoanOfficersAbridgedViewModel>(branchOfficerName, branchId, successHandler || this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
		}
	}
}

moduleRegistration.registerService(moduleNames.services, srv.UserService);


