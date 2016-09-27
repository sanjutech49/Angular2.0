// This file (GeneralSettingService.ts - ver 1.0) has been has been automatically generated, do not modify! 

/// <reference path="../../global/global.ts" />	
/// <reference path="../../lib/httpUtil.ts" />	
/// <reference path="../enums.ts" />	
/// <reference path="../viewModels.ts" />	

module srv {
	export class GeneralSettingService  {

		static className = 'GeneralSettingService';
		static $inject = ['httpUtil'];
		
		constructor(private httpUtil : util.httpUtil) {
		}
		
		EagerLoadGeneralSettingsDataGeneric = <T>(successHandler: util.SuccessResponseCallBack<T>, serviceEventOrMessage?: util.ServiceEvent|string, errorHandler?: util.ErrorResponseCallBack, methodPath = 'GeneralSettingService/EagerLoadGeneralSettingsData', config?: ng.IRequestShortcutConfig): ng.IPromise<T> => {
            return this.httpUtil.get<T>(methodPath, null, serviceEventOrMessage, errorHandler, config, successHandler);
        }

		EagerLoadGeneralSettingsData = (serviceEventOrMessage?: util.ServiceEvent|string, successHandler?: util.SuccessResponseCallBack<IList<IGeneralSettingViewModel>>, errorHandler?: util.ErrorResponseCallBack, methodPath = 'GeneralSettingService/EagerLoadGeneralSettingsData', config?: ng.IRequestShortcutConfig): ng.IPromise<IList<IGeneralSettingViewModel>> => {
			return this.EagerLoadGeneralSettingsDataGeneric<IList<IGeneralSettingViewModel>>(successHandler || this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
		}
	}
}

moduleRegistration.registerService(moduleNames.services, srv.GeneralSettingService);

