using System;
using System.Collections.Generic;
using System.Linq;
using MML.Common.Helpers;
using MML.Contracts;
using MML.Contracts.CommonDomainObjects;
using MML.Web.Facade;
using MML.Web.LoanCenter.ViewModels;

namespace MML.Web.LoanCenter.Helpers.Utilities
{
    public static class CancelDataHelper
    {
        public static CancelViewModel RetrieveCancelViewModel( CancelLoanListState cancelListState, List<int> userAccountIds, GridDateFilter dateFilter, int userAccountId, Guid companyId, int channelId, int divisionId, Guid branchId, string searchTerm = null )
        {
            if ( cancelListState == null )
                cancelListState = new CancelLoanListState();

            if ( userAccountIds == null )
                userAccountIds = new List<int>();

            string isOnLineUser = cancelListState.BorrowerStatusFilter == null ? null :
                                 cancelListState.BorrowerStatusFilter == BorrowerStatusType.Offline.GetStringValue() ? "0" : "1";

            CancelViewData cancelViewData = LoanServiceFacade.RetrieveCancelItemsView( userAccountId, userAccountIds,
                                                                                    cancelListState.CurrentPage,
                                                                                    cancelListState.SortColumn.GetStringValue(),
                                                                                    cancelListState.SortDirection,
                                                                                    cancelListState.BoundDate,
                                                                                    searchTerm,
                                                                                    isOnLineUser,
                                                                                    companyId, 
                                                                                    channelId,
                                                                                    divisionId,
                                                                                    branchId
                                           	) ??
                                           new CancelViewData { CancelViewItems = new List<CancelViewItem>(), TotalItems = 0, TotalPages = 0 };

            for (int i = 0; i < cancelViewData.CancelViewItems.Count; i++)
            {
                for (int j = 0; j < cancelViewData.CancelViewItems[i].CancelViewItems.Count; j++)
                {
                    DataForShortProductDescription data =
                        LoanServiceFacade.RetrieveDataForShortProductDescription(cancelViewData.CancelViewItems[i].CancelViewItems[j].LoanId);

                    cancelViewData.CancelViewItems[i].CancelViewItems[j].ProgramName = LoanHelper.FormatShortProductDescription(cancelViewData.CancelViewItems[i].CancelViewItems[j].IsHarp,
                                                                                                             EnumHelper.GetStringValue((AmortizationType)data.AmortizationType),
                                                                                                             data.LoanTerm,
                                                                                                             data.FixedRateTerm,
                                                                                                              EnumHelper.GetStringValue((MortgageType)data.MortgageType));
                }
            }

        	var cancelViewModel = new CancelViewModel
            {
                BorrowerStatusList = new List<BorrowerStatusType>(Enum.GetValues(typeof(BorrowerStatusType)).Cast<BorrowerStatusType>().Skip(1)),
                CancelItems = cancelViewData.CancelViewItems,
                PageCount = cancelViewData.TotalPages,
                TotalItems = cancelViewData.TotalItems
            };

            CancelGridHelper.ApplyClassCollection(cancelViewModel);
            CancelGridHelper.ProcessPagingOptions( cancelListState, cancelViewModel );


            return cancelViewModel;
        }
    }
}
