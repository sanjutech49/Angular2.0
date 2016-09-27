using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MML.Common;
using MML.Web.Facade;
using MML.Web.LoanCenter.Helpers.Utilities;
using MML.Contracts;
using MML.Common.Helpers;
using MML.Web.LoanCenter.ViewModels;
using System.Web.WebPages.Html;
using MML.Web.LoanCenter.Helpers.Enums;

namespace MML.Web.LoanCenter.Commands
{
    public class OpenOrderProcessedTabCommand : CommandsBase
    {
        public override void Execute()
        {
            String serarchValue = CommonHelper.GetSearchValue( base.HttpContext );

            OrderProcessedListState orderProcessedListState = null;

            if ( base.HttpContext != null && base.HttpContext.Session[ SessionHelper.OrderProcessedListState ] != null )
            {
                orderProcessedListState = ( OrderProcessedListState )base.HttpContext.Session[ SessionHelper.OrderProcessedListState ];
            }
            else
                orderProcessedListState = new OrderProcessedListState();

            FilterViewModel filterViewModel = null;

            if ( base.HttpContext != null && base.HttpContext.Session[ SessionHelper.FilterViewModel ] != null )
            {
                filterViewModel = new FilterViewModel().FromXml( base.HttpContext.Session[ SessionHelper.FilterViewModel ].ToString() );
                filterViewModel.FilterContext = Helpers.Enums.FilterContextEnum.OrderProcessed;
            }
            else
            {
                filterViewModel = new FilterViewModel();
                filterViewModel.FilterContext = Helpers.Enums.FilterContextEnum.OrderProcessed;
            }

            Boolean refresh = InputParameters != null && InputParameters.ContainsKey( "Refresh" ) && InputParameters[ "Refresh" ].ToString().Trim() == "true";

            if ( !refresh )
                orderProcessedListState.CurrentPage = 1;

            UserAccount user = null;

            if ( base.HttpContext.Session[ SessionHelper.UserData ] != null )
            {
                user = ( UserAccount )base.HttpContext.Session[ SessionHelper.UserData ];
            }
            else
                throw new InvalidOperationException( "UserData is null" );

            OrderProcessedViewModel orderProcessedViewModel = new OrderProcessedViewModel();

            orderProcessedViewModel = OrderProcessedDataHelper.RetrieveOrderProcessedViewModel( orderProcessedListState,
                        base.HttpContext.Session[ SessionHelper.UserAccountIds ] != null
                            ? ( List<int> )base.HttpContext.Session[ SessionHelper.UserAccountIds ]
                            : new List<int> { }, user.UserAccountId, filterViewModel.CompanyId, filterViewModel.ChannelId, filterViewModel.DivisionId, filterViewModel.BranchId, serarchValue );

            OrderProcessedGridHelper.ProcessPagingOptions( orderProcessedListState, orderProcessedViewModel );
            OrderProcessedGridHelper.ApplyClassCollection( orderProcessedViewModel );

            ViewName = "Queues/_orderProcessed";
            ViewData = orderProcessedViewModel;

            /* Persist new state */
            base.HttpContext.Session[ SessionHelper.OrderProcessedViewModel ] = orderProcessedViewModel.ToXml();
            base.HttpContext.Session[ SessionHelper.OrderProcessedListState ] = orderProcessedListState;
            base.HttpContext.Session[ SessionHelper.FilterViewModel ] = filterViewModel.ToXml();
            base.HttpContext.Session[ SessionHelper.CurrentTab ] = LoanCenterTab.OrderProcessed;
        }
    }
}