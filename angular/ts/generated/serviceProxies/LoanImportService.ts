// This file (LoanImportService.ts - ver 1.0) has been has been automatically generated, do not modify! 

/// <reference path="../../global/global.ts" />	
/// <reference path="../../lib/httpUtil.ts" />	
/// <reference path="../enums.ts" />	
/// <reference path="../viewModels.ts" />	

module srv {
	export class LoanImportService  {

		static className = 'LoanImportService';
		static $inject = ['httpUtil'];
		
		constructor(private httpUtil : util.httpUtil) {
		}
		
		ImportFNMFileGeneric = <T>(companyProfileId: string, userID: number, fileContent: string, successHandler: util.SuccessResponseCallBack<T>, serviceEventOrMessage?: util.ServiceEvent|string, errorHandler?: util.ErrorResponseCallBack, methodPath = 'LoanImportService/ImportFNMFile', config?: ng.IRequestShortcutConfig): ng.IPromise<T> => {
            return this.httpUtil.get<T>(methodPath, { companyProfileId : companyProfileId, userID : userID, fileContent : fileContent }, serviceEventOrMessage, errorHandler, config, successHandler);
        }

		ImportFNMFile = (companyProfileId: string, userID: number, fileContent: string, serviceEventOrMessage?: util.ServiceEvent|string, successHandler?: util.SuccessResponseCallBack<string>, errorHandler?: util.ErrorResponseCallBack, methodPath = 'LoanImportService/ImportFNMFile', config?: ng.IRequestShortcutConfig): ng.IPromise<string> => {
			return this.ImportFNMFileGeneric<string>(companyProfileId, userID, fileContent, successHandler || this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
		}
	}
}

moduleRegistration.registerService(moduleNames.services, srv.LoanImportService);

