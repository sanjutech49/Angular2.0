using System;
using System.Collections.Generic;
using System.Linq;
using MML.Common.Helpers;
using MML.Contracts;
using MML.Web.Facade;
using MML.Web.LoanCenter.ViewModels;

namespace MML.Web.LoanCenter.Helpers.Utilities
{
    public static class CompletedLoansDataHelper
    {
        public static CompletedLoansViewModel RetrieveCompletedLoansViewModel( CompletedLoansListState completedLoansListState, List<int> userAccountIds, int userAccountId, string searchTerm, Guid companyId, int channelId, int divisionId, Guid branchId )
        {
            if ( completedLoansListState == null )
                completedLoansListState = new CompletedLoansListState();

            if ( userAccountIds == null )
                userAccountIds = new List<int>();

            string isOnLineUser = completedLoansListState.BorrowerStatusFilter == null ? null :
                               completedLoansListState.BorrowerStatusFilter == BorrowerStatusType.Offline.GetStringValue() ? "0" : "1";

            CompletedLoansViewData completedLoansViewData = LoanServiceFacade.RetrieveCompletedLoansItemsView( userAccountIds,
                                                                                            completedLoansListState.CurrentPage,
                                                                                            completedLoansListState.SortColumn.GetStringValue(),
                                                                                            completedLoansListState.SortDirection,
                                                                                            completedLoansListState.BoundDate,
                                                                                            userAccountId,
                                                                                            searchTerm,
                                                                                            isOnLineUser,
                                                                                            companyId, channelId, divisionId, branchId
                                                                                            );
            if ( completedLoansViewData == null )
                completedLoansViewData = new CompletedLoansViewData { CompletedLoansItems = new List<CompletedLoansViewItem>(), TotalItems = 0, TotalPages = 0 };

            for (int i = 0; i < completedLoansViewData.CompletedLoansItems.Count; i++)
            {
                for (int j = 0; j < completedLoansViewData.CompletedLoansItems[i].CompletedLoansViewItems.Count; j++)
                {
                    DataForShortProductDescription data =
                        LoanServiceFacade.RetrieveDataForShortProductDescription(completedLoansViewData.CompletedLoansItems[i].CompletedLoansViewItems[j].LoanId);

                    completedLoansViewData.CompletedLoansItems[i].CompletedLoansViewItems[j].ProgramName = LoanHelper.FormatShortProductDescription(completedLoansViewData.CompletedLoansItems[i].CompletedLoansViewItems[j].IsHarp,
                                                                                                             EnumHelper.GetStringValue((AmortizationType)data.AmortizationType),
                                                                                                             data.LoanTerm,
                                                                                                             data.FixedRateTerm,
                                                                                                              EnumHelper.GetStringValue((MortgageType)data.MortgageType));
                }
            }

            var completedLoansViewModel = new CompletedLoansViewModel
            {
                BorrowerStatusList = new List<BorrowerStatusType>(Enum.GetValues(typeof(BorrowerStatusType)).Cast<BorrowerStatusType>().Skip(1)),
                ActivityTypeList = new List<ActivityType>( Enum.GetValues( typeof( ActivityType ) ).Cast<ActivityType>() ),
                CompletedLoansItems = completedLoansViewData.CompletedLoansItems,
                PageCount = completedLoansViewData.TotalPages,
                TotalItems = completedLoansViewData.TotalItems
            };

            CompletedLoansGridHelper.ProcessPagingOptions( completedLoansListState, completedLoansViewModel );
            CompletedLoansGridHelper.ApplyClassCollection( completedLoansViewModel );

            return completedLoansViewModel;
        }
    }
}
