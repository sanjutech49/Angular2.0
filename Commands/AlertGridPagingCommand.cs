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
	public class AlertGridPagingCommand : ICommand
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

            String searchValue = CommonHelper.GetSearchValue( _httpContext );

			AlertsListState alertListState = null;
			if ( _httpContext.Session[ SessionHelper.AlertsListState ] != null )
				alertListState = ( AlertsListState )_httpContext.Session[ SessionHelper.AlertsListState ];
			else
				alertListState = new AlertsListState();

			UserAccount user;
            if (_httpContext.Session[SessionHelper.UserData] != null && ((UserAccount)_httpContext.Session[SessionHelper.UserData]).Username == _httpContext.User.Identity.Name)
				user = ( UserAccount )_httpContext.Session[ SessionHelper.UserData ];
			else
				user = UserAccountServiceFacade.GetUserByName( _httpContext.User.Identity.Name );

			if ( user == null )
				throw new InvalidOperationException( "User is null" );

			/* parameter processing */
			var newPageNumber = 0;
			if ( !InputParameters.ContainsKey( "Page" ) )
				throw new ArgumentException( "Page number was expected!" );
			else
				newPageNumber = Convert.ToInt32( InputParameters[ "Page" ] );

			alertListState.CurrentPage = newPageNumber;

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
			var alertViewModel = AlertsDataHelper.RetrieveAlertViewModel( alertListState, 
				_httpContext.Session[ SessionHelper.UserAccountIds ] != null ? ( List<int> )_httpContext.Session[ SessionHelper.UserAccountIds ] : new List<int> {  },
                alertListState.BoundDate, user.UserAccountId, userFilterViewModel.CompanyId, userFilterViewModel.ChannelId, userFilterViewModel.DivisionId, userFilterViewModel.BranchId, searchValue );

            _viewName = "Queues/_alerts";
			_viewModel = alertViewModel;

			/* Persist new state */
			_httpContext.Session[ SessionHelper.AlertViewModel ] = alertViewModel.ToXml();
			_httpContext.Session[ SessionHelper.AlertsListState ] = alertListState;
		}
	}
}
