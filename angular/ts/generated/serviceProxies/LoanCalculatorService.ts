// This file (LoanCalculatorService.ts - ver 1.0) has been has been automatically generated, do not modify! 

/// <reference path="../../global/global.ts" />	
/// <reference path="../../lib/httpUtil.ts" />	
/// <reference path="../enums.ts" />	
/// <reference path="../viewModels.ts" />	

module srv {
	export class LoanCalculatorService  {

		static className = 'LoanCalculatorService';
		static $inject = ['httpUtil'];
		
		constructor(private httpUtil : util.httpUtil) {
		}
		
		UpdateCalculatedValuesGeneric = <T>(request: ICalculatorRequest, successHandler: util.SuccessResponseCallBack<T>, serviceEventOrMessage?: util.ServiceEvent|string, errorHandler?: util.ErrorResponseCallBack, methodPath = 'LoanCalculatorService/UpdateCalculatedValues', config?: ng.IRequestShortcutConfig): ng.IPromise<T> => {
            return this.httpUtil.post<T>(methodPath, { request : request }, serviceEventOrMessage, errorHandler, config, successHandler);
        }

		UpdateCalculatedValues = (request: ICalculatorRequest, serviceEventOrMessage?: util.ServiceEvent|string, successHandler?: util.SuccessResponseCallBack<ICalculatorResponse>, errorHandler?: util.ErrorResponseCallBack, methodPath = 'LoanCalculatorService/UpdateCalculatedValues', config?: ng.IRequestShortcutConfig): ng.IPromise<ICalculatorResponse> => {
			return this.UpdateCalculatedValuesGeneric<ICalculatorResponse>(request, successHandler || this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
		}
		
		CalculateProposedImpoundDataGeneric = <T>(costVMs: IList<ICostViewModel>, propertyExpenses: IList<IPropertyExpenseViewModel>, labilitiesViewModels: IList<ILiabilityViewModel>, subordinateFinancing: ISubordinateFinancingDetailsViewModel, loanPurposeType: LoanPurposeTypeEnum, successHandler: util.SuccessResponseCallBack<T>, serviceEventOrMessage?: util.ServiceEvent|string, errorHandler?: util.ErrorResponseCallBack, methodPath = 'LoanCalculatorService/CalculateProposedImpoundData', config?: ng.IRequestShortcutConfig): ng.IPromise<T> => {
            return this.httpUtil.post<T>(methodPath, { costVMs : costVMs, propertyExpenses : propertyExpenses, labilitiesViewModels : labilitiesViewModels, subordinateFinancing : subordinateFinancing, loanPurposeType : loanPurposeType }, serviceEventOrMessage, errorHandler, config, successHandler);
        }

		CalculateProposedImpoundData = (costVMs: IList<ICostViewModel>, propertyExpenses: IList<IPropertyExpenseViewModel>, labilitiesViewModels: IList<ILiabilityViewModel>, subordinateFinancing: ISubordinateFinancingDetailsViewModel, loanPurposeType: LoanPurposeTypeEnum, serviceEventOrMessage?: util.ServiceEvent|string, successHandler?: util.SuccessResponseCallBack<IImpoundDataCalculatedViewModel>, errorHandler?: util.ErrorResponseCallBack, methodPath = 'LoanCalculatorService/CalculateProposedImpoundData', config?: ng.IRequestShortcutConfig): ng.IPromise<IImpoundDataCalculatedViewModel> => {
			return this.CalculateProposedImpoundDataGeneric<IImpoundDataCalculatedViewModel>(costVMs, propertyExpenses, labilitiesViewModels, subordinateFinancing, loanPurposeType, successHandler || this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
		}
		
		CalculateCashOutResultGeneric = <T>(secondMortgageInfo: SecondMortgageInfoTypeEnum, withdrawnFromHelocInLast12Months: boolean, payingOffSecondMortgage: boolean, secondMortgageAmortizationType: ExistingSecondMortgageTypeEnum, newLoanAmount: number, existingMortgagesAmount: number, propertyValue: number, outstandingBalance: number, comment: RefinanceCommentTypeEnum, loanLimit: number, propertyPurchasedWithinYear: boolean, firstMortgage: number, maxCreditLine: number, successHandler: util.SuccessResponseCallBack<T>, serviceEventOrMessage?: util.ServiceEvent|string, errorHandler?: util.ErrorResponseCallBack, methodPath = 'LoanCalculatorService/CalculateCashOutResult', config?: ng.IRequestShortcutConfig): ng.IPromise<T> => {
            return this.httpUtil.get<T>(methodPath, { secondMortgageInfo : secondMortgageInfo, withdrawnFromHelocInLast12Months : withdrawnFromHelocInLast12Months, payingOffSecondMortgage : payingOffSecondMortgage, secondMortgageAmortizationType : secondMortgageAmortizationType, newLoanAmount : newLoanAmount, existingMortgagesAmount : existingMortgagesAmount, propertyValue : propertyValue, outstandingBalance : outstandingBalance, comment : comment, loanLimit : loanLimit, propertyPurchasedWithinYear : propertyPurchasedWithinYear, firstMortgage : firstMortgage, maxCreditLine : maxCreditLine }, serviceEventOrMessage, errorHandler, config, successHandler);
        }

		CalculateCashOutResult = (secondMortgageInfo: SecondMortgageInfoTypeEnum, withdrawnFromHelocInLast12Months: boolean, payingOffSecondMortgage: boolean, secondMortgageAmortizationType: ExistingSecondMortgageTypeEnum, newLoanAmount: number, existingMortgagesAmount: number, propertyValue: number, outstandingBalance: number, comment: RefinanceCommentTypeEnum, loanLimit: number, propertyPurchasedWithinYear: boolean, firstMortgage: number, maxCreditLine: number, serviceEventOrMessage?: util.ServiceEvent|string, successHandler?: util.SuccessResponseCallBack<ICashoutRuleResultCalculatedViewModel>, errorHandler?: util.ErrorResponseCallBack, methodPath = 'LoanCalculatorService/CalculateCashOutResult', config?: ng.IRequestShortcutConfig): ng.IPromise<ICashoutRuleResultCalculatedViewModel> => {
			return this.CalculateCashOutResultGeneric<ICashoutRuleResultCalculatedViewModel>(secondMortgageInfo, withdrawnFromHelocInLast12Months, payingOffSecondMortgage, secondMortgageAmortizationType, newLoanAmount, existingMortgagesAmount, propertyValue, outstandingBalance, comment, loanLimit, propertyPurchasedWithinYear, firstMortgage, maxCreditLine, successHandler || this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
		}
		
		CalculateCostsToAdjustPtcGeneric = <T>(productCosts: IList<ICostViewModel>, allCosts: boolean, successHandler: util.SuccessResponseCallBack<T>, serviceEventOrMessage?: util.ServiceEvent|string, errorHandler?: util.ErrorResponseCallBack, methodPath = 'LoanCalculatorService/CalculateCostsToAdjustPtc', config?: ng.IRequestShortcutConfig): ng.IPromise<T> => {
            return this.httpUtil.post<T>(methodPath, { productCosts : productCosts, allCosts : allCosts }, serviceEventOrMessage, errorHandler, config, successHandler);
        }

		CalculateCostsToAdjustPtc = (productCosts: IList<ICostViewModel>, allCosts: boolean, serviceEventOrMessage?: util.ServiceEvent|string, successHandler?: util.SuccessResponseCallBack<IList<ICostViewModel>>, errorHandler?: util.ErrorResponseCallBack, methodPath = 'LoanCalculatorService/CalculateCostsToAdjustPtc', config?: ng.IRequestShortcutConfig): ng.IPromise<IList<ICostViewModel>> => {
			return this.CalculateCostsToAdjustPtcGeneric<IList<ICostViewModel>>(productCosts, allCosts, successHandler || this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
		}
		
		CalculatePurchaseCostGeneric = <T>(factor: number, purchasePrice: number, loanAmount: number, type: CalculationTypeEnum, period: PeriodTypeEnum, months: number, total: number, successHandler: util.SuccessResponseCallBack<T>, serviceEventOrMessage?: util.ServiceEvent|string, errorHandler?: util.ErrorResponseCallBack, methodPath = 'LoanCalculatorService/CalculatePurchaseCost', config?: ng.IRequestShortcutConfig): ng.IPromise<T> => {
            return this.httpUtil.get<T>(methodPath, { factor : factor, purchasePrice : purchasePrice, loanAmount : loanAmount, type : type, period : period, months : months, total : total }, serviceEventOrMessage, errorHandler, config, successHandler);
        }

		CalculatePurchaseCost = (factor: number, purchasePrice: number, loanAmount: number, type: CalculationTypeEnum, period: PeriodTypeEnum, months: number, total: number, serviceEventOrMessage?: util.ServiceEvent|string, successHandler?: util.SuccessResponseCallBack<ICostCalcCalculatedViewModel>, errorHandler?: util.ErrorResponseCallBack, methodPath = 'LoanCalculatorService/CalculatePurchaseCost', config?: ng.IRequestShortcutConfig): ng.IPromise<ICostCalcCalculatedViewModel> => {
			return this.CalculatePurchaseCostGeneric<ICostCalcCalculatedViewModel>(factor, purchasePrice, loanAmount, type, period, months, total, successHandler || this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
		}
		
		CalculateValuesForTrackingToleranceGeneric = <T>(disclosuresDetails: IDisclosuresDetailsViewModel, currentCosts: IList<ICostViewModel>, defaultCosts: IList<ICostViewModel>, successHandler: util.SuccessResponseCallBack<T>, serviceEventOrMessage?: util.ServiceEvent|string, errorHandler?: util.ErrorResponseCallBack, methodPath = 'LoanCalculatorService/CalculateValuesForTrackingTolerance', config?: ng.IRequestShortcutConfig): ng.IPromise<T> => {
            return this.httpUtil.post<T>(methodPath, { disclosuresDetails : disclosuresDetails, currentCosts : currentCosts, defaultCosts : defaultCosts }, serviceEventOrMessage, errorHandler, config, successHandler);
        }

		CalculateValuesForTrackingTolerance = (disclosuresDetails: IDisclosuresDetailsViewModel, currentCosts: IList<ICostViewModel>, defaultCosts: IList<ICostViewModel>, serviceEventOrMessage?: util.ServiceEvent|string, successHandler?: util.SuccessResponseCallBack<IToleranceCalculatedViewModel>, errorHandler?: util.ErrorResponseCallBack, methodPath = 'LoanCalculatorService/CalculateValuesForTrackingTolerance', config?: ng.IRequestShortcutConfig): ng.IPromise<IToleranceCalculatedViewModel> => {
			return this.CalculateValuesForTrackingToleranceGeneric<IToleranceCalculatedViewModel>(disclosuresDetails, currentCosts, defaultCosts, successHandler || this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
		}
		
		CalculateCominedDTIandCombineHousingRatioGeneric = <T>(loanVM: ILoanViewModel, successHandler: util.SuccessResponseCallBack<T>, serviceEventOrMessage?: util.ServiceEvent|string, errorHandler?: util.ErrorResponseCallBack, methodPath = 'LoanCalculatorService/CalculateCominedDTIandCombineHousingRatio', config?: ng.IRequestShortcutConfig): ng.IPromise<T> => {
            return this.httpUtil.post<T>(methodPath, { loanVM : loanVM }, serviceEventOrMessage, errorHandler, config, successHandler);
        }

		CalculateCominedDTIandCombineHousingRatio = (loanVM: ILoanViewModel, serviceEventOrMessage?: util.ServiceEvent|string, successHandler?: util.SuccessResponseCallBack<ICombinedDTIandHousingRatioCalculatedViewModel>, errorHandler?: util.ErrorResponseCallBack, methodPath = 'LoanCalculatorService/CalculateCominedDTIandCombineHousingRatio', config?: ng.IRequestShortcutConfig): ng.IPromise<ICombinedDTIandHousingRatioCalculatedViewModel> => {
			return this.CalculateCominedDTIandCombineHousingRatioGeneric<ICombinedDTIandHousingRatioCalculatedViewModel>(loanVM, successHandler || this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
		}
		
		CalculateDetailsOfTransactionGeneric = <T>(loanVM: ILoanViewModel, successHandler: util.SuccessResponseCallBack<T>, serviceEventOrMessage?: util.ServiceEvent|string, errorHandler?: util.ErrorResponseCallBack, methodPath = 'LoanCalculatorService/CalculateDetailsOfTransaction', config?: ng.IRequestShortcutConfig): ng.IPromise<T> => {
            return this.httpUtil.post<T>(methodPath, { loanVM : loanVM }, serviceEventOrMessage, errorHandler, config, successHandler);
        }

		CalculateDetailsOfTransaction = (loanVM: ILoanViewModel, serviceEventOrMessage?: util.ServiceEvent|string, successHandler?: util.SuccessResponseCallBack<IDetailsOfTransactionCalculatedViewModel>, errorHandler?: util.ErrorResponseCallBack, methodPath = 'LoanCalculatorService/CalculateDetailsOfTransaction', config?: ng.IRequestShortcutConfig): ng.IPromise<IDetailsOfTransactionCalculatedViewModel> => {
			return this.CalculateDetailsOfTransactionGeneric<IDetailsOfTransactionCalculatedViewModel>(loanVM, successHandler || this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
		}
		
		CalculateQualifyingRateGeneric = <T>(loanVM: ILoanViewModel, successHandler: util.SuccessResponseCallBack<T>, serviceEventOrMessage?: util.ServiceEvent|string, errorHandler?: util.ErrorResponseCallBack, methodPath = 'LoanCalculatorService/CalculateQualifyingRate', config?: ng.IRequestShortcutConfig): ng.IPromise<T> => {
            return this.httpUtil.post<T>(methodPath, { loanVM : loanVM }, serviceEventOrMessage, errorHandler, config, successHandler);
        }

		CalculateQualifyingRate = (loanVM: ILoanViewModel, serviceEventOrMessage?: util.ServiceEvent|string, successHandler?: util.SuccessResponseCallBack<number>, errorHandler?: util.ErrorResponseCallBack, methodPath = 'LoanCalculatorService/CalculateQualifyingRate', config?: ng.IRequestShortcutConfig): ng.IPromise<number> => {
			return this.CalculateQualifyingRateGeneric<number>(loanVM, successHandler || this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
		}
		
		CalculateFHAGeneric = <T>(request: IFHACalculatorRequest, successHandler: util.SuccessResponseCallBack<T>, serviceEventOrMessage?: util.ServiceEvent|string, errorHandler?: util.ErrorResponseCallBack, methodPath = 'LoanCalculatorService/CalculateFHA', config?: ng.IRequestShortcutConfig): ng.IPromise<T> => {
            return this.httpUtil.post<T>(methodPath, { request : request }, serviceEventOrMessage, errorHandler, config, successHandler);
        }

		CalculateFHA = (request: IFHACalculatorRequest, serviceEventOrMessage?: util.ServiceEvent|string, successHandler?: util.SuccessResponseCallBack<IFHACalculatorResponse>, errorHandler?: util.ErrorResponseCallBack, methodPath = 'LoanCalculatorService/CalculateFHA', config?: ng.IRequestShortcutConfig): ng.IPromise<IFHACalculatorResponse> => {
			return this.CalculateFHAGeneric<IFHACalculatorResponse>(request, successHandler || this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
		}
		
		CalculateVAGeneric = <T>(request: IVACalculatorRequest, successHandler: util.SuccessResponseCallBack<T>, serviceEventOrMessage?: util.ServiceEvent|string, errorHandler?: util.ErrorResponseCallBack, methodPath = 'LoanCalculatorService/CalculateVA', config?: ng.IRequestShortcutConfig): ng.IPromise<T> => {
            return this.httpUtil.post<T>(methodPath, { request : request }, serviceEventOrMessage, errorHandler, config, successHandler);
        }

		CalculateVA = (request: IVACalculatorRequest, serviceEventOrMessage?: util.ServiceEvent|string, successHandler?: util.SuccessResponseCallBack<IVACalculatorResponse>, errorHandler?: util.ErrorResponseCallBack, methodPath = 'LoanCalculatorService/CalculateVA', config?: ng.IRequestShortcutConfig): ng.IPromise<IVACalculatorResponse> => {
			return this.CalculateVAGeneric<IVACalculatorResponse>(request, successHandler || this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
		}
		
		CalculateMIGeneric = <T>(request: IMICalculatorRequest, successHandler: util.SuccessResponseCallBack<T>, serviceEventOrMessage?: util.ServiceEvent|string, errorHandler?: util.ErrorResponseCallBack, methodPath = 'LoanCalculatorService/CalculateMI', config?: ng.IRequestShortcutConfig): ng.IPromise<T> => {
            return this.httpUtil.post<T>(methodPath, { request : request }, serviceEventOrMessage, errorHandler, config, successHandler);
        }

		CalculateMI = (request: IMICalculatorRequest, serviceEventOrMessage?: util.ServiceEvent|string, successHandler?: util.SuccessResponseCallBack<IMICalculatorResponse>, errorHandler?: util.ErrorResponseCallBack, methodPath = 'LoanCalculatorService/CalculateMI', config?: ng.IRequestShortcutConfig): ng.IPromise<IMICalculatorResponse> => {
			return this.CalculateMIGeneric<IMICalculatorResponse>(request, successHandler || this.httpUtil.defaultSuccessHandler, serviceEventOrMessage, errorHandler, methodPath, config);
		}
	}
}

moduleRegistration.registerService(moduleNames.services, srv.LoanCalculatorService);

