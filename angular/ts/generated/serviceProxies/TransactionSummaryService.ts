// This file (TransactionSummaryService.ts - ver 1.0) has been has been automatically generated, do not modify! 

/// <reference path="../../global/global.ts" />	
/// <reference path="../../lib/httpUtil.ts" />	
/// <reference path="../enums.ts" />	
/// <reference path="../viewModels.ts" />	

module srv {
	export class TransactionSummaryService  {

		static className = 'TransactionSummaryService';
		static $inject = ['httpUtil'];
		
		constructor(private httpUtil : util.httpUtil) {
		}
		
		EagerLoadGeneric = <T>(loanId: string, userAccountId: number, successHandler: util.SuccessResponseCallBack<T>, serviceEventOrMessage?: util.ServiceEvent|string, errorHandler?: util.ErrorResponseCallBack, methodPath = 'TransactionSummaryService/EagerLoad', config?: ng.IRequestShortcutConfig): ng.IPromise<T> => {
            return this.httpUtil.get<T>(methodPath, { loanId : loanId, userAccountId : userAccountId }, serviceEventOrMessage, errorHandler, config, successHandler);
        }

		EagerLoad = (loanId: string, userAccountId: number, serviceEventOrMessage?: util.ServiceEvent|string, successHandler?: util.SuccessResponseCallBack<ITransactionSummaryViewModel>, errorHandler?: util.ErrorResponseCallBack, methodPath = 'TransactionSummaryService/EagerLoad', config?: ng.IRequestShortcutConfig): ng.IPromise<ITransactionSummaryViewModel> => {
			return this.EagerLoadGeneric<ITransactionSummaryViewModel>(loanId, userAccountId, successHandler || this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
		}
		
		GetDropdownDictionaryGeneric = <T>(opEnvelope: IGetDropdownDictionary, successHandler: util.SuccessResponseCallBack<T>, serviceEventOrMessage?: util.ServiceEvent|string, errorHandler?: util.ErrorResponseCallBack, methodPath = 'TransactionSummaryService/GetDropdownDictionary', config?: ng.IRequestShortcutConfig): ng.IPromise<T> => {
            return this.httpUtil.post<T>(methodPath, { opEnvelope : opEnvelope }, serviceEventOrMessage, errorHandler, config, successHandler);
        }

		GetDropdownDictionary = (opEnvelope: IGetDropdownDictionary, serviceEventOrMessage?: util.ServiceEvent|string, successHandler?: util.SuccessResponseCallBack<IGetDropdownDictionary>, errorHandler?: util.ErrorResponseCallBack, methodPath = 'TransactionSummaryService/GetDropdownDictionary', config?: ng.IRequestShortcutConfig): ng.IPromise<IGetDropdownDictionary> => {
			return this.GetDropdownDictionaryGeneric<IGetDropdownDictionary>(opEnvelope, successHandler || this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
		}
		
		InitEmptyCreditOrDebitGeneric = <T>(opEnvelope: IInitEmptyCreditOrDebit, successHandler: util.SuccessResponseCallBack<T>, serviceEventOrMessage?: util.ServiceEvent|string, errorHandler?: util.ErrorResponseCallBack, methodPath = 'TransactionSummaryService/InitEmptyCreditOrDebit', config?: ng.IRequestShortcutConfig): ng.IPromise<T> => {
            return this.httpUtil.post<T>(methodPath, { opEnvelope : opEnvelope }, serviceEventOrMessage, errorHandler, config, successHandler);
        }

		InitEmptyCreditOrDebit = (opEnvelope: IInitEmptyCreditOrDebit, serviceEventOrMessage?: util.ServiceEvent|string, successHandler?: util.SuccessResponseCallBack<IInitEmptyCreditOrDebit>, errorHandler?: util.ErrorResponseCallBack, methodPath = 'TransactionSummaryService/InitEmptyCreditOrDebit', config?: ng.IRequestShortcutConfig): ng.IPromise<IInitEmptyCreditOrDebit> => {
			return this.InitEmptyCreditOrDebitGeneric<IInitEmptyCreditOrDebit>(opEnvelope, successHandler || this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
		}
		
		RemoveCreditOrDebitGeneric = <T>(opEnvelope: IRemoveCreditOrDebit, successHandler: util.SuccessResponseCallBack<T>, serviceEventOrMessage?: util.ServiceEvent|string, errorHandler?: util.ErrorResponseCallBack, methodPath = 'TransactionSummaryService/RemoveCreditOrDebit', config?: ng.IRequestShortcutConfig): ng.IPromise<T> => {
            return this.httpUtil.post<T>(methodPath, { opEnvelope : opEnvelope }, serviceEventOrMessage, errorHandler, config, successHandler);
        }

		RemoveCreditOrDebit = (opEnvelope: IRemoveCreditOrDebit, serviceEventOrMessage?: util.ServiceEvent|string, successHandler?: util.SuccessResponseCallBack<IRemoveCreditOrDebit>, errorHandler?: util.ErrorResponseCallBack, methodPath = 'TransactionSummaryService/RemoveCreditOrDebit', config?: ng.IRequestShortcutConfig): ng.IPromise<IRemoveCreditOrDebit> => {
			return this.RemoveCreditOrDebitGeneric<IRemoveCreditOrDebit>(opEnvelope, successHandler || this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
		}
		
		SaveGeneric = <T>(loanVm: ILoanViewModel, userAccountId: number, successHandler: util.SuccessResponseCallBack<T>, serviceEventOrMessage?: util.ServiceEvent|string, errorHandler?: util.ErrorResponseCallBack, methodPath = 'TransactionSummaryService/Save', config?: ng.IRequestShortcutConfig): ng.IPromise<T> => {
            return this.httpUtil.post<T>(methodPath, { loanVm : loanVm, userAccountId : userAccountId }, serviceEventOrMessage, errorHandler, config, successHandler);
        }

		Save = (loanVm: ILoanViewModel, userAccountId: number, serviceEventOrMessage?: util.ServiceEvent|string, successHandler?: util.SuccessResponseCallBack<ITransactionSummaryViewModel>, errorHandler?: util.ErrorResponseCallBack, methodPath = 'TransactionSummaryService/Save', config?: ng.IRequestShortcutConfig): ng.IPromise<ITransactionSummaryViewModel> => {
			return this.SaveGeneric<ITransactionSummaryViewModel>(loanVm, userAccountId, successHandler || this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
		}
		
		UnlinkDoubleEntryGeneric = <T>(opEnvelope: IUnlinkDoubleEntry, successHandler: util.SuccessResponseCallBack<T>, serviceEventOrMessage?: util.ServiceEvent|string, errorHandler?: util.ErrorResponseCallBack, methodPath = 'TransactionSummaryService/UnlinkDoubleEntry', config?: ng.IRequestShortcutConfig): ng.IPromise<T> => {
            return this.httpUtil.post<T>(methodPath, { opEnvelope : opEnvelope }, serviceEventOrMessage, errorHandler, config, successHandler);
        }

		UnlinkDoubleEntry = (opEnvelope: IUnlinkDoubleEntry, serviceEventOrMessage?: util.ServiceEvent|string, successHandler?: util.SuccessResponseCallBack<IUnlinkDoubleEntry>, errorHandler?: util.ErrorResponseCallBack, methodPath = 'TransactionSummaryService/UnlinkDoubleEntry', config?: ng.IRequestShortcutConfig): ng.IPromise<IUnlinkDoubleEntry> => {
			return this.UnlinkDoubleEntryGeneric<IUnlinkDoubleEntry>(opEnvelope, successHandler || this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
		}
		
		UnRemoveCreditOrDebitGeneric = <T>(opEnvelope: IRemoveCreditOrDebit, successHandler: util.SuccessResponseCallBack<T>, serviceEventOrMessage?: util.ServiceEvent|string, errorHandler?: util.ErrorResponseCallBack, methodPath = 'TransactionSummaryService/UnRemoveCreditOrDebit', config?: ng.IRequestShortcutConfig): ng.IPromise<T> => {
            return this.httpUtil.post<T>(methodPath, { opEnvelope : opEnvelope }, serviceEventOrMessage, errorHandler, config, successHandler);
        }

		UnRemoveCreditOrDebit = (opEnvelope: IRemoveCreditOrDebit, serviceEventOrMessage?: util.ServiceEvent|string, successHandler?: util.SuccessResponseCallBack<IRemoveCreditOrDebit>, errorHandler?: util.ErrorResponseCallBack, methodPath = 'TransactionSummaryService/UnRemoveCreditOrDebit', config?: ng.IRequestShortcutConfig): ng.IPromise<IRemoveCreditOrDebit> => {
			return this.UnRemoveCreditOrDebitGeneric<IRemoveCreditOrDebit>(opEnvelope, successHandler || this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
		}
		
		UpdateCreditOrDebitGeneric = <T>(opEnvelope: IUpdateCreditOrDebit, successHandler: util.SuccessResponseCallBack<T>, serviceEventOrMessage?: util.ServiceEvent|string, errorHandler?: util.ErrorResponseCallBack, methodPath = 'TransactionSummaryService/UpdateCreditOrDebit', config?: ng.IRequestShortcutConfig): ng.IPromise<T> => {
            return this.httpUtil.post<T>(methodPath, { opEnvelope : opEnvelope }, serviceEventOrMessage, errorHandler, config, successHandler);
        }

		UpdateCreditOrDebit = (opEnvelope: IUpdateCreditOrDebit, serviceEventOrMessage?: util.ServiceEvent|string, successHandler?: util.SuccessResponseCallBack<IUpdateCreditOrDebit>, errorHandler?: util.ErrorResponseCallBack, methodPath = 'TransactionSummaryService/UpdateCreditOrDebit', config?: ng.IRequestShortcutConfig): ng.IPromise<IUpdateCreditOrDebit> => {
			return this.UpdateCreditOrDebitGeneric<IUpdateCreditOrDebit>(opEnvelope, successHandler || this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
		}
	}
}

moduleRegistration.registerService(moduleNames.services, srv.TransactionSummaryService);

