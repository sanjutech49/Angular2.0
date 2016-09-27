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
    public class CancelGridSortingCommand : ICommand
	{
		private String _viewName = String.Empty;
		private dynamic _viewModel = null;
		private Dictionary<string, object> _inputParameters = null;
		private HttpContextBase _httpContext = null;

		public string ViewName
		{
			get { return _viewName; }
		}

		public dynamic ViewData
		{
			get { return _viewModel; }
		}

		public Dictionary<string, object> InputParameters
		{
			get
			{
				return _inputParameters;
			}
			set
			{
				_inputParameters = value;
			}
		}

		public HttpContextBase HttpContext
		{
			get { return _httpContext; }
			set { _httpContext = value; }
		}

		public void Execute()
		{
            CancelLoanListState cancelListState = null;
			if ( _httpContext.Session[ SessionHelper.CancelListState ] != null )
                cancelListState = ( CancelLoanListState )_httpContext.Session[ SessionHelper.CancelListState ];
			else
                cancelListState = new CancelLoanListState();

			UserAccount user;
            if (_httpContext.Session[SessionHelper.UserData] != null && ((UserAccount)_httpContext.Session[SessionHelper.UserData]).Username == _httpContext.User.Identity.Name)
				user = ( UserAccount )_httpContext.Session[ SessionHelper.UserData ];
			else
				user = UserAccountServiceFacade.GetUserByName( _httpContext.User.Identity.Name );

			if ( user == null )
				throw new InvalidOperationException( "User is null" );

			/* parameter processing */
			CancelAttribute newSortColumn;
			if ( !InputParameters.ContainsKey( "Column" ) )
				throw new ArgumentException( "Column value was expected!" );
			else
                newSortColumn = ( CancelAttribute )Enum.Parse( typeof( CancelAttribute ), InputParameters[ "Column" ].ToString() );

            if ( cancelListState.SortColumn == newSortColumn && cancelListState.SortDirection == "ASC" )
			{
                cancelListState.SortDirection = "DESC";
			}
			else
                cancelListState.SortDirection = "ASC";

            cancelListState.SortColumn = newSortColumn;

			/* Command processing */
            FilterViewModel userFilterViewModel = null;
            if ( ( _httpContext != null ) && ( _httpContext.Session[ SessionHelper.FilterViewModel ] != null ) )
            {
                userFilterViewModel = new FilterViewModel().FromXml( _httpContext.Session[ SessionHelper.FilterViewModel ].ToString() );

            }
            else
            {
                userFilterViewModel = new FilterViewModel();
            }

            CancelViewModel cancelViewModel = CancelDataHelper.RetrieveCancelViewModel( cancelListState,
			                                                                _httpContext.Session[ SessionHelper.UserAccountIds ] != null
			                                                                ? ( List<int> )_httpContext.Session[ SessionHelper.UserAccountIds ]
                                                                            : new List<int> { }, cancelListState.BoundDate, user.UserAccountId, userFilterViewModel.CompanyId, userFilterViewModel.ChannelId, userFilterViewModel.DivisionId, userFilterViewModel.BranchId, CommonHelper.GetSearchValue( _httpContext ) );

			_viewName = "Queues/_cancel";
            _viewModel = cancelViewModel; 

			/* Persist new state */ 
            _httpContext.Session[ SessionHelper.CancelViewModel ] = cancelViewModel.ToXml();
			_httpContext.Session[ SessionHelper.CancelListState ] = cancelListState;
		}
	}
}
