using System;
using System.Collections.Generic;
using System.Web;
using System.Web.WebPages.Html;
using MML.Common;
using MML.Common.Helpers;
using MML.Contracts;
using MML.Web.Facade;
using MML.Web.LoanCenter.ViewModels;
using System.Linq;

namespace MML.Web.LoanCenter.Commands
{
    public class UserFilterLoadBranchesCommand : ICommand
    {
        private String _viewName = String.Empty;
        private dynamic _viewModel;
        private Dictionary<string, object> _inputParameters;
        private HttpContextBase _httpContext;

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

        private static SelectListItem _genericItem = new SelectListItem()
        {
            Text = "View All",
            Value = "0"
        };

        private static SelectListItem _genericItemGuid = new SelectListItem()
        {
            Text = "View All",
            Value = Guid.Empty.ToString()
        };

        public void Execute()
        {
            UserAccount user;
            if (_httpContext.Session[SessionHelper.UserData] != null && ((UserAccount)_httpContext.Session[SessionHelper.UserData]).Username == _httpContext.User.Identity.Name)
                user = ( UserAccount )_httpContext.Session[ SessionHelper.UserData ];
            else
                user = UserAccountServiceFacade.GetUserByName( _httpContext.User.Identity.Name );

            if ( user == null )
                throw new InvalidOperationException( "User is null" );

            FilterViewModel userFilterViewModel;
            if ( ( _httpContext != null ) && ( _httpContext.Session[ SessionHelper.FilterViewModel ] != null ) )
            {
                userFilterViewModel = new FilterViewModel().FromXml( _httpContext.Session[ SessionHelper.FilterViewModel ].ToString() );
            }
            else
            {
                // possible state retrieval?
                userFilterViewModel = new FilterViewModel();
            }

            /* parameter processing */
            Int32 divisionId = 0;
            if ( !InputParameters.ContainsKey( "DivisionId" ) )
                throw new ArgumentException( "DivisionId was expected!" );

            bool regionsResetOccurred = false;

            if ( InputParameters[ "DivisionId" ].ToString() == "0" || InputParameters[ "DivisionId" ].ToString().Equals( "-1" ) )
                regionsResetOccurred = true;
            else
                divisionId = Int32.Parse( InputParameters[ "DivisionId" ].ToString() );

            // Select region
            userFilterViewModel.DivisionId = divisionId;

            userFilterViewModel.Branches.Clear();
            userFilterViewModel.Branches.Add( _genericItemGuid );
            userFilterViewModel.BranchId = Guid.Empty;

            userFilterViewModel.Users.Clear();
            userFilterViewModel.Users.Add( _genericItem );
            userFilterViewModel.UserId = 0;

            if ( !regionsResetOccurred )
            {
                /* Command processing */
                var result = UserAccountServiceFacade.GetBranches( divisionId );
                if ( result != null )
                foreach ( Branch branch in result.OrderBy(r => r.Name) )
                {
                    userFilterViewModel.Branches.Add( new SelectListItem()
                    {
                        Text = branch.Name,
                        Value = branch.BranchId.ToString(),
                        Selected = ( branch.BranchId == userFilterViewModel.BranchId )
                    } );
                }
            }

            _viewName = "_userfilter";
            _viewModel = userFilterViewModel;

            /* Persist new state */
            _httpContext.Session[ SessionHelper.FilterViewModel ] = userFilterViewModel.ToXml();

        }
    }
}