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
    /// <summary>
    /// Opens Pipeline tab showing Pipeline grid with state that is preserved in session
    /// </summary>
    public class OpenPipelineTabCommand : ICommand
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

            PipelineListState pipelineListState = null;

            if ( ( _httpContext != null ) && ( _httpContext.Session[ SessionHelper.PipelineListState ] != null ) )
                pipelineListState = ( PipelineListState )_httpContext.Session[ "PipelineListState" ];
            else
                pipelineListState = new PipelineListState();


            FilterViewModel userFilterViewModel = null;
            if ( ( _httpContext != null ) && ( _httpContext.Session[ "FilterViewModel" ] != null ) )
            {
                userFilterViewModel = new FilterViewModel().FromXml( _httpContext.Session[ "FilterViewModel" ].ToString() );
                userFilterViewModel.FilterContext = Helpers.Enums.FilterContextEnum.Pipeline;
            }
            else
            {
                // possible state retrieval?
                userFilterViewModel = new FilterViewModel();
                userFilterViewModel.FilterContext = Helpers.Enums.FilterContextEnum.Pipeline;
            }

            Boolean refresh = InputParameters != null && InputParameters.ContainsKey( "Refresh" ) && InputParameters[ "Refresh" ].ToString().Trim() == "true";
            // reset Page Number to 1st on Tab change
            if ( !refresh )
                pipelineListState.CurrentPage = 1;

            UserAccount user = null;
            if ( _httpContext.Session[ SessionHelper.UserData ] != null )
                user = ( UserAccount )_httpContext.Session[ SessionHelper.UserData ];
            else throw new InvalidOperationException( "UserData is null" );

            PipelineViewModel pipelineViewModel = new PipelineViewModel();

            pipelineViewModel = PipelineDataHelper.RetrievePipelineViewModel( pipelineListState,
                                                          _httpContext.Session[ "UserAccountIds" ] != null
                                                              ? ( List<int> )_httpContext.Session[ "UserAccountIds" ]
                                                              : new List<int> { }, user.UserAccountId, userFilterViewModel.CompanyId, userFilterViewModel.ChannelId, userFilterViewModel.DivisionId, userFilterViewModel.BranchId, searchValue );


            _viewName = "Queues/_pipeline";
            _viewModel = pipelineViewModel;

            /* Persist new state */
            _httpContext.Session[ SessionHelper.PipelineViewModel ] = pipelineViewModel.ToXml();
            _httpContext.Session[ SessionHelper.PipelineListState ] = pipelineListState;
            _httpContext.Session[ SessionHelper.FilterViewModel ] = userFilterViewModel.ToXml();
            _httpContext.Session[ SessionHelper.CurrentTab ] = LoanCenterTab.Pipeline;
        }

        private List<SelectListItem> PopulateProspectLoanOfficers()
        {
            if ( ( _httpContext != null ) && ( _httpContext.Session[ "FilterViewModel" ] != null ) )
            {
                var filterViewModel = new FilterViewModel().FromXml( _httpContext.Session[ "FilterViewModel" ].ToString() );
                return filterViewModel.Users.Where( item => Convert.ToInt32( item.Value ) > 0 ).ToList();
            }
            else return new List<System.Web.WebPages.Html.SelectListItem>();
        }
    }
}