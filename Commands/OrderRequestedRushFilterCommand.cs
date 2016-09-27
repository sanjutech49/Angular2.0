using System;
using System.Collections.Generic;
using System.Web;
using MML.Common;
using MML.Web.LoanCenter.ViewModels;
using MML.Web.LoanCenter.Helpers.Utilities;
using MML.Contracts;
using MML.Web.Facade;
using MML.Web.LoanCenter.Helpers.Enums;
using MML.Common.Helpers;

namespace MML.Web.LoanCenter.Commands
{
    public class OrderRequestedRushFilterCommand : CommandsBase
    {
        public override void Execute()
        {
            base.Execute();

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

            if ( !InputParameters.ContainsKey( "Rush" ) )
                throw new ArgumentException( "Rush was expected!" );

            orderRequestedListState.RushFilter = InputParameters[ "Rush" ].ToString() == "-1" ? null : InputParameters[ "Rush" ].ToString();

            orderRequestedListState.CurrentPage = 1;

            OrderRequestedViewModel orderRequestedViewModel = OrderRequestedDataHelper.RetrieveOrderRequestedViewModel( orderRequestedListState,
                                              base.HttpContext.Session[ SessionHelper.UserAccountIds ] != null
                                                  ? ( List<int> )base.HttpContext.Session[ SessionHelper.UserAccountIds ]
                                                  : new List<int> { }, base.User.UserAccountId, filterViewModel.CompanyId, filterViewModel.ChannelId, filterViewModel.DivisionId,
                                             filterViewModel.BranchId, CommonHelper.GetSearchValue( base.HttpContext ) );

            base.ViewName = "Queues/_orderRequested";
            base.ViewData = orderRequestedViewModel;

            /* Persist new state */
            base.HttpContext.Session[ SessionHelper.OrderRequestedViewModel ] = orderRequestedViewModel.ToXml();
            base.HttpContext.Session[ SessionHelper.OrderRequestedListState ] = orderRequestedListState;
        }
    }
}