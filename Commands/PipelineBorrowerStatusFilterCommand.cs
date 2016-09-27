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

    public class PipelineBorrowerStatusFilterCommand : ICommand
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
            PipelineListState pipelineListState = _httpContext.Session["PipelineListState"] != null ?
                                                   (PipelineListState) _httpContext.Session["PipelineListState"] :
                                                    new PipelineListState();
            if (!InputParameters.ContainsKey("BorroweStatusFilter"))
                throw new ArgumentException("BorroweStatusFilter was expected!");

            pipelineListState.BorrowerStatusFilter = InputParameters["BorroweStatusFilter"].ToString() == "0" ? null : InputParameters["BorroweStatusFilter"].ToString();

            UserAccount user = _httpContext.Session[SessionHelper.UserData] != null && ((UserAccount)_httpContext.Session[SessionHelper.UserData]).Username == _httpContext.User.Identity.Name ?
                                user = (UserAccount)_httpContext.Session[SessionHelper.UserData] :
                                UserAccountServiceFacade.GetUserByName(_httpContext.User.Identity.Name);

            if (user == null)
                throw new InvalidOperationException("User is null");

            // on date filter change, reset page number
            pipelineListState.CurrentPage = 1;
            FilterViewModel userFilterViewModel = null;
            if ( ( _httpContext != null ) && ( _httpContext.Session[ SessionHelper.FilterViewModel ] != null ) )
            {
                userFilterViewModel = new FilterViewModel().FromXml( _httpContext.Session[ SessionHelper.FilterViewModel ].ToString() );

            }
            else
            {
                userFilterViewModel = new FilterViewModel();
            }
            PipelineViewModel pipelineViewModel = PipelineDataHelper.RetrievePipelineViewModel(pipelineListState,
                                                          _httpContext.Session["UserAccountIds"] != null
                                                              ? (List<int>)_httpContext.Session["UserAccountIds"]
                                                              : new List<int> { }, user.UserAccountId, userFilterViewModel.CompanyId, userFilterViewModel.ChannelId, userFilterViewModel.DivisionId,userFilterViewModel.BranchId,
                                                          CommonHelper.GetSearchValue( _httpContext ));


            _viewName = "Queues/_pipeline";
            _viewModel = pipelineViewModel;

            /* Persist new state */
            _httpContext.Session["PipelineViewModel"] = pipelineViewModel.ToXml();
            _httpContext.Session["PipelineListState"] = pipelineListState;
        }
    }
}
