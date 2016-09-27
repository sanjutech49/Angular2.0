// This file (GlobalContactsService.ts - ver 1.0) has been has been automatically generated, do not modify! 

/// <reference path="../../global/global.ts" />	
/// <reference path="../../lib/httpUtil.ts" />	
/// <reference path="../enums.ts" />	
/// <reference path="../viewModels.ts" />	

module srv {
	export class GlobalContactsService  {

		static className = 'GlobalContactsService';
		static $inject = ['httpUtil'];
		
		constructor(private httpUtil : util.httpUtil) {
		}
		
		AddCompanyContactGeneric = <T>(opEnvelope: IGlobalContactsAddCompanyContactOpEnvelope, successHandler: util.SuccessResponseCallBack<T>, serviceEventOrMessage?: util.ServiceEvent|string, errorHandler?: util.ErrorResponseCallBack, methodPath = 'GlobalContactsService/AddCompanyContact', config?: ng.IRequestShortcutConfig): ng.IPromise<T> => {
            return this.httpUtil.post<T>(methodPath, { opEnvelope : opEnvelope }, serviceEventOrMessage, errorHandler, config, successHandler);
        }

		AddCompanyContact = (opEnvelope: IGlobalContactsAddCompanyContactOpEnvelope, serviceEventOrMessage?: util.ServiceEvent|string, successHandler?: util.SuccessResponseCallBack<IGlobalContactsAddCompanyContactOpEnvelope>, errorHandler?: util.ErrorResponseCallBack, methodPath = 'GlobalContactsService/AddCompanyContact', config?: ng.IRequestShortcutConfig): ng.IPromise<IGlobalContactsAddCompanyContactOpEnvelope> => {
			return this.AddCompanyContactGeneric<IGlobalContactsAddCompanyContactOpEnvelope>(opEnvelope, successHandler || this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
		}
		
		GetEmptyCompanyGeneric = <T>(successHandler: util.SuccessResponseCallBack<T>, serviceEventOrMessage?: util.ServiceEvent|string, errorHandler?: util.ErrorResponseCallBack, methodPath = 'GlobalContactsService/GetEmptyCompany', config?: ng.IRequestShortcutConfig): ng.IPromise<T> => {
            return this.httpUtil.get<T>(methodPath, null, serviceEventOrMessage, errorHandler, config, successHandler);
        }

		GetEmptyCompany = (serviceEventOrMessage?: util.ServiceEvent|string, successHandler?: util.SuccessResponseCallBack<IBasicCompany<string>>, errorHandler?: util.ErrorResponseCallBack, methodPath = 'GlobalContactsService/GetEmptyCompany', config?: ng.IRequestShortcutConfig): ng.IPromise<IBasicCompany<string>> => {
			return this.GetEmptyCompanyGeneric<IBasicCompany<string>>(successHandler || this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
		}
		
		GetEmptyCompanyContactGeneric = <T>(successHandler: util.SuccessResponseCallBack<T>, serviceEventOrMessage?: util.ServiceEvent|string, errorHandler?: util.ErrorResponseCallBack, methodPath = 'GlobalContactsService/GetEmptyCompanyContact', config?: ng.IRequestShortcutConfig): ng.IPromise<T> => {
            return this.httpUtil.get<T>(methodPath, null, serviceEventOrMessage, errorHandler, config, successHandler);
        }

		GetEmptyCompanyContact = (serviceEventOrMessage?: util.ServiceEvent|string, successHandler?: util.SuccessResponseCallBack<IBasicCompanyContact<string>>, errorHandler?: util.ErrorResponseCallBack, methodPath = 'GlobalContactsService/GetEmptyCompanyContact', config?: ng.IRequestShortcutConfig): ng.IPromise<IBasicCompanyContact<string>> => {
			return this.GetEmptyCompanyContactGeneric<IBasicCompanyContact<string>>(successHandler || this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
		}
		
		GetGlobalContactsByLegalEntityTypeGeneric = <T>(legalEntityTypeMask: LegalEntityTypeMask, successHandler: util.SuccessResponseCallBack<T>, serviceEventOrMessage?: util.ServiceEvent|string, errorHandler?: util.ErrorResponseCallBack, methodPath = 'GlobalContactsService/GetGlobalContactsByLegalEntityType', config?: ng.IRequestShortcutConfig): ng.IPromise<T> => {
            return this.httpUtil.get<T>(methodPath, { legalEntityTypeMask : legalEntityTypeMask }, serviceEventOrMessage, errorHandler, config, successHandler);
        }

		GetGlobalContactsByLegalEntityType = (legalEntityTypeMask: LegalEntityTypeMask, serviceEventOrMessage?: util.ServiceEvent|string, successHandler?: util.SuccessResponseCallBack<IGlobalContactsViewModel>, errorHandler?: util.ErrorResponseCallBack, methodPath = 'GlobalContactsService/GetGlobalContactsByLegalEntityType', config?: ng.IRequestShortcutConfig): ng.IPromise<IGlobalContactsViewModel> => {
			return this.GetGlobalContactsByLegalEntityTypeGeneric<IGlobalContactsViewModel>(legalEntityTypeMask, successHandler || this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
		}
		
		GetGlobalContactsSubListGeneric = <T>(opEnvelope: IGlobalContactsGetContactsSubListOpEnvelope, successHandler: util.SuccessResponseCallBack<T>, serviceEventOrMessage?: util.ServiceEvent|string, errorHandler?: util.ErrorResponseCallBack, methodPath = 'GlobalContactsService/GetGlobalContactsSubList', config?: ng.IRequestShortcutConfig): ng.IPromise<T> => {
            return this.httpUtil.post<T>(methodPath, { opEnvelope : opEnvelope }, serviceEventOrMessage, errorHandler, config, successHandler);
        }

		GetGlobalContactsSubList = (opEnvelope: IGlobalContactsGetContactsSubListOpEnvelope, serviceEventOrMessage?: util.ServiceEvent|string, successHandler?: util.SuccessResponseCallBack<IGlobalContactsGetContactsSubListOpEnvelope>, errorHandler?: util.ErrorResponseCallBack, methodPath = 'GlobalContactsService/GetGlobalContactsSubList', config?: ng.IRequestShortcutConfig): ng.IPromise<IGlobalContactsGetContactsSubListOpEnvelope> => {
			return this.GetGlobalContactsSubListGeneric<IGlobalContactsGetContactsSubListOpEnvelope>(opEnvelope, successHandler || this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
		}
		
		SaveGeneric = <T>(globalContactsVm: IGlobalContactsViewModel, successHandler: util.SuccessResponseCallBack<T>, serviceEventOrMessage?: util.ServiceEvent|string, errorHandler?: util.ErrorResponseCallBack, methodPath = 'GlobalContactsService/Save', config?: ng.IRequestShortcutConfig): ng.IPromise<T> => {
            return this.httpUtil.post<T>(methodPath, { globalContactsVm : globalContactsVm }, serviceEventOrMessage, errorHandler, config, successHandler);
        }

		Save = (globalContactsVm: IGlobalContactsViewModel, serviceEventOrMessage?: util.ServiceEvent|string, successHandler?: util.SuccessResponseCallBack<IGlobalContactsViewModel>, errorHandler?: util.ErrorResponseCallBack, methodPath = 'GlobalContactsService/Save', config?: ng.IRequestShortcutConfig): ng.IPromise<IGlobalContactsViewModel> => {
			return this.SaveGeneric<IGlobalContactsViewModel>(globalContactsVm, successHandler || this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
		}
	}
}

moduleRegistration.registerService(moduleNames.services, srv.GlobalContactsService);

