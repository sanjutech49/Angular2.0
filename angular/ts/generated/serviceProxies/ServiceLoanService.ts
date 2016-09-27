// ServiceLoanService.ts (ver 1.0) has been has been generated automatically, do not modify! 

/// <reference path="../../global/global.ts" />	
/// <reference path="../../lib/httpUtil.ts" />	
/// <reference path="../enums.ts" />	
/// <reference path="../viewModels.ts" />	

module srv {
	export class ServiceLoanService  {

		static className = 'ServiceLoanService';
		static $inject = ['httpUtil'];
		
		constructor(private httpUtil : util.httpUtil) {
		}
		
		public EagerLoad = (loanId: string, userAccountId: number, serviceEvent?: util.ServiceEvent, errorHandler? : util.ServiceResponseCallBack<srv.ILoan>, config? : ng.IRequestShortcutConfig, successHandler? : util.ServiceResponseCallBack<srv.ILoan>) : ng.IPromise<srv.ILoan> => {
			return this.httpUtil.get("ServiceLoanService/EagerLoad", { loanId : loanId, userAccountId : userAccountId }, serviceEvent, errorHandler, config, successHandler);
		}
	}
}

moduleRegistration.registerService(moduleNames.services, srv.ServiceLoanService);

