// This file (ApplicationDataService.ts - ver 1.0) has been has been automatically generated, do not modify! 

/// <reference path="../../global/global.ts" />	
/// <reference path="../../lib/httpUtil.ts" />	
/// <reference path="../enums.ts" />	
/// <reference path="../viewModels.ts" />	

module srv {
	export class ApplicationDataService  {

		static className = 'ApplicationDataService';
		static $inject = ['httpUtil'];
		
		constructor(private httpUtil : util.httpUtil) {
		}
		
		LoadLosFoldersGeneric = <T>(successHandler: util.SuccessResponseCallBack<T>, serviceEventOrMessage?: util.ServiceEvent|string, errorHandler?: util.ErrorResponseCallBack, methodPath = 'ApplicationDataService/LoadLosFolders', config?: ng.IRequestShortcutConfig): ng.IPromise<T> => {
            return this.httpUtil.get<T>(methodPath, null, serviceEventOrMessage, errorHandler, config, successHandler);
        }

		LoadLosFolders = (serviceEventOrMessage?: util.ServiceEvent|string, successHandler?: util.SuccessResponseCallBack<IList<ILosFolderViewModel>>, errorHandler?: util.ErrorResponseCallBack, methodPath = 'ApplicationDataService/LoadLosFolders', config?: ng.IRequestShortcutConfig): ng.IPromise<IList<ILosFolderViewModel>> => {
			return this.LoadLosFoldersGeneric<IList<ILosFolderViewModel>>(successHandler || this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
		}
		
		LoadPreApprovalLetterTemplatesGeneric = <T>(successHandler: util.SuccessResponseCallBack<T>, serviceEventOrMessage?: util.ServiceEvent|string, errorHandler?: util.ErrorResponseCallBack, methodPath = 'ApplicationDataService/LoadPreApprovalLetterTemplates', config?: ng.IRequestShortcutConfig): ng.IPromise<T> => {
            return this.httpUtil.get<T>(methodPath, null, serviceEventOrMessage, errorHandler, config, successHandler);
        }

		LoadPreApprovalLetterTemplates = (serviceEventOrMessage?: util.ServiceEvent|string, successHandler?: util.SuccessResponseCallBack<IList<IPreApprovalLetterTemplateViewModel>>, errorHandler?: util.ErrorResponseCallBack, methodPath = 'ApplicationDataService/LoadPreApprovalLetterTemplates', config?: ng.IRequestShortcutConfig): ng.IPromise<IList<IPreApprovalLetterTemplateViewModel>> => {
			return this.LoadPreApprovalLetterTemplatesGeneric<IList<IPreApprovalLetterTemplateViewModel>>(successHandler || this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
		}
		
		LoadConfigurationGeneric = <T>(successHandler: util.SuccessResponseCallBack<T>, serviceEventOrMessage?: util.ServiceEvent|string, errorHandler?: util.ErrorResponseCallBack, methodPath = 'ApplicationDataService/LoadConfiguration', config?: ng.IRequestShortcutConfig): ng.IPromise<T> => {
            return this.httpUtil.get<T>(methodPath, null, serviceEventOrMessage, errorHandler, config, successHandler);
        }

		LoadConfiguration = (serviceEventOrMessage?: util.ServiceEvent|string, successHandler?: util.SuccessResponseCallBack<IConfigurationViewModel>, errorHandler?: util.ErrorResponseCallBack, methodPath = 'ApplicationDataService/LoadConfiguration', config?: ng.IRequestShortcutConfig): ng.IPromise<IConfigurationViewModel> => {
			return this.LoadConfigurationGeneric<IConfigurationViewModel>(successHandler || this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
		}
		
		LoadImpoundScheduleGeneric = <T>(successHandler: util.SuccessResponseCallBack<T>, serviceEventOrMessage?: util.ServiceEvent|string, errorHandler?: util.ErrorResponseCallBack, methodPath = 'ApplicationDataService/LoadImpoundSchedule', config?: ng.IRequestShortcutConfig): ng.IPromise<T> => {
            return this.httpUtil.get<T>(methodPath, null, serviceEventOrMessage, errorHandler, config, successHandler);
        }

		LoadImpoundSchedule = (serviceEventOrMessage?: util.ServiceEvent|string, successHandler?: util.SuccessResponseCallBack<IList<IImpoundScheduleViewModel>>, errorHandler?: util.ErrorResponseCallBack, methodPath = 'ApplicationDataService/LoadImpoundSchedule', config?: ng.IRequestShortcutConfig): ng.IPromise<IList<IImpoundScheduleViewModel>> => {
			return this.LoadImpoundScheduleGeneric<IList<IImpoundScheduleViewModel>>(successHandler || this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
		}
		
		LoadLicenseGeneric = <T>(successHandler: util.SuccessResponseCallBack<T>, serviceEventOrMessage?: util.ServiceEvent|string, errorHandler?: util.ErrorResponseCallBack, methodPath = 'ApplicationDataService/LoadLicense', config?: ng.IRequestShortcutConfig): ng.IPromise<T> => {
            return this.httpUtil.get<T>(methodPath, null, serviceEventOrMessage, errorHandler, config, successHandler);
        }

		LoadLicense = (serviceEventOrMessage?: util.ServiceEvent|string, successHandler?: util.SuccessResponseCallBack<IList<ILicenseViewModel>>, errorHandler?: util.ErrorResponseCallBack, methodPath = 'ApplicationDataService/LoadLicense', config?: ng.IRequestShortcutConfig): ng.IPromise<IList<ILicenseViewModel>> => {
			return this.LoadLicenseGeneric<IList<ILicenseViewModel>>(successHandler || this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
		}
		
		LoadDocumentCategoriesGeneric = <T>(successHandler: util.SuccessResponseCallBack<T>, serviceEventOrMessage?: util.ServiceEvent|string, errorHandler?: util.ErrorResponseCallBack, methodPath = 'ApplicationDataService/LoadDocumentCategories', config?: ng.IRequestShortcutConfig): ng.IPromise<T> => {
            return this.httpUtil.get<T>(methodPath, null, serviceEventOrMessage, errorHandler, config, successHandler);
        }

		LoadDocumentCategories = (serviceEventOrMessage?: util.ServiceEvent|string, successHandler?: util.SuccessResponseCallBack<IList<IDocumentCategoryViewModel>>, errorHandler?: util.ErrorResponseCallBack, methodPath = 'ApplicationDataService/LoadDocumentCategories', config?: ng.IRequestShortcutConfig): ng.IPromise<IList<IDocumentCategoryViewModel>> => {
			return this.LoadDocumentCategoriesGeneric<IList<IDocumentCategoryViewModel>>(successHandler || this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
		}
		
		LoadDocumentClassesGeneric = <T>(successHandler: util.SuccessResponseCallBack<T>, serviceEventOrMessage?: util.ServiceEvent|string, errorHandler?: util.ErrorResponseCallBack, methodPath = 'ApplicationDataService/LoadDocumentClasses', config?: ng.IRequestShortcutConfig): ng.IPromise<T> => {
            return this.httpUtil.get<T>(methodPath, null, serviceEventOrMessage, errorHandler, config, successHandler);
        }

		LoadDocumentClasses = (serviceEventOrMessage?: util.ServiceEvent|string, successHandler?: util.SuccessResponseCallBack<IList<IDocumentClassViewModel>>, errorHandler?: util.ErrorResponseCallBack, methodPath = 'ApplicationDataService/LoadDocumentClasses', config?: ng.IRequestShortcutConfig): ng.IPromise<IList<IDocumentClassViewModel>> => {
			return this.LoadDocumentClassesGeneric<IList<IDocumentClassViewModel>>(successHandler || this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
		}
		
		LoadDocumentMappingsGeneric = <T>(successHandler: util.SuccessResponseCallBack<T>, serviceEventOrMessage?: util.ServiceEvent|string, errorHandler?: util.ErrorResponseCallBack, methodPath = 'ApplicationDataService/LoadDocumentMappings', config?: ng.IRequestShortcutConfig): ng.IPromise<T> => {
            return this.httpUtil.get<T>(methodPath, null, serviceEventOrMessage, errorHandler, config, successHandler);
        }

		LoadDocumentMappings = (serviceEventOrMessage?: util.ServiceEvent|string, successHandler?: util.SuccessResponseCallBack<IList<IDocumentMappingViewModel>>, errorHandler?: util.ErrorResponseCallBack, methodPath = 'ApplicationDataService/LoadDocumentMappings', config?: ng.IRequestShortcutConfig): ng.IPromise<IList<IDocumentMappingViewModel>> => {
			return this.LoadDocumentMappingsGeneric<IList<IDocumentMappingViewModel>>(successHandler || this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
		}
		
		LoadIntegrationsSettingGeneric = <T>(successHandler: util.SuccessResponseCallBack<T>, serviceEventOrMessage?: util.ServiceEvent|string, errorHandler?: util.ErrorResponseCallBack, methodPath = 'ApplicationDataService/LoadIntegrationsSetting', config?: ng.IRequestShortcutConfig): ng.IPromise<T> => {
            return this.httpUtil.get<T>(methodPath, null, serviceEventOrMessage, errorHandler, config, successHandler);
        }

		LoadIntegrationsSetting = (serviceEventOrMessage?: util.ServiceEvent|string, successHandler?: util.SuccessResponseCallBack<IIntegrationsSettingViewModel>, errorHandler?: util.ErrorResponseCallBack, methodPath = 'ApplicationDataService/LoadIntegrationsSetting', config?: ng.IRequestShortcutConfig): ng.IPromise<IIntegrationsSettingViewModel> => {
			return this.LoadIntegrationsSettingGeneric<IIntegrationsSettingViewModel>(successHandler || this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
		}
		
		LoadNtbBenefitConfigurationsGeneric = <T>(successHandler: util.SuccessResponseCallBack<T>, serviceEventOrMessage?: util.ServiceEvent|string, errorHandler?: util.ErrorResponseCallBack, methodPath = 'ApplicationDataService/LoadNtbBenefitConfigurations', config?: ng.IRequestShortcutConfig): ng.IPromise<T> => {
            return this.httpUtil.get<T>(methodPath, null, serviceEventOrMessage, errorHandler, config, successHandler);
        }

		LoadNtbBenefitConfigurations = (serviceEventOrMessage?: util.ServiceEvent|string, successHandler?: util.SuccessResponseCallBack<IList<INtbBenefitConfigurationViewModel>>, errorHandler?: util.ErrorResponseCallBack, methodPath = 'ApplicationDataService/LoadNtbBenefitConfigurations', config?: ng.IRequestShortcutConfig): ng.IPromise<IList<INtbBenefitConfigurationViewModel>> => {
			return this.LoadNtbBenefitConfigurationsGeneric<IList<INtbBenefitConfigurationViewModel>>(successHandler || this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
		}
	}
}

moduleRegistration.registerService(moduleNames.services, srv.ApplicationDataService);

