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
    public class OpenOrderExceptionTabCommand : CommandsBase
    {
        public override void  Execute()
        {
            if ( base.HttpContext == null || base.HttpContext.Session == null )
                throw new NullReferenceException( "Session is empty" );


            String serarchValue = CommonHelper.GetSearchValue( base.HttpContext );

            OrderExceptionListState orderExceptionListState = null;

            if ( base.HttpContext.Session[ SessionHelper.OrderExceptionListState ] != null )
                orderExceptionListState = ( OrderExceptionListState )base.HttpContext.Session[ SessionHelper.OrderExceptionListState ];
            else
                orderExceptionListState = new OrderExceptionListState();

            FilterViewModel filterViewModel = null;

            if ( base.HttpContext.Session[ SessionHelper.FilterViewModel ] != null )
            {
                filterViewModel = new FilterViewModel().FromXml( base.HttpContext.Session[ SessionHelper.FilterViewModel ].ToString() );
                filterViewModel.FilterContext = Helpers.Enums.FilterContextEnum.OrderException;
            }
            else
            {
                filterViewModel = new FilterViewModel();
                filterViewModel.FilterContext = Helpers.Enums.FilterContextEnum.OrderException;
            }

            Boolean refresh = InputParameters != null && InputParameters.ContainsKey( "Refresh" ) && InputParameters[ "Refresh" ].ToString().Trim() == "true";

            if ( !refresh )
                orderExceptionListState.CurrentPage = 1;

            UserAccount user = null;

            if ( base.HttpContext.Session[ SessionHelper.UserData ] != null )
            {
                user = ( UserAccount )base.HttpContext.Session[ SessionHelper.UserData ];
            }
            else
                throw new NullReferenceException( "UserData is null" );

            OrderExceptionViewModel orderExceptionViewModel = new OrderExceptionViewModel();

            orderExceptionViewModel = OrderExceptionDataHelper.RetrieveOrderExceptionViewModel( orderExceptionListState,
                        base.HttpContext.Session[ SessionHelper.UserAccountIds ] != null
                            ? ( List<int> )base.HttpContext.Session[ SessionHelper.UserAccountIds ]
                            : new List<int> { }, user.UserAccountId, filterViewModel.CompanyId, filterViewModel.ChannelId, filterViewModel.DivisionId, filterViewModel.BranchId, serarchValue );

            OrderExceptionGridHelper.ProcessPagingOptions( orderExceptionListState, orderExceptionViewModel );
            OrderExceptionGridHelper.ApplyClassCollection( orderExceptionViewModel );

            ViewName = "Queues/_orderException";
            ViewData = orderExceptionViewModel;

            /* Persist new state */
            base.HttpContext.Session[ SessionHelper.OrderExceptionViewModel ] = orderExceptionViewModel.ToXml();
            base.HttpContext.Session[ SessionHelper.OrderExceptionListState ] = orderExceptionListState;
            base.HttpContext.Session[ SessionHelper.FilterViewModel ] = filterViewModel.ToXml();
            base.HttpContext.Session[ SessionHelper.CurrentTab ] = LoanCenterTab.OrderException;
        }
    }
}