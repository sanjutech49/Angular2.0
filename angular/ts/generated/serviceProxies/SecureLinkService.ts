// This file (SecureLinkService.ts - ver 1.0) has been has been automatically generated, do not modify! 

/// <reference path="../../global/global.ts" />	
/// <reference path="../../lib/httpUtil.ts" />	
/// <reference path="../enums.ts" />	
/// <reference path="../viewModels.ts" />	

module srv {
	export class SecureLinkService  {

		static className = 'SecureLinkService';
		static $inject = ['httpUtil'];
		
		constructor(private httpUtil : util.httpUtil) {
		}
		
		ObtainLoanApplicationIdGeneric = <T>(secureLinkToken: string, successHandler: util.SuccessResponseCallBack<T>, serviceEventOrMessage?: util.ServiceEvent|string, errorHandler?: util.ErrorResponseCallBack, methodPath = 'SecureLinkService/ObtainLoanApplicationId', config?: ng.IRequestShortcutConfig): ng.IPromise<T> => {
            return this.httpUtil.get<T>(methodPath, { secureLinkToken : secureLinkToken }, serviceEventOrMessage, errorHandler, config, successHandler);
        }

		ObtainLoanApplicationId = (secureLinkToken: string, serviceEventOrMessage?: util.ServiceEvent|string, successHandler?: util.SuccessResponseCallBack<string>, errorHandler?: util.ErrorResponseCallBack, methodPath = 'SecureLinkService/ObtainLoanApplicationId', config?: ng.IRequestShortcutConfig): ng.IPromise<string> => {
			return this.ObtainLoanApplicationIdGeneric<string>(secureLinkToken, successHandler || this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
		}
		
		ValidatePinsGeneric = <T>(secureLinkAuthenticationViewModel: ISecureLinkAuthenticationViewModel, successHandler: util.SuccessResponseCallBack<T>, serviceEventOrMessage?: util.ServiceEvent|string, errorHandler?: util.ErrorResponseCallBack, methodPath = 'SecureLinkService/ValidatePins', config?: ng.IRequestShortcutConfig): ng.IPromise<T> => {
            return this.httpUtil.post<T>(methodPath, { secureLinkAuthenticationViewModel : secureLinkAuthenticationViewModel }, serviceEventOrMessage, errorHandler, config, successHandler);
        }

		ValidatePins = (secureLinkAuthenticationViewModel: ISecureLinkAuthenticationViewModel, serviceEventOrMessage?: util.ServiceEvent|string, successHandler?: util.SuccessResponseCallBack<ISecureLinkAuthenticationViewModel>, errorHandler?: util.ErrorResponseCallBack, methodPath = 'SecureLinkService/ValidatePins', config?: ng.IRequestShortcutConfig): ng.IPromise<ISecureLinkAuthenticationViewModel> => {
			return this.ValidatePinsGeneric<ISecureLinkAuthenticationViewModel>(secureLinkAuthenticationViewModel, successHandler || this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
		}
		
		GetSigningRoomGeneric = <T>(secureLinkAuthenticationViewModel: ISecureLinkAuthenticationViewModel, successHandler: util.SuccessResponseCallBack<T>, serviceEventOrMessage?: util.ServiceEvent|string, errorHandler?: util.ErrorResponseCallBack, methodPath = 'SecureLinkService/GetSigningRoom', config?: ng.IRequestShortcutConfig): ng.IPromise<T> => {
            return this.httpUtil.post<T>(methodPath, { secureLinkAuthenticationViewModel : secureLinkAuthenticationViewModel }, serviceEventOrMessage, errorHandler, config, successHandler);
        }

		GetSigningRoom = (secureLinkAuthenticationViewModel: ISecureLinkAuthenticationViewModel, serviceEventOrMessage?: util.ServiceEvent|string, successHandler?: util.SuccessResponseCallBack<ISecureLinkSigningRoom>, errorHandler?: util.ErrorResponseCallBack, methodPath = 'SecureLinkService/GetSigningRoom', config?: ng.IRequestShortcutConfig): ng.IPromise<ISecureLinkSigningRoom> => {
			return this.GetSigningRoomGeneric<ISecureLinkSigningRoom>(secureLinkAuthenticationViewModel, successHandler || this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
		}
		
		HandleSigningRoomSentGeneric = <T>(secureLinkAuthenticationViewModel: ISecureLinkAuthenticationViewModel, envelopeId: string, successHandler: util.SuccessResponseCallBack<T>, serviceEventOrMessage?: util.ServiceEvent|string, errorHandler?: util.ErrorResponseCallBack, methodPath = 'SecureLinkService/HandleSigningRoomSent', config?: ng.IRequestShortcutConfig): ng.IPromise<T> => {
            return this.httpUtil.post<T>(methodPath, { secureLinkAuthenticationViewModel : secureLinkAuthenticationViewModel, envelopeId : envelopeId }, serviceEventOrMessage, errorHandler, config, successHandler);
        }

		HandleSigningRoomSent = (secureLinkAuthenticationViewModel: ISecureLinkAuthenticationViewModel, envelopeId: string, serviceEventOrMessage?: util.ServiceEvent|string, successHandler?: util.SuccessResponseCallBack<ISecureLinkSigningRoomSent>, errorHandler?: util.ErrorResponseCallBack, methodPath = 'SecureLinkService/HandleSigningRoomSent', config?: ng.IRequestShortcutConfig): ng.IPromise<ISecureLinkSigningRoomSent> => {
			return this.HandleSigningRoomSentGeneric<ISecureLinkSigningRoomSent>(secureLinkAuthenticationViewModel, envelopeId, successHandler || this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
		}
		
		HandleSigningCompleteGeneric = <T>(secureLinkAuthenticationViewModel: ISecureLinkAuthenticationViewModel, envelopeId: string, successHandler: util.SuccessResponseCallBack<T>, serviceEventOrMessage?: util.ServiceEvent|string, errorHandler?: util.ErrorResponseCallBack, methodPath = 'SecureLinkService/HandleSigningComplete', config?: ng.IRequestShortcutConfig): ng.IPromise<T> => {
            return this.httpUtil.post<T>(methodPath, { secureLinkAuthenticationViewModel : secureLinkAuthenticationViewModel, envelopeId : envelopeId }, serviceEventOrMessage, errorHandler, config, successHandler);
        }

		HandleSigningComplete = (secureLinkAuthenticationViewModel: ISecureLinkAuthenticationViewModel, envelopeId: string, serviceEventOrMessage?: util.ServiceEvent|string, successHandler?: util.SuccessResponseCallBack<ISecureLinkSigningRoomCompleted>, errorHandler?: util.ErrorResponseCallBack, methodPath = 'SecureLinkService/HandleSigningComplete', config?: ng.IRequestShortcutConfig): ng.IPromise<ISecureLinkSigningRoomCompleted> => {
			return this.HandleSigningCompleteGeneric<ISecureLinkSigningRoomCompleted>(secureLinkAuthenticationViewModel, envelopeId, successHandler || this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
		}
	}
}

moduleRegistration.registerService(moduleNames.services, srv.SecureLinkService);

