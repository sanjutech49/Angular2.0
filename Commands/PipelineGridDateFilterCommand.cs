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
    public class PipelineGridDateFilterCommand : ICommand
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

            /* State retrieval */

            PipelineListState pipelineListState ;

            if ( _httpContext.Session[ SessionHelper.PipelineListState ] != null )
                pipelineListState = ( PipelineListState )_httpContext.Session[ SessionHelper.PipelineListState ];
            else
                pipelineListState = new PipelineListState();

            UserAccount user;
            if (_httpContext.Session[SessionHelper.UserData] != null && ((UserAccount)_httpContext.Session[SessionHelper.UserData]).Username == _httpContext.User.Identity.Name)
                user = ( UserAccount )_httpContext.Session[ SessionHelper.UserData ];
            else
                user = UserAccountServiceFacade.GetUserByName(_httpContext.User.Identity.Name);

            if (user == null)
                throw new InvalidOperationException("User is null");

            /* parameter processing */
            if (!InputParameters.ContainsKey("DateFilter"))
                throw new ArgumentException("DateFilter value was expected!");

            var newDateFilterValue = ( GridDateFilter )Enum.Parse( typeof( GridDateFilter ), InputParameters[ "DateFilter" ].ToString() );

            pipelineListState.BoundDate = newDateFilterValue;
            
            // on date filter change, reset page number
            pipelineListState.CurrentPage = 1;
            
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
            PipelineViewModel pipelineViewModel = PipelineDataHelper.RetrievePipelineViewModel( pipelineListState,
                                                                                                _httpContext.Session[ SessionHelper.UserAccountIds ] != null
                                                                                                    ? ( List<int> )_httpContext.Session[ SessionHelper.UserAccountIds ]
                                                                                                    : new List<int> { }, user.UserAccountId, userFilterViewModel.CompanyId, userFilterViewModel.ChannelId, userFilterViewModel.DivisionId, userFilterViewModel.BranchId, searchValue );

            _viewName = "Queues/_pipeline";
            _viewModel = pipelineViewModel;

            /* Persist new state */
            _httpContext.Session[ SessionHelper.PipelineViewModel ] = pipelineViewModel.ToXml();
            _httpContext.Session[ SessionHelper.PipelineListState ] = pipelineListState;
        }
    }
}