using System;
using System.Collections.Generic;
using System.Linq;
using MML.Common.Helpers;
using MML.Contracts;
using MML.Web.Facade;
using MML.Web.LoanCenter.Helpers.Enums;
using MML.Web.LoanCenter.ViewModels;

namespace MML.Web.LoanCenter.Helpers.Utilities
{
    public static class NewLoanApplicationDataHelper
    {
        public static NewLoanApplicationViewModel RetrieveNewApplicationViewModel( NewLoanApplicationListState newLoanApplicationListState, List<int> userAccountIds, int userAccountId, Guid companyId, int channelId, int divisionId, Guid branchId , string searchTerm = null)
        {
            if ( newLoanApplicationListState == null )
                newLoanApplicationListState = new NewLoanApplicationListState();

            if ( userAccountIds == null )
                userAccountIds = new List<int>();

            string isOnLineUser = String.IsNullOrEmpty( newLoanApplicationListState.BorrowerStatusFilter ) ? String.Empty :
                                  newLoanApplicationListState.BorrowerStatusFilter == BorrowerStatusType.Offline.GetStringValue() ? "0" : "1";

            NewLoanApplicationViewData newLoanApplicationViewData =  LoanServiceFacade.RetrieveNewLoanApplicationItemsView( userAccountIds,
                                                                                            newLoanApplicationListState.CurrentPage,
                                                                                            newLoanApplicationListState.SortColumn.GetStringValue(),
                                                                                            newLoanApplicationListState.SortDirection,
                                                                                            newLoanApplicationListState.BoundDate,
                                                                                            userAccountId,
                                                                                            searchTerm,
                                                                                            companyId, 
                                                                                            channelId, 
                                                                                            divisionId,
                                                                                            newLoanApplicationListState.LoanPurposeFilter,
                                                                                            isOnLineUser,
                                                                                            branchId
                                                                                            );

            if ( newLoanApplicationViewData == null )
            {
                newLoanApplicationViewData = new NewLoanApplicationViewData { NewLoanApplicationItems = new List<NewLoanApplicationViewItem>(), TotalItems = 0, TotalPages = 0 };
            }

            NewLoanApplicationViewModel newLoanApplicationViewModel = new NewLoanApplicationViewModel
            {
                NewLoanApplicationViewItems= newLoanApplicationViewData.NewLoanApplicationItems,
                PageCount = newLoanApplicationViewData.TotalPages,
                TotalItems = newLoanApplicationViewData.TotalItems,
                LoanPurposeList = new List<LoanTransactionType>( Enum.GetValues( typeof( LoanTransactionType ) ).Cast<LoanTransactionType>().Skip( 1 ) ),
                BorrowerStatusList = new List<BorrowerStatusType>( Enum.GetValues( typeof( BorrowerStatusType ) ).Cast<BorrowerStatusType>().Skip( 1 ) ),
            };

            NewLoanApplicationGridHelper.ProcessPagingOptions( newLoanApplicationListState, newLoanApplicationViewModel );
            NewLoanApplicationGridHelper.ApplyClassCollection( newLoanApplicationViewModel );

            return newLoanApplicationViewModel;
        }
    }
}
