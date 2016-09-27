using System;
using System.Collections.Generic;
using MML.Common.Helpers;
using System.Linq;
using MML.Contracts;
using MML.Contracts.CommonDomainObjects;
using MML.Web.Facade;
using MML.Web.LoanCenter.ViewModels;

namespace MML.Web.LoanCenter.Helpers.Utilities
{
    public static class AlertsDataHelper
    {
        public static AlertsViewModel RetrieveAlertViewModel( AlertsListState alertsListState, List<int> userAccountIds, GridDateFilter dateFilter, int userAccountId,  Guid companyid, int channelId, int divisionId, Guid branchId, string searchTerm = null )
        {
            if ( alertsListState == null )
                alertsListState = new AlertsListState();

            if ( userAccountIds == null )
                userAccountIds = new List<int>();

            var alertsViewData = AlertMessageServiceFacade.RetrieveAlertItemsView( userAccountId,userAccountIds,
                                                                                    alertsListState.CurrentPage,
                                                                                    alertsListState.SortColumn.GetStringValue(),
                                                                                    alertsListState.SortDirection,
                                                                                    alertsListState.BoundDate,
                                                                                    searchTerm,
                                                                                    alertsListState.LoanPurposeFilter,
                                                                                    alertsListState.ActivityTypeFilter,
                                                                                    companyid, channelId, divisionId, branchId
                                           	) ??
                                           new AlertViewData { AlertItems = new List<AlertViewItem>(), TotalItems = 0, TotalPages = 0, NumberOfAlerts = 0 };


            foreach (AlertViewItem alertViewItems in alertsViewData.AlertItems)
            {

                foreach (AlertView alertViewItem in alertViewItems.AlertViewItems)
                {

                DataForShortProductDescription data =
                    LoanServiceFacade.RetrieveDataForShortProductDescription( alertViewItem.LoanId );

                alertViewItem.ProgramName = LoanHelper.FormatShortProductDescription( alertViewItem.IsHarp,
                                                                         ((AmortizationType) data.AmortizationType).GetStringValue(),
                                                                         data.LoanTerm,
                                                                         data.FixedRateTerm,
                                                                         ((MortgageType) data.MortgageType).GetStringValue());
            }
        }
        	var alertsViewModel = new AlertsViewModel
            {  
                ActivityTypeList = CommonHelper.RetrieveActivityListForQueueFilter(),
                LoanPurposeList = new List<LoanTransactionType>(Enum.GetValues(typeof(LoanTransactionType)).Cast<LoanTransactionType>().Skip(1)),
                AlertItems = alertsViewData.AlertItems,
                PageCount = alertsViewData.TotalPages,
                TotalItems = alertsViewData.TotalItems,
                NumberOfAlerts = alertsViewData.NumberOfAlerts               
            };

            AlertsGridHelper.ProcessPagingOptions( alertsListState, alertsViewModel );
            AlertsGridHelper.ApplyClassCollection( alertsViewModel );

            return alertsViewModel;
        }
    }
}
