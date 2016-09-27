using System;
using System.Collections.Generic;
using System.Web;
using MML.Common;
using MML.Contracts.CommonDomainObjects;
using MML.Web.LoanCenter.ViewModels;
using MML.Web.LoanCenter.Helpers.Utilities;
using MML.Contracts;
using MML.Web.Facade;
using MML.Common.Helpers;

namespace MML.Web.LoanCenter.Commands
{
    public class OrderDeliveredForReviewGridDateFilterCommand : CommandsBase
    {
        public override void Execute()
        {
            var searchValue = CommonHelper.GetSearchValue( base.HttpContext );

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

            OrderDeliveredForReviewListState orderDeliveredForReviewListState;
            if ( base.HttpContext.Session[ SessionHelper.OrderDeliveredForReviewListState ] != null )
                orderDeliveredForReviewListState = ( OrderDeliveredForReviewListState )base.HttpContext.Session[ SessionHelper.OrderDeliveredForReviewListState ];
            else
                orderDeliveredForReviewListState = new OrderDeliveredForReviewListState();

            UserAccount user;
            if ( base.HttpContext.Session[ SessionHelper.UserData ] != null && ( ( UserAccount )base.HttpContext.Session[ SessionHelper.UserData ] ).Username == base.HttpContext.User.Identity.Name )
                user = ( UserAccount )base.HttpContext.Session[ SessionHelper.UserData ];
            else
                user = UserAccountServiceFacade.GetUserByName( base.HttpContext.User.Identity.Name );

            if ( user == null )
                throw new InvalidOperationException( "User is null" );

            /* parameter processing */
            if ( !InputParameters.ContainsKey( "DateFilter" ) )
                throw new ArgumentException( "DateFilter value was expected!" );

            var newDateFilterValue = ( GridDateFilter )Enum.Parse( typeof( GridDateFilter ), InputParameters[ "DateFilter" ].ToString() );

            orderDeliveredForReviewListState.BoundDate = newDateFilterValue;

            // on date filter change, reset page number
            orderDeliveredForReviewListState.CurrentPage = 1;

            /* Command processing */
            OrderDeliveredForReviewViewModel orderDeliveredForReviewViewModel = OrderDeliveredForReviewDataHelper.RetrieveOrderDeliveredForReviewViewModel( orderDeliveredForReviewListState,
                                                                          base.HttpContext.Session[ SessionHelper.UserAccountIds ] != null
                                                                              ? ( List<int> )
                                                                                base.HttpContext.Session[ SessionHelper.UserAccountIds ]
                                                                              : new List<int> { },
                                                                          user.UserAccountId, filterViewModel.CompanyId, filterViewModel.ChannelId, filterViewModel.DivisionId, filterViewModel.BranchId, searchValue );

            ViewName = "Queues/_orderDeliveredForReview";
            ViewData = orderDeliveredForReviewViewModel;

            /* Persist new state */
            base.HttpContext.Session[ SessionHelper.OrderDeliveredForReviewViewModel ] = orderDeliveredForReviewViewModel.ToXml();
            base.HttpContext.Session[ SessionHelper.OrderDeliveredForReviewListState ] = orderDeliveredForReviewListState;
        }
    }
}