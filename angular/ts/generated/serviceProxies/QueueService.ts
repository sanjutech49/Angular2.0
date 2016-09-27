// This file (QueueService.ts - ver 1.0) has been has been automatically generated, do not modify! 

/// <reference path="../../global/global.ts" />	
/// <reference path="../../lib/httpUtil.ts" />	
/// <reference path="../enums.ts" />	
/// <reference path="../viewModels.ts" />	

module srv {
	export class QueueService  {

		static className = 'QueueService';
		static $inject = ['httpUtil'];
		
		constructor(private httpUtil : util.httpUtil) {
		}
		
		LoadGeneric = <T>(queue: number, userAccountId: number, loanNumberFilter: string, borrowerNameFilter: string, successHandler: util.SuccessResponseCallBack<T>, serviceEventOrMessage?: util.ServiceEvent|string, errorHandler?: util.ErrorResponseCallBack, methodPath = 'QueueService/Load', config?: ng.IRequestShortcutConfig): ng.IPromise<T> => {
            return this.httpUtil.get<T>(methodPath, { queue : queue, userAccountId : userAccountId, loanNumberFilter : loanNumberFilter, borrowerNameFilter : borrowerNameFilter }, serviceEventOrMessage, errorHandler, config, successHandler);
        }

		Load = (queue: number, userAccountId: number, loanNumberFilter: string, borrowerNameFilter: string, serviceEventOrMessage?: util.ServiceEvent|string, successHandler?: util.SuccessResponseCallBack<IList<IQueueItemViewModel>>, errorHandler?: util.ErrorResponseCallBack, methodPath = 'QueueService/Load', config?: ng.IRequestShortcutConfig): ng.IPromise<IList<IQueueItemViewModel>> => {
			return this.LoadGeneric<IList<IQueueItemViewModel>>(queue, userAccountId, loanNumberFilter, borrowerNameFilter, successHandler || this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
		}
	}
}

moduleRegistration.registerService(moduleNames.services, srv.QueueService);

