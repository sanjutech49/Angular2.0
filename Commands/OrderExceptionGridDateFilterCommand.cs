﻿using System;
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
    public class OrderExceptionGridDateFilterCommand : CommandsBase
    {
        public override void Execute()
        {
            base.Execute();

            var searchValue = CommonHelper.GetSearchValue( base.HttpContext );

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

            OrderExceptionListState orderExceptionListState;
            if ( base.HttpContext.Session[ SessionHelper.OrderExceptionListState ] != null )
                orderExceptionListState = ( OrderExceptionListState )base.HttpContext.Session[ SessionHelper.OrderExceptionListState ];
            else
                orderExceptionListState = new OrderExceptionListState();

            UserAccount user;
            if ( base.HttpContext.Session[ SessionHelper.UserData ] != null && ( ( UserAccount )base.HttpContext.Session[ SessionHelper.UserData ] ).Username == base.HttpContext.User.Identity.Name )
                user = ( UserAccount )base.HttpContext.Session[ SessionHelper.UserData ];
            else
                user = UserAccountServiceFacade.GetUserByName( base.HttpContext.User.Identity.Name );

            if ( user == null )
                throw new NullReferenceException( "User is null" );

            if ( InputParameters == null || !InputParameters.ContainsKey( "DateFilter" ) )
                throw new ArgumentException( "DateFilter value was expected!" );

            var newDateFilterValue = ( GridDateFilter )Enum.Parse( typeof( GridDateFilter ), InputParameters[ "DateFilter" ].ToString() );

            orderExceptionListState.BoundDate = newDateFilterValue;

            orderExceptionListState.CurrentPage = 1;

            OrderExceptionViewModel orderExceptionViewModel = OrderExceptionDataHelper.RetrieveOrderExceptionViewModel( orderExceptionListState,
                                                                          base.HttpContext.Session[ SessionHelper.UserAccountIds ] != null
                                                                              ? ( List<int> )
                                                                                base.HttpContext.Session[ SessionHelper.UserAccountIds ]
                                                                              : new List<int> { },
                                                                          user.UserAccountId, filterViewModel.CompanyId, filterViewModel.ChannelId, filterViewModel.DivisionId, filterViewModel.BranchId, searchValue );

            ViewName = "Queues/_orderException";
            ViewData = orderExceptionViewModel;

            /* Persist new state */
            base.HttpContext.Session[ SessionHelper.OrderExceptionViewModel ] = orderExceptionViewModel.ToXml();
            base.HttpContext.Session[ SessionHelper.OrderExceptionListState ] = orderExceptionListState;
        }
    }
}