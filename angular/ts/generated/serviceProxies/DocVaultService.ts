// This file (DocVaultService.ts - ver 1.0) has been has been automatically generated, do not modify! 

/// <reference path="../../global/global.ts" />	
/// <reference path="../../lib/httpUtil.ts" />	
/// <reference path="../enums.ts" />	
/// <reference path="../viewModels.ts" />	

module srv {
	export class DocVaultService  {

		static className = 'DocVaultService';
		static $inject = ['httpUtil'];
		
		constructor(private httpUtil : util.httpUtil) {
		}
		
		FilterByLoanNumberGeneric = <T>(loanNumber: string, counter: number, currentUserId: number, successHandler: util.SuccessResponseCallBack<T>, serviceEventOrMessage?: util.ServiceEvent|string, errorHandler?: util.ErrorResponseCallBack, methodPath = 'DocVaultService/FilterByLoanNumber', config?: ng.IRequestShortcutConfig): ng.IPromise<T> => {
            return this.httpUtil.get<T>(methodPath, { loanNumber : loanNumber, counter : counter, currentUserId : currentUserId }, serviceEventOrMessage, errorHandler, config, successHandler);
        }

		FilterByLoanNumber = (loanNumber: string, counter: number, currentUserId: number, serviceEventOrMessage?: util.ServiceEvent|string, successHandler?: util.SuccessResponseCallBack<IFilterByLoanNumberResultsViewModel>, errorHandler?: util.ErrorResponseCallBack, methodPath = 'DocVaultService/FilterByLoanNumber', config?: ng.IRequestShortcutConfig): ng.IPromise<IFilterByLoanNumberResultsViewModel> => {
			return this.FilterByLoanNumberGeneric<IFilterByLoanNumberResultsViewModel>(loanNumber, counter, currentUserId, successHandler || this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
		}
		
		GetDocVaultDocumentsGeneric = <T>(loanNumber: string, currentUserId: number, successHandler: util.SuccessResponseCallBack<T>, serviceEventOrMessage?: util.ServiceEvent|string, errorHandler?: util.ErrorResponseCallBack, methodPath = 'DocVaultService/GetDocVaultDocuments', config?: ng.IRequestShortcutConfig): ng.IPromise<T> => {
            return this.httpUtil.get<T>(methodPath, { loanNumber : loanNumber, currentUserId : currentUserId }, serviceEventOrMessage, errorHandler, config, successHandler);
        }

		GetDocVaultDocuments = (loanNumber: string, currentUserId: number, serviceEventOrMessage?: util.ServiceEvent|string, successHandler?: util.SuccessResponseCallBack<IDocVaultViewModel>, errorHandler?: util.ErrorResponseCallBack, methodPath = 'DocVaultService/GetDocVaultDocuments', config?: ng.IRequestShortcutConfig): ng.IPromise<IDocVaultViewModel> => {
			return this.GetDocVaultDocumentsGeneric<IDocVaultViewModel>(loanNumber, currentUserId, successHandler || this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
		}
	}
}

moduleRegistration.registerService(moduleNames.services, srv.DocVaultService);

