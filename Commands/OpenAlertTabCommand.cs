using System;
using System.Collections.Generic;
using System.Web;
using MML.Common;
using MML.Web.LoanCenter.Helpers.Utilities;
using MML.Contracts;
using MML.Common.Helpers;
using MML.Web.LoanCenter.ViewModels;
using MML.Web.LoanCenter.Helpers.Enums;

namespace MML.Web.LoanCenter.Commands
{
	/// <summary>
	/// Opens Pipeline tab showing Pipeline grid with state that is preserved in session
	/// </summary>
	public class OpenAlertTabCommand : ICommand
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

			AlertsListState alertListState;

			if ( ( _httpContext != null ) && ( _httpContext.Session[ SessionHelper.AlertsListState ] != null ) )
				alertListState = ( AlertsListState )_httpContext.Session[ SessionHelper.AlertsListState ];
			else
				alertListState = new AlertsListState();
            
			FilterViewModel userFilterViewModel;
			if ( ( _httpContext != null ) && ( _httpContext.Session[ SessionHelper.FilterViewModel ] != null ) )
			{
				userFilterViewModel = new FilterViewModel().FromXml( _httpContext.Session[ SessionHelper.FilterViewModel ].ToString() );
				userFilterViewModel.FilterContext = FilterContextEnum.Alerts;
			}
			else
			{
				// possible state retrieval?
				userFilterViewModel = new FilterViewModel {FilterContext = FilterContextEnum.Alerts};
			}

            Boolean refresh = InputParameters != null && InputParameters.ContainsKey( "Refresh" ) && InputParameters[ "Refresh" ].ToString().Trim() == "true";
            // reset Page Number to 1st on Tab change
            if ( !refresh )
                alertListState.CurrentPage = 1;

			UserAccount user;
			if ( _httpContext!= null && _httpContext.Session[ SessionHelper.UserData ] != null )
				user = ( UserAccount )_httpContext.Session[ SessionHelper.UserData ];
			else throw new InvalidOperationException( "UserData is null" );


			var alertsViewModel = AlertsDataHelper.RetrieveAlertViewModel( alertListState,
																			_httpContext.Session[ SessionHelper.UserAccountIds ] != null
																			? ( List<int> )_httpContext.Session[ SessionHelper.UserAccountIds ]
                                                                            : new List<int> { }, alertListState.BoundDate, user.UserAccountId, userFilterViewModel.CompanyId, userFilterViewModel.ChannelId, userFilterViewModel.DivisionId, userFilterViewModel.BranchId, searchValue );

            _viewName = "Queues/_alerts";
			_viewModel = alertsViewModel;

			/* Persist new state */
			_httpContext.Session[ SessionHelper.AlertViewModel ] = alertsViewModel.ToXml();
			_httpContext.Session[ SessionHelper.AlertsListState ] = alertListState;
			_httpContext.Session[ SessionHelper.FilterViewModel ] = userFilterViewModel.ToXml();
			_httpContext.Session[ SessionHelper.CurrentTab ] = LoanCenterTab.Alerts;
		}
	}
}