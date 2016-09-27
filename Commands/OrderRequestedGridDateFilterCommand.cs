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
    public class OrderRequestedGridDateFilterCommand : CommandsBase
    {
        public override void Execute()
        {
            var searchValue = CommonHelper.GetSearchValue( base.HttpContext );

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

            OrderRequestedListState orderRequestedListState;
            if ( base.HttpContext.Session[ SessionHelper.OrderRequestedListState ] != null )
                orderRequestedListState = ( OrderRequestedListState )base.HttpContext.Session[ SessionHelper.OrderRequestedListState ];
            else
                orderRequestedListState = new OrderRequestedListState();

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

            orderRequestedListState.BoundDate = newDateFilterValue;

            // on date filter change, reset page number
            orderRequestedListState.CurrentPage = 1;

            /* Command processing */
            OrderRequestedViewModel orderRequestedViewModel = OrderRequestedDataHelper.RetrieveOrderRequestedViewModel( orderRequestedListState,
                                                                          base.HttpContext.Session[ SessionHelper.UserAccountIds ] != null
                                                                              ? ( List<int> )
                                                                                base.HttpContext.Session[ SessionHelper.UserAccountIds ]
                                                                              : new List<int> { },
                                                                          user.UserAccountId, filterViewModel.CompanyId, filterViewModel.ChannelId, filterViewModel.DivisionId, filterViewModel.BranchId, searchValue );

            ViewName = "Queues/_orderRequested";
            ViewData = orderRequestedViewModel;

            /* Persist new state */
            base.HttpContext.Session[ SessionHelper.OrderRequestedViewModel ] = orderRequestedViewModel.ToXml();
            base.HttpContext.Session[ SessionHelper.OrderRequestedListState ] = orderRequestedListState;
        }
    }
}