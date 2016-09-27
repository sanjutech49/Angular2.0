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
    public class OpenOrderDeliveredForReviewTabCommand : CommandsBase
    {
        public override void Execute()
        {
            String serarchValue = CommonHelper.GetSearchValue( base.HttpContext );

            OrderDeliveredForReviewListState orderDeliveredForReviewListState = null;

            if ( base.HttpContext != null && base.HttpContext.Session[ SessionHelper.OrderDeliveredForReviewListState ] != null )
            {
                orderDeliveredForReviewListState = ( OrderDeliveredForReviewListState )base.HttpContext.Session[ SessionHelper.OrderDeliveredForReviewListState ];
            }
            else
                orderDeliveredForReviewListState = new OrderDeliveredForReviewListState();

            FilterViewModel filterViewModel = null;

            if ( base.HttpContext != null && base.HttpContext.Session[ SessionHelper.FilterViewModel ] != null )
            {
                filterViewModel = new FilterViewModel().FromXml( base.HttpContext.Session[ SessionHelper.FilterViewModel ].ToString() );
                filterViewModel.FilterContext = Helpers.Enums.FilterContextEnum.OrderDeliveredForReview;
            }
            else
            {
                filterViewModel = new FilterViewModel();
                filterViewModel.FilterContext = Helpers.Enums.FilterContextEnum.OrderDeliveredForReview;
            }

            Boolean refresh = InputParameters != null && InputParameters.ContainsKey( "Refresh" ) && InputParameters[ "Refresh" ].ToString().Trim() == "true";

            if ( !refresh )
                orderDeliveredForReviewListState.CurrentPage = 1;

            UserAccount user = null;

            if ( base.HttpContext.Session[ SessionHelper.UserData ] != null )
            {
                user = ( UserAccount )base.HttpContext.Session[ SessionHelper.UserData ];
            }
            else
                throw new InvalidOperationException( "UserData is null" );

            OrderDeliveredForReviewViewModel orderDeliveredForReviewViewModel = new OrderDeliveredForReviewViewModel();

            orderDeliveredForReviewViewModel = OrderDeliveredForReviewDataHelper.RetrieveOrderDeliveredForReviewViewModel( orderDeliveredForReviewListState,
                        base.HttpContext.Session[ SessionHelper.UserAccountIds ] != null
                            ? ( List<int> )base.HttpContext.Session[ SessionHelper.UserAccountIds ]
                            : new List<int> { }, user.UserAccountId, filterViewModel.CompanyId, filterViewModel.ChannelId, filterViewModel.DivisionId, filterViewModel.BranchId, serarchValue );

            OrderDeliveredForReviewGridHelper.ProcessPagingOptions( orderDeliveredForReviewListState, orderDeliveredForReviewViewModel );
            OrderDeliveredForReviewGridHelper.ApplyClassCollection( orderDeliveredForReviewViewModel );

            ViewName = "Queues/_orderDeliveredForReview";
            ViewData = orderDeliveredForReviewViewModel;

            /* Persist new state */
            base.HttpContext.Session[ SessionHelper.OrderDeliveredForReviewViewModel ] = orderDeliveredForReviewViewModel.ToXml();
            base.HttpContext.Session[ SessionHelper.OrderDeliveredForReviewListState ] = orderDeliveredForReviewListState;
            base.HttpContext.Session[ SessionHelper.FilterViewModel ] = filterViewModel.ToXml();
            base.HttpContext.Session[ SessionHelper.CurrentTab ] = LoanCenterTab.OrderDeliveredForReview;
        }
    }
}