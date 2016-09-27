using System;
using System.Collections.Generic;
using System.Web;
using MML.Common;
using MML.Web.LoanCenter.ViewModels;
using MML.Web.LoanCenter.Helpers.Utilities;
using MML.Contracts;
using MML.Web.Facade;
using MML.Common.Helpers;

namespace MML.Web.LoanCenter.Commands
{
    public class OrderProcessedGridPagingCommand : CommandsBase
    {
        public override void Execute()
        {
            var searchValue = CommonHelper.GetSearchValue( base.HttpContext );

            OrderProcessedListState orderProcessedListState;
            if ( base.HttpContext.Session[ SessionHelper.OrderProcessedListState ] != null )
                orderProcessedListState = ( OrderProcessedListState )base.HttpContext.Session[ SessionHelper.OrderProcessedListState ];
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

            UserAccount user;
            if ( base.HttpContext.Session[ SessionHelper.UserData ] != null && ( ( UserAccount )base.HttpContext.Session[ SessionHelper.UserData ] ).Username == base.HttpContext.User.Identity.Name )
                user = ( UserAccount )base.HttpContext.Session[ SessionHelper.UserData ];
            else
                user = UserAccountServiceFacade.GetUserByName( base.HttpContext.User.Identity.Name );

            if ( user == null )
                throw new InvalidOperationException( "User is null" );

            /* parameter processing */
            if ( !InputParameters.ContainsKey( "Page" ) )
                throw new ArgumentException( "Page number was expected!" );

            var newPageNumber = Convert.ToInt32( InputParameters[ "Page" ] );

            orderProcessedListState.CurrentPage = newPageNumber;

            OrderProcessedViewModel orderProcessedViewModel = OrderProcessedDataHelper.RetrieveOrderProcessedViewModel( orderProcessedListState,
                                                          base.HttpContext.Session[ SessionHelper.UserAccountIds ] != null
                                                              ? ( List<int> )base.HttpContext.Session[ SessionHelper.UserAccountIds ]
                                                              : new List<int> { }, user.UserAccountId, filterViewModel.CompanyId, filterViewModel.ChannelId, filterViewModel.DivisionId,
                                                          filterViewModel.BranchId, searchValue );


            ViewName = "Queues/_orderProcessed";
            ViewData = orderProcessedViewModel;

            /* Persist new state */
            base.HttpContext.Session[ SessionHelper.OrderProcessedViewModel ] = orderProcessedViewModel.ToXml();
            base.HttpContext.Session[ SessionHelper.OrderProcessedListState ] = orderProcessedListState;
        }
    }
}