// This file (LiabilityService.ts - ver 1.0) has been has been automatically generated, do not modify! 

/// <reference path="../../global/global.ts" />	
/// <reference path="../../lib/httpUtil.ts" />	
/// <reference path="../enums.ts" />	
/// <reference path="../viewModels.ts" />	

module srv {
	export class LiabilityService  {

		static className = 'LiabilityService';
		static $inject = ['httpUtil'];
		
		constructor(private httpUtil : util.httpUtil) {
		}
		
		ApplyCommentLiabilityGeneric = <T>(debtViewModel: ILiabilityViewModel, userAccountId: number, successHandler: util.SuccessResponseCallBack<T>, serviceEventOrMessage?: util.ServiceEvent|string, errorHandler?: util.ErrorResponseCallBack, methodPath = 'LiabilityService/ApplyCommentLiability', config?: ng.IRequestShortcutConfig): ng.IPromise<T> => {
            return this.httpUtil.post<T>(methodPath, { debtViewModel : debtViewModel, userAccountId : userAccountId }, serviceEventOrMessage, errorHandler, config, successHandler);
        }

		ApplyCommentLiability = (debtViewModel: ILiabilityViewModel, userAccountId: number, serviceEventOrMessage?: util.ServiceEvent|string, successHandler?: util.SuccessResponseCallBack<ILiabilityViewModel>, errorHandler?: util.ErrorResponseCallBack, methodPath = 'LiabilityService/ApplyCommentLiability', config?: ng.IRequestShortcutConfig): ng.IPromise<ILiabilityViewModel> => {
			return this.ApplyCommentLiabilityGeneric<ILiabilityViewModel>(debtViewModel, userAccountId, successHandler || this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
		}
		
		ApplyCommentCollectionGeneric = <T>(debtViewModel: IDebtViewModel, userAccountId: number, successHandler: util.SuccessResponseCallBack<T>, serviceEventOrMessage?: util.ServiceEvent|string, errorHandler?: util.ErrorResponseCallBack, methodPath = 'LiabilityService/ApplyCommentCollection', config?: ng.IRequestShortcutConfig): ng.IPromise<T> => {
            return this.httpUtil.post<T>(methodPath, { debtViewModel : debtViewModel, userAccountId : userAccountId }, serviceEventOrMessage, errorHandler, config, successHandler);
        }

		ApplyCommentCollection = (debtViewModel: IDebtViewModel, userAccountId: number, serviceEventOrMessage?: util.ServiceEvent|string, successHandler?: util.SuccessResponseCallBack<IDebtViewModel>, errorHandler?: util.ErrorResponseCallBack, methodPath = 'LiabilityService/ApplyCommentCollection', config?: ng.IRequestShortcutConfig): ng.IPromise<IDebtViewModel> => {
			return this.ApplyCommentCollectionGeneric<IDebtViewModel>(debtViewModel, userAccountId, successHandler || this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
		}
		
		ApplyCommentPublicRecordGeneric = <T>(publicRecordViewModel: IPublicRecordViewModel, userAccountId: number, successHandler: util.SuccessResponseCallBack<T>, serviceEventOrMessage?: util.ServiceEvent|string, errorHandler?: util.ErrorResponseCallBack, methodPath = 'LiabilityService/ApplyCommentPublicRecord', config?: ng.IRequestShortcutConfig): ng.IPromise<T> => {
            return this.httpUtil.post<T>(methodPath, { publicRecordViewModel : publicRecordViewModel, userAccountId : userAccountId }, serviceEventOrMessage, errorHandler, config, successHandler);
        }

		ApplyCommentPublicRecord = (publicRecordViewModel: IPublicRecordViewModel, userAccountId: number, serviceEventOrMessage?: util.ServiceEvent|string, successHandler?: util.SuccessResponseCallBack<IPublicRecordViewModel>, errorHandler?: util.ErrorResponseCallBack, methodPath = 'LiabilityService/ApplyCommentPublicRecord', config?: ng.IRequestShortcutConfig): ng.IPromise<IPublicRecordViewModel> => {
			return this.ApplyCommentPublicRecordGeneric<IPublicRecordViewModel>(publicRecordViewModel, userAccountId, successHandler || this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
		}
		
		CreateLiabilityRecordsGeneric = <T>(debtAccountOwnershipType: string, borrowerId: string, secondaryBorrowerId: string, successHandler: util.SuccessResponseCallBack<T>, serviceEventOrMessage?: util.ServiceEvent|string, errorHandler?: util.ErrorResponseCallBack, methodPath = 'LiabilityService/CreateLiabilityRecords', config?: ng.IRequestShortcutConfig): ng.IPromise<T> => {
            return this.httpUtil.get<T>(methodPath, { debtAccountOwnershipType : debtAccountOwnershipType, borrowerId : borrowerId, secondaryBorrowerId : secondaryBorrowerId }, serviceEventOrMessage, errorHandler, config, successHandler);
        }

		CreateLiabilityRecords = (debtAccountOwnershipType: string, borrowerId: string, secondaryBorrowerId: string, serviceEventOrMessage?: util.ServiceEvent|string, successHandler?: util.SuccessResponseCallBack<IList<IDebtViewModel>>, errorHandler?: util.ErrorResponseCallBack, methodPath = 'LiabilityService/CreateLiabilityRecords', config?: ng.IRequestShortcutConfig): ng.IPromise<IList<IDebtViewModel>> => {
			return this.CreateLiabilityRecordsGeneric<IList<IDebtViewModel>>(debtAccountOwnershipType, borrowerId, secondaryBorrowerId, successHandler || this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
		}
		
		ConvertLiabilityOwnershipGeneric = <T>(debtVm: IDebtViewModel, successHandler: util.SuccessResponseCallBack<T>, serviceEventOrMessage?: util.ServiceEvent|string, errorHandler?: util.ErrorResponseCallBack, methodPath = 'LiabilityService/ConvertLiabilityOwnership', config?: ng.IRequestShortcutConfig): ng.IPromise<T> => {
            return this.httpUtil.post<T>(methodPath, { debtVm : debtVm }, serviceEventOrMessage, errorHandler, config, successHandler);
        }

		ConvertLiabilityOwnership = (debtVm: IDebtViewModel, serviceEventOrMessage?: util.ServiceEvent|string, successHandler?: util.SuccessResponseCallBack<IList<IDebtViewModel>>, errorHandler?: util.ErrorResponseCallBack, methodPath = 'LiabilityService/ConvertLiabilityOwnership', config?: ng.IRequestShortcutConfig): ng.IPromise<IList<IDebtViewModel>> => {
			return this.ConvertLiabilityOwnershipGeneric<IList<IDebtViewModel>>(debtVm, successHandler || this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
		}
		
		ApplyCommentReoGeneric = <T>(pledgedAssetVm: ILiabilityViewModel, successHandler: util.SuccessResponseCallBack<T>, serviceEventOrMessage?: util.ServiceEvent|string, errorHandler?: util.ErrorResponseCallBack, methodPath = 'LiabilityService/ApplyCommentReo', config?: ng.IRequestShortcutConfig): ng.IPromise<T> => {
            return this.httpUtil.post<T>(methodPath, { pledgedAssetVm : pledgedAssetVm }, serviceEventOrMessage, errorHandler, config, successHandler);
        }

		ApplyCommentReo = (pledgedAssetVm: ILiabilityViewModel, serviceEventOrMessage?: util.ServiceEvent|string, successHandler?: util.SuccessResponseCallBack<ILiabilityViewModel>, errorHandler?: util.ErrorResponseCallBack, methodPath = 'LiabilityService/ApplyCommentReo', config?: ng.IRequestShortcutConfig): ng.IPromise<ILiabilityViewModel> => {
			return this.ApplyCommentReoGeneric<ILiabilityViewModel>(pledgedAssetVm, successHandler || this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
		}
		
		RefreshPledgedAssetsGeneric = <T>(realEstateVm: IRealEstateViewModel, successHandler: util.SuccessResponseCallBack<T>, serviceEventOrMessage?: util.ServiceEvent|string, errorHandler?: util.ErrorResponseCallBack, methodPath = 'LiabilityService/RefreshPledgedAssets', config?: ng.IRequestShortcutConfig): ng.IPromise<T> => {
            return this.httpUtil.post<T>(methodPath, { realEstateVm : realEstateVm }, serviceEventOrMessage, errorHandler, config, successHandler);
        }

		RefreshPledgedAssets = (realEstateVm: IRealEstateViewModel, serviceEventOrMessage?: util.ServiceEvent|string, successHandler?: util.SuccessResponseCallBack<IRealEstateViewModel>, errorHandler?: util.ErrorResponseCallBack, methodPath = 'LiabilityService/RefreshPledgedAssets', config?: ng.IRequestShortcutConfig): ng.IPromise<IRealEstateViewModel> => {
			return this.RefreshPledgedAssetsGeneric<IRealEstateViewModel>(realEstateVm, successHandler || this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
		}
	}
}

moduleRegistration.registerService(moduleNames.services, srv.LiabilityService);

