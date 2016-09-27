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
    public class OpenOrderRequestedTabCommand : CommandsBase
    {
        public override void Execute()
        {
            String serarchValue = CommonHelper.GetSearchValue( base.HttpContext );

            OrderRequestedListState orderRequestedListState = null;

            if ( base.HttpContext != null && base.HttpContext.Session[ SessionHelper.OrderRequestedListState ] != null )
            {
                orderRequestedListState = ( OrderRequestedListState )base.HttpContext.Session[ SessionHelper.OrderRequestedListState ];
            }
            else
                orderRequestedListState = new OrderRequestedListState();

            FilterViewModel filterViewModel = null;

            if ( base.HttpContext != null && base.HttpContext.Session[ SessionHelper.FilterViewModel ] != null )
            {
                filterViewModel = new FilterViewModel().FromXml( base.HttpContext.Session[ SessionHelper.FilterViewModel ].ToString() );
                filterViewModel.FilterContext = Helpers.Enums.FilterContextEnum.OrderRequested;
            }
            else
            {
                filterViewModel = new FilterViewModel();
                filterViewModel.FilterContext = Helpers.Enums.FilterContextEnum.OrderRequested;
            }

            Boolean refresh = InputParameters != null && InputParameters.ContainsKey( "Refresh" ) && InputParameters[ "Refresh" ].ToString().Trim() == "true";

            if ( !refresh )
                orderRequestedListState.CurrentPage = 1;

            UserAccount user = null;

            if ( base.HttpContext.Session[ SessionHelper.UserData ] != null )
            {
                user = ( UserAccount )base.HttpContext.Session[ SessionHelper.UserData ];
            }
            else
                throw new InvalidOperationException( "UserData is null" );

            OrderRequestedViewModel orderRequestedViewModel = new OrderRequestedViewModel();

            orderRequestedViewModel = OrderRequestedDataHelper.RetrieveOrderRequestedViewModel( orderRequestedListState,
                        base.HttpContext.Session[ SessionHelper.UserAccountIds ] != null
                            ? ( List<int> )base.HttpContext.Session[ SessionHelper.UserAccountIds ]
                            : new List<int> { }, user.UserAccountId, filterViewModel.CompanyId, filterViewModel.ChannelId, filterViewModel.DivisionId, filterViewModel.BranchId, serarchValue );

            OrderRequestedGridHelper.ProcessPagingOptions( orderRequestedListState, orderRequestedViewModel );
            OrderRequestedGridHelper.ApplyClassCollection( orderRequestedViewModel );

            ViewName = "Queues/_orderRequested";
            ViewData = orderRequestedViewModel;

            /* Persist new state */
            base.HttpContext.Session[ SessionHelper.OrderRequestedViewModel ] = orderRequestedViewModel.ToXml();
            base.HttpContext.Session[ SessionHelper.OrderRequestedListState ] = orderRequestedListState;
            base.HttpContext.Session[ SessionHelper.FilterViewModel ] = filterViewModel.ToXml();
            base.HttpContext.Session[ SessionHelper.CurrentTab ] = LoanCenterTab.OrderRequested;
        }
    }
}